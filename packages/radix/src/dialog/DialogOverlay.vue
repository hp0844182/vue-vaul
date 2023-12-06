<script setup lang="ts">
import { inject, watch } from 'vue'
import { DIALOG_INJECTION_KEY } from './context'
import { Primitive, type PrimitiveProps } from '@/primitive'
import { useBodyScrollLock } from '@/shared'
import { Presence } from '@/presence'

export interface DialogOverlayProps extends PrimitiveProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling transntion with Vue native transition or other animation libraries.
   */
  forceMount?: boolean
}
withDefaults(defineProps<DialogOverlayProps>(), {
  as: 'div',
})
const { open } = inject(DIALOG_INJECTION_KEY)!
const isLocked = useBodyScrollLock()
watch(
  () => open.value,
  (n) => {
    isLocked.value = !!n
  },
)
</script>

<template>
  <Presence :present="open">
    <Primitive
      v-bind="$attrs"
      :as="as"
      :as-child="asChild" :data-state="open ? 'open' : 'closed'" style="pointer-events: auto"
      data-aria-hidden="true" aria-hidden="true"
    >
      <slot />
    </Primitive>
  </Presence>
</template>
