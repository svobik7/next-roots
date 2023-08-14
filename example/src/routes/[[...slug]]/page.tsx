import type { Metadata } from 'next'
import type { GeneratePageMetadataProps, PageProps } from 'next-roots'
import { ArticlesList } from 'src/features/blog/components/ArticlesList'
import { getArticleTranslationFactory } from 'src/features/blog/utils/getArticleTranslation'
import { fetchArticles } from 'src/server/db'
import { router } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

export default async function BlogPage({
  pageHref,
  params: { slug },
}: PageProps<{ slug: string[] }>) {
  // this is an example of using catch all routes under each locale (/en/[[...slug]])
  if (slug && slug.length > 0) {
    return (
      <div>
        This is catch all route for: <strong>/{slug.join('/')}</strong>. Do
        whatever you need here.
      </div>
    )
  }

  const pageLocale = router.getLocaleFromHref(pageHref)
  const translateArticle = getArticleTranslationFactory(pageLocale)
  const articles = (await fetchArticles()).map(translateArticle)

  return <ArticlesList articles={articles} />
}

export async function generateMetadata({
  pageHref,
}: GeneratePageMetadataProps<void>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)

  return { title: t('common.title') }
}
