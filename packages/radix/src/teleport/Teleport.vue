<script lang="ts">
export default {
  name: 'Teleport',
  props: {
    to: {
      type: String,
      required: false,
      default: 'body',
    },
    where: {
      type: String,
      default: 'after',
    },
    disabled: Boolean,
  },
  data() {
    return {
      nodes: [],
      waiting: false,
      observer: null,
      parent: null,
    }
  },
  computed: {
    classes() {
      if (this.disabled)
        return ['teleporter']

      return ['teleporter', 'hidden']
    },
  },
  watch: {
    to: 'maybeMove',
    where: 'maybeMove',
    disabled(value) {
      if (value) {
        this.disable()
        this.teardownObserver()
      }
      else {
        this.bootObserver()
        this.move()
      }
    },
  },
  mounted() {
    // Store a reference to the nodes
    this.nodes = Array.from(this.$el.childNodes) as any
    if (!this.disabled)
      this.bootObserver()

    // Move slot content to target
    this.maybeMove()
  },
  beforeUnmount() {
    // Move back
    this.disable()

    // Stop observing
    this.teardownObserver()
  },
  methods: {
    maybeMove() {
      if (!this.disabled)
        this.move()
    },
    move() {
      this.waiting = false

      this.parent = document.querySelector(this.to) as any

      if (!this.parent) {
        this.disable()

        this.waiting = true

        return
      }

      if (this.where === 'before')
        (this.parent as any).prepend(this.getFragment())
      else
        (this.parent as any).appendChild(this.getFragment())
    },
    disable() {
      this.$el.appendChild(this.getFragment())
      this.parent = null
    },
    // Using a fragment is faster because it'll trigger only a single reflow
    // See https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
    getFragment() {
      const fragment = document.createDocumentFragment()

      this.nodes.forEach(node => fragment.appendChild(node))

      return fragment
    },
    onMutations(mutations:any) {
      // Makes sure the move operation is only done once
      let shouldMove = false

      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i]
        const filteredAddedNodes = Array.from(mutation.addedNodes).filter(node => !this.nodes.includes(node as never))

        if (Array.from(mutation.removedNodes).includes(this.parent)) {
          this.disable()
          this.waiting = !this.disabled
        }
        else if (this.waiting && filteredAddedNodes.length > 0) {
          shouldMove = true
        }
      }

      if (shouldMove)
        this.move()
    },
    bootObserver() {
      if (this.observer)
        return

      this.observer = new MutationObserver(mutations => this.onMutations(mutations)) as any

      (this.observer as any).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      })
    },
    teardownObserver() {
      if (this.observer) {
        (this.observer as any).disconnect()
        this.observer = null
      }
    },
  },
}
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped>
.hidden {
  visibility: hidden;
  display: none;
}
</style>
