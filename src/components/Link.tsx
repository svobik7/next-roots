import useRewrites from 'hooks/use-rewrites'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import React from 'react'

export type LinkProps = React.PropsWithChildren<
  NextLinkProps & { locale?: string }
>

export default function Link(props: LinkProps) {
  const { children, href, as, locale, ...otherProps } = props

  const rewrites = useRewrites()

  const linkHref =
    typeof href === 'string' ? rewrites.href(href, { locale }) : href

  const linkAs =
    typeof href === 'string' && !Boolean(as)
      ? rewrites.as(href, { locale })
      : as

  return (
    <NextLink href={linkHref} as={linkAs} {...otherProps}>
      {children}
    </NextLink>
  )
}
