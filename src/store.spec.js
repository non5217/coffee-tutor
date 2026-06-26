import { describe, it, expect } from 'vitest'
import { state, setTemp, setShots, setStep } from './store.js'

describe('Store', () => {
  it('initializes with default state', () => {
    expect(state.temp).toBe('hot')
    expect(state.shots).toBe(2)
    expect(state.currentStep).toBe('selection')
  })

  it('updates state correctly', () => {
    setTemp('cold')
    expect(state.temp).toBe('cold')
    setShots(1)
    expect(state.shots).toBe(1)
    setStep('prep')
    expect(state.currentStep).toBe('prep')
  })
})
