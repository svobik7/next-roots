const fs = require('fs')
const execSync = require('child_process').execSync

describe('next-roots:cli-builder', () => {
  beforeAll(() => {
    // ensure that package is build to latest version
    execSync('yarn build')
    // remove examples roots.schema.js
    execSync('rm -f example/roots.schema.js')
    execSync('rm -f example/roots.schema.en.js')
    execSync('rm -f example/roots.schema.cs.js')
    execSync('rm -f example/roots.schema.es.js')
    // remove example pages directory (this dir will be use in tests)
    execSync('rm -rf example/pages')
    // run next-roots in example folder and then get back
    execSync('cd example && yarn root && cd ..')
  })

  afterAll(() => {
    execSync('rm -f example/roots.schema.js')
    execSync('rm -f example/roots.schema.en.js')
    execSync('rm -f example/roots.schema.cs.js')
    execSync('rm -f example/roots.schema.es.js')
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
      expect(fs.existsSync('example/roots/api/users/index.ts')).toBe(true)

      expect(fs.existsSync('example/roots/account/profile.tsx')).toBe(true)
      expect(fs.existsSync('example/roots/account/settings.tsx')).toBe(true)

      expect(fs.existsSync('example/roots/auth/login.tsx')).toBe(true)
      expect(fs.existsSync('example/roots/auth/signup.tsx')).toBe(true)

      // tests that all pages has been generated
      expect(fs.existsSync('example/pages/_app.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/_document.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/_error.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/index.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/api/get-version.ts')).toBe(true)
      expect(fs.existsSync('example/pages/api/users/index.ts')).toBe(true)

      expect(fs.existsSync('example/pages/en/index.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/cs/index.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/es/index.tsx')).toBe(true)

      expect(fs.existsSync('example/pages/en/auth/signup-a1.page.tsx')).toBe(
        true
      )
      expect(
        fs.existsSync('example/pages/cs/overeni/registrace-a1.page.tsx')
      ).toBe(true)
      // * this page has no rewrite so it is created with not-translated path
      expect(fs.existsSync('example/pages/es/auth/signup.htm.tsx')).toBe(true)

      expect(fs.existsSync('example/pages/en/auth/login-a2.htm.tsx')).toBe(true)
      expect(
        fs.existsSync('example/pages/cs/overeni/prihlaseni-a2.htm.tsx')
      ).toBe(true)
      expect(
        fs.existsSync('example/pages/es/autorizacion/iniciar-sesion-a2.htm.tsx')
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

    test('api/users/index content', () => {
      const root = fs.readFileSync('example/roots/api/users/index.ts')
      const page = fs.readFileSync('example/pages/api/users/index.ts')

      expect(root.equals(page)).toBe(true)
    })

    test('index content', () => {
      const root = fs.readFileSync('example/roots/index.tsx')
      const page = fs.readFileSync('example/pages/index.tsx')

      expect(root.equals(page)).toBe(true)
    })
  })

  describe('i18n pages should have proper content', () => {
    test('home content', () => {
      const cs = fs.readFileSync('example/pages/cs/index.tsx').toString()
      const en = fs.readFileSync('example/pages/en/index.tsx').toString()
      const es = fs.readFileSync('example/pages/es/index.tsx').toString()

      // CS
      expect(cs).toContain(`import schemaRoots from 'roots.schema.cs'`)
      expect(cs).toContain(`import HomeRoot from 'roots/home'`)
      expect(cs).toContain(
        `HomePage.getRootsContext = (): Partial<RootsContext>`
      )
      expect(cs).toContain(`currentLocale: 'cs'`)
      expect(cs).toContain(`currentRoot: 'home'`)
      expect(cs).toContain(
        `currentRule: {"key":"cs:home","href":"/cs/index","as":"/cs"}`
      )
      expect(cs).toContain(`...schemaRoots.rules`)
      expect(cs).toContain(`{"key":"en:home","href":"/en/index","as":"/en"}`)
      expect(cs).toContain(`{"key":"es:home","href":"/es/index","as":"/es"}`)
      // expect(cs).toContain(
      //   `rules: [
      //     ...schemaRoots.rules,
      //     {"key":"en:home","href":"/en/index","as":"/en"},
      //     {"key":"es:home","href":"/es/index","as":"/es"},
      //   ]`
      // )
      expect(cs).toContain(`export default HomePage`)

      // EN
      expect(en).toContain(`import schemaRoots from 'roots.schema.en'`)
      expect(en).toContain(`import HomeRoot from 'roots/home'`)
      expect(en).toContain(
        `HomePage.getRootsContext = (): Partial<RootsContext>`
      )
      expect(en).toContain(`currentLocale: 'en'`)
      expect(en).toContain(`currentRoot: 'home'`)
      expect(en).toContain(
        `currentRule: {"key":"en:home","href":"/en/index","as":"/en"}`
      )
      expect(en).toContain(`...schemaRoots.rules`)
      expect(en).toContain(`{"key":"cs:home","href":"/cs/index","as":"/cs"}`)
      expect(en).toContain(`{"key":"es:home","href":"/es/index","as":"/es"}`)
      // expect(en).toContain(
      //   `rules: [
      //     ...schemaRoots.rules,
      //     {"key":"cs:home","href":"/cs/index","as":"/cs"},
      //     {"key":"es:home","href":"/es/index","as":"/es"},
      //   ]`
      // )
      expect(en).toContain(`export default HomePage`)

      // ES
      expect(es).toContain(`import schemaRoots from 'roots.schema.es'`)
      expect(es).toContain(`import HomeRoot from 'roots/home'`)
      expect(es).toContain(
        `HomePage.getRootsContext = (): Partial<RootsContext>`
      )
      expect(es).toContain(`currentLocale: 'es'`)
      expect(es).toContain(`currentRoot: 'home'`)
      expect(es).toContain(
        `currentRule: {"key":"es:home","href":"/es/index","as":"/es"}`
      )
      expect(es).toContain(`...schemaRoots.rules`)
      expect(es).toContain(`{"key":"en:home","href":"/en/index","as":"/en"}`)
      expect(es).toContain(`{"key":"cs:home","href":"/cs/index","as":"/cs"}`)
      // expect(es).toContain(
      //   `rules: [
      //     ...schemaRoots.rules,
      //     {"key":"en:home","href":"/en/index","as":"/en"},
      //     {"key":"cs:home","href":"/cs/index","as":"/cs"},
      //   ]`
      // )
      expect(es).toContain(`export default HomePage`)
    })

    test('dynamic content', () => {
      const cs = fs.readFileSync('example/pages/cs/[...slug].tsx').toString()
      const en = fs.readFileSync('example/pages/en/[...slug].tsx').toString()
      const es = fs.readFileSync('example/pages/es/[...slug].tsx').toString()

      // CS
      expect(cs).toContain(`import schemaRoots from 'roots.schema.cs'`)
      expect(cs).toContain(
        `import DynamicRoot, * as __root from 'roots/dynamic'`
      )
      expect(cs).toContain(
        `DynamicPage.getRootsContext = (): Partial<RootsContext> => ({`
      )
      expect(cs).toContain(`currentRoot: 'dynamic'`)
      expect(cs).toContain(
        `currentRule: {"key":"cs:dynamic","href":"/cs/[...slug]"}`
      )
      expect(cs).toContain(`...schemaRoots.rules`)
      expect(cs).toContain(`{"key":"en:dynamic","href":"/en/[...slug]"}`)
      expect(cs).toContain(`{"key":"es:dynamic","href":"/es/[...slug]"}`)
      // expect(cs).toContain(
      //   `rules: [
      //     ...schemaRoots.rules,
      //     {"key":"en:dynamic","href":"/en/[...slug]"},
      //     {"key":"es:dynamic","href":"/es/[...slug]"},
      //   ]`
      // )
      expect(cs).toContain(
        `export const getStaticPaths: GetStaticPaths = async () => __root.getStaticPaths()`
      )
      expect(cs).toContain(
        `export const getStaticProps: GetStaticProps = async (context) => __root.getStaticProps({ ...context, __locale: 'cs' })`
      )

      expect(cs).toContain(`export default DynamicPage`)

      // EN
      expect(en).toContain(`import schemaRoots from 'roots.schema.en'`)
      expect(en).toContain(
        `import DynamicRoot, * as __root from 'roots/dynamic'`
      )
      expect(en).toContain(
        `DynamicPage.getRootsContext = (): Partial<RootsContext> => ({`
      )
      expect(en).toContain(`currentLocale: 'en'`)
      expect(en).toContain(`currentRoot: 'dynamic'`)
      expect(en).toContain(
        `currentRule: {"key":"en:dynamic","href":"/en/[...slug]"}`
      )
      expect(en).toContain(`...schemaRoots.rules`)
      expect(en).toContain(`{"key":"cs:dynamic","href":"/cs/[...slug]"}`)
      expect(en).toContain(`{"key":"es:dynamic","href":"/es/[...slug]"}`)
      // expect(en).toContain(
      //   `rules: [
      //     ...schemaRoots.rules,
      //     {"key":"cs:dynamic","href":"/cs/[...slug]"},
      //     {"key":"es:dynamic","href":"/es/[...slug]"},
      //   ]`
      // )
      expect(en).toContain(
        `export const getStaticPaths: GetStaticPaths = async () => __root.getStaticPaths()`
      )
      expect(en).toContain(
        `export const getStaticProps: GetStaticProps = async (context) => __root.getStaticProps({ ...context, __locale: 'en' })`
      )
      expect(en).toContain(`export default DynamicPage`)

      // ES
      expect(es).toContain(`import schemaRoots from 'roots.schema.es'`)
      expect(es).toContain(
        `import DynamicRoot, * as __root from 'roots/dynamic'`
      )
      expect(es).toContain(
        `DynamicPage.getRootsContext = (): Partial<RootsContext> => ({`
      )
      expect(es).toContain(`currentLocale: 'es'`)
      expect(es).toContain(`currentRoot: 'dynamic'`)
      expect(es).toContain(
        `currentRule: {"key":"es:dynamic","href":"/es/[...slug]"}`
      )
      expect(es).toContain(`...schemaRoots.rules`)
      expect(es).toContain(`{"key":"en:dynamic","href":"/en/[...slug]"}`)
      expect(es).toContain(`{"key":"cs:dynamic","href":"/cs/[...slug]"}`)
      // expect(es).toContain(
      //   `rules: [
      //     ...schemaRoots.rules,
      //     {"key":"en:dynamic","href":"/en/[...slug]"},
      //     {"key":"cs:dynamic","href":"/cs/[...slug]"},
      //   ]`
      // )
      expect(es).toContain(
        `export const getStaticPaths: GetStaticPaths = async () => __root.getStaticPaths()`
      )
      expect(es).toContain(
        `export const getStaticProps: GetStaticProps = async (context) => __root.getStaticProps({ ...context, __locale: 'es' })`
      )

      expect(es).toContain(`export default DynamicPage`)
    })
  })

  describe('roots.schema.js file is properly created', () => {
    const schemaPath = 'example/roots.schema.js'

    test('file exists', () => {
      expect(fs.existsSync(schemaPath)).toBe(true)
    })

    test('exports.defaultLocale', async () => {
      const content = await require(schemaPath)
      expect(content.defaultLocale).toStrictEqual('en')
    })

    test('exports.locales', async () => {
      const content = await require(schemaPath)
      expect(content.locales).toStrictEqual(['en', 'cs', 'es'])
    })

    test('exports.meta', async () => {
      const expectedMeta = [
        {
          key: '*',
          data: { title: 'Awesome Next Roots', background: 'grey' },
        },
        // SIGNUP
        {
          key: 'auth/signup',
          data: { background: 'red' },
        },
        // LOGIN
        {
          key: 'auth/login',
          data: { background: 'green' },
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
        // DYNAMIC
        {
          key: 'dynamic',
          data: { background: 'magenta' },
        },
      ]

      const content = await require(schemaPath)
      expect(content.meta).toStrictEqual(expectedMeta)
    })
  })

  describe('roots.schema.en.js file is properly created', () => {
    const schemaPath = 'example/roots.schema.en.js'

    test('file exists', () => {
      expect(fs.existsSync(schemaPath)).toBe(true)
    })

    test('exports.currentLocale', async () => {
      const content = await require(schemaPath)
      expect(content.currentLocale).toStrictEqual('en')
    })

    test('exports.rules', async () => {
      const expectedTable = [
        { key: 'en:home', href: '/en/index', as: '/en' },
        // SIGNUP
        {
          key: 'en:auth/signup',
          href: '/en/auth/signup-a1.page',
        },
        // LOGIN
        {
          key: 'en:auth/login',
          href: '/en/auth/login-a2.htm',
        },
        // PROFILE
        {
          key: 'en:account/profile',
          href: '/en/account/profile-b1.htm',
        },
        // SETTINGS
        {
          key: 'en:account/settings',
          href: '/en/account/settings-b2.htm',
        },
        // DYNAMIC
        {
          key: 'en:dynamic',
          href: '/en/[...slug]',
        },
      ]

      const content = await require(schemaPath)
      expect(content.rules).toStrictEqual(expectedTable)
    })

    test('exports.meta', async () => {
      const expectedMeta = [
        // SIGNUP
        {
          key: 'en:auth/signup',
          data: { title: 'Signup' },
        },
        // LOGIN
        {
          key: 'en:auth/login',
          data: { title: 'Login' },
        },
      ]

      const content = await require(schemaPath)
      expect(content.meta).toStrictEqual(expectedMeta)
    })
  })

  describe('roots.schema.cs.js file is properly created', () => {
    const schemaPath = 'example/roots.schema.cs.js'

    test('file exists', () => {
      expect(fs.existsSync(schemaPath)).toBe(true)
    })

    test('exports.currentLocale', async () => {
      const content = await require(schemaPath)
      expect(content.currentLocale).toStrictEqual('cs')
    })

    test('exports.rules', async () => {
      const expectedTable = [
        { key: 'cs:home', href: '/cs/index', as: '/cs' },
        // SIGNUP
        {
          key: 'cs:auth/signup',
          href: '/cs/overeni/registrace-a1.page',
        },
        // LOGIN
        {
          key: 'cs:auth/login',
          href: '/cs/overeni/prihlaseni-a2.htm',
        },
        // PROFILE
        {
          key: 'cs:account/profile',
          href: '/cs/ucet/profil-b1.htm',
        },
        // SETTINGS
        {
          key: 'cs:account/settings',
          href: '/cs/ucet/nastaveni-b2.htm',
        },
        // DYNAMIC
        {
          key: 'cs:dynamic',
          href: '/cs/[...slug]',
        },
      ]

      const content = await require(schemaPath)
      expect(content.rules).toStrictEqual(expectedTable)
    })

    test('exports.meta', async () => {
      const expectedMeta = [
        // SIGNUP
        {
          key: 'cs:auth/signup',
          data: { title: 'Registrace' },
        },
        // LOGIN
        {
          key: 'cs:auth/login',
          data: { title: 'Přihlášení' },
        },
      ]

      const content = await require(schemaPath)
      expect(content.meta).toStrictEqual(expectedMeta)
    })
  })

  describe('roots.schema.es.js file is properly created', () => {
    const schemaPath = 'example/roots.schema.es.js'

    test('file exists', () => {
      expect(fs.existsSync(schemaPath)).toBe(true)
    })

    test('exports.currentLocale', async () => {
      const content = await require(schemaPath)
      expect(content.currentLocale).toStrictEqual('es')
    })

    test('exports.rules', async () => {
      const expectedTable = [
        { key: 'es:home', href: '/es/index', as: '/es' },
        // SIGNUP
        {
          key: 'es:auth/signup',
          href: '/es/auth/signup.htm',
        },
        // LOGIN
        {
          key: 'es:auth/login',
          href: '/es/autorizacion/iniciar-sesion-a2.htm',
        },
        // PROFILE
        {
          key: 'es:account/profile',
          href: '/es/cuenta/perfil-b1.htm',
        },
        // SETTINGS
        {
          key: 'es:account/settings',
          href: '/es/cuenta/ajustes-b2.htm',
        },
        // DYNAMIC
        {
          key: 'es:dynamic',
          href: '/es/[...slug]',
        },
      ]

      const content = await require(schemaPath)
      expect(content.rules).toStrictEqual(expectedTable)
    })

    test('exports.meta', async () => {
      const expectedMeta = [
        {
          key: 'es:auth/login',
          data: { title: 'Iniciar Sesión' },
        },
      ]

      const content = await require(schemaPath)
      expect(content.meta).toStrictEqual(expectedMeta)
    })
  })
})
