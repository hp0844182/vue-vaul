import { type ComputedRef, type InjectionKey, type Ref, type WritableComputedRef, inject } from 'vue'

export const Drawer_INJECTION_KEY
  = Symbol('drawer-context') as InjectionKey<DrawerProvideValue>

export interface DrawerProvideValue {
  drawerRef: Ref<HTMLElement | undefined>
  overlayRef: Ref<HTMLElement | undefined>
  isDragging: Ref<boolean>
  scaleBackground: (open: boolean) => void
  onPress: (event: PointerEvent) => void
  onDrag: (event: PointerEvent) => void
  onRelease: (event: PointerEvent) => void
  onNestedDrag: (event: PointerEvent, percentageDragged: number) => void
  onNestedOpenChange: (o: boolean) => void
  onNestedRelease: (event: PointerEvent, open: boolean) => void
  dismissible: Ref<boolean>
  isOpen: Ref<boolean | undefined>
  snapPointsOffset: ComputedRef<number[]>
  snapPoints: Ref<(number | string)[]>
  modal: Ref<boolean>
  shouldFade: ComputedRef<boolean>
  activeSnapPoint: WritableComputedRef<string | number | undefined>
  visible: Ref<boolean>
  closeDrawer: () => void
  openProp?: Ref<boolean | undefined>
  onOpenChange?: (o: boolean) => void
}

export function useDrawerContext() {
  return inject(Drawer_INJECTION_KEY)!
}
