<script setup>
import { state, setStep } from '../store.js'
import { computed } from 'vue'

const coffeeGrams = computed(() => state.shots === 1 ? '7-10g' : '14-20g')
const yieldMl = computed(() => state.shots === 1 ? '30ml' : '60ml')
</script>
<template>
  <div class="flex flex-col items-center justify-center p-6 w-full h-full min-h-[500px]">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Preparation Checklist</h2>
    
    <div class="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100">
      <h3 class="font-bold mb-4 text-gray-700 uppercase tracking-wide text-sm">Coffee Ratio Visualizer</h3>
      
      <div class="flex items-end h-20 bg-gray-100 rounded-lg overflow-hidden shadow-inner border border-gray-200">
        <div class="bg-amber-800 text-white text-xs font-bold flex flex-col justify-center items-center relative transition-all duration-500" 
             style="width: 25%; height: 100%;">
          <span>{{ coffeeGrams }}</span>
          <span class="text-[10px] opacity-80 font-normal">coffee</span>
        </div>
        <div class="bg-blue-300 text-slate-800 text-xs font-bold flex flex-col justify-center items-center relative transition-all duration-500" 
             style="width: 75%; height: 100%;">
          <span>{{ yieldMl }} yield</span>
          <span class="text-[10px] opacity-80 font-normal">water / milk</span>
        </div>
      </div>
    </div>
    
    <div class="w-full max-w-md text-left mb-10 px-4">
      <h3 class="font-bold mb-3 text-gray-700 uppercase tracking-wide text-sm">You will need:</h3>
      <ul class="space-y-3">
        <li class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-amber-800"></div>
          <span class="text-gray-700">Fresh coffee beans (<strong>{{ coffeeGrams }}</strong>)</span>
        </li>
        <li class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-gray-800"></div>
          <span class="text-gray-700">Espresso machine / brewing gear</span>
        </li>
        <li class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-gray-500"></div>
          <span class="text-gray-700">Scale & Timer</span>
        </li>
        <li v-if="state.temp === 'cold'" class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-blue-400"></div>
          <span class="text-gray-700">Ice cubes</span>
        </li>
      </ul>
    </div>
    
    <div class="flex gap-4 w-full max-w-md">
      <button @click="setStep('selection')" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-full font-bold transition-colors">
        Back
      </button>
      <button @click="setStep('live')" class="flex-[2] bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-bold shadow-lg transition-colors">
        Start Brewing
      </button>
    </div>
  </div>
</template>
