import type { AuthorTranslation, Author } from '../../../server/db/types'
import { getTranslationFactory } from '../../common/utils/getTranslation'

type GetAuthorTranslationProps = {
  author: Author
  locale: string
}

export function getAuthorTranslation({
  author,
  locale,
}: GetAuthorTranslationProps) {
  const translate = getTranslationFactory(locale)

  return {
    ...author,
    about: translate(author, 'about'),
    locale,
  }
}

export function getAllAuthorTranslations(author: Author) {
  return author.about.map(({ locale }) =>
    getAuthorTranslation({ author, locale })
  )
}

export function getAuthorTranslationFactory(locale: string) {
  return (author: Author): AuthorTranslation =>
    getAuthorTranslation({ locale, author })
}
