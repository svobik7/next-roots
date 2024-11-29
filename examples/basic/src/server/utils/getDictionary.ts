import { getPageLocale } from '../router'
import { getDictionaryByLocale } from './getDictionaryByLocale'

export function getDictionary(locale: string = getPageLocale()) {
  return getDictionaryByLocale(locale)
}
