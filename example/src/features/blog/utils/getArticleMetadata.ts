import type { Metadata } from 'next'
import type { Article } from '~/server/db/types'
import { getArticleTranslation } from './getArticleTranslation'

export function getArticleMetadata(
  article: Article,
  locale: string
): Metadata {
  const articleTranslation = getArticleTranslation({ article, locale })

  return {
    title: articleTranslation.title,
    description: articleTranslation.content?.slice(0, 255),
  }
}
