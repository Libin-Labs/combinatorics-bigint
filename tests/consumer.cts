import * as api from '@lp-labs/combinatorics-bigint';
const options: api.CombinatoricsOptions = { maxIterations: 20, maxDigits: 20 };
const f: bigint = api.factorial(10, options);
api.binomial(10, 3);
api.permutations(10, 3);
void f;
// @ts-expect-error Invalid API input must be rejected.
api.factorial(10n);
