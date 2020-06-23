import Head from 'next/head'

export default function Forward({ url }) {
  return (
    <>
      <Head>
        <meta http-equiv="refresh" content={`2;url=${url}`} />
        <title>Page Moved</title>
      </Head>
      <div>
        This page has moved. Click <a href={url}>here</a> to go to the new page.
      </div>
    </>
  )
}
