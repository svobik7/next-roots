import { useContext } from 'react'
import Context from './../context'
import { RewriteLinkOptions } from './../types'
import { rewriteAs, rewriteHref, rewriteMetaData } from './../utils'

export default function useRewrites() {
  // use rewrite context for current locale and rules
  const context = useContext(Context)

  return {
    locales: context.locales,
    defaultLocale: context.defaultLocale,
    currentLocale: context.currentLocale,
    currentRule: context.currentRule,
    as: (root: string, options: Partial<RewriteLinkOptions> = {}) =>
      rewriteAs(root, {
        locale: options.locale || context.currentLocale,
        strict: options.strict ?? true,
        __rules: context.rules,
      }),
    href: (root: string, options: Partial<RewriteLinkOptions> = {}) =>
      rewriteHref(root, {
        locale: options.locale || context.currentLocale,
        strict: options.strict ?? true,
        __rules: context.rules,
      }),
    metaData: (query: string = '*', key: string = '') =>
      rewriteMetaData(key || context.currentRule?.key || '*', query, {
        __meta: context.meta,
      }),
  }
}
