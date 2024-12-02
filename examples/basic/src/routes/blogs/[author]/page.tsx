import type { Metadata } from 'next'
import type {
  GeneratePageMetadataProps,
  GeneratePageStaticParamsProps,
  PageProps,
} from 'next-roots'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AuthorDetail } from 'src/features/blog/components/AuthorDetail'
import { getArticleLinkParams } from 'src/features/blog/utils/getArticleLinkParams'
import { getArticleTranslationFactory } from 'src/features/blog/utils/getArticleTranslation'
import { getAuthorLinkParams } from 'src/features/blog/utils/getAuthorLinkParams'
import { getAuthorMetadata } from 'src/features/blog/utils/getAuthorMetadata'
import {
  getAllAuthorTranslations,
  getAuthorTranslation,
} from 'src/features/blog/utils/getAuthorTranslation'
import { Links } from 'src/features/common/components/Links'
import {
  fetchArticles,
  fetchAuthorByUsername,
  fetchAuthors,
} from 'src/server/db'
import { getHomeHref } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

type AuthorParams = Promise<{ author: string }>

export default async function AuthorPage({
  params,
  locale,
}: PageProps<AuthorParams>) {
  const author = await fetchAuthorByUsername((await params).author)

  if (!author) {
    return notFound()
  }

  const allAuthorTranslations = getAllAuthorTranslations(author)
  const currentAuthorTranslation = getAuthorTranslation({
    author,
    locale,
  })

  if (!currentAuthorTranslation) {
    return notFound()
  }

  const articles = await fetchArticles()
  const authorArticles = articles.filter(
    ({ authorId }) => authorId === author.id
  )

  const getArticleTranslation = getArticleTranslationFactory(locale)
  const authorArticlesTranslations = authorArticles.map(getArticleTranslation)

  const t = await getDictionary(locale)

  return (
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
      buttonBack={
        <Link
          href={getHomeHref(currentAuthorTranslation.locale)}
          role="button"
          className="rounded bg-indigo-600 px-4 py-2 text-base font-semibold leading-7 text-white"
        >
          {t('author.BtnHome')}
        </Link>
      }
    />
  )
}

export async function generateMetadata({
  locale,
  params,
}: GeneratePageMetadataProps<AuthorParams>): Promise<Metadata> {
  const author = await fetchAuthorByUsername((await params).author)

  if (!author) {
    return {}
  }

  return getAuthorMetadata(author, locale)
}

export async function generateStaticParams({
  pageLocale,
}: GeneratePageStaticParamsProps) {
  const authors = await fetchAuthors()
  return authors.map((a) => ({
    author: a.username,
  }))
}
