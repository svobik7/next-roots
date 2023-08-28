const path = require('path')

module.exports = {
  originDir: path.resolve(__dirname, 'src/routes'),
  localizedDir: path.resolve(__dirname, 'app/(localized)'), // use 'app' when you do not have any un-translated routes
  locales: ['en', 'cs', 'es'],
  defaultLocale: 'en',
  prefixDefaultLocale: true, // when "false" then "en" locale is served on "/"" instead of "/en"
}
