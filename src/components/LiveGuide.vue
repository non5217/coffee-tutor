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

const servingTypeLabel = computed(() => {
  const labels = { hot: 'ร้อน', cold: 'เย็น', blended: 'ปั่น' }
  return labels[state.servingType] || state.servingType
})

const sweetnessLabel = computed(() => {
  const labels = { unsweetened: 'ไม่หวาน', less: 'หวานน้อย', normal: 'ปกติ' }
  return labels[state.sweetness] || ''
})

const phaseLabels = {
  extraction: 'สกัด',
  mix: 'ผสม',
  garnish: 'ตกแต่ง',
  blend: 'ปั่น',
  prep: 'เตรียม',
  done: 'เสร็จแล้ว',
}

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

const progressPct = computed(() => {
  if (totalDuration.value === 0) return 0
  return Math.min((seconds.value / totalDuration.value) * 100, 100)
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
  if (seconds.value === 0) return 'พร้อมเริ่มชง'
  if (seconds.value >= totalDuration.value) return 'เสร็จแล้ว! ดื่มได้เลย ☕'
  const step = stepsTimeline.value[currentStepIndex.value]
  return step ? step.name : ''
})

const activeStep = computed(() => {
  if (seconds.value === 0) return null
  if (seconds.value >= totalDuration.value) return { name: 'done', phase: 'done', target: 'none' }
  return stepsTimeline.value[currentStepIndex.value]
})

const currentPhaseLabel = computed(() => {
  if (!activeStep.value) return 'เตรียม'
  return phaseLabels[activeStep.value.phase] || 'ฝึก'
})

const remainingSeconds = computed(() => Math.max(totalDuration.value - seconds.value, 0))

const coachNote = computed(() => {
  if (seconds.value === 0) {
    return 'กดเริ่มจับเวลาเมื่ออุปกรณ์พร้อม แล้วมองลำดับ step เพื่อเทตามจังหวะจริง'
  }

  if (seconds.value >= totalDuration.value) {
    return 'เซสชั่นนี้จบแล้ว ลองรีเซ็ตเพื่อฝึกซ้ำ หรือกลับไปปรับสูตรและความหวานเพิ่มเติม'
  }

  switch (activeStep.value?.phase) {
    case 'extraction':
      return 'โฟกัสเรื่องปริมาณช็อต เวลาสกัด และคุม body ของกาแฟให้สม่ำเสมอ'
    case 'blend':
      return 'ปั่นให้ได้ texture เนียนละเอียดและคงรูปพอสำหรับการเสิร์ฟ'
    case 'garnish':
      return 'ช่วงนี้คือ finishing touch ให้จัดชั้นและหน้าตาแก้วให้น่าดื่มที่สุด'
    case 'mix':
      return 'เทช้าและคุมมุมแก้วให้ดี เพื่อเก็บเส้นแบ่งชั้นของเครื่องดื่ม'
    default:
      return 'จัดตำแหน่งแก้วและวัตถุดิบให้อยู่ในมุมหยิบใช้งานสะดวก'
  }
})

const activeSource = computed(() => {
  if (!activeStep.value || !isRunning.value) return 'none'
  const phase = activeStep.value.phase
  const name = activeStep.value.name.toLowerCase()

  if (phase === 'extraction') return 'portafilter'
  if (phase === 'blend') return 'blender'
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
  if (name.includes('มัทฉะ') || name.includes('ชาเขียว') || name.includes('มิ้นท์')) return 'var(--layer-matcha)'
  if (name.includes('ชาไทย') || name.includes('ชาสีส้ม') || name.includes('ชา')) return 'var(--layer-thai-tea)'
  if (name.includes('โกโก้') || name.includes('ช็อคโกแลต') || name.includes('มอคค่า')) return 'var(--layer-cocoa)'
  if (name.includes('ส้ม')) return 'var(--layer-orange)'
  if (name.includes('กาแฟ') || name.includes('เอสเพรสโซ่') || name.includes('ช็อต')) {
    if (name.includes('นม')) return 'var(--layer-blended)'
    return 'var(--layer-espresso)'
  }
  if (name.includes('นม')) return 'var(--layer-milk)'
  if (name.includes('ไซรัป') || name.includes('คาราเมล') || name.includes('น้ำเชื่อม')) return 'var(--layer-caramel)'
  if (name.includes('โซดา') || name.includes('น้ำเปล่า') || name.includes('น้ำร้อน')) return 'var(--layer-soda)'
  return 'var(--layer-espresso)'
})

