import Error from 'next/error'
import Head from 'next/head'

export default function NotFound() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <Error statusCode={404} />
    </>
  )
}
