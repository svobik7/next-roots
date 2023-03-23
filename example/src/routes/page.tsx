import type { Metadata } from 'next'
import type { GenerateMetadataProps, PageProps } from 'next-roots'
import { ArticlesList } from '~/features/blog/components/ArticlesList'
import { getArticleTranslationFactory } from '~/features/blog/utils/getArticleTranslation'
import { fetchArticles } from '~/server/db'
import { router } from '~/server/router'
import { getDictionary } from '~/server/utils/getDictionary'

export default async function BlogPage({ pageHref }: PageProps<void>) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const translateArticle = getArticleTranslationFactory(pageLocale)
  const articles = (await fetchArticles()).map(translateArticle)

  return <ArticlesList articles={articles} />
}

export async function generateMetadata({
  pageHref,
}: GenerateMetadataProps<void>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)

  return { title: t('common.title') }
}
