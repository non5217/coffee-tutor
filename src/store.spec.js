import { describe, it, expect } from 'vitest'
import { state, setCategory, setDrinkId, setServingType, setSweetness, setStep } from './store.js'

describe('Store', () => {
  it('initializes with default state', () => {
    expect(state.category).toBe('coffee')
    expect(state.drinkId).toBe('espresso')
    expect(state.servingType).toBe('hot')
    expect(state.sweetness).toBe('normal')
    expect(state.currentStep).toBe('selection')
  })

  it('updates state fields correctly', () => {
    setCategory('tea')
    expect(state.category).toBe('tea')
    setDrinkId('thai_tea')
    expect(state.drinkId).toBe('thai_tea')
    setServingType('hot')
    expect(state.servingType).toBe('hot')
    setSweetness('unsweetened')
    expect(state.sweetness).toBe('unsweetened')
    setStep('prep')
    expect(state.currentStep).toBe('prep')
  })
})
