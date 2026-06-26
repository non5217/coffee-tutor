import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RecipeSelector from './RecipeSelector.vue'
import { state } from '../store.js'

describe('RecipeSelector', () => {
  it('renders correctly', () => {
    const wrapper = mount(RecipeSelector)
    expect(wrapper.text()).toContain('Select Your Recipe')
  })
})
