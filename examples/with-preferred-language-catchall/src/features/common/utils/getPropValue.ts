export function getPropValue(
  data: unknown,
  path: string | string[],
  defaultValue?: any
) {
  const propPath = Array.isArray(path) ? path : path.split('.')
  const propValue = propPath.reduce((value, key) => value?.[key], data as any)

  return propValue === undefined ? defaultValue : propValue
}
