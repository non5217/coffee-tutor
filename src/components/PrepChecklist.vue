<script setup>
import { computed } from 'vue'
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
  return labels[state.sweetness] || state.sweetness
})

const totalDuration = computed(() => {
  if (!currentSpec.value) return 0
  return currentSpec.value.steps.reduce((sum, step) => sum + step.duration, 0)
})

const adjustedIngredients = computed(() => {
  if (!currentSpec.value) return []
  let ingList = [...currentSpec.value.ingredients]
  if (state.sweetness === 'unsweetened') {
    ingList = ingList.filter(item => !item.includes('นมผสม') && !item.includes('ไซรัป') && !item.includes('น้ำเชื่อม') && !item.includes('ข้นหวาน'))
  } else if (state.sweetness === 'less') {
    ingList = ingList.map(item => {
      if (item.includes('นมผสม') || item.includes('ไซรัป') || item.includes('น้ำเชื่อม')) {
        return item + ' (ลดครึ่งหนึ่ง)'
      }
      return item
    })
  }
  return ingList
})

const equipmentList = computed(() => {
  const items = ['แก้วเสิร์ฟสะอาดและน้ำแข็งคุณภาพดี']

  if (state.servingType === 'blended') {
    items.push('เครื่องปั่นและแก้วปั่นที่แห้งสนิท')
  } else if (state.servingType === 'hot') {
    items.push('เครื่องชงเอสเพรสโซ่ เหยือกสตรีมนม และผ้าเช็ดก้านสตีม')
  } else {
    items.push('แก้วช็อตและภาชนะช่วยเทเพื่อคุมการแยกชั้น')
  }

  items.push('เครื่องชั่งหรือจิ๊กเกอร์สำหรับคุมปริมาณให้สม่ำเสมอ')
  return items
})

const prepNotes = computed(() => {
  return [
    `ใช้เวลาฝึกประมาณ ${totalDuration.value} วินาที`,
    `สูตรนี้มี ${currentSpec.value?.layers.length || 0} เลเยอร์ให้สังเกต`,
    state.servingType === 'hot'
      ? 'เช็กอุณหภูมิและเนื้อฟองให้พร้อมก่อนเริ่ม'
      : `โหมด ${servingTypeLabel.value} แนะนำให้จัดวางน้ำแข็งและแก้วก่อนเริ่มจับเวลา`,
  ]
})

// Map original hex colors to semantic
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
  <div class="min-h-[620px] p-5 sm:p-6 animate-fade-in">
    <div class="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <section class="rounded-[1.9rem] border border-white/70 bg-white/90 p-6 shadow-sm">
        <span class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Step 2
        </span>
        <h2 class="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl">ตรวจสอบส่วนผสม</h2>
        <p class="mt-2 text-sm font-medium text-ink-secondary">
          {{ activeRecipe.name }}
          <span class="text-ink-muted">· {{ servingTypeLabel }}</span>
          <span v-if="state.servingType !== 'hot'" class="text-ink-muted">· {{ sweetnessLabel }}</span>
        </p>

        <div class="mt-5 grid gap-3 sm:grid-cols-3">
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Duration</div>
            <div class="mt-1 text-sm font-bold text-ink">{{ totalDuration }} วินาที</div>
          </div>
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Layers</div>
            <div class="mt-1 text-sm font-bold text-ink">{{ currentSpec?.layers.length || 0 }} ชั้น</div>
          </div>
          <div class="rounded-[1.25rem] border border-border/80 bg-surface px-4 py-3">
            <div class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Focus</div>
            <div class="mt-1 text-sm font-bold text-ink">{{ state.servingType === 'hot' ? 'Temperature' : 'Layering' }}</div>
          </div>
        </div>

        <div class="mt-6 rounded-[1.5rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(250,245,238,0.92))] p-5">
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">ส่วนผสมที่ต้องเตรียม</h3>
          <ul class="space-y-3">
            <li v-for="(ingredient, idx) in adjustedIngredients" :key="idx" class="flex items-start gap-3">
              <div class="mt-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-[11px] font-bold text-primary">✓</div>
              <span class="text-sm leading-relaxed text-ink">{{ ingredient }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-5 rounded-[1.5rem] border border-border/75 bg-white/80 p-5">
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">อุปกรณ์และ readiness</h3>
          <ul class="space-y-3">
            <li v-for="(item, idx) in equipmentList" :key="idx" class="flex items-start gap-3">
              <div class="mt-1.5 h-2.5 w-2.5 rounded-full bg-secondary"></div>
              <span class="text-sm leading-relaxed text-ink-secondary">{{ item }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section class="rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,240,231,0.96))] p-6 shadow-sm">
        <h3 class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">สัดส่วนเครื่องดื่ม</h3>
        <p class="mt-2 text-sm leading-7 text-ink-secondary">
          ดูว่าของเหลวหรือโฟมแต่ละชั้นควรอยู่ตำแหน่งไหน เพื่อจะได้เทและจัดองค์ประกอบได้ใกล้สูตรจริง
        </p>

        <div class="mt-5 flex h-16 overflow-hidden rounded-[1.25rem] border border-border/80 shadow-inner">
          <div
            v-for="(layer, idx) in currentSpec?.layers || []"
            :key="idx"
            :style="{ width: layer.height + '%', backgroundColor: resolveColor(layer.color) }"
            class="relative flex flex-col items-center justify-center border-r border-white/15 text-[10px] font-bold text-white/90 last:border-0"
          >
            <span class="truncate px-1.5 leading-tight">{{ layer.name }}</span>
            <span class="text-[9px] font-medium opacity-80">{{ layer.height }}%</span>
          </div>
        </div>

        <div class="mt-5 rounded-[1.5rem] border border-border/75 bg-white/80 p-5">
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">ลำดับการทำ</h3>
          <div class="space-y-3">
            <div
              v-for="(step, idx) in currentSpec?.steps || []"
              :key="idx"
              class="flex items-start gap-3 rounded-[1.125rem] border border-border/65 bg-surface px-3 py-3"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-xs font-bold text-primary">
                {{ idx + 1 }}
              </div>
              <div class="min-w-0">
                <div class="text-sm font-semibold text-ink">{{ step.name }}</div>
                <div class="text-xs text-ink-muted">{{ step.duration }} วินาที</div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-[1.5rem] border border-warning/20 bg-warning-subtle p-5">
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-secondary">เช็กก่อนเริ่ม</h3>
          <ul class="space-y-2">
            <li v-for="(note, idx) in prepNotes" :key="idx" class="flex items-start gap-3 text-sm leading-6 text-ink-secondary">
              <span class="mt-1.5 h-2 w-2 rounded-full bg-warning"></span>
              <span>{{ note }}</span>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <div class="mt-5 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        @click="setStep('selection')"
        class="flex-1 rounded-[1.25rem] border border-border bg-white px-4 py-3.5 font-semibold text-ink-secondary transition-all duration-fast hover:border-border-strong hover:text-ink"
      >
        ← กลับ
      </button>
      <button
        type="button"
        @click="setStep('live')"
        class="flex-[1.4] flex items-center justify-center gap-2 rounded-[1.25rem] bg-primary px-4 py-3.5 font-bold text-ink-inverse shadow-[0_18px_40px_oklch(0.62_0.14_64_/_0.22)] transition-all duration-fast hover:-translate-y-0.5 hover:bg-primary-hover active:bg-primary-pressed"
      >
        เริ่มสอนแบบสด
        <span class="text-lg leading-none">→</span>
      </button>
    </div>
  </div>
</template>
