import type { Metadata } from 'next'
import type { GeneratePageMetadataProps, PageProps } from 'next-roots'
import { getBookTranslationFactory } from 'src/features/blog/utils/getBookTranslation'
import { List } from 'src/features/common/components/List'
import { fetchBooks } from 'src/server/db'
import { getBooksDetailHref, router } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

export default async function BooksPage({ pageHref }: PageProps) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const translateBook = getBookTranslationFactory(pageLocale)

  const books = await fetchBooks()

  return (
    <List
      items={books.map(translateBook).map((book) => ({
        id: book.id,
        title: book.title,
        href: getBooksDetailHref(book),
        content: book.content,
        createdAt: book.createdAt,
      }))}
    />
  )
}

export async function generateMetadata({
  pageHref,
}: GeneratePageMetadataProps): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)

  return { title: t('books.title'), description: t('books.content') }
}
