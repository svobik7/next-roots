import type { Metadata } from 'next'
import type {
  GenerateMetadataProps,
  GenerateStaticParamsProps,
  PageProps,
} from 'next-roots'
import { notFound } from 'next/navigation'
import { AuthorDetail } from '~/features/blog/components/AuthorDetail'
import { getArticleLinkParams } from '~/features/blog/utils/getArticleLinkParams'
import { getArticleTranslationFactory } from '~/features/blog/utils/getArticleTranslation'
import { getAuthorLinkParams } from '~/features/blog/utils/getAuthorLinkParams'
import { getAuthorMetadata } from '~/features/blog/utils/getAuthorMetadata'
import {
  getAllAuthorTranslations,
  getAuthorTranslation,
} from '~/features/blog/utils/getAuthorTranslation'
import { Links } from '~/features/common/components/Links'
import { fetchArticles, fetchAuthorByUsername, fetchAuthors } from '~/server/db'
import { router } from '~/server/router'
import { getDictionary } from '~/server/utils/getDictionary'

type AuthorParams = { author: string }

export default async function AuthorPage({
  params,
  pageHref,
}: PageProps<AuthorParams>) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const author = await fetchAuthorByUsername(params.author)

  if (!author) {
    return notFound()
  }

  const allAuthorTranslations = getAllAuthorTranslations(author)
  const currentAuthorTranslation = getAuthorTranslation({
    author,
    locale: pageLocale,
  })

  if (!currentAuthorTranslation) {
    return notFound()
  }

  const articles = await fetchArticles()
  const authorArticles = articles.filter(
    ({ authorId }) => authorId === author.id
  )

  const getArticleTranslation = getArticleTranslationFactory(pageLocale)
  const authorArticlesTranslations = authorArticles.map(getArticleTranslation)

  const t = await getDictionary(pageLocale)

  return (
    // @ts-expect-error Async Server Component
    <AuthorDetail
      author={currentAuthorTranslation}
      articles={
        <Links
          header={t('author.PublishedArticles')}
          items={authorArticlesTranslations.map(getArticleLinkParams)}
        />
      }
      alternatives={
        <Links
          header={t('common.NotYourLanguage?')}
          items={allAuthorTranslations.map(getAuthorLinkParams)}
        />
      }
    />
  )
}

export async function generateMetadata({
  pageHref,
  params,
}: GenerateMetadataProps<AuthorParams>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const author = await fetchAuthorByUsername(params.author)

  if (!author) {
    return {}
  }

  return getAuthorMetadata(author, pageLocale)
}

export async function generateStaticParams({
  pageLocale,
}: GenerateStaticParamsProps) {
  const authors = await fetchAuthors()
  return authors.map((a) => ({
    author: a.username,
  }))
}
