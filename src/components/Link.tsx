import useRewrites from 'hooks/use-rewrites'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { PropsWithChildren } from 'react'

export type LinkProps = PropsWithChildren<NextLinkProps>

export default function Link(props: LinkProps) {
  const { children, href, as, ...otherProps } = props

  const rewrites = useRewrites()

  return (
    <NextLink
      href={rewrites.href(href)}
      as={rewrites.as(href)}
      {...otherProps}
    >
      {children}
    </NextLink>
  )
}
