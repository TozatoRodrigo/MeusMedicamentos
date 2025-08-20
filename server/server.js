const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const stripeRoutes = require('./routes/stripe');
const subscriptionRoutes = require('./routes/subscriptions');
const webhookRoutes = require('./routes/webhooks');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de segurança
app.use(helmet());

// CORS - permitir requisições do frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware para webhook do Stripe (raw body)
app.use('/webhook', express.raw({ type: 'application/json' }));

// Middleware JSON para outras rotas
app.use(express.json());

// Rotas
app.use('/api/stripe', stripeRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/webhook', webhookRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  
  if (err.type === 'StripeCardError') {
    return res.status(400).json({ 
      error: 'Erro no cartão de crédito',
      message: err.message 
    });
  }
  
  if (err.type === 'StripeInvalidRequestError') {
    return res.status(400).json({ 
      error: 'Requisição inválida',
      message: err.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`💳 Stripe configurado: ${process.env.STRIPE_SECRET_KEY ? 'Sim' : 'Não'}`);
});
