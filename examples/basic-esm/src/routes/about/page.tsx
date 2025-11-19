import type { Metadata } from 'next'
import type { GeneratePageMetadataProps, PageProps } from 'next-roots'
import { Links } from 'src/features/common/components/Links'
import { Page } from 'src/features/common/components/Page'
import { getAboutHref, getLocales } from 'src/server/router'
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

export default async function AboutPage({ locale }: PageProps) {
  const alternativeLinks = await Promise.all(
    getLocales().map(getAlternativeLink)
  )

  const { title, content } = await getData(locale)
  const t = await getDictionary(locale)

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
  locale,
}: GeneratePageMetadataProps<void>): Promise<Metadata> {
  const { title, content } = await getData(locale)

  return { title, description: content }
}
