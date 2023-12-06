import { type ComputedRef, type Ref, onMounted, onUnmounted, watch } from 'vue'
import { isInput } from './helpers'
import { WINDOW_TOP_OFFSET } from './constants'

interface Options {
  drawerRef: Ref<HTMLDivElement | undefined>
  snapPoints: Ref<(string | number)[]>
  snapPointsOffset: ComputedRef<number[]>
  fixed: Ref<boolean | undefined>
  activeSnapPointIndex: ComputedRef<number>
  visible: Ref<boolean>
}
/**
 * Handles the input focus for the drawer element.
 *
 * @param {Options} options - The options object containing the parameters used in the function.
 * @param {Ref<HTMLElement | null>} options.drawerRef - The reference to the drawer element.
 * @param {Ref<number[]>} options.snapPoints - The array of snap points.
 * @param {Ref<number[]>} options.snapPointsOffset - The array of snap point offsets.
 * @param {Ref<boolean>} options.fixed - Determines if the drawer is fixed.
 * @param {Ref<number | null>} options.activeSnapPointIndex - The index of the active snap point.
 * @param {Ref<boolean>} options.visible - Determines if the drawer is visible.
 */
export function useInputFocus({
  drawerRef,
  snapPoints,
  snapPointsOffset,
  fixed,
  activeSnapPointIndex,
  visible,
}: Options) {
  // Initialize variables
  let initialDrawerHeight = 0
  let previousDiffFromInitial = 0
  let keyboardIsOpen = false

  // Watch for changes in visibility
  watch(visible, () => {
    if (visible.value) {
      // Request animation frame to ensure accurate height measurement
      requestAnimationFrame(() => {
        initialDrawerHeight = drawerRef.value?.getBoundingClientRect().height as number
      })
    }
  }, {
    immediate: true,
  })

  /**
   * Handles the visual viewport change event.
   */
  function onVisualViewportChange() {
    if (!drawerRef.value)
      return

    const focusedElement = document.activeElement as HTMLElement

    // Check if the focused element is an input or if the keyboard is open
    if (isInput(focusedElement) || keyboardIsOpen) {
      const visualViewportHeight = window.visualViewport?.height || 0
      let diffFromInitial = window.innerHeight - visualViewportHeight
      const drawerHeight = drawerRef.value.getBoundingClientRect().height || 0

      // Store the initial drawer height if not already set
      if (!initialDrawerHeight)
        initialDrawerHeight = drawerHeight

      const offsetFromTop = drawerRef.value.getBoundingClientRect().top

      // Check if the keyboard really changed its open state by comparing the height change
      if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60)
        keyboardIsOpen = !keyboardIsOpen

      // Add the height of the active snap point if applicable
      if (snapPoints.value.length > 0 && snapPointsOffset.value.length && activeSnapPointIndex.value) {
        const activeSnapPointHeight = snapPointsOffset.value[activeSnapPointIndex.value] || 0
        diffFromInitial += activeSnapPointHeight
      }

      previousDiffFromInitial = diffFromInitial

      if (drawerHeight > visualViewportHeight || keyboardIsOpen) {
        const height = drawerRef.value.getBoundingClientRect().height
        let newDrawerHeight = height

        if (height > visualViewportHeight)
          newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET

        // Adjust the height of the drawer when fixed
        if (fixed)
          drawerRef.value.style.height = `${height - Math.max(diffFromInitial, 0)}px`
        else
          drawerRef.value.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`
      }
      else {
        drawerRef.value.style.height = `${initialDrawerHeight}px`
      }

      if (snapPoints && snapPoints.value.length > 0 && !keyboardIsOpen)
        drawerRef.value.style.bottom = '0px'

      else
        drawerRef.value.style.bottom = `${Math.max(diffFromInitial, 0)}px`
    }
  }

  // Attach event listener on mount
  onMounted(() => {
    window.visualViewport?.addEventListener('resize', onVisualViewportChange)
  })

  onUnmounted(() => {
    window.visualViewport?.removeEventListener('resize', onVisualViewportChange)
  })
}
