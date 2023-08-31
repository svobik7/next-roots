import type { Middleware } from '~/types'
import type { CompileParams } from './tpl-utils'
import { compileTemplateFactory, getPatternsFromNames } from './tpl-utils'

export const PATTERNS = getPatternsFromNames(
  'schema',
  'imports',
  'middleware_map'
)

export const tpl = `
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

${PATTERNS.imports}

export type Middleware = {
  href: string
  path: string
  originName: string
}

const schema: Middleware[] = ${PATTERNS.schema};

const getMiddleware = (name: string) => {
  switch (name) {
    ${PATTERNS.middleware_map}
    default:
      return;
  }
};

const getMiddlewares = (pathname: string) => {
  const _middlewares: Middleware[] = [];
  for (const _middleware of schema) {
      if (_middleware.href === pathname) _middlewares.push(_middleware);
  }
  const segments = pathname.split('/');
  for (let i = segments.length - 1; i > 0; i--) {
      const href = segments.slice(0, i).join('/');
      for (const _middleware of schema) {
          if (_middleware.href === href) _middlewares.push(_middleware);
      }
  }
  return _middlewares;
};



export async function middleware(
  request: NextRequest,
  response: NextResponse,
): Promise<NextResponse> {
  let _response = response;
  const middlewares = getMiddlewares(request.nextUrl.pathname);
  if (middlewares.length <= 0) return _response;
  middlewares.reverse();
  for (const _middleware of middlewares) {
      if (!_middleware) continue;
      try {
          const middlewareNext = getMiddleware(_middleware.originName);
          if (!middlewareNext) continue;
          let responseNext = await middlewareNext(request, _response);
          if (
              'headers' in responseNext &&
              'location' in responseNext.headers
          ) {
              return responseNext;
          }
          _response = responseNext;
      } catch (error) {
          console.log('error', error);
      }
      // if (response) return response;
  }
  return _response;
}


`

function getCompileParams(
  middlewares: Middleware[]
): CompileParams<typeof PATTERNS> {
  const imports: Record<string, string> = {}
  for (const _middleware of middlewares) {
    if (_middleware.originName in imports) continue
    imports[_middleware.originName] = _middleware.path
  }

  return {
    schema: JSON.stringify(middlewares),
    imports: Object.keys(imports)
      .map((name) => `import ${name} from '${imports[name]}'`)
      .join('\n'),
    middleware_map: Object.keys(imports)
      .map((name) => `case '${name}': return ${name}`)
      .join('\n'),
  }
}

export function compile(middlewares: Middleware[]) {
  const params = getCompileParams(middlewares)

  const compileTemplate = compileTemplateFactory()
  return compileTemplate(tpl, params)
}
