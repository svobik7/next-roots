const fs = require('fs')
const execSync = require('child_process').execSync

describe('next-roots:cli-builder', () => {
  beforeAll(() => {
    // ensure that package is build to latest version
    execSync('yarn build')
    // remove examples roots.schema.js
    execSync('rm -f example/roots.schema.js')
    // remove example pages directory (this dir will be use in tests)
    execSync('rm -rf example/pages')
    // run next-roots in example folder and then get back
    execSync('cd example && yarn root && cd ..')
  })

  afterAll(() => {
    execSync('rm -f example/roots.schema.js')
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

      // test shallow locales
      expect(fs.existsSync('example/pages/home.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/auth/signup-a1.page.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/auth/login-a2.htm.tsx')).toBe(true)
      expect(fs.existsSync('example/pages/account/profile-b1.htm.tsx')).toBe(
        true
      )
      expect(fs.existsSync('example/pages/account/settings-b2.htm.tsx')).toBe(
        true
      )

      // test non-shallow locales
      expect(fs.existsSync('example/pages/cs/index.tsx')).toBe(true)
      expect(
        fs.existsSync('example/pages/cs/overeni/registrace-a1.page.tsx')
      ).toBe(true)
      expect(
        fs.existsSync('example/pages/cs/overeni/prihlaseni-a2.htm.tsx')
      ).toBe(true)
      expect(fs.existsSync('example/pages/cs/ucet/profil-b1.htm.tsx')).toBe(
        true
      )
      expect(fs.existsSync('example/pages/cs/ucet/nastaveni-b2.htm.tsx')).toBe(
        true
      )

      expect(
        fs.existsSync('example/pages/es/autorizacion/iniciar-sesion-a2.htm.tsx')
      ).toBe(true)
      // * this page has no rewrite so it is created with not-translated path
      expect(fs.existsSync('example/pages/es/auth/signup.htm.tsx')).toBe(true)

      expect(
        fs.existsSync('example/pages/es/autorizacion/iniciar-sesion-a2.htm.tsx')
      ).toBe(true)

      expect(fs.existsSync('example/pages/es/cuenta/perfil-b1.htm.tsx')).toBe(
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
      const en = fs.readFileSync('example/pages/home.tsx').toString()
      const es = fs.readFileSync('example/pages/es/index.tsx').toString()

      // CS ROOT

      expect(cs).toContain(`import HomeRoot from 'roots/home'`)
      expect(cs).toContain(
        `HomePage.getRootsContext = (): Partial<RootsContext>`
      )
      expect(cs).toContain(`export default HomePage`)

      // CS CURRENT CONTEXT

      expect(cs).toContain(`currentLocale: 'cs'`)
      expect(cs).toContain(`currentRoot: 'home'`)
      expect(cs).toContain(`currentRule: {"key":"cs:home","href":"/cs"}`)
      expect(cs).toContain(
        `currentMeta: {"key":"cs:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}}`
      )

      // CS RULES

      expect(cs).toContain(`{"key":"en:home","href":"/home"}`)
      expect(cs).toContain(`{"key":"cs:home","href":"/cs"}`)
      expect(cs).toContain(`{"key":"es:home","href":"/es"}`)

      expect(cs).toContain(
        `{"key":"cs:auth/signup","href":"/cs/overeni/registrace-a1.page"}`
      )
      expect(cs).toContain(
        `{"key":"cs:auth/login","href":"/cs/overeni/prihlaseni-a2.htm"}`
      )

      expect(cs).toContain(
        `{"key":"cs:account/profile","href":"/cs/ucet/profil-b1.htm"}`
      )
      expect(cs).toContain(
        `{"key":"cs:account/settings","href":"/cs/ucet/nastaveni-b2.htm"}`
      )

      expect(cs).toContain(
        `{"key":"cs:detail/article","href":"/cs/articles/[...slug]"}`
      )

      // CS META

      expect(cs).toContain(
        `{"key":"en:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )
      expect(cs).toContain(
        `{"key":"cs:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )
      expect(cs).toContain(
        `{"key":"es:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )

      // EN ROOT

      expect(en).toContain(`import HomeRoot from 'roots/home'`)
      expect(en).toContain(
        `HomePage.getRootsContext = (): Partial<RootsContext>`
      )
      expect(en).toContain(`export default HomePage`)

      // EN CURRENT CONTEXT

      expect(en).toContain(`currentLocale: 'en'`)
      expect(en).toContain(`currentRoot: 'home'`)
      expect(en).toContain(`currentRule: {"key":"en:home","href":"/home"}`)
      expect(en).toContain(
        `currentMeta: {"key":"en:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}}`
      )

      // EN RULES

      expect(en).toContain(`{"key":"en:home","href":"/home"}`)
      expect(en).toContain(`{"key":"cs:home","href":"/cs"}`)
      expect(en).toContain(`{"key":"es:home","href":"/es"}`)

      expect(en).toContain(
        `{"key":"en:auth/signup","href":"/auth/signup-a1.page"}`
      )
      expect(en).toContain(
        `{"key":"en:auth/login","href":"/auth/login-a2.htm"}`
      )

      expect(en).toContain(
        `{"key":"en:account/profile","href":"/account/profile-b1.htm"}`
      )
      expect(en).toContain(
        `{"key":"en:account/settings","href":"/account/settings-b2.htm"}`
      )

      expect(en).toContain(
        `{"key":"en:detail/article","href":"/articles/[...slug]"}`
      )

      // EN META

      expect(en).toContain(
        `{"key":"en:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )
      expect(en).toContain(
        `{"key":"cs:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )
      expect(en).toContain(
        `{"key":"es:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )

      // ES

      expect(es).toContain(`import HomeRoot from 'roots/home'`)
      expect(es).toContain(
        `HomePage.getRootsContext = (): Partial<RootsContext>`
      )
      expect(es).toContain(`export default HomePage`)

      // ES CURRENT CONTEXT

      expect(es).toContain(`currentLocale: 'es'`)
      expect(es).toContain(`currentRoot: 'home'`)
      expect(es).toContain(`currentRule: {"key":"es:home","href":"/es"}`)
      expect(es).toContain(
        `currentMeta: {"key":"es:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}}`
      )

      // ES RULES

      expect(es).toContain(`{"key":"en:home","href":"/home"}`)
      expect(es).toContain(`{"key":"cs:home","href":"/cs"}`)
      expect(es).toContain(`{"key":"es:home","href":"/es"}`)

      expect(es).toContain(
        `{"key":"es:auth/signup","href":"/es/auth/signup.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:auth/login","href":"/es/autorizacion/iniciar-sesion-a2.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:account/profile","href":"/es/cuenta/perfil-b1.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:account/settings","href":"/es/cuenta/ajustes-b2.htm"}`
      )

      expect(es).toContain(
        `{"key":"es:detail/article","href":"/es/articles/[...slug]"}`
      )

      // ES META

      expect(es).toContain(
        `{"key":"en:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )
      expect(es).toContain(
        `{"key":"cs:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )
      expect(es).toContain(
        `{"key":"es:home","data":{"title":"Awesome Next Roots","background":"grey","footer":false}`
      )
    })

    test('dynamic content', () => {
      const cs = fs
        .readFileSync('example/pages/cs/articles/[...slug].tsx')
        .toString()
      const en = fs
        .readFileSync('example/pages/articles/[...slug].tsx')
        .toString()
      const es = fs
        .readFileSync('example/pages/es/articles/[...slug].tsx')
        .toString()

      // CS ROOT

      expect(cs).toContain(
        `import DetailArticleRoot, * as __root from 'roots/detail/dynamic-root'`
      )
      expect(cs).toContain(
        `DetailArticlePage.getRootsContext = (): Partial<RootsContext> => ({`
      )
      expect(cs).toContain(
        `export const getStaticPaths: GetStaticPaths = async () => __root.getStaticPaths()`
      )
      expect(cs).toContain(
        `export const getStaticProps: GetStaticProps = async (context) => __root.getStaticProps({ ...context, __locale: 'cs' })`
      )

      expect(cs).toContain(`export default DetailArticlePage`)

      // CS CURRENT CONTEXT

      expect(cs).toContain(`currentLocale: 'cs'`)
      expect(cs).toContain(`currentRoot: 'detail/article'`)
      expect(cs).toContain(
        `currentRule: {"key":"cs:detail/article","href":"/cs/articles/[...slug]"}`
      )
      expect(cs).toContain(
        `currentMeta: {"key":"cs:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}}`
      )

      expect(cs).toContain(
        `{"key":"en:detail/article","href":"/articles/[...slug]"}`
      )
      expect(cs).toContain(
        `{"key":"cs:detail/article","href":"/cs/articles/[...slug]"}`
      )
      expect(cs).toContain(
        `{"key":"es:detail/article","href":"/es/articles/[...slug]"}`
      )

      expect(cs).toContain(`{"key":"cs:home","href":"/cs"}`)
      expect(cs).toContain(
        `{"key":"cs:auth/signup","href":"/cs/overeni/registrace-a1.page"}`
      )
      expect(cs).toContain(
        `{"key":"cs:auth/login","href":"/cs/overeni/prihlaseni-a2.htm"}`
      )
      expect(cs).toContain(
        `{"key":"cs:account/profile","href":"/cs/ucet/profil-b1.htm"}`
      )
      expect(cs).toContain(
        `{"key":"cs:account/settings","href":"/cs/ucet/nastaveni-b2.htm"}`
      )

      // CS META

      expect(cs).toContain(
        `{"key":"en:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )
      expect(cs).toContain(
        `{"key":"cs:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )
      expect(cs).toContain(
        `{"key":"es:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )

      // EN ROOT

      expect(en).toContain(
        `import DetailArticleRoot, * as __root from 'roots/detail/dynamic-root'`
      )
      expect(en).toContain(
        `DetailArticlePage.getRootsContext = (): Partial<RootsContext> => ({`
      )
      expect(en).toContain(
        `export const getStaticPaths: GetStaticPaths = async () => __root.getStaticPaths()`
      )
      expect(en).toContain(
        `export const getStaticProps: GetStaticProps = async (context) => __root.getStaticProps({ ...context, __locale: 'en' })`
      )
      expect(en).toContain(`export default DetailArticlePage`)

      // EN CURRENT CONTEXT

      expect(en).toContain(`currentLocale: 'en'`)
      expect(en).toContain(`currentRoot: 'detail/article'`)
      expect(en).toContain(
        `currentRule: {"key":"en:detail/article","href":"/articles/[...slug]"}`
      )
      expect(en).toContain(
        `currentMeta: {"key":"en:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}}`
      )

      // EN RULES

      expect(en).toContain(
        `{"key":"en:detail/article","href":"/articles/[...slug]"}`
      )
      expect(en).toContain(
        `{"key":"cs:detail/article","href":"/cs/articles/[...slug]"}`
      )
      expect(en).toContain(
        `{"key":"es:detail/article","href":"/es/articles/[...slug]"}`
      )

      expect(en).toContain(`{"key":"en:home","href":"/home"}`)
      expect(en).toContain(
        `{"key":"en:auth/signup","href":"/auth/signup-a1.page"}`
      )
      expect(en).toContain(
        `{"key":"en:auth/login","href":"/auth/login-a2.htm"}`
      )
      expect(en).toContain(
        `{"key":"en:account/profile","href":"/account/profile-b1.htm"}`
      )
      expect(en).toContain(
        `{"key":"en:account/settings","href":"/account/settings-b2.htm"}`
      )

      // EN META

      expect(en).toContain(
        `{"key":"en:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )
      expect(en).toContain(
        `{"key":"cs:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )
      expect(en).toContain(
        `{"key":"es:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )

      // ES ROOT

      expect(es).toContain(
        `import DetailArticleRoot, * as __root from 'roots/detail/dynamic-root'`
      )
      expect(es).toContain(
        `DetailArticlePage.getRootsContext = (): Partial<RootsContext> => ({`
      )
      expect(es).toContain(
        `export const getStaticPaths: GetStaticPaths = async () => __root.getStaticPaths()`
      )
      expect(es).toContain(
        `export const getStaticProps: GetStaticProps = async (context) => __root.getStaticProps({ ...context, __locale: 'es' })`
      )

      expect(es).toContain(`export default DetailArticlePage`)

      // ES CURRENT CONTEXT

      expect(es).toContain(`currentLocale: 'es'`)
      expect(es).toContain(`currentRoot: 'detail/article'`)
      expect(es).toContain(
        `currentRule: {"key":"es:detail/article","href":"/es/articles/[...slug]"}`
      )
      expect(es).toContain(
        `currentMeta: {"key":"es:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}}`
      )

      // ES RULES

      expect(es).toContain(
        `{"key":"en:detail/article","href":"/articles/[...slug]"}`
      )
      expect(es).toContain(
        `{"key":"cs:detail/article","href":"/cs/articles/[...slug]"}`
      )
      expect(es).toContain(
        `{"key":"es:detail/article","href":"/es/articles/[...slug]"}`
      )
      expect(es).toContain(`{"key":"es:home","href":"/es"}`)
      expect(es).toContain(
        `{"key":"es:auth/signup","href":"/es/auth/signup.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:auth/login","href":"/es/autorizacion/iniciar-sesion-a2.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:account/profile","href":"/es/cuenta/perfil-b1.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:account/settings","href":"/es/cuenta/ajustes-b2.htm"}`
      )

      // ES META

      expect(es).toContain(
        `{"key":"en:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )
      expect(es).toContain(
        `{"key":"cs:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )
      expect(es).toContain(
        `{"key":"es:detail/article","data":{"title":"Awesome Next Roots","background":"magenta","footer":false}`
      )
    })

    test('auth/login content', () => {
      const cs = fs
        .readFileSync('example/pages/cs/overeni/prihlaseni-a2.htm.tsx')
        .toString()
      const en = fs
        .readFileSync('example/pages/auth/login-a2.htm.tsx')
        .toString()
      const es = fs
        .readFileSync('example/pages/es/autorizacion/iniciar-sesion-a2.htm.tsx')
        .toString()

      // CS ROOT

      expect(cs).toContain(`import AuthLoginRoot from 'roots/auth/login'`)
      expect(cs).toContain(
        `AuthLoginPage.getRootsContext = (): Partial<RootsContext>`
      )
      expect(cs).toContain(`export default AuthLoginPage`)

      // CS CURRENT CONTEXT

      expect(cs).toContain(`currentLocale: 'cs'`)
      expect(cs).toContain(`currentRoot: 'auth/login'`)
      expect(cs).toContain(
        `currentRule: {"key":"cs:auth/login","href":"/cs/overeni/prihlaseni-a2.htm"}`
      )
      expect(cs).toContain(
        `currentMeta: {"key":"cs:auth/login","data":{"title":"Přihlášení","background":"green","footer":false,"section":"Ověření"}}`
      )

      // CS RULES

      expect(cs).toContain(
        `{"key":"en:auth/login","href":"/auth/login-a2.htm"}`
      )
      expect(cs).toContain(
        `{"key":"cs:auth/login","href":"/cs/overeni/prihlaseni-a2.htm"}`
      )
      expect(cs).toContain(
        `{"key":"es:auth/login","href":"/es/autorizacion/iniciar-sesion-a2.htm"}`
      )

      expect(cs).toContain(`{"key":"cs:home","href":"/cs"}`)
      expect(cs).toContain(
        `{"key":"cs:auth/signup","href":"/cs/overeni/registrace-a1.page"}`
      )
      expect(cs).toContain(
        `{"key":"cs:account/profile","href":"/cs/ucet/profil-b1.htm"}`
      )
      expect(cs).toContain(
        `{"key":"cs:account/settings","href":"/cs/ucet/nastaveni-b2.htm"}`
      )
      expect(cs).toContain(
        `{"key":"cs:detail/article","href":"/cs/articles/[...slug]"}`
      )

      // CS META

      expect(cs).toContain(
        `{"key":"en:auth/login","data":{"title":"Login","background":"green","footer":true,"section":"Authorization"}`
      )
      expect(cs).toContain(
        `{"key":"cs:auth/login","data":{"title":"Přihlášení","background":"green","footer":false,"section":"Ověření"}`
      )
      expect(cs).toContain(
        `{"key":"es:auth/login","data":{"title":"Iniciar Sesión","background":"green","footer":true,"section":"Autorización"}`
      )

      // EN ROOT

      expect(en).toContain(`import AuthLoginRoot from 'roots/auth/login'`)
      expect(en).toContain(
        `AuthLoginPage.getRootsContext = (): Partial<RootsContext>`
      )
      expect(en).toContain(`export default AuthLoginPage`)

      // EN CURRENT CONTEXT

      expect(en).toContain(`currentLocale: 'en'`)
      expect(en).toContain(`currentRoot: 'auth/login'`)
      expect(en).toContain(
        `currentRule: {"key":"en:auth/login","href":"/auth/login-a2.htm"}`
      )
      expect(en).toContain(
        `currentMeta: {"key":"en:auth/login","data":{"title":"Login","background":"green","footer":true,"section":"Authorization"}}`
      )

      expect(en).toContain(
        `{"key":"en:auth/login","href":"/auth/login-a2.htm"}`
      )
      expect(en).toContain(
        `{"key":"cs:auth/login","href":"/cs/overeni/prihlaseni-a2.htm"}`
      )
      expect(en).toContain(
        `{"key":"es:auth/login","href":"/es/autorizacion/iniciar-sesion-a2.htm"}`
      )

      expect(en).toContain(`{"key":"en:home","href":"/home"}`)
      expect(en).toContain(
        `{"key":"en:auth/signup","href":"/auth/signup-a1.page"}`
      )
      expect(en).toContain(
        `{"key":"en:account/profile","href":"/account/profile-b1.htm"}`
      )
      expect(en).toContain(
        `{"key":"en:account/settings","href":"/account/settings-b2.htm"}`
      )
      expect(en).toContain(
        `{"key":"en:detail/article","href":"/articles/[...slug]"}`
      )

      // EN META

      expect(en).toContain(
        `{"key":"en:auth/login","data":{"title":"Login","background":"green","footer":true,"section":"Authorization"}`
      )
      expect(en).toContain(
        `{"key":"cs:auth/login","data":{"title":"Přihlášení","background":"green","footer":false,"section":"Ověření"}`
      )
      expect(en).toContain(
        `{"key":"es:auth/login","data":{"title":"Iniciar Sesión","background":"green","footer":true,"section":"Autorización"}`
      )

      // ES ROOT

      expect(es).toContain(`import AuthLoginRoot from 'roots/auth/login'`)
      expect(es).toContain(
        `AuthLoginPage.getRootsContext = (): Partial<RootsContext>`
      )

      expect(es).toContain(`export default AuthLoginPage`)

      // ES CURRENT CONTEXT

      expect(es).toContain(`currentLocale: 'es'`)
      expect(es).toContain(`currentRoot: 'auth/login'`)
      expect(es).toContain(
        `currentRule: {"key":"es:auth/login","href":"/es/autorizacion/iniciar-sesion-a2.htm"}`
      )
      expect(es).toContain(
        `currentMeta: {"key":"es:auth/login","data":{"title":"Iniciar Sesión","background":"green","footer":true,"section":"Autorización"}}`
      )

      expect(es).toContain(
        `{"key":"en:auth/login","href":"/auth/login-a2.htm"}`
      )
      expect(es).toContain(
        `{"key":"cs:auth/login","href":"/cs/overeni/prihlaseni-a2.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:auth/login","href":"/es/autorizacion/iniciar-sesion-a2.htm"}`
      )

      expect(es).toContain(`{"key":"es:home","href":"/es"}`)
      expect(es).toContain(
        `{"key":"es:auth/signup","href":"/es/auth/signup.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:account/profile","href":"/es/cuenta/perfil-b1.htm"}`
      )
      expect(es).toContain(
        `{"key":"es:account/settings","href":"/es/cuenta/ajustes-b2.htm"}`
      )

      expect(es).toContain(
        `{"key":"es:detail/article","href":"/es/articles/[...slug]"}`
      )

      // ES META

      expect(es).toContain(
        `{"key":"en:auth/login","data":{"title":"Login","background":"green","footer":true,"section":"Authorization"}`
      )
      expect(es).toContain(
        `{"key":"cs:auth/login","data":{"title":"Přihlášení","background":"green","footer":false,"section":"Ověření"}`
      )
      expect(es).toContain(
        `{"key":"es:auth/login","data":{"title":"Iniciar Sesión","background":"green","footer":true,"section":"Autorización"}`
      )
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
  })
})
