#!/usr/bin/env node
import nodeWatch from 'node-watch'
import parseArgs from 'parse-typed-args'
import path from 'path'
import { generateFactory } from './commands/generate'
import {
  DEFAULT_LOCALIZE_DIR,
  DEFAULT_ORIGIN_DIR,
  getConfig,
  PKG_NAME,
} from './config'
import { CliError } from './errors'
import type { CliParams } from './types'

const cliArgs = parseArgs({
  opts: {
    cfgPath: {
      default: 'roots.config.js',
      short: 'c',
      parse: String,
    },
    watch: {
      switch: true,
      short: 'w',
    },
  },
})(process.argv)

const { watch, cfgPath } = cliArgs.opts

const cliDefaultParams: CliParams = {
  localizedDir: path.resolve(DEFAULT_LOCALIZE_DIR),
  originDir: path.resolve(DEFAULT_ORIGIN_DIR),
  defaultLocale: '',
  locales: [],
  prefixDefaultLocale: true,
  packageDir: path.join(process.cwd(), `node_modules/${PKG_NAME}`),
}

const cliFileParams = require(path.join(process.cwd(), cfgPath))
const cliParams: CliParams = {
  ...cliDefaultParams,
  ...cliFileParams,
}

const config = getConfig(cliParams)

async function main() {
  // Make sure commands gracefully respect termination signals (e.g. from Docker)
  process.on('SIGTERM', () => process.exit(0))
  process.on('SIGINT', () => process.exit(0))

  const generate = generateFactory(config)
  return generate()
}

const run = async () =>
  main().catch((e: Error) => {
    if (e instanceof CliError) {
      console.error(`\x1b[31mnext-roots\x1b[37m - ${e.message}`)
    } else {
      console.error(e)
    }
  })

if (watch) {
  const watcher = nodeWatch(config.getOriginAbsolutePath(), { recursive: true })

  watcher.on('ready', function () {
    console.warn(`\x1b[33mnext-roots\x1b[37m - running in watch mode`)
    run()
  })

  watcher.on('change', function () {
    console.warn(
      `\x1b[33mnext-roots\x1b[37m - origins changed, regenerating...`
    )
    run()
  })
} else {
  run()
}
