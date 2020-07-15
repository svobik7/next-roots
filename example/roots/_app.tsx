import RootsContext, { detectRoots } from 'next-roots/context'
import { AppProps } from 'next/app'
import schemaRoots from 'roots.schema'

function MyApp({ Component, pageProps }: AppProps) {
  // detect roots context from page component
  const roots = detectRoots(Component, {
    defaultLocale: schemaRoots.defaultLocale,
    locales: schemaRoots.locales,
    rules: schemaRoots.rules,
    meta: schemaRoots.meta,
  })

  return (
    <RootsContext.Provider value={roots}>
      <Component {...pageProps} />
    </RootsContext.Provider>
  )
}

export default MyApp
