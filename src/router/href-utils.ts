import { compile } from 'path-to-regexp'

/**
 * Puts given params to their appropriate places in given href
 * @param {string} href - The href template
 * @param {Record<string, any>} params - The parameters to insert into href
 * @returns {string} - The compiled href
 */
export function compileHref(href: string, params: Record<string, any>): string {
  let compiledHref = ''
  try {
    const getHref = compile(href, {
      encode: encodeURIComponent,
    })
    compiledHref = getHref(params)
  } catch {
    compiledHref = href
  }
  return compiledHref
}

/**
 * Removes duplicated or trailing slashes from given href and puts the slash at the beginning
 * @param {...string[]} hrefSegments - Segments of the href
 * @returns {string} - The formatted href
 */
export function formatHref(...hrefSegments: string[]): string {
  const href = hrefSegments
    .join('/')
    .replace(/\/\/+/g, '/')
    .replace(/\/$/, '')
    .replaceAll('%2F', '/')
  return href.startsWith('/') ? href : `/${href}`
}
