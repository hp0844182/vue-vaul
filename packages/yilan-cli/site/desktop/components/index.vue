<script>
import DocNav from './Nav'
import DocHeader from './Header'
import DocContent from './Content'
import DocContainer from './Container'
import DocSimulator from './Simulator'

export default {
  name: 'VanDoc',

  components: {
    DocNav,
    DocHeader,
    DocContent,
    DocContainer,
    DocSimulator,
  },

  props: {
    lang: String,
    versions: Array,
    simulator: String,
    hasSimulator: Boolean,
    langConfigs: Array,
    config: {
      type: Object,
      required: true,
    },
    base: {
      type: String,
      default: '',
    },
  },
  emits: { switchVersion: null },

  watch: {
    // eslint-disable-next-line object-shorthand
    '$route.path'() {
      this.setNav()
    },
  },

  created() {
    this.setNav()
    this.keyboardHandler()
  },

  methods: {
    setNav() {
      const { nav } = this.config
      const items = nav.reduce((list, item) => list.concat(item.items), [])
      const currentPath = this.$route.path.split('/').pop()

      let currentIndex
      for (let i = 0, len = items.length; i < len; i++) {
        if (items[i].path === currentPath) {
          currentIndex = i
          break
        }
      }

      this.leftNav = items[currentIndex - 1]
      this.rightNav = items[currentIndex + 1]
    },

    keyboardNav(direction) {
      if (/win(32|64)/.test(navigator.userAgent.toLocaleLowerCase()))
        return

      const nav = direction === 'prev' ? this.leftNav : this.rightNav
      if (nav.path)
        this.$router.push(this.base + nav.path)
    },

    keyboardHandler() {
      window.addEventListener('keyup', (event) => {
        switch (event.keyCode) {
          case 37: // left
            this.keyboardNav('prev')
            break
          case 39: // right
            this.keyboardNav('next')
            break
        }
      })
    },
  },
}
</script>

<template>
  <div class="van-doc">
    <DocHeader
      :lang="lang"
      :config="config"
      :versions="versions"
      :lang-configs="langConfigs"
      @switch-version="$emit('switchVersion', $event)"
    />
    <DocNav :lang="lang" :nav-config="config.nav" />
    <DocContainer :has-simulator="hasSimulator">
      <DocContent>
        <slot />
      </DocContent>
    </DocContainer>
    <DocSimulator v-if="hasSimulator" :src="simulator" />
  </div>
</template>

<style lang="less">
@import '../../common/style/var';
</style>
