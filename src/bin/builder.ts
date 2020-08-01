import pageTemplate from '../templates/page.tpl'
import {
  BuilderSchema,
  BuilderSchemaMeta,
  BuilderSchemaPage,
  Config,
  SchemaMeta,
  SchemaRule,
} from '../types'
import {
  createSchemaRulePath,
  decodeSchemaRuleKey,
  encodeSchemaRuleKey,
} from '../utils'

const fs = require('fs')
const path = require('path')

// load CLI args
const [, , configPath = 'roots.config.js', configParams = {}] = process.argv

// load runtime config
const cfgRuntime = require(path.join(process.cwd(), configPath)) || configParams

// create final config
const cfgDefault = {
  schemas: [],
  locales: [],
  defaultLocale: '',
  defaultSuffix: '',
  basePath: '.',
  dirRoots: 'roots',
  dirPages: 'pages',
  staticRoots: ['api', '_app', '_document', '_error', '404', 'index'],
  extRoots: '.tsx',
  useTypings: true,
}

// create builder config
const cfg: Config = { ...cfgDefault, ...cfgRuntime }

// create main dir path
const mainDir = path.dirname(path.join(process.cwd(), configPath))

/**
 * Creates file path relatively to configuration file directory
 * @param string filePath
 */
function getFilePath(filePath: string): string {
  return path.join(mainDir, filePath)
}

/**
 * Create file in given path and writes given content into it
 * @param string path
 * @param string content
 */
function saveFile(filePath: string, content: string): void {
  makeDirectory(filePath)
  fs.writeFileSync(filePath, content)
}

/**
 * Create file in given path and writes given content into it
 * @param string path
 * @param string encoding
 * @returns string
 */
function readFile(path: string, encoding: BufferEncoding = 'utf8'): string {
  if (!isFile(path)) return ''
  return fs.readFileSync(path).toString(encoding)
}

/**
 * Copies file from `from` to `to`
 * @param string from
 * @param string to
 */
function copyFile(from: string, to: string): void {
  makeDirectory(to)
  fs.copyFileSync(from, to)
}

/**
 * Indicates if path is file
 * @param string path
 */
function isFile(path: string): boolean {
  if (!fs.existsSync(path)) return false
  return fs.statSync(path).isFile()
}

/**
 * Copies directory from `from` to `to`
 * @param string from
 * @param string to
 */
function copyDirectory(from: string, to: string): void {
  if (!isDirectory(from)) return

  makeDirectory(to)

  const files = fs.readdirSync(from)

  files.forEach((currentPath: string) => {
    const currentFrom = path.join(from, currentPath)
    const currentTo = path.join(to, currentPath)

    isDirectory(currentFrom)
      ? copyDirectory(currentFrom, currentTo)
      : copyFile(currentFrom, currentTo)
  })
}

/**
 * Create directory in given path recursively
 * @param string path
 */
function makeDirectory(dirPath: string): void {
  dirPath = path.dirname(dirPath)

  if (fs.existsSync(dirPath)) return
  fs.mkdirSync(dirPath, { recursive: true })
}

/**
 * Removes given directory recursively
 * @param string path
 */
function removeDirectory(dir: string): void {
  if (!fs.existsSync(dir)) return
  fs.rmdirSync(dir, { recursive: true })
}

/**
 * Indicates if path is directory
 * @param string path
 */
function isDirectory(path: string): boolean {
  if (!fs.existsSync(path)) return false
  return fs.statSync(path).isDirectory()
}

/**
 * Create route rule for given page
 *
 * Input:
 * - page: { path: some-path-:token, locale: en, suffix: .htm }
 * - params: { token: p1 }
 *
 * Expected output:
 * - ['/en/some-path-p1.htm', '/en/some-path-:p1.htm']
 *
 * @param params
 */
function createPageRewrite(
  page: BuilderSchemaPage,
  params = {}
): [string, string | undefined] {
  const locale =
    cfg.shallowLocales && cfg.shallowLocales.includes(page.locale)
      ? ''
      : page.locale

  const pageHref = createSchemaRulePath(page.path, locale, page.suffix)
  const pageAs =
    page.alias && createSchemaRulePath(page.alias, locale, page.suffix)

  const replaceParams = (
    input: string,
    params: BuilderSchema['params']
  ): string => {
    params &&
      Object.keys(params).forEach((key) => {
        input = input.replace(`:${key}`, String(params[key]))
      })

    return input
  }

  const rHref = replaceParams(pageHref, { ...params, locale })
  const rAs = pageAs && replaceParams(pageAs, { ...params, locale })

  return [rHref, rAs || undefined]
}

