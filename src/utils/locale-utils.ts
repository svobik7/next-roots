type GetLocaleFactoryParams = {
  locales: string[]
  defaultLocale: string
}

export function getLocaleFactory({
  defaultLocale,
  locales,
}: GetLocaleFactoryParams) {
  return (pathName: string) => {
    const relativePathName = pathName.startsWith('/')
      ? pathName.slice(1)
      : pathName

    const [locale] = relativePathName.split('/')
    return locales.includes(locale) ? locale : defaultLocale
  }
}
