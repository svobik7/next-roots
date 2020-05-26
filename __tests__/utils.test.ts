import {
  createRewriteKey,
  createRewritePath,
  localize,
  suffixize,
  rewriteAs,
  rewriteHref,
} from '../src/utils'

describe('next-i18n-rewrites:utils', () => {
  /**
   * Test `suffixize` method
   * ---
   * It should enriches given input with suffix
   * - does not modify the path when suffix is not given
   * - does not modify the path when suffix is already occurred
   * - throw an error when path is not string
   */
  describe('suffixize', () => {
    test('adds suffix to the end of input', () => {
      const result = suffixize('path', '.suffix')
      expect(result).toEqual('path.suffix')
    })

    test('do not modify path when suffix is empty', () => {
      const result = suffixize('path', '')
      expect(result).toEqual('path')
    })

    test('do not modify path when suffix already exists', () => {
      const result = suffixize('path.suffix', '.suffix')
      expect(result).toEqual('path.suffix')
    })

    test('throw an error when path is not string', () => {
      // @ts-ignore
      const method = () => suffixize({}, '.suffix')
      expect(method).toThrowError('Path must be type of string')
    })
  })

  /**
   * Test `localize` method
   * ---
   * It should localize given input with rewrite locale prefix
   * - does not modify the input when no locale is given
   */
  describe('localize', () => {
    test('adds locale to the path', () => {
      const result = localize('some-path-:id', 'en')
      expect(result).toEqual('en/some-path-:id')
    })

    test('do not modify path when no locale is given', () => {
      const result = localize('path', '')
      expect(result).toEqual('path')
    })

    test('use locale only when input is `/`', () => {
      const result = localize('/', 'en')
      expect(result).toEqual('en')
    })

    test('do not double slash between input and locale', () => {
      const result = localize('/some-path-:id', 'en')
      expect(result).toEqual('en/some-path-:id')
    })
  })

  /**
   * Test `createRewriteKey` method
   * ---
   * It should localize given input with rewrite locale prefix
   * - does not modify the input when no locale is given
   */
  describe('createRewriteKey', () => {
    test('create for root and locale', () => {
      const result = createRewriteKey('account/profile', 'en')
      expect(result).toBe('en/account/profile')
    })

    test('create for root and empty locale', () => {
      const result = createRewriteKey('account/profile', '')
      expect(result).toBe('account/profile')
    })
  })

  /**
   * Test `createRewritePath` method
   * ---
   * It should localize and suffixize given input
   * - does not modify the input when given input is empty
   */
  describe('createRewritePath', () => {
    test('create for locale and suffix', () => {
      const result = createRewritePath('account/profile', 'en', '.htm')
      expect(result).toBe('/en/account/profile.htm')
    })

    test('create for locale', () => {
      const result = createRewritePath('account/profile', 'en')
      expect(result).toBe('/en/account/profile')
    })

    test('do not modify empty input', () => {
      const result = createRewritePath('', 'en')
      expect(result).toBe('')
    })
  })

  /**
   * Test `rewriteAs` method
   * ---
   * It should find and retrieve link alias from given rewrites table
   */
  describe('rewriteAs', () => {
    test('create for existing as', () => {
      const result = rewriteAs('account/profile', {
        __table: [{ key: 'en/account/profile', as: '/en/account/profile.htm' }],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })

    test('create for not existing as', () => {
      const result = rewriteAs('account/profile', {
        __table: [
          { key: 'en/account/profile', href: '/en/account/profile.htm' },
        ],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })

    test('do not create for not existing table rule', () => {
      const result = rewriteAs('account/profile', {
        __table: [],
        locale: 'en',
      })
      expect(result).toBe('')
    })

    test('rename root from `/` to `index`', () => {
      const result = rewriteAs('/', {
        __table: [{ key: 'en/index', as: '/en/account/profile.htm' }],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })
  })

  /**
   * Test `rewriteHref` method
   * ---
   * It should find and retrieve link href from given rewrites table
   */
  describe('rewriteHref', () => {
    test('create for existing href', () => {
      const result = rewriteHref('account/profile', {
        __table: [
          { key: 'en/account/profile', href: '/en/account/profile.htm' },
        ],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })

    test('do not create for not existing table rule', () => {
      const result = rewriteHref('account/profile', {
        __table: [],
        locale: 'en',
      })
      expect(result).toBe('')
    })

    test('rename root from `/` to `index`', () => {
      const result = rewriteHref('/', {
        __table: [{ key: 'en/index', href: '/en/account/profile.htm' }],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })
  })
})
