# @lp-labs/combinatorics-bigint

Exact bigint factorial, binomial coefficients and ordered permutations under digit and iteration budgets.

Standalone Node.js >=18 package. ESM and CommonJS with separate strict TypeScript declarations. No runtime, peer or sibling dependencies.

## Install

```sh
npm install @lp-labs/combinatorics-bigint
```

## Example

```js
import { factorial, binomial, permutations } from '@lp-labs/combinatorics-bigint';
console.log(factorial(10)); // 3628800n
console.log(binomial(52, 5)); // 2598960n
console.log(permutations(5, 2, { maxIterations: 2, maxDigits: 3 })); // 20n
```

## API, customization, numerical behavior and limits

factorial(n), binomial(n,k), permutations(n,k) accept safe integer numbers in 0..1000000 and require k<=n; values are exact bigint, not approximate numbers. Empty products are 1n. CombinatoricsOptions defaults maxIterations=10000 and maxDigits=10000, each bounded: iterations integer 0..10000, digits integer 1..10000. The iteration budget is checked before work; factorial uses n iterations, permutations k, binomial min(k,n-k). Binomial uses the exact multiplicative recurrence with division each step, exploiting symmetry; factorial and permutations use product recurrence. After each step decimal digits are checked and exceeding the budget raises RangeError; no partial result is returned. Bigint intermediates may exceed maxDigits by at most about 6 digits due to the bounded multiplier. Argument and budget failures raise RangeError. Work is O(steps) bigint arithmetic operations plus decimal conversions (not constant-time arithmetic); peak storage is O(maxDigits+6) digits. These caps prevent unbounded loops but large requested budgets can still block a synchronous event loop: use smaller options or run externally in a worker. No async cancellation, callbacks, crypto or resource-isolation guarantees.

## Full declarations

```ts
export interface CombinatoricsOptions {
  maxIterations?: number;
  maxDigits?: number;
}
export declare function factorial(n: number, options?: CombinatoricsOptions): bigint;
export declare function binomial(n: number, k: number, options?: CombinatoricsOptions): bigint;
export declare function permutations(n: number, k: number, options?: CombinatoricsOptions): bigint;
```

## Development

```sh
npm ci --offline --no-audit --no-fund
npm run build
npm run typecheck
npm test
npm run format:check
```

Tests use Node's built-in runner and include independent or analytic reference cases. No runtime global browser access, I/O or hidden dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
