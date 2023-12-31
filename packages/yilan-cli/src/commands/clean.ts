import { remove } from 'fs-extra'
import {
  DIST_DIR,
  ES_DIR,
  LIB_DIR,
  SITE_DIST_DIR,
  VETUR_DIR,
} from '../common/constant'

export async function clean() {
  await Promise.all([
    remove(ES_DIR),
    remove(LIB_DIR),
    remove(DIST_DIR),
    remove(VETUR_DIR),
    remove(SITE_DIST_DIR),
  ])
}
