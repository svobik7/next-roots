import styles from './debug.module.css'
import { useState } from 'react'
import { Table } from './table'
import { useRoots } from 'next-roots/context'
import { useRootMeta } from 'next-roots/meta'
import RootLink, { useRootLink } from 'next-roots/link'
import { useRouter } from 'next/router'

function RootsDebugger() {
  // use state context
  const [isExpanded, setIsExpanded] = useState(false)
  const [panelTab, setPanelTab] = useState('router')

  // use router context
  const router = useRouter()

  // use roots context
  const roots = useRoots()

  // use roots meta
  const meta = useRootMeta()

  // use roots link
  const link = useRootLink()

  if (!isExpanded) {
    return (
      <div className={styles.indicator} onClick={() => setIsExpanded(true)}>
        <svg
          width="22.896"
          height="20.424"
          viewBox="0 0 22.896 20.424"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="svgGroup"
            stroke-linecap="round"
            fill-rule="evenodd"
            font-size="9pt"
            stroke="none"
            fill="#fff"
            // style="stroke:#000;stroke-width:0.25mm;fill:none"
          >
            <path
              d="M 22.644 15.142 A 0.534 0.534 0 0 0 22.224 14.952 A 0.753 0.753 0 0 0 21.778 15.1 A 1.143 1.143 0 0 0 21.576 15.288 Q 20.834 16.166 20.269 16.681 A 5.723 5.723 0 0 1 19.824 17.052 A 3.009 3.009 0 0 1 19.527 17.247 A 2.318 2.318 0 0 1 18.36 17.568 Q 17.496 17.568 16.836 16.896 A 3.536 3.536 0 0 1 16.756 16.812 Q 16.341 16.36 15.92 15.604 A 13.012 13.012 0 0 1 15.504 14.784 A 13.16 13.16 0 0 0 15.095 13.972 Q 14.675 13.212 14.256 12.744 Q 13.632 12.048 12.48 11.736 A 10.087 10.087 0 0 0 13.771 11.305 A 7.816 7.816 0 0 0 15.576 10.272 A 7.69 7.69 0 0 0 16.172 9.761 A 6.249 6.249 0 0 0 17.484 8.004 A 6.783 6.783 0 0 0 17.561 7.843 A 5.815 5.815 0 0 0 18.12 5.376 A 6.126 6.126 0 0 0 18.117 5.185 A 5.103 5.103 0 0 0 17.364 2.616 A 4.504 4.504 0 0 0 16.257 1.404 A 5.99 5.99 0 0 0 15.048 0.696 A 6.627 6.627 0 0 0 14.48 0.474 Q 13.099 0.004 11.22 0 A 15.225 15.225 0 0 0 11.184 0 Q 7.872 0 5.34 1.548 Q 2.808 3.096 1.404 6.024 A 12.14 12.14 0 0 0 1.354 6.131 Q 0.603 7.735 0.269 9.667 A 19.451 19.451 0 0 0 0 12.984 A 12.221 12.221 0 0 0 0.111 14.662 A 9.345 9.345 0 0 0 0.672 16.836 A 7.331 7.331 0 0 0 1.174 17.866 A 5.585 5.585 0 0 0 2.58 19.476 Q 3.816 20.424 5.424 20.424 A 4.944 4.944 0 0 0 5.817 20.409 Q 6.266 20.373 6.633 20.253 A 2.253 2.253 0 0 0 7.608 19.644 A 2.999 2.999 0 0 0 7.958 19.179 Q 8.189 18.805 8.347 18.326 A 6.125 6.125 0 0 0 8.568 17.4 A 7.694 7.694 0 0 0 8.575 17.362 Q 8.618 17.12 8.741 16.353 A 412.849 412.849 0 0 0 8.808 15.936 Q 9.179 13.772 9.312 13.033 A 28.018 28.018 0 0 1 9.36 12.768 A 2.635 2.635 0 0 1 9.764 12.844 A 2.002 2.002 0 0 1 10.452 13.176 Q 10.757 13.407 11.068 13.848 A 6.207 6.207 0 0 1 11.352 14.292 A 16.241 16.241 0 0 1 11.584 14.704 Q 11.994 15.455 12.6 16.704 Q 13.246 18.043 13.938 18.865 A 4.812 4.812 0 0 0 14.676 19.584 A 3.908 3.908 0 0 0 15.99 20.246 A 4.819 4.819 0 0 0 17.328 20.424 A 6.143 6.143 0 0 0 18.199 20.364 A 4.731 4.731 0 0 0 20.112 19.668 A 7.407 7.407 0 0 0 20.363 19.499 Q 21.411 18.763 22.44 17.52 A 1.743 1.743 0 0 0 22.599 17.293 Q 22.896 16.788 22.896 16.032 A 2.419 2.419 0 0 0 22.886 15.804 Q 22.871 15.647 22.834 15.516 A 1.05 1.05 0 0 0 22.716 15.24 A 0.76 0.76 0 0 0 22.644 15.142 Z M 5.4 16.344 L 6.048 12.744 Q 5.232 12.744 4.932 12.36 Q 4.632 11.976 4.632 11.496 A 1.439 1.439 0 0 1 4.685 11.098 A 1.08 1.08 0 0 1 5.004 10.584 Q 5.376 10.248 5.856 10.248 L 6.456 10.248 Q 6.72 8.631 6.962 7.32 A 91.235 91.235 0 0 1 7.176 6.192 A 2.238 2.238 0 0 1 7.456 5.447 Q 7.961 4.632 9.192 4.632 Q 10.36 4.632 10.531 5.524 A 1.767 1.767 0 0 1 10.56 5.856 Q 10.56 6.074 10.544 6.21 A 1.199 1.199 0 0 1 10.536 6.264 L 9.816 10.248 Q 11.112 10.176 12.18 9.624 Q 13.248 9.072 13.884 8.088 A 3.989 3.989 0 0 0 14.518 6.011 A 4.803 4.803 0 0 0 14.52 5.856 Q 14.52 4.344 13.488 3.48 Q 12.456 2.616 10.464 2.616 A 8.037 8.037 0 0 0 8.195 2.925 A 6.809 6.809 0 0 0 6.348 3.78 A 6.964 6.964 0 0 0 4.33 5.853 A 9.344 9.344 0 0 0 3.6 7.236 A 11.339 11.339 0 0 0 2.894 9.604 Q 2.686 10.703 2.634 11.96 A 20.686 20.686 0 0 0 2.616 12.816 Q 2.616 14.352 2.928 15.456 A 7.42 7.42 0 0 0 3.137 16.092 Q 3.379 16.722 3.686 17.099 A 2.231 2.231 0 0 0 3.696 17.112 Q 4.084 17.581 4.437 17.652 A 0.63 0.63 0 0 0 4.56 17.664 A 0.556 0.556 0 0 0 4.975 17.481 A 0.885 0.885 0 0 0 5.076 17.352 Q 5.249 17.088 5.361 16.55 A 5.965 5.965 0 0 0 5.4 16.344 Z"
              vector-effect="non-scaling-stroke"
            />
          </g>
        </svg>
      </div>
    )
  }

  // parsed data
  const dataMeta = meta.data('*')

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <a
          className={panelTab === 'router' ? styles.active : ''}
          onClick={() => setPanelTab('router')}
        >
          Router
        </a>
        <a
          className={panelTab === 'meta' ? styles.active : ''}
          onClick={() => setPanelTab('meta')}
        >
          Meta
        </a>
        <a
          className={panelTab === 'links' ? styles.active : ''}
          onClick={() => setPanelTab('links')}
        >
          Links
        </a>
      </div>
      <div className={styles.panelBody}>
        {panelTab === 'router' && (
          <>
            <h2>Router</h2>

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
              Locales are manipulated by hook{' '}
              <code>const roots = useRoots()</code>. Current locale then by{' '}
              <code>roots.currentLocale</code>. Default locale by{' '}
              <code>roots.defaultLocale</code>.
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
          </>
        )}

        {panelTab === 'meta' && (
          <>
            <h2>Meta Data</h2>
            <p>
              Meta data are manipulated by hook{' '}
              <code>const meta = useRootMeta()</code>. Single data can be
              obtained using <code>meta.data('title')</code>. All data can be
              obtained using <code>meta.data('*')</code>.
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
          </>
        )}

        {panelTab === 'links' && (
          <>
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
                href: link.href(roots.currentRule.key, {
                  locale: l,
                }),
                as: link.as(roots.currentRule.key, {
                  locale: l,
                  params: { ...router.query },
                }),
              }))}
            />
          </>
        )}
      </div>
      <div className={styles.panelClose} onClick={() => setIsExpanded(false)}>
        X
      </div>
    </div>
  )
}

export default RootsDebugger
