import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { RootsContext } from '../../src/packages/context'
import { useRootMeta } from '../../src/packages/meta'

describe('next-roots/meta', () => {
  // mock context wrapper
  const wrapper = ({ children }) => (
    <RootsContext.Provider
      value={{
        currentLocale: 'en',
        currentRoot: 'dynamic',
        currentRule: { key: 'en:dynamic', href: '/en/[...slug]' },
        currentMeta: {
          key: 'en:dynamic',
          data: { title: 'Awesome Next Roots', background: 'magenta' },
        },
        defaultLocale: 'en',
        locales: ['en', 'cs', 'es'],
        rules: [],
        meta: [
          {
            key: 'en:dynamic',
            data: { title: 'Awesome Next Roots', background: 'magenta' },
          },
          {
            key: 'cs:dynamic',
            data: { title: 'Awesome Next Roots', background: 'yellow' },
          },
          {
            key: 'es:dynamic',
            data: { title: 'Awesome Next Roots', background: 'green' },
          },
        ],
      }}
    >
      {children}
    </RootsContext.Provider>
  )
  /**
   * Test 'useRootLink' hook
   * ---
   * It should creates links based on current roots context
   */
  describe('useRootMeta', () => {
    test('read all for current route', () => {
      const { result } = renderHook(() => useRootMeta(), { wrapper })

      expect(result.current.data()).toEqual({
        title: 'Awesome Next Roots',
        background: 'magenta',
      })
    })

    test('cherry pick for current route', () => {
      const { result } = renderHook(() => useRootMeta(), { wrapper })

      expect(result.current.data('background')).toEqual('magenta')
    })

    test('read all for current route and custom locale', () => {
      const { result } = renderHook(() => useRootMeta(), { wrapper })

      expect(result.current.data('*', 'cs:dynamic')).toEqual({
        title: 'Awesome Next Roots',
        background: 'yellow',
      })
    })

    test('read all for non-existing route', () => {
      const { result } = renderHook(() => useRootMeta(), { wrapper })

      expect(result.current.data('*', 'cs:auth/signup')).toEqual(undefined)
    })
  })
})
