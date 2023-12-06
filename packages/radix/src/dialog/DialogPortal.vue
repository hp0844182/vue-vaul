<script setup lang="ts">
import { Teleport } from '@/teleport'

export interface DialogPortalProps {
  to?: string
  disabled?: boolean
}
const props = defineProps<DialogPortalProps>()
</script>

<template>
  <Teleport v-bind="props">
    <slot />
  </Teleport>
</template>
