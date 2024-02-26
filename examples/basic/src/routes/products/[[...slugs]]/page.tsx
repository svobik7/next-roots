import type { Metadata } from 'next'
import type {
  GeneratePageMetadataProps,
  GenerateStaticParamsProps,
  PageProps,
} from 'next-roots'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getProductLinkParams } from 'src/features/blog/utils/getProductLinkParams'
import { getProductMetadata } from 'src/features/blog/utils/getProductMetadata'
import {
  getAllProductTranslations,
  getProductTranslation,
  getProductTranslationFactory,
} from 'src/features/blog/utils/getProductTranslation'
import { Links } from 'src/features/common/components/Links'
import { ProductDetail } from 'src/features/products/components/ProductDetail'
import { ProductsList } from 'src/features/products/components/ProductsList'
import { fetchProductBySlug, fetchProducts } from 'src/server/db'
import { Product } from 'src/server/db/types'
import { getHomeHref, getProductsHref, router } from 'src/server/router'
import { getDictionary } from 'src/server/utils/getDictionary'

type ProductDetailPageProps = {
  pageHref: string
  pageLocale: string
  product?: Product
}

async function ProductDetailPage({
  pageHref,
  pageLocale,
  product,
}: ProductDetailPageProps) {
  const t = await getDictionary(pageLocale)

  if (!product) {
    return notFound()
  }

  const allProductTranslations = getAllProductTranslations(product)
  const currentArticleTranslation = getProductTranslation({
    product,
    locale: pageLocale,
  })

  if (!currentArticleTranslation) {
    return notFound()
  }

  const href = getProductsHref({ product: currentArticleTranslation })

  if (pageHref !== href) {
    return redirect(href)
  }

  return (
    <ProductDetail
      product={currentArticleTranslation}
      alternatives={
        <Links
          header={t('common.NotYourLanguage?')}
          items={allProductTranslations.map(getProductLinkParams)}
        />
      }
      buttonBack={
        <Link
          href={getHomeHref(currentArticleTranslation.locale)}
          role="button"
          className="rounded bg-indigo-600 px-4 py-2 text-base font-semibold leading-7 text-white"
        >
          {t('article.BtnBack')}
        </Link>
      }
    />
  )
}

type ProductParams = { slugs: string }

export default async function ProductPage({
  params,
  pageHref,
}: PageProps<ProductParams>) {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)
  const translateProduct = getProductTranslationFactory(pageLocale)

  if (params.slugs) {
    const product = await fetchProductBySlug(params.slugs)
    return (
      <ProductDetailPage
        product={product}
        pageHref={pageHref}
        pageLocale={pageLocale}
      />
    )
  } else {
    const productsList = await fetchProducts()
    return <ProductsList products={productsList.map(translateProduct)} />
  }
}

export async function generateMetadata({
  pageHref,
  params,
}: GeneratePageMetadataProps<ProductParams>): Promise<Metadata> {
  const pageLocale = router.getLocaleFromHref(pageHref)
  const t = await getDictionary(pageLocale)

  const product = await fetchProductBySlug(params.slugs)

  if (product) {
    return getProductMetadata(product, pageLocale)
  }

  return { title: t('products.title'), description: t('products.content') }
}

export async function generateStaticParams({
  pageLocale,
}: GenerateStaticParamsProps) {
  const products = await fetchProducts()

  return products
    .map((product) => ({
      slugs: product.slug
        .find((slug) => slug.locale === pageLocale)
        ?.value.split('/'),
    }))
    .filter((product) => product.slugs)
}
