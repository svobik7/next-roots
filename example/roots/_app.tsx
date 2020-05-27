import { Context as RewritesContext } from 'next-i18n-rewrites'
import { AppProps } from 'next/app'
import rewrites from 'rewrites'

function MyApp({ Component, pageProps, router }: AppProps) {
  // detect current locale from page pathname
  const [, currentLocale] = router.pathname.split('/')
  const currentRewrite = rewrites.rules.find(
    (r) => r.as === router.pathname || r.href === router.pathname
  )

  return (
    <RewritesContext.Provider
      value={{
        currentRule: currentRewrite,
        currentLocale: currentLocale || rewrites.defaultLocale,
        defaultLocale: rewrites.defaultLocale,
        locales: rewrites.locales,
        rules: rewrites.rules,
        meta: rewrites.meta,
      }}
    >
      <Component {...pageProps} />
    </RewritesContext.Provider>
  )
}

export default MyApp
