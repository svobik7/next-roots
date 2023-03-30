import Link from 'next/link'
import type { ReactNode } from 'react'
import type { ArticleTranslation } from 'src/server/db/types'
import { getAuthorHref, getHomeHref } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

type ArticleDetailProps = {
  article: ArticleTranslation
  alternatives?: ReactNode
}

export async function ArticleDetail({
  article,
  alternatives,
}: ArticleDetailProps) {
  const t = await getDictionary(article.locale)
  return (
    <div className="relative isolate overflow-hidden bg-white p-6 sm:py-8 lg:px-0">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {article.title}
              </h1>

              {article.author && (
                <p className="mt-4 text-base font-semibold leading-7">
                  {t('article.Author:')}&nbsp;
                  <Link
                    href={getAuthorHref(article.author)}
                    className="text-indigo-600"
                  >
                    {article.author.name}
                  </Link>
                </p>
              )}
              <p className="mt-2 text-xl leading-8 text-gray-700">
                {article.content}
              </p>
              <p className="mt-6">
                <Link
                  href={getHomeHref(article.locale)}
                  role="button"
                  className="rounded bg-indigo-600 px-4 py-2 text-base font-semibold leading-7 text-white"
                >
                  {t('article.BtnBack')}
                </Link>
              </p>
            </div>
          </div>
          {alternatives && <div className="mt-16 lg:mt-0 ">{alternatives}</div>}
        </div>
      </div>
    </div>
  )
}
