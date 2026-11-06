import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('known exact values and empty products', () => {
  assert.equal(api.factorial(0), 1n);
  assert.equal(api.factorial(10), 3628800n);
  assert.equal(api.binomial(52, 5), 2598960n);
  assert.equal(api.permutations(5, 2), 20n);
  assert.equal(api.binomial(0, 0), 1n);
  assert.equal(api.permutations(10, 0), 1n);
});
test('small subset enumeration oracle', () => {
  for (let n = 0; n <= 12; n++) {
    const counts = Array(n + 1).fill(0);
    for (let mask = 0; mask < 2 ** n; mask++) {
      let count = 0;
      for (let j = 0; j < n; j++) if (mask & (1 << j)) count++;
      counts[count]++;
    }
    for (let k = 0; k <= n; k++) {
      assert.equal(api.binomial(n, k), BigInt(counts[k]));
      assert.equal(api.binomial(n, k), api.binomial(n, n - k));
    }
  }
});
test('small ordered enumeration oracle', () => {
  const enumerate = (n, k, used = 0) => {
    if (!k) return 1n;
    let total = 0n;
    for (let i = 0; i < n; i++)
      if (!(used & (1 << i))) total += enumerate(n, k - 1, used | (1 << i));
    return total;
  };
  for (let n = 0; n <= 7; n++)
    for (let k = 0; k <= n; k++) assert.equal(api.permutations(n, k), enumerate(n, k));
});
test('iteration exact boundary and symmetric work', () => {
  assert.equal(api.factorial(3, { maxIterations: 3 }), 6n);
  assert.throws(() => api.factorial(3, { maxIterations: 2 }), RangeError);
  assert.equal(api.binomial(1000000, 999999, { maxIterations: 1 }), 1000000n);
  assert.equal(api.factorial(0, { maxIterations: 0 }), 1n);
  assert.throws(() => api.permutations(100, 5, { maxIterations: 4 }));
});
test('digit exact boundary', () => {
  assert.equal(api.factorial(3, { maxDigits: 1 }), 6n);
  assert.throws(() => api.factorial(4, { maxDigits: 1 }), RangeError);
  assert.equal(api.binomial(100, 1, { maxDigits: 3 }), 100n);
  assert.throws(() => api.binomial(100, 1, { maxDigits: 2 }));
});
test('argument and budget validation', () => {
  for (const v of [-1, 1.5, NaN, Infinity, 1000001]) assert.throws(() => api.factorial(v));
  assert.throws(() => api.binomial(2, 3));
  assert.throws(() => api.permutations(2, -1));
  for (const o of [
    { maxDigits: 0 },
    { maxDigits: 10001 },
    { maxIterations: -1 },
    { maxIterations: 10001 },
    { maxIterations: NaN },
  ])
    assert.throws(() => api.factorial(0, o));
});
