import { Context as RewritesContext } from 'next-i18n-rewrites'
import { AppProps } from 'next/app'
import cfgRewrites from 'rewrites.config'
import tblRewrites from 'rewrites.table'

function MyApp({ Component, pageProps, router }: AppProps) {
  // detect current locale from page pathname
  const [, locale] = router.pathname.split('/')

  return (
    <RewritesContext.Provider
      value={{
        currentLocale: locale || cfgRewrites.defaultLocale,
        defaultLocale: cfgRewrites.defaultLocale,
        defaultSuffix: cfgRewrites.defaultSuffix,
        locales: cfgRewrites.locales,
        __table: tblRewrites,
      }}
    >
      <Component {...pageProps} />
    </RewritesContext.Provider>
  )
}

export default MyApp
