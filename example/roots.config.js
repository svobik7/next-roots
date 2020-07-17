module.exports = {
  locales: ['en', 'cs', 'es'],
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
          data: { title: 'Awesome Next Roots', background: 'grey' },
        },
      ],
      isPrototype: true,
    },
    {
      root: 'home',
      pages: [{ locale: '*', path: 'index', alias: '/', suffix: '' }],
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
        { locale: 'cs', data: { title: 'Přihlášení' } },
        { locale: 'en', data: { title: 'Login' } },
        { locale: 'es', data: { title: 'Iniciar Sesión' } },
      ],
      params: { token: 'a2' },
    },
    // {
    //   root: 'account/*',
    //   metaData: [
    //     { locale: 'cs', data: { section: 'Account' } },
    //     { locale: 'en', data: { section: 'Účet' } },
    //     { locale: 'es', data: { section: 'Cuenta' } },
    //   ],
    //   isPrototype: true,
    // },
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
      root: 'dynamic',
      pages: [
        {
          locale: '*',
          path: '[...slug]',
          suffix: '',
        },
      ],
      metaData: [{ locale: '*', data: { background: 'magenta' } }],
    },
  ],
}
