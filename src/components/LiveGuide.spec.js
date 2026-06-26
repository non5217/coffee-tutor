import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LiveGuide from './LiveGuide.vue'

describe('LiveGuide', () => {
  it('renders timer', () => {
    const wrapper = mount(LiveGuide)
    expect(wrapper.text()).toContain('00:00')
  })
})
