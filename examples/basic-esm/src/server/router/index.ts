import { Router, schema } from 'next-roots'
import type {
  ArticleTranslation,
  AuthorTranslation,
  BookTranslation,
  ProductTranslation,
} from 'src/server/db/types'

export const router = new Router(schema)

export function getLocales() {
  return schema.locales
}

export function getPageLocale() {
  return Router.getLocale()
}

export function getPageHref() {
  return Router.getPageHref()
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

type GetProductsHrefProps = { locale: string } | { product: ProductTranslation }

export function getProductsHref(input: GetProductsHrefProps) {
  const locale = 'product' in input ? input.product.locale : input.locale
  const product = 'product' in input ? input.product : undefined

  return router.getHref('/products/[[...slugs]]', {
    slugs: product?.slug ? [product.slug] : undefined,
    locale: locale || getPageLocale(),
  })
}

export function getBooksHref(locale: string) {
  return router.getHref('/books', { locale })
}

export function getBooksDetailHref(book: BookTranslation) {
  return router.getHref('/books/[...slugs]', {
    slugs: [book.slug],
    locale: book.locale || getPageLocale(),
  })
}
