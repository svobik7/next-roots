export const routeNames = [
  {
    locale: 'en',
    path: 'should-be-overridden-by-generate-page-names-function',
  },
  {
    locale: 'cs',
    path: 'should-be-overridden-by-generate-page-names-function',
  },
]

export async function generateRouteNames() {
  return [
    { locale: 'en', path: 'log-in' },
    { locale: 'cs', path: 'prihlaseni' },
  ]
}
