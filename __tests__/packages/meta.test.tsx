import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import RootsContext from '../../src/packages/context'
import { useRootMeta } from '../../src/packages/meta'

describe('next-roots/meta', () => {
  // mock context wrapper
  const wrapper = ({ children }) => (
    <RootsContext.Provider
      value={{
        currentLocale: 'en',
        currentRoot: 'dynamic',
        currentRule: { key: 'en:dynamic', href: '/en/[...slug]' },
        defaultLocale: 'en',
        locales: ['en', 'cs', 'es'],
        meta: [
          {
            key: '*',
            data: { title: 'Awesome Next Roots', background: 'grey' },
          },
          { key: 'auth/signup', data: { background: 'red' } },
          { key: 'en:auth/signup', data: { title: 'Signup' } },
          { key: 'cs:auth/signup', data: { title: 'Registrace' } },
          { key: 'auth/login', data: { background: 'green' } },
          { key: 'en:auth/login', data: { title: 'Login' } },
          { key: 'cs:auth/login', data: { title: 'Přihlášení' } },
          { key: 'es:auth/login', data: { title: 'Iniciar Sesión' } },
          { key: 'account/profile', data: { background: 'orange' } },
          { key: 'account/settings', data: { background: 'blue' } },
          { key: 'dynamic', data: { background: 'magenta' } },
        ],
        rules: [
          { key: 'en:home', href: '/en/index', as: '/en' },
          { key: 'cs:home', href: '/cs/index', as: '/cs' },
          { key: 'es:home', href: '/es/index', as: '/es' },
          { key: 'en:auth/signup', href: '/en/auth/signup-a1.page' },
          { key: 'cs:auth/signup', href: '/cs/overeni/registrace-a1.page' },
          { key: 'es:auth/signup', href: '/es/auth/signup.htm' },
          { key: 'en:auth/login', href: '/en/auth/login-a2.htm' },
          { key: 'cs:auth/login', href: '/cs/overeni/prihlaseni-a2.htm' },
          {
            key: 'es:auth/login',
            href: '/es/autorizacion/iniciar-sesion-a2.htm',
          },
          { key: 'en:account/profile', href: '/en/account/profile-b1.htm' },
          { key: 'cs:account/profile', href: '/cs/ucet/profil-b1.htm' },
          { key: 'es:account/profile', href: '/es/cuenta/perfil-b1.htm' },
          {
            key: 'en:account/settings',
            href: '/en/account/settings-b2.htm',
          },
          { key: 'cs:account/settings', href: '/cs/ucet/nastaveni-b2.htm' },
          { key: 'es:account/settings', href: '/es/cuenta/ajustes-b2.htm' },
          { key: 'en:dynamic', href: '/en/[...slug]' },
          { key: 'cs:dynamic', href: '/cs/[...slug]' },
          { key: 'es:dynamic', href: '/es/[...slug]' },
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

    test('read all for explicit route', () => {
      const { result } = renderHook(() => useRootMeta(), { wrapper })

      expect(result.current.data('*', 'cs:auth/signup')).toEqual({
        title: 'Registrace',
        background: 'red',
      })
    })
  })
})
