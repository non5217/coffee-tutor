<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { state, setStep } from '../store.js'

const seconds = ref(0)
const isRunning = ref(false)
let timer = null

const start = () => {
  if (isRunning.value) return
  isRunning.value = true
  timer = setInterval(() => { seconds.value++ }, 1000)
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

const animationPhase = computed(() => {
  if (seconds.value === 0) return 'idle'
  if (seconds.value <= 5) return 'pre-infusion'
  if (seconds.value <= 25) return 'extraction'
  return 'finished'
})
</script>
<template>
  <div class="flex flex-col md:flex-row h-full w-full min-h-[600px] p-6 gap-6">
    <!-- Left side: Timer & Controls -->
    <div class="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8 shadow-inner border border-gray-200">
      <div class="text-[5rem] font-mono mb-2 text-gray-800 tabular-nums leading-none">{{ formatTime }}</div>
      
      <div class="text-xl mb-10 font-bold text-gray-500 uppercase tracking-widest min-h-[30px]">
        <span v-if="animationPhase === 'idle'" class="text-gray-400">Ready to Brew</span>
        <span v-else-if="animationPhase === 'pre-infusion'" class="text-amber-700 animate-pulse">Pre-Infusion</span>
        <span v-else-if="animationPhase === 'extraction'" class="text-amber-900">Extraction</span>
        <span v-else-if="animationPhase === 'finished'" class="text-green-600">Enjoy Your Coffee! ☕</span>
      </div>
      
      <div class="flex gap-4 mb-12">
        <button v-if="!isRunning && animationPhase !== 'finished'" @click="start" 
                class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold shadow-lg transform transition-transform hover:scale-105">
          Play
        </button>
        <button v-if="isRunning" @click="pause" 
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-full font-bold shadow-lg transform transition-transform hover:scale-105">
          Pause
        </button>
        <button @click="reset" 
                class="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-lg transform transition-transform hover:scale-105">
          Reset
        </button>
      </div>
      
      <button @click="setStep('prep')" class="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full font-bold transition-colors w-full max-w-xs">
        End Session
      </button>
    </div>
    
    <!-- Right side: Visual Animation -->
    <div class="flex-1 flex items-center justify-center bg-gray-100 rounded-2xl relative overflow-hidden shadow-inner border border-gray-200">
      
      <div class="flex flex-col items-center">
        <!-- Portafilter placeholder -->
        <div class="w-32 h-10 bg-gray-800 rounded-b-xl relative z-20 shadow-md">
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-700 rounded-b-md"></div>
        </div>

        <!-- Coffee Flow (Extraction) -->
        <div class="relative w-full flex justify-center h-48 z-10">
           <div class="absolute top-0 w-2 transition-all duration-1000"
                :class="{
                  'h-0 opacity-0': animationPhase === 'idle' || animationPhase === 'pre-infusion' || animationPhase === 'finished',
                  'h-full bg-amber-900 opacity-90': animationPhase === 'extraction' && seconds <= 15,
                  'h-full bg-amber-600 opacity-70': animationPhase === 'extraction' && seconds > 15
                }">
           </div>
           <div v-if="animationPhase === 'extraction'" class="absolute top-0 w-2 h-full bg-amber-700 opacity-50 animate-pulse"></div>
        </div>

        <!-- The Cup -->
        <div class="w-40 border-4 border-gray-800 rounded-b-3xl relative overflow-hidden bg-white shadow-md z-0" style="height: 180px;">
          <!-- Coffee Liquid filling up -->
          <div class="absolute bottom-0 w-full transition-all duration-1000 ease-linear"
               :style="{ height: animationPhase === 'idle' || animationPhase === 'pre-infusion' ? '0%' : (seconds > 25 ? '80%' : `${(seconds - 5) * 4}%`) }"
               :class="{
                 'bg-amber-900': seconds <= 15,
                 'bg-amber-800': seconds > 15 && seconds <= 20,
                 'bg-amber-700': seconds > 20
               }">
          </div>
          
          <!-- Ice Cubes if Cold -->
          <div v-if="state.temp === 'cold' && seconds > 5" class="absolute inset-0 flex items-center justify-center gap-2">
             <div class="w-8 h-8 bg-blue-100 rounded opacity-60 backdrop-blur-sm shadow-sm rotate-12 transition-all duration-[20s]" 
                  :style="{ transform: `rotate(${12 + seconds * 5}deg) translateY(${seconds > 25 ? -10 : 0}px)` }"></div>
             <div class="w-8 h-8 bg-blue-100 rounded opacity-60 backdrop-blur-sm shadow-sm -rotate-6 transition-all duration-[20s]"
                  :style="{ transform: `rotate(${-6 + seconds * 3}deg) translateY(${seconds > 25 ? -5 : 0}px)` }"></div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>
