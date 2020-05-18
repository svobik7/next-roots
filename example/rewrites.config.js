module.exports = {
  locales: ['en', 'cs', 'es'],
  defaultLocale: 'en',
  defaultSuffix: '.htm',
  dirRoots: 'roots',
  dirPages: 'pages',
  rewrites: [
    {
      root: 'auth/signup',
      token: 'a1',
      params: [
        { locale: 'en', path: 'auth/signup-:token', suffix: '.page' },
        { locale: 'cs', path: 'auth/registrace-:token', suffix: '.page' },
      ],
    },
    {
      root: 'auth/login',
      token: 'a2',
      params: [
        { locale: 'en', path: 'auth/login-:token' },
        { locale: 'cs', path: 'auth/prihlaseni-:token' },
        { locale: 'es', path: 'auth/iniciar-sesion-:token' },
      ],
    },
    {
      root: 'account/profile',
      token: 'b1',
      params: [
        { locale: 'en', path: 'account/profile-:token' },
        { locale: 'cs', path: 'ucet/profil-:token' },
        { locale: 'es', path: 'cuenta/perfil-:token' },
      ],
    },
    {
      root: 'account/settings',
      token: 'b2',
      params: [
        { locale: 'en', path: 'account/settings-:token' },
        { locale: 'cs', path: 'ucet/nastaveni-:token' },
        { locale: 'es', path: 'cuenta/ajustes-:token' },
      ],
    },

    // 'detail/article': [
    //   {
    //     locale: '*',
    //     path: '(.*)-:root(ART)',
    //     suffix: '.htm',
    //     page: 'detail/article-:root',
    //   },
    // ],
    // 'detail/order': [
    //   {
    //     locale: '*',
    //     path: '(.*)-:root',
    //     suffix: '.htm',
    //     page: 'detail/article-:root',
    //   },
    // ],
  ],
}
