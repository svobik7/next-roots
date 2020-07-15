import { parsePathname } from '../../src/packages/context'

describe('next-roots/context', () => {
  /**
   * Test 'useRootLink' hook
   * ---
   * It should creates links based on current roots context
   */
  describe('parsePathname', () => {
    test('parse existing pathname', () => {
      const result = parsePathname('/en/auth/signup-a1.page', {
        defaultLocale: 'en',
        rules: [{ key: 'en:auth/signup', href: '/en/auth/signup-a1.page' }],
        locales: ['en', 'cs'],
        meta: [],
      })

      expect(result.locale).toBe('en')
      expect(result.root).toBe('auth/signup')
      expect(result.rule).toEqual({
        key: 'en:auth/signup',
        href: '/en/auth/signup-a1.page',
      })
    })

    test('parse invalid pathname with valid locale', () => {
      const result = parsePathname('/cs/overeni/registrace-a1.page', {
        defaultLocale: 'en',
        rules: [{ key: 'en:auth/signup', href: '/en/auth/signup-a1.page' }],
        locales: ['en', 'cs'],
        meta: [],
      })

      expect(result.locale).toBe('cs')
      expect(result.root).toBe('')
      expect(result.rule).toBe(undefined)
    })

    test('parse invalid pathname with invalid locale', () => {
      const result = parsePathname('/es/invalid-slug', {
        defaultLocale: 'en',
        rules: [{ key: 'en:auth/signup', href: '/en/auth/signup-a1.page' }],
        locales: ['en', 'cs'],
        meta: [],
      })

      expect(result.locale).toBe('')
      expect(result.root).toBe('')
      expect(result.rule).toBe(undefined)
    })
  })
})
