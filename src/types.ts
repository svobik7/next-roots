export type Route = {
  name: `/${string}`
  href: `/${string}`
}

export type RouterSchema = {
  routes: Record<string, Route[]>
  locales: string[]
  defaultLocale: string
}

export type Middleware = {
  href: string
  path: string
  originName: string
}
