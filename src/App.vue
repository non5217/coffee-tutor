<script setup>
import { computed } from 'vue'
import { state } from './store.js'
import { recipes } from './recipes.js'
import RecipeSelector from './components/RecipeSelector.vue'
import PrepChecklist from './components/PrepChecklist.vue'
import LiveGuide from './components/LiveGuide.vue'

const totalRecipes = Object.keys(recipes).length
const categoryCount = new Set(Object.values(recipes).map((recipe) => recipe.category)).size

const stepItems = [
  { id: 'selection', label: 'เลือกเมนู', accent: 'จากสูตรยอดนิยม' },
  { id: 'prep', label: 'เตรียมส่วนผสม', accent: 'พร้อมก่อนเริ่ม' },
  { id: 'live', label: 'สอนแบบสด', accent: 'จับเวลาและเทตามจังหวะ' },
]

const currentStepIndex = computed(() => {
  const index = stepItems.findIndex((item) => item.id === state.currentStep)
  return index === -1 ? 0 : index
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-bg text-ink">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="absolute right-[-4rem] top-12 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"></div>
      <div class="absolute bottom-[-5rem] left-1/3 h-72 w-72 rounded-full bg-accent/12 blur-3xl"></div>
    </div>

    <main class="relative mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <section class="animate-fade-in overflow-hidden rounded-[2rem] border border-white/65 bg-white/72 shadow-[0_28px_90px_oklch(0.53_0.09_65_/_0.18)] backdrop-blur-xl">
        <div class="border-b border-border/75 px-5 py-6 sm:px-8 sm:py-8">
          <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <span class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Coffee Lab Coach
              </span>
              <h1 class="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Coffee Tutor
              </h1>
              <p class="mt-3 max-w-xl text-sm leading-7 text-ink-secondary sm:text-base">
                ฝึกชงกาแฟ ชา และเมนูซิกเนเจอร์แบบมองภาพออกทันที ทั้งส่วนผสม เลเยอร์ และจังหวะการเท
                เพื่อให้การซ้อมหน้าบาร์มั่นใจขึ้นตั้งแต่แก้วแรก
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl border border-border/80 bg-white/80 px-4 py-3 shadow-sm">
                <div class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Recipes</div>
                <div class="mt-2 text-2xl font-black text-ink">{{ totalRecipes }}</div>
                <div class="text-xs text-ink-secondary">เมนูฝึกครบทั้งกาแฟ ชา และ non-coffee</div>
              </div>
              <div class="rounded-2xl border border-border/80 bg-white/80 px-4 py-3 shadow-sm">
                <div class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Categories</div>
                <div class="mt-2 text-2xl font-black text-ink">{{ categoryCount }}</div>
                <div class="text-xs text-ink-secondary">เลือกตามโหมดงานหน้าบาร์ได้ทันที</div>
              </div>
              <div class="rounded-2xl border border-border/80 bg-white/80 px-4 py-3 shadow-sm">
                <div class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Flow</div>
                <div class="mt-2 text-2xl font-black text-ink">{{ currentStepIndex + 1 }}/3</div>
                <div class="text-xs text-ink-secondary">เริ่มจากเลือกสูตร แล้วซ้อมตาม live guide</div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <div
              v-for="(item, index) in stepItems"
              :key="item.id"
              :class="[
                'flex min-w-[180px] flex-1 items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-normal',
                state.currentStep === item.id
                  ? 'border-primary/25 bg-primary-subtle shadow-sm'
                  : index < currentStepIndex
                    ? 'border-success/25 bg-success-subtle'
                    : 'border-border/80 bg-white/75'
              ]"
            >
              <div
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold',
                  state.currentStep === item.id
                    ? 'bg-primary text-ink-inverse'
                    : index < currentStepIndex
                      ? 'bg-success text-ink-inverse'
                      : 'bg-surface text-ink-secondary'
                ]"
              >
                {{ index + 1 }}
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-ink">{{ item.label }}</div>
                <div class="text-xs text-ink-muted">{{ item.accent }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 sm:p-4 md:p-5">
          <div class="overflow-hidden rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(254,250,244,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
            <RecipeSelector v-if="state.currentStep === 'selection'" />
            <PrepChecklist v-else-if="state.currentStep === 'prep'" />
            <LiveGuide v-else-if="state.currentStep === 'live'" />
          </div>
        </div>
      </section>

      <footer class="px-2 pt-4 text-center text-xs text-ink-muted">
        Coffee Tutor · ฝึกแบบเห็นภาพ พร้อมซ้อมเสิร์ฟได้จริง
      </footer>
    </main>
  </div>
</template>
