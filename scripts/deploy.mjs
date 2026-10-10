import {spawn} from 'node:child_process'
import {createRequire} from 'node:module'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'

const require = createRequire(import.meta.url)
const child = spawn(process.execPath, [
  require.resolve('gh-pages/bin/gh-pages.js'), '-d', 'build', ...process.argv.slice(2)
], {
  cwd: fileURLToPath(new URL('../', import.meta.url)),
  stdio: 'inherit',
  windowsHide: true,
  // Keep Git's cache paths short enough for Windows checkouts in OneDrive folders.
  env: {...process.env, CACHE_DIR: process.env.CACHE_DIR || join(tmpdir(), 'programming-quotes')}
})
child.on('error', error => {
  console.error(`Unable to publish: ${error.message}`)
  process.exitCode = 1
})
child.on('close', code => { process.exitCode = code ?? 1 })
