export type Translation = { locale: string; value: string }
export type TranslationOf<T, P extends keyof T> = Omit<T, P> &
  WithLocale<{
    [x in P]: string
  }>

export type WithLocale<T> = T & { locale: string }

export type Author = {
  id: number
  name: string
  username: string
  avatar: string
  about: Translation[]
}

export type WithAuthor<T> = Omit<T, 'author'> & { author?: Author }

export type Article = WithAuthor<{
  id: number
  authorId: number
  title: Translation[]
  slug: Translation[]
  content: Translation[]
  createdAt: string
}>

export type Product = {
  id: number
  title: Translation[]
  slug: Translation[]
  content: Translation[]
  createdAt: string
}

export type Book = {
  id: number
  title: Translation[]
  slug: Translation[]
  content: Translation[]
  createdAt: string
}

export type AuthorTranslation = TranslationOf<Author, 'about'>

export type WithAuthorTranslation<T> = Omit<T, 'author'> & {
  author?: AuthorTranslation
}

export type ArticleTranslation = WithAuthorTranslation<
  TranslationOf<Article, 'title' | 'slug' | 'content'>
>

export type ProductTranslation = TranslationOf<
  Product,
  'title' | 'slug' | 'content'
>

export type BookTranslation = TranslationOf<Book, 'title' | 'slug' | 'content'>

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never

export type Prev = [never, 0, 1, 2, 3, 4, ...0[]]

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
          : never
      }[keyof T]
    : ''
