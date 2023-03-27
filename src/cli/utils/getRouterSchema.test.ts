import type { Route, RouterSchema } from '~/types'
import { getRouterSchema } from './getRouterSchema'

const inputRoutes: Route[] = [
  {
    name: '/(auth)/login',
    href: '/log-in',
  },
  {
    name: '/(auth)/login',
    href: '/cs/prihlaseni',
  },
  {
    name: '/(auth)/login',
    href: '/es/login',
  },
  {
    name: '/',
    href: '/',
  },
  {
    name: '/',
    href: '/cs',
  },
  {
    name: '/',
    href: '/es',
  },
]

const expectedSchema: RouterSchema = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'cs'],
  routes: {
    en: [
      {
        name: '/(auth)/login',
        href: '/log-in',
      },
      {
        name: '/',
        href: '/',
      },
    ],
    es: [
      {
        name: '/(auth)/login',
        href: '/es/login',
      },
      {
        name: '/',
        href: '/es',
      },
    ],
    cs: [
      {
        name: '/(auth)/login',
        href: '/cs/prihlaseni',
      },
      {
        name: '/',
        href: '/cs',
      },
    ],
  },
}

test('getRouterSchema', () => {
  const schema = getRouterSchema({
    routes: inputRoutes,
    locales: ['en', 'es', 'cs'],
    defaultLocale: 'en',
  })

  expect(schema).toEqual(expectedSchema)
})
