import { getPropValue } from 'src/features/common/utils/getPropValue'
import { fetchDictionary } from '../db'
import { Paths } from '../db/types'

export async function getDictionaryByLocale(locale: string) {
  const dictionary = await fetchDictionary(locale)

  if (!dictionary) {
    throw new Error(`Dictionary does not exists for locale "${locale}".`)
  }

  return (propName: Paths<typeof dictionary.value>) => {
    const defaultValue =
      process.env.NODE_ENV === 'development'
        ? `MissingTranslation(${locale}): "${propName}"`
        : propName

    return getPropValue(dictionary.value, propName, defaultValue)
  }
}
