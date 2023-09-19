const path = require('path')

module.exports = {
  originDir: path.resolve(__dirname, 'src/routes'),
  localizedDir: path.resolve(__dirname, 'app'),
  locales: ['en', 'cs', 'es'],
  defaultLocale: 'en',
  prefixDefaultLocale: false, // serves "en" locale on / instead of /en
}
