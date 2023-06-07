type Fn<I = unknown, O = unknown> = (input: I) => O

// Unfortunately, no better solution found out there
// @see https://dev.to/nexxeln/implementing-the-pipe-operator-in-typescript-30ip
export function pipe<A, B>(fn1: (input: A) => B): Fn<any, B>
export function pipe<A, B, C>(
  fn1: (input: A) => B,
  fn2: (input: B) => C
): Fn<A, C>
export function pipe<A, B, C, D>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D
): Fn<A, D>
export function pipe<A, B, C, D, E>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E
): Fn<A, E>
export function pipe<A, B, C, D, E, F>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F
): Fn<A, F>

export function pipe(...fns: Fn[]): unknown {
  return (input: unknown) => fns.reduce((acc, fn) => fn(acc), input)
}
