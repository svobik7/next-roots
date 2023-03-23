import type { Route, RouterSchema } from '~/types'
import { getLocaleFactory } from '~/utils/locale-utils'

type GetRouterSchemaParams = {
  routes: Route[]
  locales: string[]
  defaultLocale: string
}

export function getRouterSchema({
  routes,
  locales,
  defaultLocale,
}: GetRouterSchemaParams): RouterSchema {
  const getLocale = getLocaleFactory({ locales, defaultLocale })
  const schema: RouterSchema = { defaultLocale, locales, routes: {} }

  routes.forEach((route) => {
    const locale = getLocale(route.href) || defaultLocale

    const existingRoutes = schema.routes[locale] || []
    schema.routes[locale] = [...existingRoutes, route]
  })

  return schema
}
