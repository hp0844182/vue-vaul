<script setup lang="ts">
import { inject } from 'vue'
import { DIALOG_INJECTION_KEY } from './context'
import { Primitive, type PrimitiveProps } from '@/primitive'

export interface DialogCloseProps extends PrimitiveProps {}
const props = withDefaults(defineProps<DialogCloseProps>(), {
  as: 'button',
})

const context = inject(DIALOG_INJECTION_KEY)

function handleClick() {
  context?.onOpenChange(false)
}
</script>

<template>
  <Primitive
    v-bind="props"
    :type="as === 'button' ? 'button' : undefined"
    aria-label="Close"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
@/component/Primitive
