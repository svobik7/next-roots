import { asRootPath } from '~/utils/path-utils'
import type { Config, Origin, Rewrite } from '../types'

export function getRewritesFactory({ defaultLocale, prefixDefaultLocale }: Config) {
  return (origin: Origin): Rewrite[] => {
    return origin.localizations.map((l) => ({
      originPath: origin.path,
      localizedPath: asRootPath(!prefixDefaultLocale && l.locale === defaultLocale ? `(${l.locale})` : l.locale, l.path),
    }))
  }
}
