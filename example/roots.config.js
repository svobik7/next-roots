module.exports = {
  locales: ['en', 'cs', 'es'],
  defaultLocale: 'en',
  defaultSuffix: '.htm',
  dirRoots: 'roots',
  dirPages: 'pages',
  schemas: [
    {
      root: '*',
      metaData: { title: 'YeahCoach', background: 'grey' },
    },
    {
      root: 'index',
      pages: [{ locale: '*', path: 'index', alias: '/', suffix: '' }],
    },
    {
      root: 'auth/signup',
      pages: [
        {
          locale: 'en',
          path: 'auth/signup-:token',
          suffix: '.page',
          metaData: { title: 'Signup' },
        },
        {
          locale: 'cs',
          path: 'auth/registrace-:token',
          suffix: '.page',
          metaData: { title: 'Registrace' },
        },
      ],
      params: { token: 'a1' },
      metaData: { background: 'red' },
    },
    {
      root: 'auth/login',
      pages: [
        {
          locale: 'en',
          path: 'auth/login-:token',
          metaData: { title: 'Login' },
        },
        {
          locale: 'cs',
          path: 'auth/prihlaseni-:token',
          metaData: { title: 'Přihlášení' },
        },
        {
          locale: 'es',
          path: 'auth/iniciar-sesion-:token',
          metaData: { title: 'Iniciar Sesión' },
        },
      ],
      params: { token: 'a2' },
      metaData: { background: 'green' },
    },
    {
      root: 'account/profile',
      pages: [
        { locale: 'en', path: 'account/profile-:token' },
        { locale: 'cs', path: 'ucet/profil-:token' },
        { locale: 'es', path: 'cuenta/perfil-:token' },
      ],
      params: { token: 'b1' },
      metaData: { background: 'orange' },
    },
    {
      root: 'account/settings',
      pages: [
        { locale: 'en', path: 'account/settings-:token' },
        { locale: 'cs', path: 'ucet/nastaveni-:token' },
        { locale: 'es', path: 'cuenta/ajustes-:token' },
      ],
      params: { token: 'b2' },
      metaData: { background: 'blue' },
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
      // metaData: { background: 'magenta' },
    },

    // {
    //   root: 'user/index',
    //   pages: [
    //     {
    //       locale: '*',
    //       path: '[user]/index',
    //       suffix: ''
    //     },
    //   ],
    //   metaData: { background: 'lime' },
    // },

    // {
    //   root: 'fallback',
    //   pages: [
    //     {
    //       locale: false,
    //       path: '[...fallback]',
    //       suffix: ''
    //     },
    //   ],
    //   metaData: { background: 'gold' },
    // },
  ],
}
