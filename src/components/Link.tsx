import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { useRewrites } from '../hooks/useRewrites'

export type LinkProps = NextLinkProps & {}

export default function Link(props: LinkProps) {
  const { children, href, as, ...otherProps } = props

  const rewrites = useRewrites()

  return (
    <NextLink
      href={rewrites.href(href)}
      as={rewrites.as(href, as)}
      {...otherProps}
    >
      {children}
    </NextLink>
  )
}
