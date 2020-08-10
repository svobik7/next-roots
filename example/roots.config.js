module.exports = {
  locales: ['en', 'cs', 'es'],
  shallowLocales: ['en'],
  defaultLocale: 'en',
  defaultSuffix: '.htm',
  dirRoots: 'roots',
  dirPages: 'pages',
  schemas: [
    {
      root: '*',
      metaData: [
        {
          locale: '*',
          data: {
            title: 'Awesome Next Roots',
            background: 'grey',
            footer: false,
          },
        },
      ],
      isPrototype: true,
    },
    {
      root: 'home',
      pages: [
        { locale: 'en', path: 'home', suffix: '' },
        { locale: '*', path: 'index', suffix: '' },
      ],
    },
    {
      root: 'auth/(.*)',
      metaData: [
        { locale: '*', data: { footer: true } },
        { locale: 'en', data: { section: 'Authorization' } },
        { locale: 'cs', data: { section: 'Ověření' } },
        { locale: 'es', data: { section: 'Autorización' } },
      ],
      isPrototype: true,
    },
    {
      root: 'auth/signup',
      pages: [
        {
          locale: 'en',
          path: 'auth/signup-:token',
          suffix: '.page',
        },
        {
          locale: 'cs',
          path: 'overeni/registrace-:token',
          suffix: '.page',
        },
      ],
      metaData: [
        { locale: '*', data: { background: 'red' } },
        { locale: 'cs', data: { title: 'Registrace' } },
        { locale: 'en', data: { title: 'Signup' } },
      ],
      params: { token: 'a1' },
    },
    {
      root: 'auth/login',
      pages: [
        {
          locale: 'en',
          path: 'auth/login-:token',
        },
        {
          locale: 'cs',
          path: 'overeni/prihlaseni-:token',
        },
        {
          locale: 'es',
          path: 'autorizacion/iniciar-sesion-:token',
        },
      ],
      metaData: [
        { locale: '*', data: { background: 'green' } },
        { locale: 'cs', data: { title: 'Přihlášení', footer: false } },
        { locale: 'en', data: { title: 'Login' } },
        { locale: 'es', data: { title: 'Iniciar Sesión' } },
      ],
      params: { token: 'a2' },
    },
    {
      root: 'account/profile',
      pages: [
        {
          locale: 'en',
          path: 'account/profile-:token',
        },
        {
          locale: 'cs',
          path: 'ucet/profil-:token',
        },
        {
          locale: 'es',
          path: 'cuenta/perfil-:token',
        },
      ],
      metaData: [
        { locale: '*', data: { background: 'orange' } },
        { locale: 'cs', data: { title: 'Profil' } },
        { locale: 'en', data: { title: 'Profile' } },
        { locale: 'es', data: { title: 'Perfil' } },
      ],
      params: { token: 'b1' },
    },
    {
      root: 'account/settings',
      pages: [
        { locale: 'en', path: 'account/settings-:token' },
        { locale: 'cs', path: 'ucet/nastaveni-:token' },
        { locale: 'es', path: 'cuenta/ajustes-:token' },
      ],
      metaData: [{ locale: '*', data: { background: 'blue' } }],
      params: { token: 'b2' },
    },

    {
      root: 'detail/dynamic-root',
      rootName: 'detail/article',
      pages: [
        {
          locale: '*',
          path: 'articles/[...slug]',
          suffix: '',
        },
      ],
      metaData: [{ locale: '*', data: { background: 'magenta' } }],
    },

    {
      root: 'detail/dynamic-root',
      rootName: 'detail/product',
      pages: [
        {
          locale: '*',
          path: 'products/[...slug]',
          suffix: '',
        },
      ],
      metaData: [{ locale: '*', data: { background: 'cyan' } }],
    },
  ],
}
