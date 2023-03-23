const routeNames = [
  {
    locale: 'en',
    path: 'should-be-overridden-by-generate-page-names-function',
  },
  {
    locale: 'cs',
    path: 'should-be-overridden-by-generate-page-names-function',
  },
]

async function generateRouteNames() {
  return [
    { locale: 'cs', path: 'nastaveni' },
    { locale: 'es', path: 'ajustes' },
  ]
}

module.exports = {
  routeNames,
  generateRouteNames,
}
