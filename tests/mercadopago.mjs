import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { extractPixOrder, isPaidOrder, verifyWebhookSignature } from '../lib/mercadopago.mjs';

const order = {
  id: 'ORD-123',
  external_reference: 'deposit-123',
  total_amount: '50.00',
  status: 'processed',
  transactions: { payments: [{ status: 'processed', status_detail: 'accredited', amount: '50.00', payment_method: { qr_code: 'pix-code', qr_code_base64: 'cGl4', ticket_url: 'https://mercado.test/ticket' } }] },
};
const extracted = extractPixOrder(order);
assert.deepEqual(extracted, { providerReference: 'ORD-123', externalReference: 'deposit-123', amountCents: 5000, qrCode: 'data:image/png;base64,cGl4', copyPaste: 'pix-code', ticketUrl: 'https://mercado.test/ticket', status: 'paid' });
assert.equal(isPaidOrder(order), true);
assert.equal(isPaidOrder({ ...order, status: 'action_required' }), false);

const signature = 'ts=1700000000000,v1=PLACEHOLDER';
assert.equal(await verifyWebhookSignature(signature, 'request-1', 'ORD-123', 'secret', webcrypto), false);
const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode('secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
const digest = new Uint8Array(await webcrypto.subtle.sign('HMAC', key, new TextEncoder().encode('id:ORD-123;request-id:request-1;ts:1700000000000;')));
const valid = `ts=1700000000000,v1=${Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
assert.equal(await verifyWebhookSignature(valid, 'request-1', 'ORD-123', 'secret', webcrypto), true);
console.log('mercadopago tests passed');
