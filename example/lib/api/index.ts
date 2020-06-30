const { promises: fs } = require('fs')

async function loadDB() {
  const rawData = await fs.readFile(process.cwd() + '/lib/api//db.json')
  return JSON.parse(rawData)
}

export async function fetchOneAuthor(username: string) {
  const db = await loadDB()
  return db.authors.find((a) => a.username === username) || {}
}

export async function fetchManyAuthors(limit: number) {
  const db = await loadDB()

  if (limit) {
    return db.authors.slice(0, limit)
  }

  return db.authors
}

export async function fetchOneArticle(slug: string) {
  const db = await loadDB()
  return db.articles.find((a) => a.slug === slug) || {}
}

export async function fetchManyArticles(limit: number = 0) {
  const db = await loadDB()

  if (limit) {
    return db.articles.slice(0, limit)
  }

  return db.articles
}
