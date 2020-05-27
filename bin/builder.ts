import { Config, RewriteMeta, RewritePage, RewriteRule } from './../src/types'
import { encodeRewriteKey, createRewritePath } from './../src/utils'

const colors = require('colors')
const fs = require('fs')
const path = require('path')
const pathToRegexp = require('path-to-regexp')

// load CLI args
const [, , configPath = 'rewrites.config.js', configParams = {}] = process.argv

// load runtime config
const cfgRuntime = require(path.join(process.cwd(), configPath)) || configParams

// create final config
const cfgDefault = {
  locales: [],
  defaultLocale: '',
  defaultSuffix: '',
  dirRoots: 'roots',
  dirPages: 'pages',
  staticRoots: ['api', '_app', '_document', '_error', '404'],
  extRoots: '.tsx',
  rewrites: [],
}

// create main dir path
const mainDir = path.dirname(path.join(process.cwd(), configPath))

/**
 * Creates file path relatively to configuration file directory
 * @param string filePath
 */
function getFilePath(filePath: string) {
  return path.join(mainDir, filePath)
}

/**
 * Create file in given path and writes given content into it
 * @param string path
 * @param string content
 */
function saveFile(filePath: string, content: string) {
  makeDirectory(filePath)
  fs.writeFileSync(filePath, content)
}

/**
 * Create file in given path and writes given content into it
 * @param string path
 * @param string encoding
 * @returns string
 */
function readFile(path: string, encoding: BufferEncoding = 'utf8') {
  if (!isFile(path)) return ''
  return fs.readFileSync(path).toString(encoding)
}

/**
 * Copies file from `from` to `to`
 * @param string from
 * @param string to
 */
function copyFile(from: string, to: string) {
  makeDirectory(to)
  fs.copyFileSync(from, to)
}

/**
 * Indicates if path is file
 * @param string path
 */
function isFile(path: string) {
  if (!fs.existsSync(path)) return false
  return fs.statSync(path).isFile()
}

/**
 * Copies directory from `from` to `to`
 * @param string from
 * @param string to
 */
function copyDirectory(from: string, to: string) {
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
function makeDirectory(dirPath: string) {
  dirPath = path.dirname(dirPath)

  if (fs.existsSync(dirPath)) return
  fs.mkdirSync(dirPath, { recursive: true })
}

/**
 * Removes given directory recursively
 * @param string path
 */
function removeDirectory(dir: string) {
  if (!fs.existsSync(dir)) return
  fs.rmdirSync(dir, { recursive: true })
}

/**
 * Indicates if path is directory
 * @param string path
 */
function isDirectory(path: string) {
  if (!fs.existsSync(path)) return false
  return fs.statSync(path).isDirectory()
}

/**
 * Create rewrite for given page
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
function rewrite(page: RewritePage, params = {}): [string, string | undefined] {
  const pageHref = createRewritePath(page.path, page.locale, page.suffix)
  const pageAs =
    page.alias && createRewritePath(page.alias, page.locale, page.suffix)

  const compileHref = pathToRegexp.compile(pageHref)
  const compileAs = pageAs && pathToRegexp.compile(pageAs)

  const rHref = compileHref({ ...params, locale: page.locale })
  const rAs = compileAs && compileAs({ ...params, locale: page.locale })

  return [rHref, rAs || undefined]
}

function run() {
  console.log(colors.yellow('rewrite'), '- generating next-i18n-rewrites ...')

  // create builder config
  const cfg: Config = { ...cfgDefault, ...cfgRuntime }

  // ensure pages directory is clean before build
  removeDirectory(cfg.dirPages)

  // create rewrites table
  const rules: RewriteRule[] = []
  const meta: RewriteMeta[] = []

  // create pages for each rewrite
  cfg.rewrites.forEach((r) => {
    const rootPath = getFilePath(
      path.format({
        dir: cfg.dirRoots,
        name: r.root,
        ext: cfg.extRoots,
      })
    )

    // create page template for each root
    const pageContent = readFile(rootPath)

    // push rewrite meta data to meta table
    r.metaData &&
      Object.keys(r.metaData).length &&
      meta.push({
        key: r.root,
        data: r.metaData,
      })

    // create page file for each root's rewrite
    pageContent &&
      cfg.locales.forEach((l) => {
        // find rewrite param based on locale
        let page = r.pages.find((p) => p.locale === l || p.locale === '*')

        // warn about missing rewrite rule
        if (!page) {
          console.log(
            colors.red('warn'),
            `- rewrite rule for`,
            colors.red(`${l}:${r.root}`),
            'is missing!'
          )
        }

        // make sure all page rewrite params are set
        const pageRewrite: RewritePage = {
          locale: l,
          path: page?.path || r.root,
          alias: page?.alias || '',
          suffix: page?.suffix ?? cfg.defaultSuffix,
        }

        const ruleKey = encodeRewriteKey(r.root, l)

        // create page rewrite
        const [href, as] = rewrite(pageRewrite, r.params)

        // push new rewrite rule to rewrites table
        rules.push({
          key: ruleKey,
          href,
          as,
        })

        // push rewrite meta data to meta table
        page?.metaData &&
          Object.keys(page.metaData).length &&
          meta.push({
            key: ruleKey,
            data: page?.metaData,
          })

        const pagePath = getFilePath(
          path.format({
            dir: cfg.dirPages,
            name: href,
            ext: cfg.extRoots,
          })
        )

        saveFile(pagePath, pageContent)
      })
  })

  let rewritesContent = ''

  rewritesContent += `module.exports.defaultLocale = "${cfg.defaultLocale}" \n`
  rewritesContent += `module.exports.locales = ${JSON.stringify(
    cfg.locales
  )} \n`
  rewritesContent += `module.exports.rules = ${JSON.stringify(rules)} \n`
  rewritesContent += `module.exports.meta = ${JSON.stringify(meta)} \n`

  saveFile(`${mainDir}/rewrites.js`, rewritesContent)

  // keep next.js specific files / dirs as they are
  // and just copy them to pages directory
  cfg.staticRoots.forEach((staticPath) => {
    const dir = getFilePath(
      path.format({
        dir: cfg.dirRoots,
        name: staticPath,
      })
    )

    if (isDirectory(dir)) {
      copyDirectory(dir, dir.replace(cfg.dirRoots, cfg.dirPages))
      return
    }

    const file = getFilePath(
      path.format({
        dir: cfg.dirRoots,
        name: staticPath,
        ext: cfg.extRoots,
      })
    )

    if (isFile(file)) {
      copyFile(file, file.replace(cfg.dirRoots, cfg.dirPages))
      return
    }
  })
}

// run async generator
run()