// Fill percentages for each layer in the main cup
const fillPercentages = computed(() => {
  if (!currentSpec.value) return []
  const layers = currentSpec.value.layers
  const timeline = stepsTimeline.value

  if (seconds.value === 0) return layers.map(() => 0)

  return layers.map((layer, index) => {
    const stepIdx = timeline.findIndex(s => s.target === 'main' && s.layerIndex === index)
    if (stepIdx === -1) {
      return seconds.value >= totalDuration.value ? layer.height : 0
    }
    if (currentStepIndex.value > stepIdx || seconds.value >= totalDuration.value) {
      return layer.height
    }
    if (currentStepIndex.value === stepIdx) {
      const activeStepObj = timeline[stepIdx]
      const progress = (seconds.value - activeStepObj.start) / (activeStepObj.end - activeStepObj.start)
      return layer.height * progress
    }
    return 0
  })
})

// Shot cup fill animation
const shotCupFill = computed(() => {
  if (!activeStep.value || !isRunning.value) return 0
  const step = activeStep.value
  const progress = (seconds.value - step.start) / (step.end - step.start)

  if (step.target === 'shot_cup') {
    return progress * 100
  }
  if (activeSource.value === 'shot_cup') {
    return (1 - progress) * 100
  }
  return 0
})

// Map hex to semantic for cup visual
const layerColors = {
  '#451a03': 'var(--layer-espresso)',
  '#fef3c7': 'var(--layer-milk)',
  '#ffffff': 'var(--layer-foam)',
  '#f59e0b': 'var(--layer-caramel)',
  '#d97706': 'var(--layer-caramel)',
  '#3b2314': 'var(--layer-cocoa)',
  '#15803d': 'var(--layer-matcha)',
  '#ea580c': 'var(--layer-thai-tea)',
  '#f97316': 'var(--layer-orange)',
  '#10b981': 'var(--layer-mint)',
  '#e0f2fe': 'var(--layer-soda)',
  '#fffdf5': 'var(--layer-milk)',
  '#78350f': 'var(--layer-blended)',
  '#5c3a21': 'var(--layer-blended)',
  '#854d0e': 'var(--layer-blended)',
  '#b45309': 'var(--layer-blended)',
}
const resolveColor = (hex) => layerColors[hex] || hex
</script>

