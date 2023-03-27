import { getDictionary } from '~/server/utils/getDictionary'

export async function generateRouteNames() {
  const tEN = await getDictionary('en')
  const tCS = await getDictionary('cs')
  const tES = await getDictionary('es')

  return [
    { locale: 'en', path: tEN('about.slug') },
    { locale: 'cs', path: tCS('about.slug') },
    { locale: 'es', path: tES('about.slug') },
  ]
}
