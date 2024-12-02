import { getDictionaryByLocale } from 'src/server/utils/getDictionaryByLocale'

export async function generateRouteNames() {
  const tEN = await getDictionaryByLocale('en')
  const tCS = await getDictionaryByLocale('cs')
  const tES = await getDictionaryByLocale('es')

  return [
    { locale: 'en', path: tEN('about.slug') },
    { locale: 'cs', path: tCS('about.slug') },
    { locale: 'es', path: tES('about.slug') },
  ]
}
