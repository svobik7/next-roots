import type { Metadata } from 'next'
import type { Book } from 'src/server/db/types'
import { getBookTranslation } from './getBookTranslation'

export function getBookMetadata(book: Book, locale: string): Metadata {
  const bookTranslation = getBookTranslation({ book, locale })

  return {
    title: bookTranslation.title,
    description: bookTranslation.content?.slice(0, 255),
  }
}
