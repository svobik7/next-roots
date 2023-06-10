import 'server-only'
import { Router, schema } from 'next-roots'
import type { ArticleTranslation, AuthorTranslation } from 'src/server/db/types'

export const router = new Router(schema)

export function getLocales() {
  return schema.locales
}

export function getPageLocale() {
  return router.getLocaleFromHref(Router.getPageHref())
}

export function getArticleHref(article: ArticleTranslation) {
  return router.getHref('/blogs/[author]/[article]', {
    article: article.slug,
    author: article.author?.username || '#',
    locale: article.locale || getPageLocale(),
  })
}

export function getAuthorHref(author: AuthorTranslation) {
  return router.getHref('/blogs/[author]', {
    author: author.username,
    locale: author.locale || getPageLocale(),
  })
}

export function getAboutHref(locale: string = getPageLocale()) {
  return router.getHref('/about', { locale })
}

export function getContactsHref(locale: string = getPageLocale()) {
  return router.getHref('/contact', { locale })
}

export function getHomeHref(locale: string = getPageLocale()) {
  return router.getHref('/', { locale })
}
