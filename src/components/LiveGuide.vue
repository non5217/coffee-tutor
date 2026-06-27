<script setup>
import { ref, computed, watch } from 'vue'
import { state, setStep } from '../store.js'
import { recipes } from '../recipes.js'

const activeRecipe = computed(() => recipes[state.drinkId])
const currentSpec = computed(() => activeRecipe.value.specs[state.servingType])

const servingTypeLabel = computed(() => {
  const labels = { hot: 'ร้อน', cold: 'เย็น', blended: 'ปั่น' }
  return labels[state.servingType] || state.servingType
})

const sweetnessLabel = computed(() => {
  const labels = { unsweetened: 'ไม่หวาน', less: 'หวานน้อย', normal: 'หวานปกติ' }
  return labels[state.sweetness] || ''
})

const steps = computed(() => currentSpec.value?.steps || [])
const totalSteps = computed(() => steps.value.length)

// Track which step indices are completed (array of booleans)
const completed = ref([])

const resetCompleted = () => {
  completed.value = Array(steps.value.length).fill(false)
}

// Reset whenever recipe, serving type, or sweetness changes
watch(
  [() => state.drinkId, () => state.servingType, () => state.sweetness],
  resetCompleted,
  { immediate: true }
)

const currentStepIndex = computed(() => {
  // Find first incomplete step
  const idx = completed.value.findIndex((done) => !done)
  return idx === -1 ? totalSteps.value : idx
})

const allDone = computed(() => {
  return totalSteps.value > 0 && completed.value.every((done) => done)
})

const progressPct = computed(() => {
  if (totalSteps.value === 0) return 0
  const doneCount = completed.value.filter(Boolean).length
  return Math.round((doneCount / totalSteps.value) * 100)
})

const toggleStep = (idx) => {
  if (idx < 0 || idx >= totalSteps.value) return
  // Can only toggle if it's the current step (first incomplete) or already completed
  const firstIncomplete = completed.value.findIndex((done) => !done)
  if (idx === firstIncomplete || completed.value[idx] === true) {
    const updated = [...completed.value]
    updated[idx] = !updated[idx]
    completed.value = updated
  }
}

const resetAll = () => {
  resetCompleted()
}

// Phase labels
const phaseLabels = {
  extraction: 'สกัด',
  mix: 'ผสม',
  garnish: 'ตกแต่ง',
  blend: 'ปั่น',
  prep: 'เตรียม',
  done: 'เสร็จแล้ว',
}

// Current step name for the status display
const currentStepName = computed(() => {
  const idx = currentStepIndex.value
  if (allDone.value) return 'เสร็จแล้ว! ดื่มได้เลย ☕'
  if (idx < steps.value.length) return steps.value[idx].name
  return 'พร้อมเริ่มทำทีละขั้นตอน'
})

// Count remaining
const remainingCount = computed(() => {
  const done = completed.value.filter(Boolean).length
  return Math.max(totalSteps.value - done, 0)
})

