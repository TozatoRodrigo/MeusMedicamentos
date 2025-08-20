const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Webhook para eventos do Stripe
router.post('/', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      console.log('✅ Nova assinatura criada:', event.data.object.id);
      handleSubscriptionCreated(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      console.log('🔄 Assinatura atualizada:', event.data.object.id);
      handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      console.log('❌ Assinatura cancelada:', event.data.object.id);
      handleSubscriptionDeleted(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      console.log('💰 Pagamento bem-sucedido:', event.data.object.id);
      handleInvoicePaymentSucceeded(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      console.log('💳 Falha no pagamento:', event.data.object.id);
      handleInvoicePaymentFailed(event.data.object);
      break;
      
    case 'checkout.session.completed':
      console.log('🎉 Checkout completado:', event.data.object.id);
      handleCheckoutCompleted(event.data.object);
      break;
      
    default:
      console.log(`🤷‍♂️ Evento não tratado: ${event.type}`);
  }

  res.json({received: true});
});

// Handlers para diferentes eventos
async function handleSubscriptionCreated(subscription) {
  try {
    // Aqui você pode adicionar lógica para:
    // - Ativar recursos premium no app
    // - Enviar email de boas-vindas
    // - Atualizar banco de dados
    
    console.log(`Nova assinatura ativa para cliente: ${subscription.customer}`);
    
    // Exemplo: buscar dados do cliente
    const customer = await stripe.customers.retrieve(subscription.customer);
    console.log(`Email do cliente: ${customer.email}`);
    
  } catch (error) {
    console.error('Erro ao processar nova assinatura:', error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    console.log(`Status da assinatura: ${subscription.status}`);
    
    if (subscription.cancel_at_period_end) {
      console.log(`Assinatura será cancelada em: ${new Date(subscription.current_period_end * 1000)}`);
    }
    
    // Aqui você pode:
    // - Atualizar status no banco de dados
    // - Notificar o usuário sobre mudanças
    
  } catch (error) {
    console.error('Erro ao processar atualização de assinatura:', error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    // Aqui você pode:
    // - Desativar recursos premium
    // - Enviar email de cancelamento
    // - Limpar dados relacionados
    
    const customer = await stripe.customers.retrieve(subscription.customer);
    console.log(`Assinatura cancelada para: ${customer.email}`);
    
  } catch (error) {
    console.error('Erro ao processar cancelamento:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  try {
    // Pagamento bem-sucedido
    console.log(`Pagamento de R$ ${(invoice.amount_paid / 100).toFixed(2)} processado`);
    
    // Aqui você pode:
    // - Enviar recibo por email
    // - Registrar pagamento no banco
    // - Renovar período premium
    
  } catch (error) {
    console.error('Erro ao processar pagamento bem-sucedido:', error);
  }
}

async function handleInvoicePaymentFailed(invoice) {
  try {
    // Falha no pagamento
    console.log(`Falha no pagamento: ${invoice.id}`);
    
    // Aqui você pode:
    // - Notificar usuário sobre falha
    // - Tentar cobrar novamente
    // - Suspender recursos premium
    
    const customer = await stripe.customers.retrieve(invoice.customer);
    console.log(`Falha no pagamento para: ${customer.email}`);
    
  } catch (error) {
    console.error('Erro ao processar falha no pagamento:', error);
  }
}

async function handleCheckoutCompleted(session) {
  try {
    // Checkout completado com sucesso
    console.log(`Checkout completado: ${session.id}`);
    
    if (session.mode === 'subscription') {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      console.log(`Nova assinatura ativa: ${subscription.id}`);
    }
    
    // Aqui você pode:
    // - Ativar recursos premium imediatamente
    // - Enviar email de confirmação
    // - Redirecionar usuário para página de sucesso
    
  } catch (error) {
    console.error('Erro ao processar checkout completado:', error);
  }
}

module.exports = router;
