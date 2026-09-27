import assert from 'node:assert/strict';
import {
  TOKEN_CONTRIBUTION_CENTS,
  toCents,
  isEligibleReviewCount,
  pickWinner,
} from '../lib/finance.mjs';

assert.equal(TOKEN_CONTRIBUTION_CENTS, 50);
assert.equal(toCents(12.34), 1234);
assert.equal(isEligibleReviewCount(99), false);
assert.equal(isEligibleReviewCount(100), true);
assert.equal(pickWinner([
  { businessId: 'a', average: 4.9, reviewCount: 100, reachedMinimumAt: '2026-09-20' },
  { businessId: 'b', average: 4.9, reviewCount: 101, reachedMinimumAt: '2026-09-21' },
]), 'b');
assert.equal(pickWinner([
  { businessId: 'a', average: 4.9, reviewCount: 100, reachedMinimumAt: '2026-09-20' },
  { businessId: 'b', average: 4.9, reviewCount: 100, reachedMinimumAt: '2026-09-21' },
]), 'a');
console.log('finance tests passed');
