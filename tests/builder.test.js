const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync

function cli(args, cwd) {
  return new Promise((resolve) => {
    exec(
      `node ${path.resolve('./bin/builder.js')} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        })
      }
    )
  })
}

describe('next-rewrites:cli-builder', () => {
  beforeAll(() => {
    // ensure that package is build to latest version
    execSync('yarn build')
    // remove example pages directory (this dir will be use in tests)
    execSync('rm -rf example/pages')
    // run next-rewrites in example folder and then get back
    execSync('cd example && yarn rewrite && cd ..')
  })

  afterAll(() => {
    execSync('rm -rf example/pages')
  })

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
    expect(fs.existsSync('example/pages/index.tsx')).toBe(true)
    expect(fs.existsSync('example/pages/api/get-version.ts')).toBe(true)
    expect(fs.existsSync('example/pages/api/users/get-users.ts')).toBe(true)

    expect(fs.existsSync('example/pages/en/auth/signup-a1.page.tsx')).toBe(true)
    expect(fs.existsSync('example/pages/cs/auth/registrace-a1.page.tsx')).toBe(
      true
    )

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
    expect(fs.existsSync('example/pages/cs/ucet/profil-b1.htm.tsx')).toBe(true)
    expect(fs.existsSync('example/pages/es/cuenta/perfil-b1.htm.tsx')).toBe(
      true
    )

    expect(fs.existsSync('example/pages/en/account/settings-b2.htm.tsx')).toBe(
      true
    )
    expect(fs.existsSync('example/pages/cs/ucet/nastaveni-b2.htm.tsx')).toBe(
      true
    )
    expect(fs.existsSync('example/pages/es/cuenta/ajustes-b2.htm.tsx')).toBe(
      true
    )
  })

  // test('should build all the pages files', () => {
  //   expect(fs.existsSync('example/roots/_app.js')).toBe(true)
  //   expect(fs.existsSync('example/roots/index.tsx')).toBe(true)

  //   expect(fs.existsSync('example/pages/_app.js')).toBe(true)
  //   expect(fs.existsSync('example/pages/index.tsx')).toBe(true)
  // })
})
