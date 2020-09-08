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
  useTypings?: boolean
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
    useTypings = true,
  } = props

  // const pageMeta = meta?.find(m => m);

  const hasSpecialMethods =
    hasGetInitialProps ||
    hasGetServerSideProps ||
    hasGetStaticPaths ||
    hasGetStaticProps

  let tpl = ``

  if (useTypings && hasSpecialMethods) {
    const specialTypes = []

    hasGetInitialProps && specialTypes.push('NextPageContext')
    hasGetServerSideProps && specialTypes.push('GetServerSideProps')
    hasGetStaticPaths && specialTypes.push('GetStaticPaths')
    hasGetStaticProps && specialTypes.push('GetStaticProps')

    tpl += `import { ${specialTypes.join(', ')} } from 'next'` + `\n`
  }

  if (useTypings) {
    tpl += `import { Roots } from 'next-roots/context'` + `\n`
  }

  tpl += hasSpecialMethods
    ? `import ${pageName}Root, * as __root from '${rootAlias}'` + `\n`
    : `import ${pageName}Root from '${rootAlias}'` + `\n`

  tpl += `\n`

  const pageProps = useTypings ? 'pageProps: any' : 'pageProps'

  tpl += `function ${pageName}Page(${pageProps}) {` + `\n`
  tpl += `  return <${pageName}Root {...pageProps} />` + `\n`
  tpl += `}` + `\n`

  tpl += `\n`

  const ctxReturnType = useTypings ? ': Partial<Roots>' : ''

  tpl += `${pageName}Page.getRoots = ()${ctxReturnType} => ({` + `\n`
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
    tpl += useTypings ? `// @ts-ignore` + `\n` : ''

    const ctxProp = useTypings ? 'context: NextPageContext' : 'context'

    tpl +=
      `${pageName}Page.getInitialProps = async (${ctxProp}) => __root.getInitialProps({ ...context, __locale: '${locale}' })` +
      `\n`
  }

  if (hasGetServerSideProps) {
    tpl += `\n`
    tpl += useTypings ? `// @ts-ignore` + `\n` : ''

    const methodName = useTypings
      ? 'getServerSideProps: GetServerSideProps'
      : 'getServerSideProps'

    tpl +=
      `export const ${methodName} = async (context) => __root.getServerSideProps({ ...context, __locale: '${locale}' })` +
      `\n`
  }

  if (hasGetStaticProps) {
    tpl += `\n`
    tpl += useTypings ? `// @ts-ignore` + `\n` : ''

    const methodName = useTypings
      ? 'getStaticProps: GetStaticProps'
      : 'getStaticProps'

    tpl +=
      `export const ${methodName} = async (context) => __root.getStaticProps({ ...context, __locale: '${locale}' })` +
      `\n`
  }

  if (hasGetStaticPaths) {
    tpl += `\n`

    const methodName = useTypings
      ? 'getStaticPaths: GetStaticPaths'
      : 'getStaticPaths'

    tpl +=
      `export const ${methodName} = async () => __root.getStaticPaths()` + `\n`
  }

  tpl += `\n`
  tpl += `export default ${pageName}Page`

  return tpl
}
