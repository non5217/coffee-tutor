<script setup>
import { state } from './store.js'
import RecipeSelector from './components/RecipeSelector.vue'
import PrepChecklist from './components/PrepChecklist.vue'
import LiveGuide from './components/LiveGuide.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-200 font-sans text-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden min-h-[600px] flex">
      <RecipeSelector v-if="state.currentStep === 'selection'" class="w-full" />
      <PrepChecklist v-else-if="state.currentStep === 'prep'" class="w-full" />
      <LiveGuide v-else-if="state.currentStep === 'live'" class="w-full" />
    </div>
  </div>
</template>
