<script setup lang="ts">
import { isIOS, toRefs } from '@vueuse/core'
import { computed, onUnmounted, provide, ref, watchEffect } from 'vue'
import { DialogRoot, useVModel } from 'radix-vue2'
import { dampenValue, getTranslateY, isInput, reset, set } from './helpers'
import { BORDER_RADIUS, CLOSE_THRESHOLD, DRAG_CLASS, NESTED_DISPLACEMENT, SCROLL_LOCK_TIMEOUT, TRANSITIONS, VELOCITY_THRESHOLD, WINDOW_TOP_OFFSET } from './constants'
import { Drawer_INJECTION_KEY } from './context'
import { usePreventScroll } from './usePreventScroll'
import { useSnapPoints } from './useSnapPoints'
import { usePositionFixed } from './usePositionFixed'
import { useInputFocus } from './useInputFocus'

const props = withDefaults(defineProps<DrawerProps>(), {
  shouldScaleBackground: false,
  defaultOpen: false,
  open: undefined,
  dismissible: true,
  snapPoints: () => [],
  fadeFromIndex: (propVal) => {
    return propVal?.snapPoints?.length && propVal.snapPoints.length - 1
  },
  modal: true,
  nested: undefined,
  scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
  fixed: undefined,
  closeThreshold: CLOSE_THRESHOLD,
})
const emits = defineEmits<DrawerEmits>()
interface WithFadeFromProps {
  snapPoints: (number | string)[]
  fadeFromIndex: number
}
interface WithoutFadeFromProps {
  snapPoints?: (number | string)[]
  fadeFromIndex?: never
}
type DrawerProps = {
  open?: boolean
  defaultOpen?: boolean
  shouldScaleBackground?: boolean
  dismissible?: boolean
  snapPoints?: (number | string)[]
  activeSnapPoint?: string | number
  modal?: boolean
  nested?: boolean
  scrollLockTimeout?: number
  fixed?: boolean
  closeThreshold?: number
} & (WithoutFadeFromProps | WithFadeFromProps)
interface DrawerEmits {
  (e: 'update:open', v: boolean): void
  (e: 'drag', p: PointerEvent, percentageDragged: number): void
  (e: 'release', p: PointerEvent, open: boolean): void
  (e: 'snapPointChange', snapPoint: number | string): void
  (e: 'close'): void

}

const {
  defaultOpen, shouldScaleBackground,
  dismissible, snapPoints, fadeFromIndex, nested, modal, scrollLockTimeout, fixed, open: openProp,
  closeThreshold,
} = toRefs(props)

const isOpen = useVModel(props, 'open', emits, {
  defaultValue: defaultOpen.value,
})

const overlayRef = ref<HTMLDivElement>()
const drawerRef = ref<HTMLDivElement>()
const hasBeenOpened = ref(false)
const justReleased = ref(false)
const visible = ref(false)
let dragStartTime: Date | null = null
let dragEndTime: Date | null = null
let lastTimeDragPrevented: Date | null = null
let pointerStartY = 0
let drawerHeightRef = 0
const isDragging = ref(false)
let openTime: Date | null = null
const isPreventScroll = computed(() => {
  return !isOpen.value || isDragging.value || !modal.value || justReleased.value || !hasBeenOpened.value
})
usePreventScroll({
  isDisabled: isPreventScroll,
})

const activeSnapPoint = useVModel(props, 'activeSnapPoint', emits)

const {
  snapPointsOffset, activeSnapPointIndex,
  onDrag: onDragSnapPoints,
  getPercentageDragged: getSnapPointsPercentageDragged,
  shouldFade,
  onRelease: onReleaseSnapPoints,
} = useSnapPoints({
  snapPoints,
  activeSnapPoint,
  drawerRef,
  overlayRef,
  fadeFromIndex,
  onSnapPointChange(activeSnapPointIndex) {
    emits('snapPointChange', activeSnapPoint as any)
    if (snapPoints.value.length && activeSnapPointIndex === snapPointsOffset.value.length - 1)
      openTime = new Date()
  },
})

