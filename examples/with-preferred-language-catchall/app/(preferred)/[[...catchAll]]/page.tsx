import { redirect } from 'next/navigation'
import { Router, schema } from 'next-roots'
import { findLocalizedHrefFactory, getUserPreferredLanguage } from './utils'

type CatchAllParams = Promise<{ catchAll?: string[] }>

export default async function CatchAllPage({
  params,
}: {
  params: CatchAllParams
}) {
  const awaitedParams = await params
  const catchAll = awaitedParams.catchAll || []

  // Build the path from catchAll segments
  const path = catchAll.length > 0 ? `/${catchAll.join('/')}` : '/'

  const router = new Router(schema)
  const findLocalizedHref = findLocalizedHrefFactory(router, schema)

  // Find the localized href for the path
  const localizedHref = await findLocalizedHref(path)

  // If route not found, redirect to home in preferred locale
  // (findLocalizedHref handles root path case internally)
  if (!localizedHref) {
    const userLanguage = await getUserPreferredLanguage(
      schema.locales,
      schema.defaultLocale
    )
    const homeHref = router.getHref('/', { locale: userLanguage })
    redirect(homeHref)
  }

  // Redirect to the localized version
  redirect(localizedHref)
}
