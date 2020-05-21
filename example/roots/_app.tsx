import { Context as RewritesContext } from 'next-i18n-rewrites'
import { AppProps } from 'next/app'
import cfgRewrites from 'rewrites.config'

const ctxRewrites = {
  defaultLocale: cfgRewrites.defaultLocale,
  defaultSuffix: cfgRewrites.defaultSuffix,
  locales: cfgRewrites.locales,
  rewrites: cfgRewrites.rewrites,
}

function MyApp({ Component, pageProps, router }: AppProps) {
  // detect current locale from page pathname
  const [, locale] = router.pathname.split('/')

  return (
    <RewritesContext.Provider
      value={{
        ...ctxRewrites,
        currentLocale: locale,
      }}
    >
      <Component {...pageProps} />
    </RewritesContext.Provider>
  )
}

export default MyApp
