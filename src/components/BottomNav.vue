<script setup>
import { computed } from 'vue'
import { state, setStep } from '../store.js'

const stepItems = [
  { id: 'selection', label: 'เลือกเมนู' },
  { id: 'prep', label: 'เตรียมส่วนผสม' },
  { id: 'live', label: 'ทำตามขั้นตอน' },
]

const currentIndex = computed(() => {
  const idx = stepItems.findIndex((item) => item.id === state.currentStep)
  return idx === -1 ? 0 : idx
})

const currentLabel = computed(() => stepItems[currentIndex.value].label)

const canGoBack = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < stepItems.length - 1)

const goBack = () => {
  if (canGoBack.value) {
    setStep(stepItems[currentIndex.value - 1].id)
  }
}

const goNext = () => {
  if (canGoNext.value) {
    setStep(stepItems[currentIndex.value + 1].id)
  }
}

const jumpTo = (stepId) => {
  setStep(stepId)
}
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-white/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(122,76,33,0.08)]">
    <div class="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-3.5">
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Back -->
        <button
          type="button"
          @click="goBack"
          :disabled="!canGoBack"
          :class="[
            'flex items-center gap-1 rounded-[1.125rem] border px-4 py-3 text-sm font-semibold transition-all duration-fast',
            canGoBack
              ? 'border-border bg-white text-ink-secondary hover:border-border-strong hover:text-ink active:bg-surface'
              : 'cursor-not-allowed border-border/40 bg-surface/50 text-ink-muted/40'
          ]"
        >
          <span class="text-base leading-none">←</span>
          <span class="hidden sm:inline">ย้อนกลับ</span>
        </button>

        <!-- Step pills (clickable) -->
        <div class="flex flex-1 items-center justify-center gap-1.5 sm:gap-2">
          <button
            v-for="(item, idx) in stepItems"
            :key="item.id"
            type="button"
            @click="jumpTo(item.id)"
            :aria-pressed="state.currentStep === item.id"
            :class="[
              'flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-fast sm:px-4 sm:py-2.5 sm:text-sm',
              state.currentStep === item.id
                ? 'border-primary bg-primary text-ink-inverse shadow-sm'
                : idx < currentIndex
                  ? 'border-success/30 bg-success-subtle text-success'
                  : 'border-border bg-white text-ink-muted hover:border-border-strong hover:text-ink-secondary'
            ]"
          >
            <span
              :class="[
                'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs',
                state.currentStep === item.id
                  ? 'bg-ink-inverse/20 text-ink-inverse'
                  : idx < currentIndex
                    ? 'bg-success text-ink-inverse'
                    : 'bg-surface text-ink-muted'
              ]"
            >
              <span v-if="idx < currentIndex">✓</span>
              <span v-else>{{ idx + 1 }}</span>
            </span>
            <span class="hidden sm:inline">{{ item.label }}</span>
          </button>
        </div>

        <!-- Next -->
        <button
          type="button"
          @click="goNext"
          :disabled="!canGoNext"
          :class="[
            'flex items-center gap-1 rounded-[1.125rem] px-4 py-3 text-sm font-bold transition-all duration-fast',
            canGoNext
              ? 'bg-primary text-ink-inverse shadow-md hover:bg-primary-hover active:bg-primary-pressed'
              : 'cursor-not-allowed bg-surface/60 text-ink-muted/40'
          ]"
        >
          <span class="hidden sm:inline">ถัดไป</span>
          <span class="text-base leading-none">→</span>
        </button>
      </div>
    </div>
  </nav>
</template>