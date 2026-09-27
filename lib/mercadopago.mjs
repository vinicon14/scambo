function cents(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) : null;
}

export function isPaidOrder(order) {
  const payment = order?.transactions?.payments?.[0];
  return order?.status === 'processed' && payment?.status === 'processed' && payment?.status_detail === 'accredited';
}

export function extractPixOrder(order) {
  const payment = order?.transactions?.payments?.[0] || {};
  const method = payment.payment_method || {};
  const status = isPaidOrder(order) ? 'paid' : ['cancelled', 'canceled', 'expired', 'rejected'].includes(order?.status) ? 'failed' : 'pending';
  return {
    providerReference: String(order?.id || ''),
    externalReference: String(order?.external_reference || ''),
    amountCents: cents(order?.total_amount ?? payment.amount),
    qrCode: method.qr_code_base64 ? `data:image/png;base64,${method.qr_code_base64}` : null,
    copyPaste: method.qr_code || null,
    ticketUrl: method.ticket_url || null,
    status,
  };
}

function parseSignature(value) {
  return Object.fromEntries(String(value || '').split(',').map((part) => part.trim().split('=').map((item) => item.trim())).filter(([key, val]) => key && val));
}

function equalBytes(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a[i] ^ b[i];
  return result === 0;
}

export async function verifyWebhookSignature(xSignature, xRequestId, dataId, secret, cryptoImpl = globalThis.crypto) {
  const parsed = parseSignature(xSignature);
  if (!parsed.ts || !parsed.v1 || !xRequestId || !dataId || !secret || !cryptoImpl?.subtle) return false;
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${parsed.ts};`;
  const key = await cryptoImpl.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = new Uint8Array(await cryptoImpl.subtle.sign('HMAC', key, new TextEncoder().encode(manifest)));
  const expected = new Uint8Array(parsed.v1.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) || []);
  return equalBytes(digest, expected);
}
