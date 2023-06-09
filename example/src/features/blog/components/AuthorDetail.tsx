import Link from 'next/link'
import type { ReactNode } from 'react'
import type { AuthorTranslation } from 'src/server/db/types'
import { getHomeHref } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

type AuthorDetailProps = {
  author: AuthorTranslation
  articles?: ReactNode
  alternatives?: ReactNode
}

export async function AuthorDetail({
  author,
  articles,
  alternatives,
}: AuthorDetailProps) {
  const t = await getDictionary(author.locale)
  return (
    <div className="relative isolate overflow-hidden bg-white p-6 sm:py-8 lg:px-0">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {author.name}
              </h1>
              <p className="mt-4 text-xl leading-8 text-gray-700">
                {author.about}
              </p>
              <p className="mt-6">
                <Link
                  href={getHomeHref(author.locale)}
                  role="button"
                  className="rounded bg-indigo-600 px-4 py-2 text-base font-semibold leading-7 text-white"
                >
                  {t('author.BtnHome')}
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-16 lg:mt-0">
            {articles && <div className="flex">{articles}</div>}
            {alternatives && <div className="mt-8 flex">{alternatives}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
