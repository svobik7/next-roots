import {
  fetchManyArticles,
  fetchManyAuthors,
  fetchOneArticle,
  fetchOneAuthor,
} from 'lib/api'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ComponentType } from 'react'

/**
 * Load error UIs dynamically
 */
const Fallback = dynamic(() => import('domains/fallback'))
const NotFound = dynamic(() => import('domains/not-found'))

/**
 * Keeps all possible domain components
 * in string indexed map
 */
const bodyComponents = new Map<string, ComponentType<{ data: unknown }>>()
  .set(
    'detail-article',
    dynamic(() => import('domains/detail-article'))
  )
  .set(
    'detail-author',
    dynamic(() => import('domains/detail-author'))
  )

/**
 * Dynamic Root
 *
 * Catch all non-static url paths
 */
function DynamicRoot({ bodyComponentData, bodyComponentKey }) {
  const router = useRouter()

  // show fallback when SSG is not ready
  if (router.isFallback) {
    return <Fallback />
  }

  // load body component based on given key
  const BodyComponent = bodyComponents.get(String(bodyComponentKey))

  // show not found when body component is missing
  if (!BodyComponent) {
    return <NotFound />
  }

  return <BodyComponent data={bodyComponentData} />
}

/**
 * Retrieves body key and data
 *
 * This is used by Root to determine which body component should
 * rendered according to actual bodyComponentKey param while
 * keeping all body components lazy loaded.
 *
 * @param [key, data]
 */
async function parseContextParams(
  params: GetStaticPropsContext['params']
): Promise<{ key: string; data: unknown }> {
  const result = { key: 'not-found', data: {} }

  // not fount when invalid slug is given
  if (!params.slug || !params.slug.length) return result

  // load author always as we want to keep paths like `/author-slug[/article-slug]`
  result.key = 'detail-author'
  result.data['author'] = await fetchOneAuthor(params.slug[0])

  // load article only when article slug is occurred
  if (params.slug.length > 1) {
    result.key = 'detail-article'
    result.data['article'] = await fetchOneArticle(params.slug[1])
  }

  return result
}

/**
 * Get Static Paths
 *
 * Defines most wanted paths to be pre-rendered during build-time
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // load data from api
  const articles = await fetchManyArticles(2)
  const authors = await fetchManyAuthors(2)

  return {
    paths: [
      ...authors.map((author) => ({ params: { slug: [author.username] } })),
      ...articles.map((article) => {
        const author = authors.find((a) => a.id === article.authorId)
        return {
          params: {
            slug: [author?.username || 'admin', article.slug],
          },
        }
      }),
    ],
    fallback: true,
  }
}

/**
 * Get Static Props
 *
 * Pulls most wanted data from server during build-time
 * based on static-paths so the page can be pre-rendered in advance.
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
 */
export const getStaticProps: GetStaticProps = async (context) => {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const { key, data } = await parseContextParams(context.params)

  return {
    props: {
      bodyComponentKey: key,
      bodyComponentData: data,
    },
  }
}

export default DynamicRoot
