import pageTemplate from '../templates/page.tpl'
import {
  Builder,
  BuilderPage,
  Config,
  Schema,
  SchemaMeta,
  SchemaRule,
} from '../types'
import { createSchemaRulePath, encodeSchemaRuleKey } from '../utils'

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
  dirRoots: 'roots',
  dirPages: 'pages',
  staticRoots: ['api', '_app', '_document', '_error', '404', 'index'],
  extRoots: '.tsx',
}

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
 * Creates schema file content
 * @param rules
 * @param meta
 */
function createSchema(
  locale: string,
  rules: SchemaRule[],
  meta: SchemaMeta[]
): Partial<Schema> {
  // create builder config
  const cfg: Config = { ...cfgDefault, ...cfgRuntime }

  if (locale === '*') {
    return {
      defaultLocale: cfg.defaultLocale,
      locales: cfg.locales,
      rules,
      meta,
    }
  }

  return {
    currentLocale: locale,
    rules,
    meta,
  }
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
function createRouteRule(
  page: BuilderPage,
  params = {}
): [string, string | undefined] {
  const pageHref = createSchemaRulePath(page.path, page.locale, page.suffix)
  const pageAs =
    page.alias && createSchemaRulePath(page.alias, page.locale, page.suffix)

  const replaceParams = (input: string, params: Builder['params']): string => {
    Object.keys(params).forEach((key) => {
      input = input.replace(`:${key}`, String(params[key]))
    })

    return input
  }

  const rHref = replaceParams(pageHref, { ...params, locale: page.locale })
  const rAs =
    pageAs && replaceParams(pageAs, { ...params, locale: page.locale })

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
  pageRule: SchemaRule
) {
  const parsedRuleKey = pageRule.key.split(':')

  // create camel cased page name from root name
  const locale = parsedRuleKey.length > 1 ? parsedRuleKey[0] : ''

  // create names
  const rootName =
    parsedRuleKey.length > 1 ? parsedRuleKey[1] : parsedRuleKey[0]
  const pageName = createPageName(rootName)

  // create special method indicators
  const rootContent = readFile(rootPath)
  const hasGetInitialProps = hasSpecialMethod(rootContent, 'getInitialProps')
  const hasGetServerSideProps = hasSpecialMethod(
    rootContent,
    'getServerSideProps'
  )
  const hasGetStaticPaths = hasSpecialMethod(rootContent, 'getStaticPaths')
  const hasGetStaticProps = hasSpecialMethod(rootContent, 'getStaticProps')

  return pageTemplate({
    locale,
    rootName,
    rootAlias,
    pageName,
    pageRule: JSON.stringify(pageRule),
    hasGetInitialProps,
    hasGetServerSideProps,
    hasGetStaticPaths,
    hasGetStaticProps,
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

function run() {
  console.log('\x1b[33mrewrite', '\x1b[37m- generating next-roots ...')

  // create builder config
  const cfg: Config = { ...cfgDefault, ...cfgRuntime }

  // ensure pages directory is clean before build
  removeDirectory(cfg.dirPages)

  const schemaRules = new Map<string, SchemaRule[]>()
  const schemaMeta = new Map<string, SchemaMeta[]>()

  // create pages for each rewrite
  cfg.schemas.forEach((cfgSchema) => {
    const rootPath = getFilePath(
      path.format({
        dir: cfg.dirRoots,
        name: cfgSchema.root,
        ext: cfg.extRoots,
      })
    )

    const rootAlias = path.format({
      dir: cfg.dirRoots,
      name: cfgSchema.root,
    })

    const isGeneralRoot = cfgSchema.root === '*'

    // push global meta data to global meta table
    if (cfgSchema.metaData && Object.keys(cfgSchema.metaData).length) {
      schemaMeta.set('*', [
        ...(schemaMeta.get('*') || []),
        {
          key: cfgSchema.root,
          data: cfgSchema.metaData,
        },
      ])
    }

    // create page file for each root's rewrite
    !isGeneralRoot &&
      cfgSchema.pages &&
      cfg.locales.forEach((l) => {
        // find rewrite param based on locale
        let page = cfgSchema.pages.find(
          (p) => p.locale === l || p.locale === '*'
        )

        // warn about missing rewrite rule
        if (!page) {
          console.log(
            '\x1b[31mwarn',
            '\x1b[37m- rewrite rule for',
            `\x1b[31m${l}:${cfgSchema.root}`,
            '\x1b[37mis missing!'
          )
        }

        // make sure all page rewrite params are set
        const pageSchema: BuilderPage = {
          locale: l,
          path: page?.path || cfgSchema.root,
          alias: page?.alias || '',
          suffix: page?.suffix ?? cfg.defaultSuffix,
        }

        const ruleKey = encodeSchemaRuleKey(cfgSchema.root, l)

        // create page rewrite
        const [href, as] = createRouteRule(pageSchema, cfgSchema.params)

        // create page rule
        const pageRule = {
          key: ruleKey,
          href,
          as,
        }

        // push new rule to schema
        schemaRules.set(l, [...(schemaRules.get(l) || []), pageRule])

        // push page meta data to meta table
        if (page?.metaData && Object.keys(page.metaData).length) {
          schemaMeta.set(l, [
            ...(schemaMeta.get(l) || []),
            {
              key: ruleKey,
              data: page?.metaData,
            },
          ])
        }

        const pagePath = getFilePath(
          path.format({
            dir: cfg.dirPages,
            name: href,
            ext: cfg.extRoots,
          })
        )

        // create page template for each root
        const pageContent = createPageContent(rootPath, rootAlias, pageRule)

        saveFile(pagePath, pageContent)
      })
  })

  // create context file with rules and meta data
  // for each locale - keep it as small as possible
  cfg.locales.forEach((l) => {
    const dataRules = schemaRules.get(l) || []
    const dataMeta = schemaMeta.get(l) || []

    const schemaPath = `${mainDir}/roots.schema.${l}.js`
    const schema = createSchema(l, dataRules, dataMeta)

    // save schema file
    saveFile(schemaPath, `module.exports = ${JSON.stringify(schema)}`)
  })

  // create GLOBAL context file with rules and meta data
  const dataRules = schemaRules.get('*') || []
  const dataMeta = schemaMeta.get('*') || []

  const schemaPath = `${mainDir}/roots.schema.js`
  const schema = createSchema('*', dataRules, dataMeta)

  // save schema file
  saveFile(schemaPath, `module.exports = ${JSON.stringify(schema)}`)

  // keep next.js specific files / dirs as they are
  // and just copy them to pages directory
  cfg.staticRoots.forEach((staticPath) => {
    const sourceDir = getFilePath(
      path.format({
        dir: cfg.dirRoots,
        name: staticPath,
      })
    )

    if (isDirectory(sourceDir)) {
      const targetDir = getFilePath(
        path.format({
          dir: cfg.dirPages,
          name: staticPath,
        })
      )

      copyDirectory(sourceDir, targetDir)
      return
    }

    const sourceFile = getFilePath(
      path.format({
        dir: cfg.dirRoots,
        name: staticPath,
        ext: cfg.extRoots,
      })
    )

    if (isFile(sourceFile)) {
      const targetFile = getFilePath(
        path.format({
          dir: cfg.dirPages,
          name: staticPath,
          ext: cfg.extRoots,
        })
      )

      copyFile(sourceFile, targetFile)
      return
    }
  })
}

// run async generator
run()
