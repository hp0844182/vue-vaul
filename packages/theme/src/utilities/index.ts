import drawer from '../components/drawer'
import transition from './transition'
import custom from './custom'
import scrollbarHide from './scrollbar-hide'

export const utilities = {
  ...custom,
  ...transition,
  ...scrollbarHide,
  ...drawer,
}
