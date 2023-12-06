import type Vue from 'vue'
import { defineComponent, getCurrentInstance } from 'vue'

export const Slot = defineComponent({
  name: 'PrimitiveSlot',
  inheritAttrs: true,
  setup(_, { slots, listeners }) {
    return () => {
      if (!slots.default)
        return null
      const child = slots.default?.()?.[0]
      const instance = getCurrentInstance()?.proxy as Vue

      if (child)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
        child.data = instance._g(child.data, listeners)
      return slots.default?.()
    }
  },
})
