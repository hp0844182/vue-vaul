import type { Ref } from 'vue'
import type { SnapPoint } from './types'

interface Style {
  [key: string]: string
}

const cache = new WeakMap()

export function isInView(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()

  if (!window.visualViewport)
    return false

  return (
    rect.top >= 0
    && rect.left >= 0
    // Need + 40 for safari detection
    && rect.bottom <= window.visualViewport.height - 40
    && rect.right <= window.visualViewport.width
  )
}

export function set(el?: Element | HTMLElement | null, styles?: Style, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement) || !styles)
    return
  const originalStyles: Style = {}

  Object.entries(styles).forEach(([key, value]: [string, string]) => {
    if (key.startsWith('--')) {
      el.style.setProperty(key, value)
      return
    }

    originalStyles[key] = (el.style as any)[key];
    (el.style as any)[key] = value
  })

  if (ignoreCache)
    return
  cache.set(el, originalStyles)
}

export function reset(el: Element | HTMLElement | null, prop?: string) {
  if (!el || !(el instanceof HTMLElement))
    return
  const originalStyles = cache.get(el)

  if (!originalStyles) {
    (el.style as any) = {}
    return
  }

  if (prop) {
    (el.style as any)[prop] = originalStyles[prop]
  }
  else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      (el.style as any)[key] = value
    })
  }
}

export function getTranslateY(element: HTMLElement): number | null {
  const style = window.getComputedStyle(element)
  const transform
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    = style.transform || style.webkitTransform || style.mozTransform
  let mat = transform.match(/^matrix3d\((.+)\)$/)
  if (mat)
    return Number.parseFloat(mat[1].split(', ')[13])
  mat = transform.match(/^matrix\((.+)\)$/)
  return mat ? Number.parseFloat(mat[1].split(', ')[5]) : null
}

export function dampenValue(v: number) {
  return 8 * (Math.log(v + 1) - 2)
}

function testPlatform(re: RegExp): boolean | undefined {
  return typeof window !== 'undefined' && window.navigator != null ? re.test(window.navigator.platform) : undefined
}

function isMac(): boolean | undefined {
  return testPlatform(/^Mac/)
}
function isIPad(): boolean | undefined {
  return (
    testPlatform(/^iPad/)
    // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    || (isMac() && navigator.maxTouchPoints > 1)
  )
}

function isIPhone(): boolean | undefined {
  return testPlatform(/^iPhone/)
}

export function isIOS(): boolean | undefined {
  return isIPhone() || isIPad()
}

const nonTextInputTypes = new Set([
  'checkbox',
  'radio',
  'range',
  'color',
  'file',
  'image',
  'button',
  'submit',
  'reset',
])
export function isInput(target: Element) {
  return (
    (target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type))
    || target instanceof HTMLTextAreaElement
    || (target instanceof HTMLElement && target.isContentEditable)
  )
}

export function getSnapPointHeight(snapPoint: SnapPoint | number, drawerRef: Ref<HTMLElement | undefined>) {
  if (!drawerRef.value)
    return
  const drawerHeight = drawerRef.value.getBoundingClientRect().height
  const fraction = typeof snapPoint === 'number' ? snapPoint : snapPoint.fraction

  const snapPointHeight = fraction * drawerHeight
  return drawerHeight - snapPointHeight
}
