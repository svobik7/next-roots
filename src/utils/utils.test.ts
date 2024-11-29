import type { RouterSchema } from '~/types'
import { trimLeadingSlash } from './path-utils'
import { queue } from './queue-utils'
import { isLayout, isNotFound, isPage } from './rewrite-utils'
import {
  computeRoutePriority,
  createRoutesPrioritiesMap,
  getRouteSegmentPriority,
  isCatchAllRouteSegment,
  isDynamicRouteSegment,
  isStaticRouteSegment,
} from './route-utils'
import { sanitizeSchema } from './schema-utils'

describe('trimLeadingSlash', () => {
  const testCases = [
    ['path', 'path'],
    ['/path', 'path'],
    ['//path', '/path'],
  ] as const

  test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
    expect(trimLeadingSlash(input)).toEqual(expectedResult)
  })
})

describe('rewrite-utils', () => {
  describe('isPage', () => {
    const testCases = [
      ['/page.js', true],
      ['/page.jsx', true],
      ['/page.ts', true],
      ['/page.tsx', true],
      ['/something-else.js', false],
      ['/something-else.jsx', false],
      ['/something-else.ts', false],
      ['/something-else.tsx', false],
    ] as const

    test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
      expect(isPage(input)).toEqual(expectedResult)
    })
  })

  describe('isLayout', () => {
    const testCases = [
      ['/layout.js', true],
      ['/layout.jsx', true],
      ['/layout.ts', true],
      ['/layout.tsx', true],
      ['/something-else.js', false],
      ['/something-else.jsx', false],
      ['/something-else.ts', false],
      ['/something-else.tsx', false],
    ] as const

    test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
      expect(isLayout(input)).toEqual(expectedResult)
    })
  })

  describe('isNotFound', () => {
    const testCases = [
      ['/not-found.js', true],
      ['/not-found.jsx', true],
      ['/not-found.ts', true],
      ['/not-found.tsx', true],
      ['/something-else.js', false],
      ['/something-else.jsx', false],
      ['/something-else.ts', false],
      ['/something-else.tsx', false],
    ] as const

    test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
      expect(isNotFound(input)).toEqual(expectedResult)
    })
  })
})

describe('route-utils', () => {
  describe('isStaticRouteSegment', () => {
    const testCases = [
      ['static', true],
      ['[dynamic]', false],
      ['[...catchAll]', false],
      ['[[...optionalCatchAll]]', false],
    ] as const

    test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
      expect(isStaticRouteSegment(input)).toEqual(expectedResult)
    })
  })

  describe('isDynamicRouteSegment', () => {
    const testCases = [
      ['static', false],
      ['[dynamic]', true],
      ['[...catchAll]', false],
      ['[[...optionalCatchAll]]', false],
    ] as const

    test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
      expect(isDynamicRouteSegment(input)).toEqual(expectedResult)
    })
  })

  describe('isCatchAllRouteSegment', () => {
    const testCases = [
      ['static', false],
      ['[dynamic]', false],
      ['[...catchAll]', true],
      ['[[...optionalCatchAll]]', true],
    ] as const

    test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
      expect(isCatchAllRouteSegment(input)).toEqual(expectedResult)
    })
  })

  describe('getRouteSegmentPriority', () => {
    const testCases = [
      ['static', 1],
      ['[dynamic]', 2],
      ['[...catchAll]', 3],
      ['[[...optionalCatchAll]]', 3],
    ] as const

    test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
      expect(getRouteSegmentPriority(input)).toEqual(expectedResult)
    })
  })

  describe('computeRoutePriority', () => {
    const testCases = [
      [{ name: '/only-static/nested-path' }, 0.11],
      [{ name: '/static/[withDynamic]' }, 0.12],
      [{ name: '/static/[...withCatchAll]' }, 0.13],
      [{ name: '/[dynamic]/with-static' }, 0.21],
      [{ name: '/[dynamic]/[withDynamic]' }, 0.22],
      [{ name: '/[dynamic]/[...catchAll]' }, 0.23],
      [{ name: '/[...withCatchAll]' }, 0.3],
    ] as const

    test.each(testCases)('given %o, returns %s', (input, expectedResult) => {
      expect(computeRoutePriority({ name: input.name, href: '/' })).toEqual(
        expectedResult
      )
    })
  })

  test('createRoutesPrioritiesMap', () => {
    const inputSchema: RouterSchema = {
      defaultLocale: 'en',
      locales: ['en'],
      routes: {
        en: [
          { name: '/static', href: '/static' },
          { name: '/static/[dynamic]', href: '/static/:dynamic' },
          { name: '/static/[...catchAll]', href: '/static/:catchAll+' },
          { name: '/[dynamic]', href: '/:dynamic' },
          { name: '/[...catchAll]', href: '/:catchAll+' },
          { name: '/[[...optionalCatchAll]]', href: '/:optionalCatchAll*' },
        ],
      },
    }

    const expectedResult = {
      '/static': 0.1,
      '/static/[dynamic]': 0.12,
      '/static/[...catchAll]': 0.13,
      '/[dynamic]': 0.2,
      '/[...catchAll]': 0.3,
      '/[[...optionalCatchAll]]': 0.3,
    }

    expect(createRoutesPrioritiesMap(inputSchema)).toEqual(expectedResult)
  })
})

describe('schema-utils', () => {
  test('sanitizeSchema', () => {
    const inputSchema: RouterSchema = {
      defaultLocale: 'en',
      locales: ['en'],
      routes: {
        en: [
          { name: '/[dynamic]', href: '/:dynamic' },
          { name: '/[...catchAll]', href: '/:catchAll+' },
          { name: '/static', href: '/static' },
          { name: '/[[...optionalCatchAll]]', href: '/:optionalCatchAll*' },
          { name: '/static/[...catchAll]', href: '/static/:catchAll+' },
          { name: '/static/[dynamic]', href: '/static/:dynamic' },
        ],
      },
    }

    const expectedResult: RouterSchema = {
      defaultLocale: 'en',
      locales: ['en'],
      routes: {
        en: [
          { name: '/static', href: '/static' },
          { name: '/static/[dynamic]', href: '/static/:dynamic' },
          { name: '/static/[...catchAll]', href: '/static/:catchAll+' },
          { name: '/[dynamic]', href: '/:dynamic' },
          { name: '/[...catchAll]', href: '/:catchAll+' },
          { name: '/[[...optionalCatchAll]]', href: '/:optionalCatchAll*' },
        ],
      },
    }

    expect(sanitizeSchema(inputSchema)).toEqual(expectedResult)
  })
})

describe('queue-utils', () => {
  test('queue', () => {
    const executeQueue = queue<void>(
      () => 1,
      () => 2,
      () => 3
    )

    expect(executeQueue()).toEqual([1, 2, 3])
  })
})
