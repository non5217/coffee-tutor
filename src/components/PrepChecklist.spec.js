import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import PrepChecklist from './PrepChecklist.vue'
import { state, setShots } from '../store.js'

describe('PrepChecklist', () => {
  beforeEach(() => { setShots(2) })

  it('renders checklist for 2 shots', () => {
    const wrapper = mount(PrepChecklist)
    expect(wrapper.text()).toContain('14-20g')
    expect(wrapper.text()).toContain('60ml yield')
  })
})
