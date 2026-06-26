import { reactive } from 'vue'

export const state = reactive({
  temp: 'hot',
  shots: 2,
  currentStep: 'selection'
})

export function setTemp(temp) { state.temp = temp }
export function setShots(shots) { state.shots = shots }
export function setStep(step) { state.currentStep = step }
