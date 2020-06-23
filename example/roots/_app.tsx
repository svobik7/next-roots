import RootsContext from 'next-roots/context'
import { AppProps } from 'next/app'
import schemaRoots from 'roots.schema'

function MyApp({ Component, pageProps, router }: AppProps) {
  // detect current locale & rewrite from page pathname
  const [, currentLocale] = router.pathname.split('/')
  const currentRewrite = schemaRoots.rules.find(
    (r) => r.as === router.pathname || r.href === router.pathname
  )

  return (
    <RootsContext.Provider
      value={{
        currentRule: currentRewrite,
        currentLocale: currentLocale || schemaRoots.defaultLocale,
        defaultLocale: schemaRoots.defaultLocale,
        locales: schemaRoots.locales,
        rules: schemaRoots.rules,
        meta: schemaRoots.meta,
      }}
    >
      <Component {...pageProps} />
    </RootsContext.Provider>
  )
}

export default MyApp
