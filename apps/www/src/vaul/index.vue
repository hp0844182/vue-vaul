<template>
  <button class="demo-button">
    <slot />
  </button>
</template>

<script lang="ts">
import { DrawerRoot } from 'vaul-vue2';

export default {
  name: 'VVaul',
components:{
  DrawerRoot
},
  props: {
    color: String,
    type: {
      type: String,
      default: 'primary',
    },
  },
};
</script>

<style lang="less">
.demo-button {
  min-width: 120px;
  color: #fff;
  font-size: 16px;
  line-height: 36px;
  background-color: #f44;
  border: none;
  border-radius: 30px;
}
</style>
