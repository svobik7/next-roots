import { GetServerSideProps } from 'next'
import schema from 'roots.schema'

/**
 * NOTE: This is example of initial redirect to default localized page. This page is not used in current example because of
 * - roots.config.shallowLocale points to 'en'
 * - and roots.config.staticRoots ignores 'index'
 */

export default function IndexPage({ locale }) {
  return <h1>Redirecting to {locale}... </h1>
}

/**
 * Get Static Paths
 *
 * Defines most wanted paths to be pre-rendered during build-time
 *
 * @see https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = schema.defaultLocale

  // create redirect target path
  context.res.setHeader('Location', `/${locale}`)
  context.res.statusCode = 302

  return { props: { locale } }
}
