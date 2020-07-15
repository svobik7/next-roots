import RootsConsole from 'next-roots/console'
import RootLink from 'next-roots/link'
import { useRootMeta } from 'next-roots/meta'
import Link from 'next/link'
import React from 'react'
import styles from './layout-main.module.css'

export default function LayoutMain({ children }) {
  // use root meta
  const meta = useRootMeta()

  return (
    <div className={styles.root}>
      <h1>NEXT ROOTS</h1>

      <div
        className={styles.body}
        style={{ background: String(meta.data('background')) }}
      >
        {children}
      </div>

      <h2>Navigation</h2>
      <ol>
        <li>
          <Link href="/">
            <a>Index</a>
          </Link>
        </li>
        <li>
          <RootLink href="/">
            <a>Home</a>
          </RootLink>
        </li>
        <li>
          <RootLink href="/auth/login">
            <a>Auth - Login</a>
          </RootLink>
        </li>
        <li>
          <RootLink href="auth/signup">
            <a>Auth - Signup</a>
          </RootLink>
        </li>
        <li>
          <RootLink href="account/profile">
            <a>Account - Profile</a>
          </RootLink>
        </li>
        <li>
          <RootLink href="account/settings">
            <a>Account - Settings</a>
          </RootLink>
        </li>
        <li>
          <RootLink href="dynamic" params={{ slug: 'joe-black' }}>
            <a>Dynamic - Author</a>
          </RootLink>
        </li>
        <li>
          <RootLink
            href="dynamic"
            params={{ slug: 'joe-black/how-to-find-your-first-gold-treasure' }}
          >
            <a>Dynamic - Article</a>
          </RootLink>
        </li>
      </ol>

      <h2>Mutations</h2>
      <ol>
        <li>
          <RootLink href="cs:auth/signup">
            <a>Index</a>
          </RootLink>
        </li>
        <li>
          <RootLink href="en:auth/signup">
            <a>Index</a>
          </RootLink>
        </li>
      </ol>

      <RootsConsole />
    </div>
  )
}
