import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs'
import { removeSync } from 'fs-extra'
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
  if (isFile(path)) {
    return readFileSync(path).toString(encoding)
  }

  return ''
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
 * Indicates if filePath is file
 */
export function isFile(filePath: string): boolean {
  if (existsSync(filePath)) {
    return statSync(filePath).isFile()
  }

  return false
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
  if (isDirectory(dirPath)) {
    removeSync(dirPath)
  }
}

/**
 * Indicates if dirPath is directory
 */
export function isDirectory(dirPath: string): boolean {
  if (!existsSync(dirPath)) return false
  return statSync(dirPath).isDirectory()
}
