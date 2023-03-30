import type { Metadata } from 'next'
import type {
  GenerateMetadataProps,
  GenerateStaticParamsProps,
  PageProps,
} from 'next-roots'
import { notFound, redirect } from 'next/navigation'
import { ArticleDetail } from 'src/features/blog/components/ArticleDetail'
import { getArticleLinkParams } from 'src/features/blog/utils/getArticleLinkParams'
import { getArticleMetadata } from 'src/features/blog/utils/getArticleMetadata'
import {
  getAllArticleTranslations,
  getArticleTranslation,
} from 'src/features/blog/utils/getArticleTranslation'
import { Links } from 'src/features/common/components/Links'
import { fetchArticleBySlug, fetchArticles, fetchAuthors } from 'src/server/db'
import { getArticleHref, router } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

type AuthorArticleParams = { author: string; article: string }

export default async function AuthorArticlePage({
  params,
  pageHref,
}: PageProps<AuthorArticleParams>) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const article = await fetchArticleBySlug(params.article)

  if (!article) {
    return notFound()
  }

  const allArticleTranslations = getAllArticleTranslations(article)
  const currentArticleTranslation = getArticleTranslation({
    article,
    locale: pageLocale,
  })

  if (!currentArticleTranslation) {
    return notFound()
  }

  const href = getArticleHref(currentArticleTranslation)

  if (pageHref !== href) {
    return redirect(href)
  }

  const t = await getDictionary(pageLocale)

  return (
    // @ts-expect-error Async Server Component
    <ArticleDetail
      article={currentArticleTranslation}
      alternatives={
        <Links
          header={t('common.NotYourLanguage?')}
          items={allArticleTranslations.map(getArticleLinkParams)}
        />
      }
    />
  )
}

export async function generateMetadata({
  pageHref,
  params,
}: GenerateMetadataProps<AuthorArticleParams>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const article = await fetchArticleBySlug(params.article)

  if (!article) {
    return {}
  }

  return getArticleMetadata(article, pageLocale)
}

export async function generateStaticParams({
  pageLocale,
}: GenerateStaticParamsProps) {
  const authors = await fetchAuthors()
  const articles = await fetchArticles()

  return articles
    .map(({ slug, authorId }) => ({
      author: authors.find(({ id }) => id === authorId)?.username,
      article: slug.find(({ locale }) => locale === pageLocale)?.value,
    }))
    .filter((props) => props.article && props.author)
}
