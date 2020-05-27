import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'
import { RewriteLinkOptions } from '../types'
import useRewrites from './../hooks/use-rewrites'

export type LinkProps = React.PropsWithChildren<
  NextLinkProps & Partial<RewriteLinkOptions>
>

export default function Link(props: LinkProps) {
  const { children, href, as, locale, strict = true, ...otherProps } = props

  const rewrites = useRewrites()

  const linkHref =
    typeof href === 'string' ? rewrites.href(href, { locale, strict }) : href

  const linkAs =
    typeof href === 'string' && !Boolean(as)
      ? rewrites.as(href, { locale, strict })
      : as

  return (
    <NextLink href={linkHref} as={linkAs} {...otherProps}>
      {children}
    </NextLink>
  )
}
