import type { Article, ArticleTranslation } from '../../../server/db/types'
import { getTranslationFactory } from '../../common/utils/getTranslation'
import { getAuthorTranslationFactory } from './getAuthorTranslation'

type GetArticleTranslationProps = {
  article: Article
  locale: string
}

export function getArticleTranslation({
  article,
  locale,
}: GetArticleTranslationProps) {
  const translate = getTranslationFactory(locale)
  const translateAuthor = getAuthorTranslationFactory(locale)

  return {
    ...article,
    title: translate(article, 'title'),
    slug: translate(article, 'slug'),
    content: translate(article, 'content'),
    author: article.author && translateAuthor(article.author),
    locale,
  }
}

export function getAllArticleTranslations(article: Article) {
  return article.slug.map(({ locale }) =>
    getArticleTranslation({ article, locale })
  )
}

export function getArticleTranslationFactory(locale: string) {
  return (article: Article): ArticleTranslation =>
    getArticleTranslation({ locale, article })
}
