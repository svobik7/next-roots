import type { Metadata } from 'next'
import type { Article, Author } from '~/server/db/types'
import { getArticleTranslation } from './getArticleTranslation'
import { getAuthorTranslation } from './getAuthorTranslation'

export function getAuthorMetadata(author: Author, locale: string): Metadata {
  const authorTranslation = getAuthorTranslation({ author, locale })

  return {
    title: authorTranslation.name,
    description: authorTranslation.about?.slice(0, 255),
  }
}
