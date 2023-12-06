import { type CloneFn, isDef } from '@vueuse/core'
import { computed, getCurrentInstance, ref } from 'vue'

export interface UseVModelOptions<T, Passive extends boolean = false> {
  /**
   * When passive is set to `true`, it will use `watch` to sync with props and ref.
   * Instead of relying on the `v-model` or `.sync` to work.
   *
   * @default false
   */
  passive?: Passive
  /**
   * When eventName is set, it's value will be used to overwrite the emit event name.
   *
   * @default undefined
   */
  eventName?: string
  /**
   * Attempting to check for changes of properties in a deeply nested object or array.
   * Apply only when `passive` option is set to `true`
   *
   * @default false
   */
  deep?: boolean
  /**
   * Defining default value for return ref when no value is passed.
   *
   * @default undefined
   */
  defaultValue?: T
  /**
   * Clone the props.
   * Accepts a custom clone function.
   * When setting to `true`, it will use `JSON.parse(JSON.stringify(value))` to clone.
   *
   * @default false
   */
  clone?: boolean | CloneFn<T>
  /**
   * The hook before triggering the emit event can be used for form validation.
   * if false is returned, the emit event will not be triggered.
   *
   * @default undefined
   */
  shouldEmit?: (v: T) => boolean
}
export function useVModel<P extends object, K extends keyof P, Name extends string, Passive extends boolean>(
  props: P,
  key?: K,
  emit?: (name: Name, ...args: any[]) => void,
  options: UseVModelOptions<P[K], Passive> = {},
) {
  const {
    eventName,
    defaultValue,
  } = options
  const vm = getCurrentInstance()
  const _emit = emit || vm?.proxy?.$emit?.bind(vm?.proxy)
  let event: string | undefined = eventName

  if (!key) {
    const modelOptions = vm?.proxy?.$options?.model
    key = (modelOptions as any)?.value || 'value' as K
    if (!eventName)
      event = modelOptions?.event || 'input'
  }

  event = event || `update:${key!.toString()}`
  const initVal = isDef(props[key!]) ? props[key!] : defaultValue
  const innerVal = ref<P[K]>(initVal as any)
  const getValue = () => isDef(props[key!])
    ? props[key!]
    : innerVal.value as P[K]

  const triggerEmit = (value: P[K]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    innerVal.value = value
    _emit?.(event as any, value)
  }
  return computed<P[K]>({
    get() {
      return getValue()!
    },
    set(value) {
      triggerEmit(value)
    },
  })
}
