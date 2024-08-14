import type { BookTranslation } from 'src/server/db/types'
import { getBooksDetailHref } from 'src/server/router'

export function getBookLinkParams(book: BookTranslation) {
  return {
    locale: book.locale,
    name: book.title,
    href: getBooksDetailHref(book),
  }
}
