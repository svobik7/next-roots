import type { Metadata } from 'next'
import type { Product } from 'src/server/db/types'
import { getProductTranslation } from './getProductTranslation'

export function getProductMetadata(product: Product, locale: string): Metadata {
  const productTranslation = getProductTranslation({ product, locale })

  return {
    title: productTranslation.title,
    description: productTranslation.content?.slice(0, 255),
  }
}
