<script setup lang="ts">
import { getCurrentInstance, inject, onMounted } from 'vue'
import { DIALOG_INJECTION_KEY } from './context'
import {
  Primitive,
  type PrimitiveProps,
  usePrimitiveElement,
} from '@/primitive'

export interface DialogTriggerProps extends PrimitiveProps {}

const props = withDefaults(defineProps<DialogTriggerProps>(), {
  as: 'button',
})
const { onOpenToggle, open, contentId, triggerElement } = inject(DIALOG_INJECTION_KEY) || {}
const { primitiveElement, currentElement } = usePrimitiveElement()
onMounted(() => {
  if (triggerElement?.value)
    triggerElement!.value = currentElement.value
})
const events = getCurrentInstance()?.proxy.$listeners
</script>

<template>
  <Primitive
    ref="primitiveElement"
    v-bind="props"
    :type="as === 'button' ? 'button' : undefined"
    aria-haspopup="dialog"
    :aria-expanded="open || false"
    :aria-controls="contentId"
    :data-state="open ? 'open' : 'closed'"
    v-on="events"
    @click="onOpenToggle"
  >
    <slot />
  </Primitive>
</template>
@/component/Primitive
