import Image from 'next/image'
import Link from 'next/link'
import type { ProductTranslation } from 'src/server/db/types'
import { getProductsHref, getAuthorHref } from 'src/server/router'

type ProductsListItemProps = { product: ProductTranslation }

export function ProductsListItem({ product }: ProductsListItemProps) {
  const hrefProduct = getProductsHref({ product })

  return (
    <article className="flex max-w-xl flex-col items-start justify-between bg-white p-4">
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime="2020-03-16" className="text-gray-500">
          {product.createdAt}
        </time>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <Link href={hrefProduct}>
            <span className="absolute inset-0"></span>
            {product.title}
          </Link>
        </h3>
        <p className="mt-5 text-sm leading-6 text-gray-600">
          {product.content.slice(0, 160)}...
        </p>
      </div>
    </article>
  )
}
