<script setup lang="ts">
import { computed, useListeners, watch } from 'vue'
import { DialogContent, type DialogContentProps } from 'radix-vue2'
import { usePrimitiveElement } from 'radix-vue2'
import { useDrawerContext } from './context'

const props = defineProps<{
  as?: DialogContentProps['as']
  asChild?: DialogContentProps['asChild']
  disableOutsidePointerEvents?: DialogContentProps['disableOutsidePointerEvents']
  forceMount?: DialogContentProps['forceMount']
  trapFocus?: DialogContentProps['trapFocus']
}>()
const { drawerRef, onPress, onDrag, isOpen, onRelease, isDragging, visible, dismissible, snapPointsOffset, openProp, closeDrawer, onOpenChange, activeSnapPoint, snapPoints } = useDrawerContext()
const { primitiveElement, currentElement } = usePrimitiveElement()

watch(isOpen, () => {
  if (isOpen.value) {
    requestAnimationFrame(() => {
      visible.value = true
    })
  }
}, { immediate: true })
watch(currentElement, () => {
  drawerRef.value = currentElement.value
}, {
  immediate: true,
})

function handlePointOutside(e: any) {
  onOpenChange?.(false)
  if (!dismissible.value)
    e.preventDefault()
  if (!dismissible.value || openProp?.value !== undefined)
    return

  closeDrawer()
}
const events = useListeners()
function handleMove(e: TouchEvent) {
  if (isDragging.value)
    e.preventDefault()
}

function onOpenAutoFocus(e: Event) {
  e.preventDefault();
  (drawerRef.value as any)?.focus()
}

const style = computed(() => {
  if (snapPointsOffset.value.length) {
    return {
      '--snap-point-height': `${snapPointsOffset.value[0]!}px`,
    }
  }
  else {
    return {}
  }
})
</script>

<template>
  <DialogContent
    ref="primitiveElement"
    v-bind="props"
    vaul-drawer=""
    :vaul-drawer-visible="visible ? 'true' : 'false'"
    :style="style"
    @pointerdown="onPress"
    @pointerup="onRelease"
    @pointermove="onDrag"
    @touchmove="handleMove"
    @pointer-down-outside="handlePointOutside"
    @open-auto-focus="onOpenAutoFocus"
    v-on="events"
  >
    <slot />
  </DialogContent>
</template>

<style scoped>

</style>
