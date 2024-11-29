import { getDictionary } from 'src/server/utils/getDictionary'

async function generateRouteNames() {
  const tEN = await getDictionary('en')
  const tCS = await getDictionary('cs')
  const tES = await getDictionary('es')

  return [
    { locale: 'en', path: tEN('about.slug') },
    { locale: 'cs', path: tCS('about.slug') },
    { locale: 'es', path: tES('about.slug') },
  ]
}

module.exports.generateRouteNames = generateRouteNames
