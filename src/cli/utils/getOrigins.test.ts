import type { Origin } from '../types'
import { getOrigins } from './getOrigins'

const expectedOutput: Origin[] = [
  {
    path: '/(auth)/login/page.tsx',
    localizations: [
      { locale: 'en', path: '/(auth)/log-in/page.tsx', skip: false },
      { locale: 'cs', path: '/(auth)/prihlaseni/page.tsx', skip: false },
      { locale: 'es', path: '/(auth)/login/page.tsx', skip: false },
    ],
  },

  {
    path: '/(auth)/signup/page.tsx',
    localizations: [
      { locale: 'en', path: '/(auth)/signup/page.tsx', skip: false },
      { locale: 'cs', path: '/(auth)/registrace/page.tsx', skip: false },
      { locale: 'es', path: '/(auth)/registrarse/page.tsx', skip: false },
    ],
  },
  {
    path: '/(auth)/layout.ts',
    localizations: [
      { locale: 'en', path: '/(auth)/layout.ts', skip: false },
      { locale: 'cs', path: '/(auth)/layout.ts', skip: false },
      { locale: 'es', path: '/(auth)/layout.ts', skip: false },
    ],
  },
  {
    path: '/account/profile/edit/page.jsx',
    localizations: [
      { locale: 'en', path: '/account/profile/edit/page.jsx', skip: false },
      { locale: 'cs', path: '/ucet/profil/upravit/page.jsx', skip: false },
      { locale: 'es', path: '/cuenta/perfil/editar/page.jsx', skip: false },
    ],
  },
  {
    path: '/account/profile/page.ts',
    localizations: [
      { locale: 'en', path: '/account/profile/page.ts', skip: false },
      { locale: 'cs', path: '/ucet/profil/page.ts', skip: false },
      { locale: 'es', path: '/cuenta/perfil/page.ts', skip: false },
    ],
  },
  {
    path: '/account/settings/page.tsx',
    localizations: [
      { locale: 'en', path: '/account/settings/page.tsx', skip: false },
      { locale: 'cs', path: '/ucet/nastaveni/page.tsx', skip: false },
      { locale: 'es', path: '/cuenta/ajustes/page.tsx', skip: false },
    ],
  },
  {
    path: '/account/layout.js',
    localizations: [
      { locale: 'en', path: '/account/layout.js', skip: false },
      { locale: 'cs', path: '/ucet/layout.js', skip: false },
      { locale: 'es', path: '/cuenta/layout.js', skip: false },
    ],
  },
  {
    path: '/blog/[authorId]/[articleId]/edit/page.ts',
    localizations: [
      {
        locale: 'en',
        path: '/blog/[authorId]/[articleId]/edit/page.ts',
        skip: false,
      },
      {
        locale: 'cs',
        path: '/magazin/[authorId]/[articleId]/upravit/page.ts',
        skip: false,
      },
      {
        locale: 'es',
        path: '/revista/[authorId]/[articleId]/editar/page.ts',
        skip: false,
      },
    ],
  },
  {
    path: '/blog/[authorId]/[articleId]/page.ts',
    localizations: [
      {
        locale: 'en',
        path: '/blog/[authorId]/[articleId]/page.ts',
        skip: false,
      },
      {
        locale: 'cs',
        path: '/magazin/[authorId]/[articleId]/page.ts',
        skip: false,
      },
      {
        locale: 'es',
        path: '/revista/[authorId]/[articleId]/page.ts',
        skip: false,
      },
    ],
  },
  {
    path: '/blog/[authorId]/page.ts',
    localizations: [
      { locale: 'en', path: '/blog/[authorId]/page.ts', skip: false },
      { locale: 'cs', path: '/magazin/[authorId]/page.ts', skip: false },
      { locale: 'es', path: '/revista/[authorId]/page.ts', skip: false },
    ],
  },
  {
    path: '/blog/layout.tsx',
    localizations: [
      { locale: 'en', path: '/blog/layout.tsx', skip: false },
      { locale: 'cs', path: '/magazin/layout.tsx', skip: false },
      { locale: 'es', path: '/revista/layout.tsx', skip: false },
    ],
  },
  {
    path: '/blog/page.js',
    localizations: [
      { locale: 'en', path: '/blog/page.js', skip: false },
      { locale: 'cs', path: '/magazin/page.js', skip: false },
      { locale: 'es', path: '/revista/page.js', skip: false },
    ],
  },
  {
    path: '/books/[...slugs]/page.ts',
    localizations: [
      { locale: 'en', path: '/books/[...slugs]/page.ts', skip: false },
      { locale: 'cs', path: '/knihy/[...slugs]/page.ts', skip: false },
      { locale: 'es', path: '/libros/[...slugs]/page.ts', skip: false },
    ],
  },
  {
    path: '/books/page.ts',
    localizations: [
      { locale: 'en', path: '/books/page.ts', skip: false },
      { locale: 'cs', path: '/knihy/page.ts', skip: false },
      { locale: 'es', path: '/libros/page.ts', skip: false },
    ],
  },
  {
    path: '/products/[[...slugs]]/page.ts',
    localizations: [
      { locale: 'en', path: '/products/[[...slugs]]/page.ts', skip: false },
      { locale: 'cs', path: '/produkty/[[...slugs]]/page.ts', skip: false },
      { locale: 'es', path: '/productos/[[...slugs]]/page.ts', skip: false },
    ],
  },
  {
    path: '/skip/boolean/page.ts',
    localizations: [
      { locale: 'en', path: '/skip/boolean/page.ts', skip: false },
      { locale: 'cs', path: '/skip/logicka-hodnota/page.ts', skip: true },
      { locale: 'es', path: '/skip/booleano/page.ts', skip: false },
    ],
  },
  {
    path: '/skip/object/layout.ts',
    localizations: [
      {
        locale: 'en',
        path: '/skip/object/layout.ts',
        skip: { page: false, layout: false, template: false },
      },
      {
        locale: 'cs',
        path: '/skip/objekt/layout.ts',
        skip: { layout: true, template: true },
      },
      { locale: 'es', path: '/skip/objeto/layout.ts', skip: { page: true } },
    ],
  },
  {
    path: '/skip/object/page.ts',
    localizations: [
      {
        locale: 'en',
        path: '/skip/object/page.ts',
        skip: { page: false, layout: false, template: false },
      },
      {
        locale: 'cs',
        path: '/skip/objekt/page.ts',
        skip: { layout: true, template: true },
      },
      { locale: 'es', path: '/skip/objeto/page.ts', skip: { page: true } },
    ],
  },
  {
    path: '/skip/object/template.ts',
    localizations: [
      {
        locale: 'en',
        path: '/skip/object/template.ts',
        skip: { page: false, layout: false, template: false },
      },
      {
        locale: 'cs',
        path: '/skip/objekt/template.ts',
        skip: { layout: true, template: true },
      },
      { locale: 'es', path: '/skip/objeto/template.ts', skip: { page: true } },
    ],
  },

  {
    path: '/page.js',
    localizations: [
      { locale: 'en', path: '/page.js', skip: false },
      { locale: 'cs', path: '/page.js', skip: false },
      { locale: 'es', path: '/page.js', skip: false },
    ],
  },
]

test('getOrigins', async () => {
  const files = await getOrigins({
    dirName: process.cwd() + '/src/__mocks__/roots',
    locales: ['en', 'cs', 'es'],
    defaultLocale: 'en',
    format: 'cjs',
  })

  expect(files).toStrictEqual(expectedOutput)
})
