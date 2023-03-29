export type CliParams = {
  originDir: string
  localizedDir: string
  locales: string[]
  defaultLocale: string
  prefixDefaultLocale: boolean
  packageDir: string
}

export type Config = {
  locales: string[]
  defaultLocale: string
  prefixDefaultLocale: boolean
  getLocalizedAbsolutePath: (fileName?: string) => string
  getOriginAbsolutePath: (fileName?: string) => string
  getDistAbsolutePath: (fileName?: string) => string
  getCacheAbsolutePath: (fileName?: string) => string
  getOriginContents: (fileName: string) => string
}

export type Origin = {
  path: string
  localizations: OriginLocalization[]
}

export type OriginLocalization = {
  locale: string
  path: string
}

export type Rewrite = {
  originPath: string
  localizedPath: string
}

export type Root = {
  path: string
  translations: RootTranslation[]
}

export type RootTranslation = {
  locale: string
  path: string
}
