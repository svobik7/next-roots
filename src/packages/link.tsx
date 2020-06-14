import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React, { useContext } from 'react'
import { RewriteLinkOptions } from '../types'
import { rewriteAs, rewriteHref } from '../utils'
import RewritesContext from './context'

export type LinkRewriteProps = React.PropsWithChildren<
  NextLinkProps & Partial<RewriteLinkOptions>
>

function LinkRewrite(props: LinkRewriteProps) {
  const { children, href, as, locale, ...otherProps } = props

  const link = useLinkRewrites()

  // create href rewrite
  const hrefRewrite: LinkRewriteProps['href'] =
    typeof href === 'string'
      ? link.href(href, { locale })
      : { ...href, pathname: link.href(href.pathname || '', { locale }) }

  // use given alias at first
  let asRewrite: LinkRewriteProps['as'] = as

  // rewrite as when no alias is given
  if (!asRewrite) {
    asRewrite =
      typeof href === 'string'
        ? link.as(href, { locale })
        : { ...href, pathname: link.as(href.pathname || '', { locale }) }
  }

  return (
    <NextLink href={hrefRewrite} as={asRewrite} {...otherProps}>
      {children}
    </NextLink>
  )
}

function useLinkRewrites() {
  // use rewrite context for current locale and rules
  const context = useContext(RewritesContext)

  return {
    as: (root: string, options: Partial<RewriteLinkOptions> = {}) =>
      rewriteAs(root, {
        locale: options.locale || context.currentLocale,
        __rules: context.rules,
      }),
    href: (root: string, options: Partial<RewriteLinkOptions> = {}) =>
      rewriteHref(root, {
        locale: options.locale || context.currentLocale,
        __rules: context.rules,
      }),
  }
}

export { useLinkRewrites }
export default LinkRewrite
