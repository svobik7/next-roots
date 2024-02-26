import type { RouteLocale } from 'next-roots'
import type { PropsWithChildren, ReactNode } from 'react'
import { Nav } from './Nav'

import 'src/features/common/styles.css'
import {
  getAboutHref,
  getContactsHref,
  getHomeHref,
  getProductsHref,
} from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'
import { Footer } from './Footer'

type RootLayoutProps = PropsWithChildren<{
  locale: RouteLocale
  modal: ReactNode
}>

async function getNavigation(locale: string) {
  const t = await getDictionary(locale)
  return [
    { name: t('nav.Home'), href: getHomeHref(locale) },
    { name: t('nav.Products'), href: getProductsHref({ locale }) },
    { name: t('nav.About'), href: getAboutHref(locale) },
    { name: t('nav.Contacts'), href: getContactsHref(locale) },
  ]
}

/**
 * Root layout is meant to be used as top level layout for all routes.
 * That means it should be used only in /en/layout.ts, /es/layout.ts, /cs/layout.ts
 *
 * @param param0
 * @returns
 */
export async function Layout({ children, modal, locale }: RootLayoutProps) {
  const navigation = await getNavigation(locale)

  return (
    <html lang={locale} className="h-full bg-gray-100">
      <body className="h-full">
        <div className="flex min-h-full flex-col">
          <Nav items={navigation} />
          <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </main>
          <footer className="py-6">
            <Footer />
          </footer>
          {modal}
        </div>
      </body>
    </html>
  )
}
