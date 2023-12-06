import { type Ref, onMounted, onUnmounted, ref, watchEffect } from 'vue'

let previousBodyPosition: Record<string, string> | null = null

export function usePositionFixed({
  isOpen,
  modal,
  nested,
  hasBeenOpened,
}: {
  isOpen: Ref<boolean | undefined>
  modal: Ref<boolean>
  nested: Ref<boolean | undefined>
  hasBeenOpened: Ref<boolean>
}) {
  const activeUrl = ref(window.location.href)
  let scrollPos = 0

  function setPositionFixed() {
    // If previousBodyPosition is already set, don't set it again.
    if (previousBodyPosition === null && isOpen.value) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        height: document.body.style.height,
      }

      // Update the dom inside an animation frame
      const { scrollX, innerHeight } = window

      document.body.style.setProperty('position', 'fixed', 'important')
      document.body.style.top = `${-scrollPos}px`
      document.body.style.left = `${-scrollX}px`
      document.body.style.right = '0px'
      document.body.style.height = 'auto'

      setTimeout(
        () =>
          requestAnimationFrame(() => {
            // Attempt to check if the bottom bar appeared due to the position change
            const bottomBarHeight = innerHeight - window.innerHeight
            if (bottomBarHeight && scrollPos >= innerHeight) {
              // Move the content further up so that the bottom bar doesn't hide it
              document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`
            }
          }),
        300,
      )
    }
  }

  function restorePositionSetting() {
    if (previousBodyPosition !== null) {
      // Convert the position from "px" to Int
      const y = -Number.parseInt(document.body.style.top, 10)
      const x = -Number.parseInt(document.body.style.left, 10)

      // Restore styles
      document.body.style.position = previousBodyPosition.position
      document.body.style.top = previousBodyPosition.top
      document.body.style.left = previousBodyPosition.left
      document.body.style.height = previousBodyPosition.height
      document.body.style.right = 'unset'

      requestAnimationFrame(() => {
        if (activeUrl.value !== window.location.href) {
          activeUrl.value = window.location.href
          return
        }

        window.scrollTo(x, y)
      })

      previousBodyPosition = null
    }
  }

  function onScroll() {
    scrollPos = window.screenY
  }
  onMounted(() => {
    // onScroll()
    window.addEventListener('scroll', onScroll)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  watchEffect(() => {
    if (!activeUrl.value || nested.value || !hasBeenOpened.value)
      return
    if (isOpen.value) {
      setPositionFixed()
      if (!modal) {
        setTimeout(() => {
          restorePositionSetting()
        }, 500)
      }
    }

    else { restorePositionSetting() }
  })

  return { restorePositionSetting }
}
