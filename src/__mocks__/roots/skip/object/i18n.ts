export const routeNames = [
  {
    locale: 'en',
    path: 'object',
    skip: { page: false, layout: false, template: false },
  },
  { locale: 'cs', path: 'objekt', skip: { layout: true, template: true } },
  { locale: 'es', path: 'objeto', skip: { page: true } },
]
