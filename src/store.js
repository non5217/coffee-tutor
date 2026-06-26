import { reactive } from 'vue'

export const state = reactive({
  currentStep: 'selection',
  category: 'coffee',
  drinkId: 'espresso',
  servingType: 'hot',
  sweetness: 'normal'
})

export function setCategory(category) { state.category = category }
export function setDrinkId(drinkId) { state.drinkId = drinkId }
export function setServingType(type) { state.servingType = type }
export function setSweetness(sweetness) { state.sweetness = sweetness }
export function setStep(step) { state.currentStep = step }
