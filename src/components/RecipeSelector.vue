<script setup>
import { computed } from 'vue'
import { state, setCategory, setDrinkId, setServingType, setSweetness, setStep } from '../store.js'
import { recipes } from '../recipes.js'

const filteredRecipes = computed(() => {
  return Object.keys(recipes)
    .filter(key => recipes[key].category === state.category)
    .map(key => ({ id: key, ...recipes[key] }))
})

const activeRecipe = computed(() => recipes[state.drinkId])
const activeSpec = computed(() => activeRecipe.value?.specs[state.servingType] || null)

const categoryIcons = {
  coffee: '☕',
  tea: '🍵',
  'non-coffee': '🍫',
}

const categoryLabels = {
  coffee: 'กาแฟ',
  tea: 'ชา',
  'non-coffee': 'เครื่องดื่มอื่นๆ',
}

const selectCategory = (cat) => {
  setCategory(cat)
  const firstOfCat = Object.keys(recipes).find(key => recipes[key].category === cat)
  if (firstOfCat) {
    selectDrink(firstOfCat)
  }
}

const selectDrink = (id) => {
  setDrinkId(id)
  const drink = recipes[id]
  if (!drink.allowedTypes.includes(state.servingType)) {
    setServingType(drink.allowedTypes[0])
  }
}

const currentLayers = computed(() => {
  const spec = activeSpec.value
  return spec ? spec.layers : []
})

const typeLabels = {
  hot: 'ร้อน',
  cold: 'เย็น',
  blended: 'ปั่น',
}

const sweetnessLabels = {
  unsweetened: 'ไม่หวาน',
  less: 'หวานน้อย',
  normal: 'หวานปกติ',
}

const servingTypeIcons = {
  hot: '♨️',
  cold: '❄️',
  blended: '🧊',
}

const totalDuration = computed(() => {
  if (!activeSpec.value) return 0
  return activeSpec.value.steps.reduce((sum, step) => sum + step.duration, 0)
})

const customizationSummary = computed(() => {
  const sweetnessText = state.servingType === 'hot' ? 'บาลานซ์มาตรฐาน' : sweetnessLabels[state.sweetness]
  return `${typeLabels[state.servingType]} · ${sweetnessText}`
})

const previewHighlights = computed(() => {
  return [
    { label: 'เลเยอร์', value: `${currentLayers.value.length} ชั้น` },
    { label: 'เวลาโดยประมาณ', value: `${totalDuration.value} วินาที` },
    { label: 'สไตล์แก้ว', value: customizationSummary.value },
  ]
})

const recipeNote = (recipe) => {
  if (recipe.category === 'coffee') return 'โฟกัสกลิ่นกาแฟ บาลานซ์ และจังหวะการเท'
  if (recipe.category === 'tea') return 'เด่นเรื่องสีชา ความหอม และการแยกชั้น'
  return 'เน้น texture หวานนุ่มและการตกแต่งให้น่าดื่ม'
}

const recipeDuration = (recipe) => {
  const defaultType = recipe.allowedTypes[0]
  return recipe.specs[defaultType].steps.reduce((sum, step) => sum + step.duration, 0)
}

