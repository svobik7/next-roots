import { resolve } from 'path'
import type { RouterSchema } from './types'

const schema: RouterSchema = {
  defaultLocale: '',
  locales: [],
  routes: {},
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const config = require(resolve(process.cwd(), 'roots.config.js'))

  schema.defaultLocale = config.defaultLocale
  schema.locales = config.locales
} catch {
  // silent catch
}

export * from './router/router'
export { schema }
