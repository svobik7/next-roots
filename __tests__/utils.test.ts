import { localize, createPagePath, suffixize } from '../src/utils'

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

    test('do not modify path when locale already exists', () => {
      const result = localize('en/path', 'en')
      expect(result).toEqual('en/path')
    })
  })

  /**
   * Test `createPagePath` method
   * ---
   * It should creates page paths based on given params
   */
  describe('createPagePath', () => {
    test('create paths from minimal config params', () => {
      const result = createPagePath({
        path: 'homepage-:token',
        locale: 'en',
        suffix: '',
      })
      expect(result).toEqual('/en/homepage-:token')
    })

    test('create paths with custom suffixes', () => {
      const result = createPagePath({
        path: 'homepage-:token',
        locale: 'en',
        suffix: '.htm',
      })
      expect(result).toEqual('/en/homepage-:token.htm')
    })
  })
})
