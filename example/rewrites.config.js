module.exports = {
  locales: ['en', 'cs', 'es'],
  defaultLocale: 'en',
  defaultSuffix: '.htm',
  dirRoots: 'roots',
  dirPages: 'pages',
  rewrites: [
    {
      root: 'index',
      pages: [{ locale: '*', path: 'index', alias: '/', suffix: '' }],
    },
    {
      root: 'auth/signup',
      pages: [
        { locale: 'en', path: 'auth/signup-:token', suffix: '.page' },
        { locale: 'cs', path: 'auth/registrace-:token', suffix: '.page' },
      ],
      params: { token: 'a1' },
    },
    {
      root: 'auth/login',
      pages: [
        { locale: 'en', path: 'auth/login-:token' },
        { locale: 'cs', path: 'auth/prihlaseni-:token' },
        { locale: 'es', path: 'auth/iniciar-sesion-:token' },
      ],
      params: { token: 'a2' },
    },
    {
      root: 'account/profile',
      pages: [
        { locale: 'en', path: 'account/profile-:token' },
        { locale: 'cs', path: 'ucet/profil-:token' },
        { locale: 'es', path: 'cuenta/perfil-:token' },
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
      params: { token: 'b2' },
    },

    // {
    //   root: 'detail/article',
    //   pages: [
    //     {
    //       locale: '*',
    //       path: 'detail/article/[key]',
    //       alias: ':slug(.*)-:token:key([A-Z]{3,})',
    //     },
    //   ],
    //   params: [{ name: 'token', value: 'dART' }],
    // },
  ],
}