const { restorePositionSetting } = usePositionFixed({
  isOpen,
  modal,
  nested,
  hasBeenOpened,
})

/**
 * input focus
 */
useInputFocus({
  activeSnapPointIndex,
  drawerRef,
  fixed,
  snapPoints,
  snapPointsOffset,
  visible,
})

function getScale() {
  return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth
}

let isPointerDown = false
let isAllowedToDrag = false
function onPress(e: PointerEvent) {
  if (!dismissible.value && !snapPoints.value.length)
    return
  if (drawerRef.value && !drawerRef.value.contains(e.target as Node))
    return

  drawerHeightRef = drawerRef.value?.getBoundingClientRect().height || 0
  isPointerDown = true
  dragStartTime = new Date()
  // iOS doesn't trigger mouseUp after scrolling so we need to listen to touched in order to disallow dragging
  if (isIOS) {
    window.addEventListener('touchend', () => {
      isAllowedToDrag = false
    }, { once: true })
  }
  // 确保指针在dom外也能监听到事件
  (e.target as HTMLElement).setPointerCapture(e.pointerId)
  pointerStartY = e.screenY
}

function shouldDrag(el: EventTarget, isDraggingDown: boolean) {
  let element = el as HTMLElement
  const date = new Date()
  const highlightedText = window.getSelection()?.toString() || ''
  const swipeAmount = drawerRef.value ? getTranslateY(drawerRef.value) : null

  // Allow scrolling when animating
  if (openTime && date.getTime() - openTime.getTime() < 500)
    return false

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (swipeAmount > 0)
    return true

  // Don't drag if there's highlighted text
  if (highlightedText?.length > 0)
    return false

  // Disallow dragging if drawer was scrolled within `scrollLockTimeout`
  if (lastTimeDragPrevented && (date.getTime() - lastTimeDragPrevented.getTime() < scrollLockTimeout.value)
     && swipeAmount === 0) {
    lastTimeDragPrevented = new Date()
    return false
  }

  if (isDraggingDown) {
    lastTimeDragPrevented = new Date()

    // We are dragging down so we should allow scrolling
    return false
  }

  // Keep climbing up the DOM tree as long as there's a parent
  while (element) {
    // Check if the element is scrollable
    if (element.scrollHeight > element.clientHeight) {
      if (element.scrollTop !== 0) {
        lastTimeDragPrevented = new Date()
        return false
      }
      if (element.getAttribute('role') === 'dialog')
        return true
    }
    // Move up to the parent element
    element = element.parentNode as HTMLElement
  }

  // No scrollable parents not scrolled to the top found, so drag
  return true
}

function onDrag(event: PointerEvent) {
  // We need to know how much of the drawer has been dragged in percentages so that we can transform background accordingly
  if (isPointerDown) {
    const draggedDistance = pointerStartY - event.screenY
    const isDraggingDown = draggedDistance > 0

    // Disallow dragging down to close when first snap point is the active one and dismissible prop is set to false.
    if (snapPoints.value.length && activeSnapPointIndex.value === 0 && !dismissible.value)
      return

    if (!isAllowedToDrag && !shouldDrag(event.target!, isDraggingDown))
      return
    drawerRef.value?.classList.add(DRAG_CLASS)

    isDragging.value = true
    // If shouldDrag gave true once after pressing down on the drawer, we set isAllowedToDrag to true and it will remain true until we let go, there's no reason to disable dragging mid way, ever, and that's the solution to it
    isAllowedToDrag = true

    set(drawerRef.value, {
      transition: 'none',
    })

    set(overlayRef.value, {
      transition: 'none',
    })

    if (snapPoints.value.length)
      onDragSnapPoints({ draggedDistance })

    // Run this only if snapPoints are not defined or if we are at the last snap point (highest one)
    if (isDraggingDown && !snapPoints.value.length) {
      const dampenedDraggedDistance = dampenValue(draggedDistance)

      set(drawerRef.value, {
        transform: `translate3d(0, ${Math.min(dampenedDraggedDistance * -1, 0)}px, 0)`,
      })
      return
    }

    // We need to capture last time when drag with scroll was triggered and have a timeout between
    const absDraggedDistance = Math.abs(draggedDistance)
    const wrapper = document.querySelector('[vaul-drawer-wrapper]')

    let percentageDragged = absDraggedDistance / drawerHeightRef
    const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingDown)
    if (snapPointPercentageDragged !== null)
      percentageDragged = snapPointPercentageDragged

    const opacityValue = 1 - percentageDragged

    if (shouldFade.value || (fadeFromIndex.value && activeSnapPointIndex.value === fadeFromIndex.value - 1)) {
      emits('drag', event, percentageDragged)
      set(
        overlayRef.value,
        {
          opacity: `${opacityValue}`,
          transition: 'none',
        },
        true,
      )
    }

    if (wrapper && overlayRef.value && shouldScaleBackground.value) {
      // Calculate percentageDragged as a fraction (0 to 1)
      const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1)
      const borderRadiusValue = 8 - percentageDragged * 8

      const translateYValue = Math.max(0, 14 - percentageDragged * 14)

      set(
        wrapper,
        {
          borderRadius: `${borderRadiusValue}px`,
          transform: `scale(${scaleValue}) translate3d(0, ${translateYValue}px, 0)`,
          transition: 'none',
        },
        true,
      )
    }

    if (!snapPoints.value.length) {
      set(drawerRef.value, {
        transform: `translate3d(0, ${absDraggedDistance}px, 0)`,
      })
    }
  }
}

