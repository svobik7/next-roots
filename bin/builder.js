#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const pathToRegexp = require('path-to-regexp')
const colors = require('colors')

const utils = require('../dist/utils')

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
function getFilePath(filePath) {
  return path.join(mainDir, filePath)
}

/**
 * Create file in given path and writes given content into it
 * @param string path
 * @param string content
 */
function saveFile(filePath, content) {
  makeDirectory(filePath)
  fs.writeFileSync(filePath, content)
}

/**
 * Create file in given path and writes given content into it
 * @param string path
 * @param string encoding
 * @returns string
 */
function readFile(path, encoding = 'UTF-8') {
  return fs.readFileSync(path).toString(encoding)
}

/**
 * Copies file from `from` to `to`
 * @param string from
 * @param string to
 */
function copyFile(from, to) {
  makeDirectory(to)
  fs.copyFileSync(from, to)
}

/**
 * Indicates if path is file
 * @param string path
 */
function isFile(path) {
  if (!fs.existsSync(path)) return false
  return fs.statSync(path).isFile()
}

/**
 * Copies directory from `from` to `to`
 * @param string from
 * @param string to
 */
function copyDirectory(from, to) {
  if (!isDirectory(from)) return

  makeDirectory(to)

  const files = fs.readdirSync(from)

  files.forEach((currentPath) => {
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
function makeDirectory(dirPath) {
  dirPath = path.dirname(dirPath)

  if (fs.existsSync(dirPath)) return
  fs.mkdirSync(dirPath, { recursive: true })
}

/**
 * Removes given directory recursively
 * @param string path
 */
function removeDirectory(dir) {
  if (!fs.existsSync(dir)) return
  fs.rmdirSync(dir, { recursive: true })
}

/**
 * Indicates if path is directory
 * @param string path
 */
function isDirectory(path) {
  if (!fs.existsSync(path)) return false
  return fs.statSync(path).isDirectory()
}

/**
 * Indicates if given value is either `null` or `undefined`
 * @param any value
 */
function isNullish(value) {
  return value === undefined || value === null
}

/**
 * Indicates if given data (file content) has given method
 * @param string data
 * @param string name
 */
// function hasMethod(data, name) {
//   return data.match(
//     new RegExp(`export (const|var|let|async function|function) ${name}`)
//   )
// }

/**
 * Creates page template which can be used to generate internationalized page content
 * @param string rootPath
 */
function createPageTemplate(rootPath) {
  // const rootData = readFile(rootPath).replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')

  // const hasGetStaticProps = hasMethod(rootData, 'getStaticProps')
  // const hasGetStaticPaths = hasMethod(rootData, 'getStaticPaths')
  // const hasGetServerSideProps = hasMethod(rootData, 'getServerSideProps')

  // const hasSomeSpecialMethod =
  //   hasGetStaticProps || hasGetStaticPaths || hasGetServerSideProps

  return () => readFile(rootPath)
}

/**
 * Parses configuration rewrites & ensure all required params are set
 * @param object cfg
 */
function parseRewrites(cfg, debug = true) {
  const { locales, rewrites, defaultSuffix } = cfg

  return rewrites.map((r) => ({
    ...r,
    pages: locales.map((l) => {
      // find rewrite param based on locale
      let page = r.pages.find((p) => p.locale === l || p.locale === '*')

      // create no rewrite for current locale when page is undefined
      if (!page && debug) {
        console.log(
          colors.red('warn'),
          `- rewrite rule for`,
          colors.red(`${l}:${r.root}`),
          'is missing!'
        )
      }

      const suffix = page && page.suffix

      return {
        locale: l,
        path: page ? page.path : r.root,
        suffix: !isNullish(suffix) ? suffix : defaultSuffix,
      }
    }),
  }))
}

function run() {
  const {
    dirPages = cfgDefault.dirPages,
    dirRoots = cfgDefault.dirRoots,
    extRoots = cfgDefault.extRoots,
    staticRoots = cfgDefault.staticRoots,
  } = cfgRuntime

  console.log(colors.yellow('rewrite'), '- generating next-i18n-rewrites ...')

  // ensure pages directory is clean before build
  removeDirectory(dirPages)

  // ensure all rewrites are valid before build
  const rewrites = parseRewrites({ ...cfgDefault, ...cfgRuntime }, true)

  // create rewrites table
  const table = []

  // create pages for each rewrite
  rewrites.forEach((r) => {
    const rootPath = getFilePath(
      path.format({
        dir: dirRoots,
        name: r.root,
        ext: extRoots,
      })
    )

    // create page template for each root
    const pageTemplate = createPageTemplate(rootPath)

    // create page file for each root's rewrite
    r.pages.forEach((p) => {
      const compileHref = pathToRegexp.compile(utils.createPagePath(p))

      const href = compileHref(r.params)
      
      table.push({
        key: `${p.locale}/${r.root}`,
        href: `${href}`,
        // alias: `${alias}`,
      })

      const pagePath = getFilePath(
        path.format({
          dir: dirPages,
          name: href,
          ext: extRoots,
        })
      )

      saveFile(pagePath, pageTemplate(p.locale))
    })
  })

  const tablePath = `${mainDir}/rewrites.table.js`
  saveFile(tablePath, `module.exports = ${JSON.stringify(table)}`)

  // keep next.js specific files / dirs as they are
  // and just copy them to pages directory
  staticRoots.forEach((staticPath) => {
    const dir = getFilePath(
      path.format({
        dir: dirRoots,
        name: staticPath,
      })
    )

    if (isDirectory(dir)) {
      copyDirectory(dir, dir.replace(dirRoots, dirPages))
      return
    }

    file = getFilePath(
      path.format({
        dir: dirRoots,
        name: staticPath,
        ext: extRoots,
      })
    )

    if (isFile(file)) {
      copyFile(file, file.replace(dirRoots, dirPages))
      return
    }
  })
}

// run async generator
run()
