import type { InjectionKey, Ref } from 'vue'

export interface DialogProvideValue {
  open: Readonly<Ref<boolean>>
  modal: Ref<boolean>
  openModal(): void
  onOpenChange(value: boolean): void
  onOpenToggle(): void
  triggerElement: Ref<HTMLElement | undefined>
  contentElement: Ref<HTMLElement | undefined>
  contentId: string
  titleId: string
  descriptionId: string
}

export const DIALOG_INJECTION_KEY
  = Symbol('dialog-context') as InjectionKey<DialogProvideValue>