onUnmounted(() => {
  scaleBackground(false)
  restorePositionSetting()
})

function closeDrawer() {
  if (!drawerRef.value)
    return
  emits('close')
  if (drawerRef.value) {
    set(drawerRef.value, {
      transform: 'translate3d(0, 100%, 0)',
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    })

    set(overlayRef.value, {
      opacity: '0',
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    })

    scaleBackground(false)
  }

  setTimeout(() => {
    visible.value = false
    isOpen.value = false
  }, 300)

  setTimeout(() => {
    if (snapPoints.value.length)
      activeSnapPoint.value = snapPoints.value[0]
  }, 500)
}

watchEffect((cleanUp) => {
  if (!isOpen.value && shouldScaleBackground.value) {
    // Can't use `onAnimationEnd` as the component will be invisible by then
    const id = setTimeout(() => {
      reset(document.body)
    }, 200)

    cleanUp(() => {
      clearTimeout(id)
    })
  }
})

function resetDrawer() {
  if (!drawerRef.value)
    return
  const wrapper = document.querySelector('[vaul-drawer-wrapper]')
  const currentSwipeAmount = getTranslateY(drawerRef.value)

  set(drawerRef.value, {
    transform: 'translate3d(0, 0, 0)',
    transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
  })

  set(overlayRef.value, {
    transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    opacity: '1',
  })

  // Don't reset background if swiped upwards
  if (shouldScaleBackground.value && currentSwipeAmount && currentSwipeAmount > 0 && isOpen.value) {
    set(
      wrapper,
      {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: 'hidden',
        transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
        transformOrigin: 'top',
        transitionProperty: 'transform, border-radius',
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      },
      true,
    )
  }
}

function onRelease(event: PointerEvent) {
  if (!isDragging.value || !drawerRef.value)
    return
  if (isAllowedToDrag && isInput(event.target as HTMLElement)) {
    // If we were just dragging, prevent focusing on inputs etc. on release
    (event.target as HTMLInputElement).blur()
  }
  isPointerDown = false
  isAllowedToDrag = false
  isDragging.value = false
  dragEndTime = new Date()
  const swipeAmount = getTranslateY(drawerRef.value)

  if (!shouldDrag(event.target!, false) || !swipeAmount || Number.isNaN(swipeAmount))
    return

  if (dragStartTime === null)
    return

  const y = event.screenY

  const timeTaken = dragEndTime.getTime() - dragStartTime.getTime()
  const distMoved = pointerStartY - y
  const velocity = Math.abs(distMoved) / timeTaken

  if (velocity > 0.05) {
    // `justReleased` is needed to prevent the drawer from focusing on an input when the drag ends, as it's not the intent most of the time.
    justReleased.value = true
    setTimeout(() => {
      justReleased.value = false
    }, 200)
  }

  if (snapPoints.value.length) {
    onReleaseSnapPoints({
      draggedDistance: distMoved,
      closeDrawer,
      velocity,
    })
    return
  }

  // Moved upwards, don't do anything
  if (distMoved > 0) {
    resetDrawer()
    emits('release', event, true)
    return
  }

  if (velocity > VELOCITY_THRESHOLD) {
    closeDrawer()
    emits('release', event, false)
    return
  }

  const visibleDrawerHeight = Math.min(drawerRef.value.getBoundingClientRect().height || 0, window.innerHeight)

  if (swipeAmount >= visibleDrawerHeight * closeThreshold.value) {
    closeDrawer()
    emits('release', event, false)
    return
  }

  emits('release', event, true)
  resetDrawer()
}

