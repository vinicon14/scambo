# Integração Mercado Pago PIX — Bebida de Estrada

## Decisão

Usar uma única conta Mercado Pago central da plataforma para receber os aportes das lanchonetes. A integração usará a Orders API em modo automático, com QR Code e Pix Copia e Cola retornados pelo backend.

## Fluxo

1. O estabelecimento informa o valor do aporte.
2. O backend cria uma Order PIX no Mercado Pago com `external_reference` igual ao depósito interno e `X-Idempotency-Key` único.
3. O Site mostra QR Code, Pix Copia e Cola e link de instruções.
4. O Mercado Pago notifica `/api/mercadopago/webhook`.
5. O Site valida `x-signature` com `x-request-id` e `data.id`, consulta a Order diretamente e só credita a carteira quando o pagamento estiver processado/acreditado.
6. Repetições da mesma Order são ignoradas pela referência única do depósito e do lançamento financeiro.

## Secrets

- `MERCADOPAGO_ACCESS_TOKEN`: token privado da aplicação Mercado Pago, nunca enviado ao navegador.
- `MERCADOPAGO_WEBHOOK_SECRET`: chave secreta da configuração de Webhooks.
- `MERCADOPAGO_WEBHOOK_URL`: URL pública HTTPS do endpoint, usada na configuração operacional.

Sem esses secrets o Site deve informar que a integração ainda não está configurada e não pode marcar nenhum pagamento como pago.

## Estados

Orders pendentes permanecem como `pending`. Orders processadas/acreditadas viram `paid`; rejeitadas, canceladas ou expiradas viram o estado correspondente sem crédito. O webhook responde erro para assinatura inválida ou Order desconhecida.

## Segurança

O webhook valida a assinatura HMAC do Mercado Pago antes de consultar ou alterar o banco. O valor creditado vem da Order consultada e é comparado ao depósito interno; o corpo da notificação não define valor nem estabelecimento.
