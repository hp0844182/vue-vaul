<script setup lang="ts">
import { getCurrentInstance, inject } from 'vue'
import DialogContentNonModal from './DialogContentNonModal.vue'
import {
  type DialogContentImplEmits,
  type DialogContentImplProps,
} from './DialogContentImpl.vue'
import { DIALOG_INJECTION_KEY } from './context'
import { Presence } from '@/presence'

type DialogContentEmits = DialogContentImplEmits
const props = defineProps<DialogContentProps>()
defineEmits<DialogContentEmits>()
const { open } = inject(DIALOG_INJECTION_KEY)!
export interface DialogContentProps extends DialogContentImplProps {}
const events = getCurrentInstance()?.proxy.$listeners
</script>

<template>
  <Presence :present="forceMount || open">
    <DialogContentNonModal
      v-bind="{ ...props, ...$attrs }"
      v-on="events"
    >
      <slot />
    </DialogContentNonModal>
  </Presence>
</template>
