import { useContext } from 'react'
import Context from '../context'
import { LinkRewriteOptions } from '../types'
import { rewriteAs, rewriteHref } from '../utils/link.utils'

export default function useRewrites() {
  // use rewrite context for current locale and rules
  const context = useContext(Context)

  return {
    as: (root: string, options: Partial<LinkRewriteOptions> = {}) =>
      rewriteAs(root, {
        locale: context.currentLocale,
        rewrites: context.rewrites,
        ...options,
      }),
    href: (root: string, options: Partial<LinkRewriteOptions> = {}) =>
      rewriteHref(root, {
        locale: context.currentLocale,
        rewrites: context.rewrites,
        ...options,
      }),
  }
}
