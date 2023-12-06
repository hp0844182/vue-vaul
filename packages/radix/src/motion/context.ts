import { type Ref } from 'vue'

export const contextId = 'motion-state'
export const presenceId = 'motion-presence'

export interface PresenceState {
  initial?: boolean | undefined
  transition: Ref<object | null>
}
