import { type Ref, type WritableComputedRef, computed, watchEffect } from 'vue'
import { set } from './helpers'
import { TRANSITIONS, VELOCITY_THRESHOLD } from './constants'

export function useSnapPoints(
  {
    activeSnapPoint,
    drawerRef,
    fadeFromIndex,
    onSnapPointChange,
    overlayRef,
    snapPoints,
  }: {
    activeSnapPoint: WritableComputedRef<number | string | null | undefined>
    snapPoints: Ref<(number | string)[]>
    fadeFromIndex: Ref<number | undefined> | undefined
    drawerRef: Ref<HTMLElement | undefined>
    overlayRef: Ref<HTMLElement | undefined>
    onSnapPointChange: (index: number) => void
  },
) {
  const isLastSnapPoint = computed(
    () => activeSnapPoint.value === snapPoints?.value?.[snapPoints.value.length - 1],
  )

  const shouldFade = computed(
    () => (snapPoints.value.length > 0 && fadeFromIndex?.value && snapPoints.value[fadeFromIndex.value] === activeSnapPoint.value) || !snapPoints?.value?.length,
  )

  const activeSnapPointIndex = computed(() => {
    return snapPoints?.value?.findIndex(snapPoint => snapPoint === activeSnapPoint.value)
  })

  const snapPointsOffset = computed(() => {
    return snapPoints?.value?.map((snapPoint) => {
      const isPx = typeof snapPoint === 'string'
      let snapPointAsNumber = 0
      if (isPx)
        snapPointAsNumber = Number.parseInt(snapPoint, 10)
      const height = isPx ? snapPointAsNumber : snapPoint * window.innerHeight
      return window.innerHeight - height
    })
  })

  const activeSnapPointOffset = computed(() => {
    return (activeSnapPointIndex.value !== null ? snapPointsOffset.value?.[activeSnapPointIndex.value] : null)
  })

  const snapToPoint = (height: number) => {
    const newSnapPointIndex = snapPointsOffset.value?.findIndex(snapPointHeight => snapPointHeight === height) ?? null
    onSnapPointChange(newSnapPointIndex!)
    set(drawerRef.value, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      transform: `translate3d(0,${height}px,0)`,
    })
    if (
      snapPointsOffset.value
      && newSnapPointIndex !== snapPointsOffset.value.length - 1
      && newSnapPointIndex !== fadeFromIndex?.value
    ) {
      set(overlayRef.value, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        opacity: '0',
      })
    }
    else {
      set(overlayRef.value, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
        opacity: '1',
      })
    }
    // 设置当前激活点
    activeSnapPoint.value = newSnapPointIndex !== null ? snapPoints?.value?.[newSnapPointIndex] : null
  }

  watchEffect(() => {
    if (activeSnapPoint.value) {
      const newIndex = snapPoints?.value?.findIndex(snapPoint => snapPoint === activeSnapPoint.value) ?? null
      if (snapPointsOffset.value && newIndex && typeof snapPointsOffset.value[newIndex] === 'number')
        snapToPoint(snapPointsOffset.value[newIndex])
    }
  })

  function onRelease({
    draggedDistance,
    closeDrawer,
    velocity,
  }: {
    draggedDistance: number
    closeDrawer: () => void
    velocity: number
  }) {
    if (fadeFromIndex === undefined)
      return

    const currentPosition = activeSnapPointOffset.value! - draggedDistance
    const isOverlaySnapPoint = activeSnapPointIndex.value === fadeFromIndex.value! - 1
    const isFirst = activeSnapPointIndex.value === 0

    if (isOverlaySnapPoint) {
      set(overlayRef.value, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(',')})`,
      })
    }

    if (velocity > 2 && draggedDistance < 0) {
      closeDrawer()
      return
    }

    if (velocity > 2 && draggedDistance > 0 && snapPointsOffset && snapPoints) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      snapToPoint(snapPointsOffset?.value?.[snapPoints?.value?.length! - 1] as number)
      return
    }

    // Find the closest snap point to the current position
    const closestSnapPoint = snapPointsOffset.value?.reduce((prev, curr) => {
      if (typeof prev !== 'number' || typeof curr !== 'number')
        return prev

      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev
    })

    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < window.innerHeight * 0.4) {
      // -1 = down, 1 = up, might need a better name
      const dragDirection = draggedDistance > 0 ? 1 : -1

      // Don't do anything if we swipe upwards while being on the last snap point
      if (dragDirection > 0 && isLastSnapPoint.value) {
        snapToPoint(snapPointsOffset?.value![snapPoints!.value!.length - 1])
        return
      }

      if (isFirst && dragDirection < 0)
        closeDrawer()

      if (activeSnapPointIndex.value === null)
        return

      snapToPoint(snapPointsOffset?.value![activeSnapPointIndex.value + dragDirection])
      return
    }

    snapToPoint(closestSnapPoint!)
  }

  function onDrag({ draggedDistance }: { draggedDistance: number }) {
    if (activeSnapPointOffset.value === null)
      return
    const newYValue = activeSnapPointOffset!.value! - draggedDistance

    set(drawerRef.value, {
      transform: `translate3d(0, ${newYValue}px, 0)`,
    })
  }

  function getPercentageDragged(absDraggedDistance: number, isDraggingDown: boolean) {
    if (!snapPoints || typeof activeSnapPointIndex.value !== 'number' || !snapPointsOffset.value || fadeFromIndex!.value === undefined)
      return null

    // If this is true we are dragging to a snap point that is supposed to have an overlay
    const isOverlaySnapPoint = activeSnapPointIndex.value === fadeFromIndex!.value - 1
    const isOverlaySnapPointOrHigher = activeSnapPointIndex.value >= fadeFromIndex!.value

    if (isOverlaySnapPointOrHigher && isDraggingDown)
      return 0

    // Don't animate, but still use this one if we are dragging away from the overlaySnapPoint
    if (isOverlaySnapPoint && !isDraggingDown)
      return 1
    if (!shouldFade.value && !isOverlaySnapPoint)
      return null

    // Either fadeFrom index or the one before
    const targetSnapPointIndex = isOverlaySnapPoint ? activeSnapPointIndex.value + 1 : activeSnapPointIndex.value - 1

    // Get the distance from overlaySnapPoint to the one before or vice-versa to calculate the opacity percentage accordingly
    const snapPointDistance = isOverlaySnapPoint
      ? snapPointsOffset.value[targetSnapPointIndex] - snapPointsOffset.value[targetSnapPointIndex - 1]
      : snapPointsOffset.value[targetSnapPointIndex + 1] - snapPointsOffset.value[targetSnapPointIndex]

    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance)

    if (isOverlaySnapPoint)
      return 1 - percentageDragged

    else
      return percentageDragged
  }

  return {
    isLastSnapPoint,
    shouldFade,
    getPercentageDragged,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset,
  }
}
