import { parse } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { replaceExt } from '../common'
import { consola } from '../common/logger'
import { compileCss } from './compile-css'
import { compileLess } from './compile-less'
import { compileSass } from './compile-sass'

async function compileFile(filePath: string) {
  const parsedPath = parse(filePath)

  try {
    if (parsedPath.ext === '.less') {
      const source = await compileLess(filePath)
      return await compileCss(source)
    }

    if (parsedPath.ext === '.scss') {
      const source = await compileSass(filePath)
      return await compileCss(source)
    }

    const source = readFileSync(filePath, 'utf-8')
    return await compileCss(source)
  }
  catch (err) {
    consola.error(`Compile style failed: ${filePath}`)
    throw err
  }
}

export async function compileStyle(filePath: string) {
  const css = await compileFile(filePath)

  writeFileSync(replaceExt(filePath, '.css'), css)
}
