type QueuedFn<T, U> = T extends void ? () => U : (arg: T) => U

export function queue<T, U = void>(...fns: Array<QueuedFn<T, U>>) {
  return (input: T): U[] => fns.map((fn) => fn(input))
}
