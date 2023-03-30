import type { Metadata } from 'next'
import type { GenerateMetadataProps, PageProps } from 'next-roots'
import { Page } from 'src/features/common/components/Page'
import { router } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

export default async function ContactPage({ pageHref }: PageProps) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)

  return (
    // @ts-expect-error Async Server Component
    <Page title={t('contacts.title')} content={t('contacts.content')} />
  )
}

export async function generateMetadata({
  pageHref,
}: GenerateMetadataProps<void>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)

  return { title: t('contacts.title'), description: t('contacts.content') }
}
