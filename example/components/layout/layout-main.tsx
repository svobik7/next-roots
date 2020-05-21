import { PropsWithChildren, useContext } from 'react'
import Link from 'next/link'
import { useRewrites } from 'next-i18n-rewrites'

export type LayoutMainProps = PropsWithChildren<{}>

export default function LayoutMain(props: LayoutMainProps) {
  const { children } = props

  const rewrites = useRewrites()

  rewrites.href('/auth/login', { locale: 'cs' })
  rewrites.href('/auth/login', { locale: 'en' })
  rewrites.href('/auth/login')

  return (
    <div>
      <ol>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/auth/login">
            <a>Auth - Login</a>
          </Link>
        </li>
        <li>
          <Link href="/auth/signup">
            <a>Auth - Signup</a>
          </Link>
        </li>
        <li>
          <Link href="/account/profile">
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
