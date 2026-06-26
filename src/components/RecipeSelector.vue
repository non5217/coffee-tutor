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
  const spec = activeRecipe.value.specs[state.servingType]
  return spec ? spec.layers : []
})
</script>

<template>
  <div class="flex flex-col lg:flex-row w-full h-full min-h-[600px] bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-2xl">
    <!-- Left panel: Menu selector -->
    <div class="flex-1 p-6 flex flex-col border-r border-slate-800">
      <!-- Tabs -->
      <div class="flex gap-2 mb-6 bg-slate-950 p-1.5 rounded-xl">
        <button 
          v-for="cat in ['coffee', 'tea', 'non-coffee']" 
          :key="cat"
          @click="selectCategory(cat)"
          :class="state.category === cat ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'"
          class="flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-300 flex items-center justify-center gap-1.5"
        >
          <span v-if="cat === 'coffee'">☕</span>
          <span v-else-if="cat === 'tea'">🍵</span>
          <span v-else>🍫</span>
          {{ cat.replace('-', ' ') }}
        </button>
      </div>

      <!-- Recipe Grid -->
      <div class="flex-1 overflow-y-auto max-h-[350px] lg:max-h-none grid grid-cols-2 gap-3 pr-1">
        <button 
          v-for="recipe in filteredRecipes" 
          :key="recipe.id"
          @click="selectDrink(recipe.id)"
          :class="state.drinkId === recipe.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'"
          class="p-4 rounded-xl border text-left flex flex-col gap-1 transition-all duration-200"
        >
          <span class="font-bold text-sm text-slate-200">{{ recipe.name }}</span>
          <span class="text-xs text-slate-500 flex flex-wrap gap-1 mt-1">
            <span v-for="t in recipe.allowedTypes" :key="t" class="px-1.5 py-0.5 bg-slate-800 text-[10px] rounded text-slate-400 capitalize">{{ t }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Right panel: Customisation and Visual Layered Cup -->
    <div class="flex-1 p-8 flex flex-col justify-between bg-slate-950/40 relative">
      <div>
        <h2 class="text-2xl font-extrabold mb-1 text-slate-100">{{ activeRecipe.name }}</h2>
        <p class="text-xs text-slate-500 mb-6 uppercase tracking-wider">Customize & View Recipe Structure</p>

        <!-- Form controls -->
        <div class="space-y-5">
          <!-- Serving Type selector -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Serving Option</span>
            <div class="flex gap-2">
              <button 
                v-for="type in activeRecipe.allowedTypes" 
                :key="type"
                @click="setServingType(type)"
                :class="state.servingType === type ? 'bg-amber-600 border-amber-600 text-white shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'"
                class="flex-1 py-2 px-3 rounded-lg border text-sm font-bold capitalize transition-all duration-200"
              >
                {{ type }}
              </button>
            </div>
          </div>

          <!-- Sweetness Level (only shown for cold/blended drinks) -->
          <div v-if="state.servingType !== 'hot'" class="flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Sweetness Level</span>
            <div class="flex gap-2">
              <button 
                v-for="lvl in ['unsweetened', 'less', 'normal']" 
                :key="lvl"
                @click="setSweetness(lvl)"
                :class="state.sweetness === lvl ? 'bg-amber-600 border-amber-600 text-white shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'"
                class="flex-1 py-2 px-3 rounded-lg border text-sm font-bold capitalize transition-all duration-200"
              >
                {{ lvl === 'unsweetened' ? 'ไม่หวาน' : (lvl === 'less' ? 'หวานน้อย' : 'หวานปกติ') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cup Rendering Container -->
      <div class="my-8 flex justify-center items-center h-48 relative">
        <!-- Floating steam for HOT serving -->
        <div v-if="state.servingType === 'hot'" class="absolute -top-6 flex gap-1 z-10">
          <span class="w-1.5 h-6 bg-slate-400/40 rounded-full animate-bounce duration-1000"></span>
          <span class="w-1.5 h-8 bg-slate-400/30 rounded-full animate-bounce duration-700"></span>
          <span class="w-1.5 h-6 bg-slate-400/40 rounded-full animate-bounce duration-900"></span>
        </div>

        <!-- The Cup glass outline -->
        <div class="w-32 h-40 border-4 border-slate-600 rounded-b-2xl relative overflow-hidden bg-slate-950/60 shadow-inner flex flex-col justify-end">
          <!-- Stacked Layers -->
          <div 
            v-for="(layer, idx) in currentLayers.slice().reverse()" 
            :key="idx" 
            :style="{ height: layer.height + '%', backgroundColor: layer.color }"
            class="w-full relative transition-all duration-500 ease-in-out flex items-center justify-center group"
          >
            <span class="absolute text-[8px] font-bold text-white/70 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-1.5 py-0.5 rounded pointer-events-none">
              {{ layer.name }}
            </span>
          </div>

          <!-- Ice particles floating inside cold cup -->
          <div v-if="state.servingType === 'cold'" class="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none opacity-60">
            <div class="w-5 h-5 bg-sky-200 rounded shadow-sm rotate-12 animate-pulse"></div>
            <div class="w-5 h-5 bg-sky-200 rounded shadow-sm -rotate-12 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>

      <button 
        @click="setStep('prep')" 
        class="bg-amber-600 hover:bg-amber-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all duration-200 w-full flex items-center justify-center gap-2"
      >
        Prepare Ingredients ➔
      </button>
    </div>
  </div>
</template>