/**
 * Creates camelCased page name based on given root name
 *
 * Input:
 * - rootName: account/profile
 *
 * Expected output:
 * - AccountProfile
 *
 * @param rootName
 */
function createPageName(rootName: string) {
  let pageName = rootName.replace(/[-\/]([a-z])/g, (m) => m[1].toUpperCase())
  pageName = pageName[0].toUpperCase() + pageName.slice(1)

  return pageName
}

/**
 * Creates page content based on root
 * - adds `getRootsContext` method
 * - add forwards to all special methods like `getStaticProps`, ...
 * - add page locale to special methods context
 *
 * @param rootPath
 * @param rootAlias
 * @param pageRule
 */
function createPageContent(
  rootPath: string,
  rootAlias: string,
  schemaRules: Map<string, SchemaRule[]>,
  schemaMeta: Map<string, SchemaMeta[]>,
  pageRule: SchemaRule
) {
  // create special method indicators
  const rootContent = readFile(rootPath)
  const hasGetInitialProps = hasSpecialMethod(rootContent, 'getInitialProps')
  const hasGetServerSideProps = hasSpecialMethod(
    rootContent,
    'getServerSideProps'
  )
  const hasGetStaticPaths = hasSpecialMethod(rootContent, 'getStaticPaths')
  const hasGetStaticProps = hasSpecialMethod(rootContent, 'getStaticProps')

  // parse page rule
  const [pageRoot, pageLocale = ''] = decodeSchemaRuleKey(pageRule.key)

  // create page name
  const pageName = createPageName(pageRoot)

  // create page relative rules
  const rules = [
    ...(schemaRules.get(`__${pageLocale}`) || []),
    ...(schemaRules.get(pageRoot) || []),
  ]

  // create page relative meta
  const meta = [...(schemaMeta.get(pageRoot) || [])]

  // create current page meta
  const pageMeta = meta.find((m) => m.key === pageRule.key)

  return pageTemplate({
    locale: pageLocale,
    rules,
    meta,
    rootName: pageRoot,
    rootAlias,
    pageName,
    pageRule,
    pageMeta,
    hasGetInitialProps,
    hasGetServerSideProps,
    hasGetStaticPaths,
    hasGetStaticProps,
    useTypings: cfg.useTypings,
  })
}

/**
 * Indicates if given content contains Next.js special method
 * based on given method name
 * @param content
 * @param name
 */
function hasSpecialMethod(content: string, name: string): boolean {
  return (
    null !==
    content.match(
      new RegExp(`export (const|var|let|async function|function) ${name}`)
    )
  )
}

/**
 * Merges locale specific metaData with prototyped metaData
 *
 * Input:
 * - metaData: [
 *  { locale: '*', data: { background: 'red' } }
 *  { locale: 'en', data: { title: 'Next Roots' } }
 * ]
 *
 * Expected output:
 * - { title: 'Next Roots', background: 'red' }
 *
 * @param meta
 * @param locale
 */
function reduceMetaData(meta: BuilderSchemaMeta[], locale: string) {
  const metaProto = meta.find((m) => m.locale === '*')
  const metaSchema = meta.find((m) => m.locale === locale)

  return { ...metaProto?.data, ...metaSchema?.data }
}

/**
 * Splits given builder schemas into array with two indexes
 * - [0] contains array of real schemas
 * - [1] contains array of prototype schemas
 *
 * @param schemas
 */
function parseSchemas(
  schemas: BuilderSchema[]
): [BuilderSchema[], BuilderSchema[]] {
  return schemas.reduce(
    (result: [BuilderSchema[], BuilderSchema[]], current: BuilderSchema) => {
      current.isPrototype || current.root === '*'
        ? result[1].push(current)
        : result[0].push(current)
      return result
    },
    [[], []]
  )
}

/**
 * Lets a miracle happen
 */
