<script setup lang="ts">
import { getCurrentInstance } from 'vue'

// import type { Vue } from 'vue/types/vue'
import { Slot as SlotV } from './Slot'

import type { PrimitiveProps } from './types'

defineOptions({
  name: 'VuePrimitive',
})

withDefaults(defineProps<PrimitiveProps>(), {
  as: 'div',
})
const events = getCurrentInstance()?.proxy.$listeners
</script>

<template>
  <SlotV v-if="asChild" v-on="events">
    <slot />
  </SlotV>
  <component :is="as" v-else v-on="events">
    <slot />
  </component>
</template>
