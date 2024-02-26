import type { Origin } from '../types'
import { getOrigins } from './getOrigins'

const expectedOutput: Origin[] = [
  {
    path: '/(auth)/login/page.tsx',
    localizations: [
      { locale: 'en', path: '/(auth)/log-in/page.tsx' },
      { locale: 'cs', path: '/(auth)/prihlaseni/page.tsx' },
      { locale: 'es', path: '/(auth)/login/page.tsx' },
    ],
  },

  {
    path: '/(auth)/signup/page.tsx',
    localizations: [
      { locale: 'en', path: '/(auth)/signup/page.tsx' },
      { locale: 'cs', path: '/(auth)/registrace/page.tsx' },
      { locale: 'es', path: '/(auth)/registrarse/page.tsx' },
    ],
  },
  {
    path: '/(auth)/layout.ts',
    localizations: [
      { locale: 'en', path: '/(auth)/layout.ts' },
      { locale: 'cs', path: '/(auth)/layout.ts' },
      { locale: 'es', path: '/(auth)/layout.ts' },
    ],
  },
  {
    path: '/account/profile/edit/page.jsx',
    localizations: [
      { locale: 'en', path: '/account/profile/edit/page.jsx' },
      { locale: 'cs', path: '/ucet/profil/upravit/page.jsx' },
      { locale: 'es', path: '/cuenta/perfil/editar/page.jsx' },
    ],
  },
  {
    path: '/account/profile/page.ts',
    localizations: [
      { locale: 'en', path: '/account/profile/page.ts' },
      { locale: 'cs', path: '/ucet/profil/page.ts' },
      { locale: 'es', path: '/cuenta/perfil/page.ts' },
    ],
  },
  {
    path: '/account/settings/page.tsx',
    localizations: [
      { locale: 'en', path: '/account/settings/page.tsx' },
      { locale: 'cs', path: '/ucet/nastaveni/page.tsx' },
      { locale: 'es', path: '/cuenta/ajustes/page.tsx' },
    ],
  },
  {
    path: '/account/layout.js',
    localizations: [
      { locale: 'en', path: '/account/layout.js' },
      { locale: 'cs', path: '/ucet/layout.js' },
      { locale: 'es', path: '/cuenta/layout.js' },
    ],
  },
  {
    path: '/blog/[authorId]/[articleId]/edit/page.ts',
    localizations: [
      { locale: 'en', path: '/blog/[authorId]/[articleId]/edit/page.ts' },
      { locale: 'cs', path: '/magazin/[authorId]/[articleId]/upravit/page.ts' },
      { locale: 'es', path: '/revista/[authorId]/[articleId]/editar/page.ts' },
    ],
  },
  {
    path: '/blog/[authorId]/[articleId]/page.ts',
    localizations: [
      { locale: 'en', path: '/blog/[authorId]/[articleId]/page.ts' },
      { locale: 'cs', path: '/magazin/[authorId]/[articleId]/page.ts' },
      { locale: 'es', path: '/revista/[authorId]/[articleId]/page.ts' },
    ],
  },
  {
    path: '/blog/[authorId]/page.ts',
    localizations: [
      { locale: 'en', path: '/blog/[authorId]/page.ts' },
      { locale: 'cs', path: '/magazin/[authorId]/page.ts' },
      { locale: 'es', path: '/revista/[authorId]/page.ts' },
    ],
  },
  {
    path: '/blog/layout.tsx',
    localizations: [
      { locale: 'en', path: '/blog/layout.tsx' },
      { locale: 'cs', path: '/magazin/layout.tsx' },
      { locale: 'es', path: '/revista/layout.tsx' },
    ],
  },
  {
    path: '/blog/page.js',
    localizations: [
      { locale: 'en', path: '/blog/page.js' },
      { locale: 'cs', path: '/magazin/page.js' },
      { locale: 'es', path: '/revista/page.js' },
    ],
  },
  {
    path: '/products/[[...slugs]]/page.ts',
    localizations: [
      { locale: 'en', path: '/products/[[...slugs]]/page.ts' },
      { locale: 'cs', path: '/produkty/[[...slugs]]/page.ts' },
      { locale: 'es', path: '/productos/[[...slugs]]/page.ts' },
    ],
  },
  {
    path: '/page.js',
    localizations: [
      { locale: 'en', path: '/page.js' },
      { locale: 'cs', path: '/page.js' },
      { locale: 'es', path: '/page.js' },
    ],
  },
]

test('getOrigins', async () => {
  const files = await getOrigins({
    dirName: process.cwd() + '/src/__mocks__/roots',
    locales: ['en', 'cs', 'es'],
    defaultLocale: 'en',
  })

  expect(files).toStrictEqual(expectedOutput)
})
