import { Table } from 'components/table'
import { useRewrites } from 'next-i18n-rewrites/context'
import Link, { useLinkRewrites } from 'next-i18n-rewrites/link'
import { useMetaRewrites } from 'next-i18n-rewrites/meta'
import { useRouter } from 'next/router'
import React, { PropsWithChildren } from 'react'
import styles from './layout-main.module.css'

export type LayoutMainProps = PropsWithChildren<{}>

export default function LayoutMain(props: LayoutMainProps) {
  const { children } = props

  // const roots = useRoots()
  // roots.defaultLocale
  // roots.currentLocale
  // roots.defaultRule
  // roots.currentRule

  // const links = useLinkRoots()
  // links.href('/account/profile')
  // links.as('/account/profile')

  // const meta = useMetaRoots()
  // meta.data('title')
  // meta.data('*')

  // use rewrites context
  const rewrites = useRewrites()

  // use meta rewrites
  const meta = useMetaRewrites()

  // use link rewrites
  const links = useLinkRewrites()

  // use router rewrites
  const router = useRouter()

  // parsed data
  const dataMeta = meta.data('*')

  return (
    <div className={styles.root}>
      <h1>NEXT I18N REWRITES</h1>

      <div
        className={styles.body}
        style={{ background: String(meta.data('background')) }}
      >
        {children}
      </div>

      <h2>Router</h2>

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value', tag: 'code' },
          { key: 'note', label: 'Note' },
        ]}
        data={[
          {
            name: 'asPath',
            value: router.asPath,
            note: 'Query string is empty during SSR',
          },
          { name: 'pathname', value: router.pathname },
        ]}
      />

      <h2>Rule</h2>

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value', tag: 'code' },
        ]}
        data={Object.keys(rewrites.currentRule).map((k) => ({
          name: k,
          value: rewrites.currentRule[k],
        }))}
      />

      <h2>Locale</h2>
      <p>
        Locales are manipulated by hook{' '}
        <code>const rewrites = useRewrites()</code>. Current locale then by{' '}
        <code>rewrites.currentLocale</code>. Default locale by{' '}
        <code>rewrites.defaultLocale</code>.
      </p>

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value', tag: 'code' },
        ]}
        data={[
          { name: 'Current', value: rewrites.currentLocale },
          { name: 'Default', value: rewrites.defaultLocale },
        ]}
      />

      <h2>Meta Data</h2>
      <p>
        Meta data are manipulated by hook{' '}
        <code>const meta = useMetaRewrites()</code>. Single data can be obtained
        using <code>meta.data('title')</code>. All data can be obtained using{' '}
        <code>meta.data('*')</code>.
      </p>

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value', tag: 'code' },
        ]}
        data={Object.keys(dataMeta).map((k) => ({
          name: k,
          value: dataMeta[k],
        }))}
      />

      <h2>Mutations</h2>
      <p>
        Following links can be generated using `Rule.key`{' '}
        <code>en:account/profile</code> or `root` and `locale`
        <code>/account/profile</code> therefore must be used.
      </p>

      <Table
        columns={[
          { key: 'locale', label: 'Locale' },
          { key: 'href', label: 'Href', tag: 'code' },
          { key: 'as', label: 'As', tag: 'code' },
        ]}
        data={rewrites.locales.map((l) => ({
          locale: (
            <Link key={l} href={rewrites.currentRule.key} locale={l}>
              <a>{l}</a>
            </Link>
          ),
          href: links.href(rewrites.currentRule.key, {
            locale: l,
          }),
          as: links.as(rewrites.currentRule.key, {
            locale: l,
          }),
        }))}
      />

      <h2>Navigation</h2>
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
    </div>
  )
}
