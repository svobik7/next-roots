import type { Translation } from '../../../server/db/types'
import { getPropValue } from './getPropValue'

type GetTranslationProps = {
  data: unknown
  propName: string
  locale: string
}

export function getTranslation({
  data,
  locale,
  propName,
}: GetTranslationProps): string {
  const propValue = getPropValue(data, propName)

  if (Array.isArray(propValue)) {
    return propValue.find((v: Translation) => v.locale === locale)?.value
  }

  return ''
}

export function getTranslationFactory(locale: string) {
  return (data: unknown, propName: string): string => {
    return getTranslation({ data, propName, locale })
  }
}
