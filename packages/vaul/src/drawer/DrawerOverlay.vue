<script setup lang="ts">
import { watch } from 'vue'
import { useDrawerContext } from './context'
import {  usePrimitiveElement  } from 'radix-vue2'
import { DialogOverlay, type DialogOverlayProps } from 'radix-vue2'

const props = withDefaults(defineProps<{
  as?:DialogOverlayProps['as'],
  asChild?:DialogOverlayProps['asChild'],
  forceMount?:DialogOverlayProps['forceMount'],
}>(), {
  as: 'div',
})

const { overlayRef, onRelease, snapPoints, isOpen, visible, shouldFade } = useDrawerContext()
const { primitiveElement, currentElement } = usePrimitiveElement()
watch(currentElement, () => {
  overlayRef.value = currentElement.value
}, {
  immediate: true,
})
</script>

<template>
  <!-- Show overlay only when the active snapPoint is last or there are no snapPoints -->
  <DialogOverlay
    ref="primitiveElement"
    v-bind="props"
    vaul-overlay=""
    :vaul-snap-points="isOpen && snapPoints.length > 0 ? 'true' : 'false'"
    :vaul-snap-points-overlay="isOpen && shouldFade ? 'true' : 'false'"
    :vaul-drawer-visible="visible ? 'true' : 'false'"

    @mouseup="onRelease"
  >
    <slot />
  </DialogOverlay>
</template>

<style scoped>

</style>
