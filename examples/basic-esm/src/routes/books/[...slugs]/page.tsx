import type { Metadata } from 'next'
import type {
  GeneratePageMetadataProps,
  GenerateStaticParamsProps,
  PageProps,
} from 'next-roots'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getBookLinkParams } from 'src/features/blog/utils/getBookLinkParams'
import { getBookMetadata } from 'src/features/blog/utils/getBookMetadata'
import {
  getAllBookTranslations,
  getBookTranslation,
} from 'src/features/blog/utils/getBookTranslation'
import { Detail } from 'src/features/common/components/Detail'
import { Links } from 'src/features/common/components/Links'
import { fetchBookBySlug, fetchBooks, fetchProductBySlug } from 'src/server/db'
import { getBooksDetailHref, getHomeHref, router } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

type BookParam = Promise<{ slugs: string[] }>

export default async function BookPage({
  params,
  pageHref,
}: PageProps<BookParam>) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)

  const book = await fetchBookBySlug((await params).slugs)

  if (!book) {
    return notFound()
  }

  const allBookTranslations = getAllBookTranslations(book)
  const currentBookTranslation = getBookTranslation({
    book,
    locale: pageLocale,
  })

  if (!currentBookTranslation) {
    return notFound()
  }

  const href = getBooksDetailHref(currentBookTranslation)

  if (pageHref !== href) {
    return redirect(href)
  }

  return (
    <Detail
      title={currentBookTranslation.title}
      content={currentBookTranslation.content}
      alternatives={
        <Links
          header={t('common.NotYourLanguage?')}
          items={allBookTranslations.map(getBookLinkParams)}
        />
      }
      buttonBack={
        <Link
          href={getHomeHref(currentBookTranslation.locale)}
          role="button"
          className="rounded bg-indigo-600 px-4 py-2 text-base font-semibold leading-7 text-white"
        >
          {t('article.BtnBack')}
        </Link>
      }
    />
  )
}

export async function generateMetadata({
  pageHref,
  params,
}: GeneratePageMetadataProps<BookParam>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)

  const book = await fetchProductBySlug((await params).slugs)

  if (!book) {
    return {}
  }

  return getBookMetadata(book, pageLocale)
}

export async function generateStaticParams({
  pageLocale,
}: GenerateStaticParamsProps) {
  const books = await fetchBooks()

  return books
    .map((book) => ({
      slugs: book.slug
        .find((slug) => slug.locale === pageLocale)
        ?.value.split('/'),
    }))
    .filter((book) => book.slugs)
}
