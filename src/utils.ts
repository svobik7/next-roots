import { RewriteLinkOptions } from './types'

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

  // return locale only when input is `/`
  if (input === '/') {
    return locale
  }

  // do not double slash between input and locale
  if (input.startsWith('/')) {
    return `${locale}${input}`
  }

  return !input.startsWith(`${locale}/`) ? `${locale}/${input}` : input
}

/**
 * Creates unique rewrite key
 *
 * Input:
 * - root: account/profile
 * - locale: en
 *
 * Expected output:
 * - en/account/profile
 *
 * @param input
 * @param locale
 */
export function createRewriteKey(root: string, locale: string) {
  return localize(root, locale)
}

/**
 * Creates unique rewrite path
 *
 * Input:
 * - input: account/profile-:token
 * - locale: en
 * - suffix: .htm
 *
 * Expected output:
 * - /en/account/profile-:token.htm
 *
 * @param input
 * @param locale
 */
export function createRewritePath(
  input: string,
  locale: string,
  suffix: string = ''
) {
  if (!input) return input
  return `/${suffixize(localize(input, locale), suffix)}`
}

/**
 * Finds and retrieves `as` for given root and options
 * @param root
 * @param options
 */
export function rewriteAs(root: string, options: RewriteLinkOptions) {
  // rename invalid root name
  root = root === '/' ? 'index' : root

  const rule = options.__table.find(
    (r) => r.key === createRewriteKey(root, options.locale)
  )

  return rule?.as || rule?.href || ''
}

/**
 * Finds and retrieves `href` for given root and options
 * @param root
 * @param options
 */
export function rewriteHref(root: string, options: RewriteLinkOptions) {
  // rename invalid root name
  root = root === '/' ? 'index' : root

  const rule = options.__table.find(
    (r) => r.key === createRewriteKey(root, options.locale)
  )

  return rule?.href || ''
}
