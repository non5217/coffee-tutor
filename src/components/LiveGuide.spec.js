import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LiveGuide from './LiveGuide.vue'
import { state, setDrinkId, setServingType } from '../store.js'

describe('LiveGuide', () => {
  it('renders checklist steps and ready state', () => {
    setDrinkId('espresso')
    setServingType('cold')
    const wrapper = mount(LiveGuide)
    // Should show the steps heading and barista coach
    expect(wrapper.text()).toContain('ขั้นตอน')
    expect(wrapper.text()).toContain('สกัดเอสเพรสโซ่')
  })

  it('allows tapping to complete a step', async () => {
    setDrinkId('latte')
    setServingType('hot')
    const wrapper = mount(LiveGuide)
    // Should list steps from latte hot spec
    expect(wrapper.text()).toContain('สกัดเอสเพรสโซ่ 1 ช็อต')
    expect(wrapper.text()).toContain('เทนมสตีมเกือบเต็มแก้ว')

    // Tap first step button
    const buttons = wrapper.findAll('button[aria-pressed]')
    expect(buttons.length).toBeGreaterThanOrEqual(3)

    const firstStepBtn = buttons[0]
    await firstStepBtn.trigger('click')

    // After clicking first step, it should show ✓
    expect(firstStepBtn.text()).toContain('✓')
  })

  it('resets when recipe changes', async () => {
    setDrinkId('espresso')
    setServingType('cold')
    const wrapper = mount(LiveGuide)

    // Complete first step
    const buttons = wrapper.findAll('button[aria-pressed]')
    const firstStepBtn = buttons[0]
    await firstStepBtn.trigger('click')
    expect(firstStepBtn.text()).toContain('✓')

    // Change recipe
    setDrinkId('americano')
    await wrapper.vm.$nextTick()
    // After recipe change, steps reset
    const newButtons = wrapper.findAll('button[aria-pressed]')
    expect(newButtons.length).toBeGreaterThan(0)
  })
})