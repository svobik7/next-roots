import type { RouterSchema } from './types'

let schema: RouterSchema

try {
  schema = require('./cache/schema')
} catch {
  throw new Error("Roots schema not found. Did you forget to run 'yarn roots'?")
}

export { schema }
export * from './router/router'
