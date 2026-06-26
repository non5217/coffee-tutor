import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LiveGuide from './LiveGuide.vue'
import { state, setDrinkId, setServingType } from '../store.js'

describe('LiveGuide', () => {
  it('renders timer and ready to brew status', () => {
    setDrinkId('espresso')
    setServingType('cold')
    const wrapper = mount(LiveGuide)
    expect(wrapper.text()).toContain('00:00')
    expect(wrapper.text()).toContain('พร้อมเริ่มชง')
  })
})
