export const TOKEN_CONTRIBUTION_CENTS = 50;

export function toCents(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) throw new Error('Valor monetário inválido.');
  return Math.round(amount * 100);
}

export function isEligibleReviewCount(count) {
  return Number.isInteger(Number(count)) && Number(count) >= 100;
}

export function pickWinner(candidates) {
  return [...candidates]
    .filter((candidate) => isEligibleReviewCount(candidate.reviewCount))
    .sort((a, b) => Number(b.average) - Number(a.average)
      || Number(b.reviewCount) - Number(a.reviewCount)
      || String(a.reachedMinimumAt || '').localeCompare(String(b.reachedMinimumAt || ''))
      || String(a.businessId).localeCompare(String(b.businessId)))[0]?.businessId || null;
}
