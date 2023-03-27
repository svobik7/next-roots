import type { RouterSchema } from '~/types'
import { compile } from './lib-router-schema-tpl'

const inputSchema: RouterSchema = {
  locales: ['cs', 'es'],
  defaultLocale: 'cs',
  routes: {
    cs: [
      { name: '/account', href: '/ucet' },
      { name: '/(auth)/login', href: '/prihlaseni' },
      {
        name: '/blog/articles/[articleId]',
        href: '/blog/clanky/:articleId',
      },
      { name: '/blog/authors/[authorId]', href: '/blog/autori/:authorId' },
    ],
    es: [
      { name: '/account', href: '/cuenta' },
      { name: '/(auth)/login', href: '/acceso' },
      {
        name: '/blog/articles/[articleId]',
        href: '/blog/articulos/:articleId',
      },
      {
        name: '/blog/authors/[authorId]',
        href: '/blog/authores/:authorId',
      },
    ],
  },
}

const expectedOutput = `
module.exports = Object.freeze(${JSON.stringify(inputSchema)});
`

test('should create lib schema', () => {
  const code = compile(inputSchema)
  expect(code).toBe(expectedOutput)
})
