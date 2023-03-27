import path from 'path'
import resolvePkg from 'resolve-pkg'
import type { CliParams, Config } from '~/cli/types'
import { isDirectory, makeDir, readFile } from '~/utils/fs-utils'
import { ConfigError } from './errors'

export const PKG_NAME = 'next-roots'
export const DEFAULT_ORIGIN_DIR = './roots'
export const DEFAULT_LOCALIZE_DIR = './app'

function getPackageDir(projectRoot: string) {
  let pkgDir = resolvePkg(PKG_NAME, { cwd: projectRoot }) || ''

  if (!pkgDir) {
    pkgDir = path.join(projectRoot, `node_modules/${PKG_NAME}`)
  }

  return pkgDir
}

function getPathFactory(dirName: string) {
  return (fileName = '') => path.join(dirName, fileName)
}

function getContentsFactory(getAbsolutePath: (fileName: string) => string) {
  return (fileName: string): string => readFile(getAbsolutePath(fileName))
}

export function getConfig(cliParams: CliParams): Config {
  const packageRoot = getPackageDir(process.cwd())
  const distRoot = path.join(packageRoot, 'dist')

  const getOriginAbsolutePath = getPathFactory(cliParams.originDir)
  const getLocalizedAbsolutePath = getPathFactory(cliParams.localizedDir)

  if (!isDirectory(getOriginAbsolutePath())) {
    throw new ConfigError('Invalid "originDir" path. Directory does not exist.')
  }

  const localizedDir = getLocalizedAbsolutePath()

  if (!isDirectory(localizedDir)) {
    makeDir(localizedDir)
  }

  if (!isDirectory(getLocalizedAbsolutePath())) {
    throw new ConfigError('Invalid "localizedDir" path. Directory neither exists nor be created.')
  }

  const getDistAbsolutePath = getPathFactory(distRoot)
  const getCacheAbsolutePath = getPathFactory(path.join(distRoot, 'cache'))

  const defaultLocale = cliParams.defaultLocale || cliParams.locales.at(0) || ''

  if (!cliParams.locales.includes(defaultLocale)) {
    throw new ConfigError('Invalid or empty "defaultLocale". Must be one of given "locales".')
  }

  const getOriginContents = getContentsFactory(getOriginAbsolutePath)

  return Object.freeze({
    locales: cliParams.locales,
    defaultLocale,
    prefixDefaultLocale: cliParams.prefixDefaultLocale,
    getLocalizedAbsolutePath,
    getOriginAbsolutePath,
    getDistAbsolutePath,
    getCacheAbsolutePath,
    getOriginContents,
  })
}
