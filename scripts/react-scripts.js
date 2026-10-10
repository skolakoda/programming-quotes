const {spawnSync} = require('child_process')

const script = process.argv[2]
const nodeArgs = Number(process.versions.openssl.split('.')[0]) >= 3
  ? ['--openssl-legacy-provider']
  : []

const result = spawnSync(process.execPath, [
  ...nodeArgs,
  require.resolve(`react-scripts/scripts/${script}`)
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    REACT_APP_DATA_MODE: process.argv[3] || process.env.REACT_APP_DATA_MODE || 'local',
    REACT_APP_ENV: script === 'start' ? 'development' : 'production'
  }
})

if (result.error) throw result.error
process.exit(result.status === null ? 1 : result.status)
