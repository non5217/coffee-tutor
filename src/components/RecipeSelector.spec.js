import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RecipeSelector from './RecipeSelector.vue'

describe('RecipeSelector', () => {
  it('renders categories and recipes', () => {
    const wrapper = mount(RecipeSelector)
    expect(wrapper.text()).toContain('กาแฟ')
    expect(wrapper.text()).toContain('ชา')
    expect(wrapper.text()).toContain('เครื่องดื่มอื่นๆ')
  })
})
