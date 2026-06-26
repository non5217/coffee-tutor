<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { state, setStep } from '../store.js'
import { recipes } from '../recipes.js'

const seconds = ref(0)
const isRunning = ref(false)
let timer = null

const activeRecipe = computed(() => recipes[state.drinkId])
const currentSpec = computed(() => activeRecipe.value.specs[state.servingType])

const totalDuration = computed(() => {
  return currentSpec.value ? currentSpec.value.steps.reduce((acc, step) => acc + step.duration, 0) : 30
})

const start = () => {
  if (isRunning.value) return
  isRunning.value = true
  timer = setInterval(() => {
    if (seconds.value < totalDuration.value) {
      seconds.value++
    } else {
      pause()
    }
  }, 1000)
}

const pause = () => {
  isRunning.value = false
  clearInterval(timer)
}

const reset = () => {
  pause()
  seconds.value = 0
}

onUnmounted(pause)

const formatTime = computed(() => {
  const m = Math.floor(seconds.value / 60).toString().padStart(2, '0')
  const s = (seconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const stepsTimeline = computed(() => {
  if (!currentSpec.value) return []
  let elapsed = 0
  return currentSpec.value.steps.map((step, idx) => {
    const startSec = elapsed
    const endSec = elapsed + step.duration
    elapsed += step.duration
    return {
      name: step.name,
      phase: step.phase,
      target: step.target,
      layerIndex: step.layerIndex,
      start: startSec,
      end: endSec,
      index: idx
    }
  })
})

const currentStepIndex = computed(() => {
  if (seconds.value === 0) return -1
  if (seconds.value >= totalDuration.value) return stepsTimeline.value.length
  return stepsTimeline.value.findIndex(s => seconds.value >= s.start && seconds.value < s.end)
})

const currentStepName = computed(() => {
  if (seconds.value === 0) return 'Ready to start brewing'
  if (seconds.value >= totalDuration.value) return 'Finished! Enjoy your beverage ☕'
  const step = stepsTimeline.value[currentStepIndex.value]
  return step ? step.name : ''
})

const activeStep = computed(() => {
  if (seconds.value === 0) return null
  if (seconds.value >= totalDuration.value) return { name: 'done', phase: 'done', target: 'none' }
  return stepsTimeline.value[currentStepIndex.value]
})

const activeSource = computed(() => {
  if (!activeStep.value || !isRunning.value) return 'none'
  const phase = activeStep.value.phase
  const name = activeStep.value.name.toLowerCase()

  if (phase === 'extraction') {
    return 'portafilter'
  }
  if (phase === 'blend') {
    return 'blender'
  }
  if (phase === 'mix' || phase === 'garnish' || phase === 'prep') {
    if (name.includes('กาแฟ') || name.includes('เอสเพรสโซ่') || name.includes('ช็อต') || name.includes('ราด') || name.includes('ชา')) {
      return 'shot_cup'
    }
    return 'pitcher'
  }
  return 'none'
})

const streamColor = computed(() => {
  if (!activeStep.value) return 'transparent'
  const name = activeStep.value.name.toLowerCase()
  if (name.includes('นม')) return '#fffdf5'
  if (name.includes('ชาไทย') || name.includes('ชาสีส้ม')) return '#ea580c'
  if (name.includes('มัทฉะ') || name.includes('ชาเขียว') || name.includes('มิ้นท์')) return '#15803d'
  if (name.includes('ส้ม')) return '#f97316'
  if (name.includes('โกโก้') || name.includes('ช็อคโกแลต') || name.includes('มอคค่า')) return '#3b2314'
  if (name.includes('ไซรัป') || name.includes('คาราเมล') || name.includes('น้ำเชื่อม')) return '#f59e0b'
  if (name.includes('โซดา') || name.includes('น้ำเปล่า') || name.includes('น้ำร้อน')) return '#e0f2fe'
  return '#451a03' // Coffee brown
})

// Calculate the fill percentage for each layer in the main glass cup reactively based on step progress
const fillPercentages = computed(() => {
  if (!currentSpec.value) return []
  const layers = currentSpec.value.layers
  const timeline = stepsTimeline.value
  
  if (seconds.value === 0) return layers.map(() => 0)

  return layers.map((layer, index) => {
    // Find the step in the timeline that fills this specific main cup layer index
    const stepIdx = timeline.findIndex(s => s.target === 'main' && s.layerIndex === index)
    if (stepIdx === -1) {
      // Fallback: If no step explicitly fills this layer, fill it bottom-up by default
      return seconds.value >= totalDuration.value ? layer.height : 0
    }

    if (currentStepIndex.value > stepIdx || seconds.value >= totalDuration.value) {
      return layer.height // Step completed -> Full layer
    }
    if (currentStepIndex.value === stepIdx) {
      // Step is actively running -> Grow layer proportionally
      const activeStepObj = timeline[stepIdx]
      const progress = (seconds.value - activeStepObj.start) / (activeStepObj.end - activeStepObj.start)
      return layer.height * progress
    }
    return 0 // Step not reached yet -> Empty layer
  })
})

// Animate the small shot cup filling and draining
const shotCupFill = computed(() => {
  if (!activeStep.value || !isRunning.value) return 0
  const step = activeStep.value
  const progress = (seconds.value - step.start) / (step.end - step.start)
  
  if (step.target === 'shot_cup') {
    return progress * 100 // Fills up during extraction step
  }
  
  // If active source is shot_cup (meaning it is pouring from top-right), drain it
  if (activeSource.value === 'shot_cup') {
    return (1 - progress) * 100 // Drains as it pours
  }
  
  return 0
})
</script>

<template>
  <div class="flex flex-col md:flex-row h-full w-full min-h-[600px] p-6 gap-6 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl">
    <!-- Left Panel: Timer & Instructions -->
    <div class="flex-1 flex flex-col justify-between bg-slate-950/60 rounded-2xl p-8 border border-slate-800">
      <div>
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="font-extrabold text-lg text-slate-100">{{ activeRecipe.name }}</h3>
            <span class="text-xs uppercase text-slate-500 font-bold tracking-widest">{{ state.servingType }} method</span>
          </div>
          <div v-if="state.servingType !== 'hot'" class="px-3 py-1 bg-amber-600/20 text-amber-500 text-xs font-extrabold rounded-full">
            หวาน: {{ state.sweetness === 'unsweetened' ? 'ไม่หวาน' : (state.sweetness === 'less' ? 'หวานน้อย' : 'ปกติ') }}
          </div>
        </div>

        <!-- Timer Display -->
        <div class="flex flex-col items-center my-6">
          <div class="text-[5.5rem] font-mono font-bold text-slate-200 tabular-nums leading-none tracking-tight">{{ formatTime }}</div>
          <div class="text-xs text-slate-500 font-bold mt-1">TOTAL TARGET TIME: {{ totalDuration }}s</div>
        </div>

        <!-- Steps Timeline Checklist -->
        <div class="space-y-4 my-8">
          <div 
            v-for="(step, idx) in stepsTimeline" 
            :key="idx" 
            :class="idx === currentStepIndex ? 'bg-amber-600/10 border-amber-600/40 text-slate-200 scale-[1.02]' : 'border-slate-800 text-slate-500 opacity-60'"
            class="p-4 rounded-xl border flex items-center gap-4 transition-all duration-300"
          >
            <div 
              :class="idx < currentStepIndex || seconds >= totalDuration ? 'bg-green-500 border-green-500 text-slate-950' : (idx === currentStepIndex ? 'border-amber-500 text-amber-500 animate-pulse' : 'border-slate-700')"
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black"
            >
              <span v-if="idx < currentStepIndex || seconds >= totalDuration">✓</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="flex flex-col text-left">
              <span class="font-bold text-sm leading-snug">{{ step.name }}</span>
              <span class="text-[10px] uppercase font-bold text-slate-500">{{ step.end - step.start }} seconds</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div>
        <div class="flex gap-4 mb-6">
          <button 
            v-if="!isRunning && seconds < totalDuration" 
            @click="start" 
            class="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-3.5 rounded-xl font-bold shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-1.5"
          >
            ▶ Play Timer
          </button>
          <button 
            v-if="isRunning" 
            @click="pause" 
            class="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-3.5 rounded-xl font-bold shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-1.5"
          >
            ⏸ Pause
          </button>
          <button 
            @click="reset" 
            class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3.5 rounded-xl font-bold transition-colors"
          >
            Reset
          </button>
        </div>
        
        <button 
          @click="setStep('prep')" 
          class="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white py-3 rounded-xl font-bold transition-all w-full text-center text-sm"
        >
          End Brewing Session
        </button>
      </div>
    </div>
    
    <!-- Right Panel: Live Cup/Blender filling Animation -->
    <div class="flex-1 flex flex-col justify-center items-center bg-slate-950/40 rounded-2xl border border-slate-800 p-8 min-h-[450px] relative overflow-hidden">
      <!-- Steam for Hot finished -->
      <div v-if="state.servingType === 'hot' && seconds >= totalDuration" class="absolute top-20 flex gap-1 z-10">
        <span class="w-1.5 h-10 bg-slate-400/20 rounded-full animate-bounce duration-1000"></span>
        <span class="w-1.5 h-12 bg-slate-400/10 rounded-full animate-bounce duration-700"></span>
        <span class="w-1.5 h-10 bg-slate-400/20 rounded-full animate-bounce duration-900"></span>
      </div>

      <!-- Current Step Caption -->
      <div class="text-sm font-bold text-center mb-6 text-slate-300 border-b border-slate-800/60 pb-3 w-full max-w-xs capitalize tracking-wide">
        {{ currentStepName }}
      </div>

      <!-- Animation Area -->
      <div class="relative w-full h-80 flex flex-col items-center justify-end">
        
        <!-- ==================== ANIMATED POURING SOURCES ==================== -->

        <!-- 1. Centered Portafilter -->
        <transition name="fade">
          <div v-if="activeSource === 'portafilter'" class="absolute top-2 flex flex-col items-center z-20">
            <div class="w-24 h-6 bg-slate-700 rounded-b-xl shadow-md border-b-2 border-slate-600"></div>
            <div class="w-3 h-2 bg-slate-600 rounded-b-sm"></div>
          </div>
        </transition>

        <!-- 2. Pouring Pitcher (Spout + Body + Handle) -->
        <transition name="slide-in-pitcher">
          <div v-if="activeSource === 'pitcher'" class="absolute top-0 right-12 flex flex-col items-end z-20 origin-bottom-left rotate-[-35deg] transition-all duration-500">
            <div class="relative w-16 h-18 bg-slate-300 rounded-b-xl border-l border-white shadow-lg flex items-center justify-center">
              <!-- Pitcher handle -->
              <div class="absolute -left-3 top-4 w-4 h-10 border-4 border-slate-300 rounded-l-full"></div>
              <!-- Pitcher spout -->
              <div class="absolute -right-2 top-0 w-3 h-3 bg-slate-300 transform rotate-45 border-t border-r border-slate-100"></div>
              <span class="text-[8px] text-slate-700 font-extrabold uppercase scale-90">Milk/Mix</span>
            </div>
          </div>
        </transition>

        <!-- 3. Pouring Shot Cup (Tilted at top-right) -->
        <transition name="slide-in-shot">
          <div v-if="activeSource === 'shot_cup'" class="absolute top-2 right-16 flex flex-col items-end z-20 origin-bottom-left rotate-[-35deg] transition-all duration-500">
            <div class="relative w-12 h-12 bg-sky-200/40 border border-sky-100/50 rounded-b-md shadow-md flex items-center justify-center">
              <!-- Espresso inside pouring shot cup draining -->
              <div class="absolute bottom-0 w-full bg-amber-900/80 rounded-b-sm transition-all duration-300" :style="{ height: shotCupFill + '%' }"></div>
              <!-- Pour lip -->
              <div class="absolute -right-1 top-0 w-2 h-2 bg-sky-200/40 transform rotate-45 border-t border-r border-sky-100/50"></div>
            </div>
          </div>
        </transition>

        <!-- 4. Receiving Shot Cup (Centered under portafilter during extraction steps) -->
        <transition name="fade">
          <div v-if="activeStep?.target === 'shot_cup'" class="absolute top-20 w-16 h-16 border-2 border-slate-500/80 bg-slate-950/20 rounded-b-lg relative overflow-hidden flex flex-col justify-end shadow-md z-15">
            <!-- Shot cup filling up -->
            <div 
              class="w-full bg-amber-900/80 transition-all duration-1000 ease-out"
              :style="{ height: shotCupFill + '%' }"
            ></div>
          </div>
        </transition>

        <!-- ==================== FLOWING LIQUID STREAMS ==================== -->

        <!-- Vertical Stream (Portafilter) -->
        <div 
          v-if="activeSource === 'portafilter'" 
          class="absolute top-10 left-1/2 -translate-x-1/2 w-1.5 h-36 z-10 pointer-events-none transition-all duration-300"
          :style="{ backgroundColor: streamColor, height: activeStep?.target === 'shot_cup' ? '40px' : '144px' }"
        ></div>

        <!-- Angled Stream (Pitcher or Shot Cup pouring from top-right) -->
        <div 
          v-if="activeSource === 'pitcher' || activeSource === 'shot_cup'" 
          class="absolute top-14 right-20 w-1.5 h-32 z-10 pointer-events-none origin-top-right rotate-[-32deg] transition-all duration-300"
          :style="{ backgroundColor: streamColor }"
        ></div>

        <!-- ==================== THE RECIPIENT CONTAINER ==================== -->

        <!-- Blender Jar (if phase is blend) -->
        <div 
          v-if="state.servingType === 'blended' && activeStep?.phase === 'blend'"
          :class="{ 'animate-shake': isRunning }"
          class="w-36 h-48 border-4 border-slate-400 bg-slate-900/20 rounded-b-lg relative overflow-hidden flex flex-col justify-end shadow-lg transition-transform duration-100"
        >
          <!-- Lid -->
          <div class="absolute top-0 w-full h-4 bg-slate-800"></div>
          <!-- Blending mixture -->
          <div class="w-full bg-amber-700/80 transition-all duration-1000 flex items-center justify-center animate-pulse" :style="{ height: (seconds / totalDuration) * 100 + '%' }">
            <span class="text-[9px] font-black text-white/40 tracking-widest">BLENDING...</span>
          </div>
        </div>

        <!-- Main Glass Cup (for normal hot/cold brewing) -->
        <div 
          v-else
          class="w-36 h-44 border-4 border-slate-500 rounded-b-2xl relative overflow-hidden bg-slate-950/80 shadow-2xl z-0 flex flex-col justify-end"
        >
          <!-- Multi-ingredients filling -->
          <div 
            v-for="(layer, idx) in currentSpec?.layers.slice().reverse() || []" 
            :key="idx"
            :style="{ 
              height: fillPercentages[currentSpec.layers.length - 1 - idx] + '%', 
              backgroundColor: layer.color 
            }"
            class="w-full relative transition-all duration-1000 ease-out flex items-center justify-center border-t border-white/5 first:border-t-0"
          >
            <span v-if="fillPercentages[currentSpec.layers.length - 1 - idx] > 15" class="absolute text-[8px] font-black text-white/50 tracking-wider">
              {{ layer.name }}
            </span>
          </div>

          <!-- Ice Cubes floating up as drink fills -->
          <div 
            v-if="state.servingType === 'cold' && seconds > 2" 
            class="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none opacity-40 transition-all duration-[30s]"
            :style="{ transform: `translateY(${-15 + (1 - (seconds / totalDuration)) * 40}px)` }"
          >
            <div class="w-6 h-6 bg-sky-200 rounded shadow rotate-45 animate-pulse"></div>
            <div class="w-6 h-6 bg-sky-200 rounded shadow -rotate-12 animate-pulse"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-in-pitcher-enter-active, .slide-in-pitcher-leave-active {
  transition: all 0.5s ease-out;
}
.slide-in-pitcher-enter-from, .slide-in-pitcher-leave-to {
  transform: translateX(50px) translateY(-50px) rotate(0deg);
  opacity: 0;
}

.slide-in-shot-enter-active, .slide-in-shot-leave-active {
  transition: all 0.5s ease-out;
}
.slide-in-shot-enter-from, .slide-in-shot-leave-to {
  transform: translateX(50px) translateY(-50px) rotate(0deg);
  opacity: 0;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(0px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(2px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(2px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.animate-shake {
  animation: shake 0.15s infinite;
}
</style>
