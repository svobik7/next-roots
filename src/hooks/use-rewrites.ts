import Context from 'context'
import { useContext } from 'react'

export default function useRewrites() {
  // use rewrite context for current locale and rules
  const context = useContext(Context)

  return {
    // as: (root: string | UrlObject, options: Partial<RewriteLinkOptions> = {}) =>
    //   rewriteAs(root, {
    //     locale: context.currentLocale,
    //     rewrites: context.rewrites,
    //     ...options,
    //   }),
    // href: (
    //   root: string | UrlObject,
    //   options: Partial<RewriteLinkOptions> = {}
    // ) =>
    //   rewriteHref(root, {
    //     locale: context.currentLocale,
    //     rewrites: context.rewrites,
    //     ...options,
    //   }),
    // rules: context.rewrites,
  }
}
