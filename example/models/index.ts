export interface Author {
  id: number
  name: string
  username: string
}

export interface Article {
  id: number
  title: string
  slug: string
  authorId: string
}

export function isAuthor(author: unknown): author is Author {
  if (author['id'] === undefined) return false
  if (author['name'] === undefined) return false
  if (author['username'] === undefined) return false

  return true
}

export function isArticle(article: unknown): article is Article {
  if (article['id'] === undefined) return false
  if (article['title'] === undefined) return false
  if (article['slug'] === undefined) return false
  if (article['authorId'] === undefined) return false

  return true
}
