import { detectRoots, RootsContext } from 'next-roots/context'
import { AppProps } from 'next/app'
import schemaRoots from 'roots.schema'

function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  // detect roots context from page component
  const roots = detectRoots(props, {
    defaultLocale: schemaRoots.defaultLocale,
    locales: schemaRoots.locales,
  })

  return (
    <RootsContext.Provider value={roots}>
      <Component {...pageProps} />
    </RootsContext.Provider>
  )
}

export default MyApp
