import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { isDirectory, isFile, removeDir } from '~/utils/fs-utils'
import { asRootPath } from '~/utils/path-utils'
import type { Origin, RootTranslation } from '../types'
import { buildI18n } from './buildI18n'

const I18N_FILE_NAMES = ['i18n.ts', 'i18n.mjs', 'i18n.js']
const I18N_BUILD_DIR = '.next-roots'

async function importI18nFile(fileName: string) {
  // filename needs to be converted to URL later on
  // as absolute paths on Windows  (c:\..) cannot be imported
  const fileUrl = pathToFileURL(fileName).toString()

  return import(fileUrl).then((module) =>
    module.default ? module.default : module
  )
}

/**
 * Loads and parses i18n from given file
 * @param fileName
 * @returns
 */
async function parseI18nFile(
  fileName: string
): Promise<RootTranslation[] | undefined> {
  try {
    if (!isFile(fileName)) {
      return undefined
    }

    if (fileName.endsWith('.ts')) {
      fileName = await buildI18n(fileName, I18N_BUILD_DIR)
    }

    const { routeNames, generateRouteNames } = await importI18nFile(fileName)
    return generateRouteNames ? await generateRouteNames() : routeNames
  } catch (err) {
    return undefined
  }
}

/**
 * Lists all possible i18n files that can be search through when finding translations
 * @param originFileName
 * @returns
 */
function getI18nFileNames(originFileName: string) {
  return I18N_FILE_NAMES.map((fileName) => path.join(originFileName, fileName))
}

/**
 * Loads i18n for current origin file.
 * @param originFileName
 * @returns
 */
async function getI18n(
  originFileName: string
): Promise<RootTranslation[] | undefined> {
  const i18nFileNames = getI18nFileNames(originFileName)
  let i18n = undefined as RootTranslation[] | undefined

  for (const fileName of i18nFileNames) {
    i18n = i18n || (await parseI18nFile(fileName))
  }

  return i18n
}

/**
 * Finds origin files that can be localized and copied to app folder
 * @param dirName
 * @returns
 */
function getOriginFiles(dirName: string) {
  const priority = (fileName: string): number =>
    Number(isDirectory(path.join(dirName, fileName)))

  return (
    fs
      .readdirSync(dirName)
      // do not include i18n files to copied into app folder
      .filter((fileName) => !I18N_FILE_NAMES.includes(fileName))
      // make sure directories are always at the top of the list
      .sort((a, b) => priority(b) - priority(a))
  )
}

type GetOriginsParams = {
  dirName: string
  locales: string[]
  defaultLocale: string
  parentOrigin?: Origin
}

export async function getOrigins({
  dirName,
  locales,
  defaultLocale,
  parentOrigin,
}: GetOriginsParams) {
  const originFiles = getOriginFiles(dirName)
  const origins: Origin[] = []

  for (const fileName of originFiles) {
    const originFileName = path.join(dirName, fileName)

    const origin: Origin = {
      path: asRootPath(parentOrigin?.path || '', fileName),
      localizations: locales.map((tl) => ({
        locale: tl,
        path: asRootPath(
          parentOrigin?.localizations.find((t) => t.locale === tl)?.path || '',
          fileName
        ),
      })),
    }

    if (isDirectory(originFileName)) {
      const i18n = await getI18n(originFileName)

      const children = await getOrigins({
        defaultLocale,
        locales,
        parentOrigin: {
          ...origin,
          localizations: origin.localizations.map((t) => ({
            ...t,
            path: t.path.replace(
              fileName,
              i18n?.find(({ locale }) => t.locale === locale)?.path || fileName
            ),
          })),
        },
        dirName: originFileName,
      })

      origins.push(...children)
    } else {
      origins.push(origin)
    }
  }

  removeDir(I18N_BUILD_DIR)
  return origins
}
