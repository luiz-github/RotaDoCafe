const { existsSync, readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { spawnSync } = require('node:child_process')

const projectRoot = resolve(__dirname, '..')
const envFilePath = resolve(projectRoot, '.maestro', '.env')
const flowsDir = resolve(projectRoot, '.maestro', 'flows')

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {}
  }

  const env = {}
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')

    if (key) {
      env[key] = value
    }
  }

  return env
}

const targetArg = process.argv[2] || 'all'
const targetPath = targetArg === 'all' ? flowsDir : resolve(flowsDir, `${targetArg}.yml`)

if (!existsSync(targetPath)) {
  console.error(`Maestro target not found: ${targetPath}`)
  process.exit(1)
}

const rootEnvPath = resolve(projectRoot, '.env')
const parsedRootEnv = parseEnvFile(rootEnvPath)
const parsedMaestroEnv = parseEnvFile(envFilePath)

const mergedEnv = { ...parsedRootEnv, ...parsedMaestroEnv }

const envParts = Object.entries(mergedEnv)
  .map(([key, value]) => `-e "${key}=${value}"`)
  .join(' ')

const command = `maestro test "${targetPath}" ${envParts}`

const result = spawnSync(command, {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, ...mergedEnv },
  shell: true,
})

if (result.error) {
  if (result.error.code === 'ENOENT') {
    console.error('Maestro CLI not found in PATH. Install Maestro and try again.')
  } else {
    console.error(`Failed to run Maestro: ${result.error.message}`)
  }

  process.exit(1)
}

process.exit(result.status ?? 1)
