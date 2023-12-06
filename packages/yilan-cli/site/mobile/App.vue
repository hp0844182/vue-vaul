<script>
import DemoNav from './components/DemoNav'

export default {
  components: { DemoNav },
}
</script>

<template>
  <div vaul-drawer-wrapper="">
    <div style="background-color: white;">
      <DemoNav />
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<style lang="less">
@import '../common/style/var';
@import '../common/style/base';

body {
  min-width: 100vw;
}

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
</style>
