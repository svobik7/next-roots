import {
  RewriteLinkOptions,
  RewriteMeta,
  RewriteMetaDataOptions,
  RewriteRule,
} from './types'

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
 * @param input
 * @param suffix
 */
export function suffixize(input: string, suffix: string): string {
  // prevent any action when suffix is not defined
  if (!suffix) {
    return input
  }

  // prevent any action when input is not string
  if (typeof input !== 'string') {
    return input
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
 * @param input
 * @param locale
 */
export function localize(input: string, locale: string): string {
  // prevent any action when locale is not defined
  if (!locale) {
    return input
  }

  // prevent any action when input is not string
  if (typeof input !== 'string') {
    return input
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
 * Creates de-localized input
 *
 * Input:
 * - input: 'en/some-path'
 * - locale: 'en'
 *
 * Expected output:
 * - 'some-path'
 *
 * @param input
 * @param locale
 */
export function delocalize(input: string, locale: string): string {
  // prevent any action when suffix is not defined
  if (!locale) {
    return input
  }

  // prevent any action when input is not string
  if (typeof input !== 'string') {
    return input
  }

  const regex =
    locale === '*' ? new RegExp(`^/?[\\w-]+/`) : new RegExp(`^/?(${locale})/`)

  return input.replace(regex, '')
}

/**
 * Creates unique rewrite key
 *
 * Input:
 * - root: account/profile
 * - locale: en
 *
 * Expected output:
 * - en:account/profile
 *
 * @param root
 * @param locale
 */
export function encodeRewriteKey(root: string, locale: string): string {
  if (!locale) return root
  return `${locale}:${root}`
}

/**
 * Decodes rewrite key
 *
 * Input:
 * - en:account/profile
 *
 * Expected output:
 * - [account/profile, 'en']
 *
 * @param root
 * @param locale
 */
export function decodeRewriteKey(input: string): [string, string] {
  const parts = input.split(':')

  if (parts.length < 2) {
    return [input, '']
  }

  return [parts[1], parts[0]]
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
 * @param suffix
 */
export function createRewritePath(
  input: string,
  locale: string,
  suffix: string = ''
): string {
  if (!input) return input
  return `/${suffixize(localize(input, locale), suffix)}`
}

/**
 * Finds rewrite rule based on given search options
 * @param rules
 * @param options
 */
export function findRewriteRule(
  rules: RewriteRule[],
  search: string | [string, string]
): RewriteRule | undefined {
  // find only based on array `key`
  if (Array.isArray(search)) {
    return rules.find(
      (r) => r.key === encodeRewriteKey(search[0], search[1] || '')
    )
  }

  // find only based on string `key`
  if (typeof search === 'string') {
    return rules.find((r) => r.key === search)
  }

  return undefined
}

/**
 * Finds and retrieves `as` for given root and options
 * @param input
 * @param options
 */
export function rewriteAs(input: string, options: RewriteLinkOptions): string {
  // rename invalid root name
  input = input === '/' ? 'index' : input

  let rule = findRewriteRule(options.__rules, [input, options.locale])

  if (!rule && options.strict === false) {
    const decoded = decodeRewriteKey(input)
    rule = findRewriteRule(options.__rules, [decoded[0], options.locale])
  }

  return rule?.as || rule?.href || input
}

/**
 * Finds and retrieves `href` for given root and options
 * @param input
 * @param options
 */
export function rewriteHref(
  input: string,
  options: RewriteLinkOptions
): string {
  // rename invalid root name
  input = input === '/' ? 'index' : input

  let rule = findRewriteRule(options.__rules, [input, options.locale])

  if (!rule && options.strict === false) {
    const decoded = decodeRewriteKey(input)
    rule = findRewriteRule(options.__rules, [decoded[0], options.locale])
  }

  return rule?.href || input
}

/**
 * Finds and retrieves `meta.data` for given key
 * @param key
 * @query query
 * @param options
 */
export function rewriteMetaData(
  key: string,
  query: string,
  options: RewriteMetaDataOptions
) {
  const { __meta = [], strict = false } = options

  let data: RewriteMeta['data'] = {}

  if (strict === false) {
    // merge general non-strict data
    const generalMeta = __meta.find((m) => m.key === '*')
    generalMeta && (data = { ...data, ...generalMeta.data })

    const decoded = decodeRewriteKey(key)

    // merge rewrite non-strict data
    const rewriteMeta = __meta.find((m) => m.key === decoded[0])
    rewriteMeta && (data = { ...data, ...rewriteMeta.data })
  }

  // merge with page strict data
  const pageMeta = __meta.find((m) => m.key === key)
  pageMeta && (data = { ...data, ...pageMeta.data })

  // retrieve all params when `*`
  if (query === '*') {
    return data
  }

  // retrieve specific param otherwise
  return data[query] || undefined
}