// Layer fill percentages — show layer as full if its step is complete
const fillPercentages = computed(() => {
  if (!currentSpec.value) return []
  const layers = currentSpec.value.layers
  return layers.map((layer, index) => {
    // Find the step that fills this layer (target: main, matching layerIndex)
    const stepIdx = steps.value.findIndex(
      (s, i) => s.target === 'main' && s.layerIndex === index
    )
    if (stepIdx === -1) {
      // No explicit step fills this layer, fill bottom-up
      // Fill proportionally based on how many steps are done
      const doneCount = completed.value.filter(Boolean).length
      return doneCount >= totalSteps.value ? layer.height : 0
    }
    if (completed.value[stepIdx]) {
      return layer.height // Step done → layer full
    }
    // If this is the current step (first incomplete), maybe show half? No — keep at 0 until tapped.
    return 0
  })
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

// Current phase label (from the current step)
const currentPhaseLabel = computed(() => {
  const idx = currentStepIndex.value
  if (allDone.value) return 'เสร็จแล้ว'
  if (idx < steps.value.length) {
    return phaseLabels[steps.value[idx].phase] || 'ฝึก'
  }
  return 'พร้อมเริ่ม'
})

const coachNote = computed(() => {
  if (allDone.value) {
    return 'ทำครบทุกขั้นตอนแล้ว! ลองดูผลลัพธ์ในแก้ว หรือกดทำใหม่อีกครั้งเพื่อซ้อมเพิ่ม'
  }
  const idx = currentStepIndex.value
  if (idx >= steps.value.length) return 'กดที่ขั้นตอนแรกเพื่อเริ่มต้น'
  const step = steps.value[idx]
  switch (step.phase) {
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
</script>

<template>
  <div class="grid min-h-[640px] gap-5 p-5 sm:p-6 xl:grid-cols-[1fr_0.95fr]">
    <!-- Left: Checklist -->
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
            class="rounded-full border border-secondary/20 bg-secondary-subtle px-3 py-1 text-xs font-bold text-secondary"
          >
            {{ sweetnessLabel }}
          </div>
        </div>

        <!-- Progress summary cards -->
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Progress</div>
            <div class="mt-1 text-2xl font-bold text-ink">{{ progressPct }}%</div>
          </div>
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Remaining</div>
            <div class="mt-1 text-2xl font-black text-ink">{{ remainingCount }}</div>
            <div class="text-xs text-ink-secondary">ขั้นตอน</div>
          </div>
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Current</div>
            <div class="mt-1 text-lg font-black text-ink">{{ currentPhaseLabel }}</div>
            <div class="text-xs text-ink-secondary">{{ currentStepIndex + 1 }}/{{ totalSteps }}</div>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-border/70">
          <div
            class="h-full rounded-full transition-all duration-500 ease-out"
            :class="allDone ? 'bg-success' : 'bg-primary'"
            :style="{ width: progressPct + '%' }"
          ></div>
        </div>

        <!-- Coach note -->
        <div class="mt-5 rounded-[1.5rem] border border-border/75 bg-white/80 p-5">
          <div class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">Barista Coach</div>
          <p class="text-sm leading-7 text-ink-secondary">{{ coachNote }}</p>
        </div>

        <!-- Interactive Checklist -->
        <div class="mt-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">ขั้นตอน — กดเมื่อทำเสร็จ</h3>
            <button
              v-if="completed.some(Boolean)"
              type="button"
              @click="resetAll"
              class="rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium text-ink-muted transition-all duration-fast hover:border-border-strong hover:text-ink-secondary"
            >
              ทำใหม่ทั้งหมด
            </button>
          </div>

          <button
            v-for="(step, idx) in steps"
            :key="idx"
            type="button"
            @click="toggleStep(idx)"
            :aria-pressed="completed[idx]"
            :disabled="idx !== currentStepIndex && !completed[idx]"
            :class="[
              'flex w-full items-center gap-4 rounded-[1.25rem] border p-4 text-left transition-all duration-normal',
              completed[idx]
                ? 'border-success/30 bg-success-subtle'
                : idx === currentStepIndex
                  ? 'cursor-pointer border-primary/30 bg-primary-subtle shadow-sm hover:border-primary/50'
                  : 'cursor-not-allowed border-border/50 bg-white/40 opacity-50'
            ]"
          >
            <div
              :class="[
                'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-normal',
                completed[idx]
                  ? 'bg-success text-ink-inverse'
                  : idx === currentStepIndex
                    ? 'border-2 border-primary bg-primary-subtle text-primary animate-pulse-soft'
                    : 'border-2 border-border bg-white text-ink-muted'
              ]"
            >
              <span v-if="completed[idx]">✓</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span
                :class="[
                  'font-semibold text-base leading-snug',
                  completed[idx] ? 'text-success line-through' : idx === currentStepIndex ? 'text-ink' : 'text-ink-muted'
                ]"
              >
                {{ step.name }}
              </span>
              <span class="text-[10px] font-medium text-ink-muted">
                {{ phaseLabels[step.phase] || step.phase }} · {{ step.duration }} วินาทีโดยประมาณ
              </span>
            </div>
          </button>
        </div>

        <!-- All done message -->
        <transition name="fade">
          <div
            v-if="allDone"
            class="mt-5 rounded-[1.5rem] border border-success/25 bg-success-subtle p-5 text-center"
          >
            <div class="text-2xl mb-2">🎉</div>
            <h4 class="text-lg font-black text-ink">ทำครบทุกขั้นตอนแล้ว</h4>
            <p class="mt-1 text-sm text-ink-secondary">เครื่องดื่มพร้อมเสิร์ฟ! อยากซ้อมอีกครั้งให้กดปุ่มด้านบน</p>
          </div>
        </transition>
      </div>

      <!-- Bottom nav -->
      <div class="mt-5 flex gap-3">
        <button
          type="button"
          @click="setStep('prep')"
          class="flex-1 rounded-[1.25rem] border border-border bg-white px-4 py-3.5 font-semibold text-ink-secondary transition-all duration-fast hover:border-border-strong hover:text-ink"
        >
          ← กลับ
        </button>
        <button
          type="button"
          @click="resetAll"
          class="flex-1 rounded-[1.25rem] border border-border bg-white px-4 py-3.5 font-semibold text-ink-secondary transition-all duration-fast hover:border-border-strong hover:text-ink"
        >
          ล้างทั้งหมด
        </button>
      </div>
    </section>

    <!-- Right: Cup visualization -->
    <section class="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,240,231,0.96))] p-6 shadow-sm">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute inset-x-10 top-8 h-40 rounded-full bg-primary/12 blur-3xl"></div>
        <div class="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-secondary/12 blur-3xl"></div>
      </div>

      <!-- Steam for hot finished -->
      <div v-if="state.servingType === 'hot' && allDone" class="absolute top-16 z-10 flex gap-2">
        <span class="h-10 w-1.5 rounded-full bg-primary/15 animate-steam" style="animation-delay: 0s"></span>
        <span class="h-12 w-1.5 rounded-full bg-primary/10 animate-steam" style="animation-delay: 0.5s"></span>
        <span class="h-10 w-1.5 rounded-full bg-primary/15 animate-steam" style="animation-delay: 1s"></span>
      </div>

      <!-- Status badges -->
      <div class="relative z-10 mb-4 flex w-full max-w-xl flex-wrap items-center justify-center gap-2">
        <span class="rounded-full border border-border/80 bg-white/85 px-3 py-1 text-xs font-semibold text-ink-secondary">
          {{ currentPhaseLabel }}
        </span>
        <span class="rounded-full border border-border/80 bg-white/85 px-3 py-1 text-xs font-semibold text-ink-secondary">
          {{ progressPct }}%
        </span>
      </div>

      <!-- Current step name -->
      <div class="relative z-10 mb-5 w-full max-w-xs border-b border-border pb-3 text-center text-sm font-semibold text-ink-secondary">
        {{ currentStepName }}
      </div>

      <!-- Cup visualization -->
      <div class="relative z-10 flex h-80 w-full flex-col items-center justify-end">
        <!-- Main Glass Cup -->
        <div
          class="relative flex h-48 w-40 flex-col justify-end overflow-hidden rounded-b-[2rem] border-4 border-border-strong bg-white/65 shadow-[inset_0_10px_30px_rgba(255,255,255,0.38),0_20px_40px_rgba(122,76,33,0.18)]"
        >
          <!-- Layer fills (from bottom to top: reversed array, reversed fill order) -->
          <div
            v-for="(layer, idx) in currentSpec?.layers.slice().reverse() || []"
            :key="idx"
            :style="{
              height: fillPercentages[currentSpec.layers.length - 1 - idx] + '%',
              backgroundColor: resolveColor(layer.color)
            }"
            class="relative flex w-full items-center justify-center border-t border-white/10 transition-all duration-700 ease-out first:border-t-0"
          >
            <span
              v-if="fillPercentages[currentSpec.layers.length - 1 - idx] > 15"
              class="absolute text-[10px] font-bold text-white/70"
            >
              {{ layer.name }}
            </span>
          </div>

          <!-- Ice Cubes for cold (always visible when cold) -->
          <div
            v-if="state.servingType === 'cold'"
            class="pointer-events-none absolute inset-0 flex items-start justify-center gap-2 pt-6 opacity-40"
          >
            <div class="h-6 w-6 rotate-12 rounded-md border border-sky-200/60 bg-sky-100/70 shadow-sm"></div>
            <div class="h-6 w-6 -rotate-12 rounded-md border border-sky-200/60 bg-sky-100/70 shadow-sm"></div>
          </div>
        </div>

        <!-- Layer legend -->
        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <div
            v-for="(layer, idx) in currentSpec?.layers || []"
            :key="idx"
            class="inline-flex items-center gap-2 rounded-full border border-border/75 bg-white/90 px-3 py-1.5 text-[11px] text-ink-secondary shadow-sm"
          >
            <span class="h-2.5 w-2.5 rounded-sm" :style="{ backgroundColor: resolveColor(layer.color) }"></span>
            <span>{{ layer.name }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s var(--ease-out-quint);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

.animate-pulse-soft {
  animation: pulse-soft 2s var(--ease-in-out-quint) infinite;
}

.animate-steam {
  animation: steam-rise 2s var(--ease-out-quint) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-pulse-soft,
  .animate-steam {
    animation: none !important;
  }
}
</style>