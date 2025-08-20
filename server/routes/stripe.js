const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Criar sessão de checkout para assinatura
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { customerEmail, priceId } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Email do cliente é obrigatório' });
    }

    // Usar o Price ID do .env ou o padrão
    const finalPriceId = priceId || process.env.PREMIUM_PRICE_ID;
    
    if (!finalPriceId) {
      return res.status(400).json({ error: 'Price ID não configurado' });
    }

    // Verificar se já existe um cliente com este email
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Criar novo cliente
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          app: 'meus-medicamentos',
          created_at: new Date().toISOString()
        }
      });
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CANCEL_URL,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto'
      },
      metadata: {
        app: 'meus-medicamentos',
        customer_email: customerEmail
      }
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    res.status(500).json({ 
      error: 'Erro ao criar sessão de checkout',
      message: error.message 
    });
  }
});

// Obter detalhes da sessão de checkout
router.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    res.json({
      session: {
        id: session.id,
        status: session.payment_status,
        customer: session.customer,
        subscription: session.subscription
      }
    });

  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    res.status(500).json({ 
      error: 'Erro ao obter sessão',
      message: error.message 
    });
  }
});

// Criar portal do cliente para gerenciar assinatura
router.post('/create-customer-portal', async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'ID do cliente é obrigatório' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.FRONTEND_URL,
    });

    res.json({ url: portalSession.url });

  } catch (error) {
    console.error('Erro ao criar portal do cliente:', error);
    res.status(500).json({ 
      error: 'Erro ao criar portal do cliente',
      message: error.message 
    });
  }
});

// Obter informações do cliente
router.get('/customer/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
      expand: ['data.subscriptions']
    });

    if (customers.data.length === 0) {
      return res.json({ customer: null });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 10
    });

    res.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        created: customer.created,
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          current_period_start: sub.current_period_start,
          current_period_end: sub.current_period_end,
          cancel_at_period_end: sub.cancel_at_period_end,
          canceled_at: sub.canceled_at,
          items: sub.items.data.map(item => ({
            price_id: item.price.id,
            product_id: item.price.product,
            amount: item.price.unit_amount,
            currency: item.price.currency,
            interval: item.price.recurring.interval
          }))
        }))
      }
    });

  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ 
      error: 'Erro ao obter cliente',
      message: error.message 
    });
  }
});

module.exports = router;