<template>
  <div class="grid min-h-[640px] gap-5 p-5 sm:p-6 xl:grid-cols-[0.92fr_1.08fr]">
    <section class="flex flex-col justify-between rounded-[1.9rem] border border-white/70 bg-white/90 p-5 shadow-sm sm:p-6">
      <div>
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <span class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Step 3
            </span>
            <h3 class="mt-3 text-2xl font-black tracking-tight text-ink">{{ activeRecipe.name }}</h3>
            <span class="text-sm font-medium text-ink-muted">{{ servingTypeLabel }}</span>
          </div>
          <div
            v-if="state.servingType !== 'hot'"
            class="rounded-full border border-accent/20 bg-accent-subtle px-3 py-1 text-xs font-bold text-accent"
          >
            {{ sweetnessLabel }}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Timer</div>
            <div class="mt-1 font-mono text-2xl font-bold text-ink">{{ formatTime }}</div>
          </div>
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Remaining</div>
            <div class="mt-1 text-2xl font-black text-ink">{{ remainingSeconds }}</div>
            <div class="text-xs text-ink-secondary">วินาที</div>
          </div>
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Current Phase</div>
            <div class="mt-1 text-lg font-black text-ink">{{ currentPhaseLabel }}</div>
            <div class="text-xs text-ink-secondary">progress {{ Math.round(progressPct) }}%</div>
          </div>
        </div>

        <div class="my-5 rounded-[1.5rem] border border-primary/15 bg-[linear-gradient(180deg,rgba(255,244,226,0.95),rgba(255,250,244,0.95))] px-5 py-5">
          <div class="flex flex-col items-center text-center">
            <div class="font-mono text-[4rem] font-bold leading-none tracking-tight text-ink sm:text-[4.75rem]">
              {{ formatTime }}
            </div>
            <div class="mt-2 text-sm font-semibold text-ink">{{ currentStepName }}</div>
            <div class="mt-1 text-xs text-ink-muted">เป้าหมายรวม {{ totalDuration }} วินาที</div>
          </div>

          <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-border/70">
            <div
              class="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
              :style="{ width: progressPct + '%' }"
            ></div>
          </div>
        </div>

        <div class="rounded-[1.5rem] border border-border/75 bg-white/80 p-5">
          <div class="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">Barista Coach</div>
          <p class="text-sm leading-7 text-ink-secondary">{{ coachNote }}</p>
        </div>

        <div class="my-6 space-y-3">
          <div
            v-for="(step, idx) in stepsTimeline"
            :key="idx"
            :class="[
              'flex items-center gap-3 rounded-[1.25rem] border p-3.5 transition-all duration-normal',
              idx === currentStepIndex
                ? 'scale-[1.01] border-primary bg-primary-subtle shadow-sm'
                : idx < currentStepIndex || seconds >= totalDuration
                  ? 'border-success/30 bg-success-subtle opacity-80'
                  : 'border-border bg-white/70 opacity-60'
            ]"
          >
            <div
              :class="[
                'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold',
                idx < currentStepIndex || seconds >= totalDuration
                  ? 'bg-success text-ink-inverse'
                  : idx === currentStepIndex
                    ? 'border-2 border-primary text-primary animate-pulse-soft'
                    : 'border-2 border-border text-ink-muted'
              ]"
            >
              <span v-if="idx < currentStepIndex || seconds >= totalDuration">✓</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span
                :class="[
                  'font-semibold text-sm leading-snug truncate',
                  idx === currentStepIndex ? 'text-ink' : (idx < currentStepIndex || seconds >= totalDuration ? 'text-success' : 'text-ink-muted')
                ]"
              >
                {{ step.name }}
              </span>
              <span class="text-[10px] font-medium text-ink-muted">{{ phaseLabels[step.phase] || step.phase }} · {{ step.end - step.start }} วินาที</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-4 flex gap-3">
          <button
            v-if="!isRunning && seconds < totalDuration"
            type="button"
            @click="start"
            class="flex flex-1 items-center justify-center gap-1.5 rounded-[1.25rem] bg-primary py-3 text-ink-inverse shadow-[0_18px_40px_oklch(0.62_0.14_64_/_0.22)] transition-all duration-fast hover:-translate-y-0.5 hover:bg-primary-hover active:bg-primary-pressed"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2v12l10-6z"/></svg>
            เริ่มจับเวลา
          </button>
          <button
            v-if="isRunning"
            type="button"
            @click="pause"
            class="flex flex-1 items-center justify-center gap-1.5 rounded-[1.25rem] bg-warning py-3 text-ink-inverse shadow-md transition-all duration-fast hover:bg-warning/90"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx="1"/><rect x="9" y="2" width="4" height="12" rx="1"/></svg>
            พัก
          </button>
          <button
            type="button"
            @click="reset"
            class="rounded-[1.25rem] border border-border bg-white px-4 py-3 font-semibold text-ink-secondary transition-all duration-fast hover:border-border-strong hover:text-ink"
          >
            รีเซ็ต
          </button>
        </div>

        <button
          type="button"
          @click="setStep('prep')"
          class="w-full rounded-[1.25rem] border border-border bg-transparent py-2.5 text-sm font-medium text-ink-muted transition-all duration-fast hover:border-border-strong hover:text-ink-secondary"
        >
          ออกจากเซสชั่น
        </button>
      </div>
    </section>

    <section class="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,240,231,0.96))] p-6 shadow-sm">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute inset-x-10 top-8 h-40 rounded-full bg-primary/12 blur-3xl"></div>
        <div class="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-secondary/12 blur-3xl"></div>
      </div>

      <div v-if="state.servingType === 'hot' && seconds >= totalDuration" class="absolute top-16 z-10 flex gap-2">
        <span class="h-10 w-1.5 rounded-full bg-primary/15 animate-steam" style="animation-delay: 0s"></span>
        <span class="h-12 w-1.5 rounded-full bg-primary/10 animate-steam" style="animation-delay: 0.5s"></span>
        <span class="h-10 w-1.5 rounded-full bg-primary/15 animate-steam" style="animation-delay: 1s"></span>
      </div>

      <div class="relative z-10 mb-4 flex w-full max-w-xl flex-wrap items-center justify-center gap-2">
        <span class="rounded-full border border-border/80 bg-white/85 px-3 py-1 text-xs font-semibold text-ink-secondary">
          {{ currentPhaseLabel }}
        </span>
        <span class="rounded-full border border-border/80 bg-white/85 px-3 py-1 text-xs font-semibold text-ink-secondary">
          {{ Math.round(progressPct) }}% complete
        </span>
      </div>

      <div class="relative z-10 mb-5 w-full max-w-xs border-b border-border pb-3 text-center text-sm font-semibold text-ink-secondary">
        {{ currentStepName }}
      </div>

      <div class="relative z-10 flex h-80 w-full flex-col items-center justify-end">

        <transition name="fade-source">
          <div v-if="activeSource === 'portafilter'" class="absolute top-2 flex flex-col items-center z-20">
            <div class="w-24 h-6 bg-ink-secondary/20 rounded-b-xl shadow-md border-b-2 border-ink-muted/30"></div>
            <div class="w-3 h-2 bg-ink-muted/30 rounded-b-sm"></div>
          </div>
        </transition>

        <transition name="slide-source">
          <div v-if="activeSource === 'pitcher'" class="absolute top-0 right-10 flex flex-col items-end z-20 origin-bottom-left rotate-[-35deg] transition-all duration-500">
            <div class="relative w-16 h-20 bg-ink-muted/15 rounded-b-xl border-l border-ink-inverse/30 shadow-md flex items-center justify-center">
              <div class="absolute -left-3 top-5 w-4 h-10 border-4 border-ink-muted/15 rounded-l-full"></div>
              <div class="absolute -right-2 top-0 w-3 h-3 bg-ink-muted/15 transform rotate-45 border-t border-r border-ink-inverse/20"></div>
              <span class="text-[8px] text-ink-secondary font-bold uppercase scale-90">นม/ผสม</span>
            </div>
          </div>
        </transition>

        <transition name="slide-source">
          <div v-if="activeSource === 'shot_cup'" class="absolute top-2 right-14 flex flex-col items-end z-20 origin-bottom-left rotate-[-35deg] transition-all duration-500">
            <div class="relative w-12 h-12 bg-sky-100/30 border border-sky-200/30 rounded-b-md shadow-md flex items-center justify-center overflow-hidden">
              <div class="absolute bottom-0 w-full transition-all duration-300" :style="{ height: shotCupFill + '%', backgroundColor: streamColor }"></div>
              <div class="absolute -right-1 top-0 w-2 h-2 bg-sky-100/30 transform rotate-45 border-t border-r border-sky-200/30"></div>
            </div>
          </div>
        </transition>

        <transition name="fade-source">
          <div v-if="activeStep?.target === 'shot_cup'" class="absolute top-20 w-16 h-16 border-2 border-border rounded-b-lg overflow-hidden flex flex-col justify-end shadow-md z-20 bg-surface">
            <div
              class="w-full transition-all duration-1000 ease-out"
              :style="{ height: shotCupFill + '%', backgroundColor: streamColor }"
            ></div>
          </div>
        </transition>

        <div
          v-if="activeSource === 'portafilter'"
          class="absolute top-10 left-1/2 -translate-x-1/2 w-1.5 z-10 pointer-events-none transition-all duration-300 animate-pour"
          :style="{ backgroundColor: streamColor, height: activeStep?.target === 'shot_cup' ? '40px' : '144px' }"
        ></div>

        <div
          v-if="activeSource === 'pitcher' || activeSource === 'shot_cup'"
          class="absolute right-[4.5rem] top-14 z-10 h-32 w-1.5 origin-top-right rotate-[-32deg] pointer-events-none animate-pour"
          :style="{ backgroundColor: streamColor }"
        ></div>

        <div
          v-if="state.servingType === 'blended' && activeStep?.phase === 'blend'"
          :class="{ 'animate-blender-shake': isRunning }"
          class="w-36 h-48 border-4 border-border-strong bg-surface rounded-b-lg relative overflow-hidden flex flex-col justify-end shadow-lg transition-transform duration-100"
        >
          <div class="absolute top-0 w-full h-4 bg-ink/10 rounded-t-sm"></div>
          <div
            class="w-full bg-primary/80 transition-all duration-1000 flex items-center justify-center"
            :style="{ height: (seconds / totalDuration) * 100 + '%' }"
          >
            <span class="text-[9px] font-black text-ink-inverse/60 tracking-widest animate-pulse-soft">กำลังปั่น...</span>
          </div>
        </div>

        <div
          v-else
          class="w-36 h-44 border-4 border-border-strong rounded-b-2xl relative overflow-hidden bg-surface shadow-lg flex flex-col justify-end"
        >
          <!-- Layer fills -->
          <div
            v-for="(layer, idx) in currentSpec?.layers.slice().reverse() || []"
            :key="idx"
            :style="{
              height: fillPercentages[currentSpec.layers.length - 1 - idx] + '%',
              backgroundColor: resolveColor(layer.color)
            }"
            class="w-full relative transition-all duration-1000 ease-out flex items-center justify-center border-t border-ink/5 first:border-t-0"
          >
            <span
              v-if="fillPercentages[currentSpec.layers.length - 1 - idx] > 15"
              class="absolute text-[8px] font-bold text-ink-inverse/60 tracking-wider"
            >
              {{ layer.name }}
            </span>
          </div>

          <!-- Ice Cubes for cold -->
          <div
            v-if="state.servingType === 'cold' && seconds > 2"
            class="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none opacity-40 transition-all duration-[30s]"
            :style="{ transform: `translateY(${-15 + (1 - (seconds / Math.max(totalDuration, 1))) * 40}px)` }"
          >
            <div class="w-6 h-6 bg-sky-100/70 border border-sky-200/50 rounded-md rotate-45 shadow-sm"></div>
            <div class="w-6 h-6 bg-sky-100/70 border border-sky-200/50 rounded-md -rotate-12 shadow-sm"></div>
          </div>
        </div>
      </div>

      <div class="relative z-10 mt-6 w-full max-w-lg rounded-[1.5rem] border border-border/80 bg-white/80 px-4 py-4">
        <div class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">Practice Tips</div>
        <div class="mt-2 grid gap-2 text-sm text-ink-secondary sm:grid-cols-3">
          <div class="rounded-[1rem] bg-surface px-3 py-3">มองภาพเลเยอร์ก่อนเริ่มเททุกครั้ง</div>
          <div class="rounded-[1rem] bg-surface px-3 py-3">คุมจังหวะตามเวลาเพื่อให้ workflow สมจริง</div>
          <div class="rounded-[1rem] bg-surface px-3 py-3">จบแล้วรีเซ็ตเพื่อซ้อมซ้ำให้มือลื่นขึ้น</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Source transitions */
