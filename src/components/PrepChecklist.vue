<script setup>
import { computed } from 'vue'
import { state, setStep } from '../store.js'
import { recipes } from '../recipes.js'

const activeRecipe = computed(() => recipes[state.drinkId])
const currentSpec = computed(() => activeRecipe.value.specs[state.servingType])

const adjustedIngredients = computed(() => {
  if (!currentSpec.value) return []
  let ingList = [...currentSpec.value.ingredients]
  // Sweetness overrides
  if (state.sweetness === 'unsweetened') {
    ingList = ingList.filter(item => !item.includes('นมผสม') && !item.includes('ไซรัป') && !item.includes('น้ำเชื่อม') && !item.includes('ข้นหวาน'))
  } else if (state.sweetness === 'less') {
    ingList = ingList.map(item => {
      if (item.includes('นมผสม') || item.includes('ไซรัป') || item.includes('น้ำเชื่อม')) {
        return item + ' (ลดปริมาณลงครึ่งหนึ่ง / หวานน้อย)'
      }
      return item
    })
  }
  return ingList
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 w-full h-full min-h-[500px] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl">
    <h2 class="text-3xl font-extrabold mb-2 text-slate-100">Preparation Checklist</h2>
    <p class="text-sm text-slate-500 mb-8 uppercase tracking-widest">{{ activeRecipe.name }} ({{ state.servingType }})</p>
    
    <!-- Ratio Visualizer Bar -->
    <div class="w-full max-w-md bg-slate-950 rounded-2xl p-6 mb-8 border border-slate-800">
      <h3 class="font-bold mb-4 text-slate-400 uppercase tracking-wide text-xs">Recipe Proportion Bar</h3>
      
      <div class="flex h-12 bg-slate-850 rounded-xl overflow-hidden shadow-inner border border-slate-700">
        <div 
          v-for="(layer, idx) in currentSpec?.layers || []" 
          :key="idx" 
          :style="{ width: layer.height + '%', backgroundColor: layer.color }"
          class="text-white text-[10px] font-bold flex flex-col justify-center items-center relative transition-all duration-500 border-r border-slate-950/20 last:border-0"
        >
          <span class="truncate px-1.5">{{ layer.name }}</span>
          <span class="text-[9px] opacity-75 font-normal">{{ layer.height }}%</span>
        </div>
      </div>
    </div>
    
    <!-- Checklist items -->
    <div class="w-full max-w-md text-left mb-10 px-4">
      <h3 class="font-bold mb-4 text-slate-400 uppercase tracking-wide text-xs">Ingredients & Brewing Gear Needed:</h3>
      <ul class="space-y-3">
        <li v-for="(ingredient, idx) in adjustedIngredients" :key="idx" class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <span class="text-slate-200 text-sm" v-html="ingredient"></span>
        </li>
        <li class="flex items-center gap-3 border-t border-slate-800 pt-3 mt-3">
          <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
          <span class="text-slate-400 text-sm">เครื่องชง อุปกรณ์กรองน้ำ หรือเครื่องปั่น (ตามสูตร)</span>
        </li>
        <li class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
          <span class="text-slate-400 text-sm">แก้วเสิร์ฟ, เทอร์โมมิเตอร์ และเครื่องชั่ง</span>
        </li>
      </ul>
    </div>
    
    <!-- Navigation Buttons -->
    <div class="flex gap-4 w-full max-w-md">
      <button 
        @click="setStep('selection')" 
        class="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3.5 rounded-xl font-bold transition-colors"
      >
        Back to Select
      </button>
      <button 
        @click="setStep('live')" 
        class="flex-[2] bg-amber-600 hover:bg-amber-500 text-white py-3.5 rounded-xl font-extrabold shadow-lg transition-all duration-200"
      >
        Start Tutorial Guide ➔
      </button>
    </div>
  </div>
</template>
