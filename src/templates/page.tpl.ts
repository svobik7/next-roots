export type PageTemplateProps = {
  locale: string
  rules?: object[]
  meta?: object[]
  pageName: string
  pageRule: object
  pageMeta?: object
  rootName: string
  rootAlias: string
  hasGetStaticProps?: boolean
  hasGetStaticPaths?: boolean
  hasGetServerSideProps?: boolean
  hasGetInitialProps?: boolean
}

export default function pageTemplate(props: PageTemplateProps) {
  const {
    locale,
    rules,
    meta,
    pageName,
    pageRule,
    pageMeta,
    rootName,
    rootAlias,
    hasGetStaticProps = false,
    hasGetStaticPaths = false,
    hasGetServerSideProps = false,
    hasGetInitialProps = false,
  } = props

  // const pageMeta = meta?.find(m => m);

  const hasSpecialMethods =
    hasGetInitialProps ||
    hasGetServerSideProps ||
    hasGetStaticPaths ||
    hasGetStaticProps

  let tpl = ``

  if (hasSpecialMethods) {
    const specialTypes = []

    hasGetInitialProps && specialTypes.push('NextPageContext')
    hasGetServerSideProps && specialTypes.push('GetServerSideProps')
    hasGetStaticPaths && specialTypes.push('GetStaticPaths')
    hasGetStaticProps && specialTypes.push('GetStaticProps')

    tpl += `import { ${specialTypes.join(', ')} } from 'next'` + `\n`
  }

  tpl += `import RootsContext from 'next-roots/context'` + `\n`

  tpl += hasSpecialMethods
    ? `import ${pageName}Root, * as __root from '${rootAlias}'` + `\n`
    : `import ${pageName}Root from '${rootAlias}'` + `\n`

  tpl += `\n`

  tpl += `function ${pageName}Page(pageProps: any) {` + `\n`
  tpl += `  return <${pageName}Root {...pageProps} />` + `\n`
  tpl += `}` + `\n`

  tpl += `\n`

  tpl +=
    `${pageName}Page.getRootsContext = (): Partial<RootsContext> => ({` + `\n`
  tpl += `  currentLocale: '${locale}',` + `\n`
  tpl += `  currentRoot: '${rootName}',` + `\n`
  tpl += `  currentRule: ${JSON.stringify(pageRule)},` + `\n`

  if (pageMeta) {
    tpl += `  currentMeta: ${JSON.stringify(pageMeta)},` + `\n`
  }

  if (rules && rules.length) {
    tpl += `  rules: [` + `\n`

    rules.forEach((r) => {
      tpl += `    ${JSON.stringify(r)},` + `\n`
    })

    tpl += `  ],` + `\n`
  }

  if (meta && meta.length) {
    tpl += `  meta: [` + `\n`

    meta.forEach((m) => {
      tpl += `    ${JSON.stringify(m)},` + `\n`
    })

    tpl += `  ],` + `\n`
  }

  tpl += `})` + `\n`

  if (hasGetInitialProps) {
    tpl += `\n`
    tpl += `// @ts-ignore` + `\n`
    tpl +=
      `${pageName}Page.getInitialProps = async (context: NextPageContext) => __root.getInitialProps({ ...context, __locale: '${locale}' })` +
      `\n`
  }

  if (hasGetServerSideProps) {
    tpl += `\n`
    tpl += `// @ts-ignore` + `\n`
    tpl +=
      `export const getServerSideProps: GetServerSideProps = async (context) => __root.getServerSideProps({ ...context, __locale: '${locale}' })` +
      `\n`
  }

  if (hasGetStaticProps) {
    tpl += `\n`
    tpl += `// @ts-ignore` + `\n`
    tpl +=
      `export const getStaticProps: GetStaticProps = async (context) => __root.getStaticProps({ ...context, __locale: '${locale}' })` +
      `\n`
  }

  if (hasGetStaticPaths) {
    tpl += `\n`
    tpl +=
      `export const getStaticPaths: GetStaticPaths = async () => __root.getStaticPaths()` +
      `\n`
  }

  tpl += `\n`
  tpl += `export default ${pageName}Page`

  return tpl
}
