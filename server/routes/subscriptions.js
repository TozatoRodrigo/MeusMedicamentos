const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Cancelar assinatura
router.post('/cancel', async (req, res) => {
  try {
    const { subscriptionId, cancelImmediately = false } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'ID da assinatura é obrigatório' });
    }

    let updatedSubscription;

    if (cancelImmediately) {
      // Cancelar imediatamente
      updatedSubscription = await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Cancelar no final do período
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
    }

    res.json({
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancel_at_period_end: updatedSubscription.cancel_at_period_end,
        canceled_at: updatedSubscription.canceled_at,
        current_period_end: updatedSubscription.current_period_end
      }
    });

  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ 
      error: 'Erro ao cancelar assinatura',
      message: error.message 
    });
  }
});

// Reativar assinatura
router.post('/reactivate', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'ID da assinatura é obrigatório' });
    }

    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });

    res.json({
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancel_at_period_end: updatedSubscription.cancel_at_period_end,
        current_period_end: updatedSubscription.current_period_end
      }
    });

  } catch (error) {
    console.error('Erro ao reativar assinatura:', error);
    res.status(500).json({ 
      error: 'Erro ao reativar assinatura',
      message: error.message 
    });
  }
});

// Obter detalhes da assinatura
router.get('/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'items.data.price.product']
    });

    res.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at,
        customer: {
          id: subscription.customer.id,
          email: subscription.customer.email,
          name: subscription.customer.name
        },
        items: subscription.items.data.map(item => ({
          id: item.id,
          price: {
            id: item.price.id,
            amount: item.price.unit_amount,
            currency: item.price.currency,
            interval: item.price.recurring.interval,
            product: {
              id: item.price.product.id,
              name: item.price.product.name,
              description: item.price.product.description
            }
          }
        }))
      }
    });

  } catch (error) {
    console.error('Erro ao obter assinatura:', error);
    res.status(500).json({ 
      error: 'Erro ao obter assinatura',
      message: error.message 
    });
  }
});

// Listar todas as assinaturas de um cliente
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.items.data.price.product']
    });

    res.json({
      subscriptions: subscriptions.data.map(subscription => ({
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at,
        items: subscription.items.data.map(item => ({
          price: {
            id: item.price.id,
            amount: item.price.unit_amount,
            currency: item.price.currency,
            interval: item.price.recurring.interval,
            product: {
              name: item.price.product.name,
              description: item.price.product.description
            }
          }
        }))
      }))
    });

  } catch (error) {
    console.error('Erro ao listar assinaturas:', error);
    res.status(500).json({ 
      error: 'Erro ao listar assinaturas',
      message: error.message 
    });
  }
});

module.exports = router;
