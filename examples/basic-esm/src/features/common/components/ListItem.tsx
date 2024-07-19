import Link from 'next/link'
import type { BookTranslation } from 'src/server/db/types'
import { getBooksDetailHref, getBooksHref } from 'src/server/router'

export type ListItemProps = {
  title: string
  createdAt: string
  content: string
  href: string
}

export function ListItem({ content, createdAt, title, href }: ListItemProps) {
  return (
    <article className="flex max-w-xl flex-col items-start justify-between bg-white p-4">
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime="2020-03-16" className="text-gray-500">
          {createdAt}
        </time>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <Link href={href}>
            <span className="absolute inset-0"></span>
            {title}
          </Link>
        </h3>
        <p className="mt-5 text-sm leading-6 text-gray-600">
          {content.slice(0, 160)}...
        </p>
      </div>
    </article>
  )
}
