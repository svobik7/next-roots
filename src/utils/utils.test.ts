import { trimLeadingSlash } from './path-utils'

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
