/**
 * Next.js dynamic segment names are folder names, so they may contain
 * characters outside `\w` (for example `[product-id]`). Slashes and brackets
 * terminate the segment.
 */
const PARAM_NAME = '[^/\\[\\]]+'

/** `[[...param]]` */
const OPTIONAL_CATCH_ALL_SEGMENT = new RegExp(
  `\\[\\[\\.\\.\\.${PARAM_NAME}\\]\\]`
)

/** `[[param]]`, but not `[[...param]]` */
const OPTIONAL_SEGMENT = new RegExp(`\\[\\[(?!\\.\\.\\.)${PARAM_NAME}\\]\\]`)

/** `[...param]` */
const CATCH_ALL_SEGMENT = new RegExp(`\\[\\.\\.\\.${PARAM_NAME}\\]`)

/** `[param]`, but not `[...param]` */
const DYNAMIC_SEGMENT = new RegExp(`\\[(?!\\.\\.\\.)${PARAM_NAME}\\]`)

/**
 * path-to-regexp v8 accepts JavaScript identifiers as parameter names and
 * requires every other name to be a double-quoted JSON string (`:"product-id"`).
 * Mirrors `ID` in path-to-regexp.
 */
const IDENTIFIER = /^[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*$/u

export function formatParamName(name: string) {
  return IDENTIFIER.test(name) ? name : JSON.stringify(name)
}

export function hasOptionalCatchAllSegment(value: string) {
  return OPTIONAL_CATCH_ALL_SEGMENT.test(value)
}

export function hasOptionalSegment(value: string) {
  return OPTIONAL_SEGMENT.test(value)
}

export function hasCatchAllSegment(value: string) {
  return CATCH_ALL_SEGMENT.test(value)
}

export function hasDynamicSegment(value: string) {
  return DYNAMIC_SEGMENT.test(value)
}

export function formatDynamicSegments(input: string) {
  return input
    .replace(
      new RegExp(`\\/\\[\\[\\.\\.\\.(${PARAM_NAME})\\]\\]`, 'g'),
      (_, name: string) => `{/*${formatParamName(name)}}`
    ) // /[[...slug]] -> {/*slug}
    .replace(
      new RegExp(`\\/\\[\\[(?!\\.\\.\\.)(${PARAM_NAME})\\]\\]`, 'g'),
      (_, name: string) => `{/:${formatParamName(name)}}`
    ) // /[[slug]] -> {/:slug}
    .replace(
      new RegExp(`\\/\\[\\.\\.\\.(${PARAM_NAME})\\]`, 'g'),
      (_, name: string) => `/*${formatParamName(name)}`
    ) // /[...slug] -> /*slug
    .replace(
      new RegExp(`\\/\\[(?!\\.\\.\\.)(${PARAM_NAME})\\]`, 'g'),
      (_, name: string) => `/:${formatParamName(name)}`
    ) // /[slug] -> /:slug
}
