<script setup>
import { state, setTemp, setShots, setStep } from '../store.js'
</script>
<template>
  <div class="flex flex-col items-center justify-center p-4 w-full h-full min-h-[500px]">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Select Your Recipe</h1>
    
    <div class="flex flex-col gap-6 w-full max-w-sm">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-gray-600 uppercase tracking-wider">Temperature</label>
        <div class="flex gap-2">
          <button @click="setTemp('hot')" 
                  :class="state.temp === 'hot' ? 'bg-red-500 text-white shadow-md transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'" 
                  class="flex-1 py-3 rounded-lg font-bold transition-all duration-200">
            Hot
          </button>
          <button @click="setTemp('cold')" 
                  :class="state.temp === 'cold' ? 'bg-blue-500 text-white shadow-md transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'" 
                  class="flex-1 py-3 rounded-lg font-bold transition-all duration-200">
            Cold (Iced)
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-semibold text-gray-600 uppercase tracking-wider">Intensity</label>
        <div class="flex gap-2">
          <button @click="setShots(1)" 
                  :class="state.shots === 1 ? 'bg-gray-800 text-white shadow-md transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'" 
                  class="flex-1 py-3 rounded-lg font-bold transition-all duration-200">
            1 Shot
          </button>
          <button @click="setShots(2)" 
                  :class="state.shots === 2 ? 'bg-gray-800 text-white shadow-md transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'" 
                  class="flex-1 py-3 rounded-lg font-bold transition-all duration-200">
            2 Shots
          </button>
        </div>
      </div>
    </div>

    <!-- Visual Coffee Cup placeholder -->
    <div class="mt-10 mb-8 flex justify-center w-full">
      <div class="w-32 border-4 border-gray-800 rounded-b-2xl relative overflow-hidden bg-white shadow-inner" style="height: 160px;">
        <div class="absolute bottom-0 w-full transition-all duration-500 ease-in-out flex flex-col justify-end" 
             :style="{ height: state.shots === 1 ? '40%' : '80%' }">
          <!-- Coffee liquid -->
          <div class="w-full h-full bg-amber-900 relative">
            <div v-if="state.temp === 'cold'" class="absolute inset-0 flex items-center justify-center gap-1 opacity-70">
               <div class="w-6 h-6 bg-blue-100 rounded opacity-80 backdrop-blur-sm shadow-sm rotate-12"></div>
               <div class="w-6 h-6 bg-blue-100 rounded opacity-80 backdrop-blur-sm shadow-sm -rotate-6"></div>
            </div>
            <!-- Crema -->
            <div class="absolute top-0 w-full h-2 bg-amber-700"></div>
          </div>
        </div>
      </div>
    </div>

    <button @click="setStep('prep')" class="mt-4 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-colors w-full max-w-sm">
      Next: Preparation
    </button>
  </div>
</template>
