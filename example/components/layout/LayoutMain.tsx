import { PropsWithChildren } from 'react'
import Link from 'next/link'

export type LayoutMainProps = PropsWithChildren<{}>

export default function LayoutMain(props: LayoutMainProps) {
  const { children } = props
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
