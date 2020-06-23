import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React, { useContext } from 'react'
import { Roots } from '../types'
import { rewriteAs, rewriteHref } from '../utils'
import RootsContext from './context'

export type RootLinkProps = React.PropsWithChildren<
  NextLinkProps & {
    locale?: Roots.RewriteHrefOptions['locale']
    params?: Roots.RewriteAsOptions['params']
  }
>

function RootLink(props: RootLinkProps) {
  const { children, href, as, locale, params, ...otherProps } = props

  const link = useRootLink()

  // create href rewrite
  const hrefRewrite: RootLinkProps['href'] =
    typeof href === 'string'
      ? link.href(href, { locale })
      : { ...href, pathname: link.href(href.pathname || '', { locale }) }

  // use given alias at first
  let asRewrite: RootLinkProps['as'] = as

  // rewrite as when no alias is given
  if (!asRewrite) {
    asRewrite =
      typeof href === 'string'
        ? link.as(href, { locale, params })
        : {
            ...href,
            pathname: link.as(href.pathname || '', { locale, params }),
          }
  }

  return (
    <NextLink href={hrefRewrite} as={asRewrite} {...otherProps}>
      {children}
    </NextLink>
  )
}

function useRootLink() {
  // use rewrite context for current locale and rules
  const context = useContext(RootsContext)

  return {
    as: (root: string, options: Partial<Roots.RewriteAsOptions> = {}) =>
      rewriteAs(root, {
        locale: options.locale || context.currentLocale,
        params: options.params,
        __rules: context.rules,
      }),
    href: (root: string, options: Partial<Roots.RewriteHrefOptions> = {}) =>
      rewriteHref(root, {
        locale: options.locale || context.currentLocale,
        __rules: context.rules,
      }),
  }
}

export { useRootLink }
export default RootLink
