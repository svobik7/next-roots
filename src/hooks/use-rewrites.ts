import { useContext } from 'react'
import Context from './../context'
import { RewriteLinkOptions } from './../types'
import { rewriteAs, rewriteHref } from './../utils'

export default function useRewrites() {
  // use rewrite context for current locale and rules
  const context = useContext(Context)

  return {
    as: (root: string, options: Partial<RewriteLinkOptions> = {}) =>
      rewriteAs(root, {
        locale: options.locale || context.currentLocale,
        __table: context.__table,
      }),
    href: (root: string, options: Partial<RewriteLinkOptions> = {}) =>
      rewriteHref(root, {
        locale: options.locale || context.currentLocale,
        __table: context.__table,
      }),
  }
}
