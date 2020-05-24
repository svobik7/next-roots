import { RewritePage } from 'types'

/**
 * Creates suffixed path
 *
 * Input:
 * - path: 'some-path'
 * - suffix: '.htm'
 *
 * Expected output:
 * - 'some-path.htm'
 *
 * @path path
 * @param suffix
 */
export function suffixizePath(path: string, suffix: string): string {
  // prevent any action when suffix is not defined
  if (!suffix) {
    return path
  }

  // throw an error when given path is not a string
  if (typeof path !== 'string') {
    throw new Error('Path must be type of string')
  }

  return !path.endsWith(suffix) ? `${path}${suffix}` : path
}

/**
 * Creates suffixed path
 *
 * Input:
 * - path: 'some-path'
 * - locale: 'en'
 *
 * Expected output:
 * - 'en/some-path'
 *
 * @path path
 * @param suffix
 */
export function localizePath(path: string, locale: string): string {
  // prevent any action when suffix is not defined
  if (!locale) {
    return path
  }

  // throw an error when given path is not a string
  if (typeof path !== 'string') {
    throw new Error('Path must be type of string')
  }

  return !path.startsWith(`${locale}/`) ? `${locale}/${path}` : path
}

/**
 * Creates rewrite paths
 *
 * Input:
 * - {
 *    locale: 'en',
 *    path: 'some-path-:id'
 *    suffix: '.htm'
 * }
 *
 * Expected output:
 * - '/en/some-path-:id.htm'
 *
 * @param params
 */
export function createPagePath(page: RewritePage): string {
  const { path, locale, suffix = '' } = page
  return `/${suffixizePath(localizePath(path, locale), suffix)}`
}
