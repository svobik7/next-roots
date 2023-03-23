import type { AuthorTranslation } from '~/server/db/types'
import { getAuthorHref } from '~/server/router'

export function getAuthorLinkParams(author: AuthorTranslation) {
  return {
    locale: author.locale,
    name: `${author.locale} - ${author.name}`,
    href: getAuthorHref(author),
  }
}
