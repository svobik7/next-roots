import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import RootsContext from '../../src/packages/context'
import RootLink, { RootLinkProps, useRootLink } from '../../src/packages/link'

describe('next-roots/link', () => {
  // mock context wrapper
  const wrapper = ({ children }) => (
    <RootsContext.Provider
      value={{
        currentLocale: 'en',
        currentRoot: 'auth/login',
        currentRule: undefined,
        currentMeta: undefined,
        defaultLocale: 'en',
        locales: ['en', 'cs', 'es'],
        meta: [],
        rules: [
          { key: 'en:auth/signup', href: '/en/auth/signup-a1.page' },
          { key: 'cs:auth/signup', href: '/cs/overeni/registrace-a1.page' },
          { key: 'es:auth/signup', href: '/es/auth/signup.htm' },

          { key: 'en:home', href: '/en/index', as: '/en' },
          { key: 'en:auth/login', href: '/en/auth/login-a2.htm' },
          { key: 'en:account/profile', href: '/en/account/profile-b1.htm' },
          {
            key: 'en:account/settings',
            href: '/en/account/settings-b2.htm',
          },
          { key: 'en:dynamic', href: '/en/[...slug]' },
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
  describe('useRootLink', () => {
    test('use with current locale', () => {
      const { result } = renderHook(() => useRootLink(), { wrapper })

      expect(result.current.href('auth/signup')).toEqual(
        '/en/auth/signup-a1.page'
      )
      expect(result.current.as('auth/signup')).toEqual(
        '/en/auth/signup-a1.page'
      )
    })

    test('use with explicit locale', () => {
      const { result } = renderHook(() => useRootLink(), { wrapper })

      expect(result.current.href('auth/signup', { locale: 'cs' })).toEqual(
        '/cs/overeni/registrace-a1.page'
      )
      expect(result.current.as('auth/signup', { locale: 'cs' })).toEqual(
        '/cs/overeni/registrace-a1.page'
      )
    })

    test('use with custom locale using rule key', () => {
      const { result } = renderHook(() => useRootLink(), { wrapper })

      expect(result.current.href('cs:auth/signup', { locale: '' })).toEqual(
        '/cs/overeni/registrace-a1.page'
      )
      expect(result.current.as('cs:auth/signup', { locale: '' })).toEqual(
        '/cs/overeni/registrace-a1.page'
      )
    })

    test('use with custom locale using rule key and explicit locale', () => {
      const { result } = renderHook(() => useRootLink(), { wrapper })

      expect(result.current.href('cs:auth/signup', { locale: 'en' })).toEqual(
        '/en/auth/signup-a1.page'
      )
      expect(result.current.as('cs:auth/signup', { locale: 'en' })).toEqual(
        '/en/auth/signup-a1.page'
      )
    })

    test('use with non-existing rule in current context', () => {
      const { result } = renderHook(() => useRootLink(), { wrapper })

      expect(result.current.href('auth/login', { locale: 'cs' })).toEqual(
        '/cs/auth/login'
      )
      expect(result.current.as('auth/login', { locale: 'cs' })).toEqual(
        '/cs/auth/login'
      )
    })
  })

  /**
   * Test 'RootLink' component
   * ---
   * It should creates provide anchor element with links based on current roots context
   */
  describe('RootLink', () => {
    const renderComponent = (props: RootLinkProps) => {
      render(
        <RootLink {...props}>
          <a data-testid="anchor" />
        </RootLink>,
        { wrapper }
      )
    }

    test('use with current locale', () => {
      renderComponent({ href: 'auth/signup' })

      const link = screen.getByTestId('anchor')
      expect(link.getAttribute('href')).toBe('/en/auth/signup-a1.page')
    })

    test('use with explicit locale', () => {
      renderComponent({ href: 'auth/signup', locale: 'cs' })

      const link = screen.getByTestId('anchor')
      expect(link.getAttribute('href')).toBe('/cs/overeni/registrace-a1.page')
    })

    test('use with custom locale using rule key', () => {
      renderComponent({ href: 'cs:auth/signup', locale: '' })

      const link = screen.getByTestId('anchor')
      expect(link.getAttribute('href')).toBe('/cs/overeni/registrace-a1.page')
    })

    test('use with custom locale using rule key and explicit locale', () => {
      renderComponent({ href: 'cs:auth/signup', locale: 'en' })

      const link = screen.getByTestId('anchor')
      expect(link.getAttribute('href')).toBe('/en/auth/signup-a1.page')
    })
  })
})
