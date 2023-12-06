<script setup lang="ts">
import Default from './Default.story.vue'
</script>

<template>
  <Story title="Drawer/Demo" :layout="{ type: 'single', iframe: true }">
    <Variant title="default">
      <Default />
    </Variant>
  </Story>
</template>
