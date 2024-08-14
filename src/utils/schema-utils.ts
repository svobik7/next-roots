import type { RouterSchema } from '~/types'
import { createRoutesPrioritiesMap } from './route-utils'

export function sanitizeSchema(schema: RouterSchema) {
  const routesPrioritiesMap = createRoutesPrioritiesMap(schema)
  Object.keys(schema.routes).forEach((locale) => {
    schema.routes[locale] = schema.routes[locale].sort((a, b) => {
      const priorityA = routesPrioritiesMap[a.name]
      const priorityB = routesPrioritiesMap[b.name]
      return priorityA - priorityB
    })
  })

  return schema
}
