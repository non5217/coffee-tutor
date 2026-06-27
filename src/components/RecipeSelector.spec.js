import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import RecipeSelector from './RecipeSelector.vue'

describe('RecipeSelector', () => {
  const originalMatchMedia = window.matchMedia
  const scrollIntoView = vi.fn()

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '(max-width: 1279px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    Element.prototype.scrollIntoView = scrollIntoView
    scrollIntoView.mockClear()
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders categories and recipes', () => {
    const wrapper = mount(RecipeSelector)
    expect(wrapper.text()).toContain('กาแฟ')
    expect(wrapper.text()).toContain('ชา')
    expect(wrapper.text()).toContain('เครื่องดื่มอื่นๆ')
  })

  it('scrolls to active recipe area on mobile after selecting a drink', async () => {
    const wrapper = mount(RecipeSelector)
    const recipeButtons = wrapper.findAll('button[aria-pressed]')

    await recipeButtons[3].trigger('click')

    expect(scrollIntoView).toHaveBeenCalled()
  })
})
