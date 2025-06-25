import { detectRoots, RootsContext } from 'next-roots/context'
import type { AppProps } from 'next/app'
import schemaRoots from 'roots.schema'

// Allow pages to export a getLayout function
type NextPageWithLayout = AppProps['Component'] & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

function MyApp(props: AppProps) {
  const { Component, pageProps } = props
  const PageComponent = Component as NextPageWithLayout

  // detect roots context from page component
  const roots = detectRoots(props, {
    defaultLocale: schemaRoots.defaultLocale,
    locales: schemaRoots.locales,
  })

  // use page's getLayout or fallback to identity (no layout)
  const getLayout = PageComponent.getLayout ?? ((page) => page)

  return (
    <RootsContext.Provider value={roots}>
      {getLayout(<PageComponent {...pageProps} />)}
    </RootsContext.Provider>
  )
}

export default MyApp
