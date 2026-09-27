# Bebida de Estrada

Aplicativo responsivo em português para campanhas de gastronomia na estrada.

## Implementado
- Mapa Leaflet/OpenStreetMap, busca, filtros, distância via geolocalização, detalhes e guia por estado/cidade.
- Contas de viajantes e estabelecimentos; senha PBKDF2 com salt, sessão HttpOnly e validação server-side.
- CPF derivado com segredo e único; CNPJ validado e único. CPF não é entregue às paradas.
- Aprovação administrativa, combos por campanha, fotos no armazenamento R2.
- Tokens únicos, lotes e QR Code, cancelamento e expiração no encerramento da campanha.
- Banco editável de 45 perguntas (27 sobre lanche e 18 sobre café); cada avaliação recebe 3 perguntas de lanche e 2 de café, com notas de 1 a 5. Perguntas ficam registradas como eram na avaliação. Transação atômica de voto/token, restrições únicas e ranking com 60% lanche e 40% café.
- Campanhas, pesos fixos 60/40, desempates, raio, ranking público, bloqueio de edição e fundo administrativo de premiação.
- Favoritos, visitas, auditoria, seed de 9 exemplos identificados e remoção administrativa.

## Tecnologia e operação
React, TypeScript e Vinext; banco Cloudflare D1 e imagens R2 provisionados pelo Sites. Esta edição usa infraestrutura integrada em vez do Supabase preferido no briefing. Não há dependência dos bancos Duelverse ou jccogumelos.

Ranking e contadores atualizam a cada 15 segundos e após ações. Não usa WebSocket/Supabase Realtime.

Variáveis privadas: `DATA_PEPPER`, `ADMIN_PASSWORD_HASH` e `ADMIN_PASSWORD_SALT`. Não altere DATA_PEPPER após cadastrar viajantes. A administração é acessível somente pela rota `/admin`, mediante senha verificada com PBKDF2 SHA-256 (100.000 iterações) no servidor. Sessão administrativa independente, HttpOnly, Secure e SameSite Strict, com duração de 4 horas e limite de tentativas. Perfis comuns não oferecem configuração de administrador.

`MAP_TILE_URL` e `MAP_ATTRIBUTION` configuram um provedor de tiles raster compatível com Leaflet. Padrão OpenStreetMap. Para Google/Mapbox com SDK próprio, é necessária adaptação. A carteira usa `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_WEBHOOK_SECRET`; o webhook público é `/api/mercadopago/webhook` e deve ser configurado no painel da aplicação Mercado Pago. `MERCADOPAGO_API_URL` é opcional e, por padrão, usa `https://api.mercadopago.com`.

O site está publicado com acesso público. A visibilidade do Sites é separada das contas internas do aplicativo.

Antes do lançamento comercial, defina a marca, datas, preço, contato do controlador de privacidade, política de retenção, configure o provedor PIX e remova demonstrações. Não há envio de e-mails, confirmação de e-mail ou recuperação de senha nesta edição. Cada token reserva R$ 0,50 no fundo da campanha; ao encerrar, o estabelecimento com maior média e pelo menos 100 avaliações válidas recebe o fundo integral.

## Desenvolvimento e verificações
Dependências e lockfile: pnpm. Use os scripts Sites de instalação e build. Schema em db/schema.ts; migrações Drizzle em drizzle/. Nunca aplique seed nas migrações.

Após build, `node tests/e2e.mjs` executa o fluxo num banco Miniflare isolado e descartável: cadastro, autorização, CNPJ/CPF únicos, aprovação, token, voto duplicado e concorrente, ranking, privacidade, upload e demo. Não toca no banco de produção.

As ferramentas WebMCP de consulta/busca são registradas quando o navegador suporta document.modelContext. O contexto de prévia não as expôs na validação.

Fotos de exemplo: Acfariac / Wikimedia Commons, CC BY-SA 4.0 (pão de queijo); Unsplash (café). Créditos disponíveis no aplicativo. A marca ilustrada foi gerada para este projeto.

## Mobile e PWA
Manifesto em public/manifest.webmanifest, ícones 192/512/maskable e Apple Touch, instalação assistida e modo standalone. O service worker mantém somente a tela offline e ícones no cache; não armazena sessões, CPF, respostas da API ou avaliações. Votos e tokens exigem rede. Aviso de atualização solicita recarregamento explicitamente para não interromper formulários. Navegação inferior, safe areas, alvos de toque e formulários sem zoom automático no iOS.

## Avaliação sem conta
O link do QR abre o formulário da parada e campanha do token. CPF válido e consentimento permitem responder sem login, usando uma autorização limitada ao token por 1 hora. O CPF fica protegido pelo mesmo hash com segredo das contas. Um registro GUEST sem credenciais utilizáveis preserva avaliações e unicidade; cadastrar uma conta com esse CPF promove atomicamente o registro e mantém seu histórico. Informar CPF não concede sessão, acesso a dados pessoais ou alteração de uma conta existente. QR pode ocupar toda a tela; navegadores compatíveis também usam Fullscreen API.
