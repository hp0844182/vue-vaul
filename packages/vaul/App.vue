<script setup lang="ts">
import { provide, ref } from 'vue'
import { Icon } from '@iconify/vue2'

// import { DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTrigger } from './src'

const show = ref(false)
function handleClick() {
  show.value = !show.value
}
function handleOut() {
  // console.log('out')
}
const a = 1
provide('123', {
  a,
})
const snapPoints = ['148px', '355px', 1]
</script>

<template>
  <div class=" text-title">
    123
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
