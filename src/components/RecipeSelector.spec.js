import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RecipeSelector from './RecipeSelector.vue'

describe('RecipeSelector', () => {
  it('renders categories and recipes', () => {
    const wrapper = mount(RecipeSelector)
    expect(wrapper.text()).toContain('coffee')
    expect(wrapper.text()).toContain('tea')
    expect(wrapper.text()).toContain('non coffee')
  })
})
