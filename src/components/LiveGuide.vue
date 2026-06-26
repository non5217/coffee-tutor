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
  return currentSpec.value.steps.map(step => {
    const startSec = elapsed
    const endSec = elapsed + step.duration
    elapsed += step.duration
    return {
      name: step.name,
      phase: step.phase,
      start: startSec,
      end: endSec
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

const fillPercentages = computed(() => {
  if (!currentSpec.value) return []
  const layers = currentSpec.value.layers
  if (seconds.value === 0) {
    return layers.map(() => 0)
  }
  
  if (seconds.value >= totalDuration.value) {
    return layers.map(l => l.height)
  }

  // Calculate scaling coefficient based on time
  const currentRatio = seconds.value / totalDuration.value
  // Fill layers bottom-up sequentially based on extraction phase ratio
  let remainingFill = currentRatio * 100
  return layers.map(layer => {
    const fill = Math.min(layer.height, remainingFill)
    remainingFill = Math.max(0, remainingFill - layer.height)
    return fill
  })
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
            <div class="flex flex-col">
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
    
    <!-- Right Panel: Live Cup filling Animation -->
    <div class="flex-1 flex flex-col justify-center items-center bg-slate-950/40 rounded-2xl border border-slate-800 p-8 min-h-[300px] relative overflow-hidden">
      <!-- Steam for Hot -->
      <div v-if="state.servingType === 'hot' && seconds > 0 && seconds < totalDuration" class="absolute top-12 flex gap-1 z-10">
        <span class="w-1.5 h-10 bg-slate-400/20 rounded-full animate-bounce duration-1000"></span>
        <span class="w-1.5 h-12 bg-slate-400/10 rounded-full animate-bounce duration-700"></span>
        <span class="w-1.5 h-10 bg-slate-400/20 rounded-full animate-bounce duration-900"></span>
      </div>

      <!-- Current Step Caption -->
      <div class="text-sm font-bold text-center mb-10 text-slate-300 border-b border-slate-800/60 pb-3 w-full max-w-xs capitalize tracking-wide">
        {{ currentStepName }}
      </div>

      <!-- Brewing Cup Container -->
      <div class="flex flex-col items-center">
        <!-- Portafilter / Brewer nozzle -->
        <div class="w-24 h-8 bg-slate-800 rounded-b-xl relative z-20 shadow-md">
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-700 rounded-b-md"></div>
        </div>

        <!-- Flowing liquid stream (only shown during active phases) -->
        <div class="relative w-full flex justify-center h-28 z-10 pointer-events-none">
          <div 
            v-if="isRunning && seconds > 0 && seconds < totalDuration"
            class="w-1.5 h-full bg-amber-900/80 animate-pulse transition-all duration-300"
            :style="{ 
              backgroundColor: currentSpec?.layers[currentSpec.layers.length - 1 - Math.max(0, currentStepIndex)]?.color || '#451a03' 
            }"
          ></div>
        </div>

        <!-- Glass Cup -->
        <div class="w-36 h-44 border-4 border-slate-500 rounded-b-2xl relative overflow-hidden bg-slate-950/80 shadow-2xl z-0 flex flex-col justify-end">
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
