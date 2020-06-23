import { Table } from 'components/table'
import { useRoots } from 'next-roots/context'
import RootLink, { useRootLink } from 'next-roots/link'
import { useRootMeta } from 'next-roots/meta'
import { useRouter } from 'next/router'
import React, { PropsWithChildren } from 'react'
import styles from './layout-main.module.css'
import NextLink from 'next/link'

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

  // use roots context
  const roots = useRoots()

  // use root meta
  const meta = useRootMeta()

  // use root link
  const links = useRootLink()

  // use router
  const router = useRouter()

  // parsed data
  const dataMeta = meta.data('*')

  return (
    <div className={styles.root}>
      <h1>NEXT ROOTS</h1>

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
          },
          { name: 'pathname', value: router.pathname },
          {
            name: 'query',
            value: JSON.stringify(router.query),
            note: 'Query can be empty during SSR',
          },
        ]}
      />

      <h2>Rule</h2>

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value', tag: 'code' },
        ]}
        data={Object.keys(roots.currentRule).map((k) => ({
          name: k,
          value: roots.currentRule[k],
        }))}
      />

      <h2>Locale</h2>
      <p>
        Locales are manipulated by hook <code>const roots = useRoots()</code>.
        Current locale then by <code>roots.currentLocale</code>. Default locale
        by <code>roots.defaultLocale</code>.
      </p>

      <Table
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value', tag: 'code' },
        ]}
        data={[
          { name: 'Current', value: roots.currentLocale },
          { name: 'Default', value: roots.defaultLocale },
        ]}
      />

      <h2>Meta Data</h2>
      <p>
        Meta data are manipulated by hook{' '}
        <code>const meta = useRootMeta()</code>. Single data can be obtained
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
        data={roots.locales.map((l) => ({
          locale: (
            <RootLink key={l} href={roots.currentRule.key} locale={l}>
              <a>{l}</a>
            </RootLink>
          ),
          href: links.href(roots.currentRule.key, {
            locale: l,
          }),
          as: links.as(roots.currentRule.key, {
            locale: l,
          }),
        }))}
      />

      <h2>Navigation</h2>
      <ol>
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
          <RootLink href="dynamic" params={{ slug: 'jirka.svoboda' }}>
            <a>Dynamic - Author</a>
          </RootLink>
        </li>
        <li>
          <RootLink
            href="dynamic"
            params={{ slug: 'jirka.svoboda/nazev-clanku' }}
          >
            <a>Dynamic - Article</a>
          </RootLink>
        </li>
      </ol>
    </div>
  )
}
