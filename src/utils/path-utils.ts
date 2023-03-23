import path from 'path'

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1)
}


export function alphanumeric(pathName: string): string {
  return pathName.replace(/[^a-zA-Z0-9]/gi, '')
}

export function trimExt(pathName: string): string {
  return pathName.replace(/\.[^/.]+$/, "")
}


export function trimLeadingSlash(pathName: string): string {
  return pathName.startsWith('/') ? pathName.slice(1) : pathName
}

export function withUnixSeparators(pathName: string) {
  pathName = pathName.replaceAll(path.sep, '/')
  pathName = pathName.replace(/\/\/+/g, '/')
  pathName = pathName.replace(/\/$/, '')

  return pathName
}

export function joinSegments(...segments: string[]) {
  return segments.join('/')
}

type RootPath = `/${string}`

export function asRootPath(...input: string[]): RootPath {
  let pathName = joinSegments(...input)

  pathName = withUnixSeparators(pathName)
  pathName = pathName.startsWith('/') ? pathName : `/${pathName}`

  return pathName as RootPath
}
