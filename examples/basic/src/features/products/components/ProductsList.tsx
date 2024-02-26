import type { ProductTranslation } from 'src/server/db/types'
import { ProductsListItem } from './ProductsListItem'

type ProductsListProps = {
  products: ProductTranslation[]
}

export function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {products.map((product) => (
        <ProductsListItem key={product.id} product={product} />
      ))}
    </div>
  )
}
