// import rewire from 'rewire';
import {
  localizePath,
  createPagePath,
  suffixizePath,
} from '../src/utils/path-utils'

describe('next-i18n-rewrites:path-utils', () => {
  /**
   * Test `suffixizePath` method
   * ---
   * It should enriches given path with suffix
   * - does not modify the path when suffix is not given
   * - does not modify the path when suffix is already occurred
   * - throw an error when path is not string
   */
  describe('suffixizePath', () => {
    test('adds suffix to the end of path', () => {
      const result = suffixizePath('path', '.suffix')
      expect(result).toEqual('path.suffix')
    })

    test('do not modify path when suffix is empty', () => {
      const result = suffixizePath('path', '')
      expect(result).toEqual('path')
    })

    test('do not modify path when suffix already exists', () => {
      const result = suffixizePath('path.suffix', '.suffix')
      expect(result).toEqual('path.suffix')
    })

    test('throw an error when path is not string', () => {
      // @ts-ignore
      const method = () => suffixizePath({}, '.suffix')
      expect(method).toThrowError('Path must be type of string')
    })
  })

  /**
   * Test `localizePath` method
   * ---
   * It should localize given path with rewrite locale
   * - does not modify the path when no locale is given
   */
  describe('localizePath', () => {
    test('adds locale to the path', () => {
      const result = localizePath('some-path-:id', 'en')
      expect(result).toEqual('en/some-path-:id')
    })

    test('do not modify path when no locale is given', () => {
      const result = localizePath('path', '')
      expect(result).toEqual('path')
    })

    test('do not modify path when locale already exists', () => {
      const result = localizePath('en/path', 'en')
      expect(result).toEqual('en/path')
    })
  })

  /**
   * Test `rewritePath` method
   * ---
   * It should creates static paths for pages based on given params
   */
  describe('rewritePath', () => {
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
