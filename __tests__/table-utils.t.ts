import { createTableRuleID, rewriteTable } from '../src/utils/table-utils'

describe('next-i18n-rewrites:table-utils', () => {
  describe('createTableRuleID', () => {
    test('create for root and locale', () => {
      const result = createTableRuleID('account/profile', 'en')
      expect(result).toBe('en/account/profile')
    })

    test('create for root and empty locale', () => {
      const result = createTableRuleID('account/profile', '')
      expect(result).toBe('*/account/profile')
    })

    test('create for root only', () => {
      const result = createTableRuleID('account/profile')
      expect(result).toBe('*/account/profile')
    })
  })

  /**
   * Test `rewriteTable` method
   * ---
   * It should create rewrite table rules based on give rewrite configuration
   */
  describe('rewriteTable', () => {
    const rewriteTableOptions = { defaultSuffix: '' }

    test('create for href only rules', () => {
      const result = rewriteTable(
        [
          {
            root: 'account/profile',
            token: 'p1',
            params: [
              {
                locale: 'en',
                path: 'account/profile-:token',
                suffix: '.htm',
              },
              {
                locale: 'cs',
                path: 'ucet/profil-:token',
                suffix: '.htm',
              },
            ],
          },
        ],
        rewriteTableOptions
      )

      expect(result).toEqual([
        {
          ID: 'en/account/profile',
          href: '/en/account/profile-p1.htm',
          as: '/en/account/profile-p1.htm',
        },
        {
          ID: 'cs/account/profile',
          href: '/cs/ucet/profil-p1.htm',
          as: '/cs/ucet/profil-p1.htm',
        },
      ])
    })

    test('create for aliased rules', () => {
      const result = rewriteTable(
        [
          {
            root: 'account/profile',
            token: 'p1',
            params: [
              {
                locale: 'en',
                path: 'account/profile-:token',
                page: 'profile',
                suffix: '.htm',
              },
              {
                locale: 'cs',
                path: 'ucet/profil-:token',
                page: 'profil',
                suffix: '.htm',
              },
            ],
          },
        ],
        rewriteTableOptions
      )

      expect(result).toEqual([
        {
          ID: 'en/account/profile',
          href: '/en/account/profile-p1.htm',
          as: '/en/profile.htm',
        },
        {
          ID: 'cs/account/profile',
          href: '/cs/ucet/profil-p1.htm',
          as: '/cs/profil.htm',
        },
      ])
    })
  })

  // test('create for static not aliased rules', () => {
  //   const result = rewriteTable(
  //     [
  //       {
  //         root: 'account/profile',
  //         token: 'p1',
  //         params: [
  //           {
  //             locale: 'en',
  //             path: 'account/profile-:token',
  //             suffix: '.htm',
  //           },
  //           {
  //             locale: 'cs',
  //             path: 'ucet/profil-:token',
  //             suffix: '.htm',
  //           },
  //         ],
  //       },
  //     ],
  //     rewriteTableOptions
  //   )

  //   expect(result).toEqual([
  //     {
  //       id: 'en/account/profile',
  //       href: '/en/account/profile-p1.htm',
  //     },
  //     {
  //       id: 'cs/account/profile',
  //       href: '/cs/ucet/profil-p1.htm',
  //     },
  //   ])
  // })

  //   test('do not modify path when no token found', () => {
  //     const result = tokenizePath('path', 'TOKEN')
  //     expect(result).toEqual('path')
  //   })
  // })

  // /**
  //  * Test `rewritePath` method
  //  * ---
  //  * It should creates static paths for pages based on given rewrites params
  //  */
  // describe('rewritePath', () => {
  //   test('create paths from minimal config params', () => {
  //     const result = rewritePath(
  //       { locale: 'en', path: 'homepage-:token' },
  //       'p1'
  //     )
  //     expect(result).toEqual('en/homepage-p1')
  //   })

  //   test('create paths with custom suffixes', () => {
  //     const result = rewritePath(
  //       { locale: 'en', path: 'homepage-:token', suffix: '.htm' },
  //       'p1'
  //     )
  //     expect(result).toEqual('en/homepage-p1.htm')
  //   })
  // })

  // test('create paths with no token', () => {
  //   const result = rewritePath(
  //     { locale: 'en', path: 'homepage' },
  //     'token-to-be-ignored'
  //   )
  //   expect(result).toEqual('en/homepage')
  // })

  // test('create empty paths', () => {
  //   const result = rewritePath({ locale: 'en', path: '' }, 'any-token-you-want')
  //   expect(result).toEqual('en')
  // })
})
