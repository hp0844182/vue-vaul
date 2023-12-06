import { defineComponent, getCurrentInstance, h, onBeforeUpdate, onMounted, onUpdated, provide, ref } from 'vue'
import { mountedStates } from '@motionone/dom'
import type { PresenceState } from './context'
import { presenceId } from './context'

const doneCallbacks = new WeakMap<Element, VoidFunction>()

function removeDoneCallback(element: Element) {
  const prevDoneCallback = doneCallbacks.get(element)
  prevDoneCallback
    && element.removeEventListener('motioncomplete', prevDoneCallback)
  doneCallbacks.delete(element)
}

export const Presence = defineComponent({
  name: 'Presence',
  props: {
    name: { type: String },
    initial: {
      type: Boolean,
      default: true,
    },
    exitBeforeEnter: {
      type: Boolean,
      default: false,
    },
  },
  setup({ initial }) {
    const transitionRef = ref<object | null>(null)
    const state: PresenceState = { initial, transition: transitionRef }

    provide(presenceId, state)

    onBeforeUpdate(() => {
      state.initial = undefined
    })
    const instance = getCurrentInstance()?.proxy as Vue
    const setTransition = () => {
      const child = instance.$slots.default?.[0]
      transitionRef.value = child?.data?.transition || null
    }
    onUpdated(setTransition)
    onMounted(setTransition)
  },
  methods: {
    enter(element: Element) {
      const state = mountedStates.get(element)
      if (!state)
        return

      removeDoneCallback(element)
      state.setActive('exit', false)
    },
    exit(element: Element, done: VoidFunction) {
      const state = mountedStates.get(element)
      if (!state)
        return done()
      state.setActive('exit', true)

      removeDoneCallback(element)
      doneCallbacks.set(element, done)
      element.addEventListener('motioncomplete', done)
    },
  },
  render() {
    return h(
      'transition',
      {
        props: {
          css: !!this.name,
          mode: this.exitBeforeEnter ? 'out-in' : undefined,
          name: this.name,
        },
        on: {
          enter: this.enter,
          leave: this.name ? null : this.exit as any,
        },
      },
      this.$slots.default,
    )
  },
})
