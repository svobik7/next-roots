export type Route = {
  name: `/${string}`
  href: `/${string}`
}

export type RouterSchema = {
  routes: Record<string, Route[]>
  locales: string[]
  defaultLocale: string
}

export type RoutesPrioritiesMap = Record<`/${string}`, number>
