<script setup lang="ts">
import { inject } from 'vue'
import { DIALOG_INJECTION_KEY } from './context'
import { Primitive, type PrimitiveProps } from '@/primitive'

export interface DialogTitleProps extends PrimitiveProps {}
const props = withDefaults(defineProps<DialogTitleProps>(), { as: 'h2' })

const context = inject(DIALOG_INJECTION_KEY)
</script>

<template>
  <Primitive v-bind="props" :id="context?.titleId">
    <slot />
  </Primitive>
</template>
@/component/Primitive
