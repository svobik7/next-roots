import { RootsConsole } from 'next-roots/console'
import { useRoots } from 'next-roots/context'
import { RootLink } from 'next-roots/link'
import { useRootMeta } from 'next-roots/meta'
import Link from 'next/link'
import React from 'react'
import styles from './layout-main.module.css'

export default function LayoutMain({ children }) {
  // use roots context
  const roots = useRoots()

  // use root meta
  const meta = useRootMeta()

  return (
    <div className={styles.root}>
      <h1>NEXT ROOTS ({roots.currentLocale})</h1>

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
          <RootLink href="detail/author" params={{ slug: 'joe-black' }}>
            <a>Detail - Author</a>
          </RootLink>
        </li>
        <li>
          <RootLink
            href="detail/article"
            params={{ slug: 'joe-black/how-to-find-your-first-gold-treasure' }}
          >
            <a>Detail - Article</a>
          </RootLink>
        </li>
        <li>
          <RootLink href="get-layout">
            <a>Get Layout</a>
          </RootLink>
        </li>
      </ol>

      <h2>Mutations</h2>
      <ol>
        <li>
          <RootLink href={roots.currentRoot} locale="en">
            <a>EN</a>
          </RootLink>
        </li>
        <li>
          <RootLink href={roots.currentRoot} locale="cs">
            <a>CS</a>
          </RootLink>
        </li>
        <li>
          <RootLink href={roots.currentRoot} locale="es">
            <a>ES</a>
          </RootLink>
        </li>
      </ol>

      <RootsConsole />
    </div>
  )
}
