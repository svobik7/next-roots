import type { AuthorTranslation } from 'src/server/db/types'
import { getAuthorHref } from 'src/server/router'

export function getAuthorLinkParams(author: AuthorTranslation) {
  return {
    locale: author.locale,
    name: `${author.locale} - ${author.name}`,
    href: getAuthorHref(author),
  }
}