watchEffect(() => {
  if (isOpen.value) {
    openTime = new Date()
    scaleBackground(true)
  }
})

function scaleBackground(open: boolean) {
  const wrapper = document.querySelector('[vaul-drawer-wrapper]')

  if (!wrapper || !shouldScaleBackground.value)
    return

  if (open) {
    set(
      document.body,
      {
        background: 'black',
      },
      true,
    )

    set(wrapper, {
      borderRadius: `${BORDER_RADIUS}px`,
      overflow: 'hidden',
      transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
      transformOrigin: 'top',
      transitionProperty: 'transform, border-radius',
      transitionDuration: `${TRANSITIONS.DURATION}s`,
      transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    })
  }
  else {
    // Exit
    reset(wrapper, 'overflow')
    reset(wrapper, 'transform')
    reset(wrapper, 'borderRadius')
    set(wrapper, {
      transitionProperty: 'transform, border-radius',
      transitionDuration: `${TRANSITIONS.DURATION}s`,
      transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    })
  }
}

let nestedOpenChangeTimer: null | number = null
function onNestedOpenChange(o: boolean) {
  const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1
  const y = o ? -NESTED_DISPLACEMENT : 0

  if (nestedOpenChangeTimer)
    window.clearTimeout(nestedOpenChangeTimer)

  set(drawerRef.value, {
    transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
    transform: `scale(${scale}) translate3d(0, ${y}px, 0)`,
  })

  if (!o && drawerRef.value) {
    nestedOpenChangeTimer = setTimeout(() => {
      set(drawerRef.value, {
        transition: 'none',
        transform: `translate3d(0, ${getTranslateY(drawerRef.value as HTMLElement)}px, 0)`,
      })
    }, 500)
  }
}

function onNestedDrag(event: PointerEvent, percentageDragged: number) {
  if (percentageDragged < 0)
    return
  const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth
  const newScale = initialScale + percentageDragged * (1 - initialScale)
  const newY = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT

  set(drawerRef.value, {
    transform: `scale(${newScale}) translate3d(0, ${newY}px, 0)`,
    transition: 'none',
  })
}

function onNestedRelease(event: PointerEvent, o: boolean) {
  const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1
  const y = o ? -NESTED_DISPLACEMENT : 0

  if (o) {
    set(drawerRef.value, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      transform: `scale(${scale}) translate3d(0, ${y}px, 0)`,
    })
  }
}

provide(Drawer_INJECTION_KEY, {
  drawerRef,
  overlayRef,
  scaleBackground,
  onPress,
  onRelease,
  onNestedDrag,
  onNestedOpenChange,
  onNestedRelease,
  dismissible,
  isOpen,
  snapPointsOffset,
  snapPoints,
  modal,
  shouldFade,
  activeSnapPoint,
  visible,
  closeDrawer,
  openProp,
  onDrag,
  onOpenChange: () => {

  },
  isDragging,
})
function handleOpenChange(o: boolean) {
  emits('update:open', o)
  if (!o) {
    closeDrawer()
  }
  else {
    hasBeenOpened.value = true
    isOpen.value = true
  }
}
</script>

<template>
  <DialogRoot
    :modal="modal"
    :open="isOpen"
    @update:open="handleOpenChange"
  >
    <slot />
  </DialogRoot>
</template>
