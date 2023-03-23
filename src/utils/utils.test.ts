import fsMock, { restore as fsMockRestore } from 'mock-fs'
import { isDirectory, makeDir, removeDir } from './fs-utils'
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

describe('fs-utils', () => {
  beforeAll(() => {
    fsMock({
      dir_01: {
        'file.txt': 'file content here',
      },
      dir_02: {
        'file.txt': 'file content here',
      },
    })
  })

  afterAll(() => {
    fsMockRestore()
  })

  describe('isDirectory', () => {
    const testCases = [
      ['dir_01', true],
      ['dir_02', true],
      ['dir_03', false],
    ] as const

    test.each(testCases)('given %s, returns %s', (input, expectedResult) => {
      expect(isDirectory(input)).toEqual(expectedResult)
    })
  })

  describe('removeDir', () => {
    const testCases = [['dir_01'], ['dir_02']] as const

    test.each(testCases)('removes %s', (input) => {
      expect(isDirectory(input)).toEqual(true)
      removeDir(input)
      expect(isDirectory(input)).toEqual(false)
    })
  })

  describe('makeDir', () => {
    const testCases = [['dir_01'], ['dir_03']] as const

    test.each(testCases)('removes %s', (input) => {
      makeDir(input)
      expect(isDirectory(input)).toEqual(true)
    })
  })
})
