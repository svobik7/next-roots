import articles from './data/articles.json'
import authors from './data/authors.json'

export async function fetchOneAuthor(username: string) {
  return authors.find((a) => a.username === username) || {}
}

export async function fetchAllAuthors(limit: number) {
  if (limit) {
    return authors.slice(0, limit)
  }

  return authors
}

export async function fetchOneArticle(slug: string) {
  return articles.find((a) => a.slug === slug) || {}
}

export async function fetchAllArticles(limit: number = 0) {
  if (limit) {
    return articles.slice(0, limit)
  }

  return articles
}