// Map original layer colors to semantic names for the cup display
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
  <div class="flex min-h-[620px] flex-col xl:flex-row">
    <div class="flex flex-1 flex-col border-b border-border/70 p-5 sm:p-6 xl:border-b-0 xl:border-r">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="max-w-xl">
          <span class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Step 1
          </span>
          <h2 class="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl">เลือกเมนูที่อยากฝึก</h2>
          <p class="mt-2 text-sm leading-7 text-ink-secondary">
            เลือกหมวดเครื่องดื่มและสูตรที่อยากซ้อม จากนั้นค่อยปรับรูปแบบเสิร์ฟเพื่อดูเลเยอร์แบบชัด ๆ
          </p>
        </div>
        <div class="rounded-[1.5rem] border border-border/80 bg-white/80 px-4 py-3 shadow-sm">
          <div class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Recipe Library</div>
          <div class="mt-1 text-2xl font-black text-ink">{{ filteredRecipes.length }}</div>
          <div class="text-xs text-ink-secondary">สูตรในหมวดนี้</div>
        </div>
      </div>

      <div class="grid gap-2 rounded-[1.5rem] bg-white/80 p-2 shadow-sm sm:grid-cols-3">
        <button
          v-for="cat in ['coffee', 'tea', 'non-coffee']"
          :key="cat"
          type="button"
          @click="selectCategory(cat)"
          :aria-pressed="state.category === cat"
          :class="[
            'flex items-center justify-center gap-2 rounded-[1.125rem] px-4 py-3 text-sm font-semibold transition-all duration-fast',
            state.category === cat
              ? 'bg-primary text-ink-inverse shadow-sm'
              : 'bg-transparent text-ink-secondary hover:bg-primary-subtle hover:text-ink'
          ]"
        >
          <span class="text-base">{{ categoryIcons[cat] }}</span>
          <span>{{ categoryLabels[cat] }}</span>
        </button>
      </div>

      <div class="mt-5 grid flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
        <button
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          type="button"
          @click="selectDrink(recipe.id)"
          :aria-pressed="state.drinkId === recipe.id"
          :class="[
            'flex min-h-[180px] flex-col gap-3 rounded-[1.5rem] border p-4 text-left transition-all duration-fast',
            state.drinkId === recipe.id
              ? 'border-primary/25 bg-primary-subtle shadow-[0_18px_40px_oklch(0.61_0.13_62_/_0.15)]'
              : 'border-border/80 bg-white/85 shadow-sm hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md'
          ]"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="block text-base font-bold leading-snug text-ink">{{ recipe.name }}</span>
              <span class="mt-1 block text-xs leading-6 text-ink-secondary">{{ recipeNote(recipe) }}</span>
            </div>
            <span class="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-secondary shadow-sm">
              {{ recipe.allowedTypes.length }} แบบ
            </span>
          </div>

          <span class="flex flex-wrap gap-1.5">
            <span
              v-for="t in recipe.allowedTypes"
              :key="t"
              class="inline-flex items-center gap-1 rounded-full border border-border/80 bg-white/85 px-2 py-1 text-[11px] font-medium text-ink-secondary shadow-sm"
            >
              <span>{{ servingTypeIcons[t] }}</span>
              {{ typeLabels[t] || t }}
            </span>
          </span>

          <div class="mt-auto flex items-center justify-between border-t border-border/70 pt-3 text-[11px] text-ink-muted">
            <span>{{ recipe.specs[recipe.allowedTypes[0]].layers.length }} เลเยอร์</span>
            <span>ซ้อมประมาณ {{ recipeDuration(recipe) }} วินาที</span>
          </div>
        </button>
      </div>
    </div>

    <div class="flex flex-1 flex-col bg-[linear-gradient(180deg,rgba(255,251,246,0.92),rgba(247,240,231,0.94))] p-6 sm:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-xl">
          <span class="inline-flex items-center gap-2 rounded-full border border-secondary/25 bg-secondary-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Active Recipe
          </span>
          <h2 class="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl">{{ activeRecipe.name }}</h2>
          <p class="mt-2 text-sm leading-7 text-ink-secondary">
            เลือกสไตล์การเสิร์ฟ แล้วสังเกตโครงสร้างเครื่องดื่มจากภาพ preview เพื่อจำลำดับการเทให้แม่นยำ
          </p>
        </div>

        <div class="rounded-[1.5rem] border border-white/70 bg-white/88 p-4 shadow-sm lg:max-w-xs">
          <div class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">Current Focus</div>
          <div class="mt-2 text-sm font-semibold text-ink">{{ customizationSummary }}</div>
          <p class="mt-2 text-xs leading-6 text-ink-secondary">
            ใช้ preview นี้เป็นภาพจำก่อนเข้าสู่ขั้นเตรียมส่วนผสมและ live practice
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section class="rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-sm">
          <div class="space-y-5">
            <div>
              <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">รูปแบบการเสิร์ฟ</label>
              <div class="grid gap-2 sm:grid-cols-3">
                <button
                  v-for="type in activeRecipe.allowedTypes"
                  :key="type"
                  type="button"
                  @click="setServingType(type)"
                  :aria-pressed="state.servingType === type"
                  :class="[
                    'flex items-center justify-center gap-2 rounded-[1.125rem] border px-3 py-3 text-sm font-semibold capitalize transition-all duration-fast',
                    state.servingType === type
                      ? 'border-primary bg-primary text-ink-inverse shadow-sm'
                      : 'border-border/80 bg-white text-ink-secondary hover:border-primary/20 hover:text-ink'
                  ]"
                >
                  <span>{{ servingTypeIcons[type] }}</span>
                  {{ typeLabels[type] || type }}
                </button>
              </div>
            </div>

            <div v-if="state.servingType !== 'hot'">
              <label class="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">ระดับความหวาน</label>
              <div class="grid gap-2 sm:grid-cols-3">
                <button
                  v-for="lvl in ['unsweetened', 'less', 'normal']"
                  :key="lvl"
                  type="button"
                  @click="setSweetness(lvl)"
                  :aria-pressed="state.sweetness === lvl"
                  :class="[
                    'rounded-[1.125rem] border px-3 py-3 text-sm font-semibold transition-all duration-fast',
                    state.sweetness === lvl
                      ? 'border-primary bg-primary text-ink-inverse shadow-sm'
                      : 'border-border/80 bg-white text-ink-secondary hover:border-primary/20 hover:text-ink'
                  ]"
                >
                  {{ sweetnessLabels[lvl] }}
                </button>
              </div>
            </div>

            <div
              v-else
              class="rounded-[1.25rem] border border-warning/20 bg-warning-subtle px-4 py-3 text-sm leading-6 text-ink-secondary"
            >
              สูตรร้อนใช้บาลานซ์มาตรฐานเพื่อให้โฟกัสกับอุณหภูมิ เนื้อสัมผัส และการดึงกลิ่นกาแฟได้ชัดที่สุด
            </div>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div
              v-for="item in previewHighlights"
              :key="item.label"
              class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3"
            >
              <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">{{ item.label }}</div>
              <div class="mt-1 text-sm font-bold text-ink">{{ item.value }}</div>
            </div>
          </div>
        </section>

        <section class="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(252,246,238,0.9))] p-5 shadow-sm">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-sm font-bold uppercase tracking-[0.18em] text-ink-secondary">Layer Preview</h3>
              <p class="mt-1 text-xs leading-6 text-ink-muted">ดูชั้นเครื่องดื่มและสีโดยรวมก่อนเข้าสู่โหมดฝึกจริง</p>
            </div>
            <span class="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-secondary shadow-sm">
              {{ currentLayers.length }} เลเยอร์
            </span>
          </div>

          <div class="relative mt-6 flex flex-col items-center">
            <div class="absolute inset-x-8 top-8 h-36 rounded-full bg-primary/12 blur-3xl"></div>
            <div v-if="state.servingType === 'hot'" class="mb-1 flex gap-2">
              <span class="h-8 w-1 rounded-full bg-primary/20 animate-steam" style="animation-delay: 0s"></span>
              <span class="h-10 w-1 rounded-full bg-primary/15 animate-steam" style="animation-delay: 0.4s"></span>
              <span class="h-8 w-1 rounded-full bg-primary/20 animate-steam" style="animation-delay: 0.8s"></span>
            </div>

            <div class="relative flex h-48 w-40 flex-col justify-end overflow-hidden rounded-b-[2rem] border-4 border-border-strong bg-white/65 shadow-[inset_0_10px_30px_rgba(255,255,255,0.38),0_20px_40px_rgba(122,76,33,0.18)]">
              <div
                v-for="(layer, idx) in currentLayers.slice().reverse()"
                :key="idx"
                :style="{ height: layer.height + '%', backgroundColor: resolveColor(layer.color) }"
                class="group relative flex w-full items-center justify-center transition-all duration-slow"
              >
                <span class="pointer-events-none absolute rounded-full bg-ink/60 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity duration-fast group-hover:opacity-100">
                  {{ layer.name }}
                </span>
              </div>

              <div
                v-if="state.servingType === 'cold'"
                class="pointer-events-none absolute inset-0 flex items-start justify-center gap-2 pt-6 opacity-50"
              >
                <div class="h-6 w-6 rotate-12 rounded-md border border-sky-200/60 bg-sky-100/70 shadow-sm"></div>
                <div class="h-6 w-6 -rotate-12 rounded-md border border-sky-200/60 bg-sky-100/70 shadow-sm"></div>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap justify-center gap-2">
              <div
                v-for="(layer, idx) in currentLayers"
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

      <button
        type="button"
        @click="setStep('prep')"
        class="mt-6 flex items-center justify-center gap-2 rounded-[1.35rem] bg-primary px-5 py-4 text-base font-bold text-ink-inverse shadow-[0_18px_40px_oklch(0.62_0.14_64_/_0.24)] transition-all duration-fast hover:-translate-y-0.5 hover:bg-primary-hover active:bg-primary-pressed"
      >
        เตรียมส่วนผสม
        <span class="text-lg leading-none">→</span>
      </button>
    </div>
  </div>
</template>
