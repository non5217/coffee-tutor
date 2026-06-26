import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PrepChecklist from './PrepChecklist.vue'
import { state, setDrinkId, setServingType } from '../store.js'

describe('PrepChecklist', () => {
  it('renders recipe ratio visualizer and dynamic ingredients list', () => {
    setDrinkId('espresso')
    setServingType('cold')
    const wrapper = mount(PrepChecklist)
    expect(wrapper.text()).toContain('เอสเพรสโซ่')
    expect(wrapper.text()).toContain('นมผสม')
  })
})
