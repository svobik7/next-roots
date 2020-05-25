import { RewritePage } from 'types'

/**
 * Creates suffixed input
 *
 * Input:
 * - input: 'some-path'
 * - suffix: '.htm'
 *
 * Expected output:
 * - 'some-path.htm'
 *
 * @path path
 * @param suffix
 */
export function suffixize(input: string, suffix: string): string {
  // prevent any action when suffix is not defined
  if (!suffix) {
    return input
  }

  // throw an error when given path is not a string
  if (typeof input !== 'string') {
    throw new Error('Path must be type of string')
  }

  return !input.endsWith(suffix) ? `${input}${suffix}` : input
}

/**
 * Creates localized input
 *
 * Input:
 * - input: 'some-path'
 * - locale: 'en'
 *
 * Expected output:
 * - 'en/some-path'
 *
 * @path path
 * @param suffix
 */
export function localize(input: string, locale: string): string {
  // prevent any action when suffix is not defined
  if (!locale) {
    return input
  }

  // throw an error when given path is not a string
  if (typeof input !== 'string') {
    throw new Error('Path must be type of string')
  }

  return !input.startsWith(`${locale}/`) ? `${locale}/${input}` : input
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
  const { locale, path, suffix = '' } = page
  return `/${suffixize(localize(path, locale), suffix)}`
}