import { Link, useRewrites } from 'next-i18n-rewrites'
import { PropsWithChildren } from 'react'

export type LayoutMainProps = PropsWithChildren<{}>

export default function LayoutMain(props: LayoutMainProps) {
  const { children } = props

  const rewrites = useRewrites()
  return (
    <div>
      <ol>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/auth/login" locale="cs">
            <a>Auth - Login</a>
          </Link>
        </li>
        <li>
          <Link href="/auth/signup" locale="en">
            <a>Auth - Signup</a>
          </Link>
        </li>
        <li>
          <Link href="/account/profile" locale="es">
            <a>Account - Profile</a>
          </Link>
        </li>
        <li>
          <Link href="/account/settings">
            <a>Account - Settings</a>
          </Link>
        </li>
      </ol>

      <hr />

      {children}
    </div>
  )
}
