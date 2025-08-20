# Configuração do Stripe

## Passo 1: Criar conta no Stripe
1. Acesse https://stripe.com
2. Crie uma conta para seu negócio
3. Ative o modo de teste para desenvolvimento

## Passo 2: Obter chaves da API
1. Vá para o painel do Stripe
2. Navegue para Developers > API Keys
3. Copie a "Publishable key" (começa com pk_test_)

## Passo 3: Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui
```

## Passo 4: Criar produto de assinatura no Stripe
1. No painel do Stripe, vá para Products
2. Clique em "Add product"
3. Nome: "Meus Medicamentos Premium"
4. Preço: R$ 4,99 BRL (recorrente mensal)
5. Copie o Price ID (começa com price_)

## Passo 5: Backend (necessário implementar)
Para um sistema completo, você precisará de um backend para:
- Criar sessões de checkout
- Gerenciar webhooks do Stripe
- Validar assinaturas
- Cancelar assinaturas

### Exemplo de endpoint Node.js:
```javascript
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_seu_price_id_aqui', // Price ID do produto
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: 'https://seuapp.com/success',
    cancel_url: 'https://seuapp.com/cancel',
  });
  
  res.json({ id: session.id });
});
```

## Notas importantes:
- As chaves mostradas são de teste (pk_test_)
- Para produção, use chaves reais (pk_live_)
- Nunca exponha a Secret Key no frontend
- Configure webhooks para sincronizar status de assinatura
