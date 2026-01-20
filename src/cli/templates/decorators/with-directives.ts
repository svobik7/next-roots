import { type CompileFn, type DecoratorParams } from '../tpl-utils'

function isDirectiveLine(line: string) {
  const trimmed = line.trim()

  // Match `'use xyz'` or `"use xyz"` with optional trailing semicolon
  return /^(['"])use\s+[a-zA-Z0-9_-]+\1;?$/.test(trimmed)
}

function extractDirectivePrologue(input: string) {
  const lines = input.split('\n')
  const directives: string[] = []
  let started = false

  for (const rawLine of lines) {
    const line = rawLine

    const trimmed = line.trim()
    const isBlank = trimmed === ''
    const isComment = trimmed.startsWith('//')

    if (!started) {
      if (isBlank || isComment) {
        // ignore leading whitespace/comments – they would break directive prologues anyway
        continue
      }

      if (isDirectiveLine(line)) {
        started = true
        directives.push(trimmed.replace(/;$/, ''))
        continue
      }

      // first non-blank, non-comment, non-directive line -> no directive prologue
      break
    }

    // we are inside a directive prologue
    if (isDirectiveLine(line)) {
      directives.push(trimmed.replace(/;$/, ''))
      continue
    }

    if (isBlank || isComment) {
      // allow comments/blank lines between directives, but do not keep them
      continue
    }

    // first real statement after directives -> end of prologue
    break
  }

  if (!directives.length) {
    return ''
  }

  return `${directives.join('\n')}\n\n`
}

export function withDirectivesDecoratorFactory(
  params: DecoratorParams
): CompileFn {
  const prologue = extractDirectivePrologue(params.getOriginContents())

  if (!prologue) {
    return (input: string) => input
  }

  return (input: string) => {
    const withoutLeadingWhitespace = input.replace(/^\s*/, '')
    return `${prologue}${withoutLeadingWhitespace}`
  }
}
