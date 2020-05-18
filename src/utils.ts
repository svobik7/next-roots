import { Rewrite, RewriteParams } from './types'

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
 * Creates tokenized path
 *
 * Input:
 * - path: 'some-path-:token'
 * - token: 10
 *
 * Expected output:
 * - 'some-path-10'
 *
 * @param path
 * @param params
 */
export function tokenizePath(path: string, token: string) {
  return path.replace(':token', token)
}

/**
 * Creates rewrite paths
 *
 * Input:
 * - token: 'p1',
 * - params: {
 *    locale: 'en',
 *    path: 'some-path-:id'
 *    suffix: '.htm'
 * }
 *
 * Expected output:
 * - '/en/some-path-p1.htm'
 *
 * @param params
 */
export function createRewritePath(
  params: RewriteParams,
  token: string = ''
): string {
  return `${params.locale}/${suffixizePath(
    tokenizePath(params.path, token),
    params.suffix || ''
  )}`
}
