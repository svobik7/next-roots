import { LayoutMain } from 'components/layout'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const DetailArticle = dynamic(() => import('domain/detail-article'))
const DetailAuthor = dynamic(() => import('domain/detail-author'))

function getBodyComponent(slug: string[]) {
  if (slug.length > 1) {
    return DetailArticle
  }

  return DetailAuthor
}

export default function DynamicPageRoot() {
  const router = useRouter()

  // choose proper body based on router slug
  const BodyComponent = getBodyComponent(
    !Array.isArray(router.query.slug) ? [router.query.slug] : router.query.slug
  )

  return (
    <LayoutMain>
      <BodyComponent />
    </LayoutMain>
  )
}
