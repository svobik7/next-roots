import { schema } from 'next-roots'
import { RedirectType } from 'next/dist/client/components/redirect'
import { notFound, redirect } from 'next/navigation'
import { router } from 'src/server/router'
import { findLocalizedHrefFactory } from './utils'

type PageProps = { params: { catchAll: string[] } }

export default function CatchAllPage({ params: { catchAll = [] } }: PageProps) {
  const getLocalizedHref = findLocalizedHrefFactory(router, schema)
  const localizedHref = getLocalizedHref(catchAll.join('/'))

  if (localizedHref) {
    redirect(localizedHref, RedirectType.replace)
  }

  notFound()
}
