import type { Metadata } from 'next'
import type { GeneratePageMetadataProps, PageProps } from 'next-roots'
import { Page } from 'src/features/common/components/Page'
import { Links } from 'src/features/common/components/Links'
import {
  getAboutHref,
  getContactsHref,
  getLocales,
  router,
} from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

async function getData(locale: string) {
  const t = await getDictionary(locale)
  return {
    title: t('contacts.title'),
    content: t('contacts.content'),
    href: getContactsHref(locale),
  }
}

async function getAlternativeLink(locale: string) {
  const { title, href } = await getData(locale)
  return { locale, name: title, href }
}

export default async function ContactPage({ pageHref }: PageProps) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const alternativeLinks = await Promise.all(
    getLocales().map(getAlternativeLink)
  )

  const { title, content } = await getData(pageLocale)
  const t = await getDictionary(pageLocale)

  return (
    <Page
      title={title}
      content={content}
      alternatives={
        <Links header={t('common.NotYourLanguage?')} items={alternativeLinks} />
      }
    />
  )
}

export async function generateMetadata({
  pageHref,
}: GeneratePageMetadataProps<void>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const { title, content } = await getData(pageLocale)

  return { title, description: content }
}
