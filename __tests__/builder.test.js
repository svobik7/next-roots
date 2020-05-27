const fs = require('fs')
const execSync = require('child_process').execSync

describe('next-i18n-rewrites:cli-builder', () => {
  beforeAll(() => {
    // ensure that package is build to latest version
    execSync('yarn build')
    // remove examples rewrites.js
    execSync('rm -f example/rewrites.js')
    // remove example pages directory (this dir will be use in tests)
    execSync('rm -rf example/pages')
    // run next-i18n-rewrites in example folder and then get back
    execSync('cd example && yarn rewrite && cd ..')
  })

  afterAll(() => {
    execSync('rm -f example/rewrites.js')
    execSync('rm -rf example/pages')
  })

  describe('files structure', () => {
    test('should build all internationalized pages', () => {
      // tests that all roots files exists
      expect(fs.existsSync('example/roots/_app.tsx')).toBe(true)
      expect(fs.existsSync('example/roots/_document.tsx')).toBe(true)
      expect(fs.existsSync('example/roots/_error.tsx')).toBe(true)
      expect(fs.existsSync('example/roots/index.tsx')).toBe(true)
      expect(fs.existsSync('example/roots/api/get-version.ts')).toBe(true)
      expect(fs.existsSync('example/roots/api/users/get-users.ts')).toBe(true)

      expect(fs.existsSync('example/roots/account/profile.tsx')).toBe(true)
      expect(fs.existsSync('example/roots/account/settings.tsx')).toBe(true)

      expect(fs.existsSync('example/roots/auth/login.tsx')).toBe(true)
      expect(fs.existsSync('example/roots/auth/signup.tsx')).toBe(true)

      // tests that all pages has been generated
      expect(fs.existsSync('example/pages/_app.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/_document.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/_error.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/api/get-version.ts')).toBe(true)
      expect(fs.existsSync('example/pages/api/users/get-users.ts')).toBe(true)

      expect(fs.existsSync('example/pages/en/index.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/cs/index.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/es/index.tsx')).toBe(true)

      expect(fs.existsSync('example/pages/en/auth/signup-a1.page.tsx')).toBe(
        true
      )
      expect(
        fs.existsSync('example/pages/cs/auth/registrace-a1.page.tsx')
      ).toBe(true)
      expect(fs.existsSync('example/pages/es/auth/signup.htm.tsx')).toBe(true)

      expect(fs.existsSync('example/pages/en/auth/login-a2.htm.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/cs/auth/prihlaseni-a2.htm.tsx')).toBe(
        true
      )
      expect(
        fs.existsSync('example/pages/es/auth/iniciar-sesion-a2.htm.tsx')
      ).toBe(true)

      expect(fs.existsSync('example/pages/en/account/profile-b1.htm.tsx')).toBe(
        true
      )
      expect(fs.existsSync('example/pages/cs/ucet/profil-b1.htm.tsx')).toBe(
        true
      )
      expect(fs.existsSync('example/pages/es/cuenta/perfil-b1.htm.tsx')).toBe(
        true
      )

      expect(
        fs.existsSync('example/pages/en/account/settings-b2.htm.tsx')
      ).toBe(true)
      expect(fs.existsSync('example/pages/cs/ucet/nastaveni-b2.htm.tsx')).toBe(
        true
      )
      expect(fs.existsSync('example/pages/es/cuenta/ajustes-b2.htm.tsx')).toBe(
        true
      )
    })
  })

  describe('all static files should have the same content', () => {
    test('_app content', () => {
      const root = fs.readFileSync('example/roots/_app.tsx')
      const page = fs.readFileSync('example/pages/_app.tsx')

      expect(root.equals(page)).toBe(true)
    })

    test('_document content', () => {
      const root = fs.readFileSync('example/roots/_document.tsx')
      const page = fs.readFileSync('example/pages/_document.tsx')

      expect(root.equals(page)).toBe(true)
    })

    test('_error content', () => {
      const root = fs.readFileSync('example/roots/_error.tsx')
      const page = fs.readFileSync('example/pages/_error.tsx')

      expect(root.equals(page)).toBe(true)
    })

    test('api/get-version content', () => {
      const root = fs.readFileSync('example/roots/api/get-version.ts')
      const page = fs.readFileSync('example/pages/api/get-version.ts')

      expect(root.equals(page)).toBe(true)
    })

    test('api/users/get-users content', () => {
      const root = fs.readFileSync('example/roots/api/users/get-users.ts')
      const page = fs.readFileSync('example/pages/api/users/get-users.ts')

      expect(root.equals(page)).toBe(true)
    })
  })

  describe('all i18n files should have proper content', () => {
    test('account/profile content', () => {
      const root = fs.readFileSync('example/roots/account/profile.tsx')
      const csPage = fs.readFileSync('example/pages/cs/ucet/profil-b1.htm.tsx')
      const enPage = fs.readFileSync(
        'example/pages/en/account/profile-b1.htm.tsx'
      )
      const esPage = fs.readFileSync(
        'example/pages/es/cuenta/perfil-b1.htm.tsx'
      )

      expect(root.equals(csPage)).toBe(true)
      expect(root.equals(enPage)).toBe(true)
      expect(root.equals(esPage)).toBe(true)
    })

    test('account/settings content', () => {
      const root = fs.readFileSync('example/roots/account/settings.tsx')
      const csPage = fs.readFileSync(
        'example/pages/cs/ucet/nastaveni-b2.htm.tsx'
      )
      const enPage = fs.readFileSync(
        'example/pages/en/account/settings-b2.htm.tsx'
      )
      const esPage = fs.readFileSync(
        'example/pages/es/cuenta/ajustes-b2.htm.tsx'
      )

      expect(root.equals(csPage)).toBe(true)
      expect(root.equals(enPage)).toBe(true)
      expect(root.equals(esPage)).toBe(true)
    })

    test('auth/login content', () => {
      const root = fs.readFileSync('example/roots/auth/login.tsx')
      const csPage = fs.readFileSync(
        'example/pages/cs/auth/prihlaseni-a2.htm.tsx'
      )
      const enPage = fs.readFileSync('example/pages/en/auth/login-a2.htm.tsx')
      const esPage = fs.readFileSync(
        'example/pages/es/auth/iniciar-sesion-a2.htm.tsx'
      )

      expect(root.equals(csPage)).toBe(true)
      expect(root.equals(enPage)).toBe(true)
      expect(root.equals(esPage)).toBe(true)
    })

    test('auth/signup content', () => {
      const root = fs.readFileSync('example/roots/auth/signup.tsx')
      const csPage = fs.readFileSync(
        'example/pages/cs/auth/registrace-a1.page.tsx'
      )
      const enPage = fs.readFileSync('example/pages/en/auth/signup-a1.page.tsx')

      expect(root.equals(csPage)).toBe(true)
      expect(root.equals(enPage)).toBe(true)
    })
  })

  describe('rewrites.js file is properly created', () => {
    test('file exists', () => {
      expect(fs.existsSync('example/rewrites.js')).toBe(true)
    })

    test('exports.defaultLocale', async () => {
      const content = await require('example/rewrites.js')
      expect(content.defaultLocale).toStrictEqual('en')
    })

    test('exports.locales', async () => {
      const content = await require('example/rewrites.js')
      expect(content.locales).toStrictEqual(['en', 'cs', 'es'])
    })

    test('exports.rules', async () => {
      const expectedTable = [
        { key: 'en:index', href: '/en/index', as: '/en' },
        { key: 'cs:index', href: '/cs/index', as: '/cs' },
        { key: 'es:index', href: '/es/index', as: '/es' },
        // SIGNUP
        {
          key: 'en:auth/signup',
          href: '/en/auth/signup-a1.page',
        },
        {
          key: 'cs:auth/signup',
          href: '/cs/auth/registrace-a1.page',
        },
        {
          key: 'es:auth/signup',
          href: '/es/auth/signup.htm',
        },
        // LOGIN
        {
          key: 'en:auth/login',
          href: '/en/auth/login-a2.htm',
        },
        {
          key: 'cs:auth/login',
          href: '/cs/auth/prihlaseni-a2.htm',
        },
        {
          key: 'es:auth/login',
          href: '/es/auth/iniciar-sesion-a2.htm',
        },
        // PROFILE
        {
          key: 'en:account/profile',
          href: '/en/account/profile-b1.htm',
        },
        {
          key: 'cs:account/profile',
          href: '/cs/ucet/profil-b1.htm',
        },
        {
          key: 'es:account/profile',
          href: '/es/cuenta/perfil-b1.htm',
        },
        // SETTINGS
        {
          key: 'en:account/settings',
          href: '/en/account/settings-b2.htm',
        },
        {
          key: 'cs:account/settings',
          href: '/cs/ucet/nastaveni-b2.htm',
        },
        {
          key: 'es:account/settings',
          href: '/es/cuenta/ajustes-b2.htm',
        },
      ]

      const content = await require('example/rewrites.js')
      expect(content.rules).toStrictEqual(expectedTable)
    })

    test('exports.meta', async () => {
      const expectedMeta = [
        {
          key: '*',
          data: { title: 'YeahCoach', background: 'grey' },
        },
        // SIGNUP
        {
          key: 'auth/signup',
          data: { background: 'red' },
        },
        {
          key: 'en:auth/signup',
          data: { title: 'Signup' },
        },
        {
          key: 'cs:auth/signup',
          data: { title: 'Registrace' },
        },
        // LOGIN
        {
          key: 'auth/login',
          data: { background: 'green' },
        },
        {
          key: 'en:auth/login',
          data: { title: 'Login' },
        },
        {
          key: 'cs:auth/login',
          data: { title: 'Přihlášení' },
        },
        {
          key: 'es:auth/login',
          data: { title: 'Iniciar Sesión' },
        },
        // PROFILE
        {
          key: 'account/profile',
          data: { background: 'orange' },
        },
        // SETTINGS
        {
          key: 'account/settings',
          data: { background: 'blue' },
        },
      ]

      const content = await require('example/rewrites.js')
      expect(content.meta).toStrictEqual(expectedMeta)
    })
  })
})
