<script setup lang="ts">
import { provide, ref, toRefs } from 'vue'
import { Fragment } from 'vue-frag'
import type { DialogProvideValue } from './context'
import { DIALOG_INJECTION_KEY } from './context'
import { useId, useVModel } from '@/shared'

export interface DialogRootProps {
  open?: boolean
  defaultOpen?: boolean
  modal?: boolean
}

export interface DialogRootEmits {
  'update:open': [value: boolean]
}

const props = withDefaults(defineProps<DialogRootProps>(), {
  open: undefined,
  defaultOpen: false,
  modal: true,
})

const emit = defineEmits<DialogRootEmits>()

const open = useVModel(props, 'open', emit as any, {
  defaultValue: props.defaultOpen,
})
const triggerElement = ref<HTMLElement>()
const contentElement = ref<HTMLElement>()
const { modal } = toRefs(props)
provide<DialogProvideValue>(DIALOG_INJECTION_KEY, {
  open: open as any,
  modal,
  openModal: () => {
    open.value = true
  },
  onOpenChange: (value) => {
    open.value = value
  },
  onOpenToggle: () => {
    open.value = !open.value
  },
  contentId: useId(),
  titleId: useId(),
  descriptionId: useId(),
  triggerElement,
  contentElement,
})
</script>

<template>
  <Fragment>
    <slot />
  </Fragment>
</template>
