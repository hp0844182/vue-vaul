/* eslint-disable no-template-curly-in-string */
import { join } from 'node:path'
import releaseIt from 'release-it'

const PLUGIN_PATH = join(__dirname, '../compiler/vant-cli-release-plugin.js')

export async function release(command: { tag?: string }) {
  await releaseIt({
    plugins: {
      [PLUGIN_PATH]: {},
    },
    npm: {
      tag: command.tag,
    },
    git: {
      tagName: 'v${version}',
      commitMessage: 'chore: release ${version}',
    },
  })
}
