import type { Metadata } from 'next'
import type { GeneratePageMetadataProps, PageProps } from 'next-roots'
import { getBookTranslationFactory } from 'src/features/blog/utils/getBookTranslation'
import { List } from 'src/features/common/components/List'
import { fetchBooks } from 'src/server/db'
import { getBooksDetailHref } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

export default async function BooksPage({ locale }: PageProps) {
  const translateBook = getBookTranslationFactory(locale)

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
  locale,
}: GeneratePageMetadataProps): Promise<Metadata> {
  const t = await getDictionary(locale)

  return { title: t('books.title'), description: t('books.content') }
}
