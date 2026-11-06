export interface CombinatoricsOptions {
  maxIterations?: number;
  maxDigits?: number;
}
function integer(n: number): void {
  if (!Number.isSafeInteger(n) || n < 0 || n > 1_000_000)
    throw new RangeError('Arguments must be integers 0..1000000.');
}
function budget(options: CombinatoricsOptions): { iterations: number; digits: number } {
  const iterations = options.maxIterations ?? 10000,
    digits = options.maxDigits ?? 10000;
  if (
    !Number.isInteger(iterations) ||
    iterations < 0 ||
    iterations > 10000 ||
    !Number.isInteger(digits) ||
    digits < 1 ||
    digits > 10000
  )
    throw new RangeError('Budgets: iterations 0..10000, digits 1..10000.');
  return { iterations, digits };
}
function calculate(n: number, k: number, choose: boolean, options: CombinatoricsOptions): bigint {
  integer(n);
  integer(k);
  if (k > n) throw new RangeError('k must not exceed n.');
  const limits = budget(options),
    steps = choose ? Math.min(k, n - k) : k;
  if (steps > limits.iterations) throw new RangeError('Iteration budget exceeded.');
  let value = 1n;
  for (let i = 1; i <= steps; i++) {
    value = (value * BigInt(n - steps + i)) / (choose ? BigInt(i) : 1n);
    if (value.toString().length > limits.digits) throw new RangeError('Digit budget exceeded.');
  }
  return value;
}
export function factorial(n: number, options: CombinatoricsOptions = {}): bigint {
  return calculate(n, n, false, options);
}
export function binomial(n: number, k: number, options: CombinatoricsOptions = {}): bigint {
  return calculate(n, k, true, options);
}
export function permutations(n: number, k: number, options: CombinatoricsOptions = {}): bigint {
  return calculate(n, k, false, options);
}
