import Image from 'next/image'
import Link from 'next/link'
import type { ArticleTranslation } from 'src/server/db/types'
import { getArticleHref, getAuthorHref } from 'src/server/router'

type ArticlesListItemProps = { article: ArticleTranslation }

export function ArticlesListItem({ article }: ArticlesListItemProps) {
  const hrefArticle = getArticleHref(article)
  const hrefAuthor = article.author ? getAuthorHref(article.author) : '#'

  return (
    <article className="flex max-w-xl flex-col items-start justify-between bg-white p-4">
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime="2020-03-16" className="text-gray-500">
          {article.createdAt}
        </time>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <Link href={hrefArticle}>
            <span className="absolute inset-0"></span>
            {article.title}
          </Link>
        </h3>
        <p className="mt-5 text-sm leading-6 text-gray-600">
          {article.content.slice(0, 160)}...
        </p>
      </div>
      {article.author && (
        <div className="relative mt-8 flex items-center gap-x-4">
          <Image
            src={`${article.author.avatar}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
            alt={article.author.username}
            className="size-10 rounded-full bg-gray-50"
            width={40}
            height={40}
          />
          <div className="text-sm leading-6">
            <p className="font-semibold text-gray-900">
              <Link href={hrefAuthor}>
                <span className="absolute inset-0"></span>
                {article.author?.name}
              </Link>
            </p>
          </div>
        </div>
      )}
    </article>
  )
}
