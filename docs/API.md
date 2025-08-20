# 📊 API Reference - Meus Medicamentos

## Base URL
```
http://localhost:3001 (desenvolvimento)
https://api.meusmedicamentos.com (produção)
```

## Autenticação
A API utiliza chaves do Stripe para autenticação. As chaves secretas devem ser mantidas seguras no backend.

---

## 🏥 Health Check

### GET /health
Verifica o status do servidor.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T15:30:00.000Z",
  "environment": "production"
}
```

---

## 💳 Stripe Endpoints

### POST /api/stripe/create-checkout-session
Cria uma sessão de checkout para assinatura premium.

**Request Body:**
```json
{
  "customerEmail": "usuario@exemplo.com",
  "priceId": "price_1234567890" // Opcional
}
```

**Response:**
```json
{
  "sessionId": "cs_test_1234567890",
  "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
}
```

**Errors:**
- `400` - Email obrigatório
- `400` - Price ID não configurado
- `500` - Erro interno do servidor

---

### GET /api/stripe/checkout-session/:sessionId
Obtém detalhes de uma sessão de checkout.

**Parameters:**
- `sessionId` - ID da sessão de checkout

**Response:**
```json
{
  "session": {
    "id": "cs_test_1234567890",
    "status": "complete",
    "customer": {
      "id": "cus_1234567890",
      "email": "usuario@exemplo.com"
    },
    "subscription": {
      "id": "sub_1234567890",
      "status": "active"
    }
  }
}
```

---

### POST /api/stripe/create-customer-portal
Cria um portal do cliente para gerenciar assinatura.

**Request Body:**
```json
{
  "customerId": "cus_1234567890"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/session/1234567890"
}
```

---

### GET /api/stripe/customer/:email
Busca cliente por email.

**Parameters:**
- `email` - Email do cliente (URL encoded)

**Response:**
```json
{
  "customer": {
    "id": "cus_1234567890",
    "email": "usuario@exemplo.com",
    "name": "João Silva",
    "created": 1640995200,
    "subscriptions": [
      {
        "id": "sub_1234567890",
        "status": "active",
        "current_period_start": 1640995200,
        "current_period_end": 1643673600,
        "cancel_at_period_end": false,
        "items": [
          {
            "price_id": "price_1234567890",
            "amount": 499,
            "currency": "brl",
            "interval": "month"
          }
        ]
      }
    ]
  }
}
```

**Response (cliente não encontrado):**
```json
{
  "customer": null
}
```

---

## 🔄 Subscription Endpoints

### POST /api/subscriptions/cancel
Cancela uma assinatura.

**Request Body:**
```json
{
  "subscriptionId": "sub_1234567890",
  "cancelImmediately": false // Opcional, padrão: false
}
```

**Response:**
```json
{
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "cancel_at_period_end": true,
    "canceled_at": null,
    "current_period_end": 1643673600
  }
}
```

---

### POST /api/subscriptions/reactivate
Reativa uma assinatura cancelada.

**Request Body:**
```json
{
  "subscriptionId": "sub_1234567890"
}
```

**Response:**
```json
{
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "cancel_at_period_end": false,
    "current_period_end": 1643673600
  }
}
```

---

### GET /api/subscriptions/:subscriptionId
Obtém detalhes de uma assinatura.

**Parameters:**
- `subscriptionId` - ID da assinatura

**Response:**
```json
{
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "current_period_start": 1640995200,
    "current_period_end": 1643673600,
    "cancel_at_period_end": false,
    "canceled_at": null,
    "customer": {
      "id": "cus_1234567890",
      "email": "usuario@exemplo.com",
      "name": "João Silva"
    },
    "items": [
      {
        "id": "si_1234567890",
        "price": {
          "id": "price_1234567890",
          "amount": 499,
          "currency": "brl",
          "interval": "month",
          "product": {
            "id": "prod_1234567890",
            "name": "Meus Medicamentos Premium",
            "description": "Acesso completo aos recursos premium"
          }
        }
      }
    ]
  }
}
```

---

### GET /api/subscriptions/customer/:customerId
Lista assinaturas de um cliente.

**Parameters:**
- `customerId` - ID do cliente

**Response:**
```json
{
  "subscriptions": [
    {
      "id": "sub_1234567890",
      "status": "active",
      "current_period_start": 1640995200,
      "current_period_end": 1643673600,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "items": [
        {
          "price": {
            "id": "price_1234567890",
            "amount": 499,
            "currency": "brl",
            "interval": "month",
            "product": {
              "name": "Meus Medicamentos Premium",
              "description": "Acesso completo aos recursos premium"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🪝 Webhooks

### POST /webhook
Recebe eventos do Stripe via webhooks.

**Headers:**
- `stripe-signature` - Assinatura do Stripe para verificação

**Eventos Suportados:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Response:**
```json
{
  "received": true
}
```

---

## 🚨 Error Handling

### Códigos de Status
- `200` - Sucesso
- `400` - Erro de validação
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

### Formato de Erro
```json
{
  "error": "Descrição do erro",
  "message": "Mensagem detalhada do erro"
}
```

### Erros Específicos do Stripe
```json
{
  "error": "Erro no cartão de crédito",
  "message": "Your card was declined.",
  "type": "StripeCardError"
}
```

---

## 🔒 Segurança

### Headers de Segurança
- `helmet` - Configuração automática de headers
- `cors` - Controle de origem cruzada
- `express.json()` - Parsing seguro de JSON

### Validação de Webhooks
```javascript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
```

### Rate Limiting
Recomendado implementar rate limiting em produção:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
```

---

## 📝 Exemplos de Uso

### JavaScript (Frontend)
```javascript
// Criar sessão de checkout
const response = await fetch('/api/stripe/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    customerEmail: 'usuario@exemplo.com'
  })
});

const { url } = await response.json();
window.location.href = url;
```

### Node.js (Backend)
```javascript
// Cancelar assinatura
const response = await fetch('/api/subscriptions/cancel', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    subscriptionId: 'sub_1234567890',
    cancelImmediately: false
  })
});

const data = await response.json();
console.log('Assinatura cancelada:', data.subscription);
```

### cURL
```bash
# Criar sessão de checkout
curl -X POST http://localhost:3001/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"customerEmail": "usuario@exemplo.com"}'

# Verificar saúde do servidor
curl http://localhost:3001/health
```

---

## 🧪 Ambiente de Teste

### Configuração
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=development
```

### Cartões de Teste
- **Sucesso:** `4242 4242 4242 4242`
- **Falha:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

### Webhooks Locais
```bash
stripe listen --forward-to localhost:3001/webhook
```

---

## 📚 Recursos Adicionais

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [Error Handling](https://stripe.com/docs/error-handling)
- [Security Best Practices](https://stripe.com/docs/security)
