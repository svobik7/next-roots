#!/usr/bin/env node
import path from 'path'
import { generateFactory } from './commands/generate'
import { DEFAULT_LOCALIZE_DIR, DEFAULT_ORIGIN_DIR, getConfig } from './config'
import { CliError, CompileError, ConfigError } from './errors'
import type { CliParams } from './types'

const [, , configPath = 'roots.config.js', configParams = {}] = process.argv

const cliDefaultParams: CliParams = {
  localizedDir: path.resolve(DEFAULT_LOCALIZE_DIR),
  originDir: path.resolve(DEFAULT_ORIGIN_DIR),
  defaultLocale: '',
  locales: [],
  prefixDefaultLocale: true,
}

const cliFileParams = require(path.join(process.cwd(), configPath))
const cliParams: CliParams = {
  ...cliDefaultParams,
  ...cliFileParams,
  ...configParams,
}

async function main() {
  // Make sure commands gracefully respect termination signals (e.g. from Docker)
  process.on('SIGTERM', () => process.exit(0))
  process.on('SIGINT', () => process.exit(0))

  const config = getConfig(cliParams)
  const generate = generateFactory(config)

  return generate()
}

main().catch((e: Error) => {
  if (e instanceof CliError) {
    console.error(`\x1b[31mnext-roots\x1b[37m - ${e.message}`)
  } else {
    console.error(e)
  }
})
