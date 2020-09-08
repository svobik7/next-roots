import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'
import { RewriteAsOptions, RewriteHrefOptions } from '../types'
import { rewriteAs, rewriteHref } from '../utils'
import { useRoots } from './context'

/**
 * ---
 * ROOT LINK COMPONENT
 * ---
 */

export type RootLinkProps = React.PropsWithChildren<
  NextLinkProps & {
    locale?: RewriteHrefOptions['locale']
    params?: RewriteAsOptions['params']
  }
>

export function RootLink(props: RootLinkProps) {
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

/**
 * ---
 * ROOT LINK HOOK
 * ---
 */

export type RootLinkHook = {
  href: (root: string, options?: Partial<RewriteHrefOptions>) => string
  as: (root: string, options?: Partial<RewriteAsOptions>) => string
}

export function useRootLink(): RootLinkHook {
  // use rewrite context for current locale and rules
  const roots = useRoots()

  return {
    as: (root, options = {}) =>
      rewriteAs(root, {
        locale: options.locale ?? roots.currentLocale,
        params: options.params,
        __rules: roots.rules,
      }),
    href: (root, options = {}) =>
      rewriteHref(root, {
        locale: options.locale ?? roots.currentLocale,
        __rules: roots.rules,
      }),
  }
}
