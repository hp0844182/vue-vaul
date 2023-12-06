import { existsSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { get } from 'lodash'
import { SRC_DIR, STYLE_DIR } from './constant'
import { getVantConfig } from '.'

type ICSS_LANG = 'css' | 'less' | 'scss'

function getCssLang(): ICSS_LANG {
  const vantConfig = getVantConfig()
  const preprocessor = get(vantConfig, 'build.css.preprocessor', 'less')

  if (preprocessor === 'sass')
    return 'scss'

  return preprocessor
}

export const CSS_LANG = getCssLang()

export function getCssBaseFile() {
  const vantConfig = getVantConfig()
  let path = join(STYLE_DIR, `base.${CSS_LANG}`)

  const baseFile = get(vantConfig, 'build.css.base', '')
  if (baseFile)
    path = isAbsolute(baseFile) ? baseFile : join(SRC_DIR, baseFile)

  if (existsSync(path))
    return path

  return null
}

const IMPORT_STYLE_RE = /import\s+?(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g

// "import 'a.less';" => "import 'a.css';"
export function replaceCssImportExt(code: string) {
  return code.replace(IMPORT_STYLE_RE, str =>
    str.replace(`.${CSS_LANG}`, '.css'),
  )
}
