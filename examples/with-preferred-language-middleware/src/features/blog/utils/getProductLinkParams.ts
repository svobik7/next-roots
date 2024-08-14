import type { ProductTranslation } from 'src/server/db/types'
import { getProductsHref } from 'src/server/router'

export function getProductLinkParams(product: ProductTranslation) {
  return {
    locale: product.locale,
    name: product.title,
    href: getProductsHref({ product }),
  }
}
