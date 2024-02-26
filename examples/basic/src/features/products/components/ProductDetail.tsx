import type { ReactNode } from 'react'
import type { ProductTranslation } from 'src/server/db/types'
import { getDictionary } from 'src/server/utils/getDictionary'

type ProductDetailProps = {
  product: ProductTranslation
  alternatives?: ReactNode
  buttonBack?: ReactNode
}

export async function ProductDetail({
  product,
  alternatives,
  buttonBack,
}: ProductDetailProps) {
  const t = await getDictionary(product.locale)
  return (
    <div className="relative isolate overflow-hidden bg-white p-6 sm:py-8 lg:px-0">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.title}
              </h1>

              <p className="mt-2 text-xl leading-8 text-gray-700">
                {product.content}
              </p>
              {buttonBack && <p className="mt-6">{buttonBack}</p>}
            </div>
          </div>
          {alternatives && <div className="mt-16 lg:mt-0 ">{alternatives}</div>}
        </div>
      </div>
    </div>
  )
}
