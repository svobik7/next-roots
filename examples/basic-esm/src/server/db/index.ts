import type { Article, Author, Book, Product, WithAuthor } from './types'

async function loadDB() {
  const rawData = await import('./db.json')
  return rawData
}

export async function fetchDictionary(locale: string) {
  const db = await loadDB()
  return db.dictionaries.find((dictionary) => dictionary.locale === locale)
}

export async function fetchAuthorByUsername(
  username: string
): Promise<Author | undefined> {
  const db = await loadDB()
  return db.authors.find((author) => author.username === username)
}

export async function fetchAuthors(limit?: number): Promise<Author[]> {
  const db = await loadDB()

  if (limit) {
    return db.authors.slice(0, limit)
  }

  return db.authors
}

export async function fetchArticleBySlug(
  slug: string
): Promise<Article | undefined> {
  const db = await loadDB()
  const withAuthor = await withAuthorFactory()

  const article = db.articles.find((article) =>
    article.slug.find((articleSlug) => articleSlug.value === slug)
  )

  return article ? withAuthor(article) : undefined
}

export async function fetchArticles(limit?: number): Promise<Article[]> {
  const db = await loadDB()
  const withAuthor = await withAuthorFactory()

  return db.articles.slice(0, limit ?? db.articles.length).map(withAuthor)
}

async function withAuthorFactory() {
  const db = await loadDB()

  return <T extends { authorId: number }>(article: T): WithAuthor<T> => {
    return {
      ...article,
      author: db.authors.find(({ id }) => id === article.authorId),
    }
  }
}

export async function fetchProducts(limit?: number): Promise<Product[]> {
  const db = await loadDB()
  return db.products.slice(0, limit ?? db.articles.length)
}

export async function fetchProductBySlug(
  slug: string | string[]
): Promise<Product | undefined> {
  const productSlug = Array.isArray(slug) ? slug.join('/') : slug

  const db = await loadDB()
  return db.products.find((product) =>
    product.slug.find((slug) => slug.value === productSlug)
  )
}

export async function fetchBookBySlug(
  slug: string | string[]
): Promise<Book | undefined> {
  const bookSlug = Array.isArray(slug) ? slug.join('/') : slug
  const db = await loadDB()

  return db.books.find((book) =>
    book.slug.find((slug) => slug.value === bookSlug)
  )
}

export async function fetchBooks(limit?: number): Promise<Book[]> {
  const db = await loadDB()
  return db.books.slice(0, limit ?? db.books.length)
}
