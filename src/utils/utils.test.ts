import { trimLeadingSlash } from './path-utils'
import { isLayout, isNotFound, isPage } from './rewrite-utils'

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
