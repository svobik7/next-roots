import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React, { useContext } from 'react'
import { RewriteLinkOptions } from '../types'
import { rewriteAs, rewriteHref } from '../utils'
import RewritesContext from './context'

export type LinkProps = React.PropsWithChildren<
  NextLinkProps & Partial<RewriteLinkOptions>
>

function Link(props: LinkProps) {
  const { children, href, as, locale, strict = true, ...otherProps } = props

  const link = useLinkRewrites()

  // TODO: refactor to rewrite UrlObject too
  const nextHref =
    typeof href === 'string' ? link.href(href, { locale, strict }) : href

  const nextAs =
    typeof href === 'string' && !Boolean(as)
      ? link.as(href, { locale, strict })
      : as

  return (
    <NextLink href={nextHref} as={nextAs} {...otherProps}>
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
        strict: options.strict ?? true,
        __rules: context.rules,
      }),
    href: (root: string, options: Partial<RewriteLinkOptions> = {}) =>
      rewriteHref(root, {
        locale: options.locale || context.currentLocale,
        strict: options.strict ?? true,
        __rules: context.rules,
      }),
  }
}

export { useLinkRewrites }
export default Link
