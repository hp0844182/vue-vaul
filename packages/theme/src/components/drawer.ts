export default {
  /**
   * Custom utilities
   */
  '[vaul-drawer]': {
    'touch-action': 'none',
    'transform': 'translate3d(0, 100%, 0)',
    'transition': 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
  },
  '.vaul-dragging .vaul-scrollable': {
    'overflow-y': 'hidden !important',
  },
  '[vaul-drawer][vaul-drawer-visible=\'true\']': {
    transform: 'translate3d(0, var(--snap-point-height, 0), 0)',
  },
  '[vaul-overlay]': {
    opacity: '0',
    transition: 'opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
  },
  '[vaul-drawer]::after': {
    'content': '\'\'',
    'position': 'absolute',
    'top': '100%',
    'background': 'inherit',
    'background-color': 'inherit',
    'left': '0',
    'right': '0',
    'height': '200%',
  },
  '[vaul-overlay][vaul-snap-points-overlay=\'true\']:not([vaul-drawer-visible=\'false\'])': {
    opacity: '1',
  },
  '@media (hover: hover) and (pointer: fine)': {
    '[vaul-drawer]': {
      'user-select': 'none',
    },
  },
}
