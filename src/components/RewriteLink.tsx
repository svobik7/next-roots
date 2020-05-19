import Link from 'next/link'

export type RewriteLinkProps = LinkProps & {}

export function RewriteLink(props) {
  const { href, as, children, ...otherProps } = props

  const rewrites = useRewrites()

  return (
    <Link href={rewrites.href(href)} as={rewrites.as(href, as)} {...otherProps}>
      {children}
    </Link>
  )
}
