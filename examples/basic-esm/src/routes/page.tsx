import type { Metadata } from 'next'
import type { GeneratePageMetadataProps, PageProps } from 'next-roots'
import { ArticlesList } from 'src/features/blog/components/ArticlesList'
import { getArticleTranslationFactory } from 'src/features/blog/utils/getArticleTranslation'
import { fetchArticles } from 'src/server/db'
import { getDictionary } from 'src/server/utils/getDictionary'

export default async function BlogPage({ locale }: PageProps<void>) {
  const translateArticle = getArticleTranslationFactory(locale)
  const articles = (await fetchArticles()).map(translateArticle)

  return <ArticlesList articles={articles} />
}

export async function generateMetadata({
  locale,
}: GeneratePageMetadataProps<void>): Promise<Metadata> {
  const t = await getDictionary(locale)

  return { title: t('common.title') }
}
