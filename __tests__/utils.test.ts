import {
  createSchemaRulePath,
  decodeSchemaRuleKey,
  delocalize,
  encodeSchemaRuleKey,
  findSchemaRule,
  localize,
  parametrize,
  rewriteAs,
  rewriteHref,
  suffixize,
} from '../src/packages/utils'

describe('next-roots:utils', () => {
  /**
   * Test 'perametrize' method
   * ---
   * It should enriches given input with given params
   * - does not modify the path when params are not given
   * - does not modify the path when params are not occurred in path
   */
  describe('parametrize', () => {
    test('adds params to input', () => {
      const result = parametrize('path/[param1]/[...param2]', {
        param1: 'slug-1',
        param2: 'slug-2',
      })
      expect(result).toEqual('path/slug-1/slug-2')
    })

    test('expand array parma', () => {
      const result = parametrize('path/[param]', {
        param: ['slug-1', 'slug-2'],
      })
      expect(result).toEqual('path/slug-1/slug-2')
    })

    test('do not modify when params not given', () => {
      const result = parametrize('path/[param1]/[...param2]', {})
      expect(result).toEqual('path/[param1]/[...param2]')
    })

    test('do not modify when params not occured', () => {
      const result = parametrize('path/[p1]/[...p2]', {
        param1: 'slug-1',
        param2: 'slug-2',
      })
      expect(result).toEqual('path/[p1]/[...p2]')
    })
  })

  /**
   * Test 'suffixize' method
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

    test('do not modify input when suffix is empty', () => {
      const result = suffixize('path', '')
      expect(result).toEqual('path')
    })

    test('do not modify input when suffix already exists', () => {
      const result = suffixize('path.suffix', '.suffix')
      expect(result).toEqual('path.suffix')
    })

    test('do not modify non-string input', () => {
      // @ts-ignore
      const result = suffixize({}, '.suffix')
      expect(result).toEqual({})
    })
  })

  /**
   * Test 'localize' method
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

    test('do not modify non-string input', () => {
      // @ts-ignore
      const result = localize({}, 'en')
      expect(result).toEqual({})
    })
  })

  /**
   * Test 'delocalize' method
   * ---
   * It should de-localize given input with rewrite locale prefix
   * - de-localize also when locale is `*`
   */
  describe('delocalize', () => {
    test('remove locale from input', () => {
      const result = delocalize('en/some-path-:id', 'en')
      expect(result).toEqual('some-path-:id')
    })

    test('remove locale from input with leading `/`', () => {
      const result = delocalize('/en/some-path-:id', 'en')
      expect(result).toEqual('some-path-:id')
    })

    test('remove any locale from beginning when `*`', () => {
      const result = delocalize('/en/path-category/some-path-:id', '*')
      expect(result).toEqual('path-category/some-path-:id')
    })

    test('do not modify input when locale is not occurred', () => {
      const result = delocalize('/en/some-path-:id', 'es')
      expect(result).toEqual('/en/some-path-:id')
    })

    test('do not modify input when locale is not in the beginning of input', () => {
      const result = delocalize('/en/es/some-path-:id', 'es')
      expect(result).toEqual('/en/es/some-path-:id')
    })

    test('do not modify non-string input', () => {
      // @ts-ignore
      const result = delocalize({}, 'en')
      expect(result).toEqual({})
    })
  })

  /**
   * Test 'encodeSchemaRuleKey' method
   * ---
   * It should encode given input with rewrite locale prefix
   */
  describe('encodeSchemaRuleKey', () => {
    test('create for root and locale', () => {
      const result = encodeSchemaRuleKey('account/profile', 'en')
      expect(result).toBe('en:account/profile')
    })

    test('create for root and empty locale', () => {
      const result = encodeSchemaRuleKey('account/profile', '')
      expect(result).toBe('account/profile')
    })
  })

  /**
   * Test 'decodeSchemaRuleKey' method
   * ---
   * It should decode given input to [locale, root]
   * - use `undefined` when no locale is decoded
   */
  describe('decodeSchemaRuleKey', () => {
    test('decode full key', () => {
      const result = decodeSchemaRuleKey('en:account/profile')
      expect(result).toEqual(['account/profile', 'en'])
    })

    test('decode partial key', () => {
      const result = decodeSchemaRuleKey('account/profile')
      expect(result).toEqual(['account/profile', ''])
    })
  })

  /**
   * Test 'createSchemaRulePath' method
   * ---
   * It should localize and suffixize given input
   * - does not modify the input when given input is empty
   */
  describe('createSchemaRulePath', () => {
    test('create for locale and suffix', () => {
      const result = createSchemaRulePath('account/profile', 'en', '.htm')
      expect(result).toBe('/en/account/profile.htm')
    })

    test('create for locale', () => {
      const result = createSchemaRulePath('account/profile', 'en')
      expect(result).toBe('/en/account/profile')
    })

    test('do not modify empty input', () => {
      const result = createSchemaRulePath('', 'en')
      expect(result).toBe('')
    })
  })

  /**
   * Test 'findSchemaRule' method
   * ---
   * It should find and retrieve link alias from given schema table
   */
  describe('findSchemaRule', () => {
    test('find existing by string', () => {
      const expectedRule = {
        key: 'en:account/profile',
        href: '/en/account/profile.htm',
      }
      const result = findSchemaRule([expectedRule], 'en:account/profile')
      expect(result).toEqual(expectedRule)
    })

    test('find existing by array', () => {
      const expectedRule = {
        key: 'en:account/profile',
        href: '/en/account/profile.htm',
      }
      const result = findSchemaRule([expectedRule], ['account/profile', 'en'])
      expect(result).toEqual(expectedRule)
    })

    test('find non-existing by string', () => {
      const result = findSchemaRule(
        [
          {
            key: 'cs:account/profile',
            href: '/cs/ucet/profil.htm',
          },
        ],
        'en:account/profile'
      )
      expect(result).toBeUndefined()
    })

    test('find non-existing by array', () => {
      const result = findSchemaRule(
        [
          {
            key: 'cs:account/profile',
            href: '/cs/ucet/profil.htm',
          },
        ],
        ['account/profile', 'en']
      )
      expect(result).toBeUndefined()
    })
  })

  /**
   * Test 'rewriteAs' method
   * ---
   * It should find and retrieve link alias from given schema table
   */
  describe('rewriteAs', () => {
    test('rewrite for existing `rule.as`', () => {
      const __rules = [
        {
          key: 'en:account/profile',
          href: '/some-href-path',
          as: '/en/account/profile.htm',
        },
      ]

      const result = rewriteAs('account/profile', {
        __rules,
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })

    test('rewrite for non-existing `rule.as`', () => {
      const __rules = [
        {
          key: 'en:account/profile',
          href: '/en/account/profile.htm',
          as: undefined,
        },
      ]

      const result = rewriteAs('account/profile', {
        __rules,
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })

    test('rewrite for non-existing rule', () => {
      const result = rewriteAs('account/profile', {
        __rules: [],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile')
    })

    test('rewrite `/` with `home` rule', () => {
      const __rules = [
        {
          key: 'en:home',
          href: '/en/index',
          as: '/en',
        },
      ]

      const result = rewriteAs('/', {
        __rules,
        locale: 'en',
      })
      expect(result).toBe('/en')
    })

    test('rewrite for `rule.key` and different `locale`', () => {
      const __rules = [
        {
          key: 'en:account/profile',
          href: '/some-href-path',
          as: '/en/account/profile.htm',
        },
        {
          key: 'cs:account/profile',
          href: '/some-href-path',
          as: '/cs/ucet/profil.htm',
        },
      ]

      const result = rewriteAs('en:account/profile', {
        __rules,
        locale: 'cs',
      })
      expect(result).toBe('/cs/ucet/profil.htm')
    })

    test('ignore leading slash', () => {
      const result = rewriteAs('/account/profile', {
        __rules: [
          {
            key: 'en:account/profile',
            href: '/some-href-path',
            as: '/en/account/profile.htm',
          },
        ],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })

    test('keep query string', () => {
      const result = rewriteAs('/account/profile?param=value', {
        __rules: [
          {
            key: 'en:account/profile',
            href: '/some-href-path',
            as: '/en/account/profile.htm',
          },
        ],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm?param=value')
    })

    test('keep query string when `rule.as` is missing', () => {
      const result = rewriteAs('/account/profile?param=value', {
        __rules: [
          {
            key: 'en:account/profile',
            href: '/en/account/profile.htm',
          },
        ],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm?param=value')
    })

    test('push params to dynamic path', () => {
      const result = rewriteAs('dynamic', {
        __rules: [
          {
            key: 'en:dynamic',
            href: '/en/[...slug]',
          },
        ],
        locale: 'en',
        params: { slug: 'some-slug' },
      })
      expect(result).toBe('/en/some-slug')
    })
  })

  /**
   * Test 'rewriteHref' method
   * ---
   * It should find and retrieve link href from given schema table
   */
  describe('rewriteHref', () => {
    test('rewrite for existing `rule`', () => {
      const result = rewriteHref('account/profile', {
        __rules: [
          { key: 'en:account/profile', href: '/en/account/profile.htm' },
        ],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })

    test('rewrite for non-existing rule', () => {
      const result = rewriteHref('account/profile', {
        __rules: [],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile')
    })

    test('rewrite `/` with `home` rule', () => {
      const result = rewriteHref('/', {
        __rules: [{ key: 'en:home', href: '/en/index' }],
        locale: 'en',
      })
      expect(result).toBe('/en/index')
    })

    test('rewrite for `rulekey` and different `locale`', () => {
      const result = rewriteHref('en:account/profile', {
        __rules: [
          { key: 'en:account/profile', href: '/en/account/profile.htm' },
          { key: 'cs:account/profile', href: '/cs/ucet/profil.htm' },
        ],
        locale: 'cs',
      })
      expect(result).toBe('/cs/ucet/profil.htm')
    })

    test('ignore leading slash`', () => {
      const result = rewriteHref('/account/profile', {
        __rules: [
          { key: 'en:account/profile', href: '/en/account/profile.htm' },
        ],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm')
    })

    test('keep query string', () => {
      const result = rewriteHref('/account/profile?param=value', {
        __rules: [
          { key: 'en:account/profile', href: '/en/account/profile.htm' },
        ],
        locale: 'en',
      })
      expect(result).toBe('/en/account/profile.htm?param=value')
    })
  })
})
