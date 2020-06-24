import RootsContext, { parsePathname } from 'next-roots/context'
import { AppProps } from 'next/app'
import schema from 'roots.schema'

function MyApp({ Component, pageProps, router }: AppProps) {
  // parse current roots values from router pathname
  const { currentLocale, currentRoot, currentRule } = parsePathname(
    router.pathname,
    schema
  )

  return (
    <RootsContext.Provider
      value={{
        currentRule: currentRule,
        currentRoot: currentRoot,
        currentLocale: currentLocale || schema.defaultLocale,
        defaultLocale: schema.defaultLocale,
        locales: schema.locales,
        rules: schema.rules,
        meta: schema.meta,
      }}
    >
      <Component {...pageProps} />
    </RootsContext.Provider>
  )
}

export default MyApp
