import { RewriteAsOptions, RewriteHrefOptions, SchemaRule } from '../types'

/**
 * Parametrizes input based on tags
 *
 * Input:
 * - input: 'some-path/[param1]/[...param2]'
 * - params: {param1: 'slug-1', param2: 'slug-2'}
 *
 * Expected output:
 * - 'some-path/slug-1/slug-2'
 *
 * @param input
 * @param params
 */
export function parametrize(
  input: string,
  params: Record<string, string | string[]>
): string {
  for (let [name, value] of Object.entries(params)) {
    input = input.replace(
      // match '[paramName]' or '[...paramName]' patterns
      new RegExp(`\\[(\\.\\.\\.)?${name}\\]`, 'g'),
      // replace with 'value[0]/value[1]/...' or 'value'
      Array.isArray(value) ? value.join('/') : value
    )
  }

  return input
}

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
 * Creates unique schema rule key
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
export function encodeSchemaRuleKey(root: string, locale: string): string {
  if (!locale) return root
  return `${locale}:${root}`
}

/**
 * Decodes schema rule key
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
export function decodeSchemaRuleKey(input: string): [string, string] {
  const parts = input.split(':')

  if (parts.length < 2) {
    return [input, '']
  }

  return [parts[1], parts[0]]
}

/**
 * Creates unique schema rule path
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
export function createSchemaRulePath(
  input: string,
  locale: string,
  suffix: string = ''
): string {
  if (!input) return input

  // create `/en` instead of `/en/index`
  input = input === 'index' ? '/' : input

  const path = suffixize(localize(input, locale), suffix)
  return path[0] !== '/' ? `/${path}` : path
}

/**
 * Finds schema rule based on given search options
 * @param rules
 * @param options
 */
export function findSchemaRule(
  rules: SchemaRule[],
  search: string | [string, string]
): SchemaRule | undefined {
  // find only based on array `key`
  if (Array.isArray(search)) {
    return rules.find(
      (r) => r.key === encodeSchemaRuleKey(search[0], search[1] || '')
    )
  }

  // find only based on string `key`
  if (typeof search === 'string') {
    return rules.find((r) => r.key === search)
  }

  return undefined
}

/**
 * Finds and retrieves rewrite rule for given root and options
 * @param input
 * @param options
 */
export function rewrite(
  input: string,
  options: RewriteHrefOptions
): SchemaRule {
  // rename invalid root name
  input = input === '/' ? 'home' : input

  // remove leading slash
  input = input.replace(/^\/+/, '')

  // decode input to root and locale
  const [root, inputLocale] = decodeSchemaRuleKey(input)

  // choose proper locale
  const locale = options.locale || inputLocale

  // find rewrite rule in table of rules
  const rule = findSchemaRule(options.__rules, [root, locale])

  return {
    key: input,
    href: `/${locale}/${root}`,
    ...rule,
  }
}

/**
 * Finds and retrieves `as` for given root and options
 * @param input
 * @param options
 */
export function rewriteAs(input: string, options: RewriteAsOptions): string {
  // split input to root and query parts
  const inputParts = input.split('?')

  // create rewrite rule
  const rule = rewrite(inputParts[0], options)

  // use `rule.href` as fallback to raw alias
  const rawAlias = rule.as || rule.href

  // use parametrized alias when params are given
  const alias = options.params
    ? parametrize(rawAlias, options.params)
    : rawAlias

  // use `rule.as` when no query is given in `input`
  if (!inputParts[1]) {
    return alias
  }

  // use `rule.as` with `input` query
  return [alias, inputParts[1]].join('?')
}

/**
 * Finds and retrieves `href` for given root and options
 * @param input
 * @param options
 */
export function rewriteHref(
  input: string,
  options: RewriteHrefOptions
): string {
  // split input to root and query parts
  const inputParts = input.split('?')

  // create rewrite rule
  const rule = rewrite(inputParts[0], options)

  // use `rule.href` when no query is given in `input`
  if (!inputParts[1]) {
    return rule.href
  }

  // use `rule.href` with `input` query
  return [rule.href, inputParts[1]].join('?')
}