.fade-source-enter-active,
.fade-source-leave-active {
  transition: opacity 0.4s var(--ease-out-quint);
}
.fade-source-enter-from,
.fade-source-leave-to {
  opacity: 0;
}

.slide-source-enter-active,
.slide-source-leave-active {
  transition: all 0.5s var(--ease-out-quint);
}
.slide-source-enter-from,
.slide-source-leave-to {
  transform: translateX(40px) translateY(-40px) rotate(0deg);
  opacity: 0;
}

@keyframes pour-stream {
  0% { opacity: 0.7; }
  100% { opacity: 0.35; }
}

@keyframes blender-shake {
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(-1px, -1px) rotate(-0.5deg); }
  20% { transform: translate(1px, -2px) rotate(0.5deg); }
  30% { transform: translate(-2px, 0) rotate(-0.5deg); }
  40% { transform: translate(2px, -1px) rotate(0.5deg); }
  50% { transform: translate(-1px, 1px) rotate(-0.3deg); }
  60% { transform: translate(1px, -1px) rotate(0.3deg); }
  70% { transform: translate(-2px, 0) rotate(-0.5deg); }
  80% { transform: translate(2px, -1px) rotate(0.5deg); }
  90% { transform: translate(-1px, -2px) rotate(-0.3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.animate-pour {
  animation: pour-stream 0.8s var(--ease-out-quint) infinite alternate;
}

.animate-blender-shake {
  animation: blender-shake 0.12s infinite;
}

.animate-pulse-soft {
  animation: pulse-soft 2s var(--ease-in-out-quint) infinite;
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

@keyframes steam-rise {
  0% { opacity: 0.5; transform: translateY(0) scaleX(1); }
  50% { opacity: 0.25; transform: translateY(-12px) scaleX(1.2); }
  100% { opacity: 0; transform: translateY(-24px) scaleX(0.8); }
}

.animate-steam {
  animation: steam-rise 2s var(--ease-out-quint) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-pour,
  .animate-blender-shake,
  .animate-pulse-soft,
  .animate-steam {
    animation: none !important;
  }
  .fade-source-enter-active,
  .fade-source-leave-active,
  .slide-source-enter-active,
  .slide-source-leave-active {
    transition: none !important;
  }
  .fade-source-enter-from,
  .fade-source-leave-to,
  .slide-source-enter-from,
  .slide-source-leave-to {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
