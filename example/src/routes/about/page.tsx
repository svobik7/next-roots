import type { Metadata } from 'next'
import type { GenerateMetadataProps, PageProps } from 'next-roots'
import { Page } from 'src/features/common/components/Page'
import { Links } from 'src/features/common/components/Links'
import { getAboutHref, getLocales, router } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

async function getData(locale: string) {
  const t = await getDictionary(locale)
  return {
    title: t('about.title'),
    content: t('about.content'),
    href: getAboutHref(locale),
  }
}

async function getAlternativeLink(locale: string) {
  const { title, href } = await getData(locale)
  return { locale, name: title, href }
}

export default async function AboutPage({ pageHref }: PageProps) {
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
}: GenerateMetadataProps<void>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const { title, content } = await getData(pageLocale)

  return { title, description: content }
}