function run() {
  console.log('\x1b[33mnext-roots', '\x1b[37m- generating pages ...')

  const DIR_ROOTS = path.join(cfg.basePath, cfg.dirRoots)
  const DIR_PAGES = path.join(cfg.basePath, cfg.dirPages)

  // ensure pages directory is clean before build
  removeDirectory(DIR_PAGES)

  const schemaRules = new Map<string, SchemaRule[]>()
  const schemaMeta = new Map<string, SchemaMeta[]>()

  const [realSchemas, protoSchemas] = parseSchemas(cfg.schemas)

  realSchemas.forEach((schema) => {
    // rewrite schema for each locale
    cfg.locales.forEach((l) => {
      if (schema.pages) {
        // find rewrite param based on locale
        const pageSchema =
          schema.pages.find((p) => p.locale === l) ||
          schema.pages.find((p) => p.locale === '*')

        // warn about missing rewrite rule
        if (!pageSchema) {
          console.log(
            '\x1b[31mwarn',
            '\x1b[37m- page rule for',
            `\x1b[31m${l}:${schema.root}`,
            '\x1b[37mis missing!'
          )
        }

        // make sure all page rewrite params are set
        const page: BuilderSchemaPage = {
          locale: l,
          path: pageSchema?.path || schema.root,
          alias: pageSchema?.alias || '',
          suffix: pageSchema?.suffix ?? cfg.defaultSuffix,
        }

        // create page rewrite
        const [href, as] = createPageRewrite(page, schema.params)

        // create page rule
        const pageRule = {
          key: encodeSchemaRuleKey(schema.root, l),
          href,
          as,
        }

        schemaRules.set(schema.root, [
          ...(schemaRules.get(schema.root) || []),
          pageRule,
        ])

        schemaRules.set(`__${l}`, [
          ...(schemaRules.get(`__${l}`) || []),
          pageRule,
        ])
      }

      const metaDataProto = protoSchemas.reduce((acc, curr) => {
        // ignore roots with no metadata
        if (!curr.metaData) {
          return acc
        }

        let isMatch = false

        try {
          isMatch = curr.root === '*' || schema.root.match(curr.root) !== null
        } catch {
          isMatch = false
        }

        // merge general prototype or regex prototype
        if (isMatch) {
          acc = {
            ...reduceMetaData(curr.metaData, l),
            ...acc,
          }
        }

        return acc
      }, {})

      const metaData = schema.metaData && reduceMetaData(schema.metaData, l)

      if (metaData || metaDataProto) {
        const pageMeta = {
          key: encodeSchemaRuleKey(schema.root, l),
          data: { ...metaDataProto, ...metaData },
        }

        schemaMeta.set(schema.root, [
          ...(schemaMeta.get(schema.root) || []),
          pageMeta,
        ])
      }
    })
  })

  // create page files for schema rules
  cfg.schemas.forEach((s) => {
    // skip prototype rules
    if (s.isPrototype || s.root === '*') return

    const pageRules = schemaRules.get(s.root)

    pageRules?.forEach((pageRule) => {
      const rootPath = getFilePath(
        path.format({
          dir: DIR_ROOTS,
          name: s.root,
          ext: cfg.extRoots,
        })
      )

      const rootAlias = `${cfg.dirRoots}/${s.root}`

      // create `/en/index.tsx` instead of `/en.tsx`
      const pageName = cfg.locales.includes(pageRule.href.slice(1))
        ? `${pageRule.href}/index`
        : pageRule.href

      const pagePath = getFilePath(
        path.format({
          dir: DIR_PAGES,
          name: pageName,
          ext: cfg.extRoots,
        })
      )

      // create page template for each root
      const pageContent = createPageContent(
        rootPath,
        rootAlias,
        schemaRules,
        schemaMeta,
        pageRule
      )

      saveFile(pagePath, pageContent)
    })
  })

  // create GLOBAL context file with rules and meta data
  const allRules = cfg.locales.reduce((acc: SchemaRule[], curr: string) => {
    acc = [...acc, ...(schemaRules.get(`__${curr}`) || [])]
    return acc
  }, [] as SchemaRule[])

  const schemaFilePath = `${mainDir}/roots.schema.js`
  const schemaFileContent = {
    locales: cfg.locales,
    defaultLocale: cfg.defaultLocale,
    // rules: allRules,
  }

  // save schema file
  saveFile(
    schemaFilePath,
    `module.exports = ${JSON.stringify(schemaFileContent)}`
  )

  // keep next.js specific files / dirs as they are
  // and just copy them to pages directory
  cfg.staticRoots.forEach((staticPath) => {
    const sourceDir = getFilePath(
      path.format({
        dir: DIR_ROOTS,
        name: staticPath,
      })
    )

    if (isDirectory(sourceDir)) {
      const targetDir = getFilePath(
        path.format({
          dir: DIR_PAGES,
          name: staticPath,
        })
      )

      copyDirectory(sourceDir, targetDir)
      return
    }

    const sourceFile = getFilePath(
      path.format({
        dir: DIR_ROOTS,
        name: staticPath,
        ext: cfg.extRoots,
      })
    )

    if (isFile(sourceFile)) {
      const targetFile = getFilePath(
        path.format({
          dir: DIR_PAGES,
          name: staticPath,
          ext: cfg.extRoots,
        })
      )

      copyFile(sourceFile, targetFile)
      return
    }
  })
}

run()
