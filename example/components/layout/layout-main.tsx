import Context, { useRewrites } from 'next-i18n-rewrites/context'
import Link from 'next-i18n-rewrites/link'
import { useMetaRewrites } from 'next-i18n-rewrites/meta'
import { PropsWithChildren, useContext } from 'react'
import styles from './layout-main.module.css'

export type LayoutMainProps = PropsWithChildren<{}>

export default function LayoutMain(props: LayoutMainProps) {
  const { children } = props

  const ctx = useContext(Context);

  // use rewrites context
  const rewrites = useRewrites()

  // use meta rewrites
  const meta = useMetaRewrites()

  return (
    <div>
      <h1>NEXT I18N REWRITES</h1>
      <div>Example project</div>
      <h2>Navigation</h2>
      <ol>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="auth/login">
            <a>Auth - Login</a>
          </Link>
        </li>
        <li>
          <Link href="auth/signup">
            <a>Auth - Signup</a>
          </Link>
        </li>
        <li>
          <Link href="account/profile">
            <a>Account - Profile</a>
          </Link>
        </li>
        <li>
          <Link href="account/settings">
            <a>Account - Settings</a>
          </Link>
        </li>
      </ol>

      <h2>Available Locales</h2>
      <ol>
        {rewrites.currentRule &&
          rewrites.locales.map((l) => (
            <li key={l}>
              <Link href={rewrites.currentRule.key} locale={l} strict={false}>
                <a>{l}</a>
              </Link>
            </li>
          ))}
      </ol>

      <h2>Current Locale</h2>
      <code>{rewrites.currentLocale}</code>

      <h2>Default Locale</h2>
      <code>{rewrites.defaultLocale}</code>

      <h2>Current Rule</h2>
      <code>{JSON.stringify(rewrites.currentRule)}</code>

      <h2>Meta Data</h2>
      <code>{JSON.stringify(meta.data('*'))}</code>

      <h2>Content</h2>
      <div
        className={styles.body}
        style={{ background: meta.data('background') }}
      >
        {children}
      </div>
    </div>
  )
}
