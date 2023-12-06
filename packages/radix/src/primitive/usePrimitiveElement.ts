import { type ComponentPublicInstance, computed, ref } from 'vue'

function getElement(el: Element) {
  if (['#text', '#comment'].includes(el?.nodeName))
    return getElement(el.nextElementSibling!)

  else
    return el
}
export function usePrimitiveElement() {
  const primitiveElement = ref<ComponentPublicInstance>()

  // @ts-expect-error no check
  const currentElement = computed<HTMLElement>(() => {
    return getElement(primitiveElement.value?.$el as Element)
  })

  return {
    primitiveElement,
    currentElement,
  }
}
