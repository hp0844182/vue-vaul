import { runCLI } from 'jest'
import { setNodeEnv } from '../common'
import { genPackageEntry } from '../compiler/gen-package-entry'
import { JEST_CONFIG_FILE, PACKAGE_ENTRY_FILE, ROOT } from '../common/constant'

export function test(command: any) {
  setNodeEnv('test')

  genPackageEntry({
    outputPath: PACKAGE_ENTRY_FILE,
  })

  const config = {
    rootDir: ROOT,
    watch: command.watch,
    config: JEST_CONFIG_FILE,
    clearCache: command.clearCache,
    changedSince: command.changedSince,
    logHeapUsage: command.logHeapUsage,
    runInBand: command.runInBand,
    debug: command.debug,
  } as any

  runCLI(config, [ROOT])
    .then((response) => {
      if (!response.results.success && !command.watch)
        process.exit(1)
    })
    .catch((err) => {
      console.log(err)

      if (!command.watch)
        process.exit(1)
    })
}
