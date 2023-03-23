import type { ArticleTranslation } from '~/server/db/types'
import { getArticleHref } from '~/server/router'

export function getArticleLinkParams(article: ArticleTranslation) {
  return {
    locale: article.locale,
    name: article.title,
    href: getArticleHref(article),
  }
}
