import type { Product, ProductTranslation } from '../../../server/db/types'
import { getTranslationFactory } from '../../common/utils/getTranslation'

type GetProductTranslationProps = {
  product: Product
  locale: string
}

export function getProductTranslation({
  product,
  locale,
}: GetProductTranslationProps) {
  const translate = getTranslationFactory(locale)

  return {
    ...product,
    title: translate(product, 'title'),
    content: translate(product, 'content'),
    slug: translate(product, 'slug'),
    locale,
  }
}

export function getAllProductTranslations(product: Product) {
  return product.slug.map(({ locale }) =>
    getProductTranslation({ product, locale })
  )
}

export function getProductTranslationFactory(locale: string) {
  return (product: Product): ProductTranslation =>
    getProductTranslation({ locale, product })
}
