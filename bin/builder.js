#!/usr/bin/env node
const FS = require('fs')
const PATH = require('path')
const ENGINE = require('../dist')

// load CLI args
const [, , configPath = 'rewrites.config.js', configParams = {}] = process.argv

// load runtime config
const cfgRuntime = require(PATH.join(process.cwd(), configPath)) || configParams

// create final config
const cfgDefault = {
  locales: [],
  defaultLocale: '',
  defaultSuffix: '',
  dirRoots: 'roots',
  dirPages: 'pages',
  staticRoots: ['api', '_app', '_document', '_error', 'index'],
  extRoots: '.tsx',
  rewrites: [],
}

/**
 * Creates file path relatively to configuration file directory
 * @param string filePath
 */
function getFilePath(filePath) {
  const dirPath = PATH.dirname(PATH.join(process.cwd(), configPath))
  return PATH.join(dirPath, filePath)
}

/**
 * Create file in given path and writes given content into it
 * @param string path
 * @param string content
 */
function saveFile(filePath, content) {
  makeDirectory(filePath)
  FS.writeFileSync(filePath, content)
}

/**
 * Create file in given path and writes given content into it
 * @param string path
 * @param string encoding
 * @returns string
 */
function readFile(path, encoding = 'UTF-8') {
  return FS.readFileSync(path).toString(encoding)
}

/**
 * Copies file from `from` to `to`
 * @param string from
 * @param string to
 */
function copyFile(from, to) {
  makeDirectory(to)
  FS.copyFileSync(from, to)
}

/**
 * Indicates if path is file
 * @param string path
 */
function isFile(path) {
  if (!FS.existsSync(path)) return false
  return FS.statSync(path).isFile()
}

/**
 * Copies directory from `from` to `to`
 * @param string from
 * @param string to
 */
function copyDirectory(from, to) {
  if (!isDirectory(from)) return

  makeDirectory(to)

  const files = FS.readdirSync(from)

  files.forEach((currentPath) => {
    const currentFrom = PATH.join(from, currentPath)
    const currentTo = PATH.join(to, currentPath)

    isDirectory(currentFrom)
      ? copyDirectory(currentFrom, currentTo)
      : copyFile(currentFrom, currentTo)
  })
}

/**
 * Create directory in given path recursively
 * @param string path
 */
function makeDirectory(path) {
  const dirPath = PATH.dirname(path)

  if (FS.existsSync(dirPath)) return
  FS.mkdirSync(dirPath, { recursive: true })
}

/**
 * Removes given directory recursively
 * @param string path
 */
function removeDirectory(dir) {
  if (!FS.existsSync(dir)) return
  FS.rmdirSync(dir, { recursive: true })
}

/**
 * Indicates if path is directory
 * @param string path
 */
function isDirectory(path) {
  if (!FS.existsSync(path)) return false
  return FS.statSync(path).isDirectory()
}

/**
 * Parses configuration rewrites & ensure all required params are set
 * @param object cfg
 */
function parseRewrites(cfg) {
  const {
    locales = cfgDefault.locales,
    rewrites = cfgDefault.rewrites,
    defaultSuffix = cfgDefault.defaultSuffix,
  } = cfg

  return rewrites.map((r) => ({
    ...r,
    params: locales.map((l) => {
      // find rewrite param based on locale
      const p = r.params.find((p) => p.locale === l || p.locale === '*') || {}

      return {
        locale: l,
        path: r.root,
        suffix: defaultSuffix,
        ...p,
      }
    }),
  }))
}

/**
 * Indicates if given data (file content) has given method
 * @param string data
 * @param string name
 */
function hasMethod(data, name) {
  return data.match(
    new RegExp(`export (const|var|let|async function|function) ${name}`)
  )
}

/**
 * Creates page template which can be used to generate internationalized page content
 * @param string rootPath
 */
function createPageTemplate(rootPath) {
  const rootData = readFile(rootPath).replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')

  const hasGetStaticProps = hasMethod(rootData, 'getStaticProps')
  const hasGetStaticPaths = hasMethod(rootData, 'getStaticPaths')
  const hasGetServerSideProps = hasMethod(rootData, 'getServerSideProps')

  const hasSomeSpecialMethod =
    hasGetStaticProps || hasGetStaticPaths || hasGetServerSideProps

  return () => 'TEST CONTENT'
}

function run() {
  const {
    dirPages = cfgDefault.dirPages,
    dirRoots = cfgDefault.dirRoots,
    extRoots = cfgDefault.extRoots,
    staticRoots = cfgDefault.staticRoots,
  } = cfgRuntime

  console.log('generating next-rewrites pages')

  // ensure pages directory is clean before build
  removeDirectory(dirPages)

  // ensure all rewrites are valid before build
  const rewrites = parseRewrites(cfgRuntime)

  // create pages for each rewrite
  rewrites.forEach((r) => {
    const rootPath = getFilePath(
      PATH.format({
        dir: dirRoots,
        name: r.root,
        ext: extRoots,
      })
    )

    // create page template for each root
    const pageTemplate = createPageTemplate(rootPath)

    // create page file for each root's rewrite
    r.params.forEach((p) => {
      const pagePath = getFilePath(
        PATH.format({
          dir: dirPages,
          name: ENGINE.createRewritePath(p, r.token),
          ext: extRoots,
        })
      )

      saveFile(pagePath, pageTemplate(p.locale))

      console.log('Linked: ', pagePath, '\n')
    })

    // keep next.js specific files / dirs as they are
    // and just copy them to pages directory
    staticRoots.forEach((staticPath) => {
      const dir = getFilePath(
        PATH.format({
          dir: dirRoots,
          name: staticPath,
        })
      )

      if (isDirectory(dir)) {
        copyDirectory(dir, dir.replace(dirRoots, dirPages))
        return
      }

      file = getFilePath(
        PATH.format({
          dir: dirRoots,
          name: staticPath,
          ext: extRoots,
        })
      )

      if (isFile(file)) {
        copyFile(file, file.replace(dirRoots, dirPages))
        return
      }

      // console.log('Ignored File:', file, '\n')
      // console.log('Ignored Dir:', dir, '\n')
    })
  })
}

// run async generator
run()
