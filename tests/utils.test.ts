// import rewire from 'rewire';
import { createRewritePath, suffixizePath, tokenizePath } from '../src/utils'

describe('next-rewrites:utils', () => {
  // rewire whole lib
  // const Utils = rewire('./../utils');

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
   * Test `tokenizePath` method
   * ---
   * It should tokenize given path with rewrite token
   * - does not modify the path when no :token found in path
   */
  describe('tokenizePath', () => {
    test('adds token to the path', () => {
      const result = tokenizePath('path-:token', 'TOKEN')
      expect(result).toEqual('path-TOKEN')
    })

    test('do not modify path when no token found', () => {
      const result = tokenizePath('path', 'TOKEN')
      expect(result).toEqual('path')
    })
  })

  /**
   * Test `createRewritePath` method
   * ---
   * It should creates static paths for pages based on given rewrites params
   */
  describe('createRewritePath', () => {
    test('create paths from minimal config params', () => {
      const result = createRewritePath(
        { locale: 'en', path: 'homepage-:token' },
        'p1'
      )
      expect(result).toEqual('en/homepage-p1')
    })

    test('create paths with custom suffixes', () => {
      const result = createRewritePath(
        { locale: 'en', path: 'homepage-:token', suffix: '.htm' },
        'p1'
      )
      expect(result).toEqual('en/homepage-p1.htm')
    })
  })

  /**
   * Test `createRoutePath` method
   * ---
   * It should creates string path from given input which can be used in URL
   */
  // describe('createRoutePath', () => {
  //   test('creates empty string when provided with empty params', () => {
  //     const mockSuffixRouteParam = jest.fn();

  //     Utils.__set__('suffixRouteParam', mockSuffixRouteParam);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutePath({}, { suffix: '' });
  //     expect(result).toEqual('');

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();
  //   });

  //   test('creates path only from `locale` when no other param is given', () => {
  //     const mockSuffixRouteParam = jest.fn();

  //     Utils.__set__('suffixRouteParam', mockSuffixRouteParam);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutePath({ locale: 'cs' }, { suffix: '' });
  //     expect(result).toEqual('cs');

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();
  //   });

  //   test('creates path only from `slug` when no other param is given', () => {
  //     const mockSuffixRouteParam = jest.fn(() => 'some-slug');

  //     Utils.__set__('suffixRouteParam', mockSuffixRouteParam);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutePath(
  //       { slug: 'some-slug' },
  //       { suffix: '' }
  //     );
  //     expect(result).toEqual('some-slug');

  //     expect(mockSuffixRouteParam).toHaveBeenCalledWith('some-slug', '');
  //   });

  //   test('creates path from `string` slug param', () => {
  //     const mockSuffixRouteParam = jest.fn(() => 'some-slug.htm');

  //     Utils.__set__('suffixRouteParam', mockSuffixRouteParam);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutePath(
  //       { slug: 'some-slug' },
  //       { suffix: '.htm' }
  //     );
  //     expect(result).toEqual('some-slug.htm');

  //     expect(mockSuffixRouteParam).toHaveBeenCalledWith('some-slug', '.htm');
  //   });

  //   test('creates path from `array` slug param', () => {
  //     const mockSuffixRouteParam = jest.fn(() => [
  //       'first-slug',
  //       'second-slug.htm',
  //     ]);

  //     Utils.__set__('suffixRouteParam', mockSuffixRouteParam);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutePath(
  //       { slug: ['first-slug', 'second-slug'] },
  //       { suffix: '.htm' }
  //     );
  //     expect(result).toEqual('first-slug/second-slug.htm');

  //     expect(mockSuffixRouteParam).toHaveBeenCalledWith(
  //       ['first-slug', 'second-slug'],
  //       '.htm'
  //     );
  //   });
  // });

  // /**
  //  * Test `createRoutingParams` method
  //  * ---
  //  * It should create all available static params based on routing table which can be used in `getStaticPaths`
  //  */
  // describe('createRoutingParams', () => {
  //   let mockSuffixRouteParam: jest.Mock;

  //   beforeEach(() => {
  //     mockSuffixRouteParam = jest.fn((input) => input);
  //     Utils.__set__('suffixRouteParam', mockSuffixRouteParam);
  //   });

  //   test('creates empty params for empty routes', () => {
  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingParams({
  //       ...routingOptions,
  //       routes: [],
  //     });
  //     expect(result).toEqual([]);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();
  //   });

  //   test('creates empty params for invalid root', () => {
  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingParams(
  //       {
  //         ...routingOptions,
  //         routes: [
  //           {
  //             name: 'account-profile',
  //             root: 'a',
  //             params: [
  //               {
  //                 locale: 'en',
  //                 slug: ['account', 'profile'],
  //               },
  //               {
  //                 locale: 'cs',
  //                 slug: ['ucet', 'profil'],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       'invalid-root'
  //     );
  //     expect(result).toEqual([]);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();
  //   });

  //   test('creates empty params for invalid locale', () => {
  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingParams({
  //       ...routingOptions,
  //       routes: [
  //         {
  //           name: 'account-profile',
  //           params: [
  //             {
  //               locale: 'cs',
  //               slug: ['ucet', 'profil'],
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //     expect(result).toEqual([]);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();
  //   });

  //   test('creates empty params for invalid slug', () => {
  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingParams({
  //       ...routingOptions,
  //       routes: [
  //         {
  //           name: 'account-profile',
  //           params: [
  //             {
  //               locale: 'en',
  //               slug: undefined,
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //     expect(result).toEqual([]);

  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();
  //   });

  //   test('creates routing params only for given root', () => {
  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingParams(
  //       {
  //         ...routingOptions,
  //         routes: [
  //           {
  //             name: 'account-profile',
  //             root: 'a',
  //             params: [
  //               {
  //                 locale: 'en',
  //                 slug: ['account', 'profile'],
  //               },
  //             ],
  //           },
  //           {
  //             name: 'about',
  //             root: '',
  //             params: [
  //               {
  //                 locale: 'en',
  //                 slug: ['about-us'],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       'a'
  //     );
  //     expect(result).toEqual([
  //       { params: { locale: 'en', slug: ['account', 'profile'] } },
  //     ]);

  //     expect(mockSuffixRouteParam).toHaveBeenCalledWith(
  //       ['account', 'profile'],
  //       routingOptions.pathOptions.suffix
  //     );
  //   });

  //   test('creates routing params for all routes', () => {
  //     expect(mockSuffixRouteParam).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingParams({
  //       ...routingOptions,
  //       routes: [
  //         {
  //           name: 'account-profile',
  //           root: 'a',
  //           params: [
  //             {
  //               locale: 'en',
  //               slug: ['account', 'profile'],
  //             },
  //           ],
  //         },
  //         {
  //           name: 'about',
  //           root: '',
  //           params: [
  //             {
  //               locale: 'en',
  //               slug: ['about-us'],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     expect(result).toEqual([
  //       { params: { locale: 'en', slug: ['account', 'profile'] } },
  //       { params: { locale: 'en', slug: ['about-us'] } },
  //     ]);

  //     expect(mockSuffixRouteParam).toHaveBeenCalledWith(
  //       ['account', 'profile'],
  //       routingOptions.pathOptions.suffix
  //     );

  //     expect(mockSuffixRouteParam).toHaveBeenCalledWith(
  //       ['about-us'],
  //       routingOptions.pathOptions.suffix
  //     );
  //   });
  // });

  // /**
  //  * Test `createRoutingTable` method
  //  * ---
  //  * It should create routing table based on routing configuration
  //  */
  // describe('createRoutingTable', () => {
  //   let mockCreateRoutePath: jest.Mock;

  //   beforeEach(() => {
  //     mockCreateRoutePath = jest.fn(() => true);
  //     Utils.__set__('createRoutePath', mockCreateRoutePath);
  //   });

  //   test('creates empty table for empty routes', () => {
  //     expect(mockCreateRoutePath).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingTable({
  //       ...routingOptions,
  //       routes: [],
  //     });

  //     expect(result.size).toEqual(0);

  //     expect(mockCreateRoutePath).not.toHaveBeenCalled();
  //   });

  //   test('creates empty table for invalid root', () => {
  //     expect(mockCreateRoutePath).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingTable(
  //       {
  //         ...routingOptions,
  //         routes: [
  //           {
  //             name: 'account-profile',
  //             root: 'a',
  //             params: [
  //               {
  //                 locale: 'en',
  //                 slug: ['account', 'profile'],
  //               },
  //               {
  //                 locale: 'cs',
  //                 slug: ['ucet', 'profil'],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       'invalid-root'
  //     );

  //     expect(result.size).toEqual(0);

  //     expect(mockCreateRoutePath).not.toHaveBeenCalled();
  //   });

  //   test('creates empty table for invalid locale', () => {
  //     expect(mockCreateRoutePath).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingTable({
  //       ...routingOptions,
  //       routes: [
  //         {
  //           name: 'account-profile',
  //           params: [
  //             {
  //               locale: 'cs',
  //               slug: ['ucet', 'profil'],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     expect(result.size).toEqual(0);

  //     expect(mockCreateRoutePath).not.toHaveBeenCalled();
  //   });

  //   test('creates routing table only for given root', () => {
  //     expect(mockCreateRoutePath).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingTable(
  //       {
  //         ...routingOptions,
  //         routes: [
  //           {
  //             name: 'account-profile',
  //             root: 'a',
  //             params: [
  //               {
  //                 locale: 'en',
  //                 slug: ['account', 'profile'],
  //               },
  //             ],
  //           },
  //           {
  //             name: 'about',
  //             root: '',
  //             params: [
  //               {
  //                 locale: 'en',
  //                 slug: ['about-us'],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       'a'
  //     );

  //     const expected = [[true, 'account-profile']];
  //     expect([...result]).toEqual(expected);

  //     expect(mockCreateRoutePath).toHaveBeenCalledWith(
  //       { locale: 'en', slug: ['account', 'profile'] },
  //       routingOptions.pathOptions
  //     );
  //   });

  //   test('creates routing table for all routes', () => {
  //     // use specific mock for this test case
  //     mockCreateRoutePath = jest.fn(
  //       (params, options) =>
  //         `${params.locale}/${params.slug.join('/')}${options.suffix}`
  //     );
  //     Utils.__set__('createRoutePath', mockCreateRoutePath);

  //     expect(mockCreateRoutePath).not.toHaveBeenCalled();

  //     const result = Utils.createRoutingTable({
  //       ...routingOptions,
  //       routes: [
  //         {
  //           name: 'account-profile',
  //           root: 'a',
  //           params: [
  //             {
  //               locale: 'en',
  //               slug: ['account', 'profile'],
  //             },
  //           ],
  //         },
  //         {
  //           name: 'about',
  //           root: '',
  //           params: [
  //             {
  //               locale: 'en',
  //               slug: ['about-us'],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     const expected = [
  //       ['en/account/profile.htm', 'account-profile'],
  //       ['en/about-us.htm', 'about'],
  //     ];
  //     expect([...result]).toEqual(expected);

  //     expect(mockCreateRoutePath).toHaveBeenCalledWith(
  //       { locale: 'en', slug: ['account', 'profile'] },
  //       routingOptions.pathOptions
  //     );

  //     expect(mockCreateRoutePath).toHaveBeenCalledWith(
  //       { locale: 'en', slug: ['about-us'] },
  //       routingOptions.pathOptions
  //     );
  //   });
  // });

  // /**
  //  * Test `detectRoutePathByParams` method
  //  * ---
  //  * It should return route name based on given params if exists
  //  */
  // describe('createRoutingTable', () => {
  //   let createRoutingTable: jest.Mock;
  //   let createRoutePath: jest.Mock;

  //   beforeEach(() => {
  //     createRoutingTable = jest.fn(
  //       () => new Map([['some-route-path', 'some-route-name']])
  //     );

  //     Utils.__set__('createRoutingTable', createRoutingTable);
  //   });

  //   test('returns null when route is not found', () => {
  //     createRoutePath = jest.fn(() => 'invalid-route-path');
  //     Utils.__set__('createRoutePath', createRoutePath);

  //     expect(createRoutingTable).not.toHaveBeenCalled();
  //     expect(createRoutePath).not.toHaveBeenCalled();

  //     const result = Utils.detectRouteByParams({}, routingOptions);

  //     expect(result).toBeNull();

  //     expect(createRoutingTable).toHaveBeenCalledWith(routingOptions);
  //     expect(createRoutePath).toHaveBeenCalledWith(
  //       {},
  //       routingOptions.pathOptions
  //     );
  //   });

  //   test('returns RouteName when route is found', () => {
  //     createRoutePath = jest.fn(() => 'some-route-path');
  //     Utils.__set__('createRoutePath', createRoutePath);

  //     expect(createRoutingTable).not.toHaveBeenCalled();
  //     expect(createRoutePath).not.toHaveBeenCalled();

  //     const options = {
  //       ...routingOptions,
  //       routes: [
  //         {
  //           name: 'some-route-name',
  //           params: {
  //             slug: ['some-route-path'],
  //           },
  //         },
  //       ],
  //     };
  //     const result = Utils.detectRouteByParams({}, options);

  //     expect(result).toEqual(options.routes[0]);

  //     expect(createRoutingTable).toHaveBeenCalledWith(options);
  //     expect(createRoutePath).toHaveBeenCalledWith(
  //       {},
  //       routingOptions.pathOptions
  //     );
  //   });
  // });
})
