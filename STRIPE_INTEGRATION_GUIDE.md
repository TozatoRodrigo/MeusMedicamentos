# 🚀 Guia Completo de Integração Stripe - Meus Medicamentos

## 📋 Visão Geral

Sistema completo de assinatura premium integrado com Stripe, incluindo:
- ✅ Backend Node.js/Express
- ✅ Checkout Sessions do Stripe
- ✅ Webhooks para sincronização
- ✅ Portal do cliente para gerenciar assinatura
- ✅ Páginas de sucesso e cancelamento
- ✅ Interface completa de gerenciamento

## 🛠️ Configuração Inicial

### 1. Configurar Conta Stripe

1. **Criar conta:** https://stripe.com
2. **Ativar modo de teste** para desenvolvimento
3. **Obter chaves da API:**
   - Vá para: Developers → API Keys
   - Copie a `Publishable key` (pk_test_...)
   - Copie a `Secret key` (sk_test_...)

### 2. Configurar Produtos no Stripe

Execute o script de configuração:

```bash
cd server
cp config.example.env .env
# Edite o .env com suas chaves do Stripe
node scripts/setup-stripe-products.js
```

Isso criará:
- ✅ Produto "Meus Medicamentos Premium"
- ✅ Preço R$ 4,99/mês
- ✅ Cupom de desconto 50% OFF
- ✅ Código promocional "PRIMEIRA50"

### 3. Configurar Variáveis de Ambiente

#### Backend (.env)
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta
STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica
STRIPE_WEBHOOK_SECRET=whsec_sua_webhook_secret

# Servidor
PORT=3001
NODE_ENV=development

# URLs
FRONTEND_URL=http://localhost:5173
SUCCESS_URL=http://localhost:5173/success
CANCEL_URL=http://localhost:5173/cancel

# Produto
PREMIUM_PRICE_ID=price_id_do_produto_premium
```

#### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica
VITE_API_BASE_URL=http://localhost:3001
```

## 🚀 Executar o Sistema

### 1. Iniciar Backend
```bash
cd server
npm run dev
```

### 2. Iniciar Frontend
```bash
cd ..
npm run dev
```

### 3. Testar Integração
1. Abra http://localhost:5173
2. Vá para "Assinar Premium"
3. Clique em "Começar Agora"
4. Preencha email e clique em "Continuar para Pagamento"
5. Será redirecionado para o Stripe Checkout

## 🔗 Configurar Webhooks

### 1. Instalar Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Ou baixe de: https://github.com/stripe/stripe-cli/releases
```

### 2. Fazer Login
```bash
stripe login
```

### 3. Configurar Webhook Local (Desenvolvimento)
```bash
stripe listen --forward-to localhost:3001/webhook
```

### 4. Copiar Webhook Secret
O comando acima mostrará um webhook secret (whsec_...). 
Copie e cole no seu .env como `STRIPE_WEBHOOK_SECRET`.

### 5. Webhooks em Produção
No painel do Stripe:
1. Vá para Developers → Webhooks
2. Adicione endpoint: `https://seudominio.com/webhook`
3. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 💳 Testar Pagamentos

### Cartões de Teste
- **Sucesso:** `4242 4242 4242 4242`
- **Falha:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`
- **CVC:** Qualquer 3 dígitos
- **Data:** Qualquer data futura

### Cenários de Teste
1. **Pagamento bem-sucedido**
2. **Pagamento falhado**
3. **Cancelamento durante checkout**
4. **Cancelamento de assinatura**
5. **Reativação de assinatura**

## 📊 Funcionalidades Implementadas

### Backend (server/)
- ✅ **Checkout Sessions** - Criar sessões de pagamento
- ✅ **Customer Portal** - Portal para gerenciar assinatura
- ✅ **Webhooks** - Sincronizar status de assinatura
- ✅ **Subscription Management** - Cancelar/reativar assinaturas
- ✅ **Customer Lookup** - Buscar dados do cliente

### Frontend (src/)
- ✅ **CheckoutForm** - Formulário de checkout simplificado
- ✅ **SuccessPage** - Página de confirmação de pagamento
- ✅ **CancelPage** - Página de pagamento cancelado
- ✅ **SubscriptionManagement** - Gerenciar assinatura existente
- ✅ **API Service** - Cliente para comunicação com backend

## 🔧 Endpoints da API

### Stripe
- `POST /api/stripe/create-checkout-session` - Criar sessão de checkout
- `GET /api/stripe/checkout-session/:sessionId` - Obter dados da sessão
- `POST /api/stripe/create-customer-portal` - Criar portal do cliente
- `GET /api/stripe/customer/:email` - Buscar cliente por email

### Assinaturas
- `POST /api/subscriptions/cancel` - Cancelar assinatura
- `POST /api/subscriptions/reactivate` - Reativar assinatura
- `GET /api/subscriptions/:subscriptionId` - Obter assinatura
- `GET /api/subscriptions/customer/:customerId` - Listar assinaturas do cliente

### Webhooks
- `POST /webhook` - Receber eventos do Stripe

## 🚀 Deploy em Produção

### 1. Configurar Variáveis de Ambiente
- Use chaves de produção (pk_live_... e sk_live_...)
- Configure URLs de produção
- Configure webhook endpoint de produção

### 2. Configurar Portal do Cliente
No painel do Stripe:
1. Vá para Settings → Billing → Customer Portal
2. Ative o portal
3. Configure opções de cancelamento
4. Defina política de reembolso

### 3. Configurar Impostos (Opcional)
1. Vá para Settings → Tax
2. Configure impostos por região
3. Ative cobrança automática de impostos

## 📈 Monitoramento

### Métricas Importantes
- Taxa de conversão de checkout
- Taxa de cancelamento (churn)
- Receita recorrente mensal (MRR)
- Falhas de pagamento

### Logs
- Todos os webhooks são logados
- Erros de pagamento são capturados
- Ações de cancelamento são registradas

## 🔒 Segurança

### Boas Práticas Implementadas
- ✅ Validação de webhook signatures
- ✅ HTTPS obrigatório em produção
- ✅ Chaves secretas nunca expostas no frontend
- ✅ Validação de dados de entrada
- ✅ Tratamento de erros robusto
- ✅ Rate limiting (recomendado para produção)

## 📞 Suporte

### Recursos
- **Documentação Stripe:** https://stripe.com/docs
- **Dashboard Stripe:** https://dashboard.stripe.com
- **Status Page:** https://status.stripe.com

### Contato
- Email: suporte@meusmedicamentos.com
- Documentação: Consulte este arquivo

---

## ✅ Checklist de Implementação

- [x] Backend configurado
- [x] Frontend integrado
- [x] Produtos criados no Stripe
- [x] Webhooks configurados
- [x] Páginas de sucesso/cancelamento
- [x] Gerenciamento de assinatura
- [x] Testes realizados
- [ ] Deploy em produção
- [ ] Monitoramento configurado
- [ ] Suporte ao cliente configurado

**🎉 Sistema pronto para uso!**
