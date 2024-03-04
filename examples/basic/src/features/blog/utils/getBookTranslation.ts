import type { Book, BookTranslation } from '../../../server/db/types'
import { getTranslationFactory } from '../../common/utils/getTranslation'

type GetBookTranslationProps = {
  book: Book
  locale: string
}

export function getBookTranslation({ book, locale }: GetBookTranslationProps) {
  const translate = getTranslationFactory(locale)

  return {
    ...book,
    title: translate(book, 'title'),
    content: translate(book, 'content'),
    slug: translate(book, 'slug'),
    locale,
  }
}

export function getAllBookTranslations(book: Book) {
  return book.slug.map(({ locale }) => getBookTranslation({ book, locale }))
}

export function getBookTranslationFactory(locale: string) {
  return (book: Book): BookTranslation => getBookTranslation({ locale, book })
}
