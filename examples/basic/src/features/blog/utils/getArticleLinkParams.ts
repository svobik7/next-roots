import type { ArticleTranslation } from 'src/server/db/types'
import { getArticleHref } from 'src/server/router'

export function getArticleLinkParams(article: ArticleTranslation) {
  return {
    locale: article.locale,
    name: article.title,
    href: getArticleHref(article),
  }
}
