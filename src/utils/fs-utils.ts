import {
  copyFileSync,
  existsSync,
  mkdirSync,
  moveSync,
  readdirSync,
  readFileSync,
  removeSync,
  statSync,
  writeFileSync,
} from 'fs-extra'
import path from 'path'

/**
 * Create file in given path and writes given content into it
 */
export function writeFile(filePath: string, content: string): void {
  makeDir(path.dirname(filePath))
  writeFileSync(filePath, content)
}

/**
 * Create file in given path and writes given content into it
 * @returns string
 */
export function readFile(
  path: string,
  encoding: BufferEncoding = 'utf8'
): string {
  if (!isFile(path)) return ''
  return readFileSync(path).toString(encoding)
}

/**
 * Copies file from `from` to `to`
 */
export function copyFile(from: string, to: string): void {
  if (from !== to) {
    makeDir(path.dirname(to))
    copyFileSync(from, to)
  }
}

/**
 * Removes given file recursively
 */
export function removeFile(filePath: string): void {
  if (!isFile(filePath)) return
  removeSync(filePath)
}

/**
 * Indicates if filePath is file
 */
export function isFile(filePath: string): boolean {
  if (!existsSync(filePath)) return false
  return statSync(filePath).isFile()
}

/**
 * Copies directory from `from` to `to` recursively
 */
export function moveDir(from: string, to: string): void {
  if (from !== to && isDirectory(from)) {
    moveSync(from, to)
  }
}

/**
 * Copies directory from `from` to `to` recursively
 */
export function copyDir(from: string, to: string): void {
  if (from !== to && isDirectory(from)) {
    makeDir(to)

    const files = readdirSync(from)

    files.forEach((currentPath: string) => {
      const currentFrom = path.join(from, currentPath)
      const currentTo = path.join(to, currentPath)

      isDirectory(currentFrom)
        ? copyDir(currentFrom, currentTo)
        : copyFile(currentFrom, currentTo)
    })
  }
}

/**
 * Creates directory in given dirPath recursively
 */
export function makeDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Removes given file recursively
 */
export function removeDir(dirPath: string): void {
  if (!isDirectory(dirPath)) return
  removeSync(dirPath)
}

/**
 * Indicates if dirPath is directory
 */
export function isDirectory(dirPath: string): boolean {
  if (!existsSync(dirPath)) return false
  return statSync(dirPath).isDirectory()
}
