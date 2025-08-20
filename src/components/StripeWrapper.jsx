import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert
} from '@mui/material'
import {
  Security as SecurityIcon,
  Warning as WarningIcon
} from '@mui/icons-material'

// Verificar se a chave do Stripe está configurada
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const StripeConfigurationError = ({ onClose }) => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Card sx={{ 
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <WarningIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Configuração do Stripe Necessária
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Para processar pagamentos, é necessário configurar as chaves do Stripe.
          </Typography>
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Para configurar:</strong><br/>
              1. Crie um arquivo <code>.env</code> na raiz do projeto<br/>
              2. Adicione: <code>VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave</code><br/>
              3. Reinicie o servidor de desenvolvimento<br/>
              4. Consulte o arquivo <code>stripe_config.md</code> para mais detalhes
            </Typography>
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              onClick={() => window.open('https://stripe.com', '_blank')}
            >
              Criar Conta Stripe
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.open('https://dashboard.stripe.com/test/apikeys', '_blank')}
            >
              Ver Chaves API
            </Button>
            <Button 
              variant="contained" 
              onClick={onClose}
            >
              Voltar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

const StripeWrapper = ({ children, onConfigurationError }) => {
  // Se não há chave do Stripe configurada, mostra mensagem de configuração
  if (!stripeKey || !stripePromise) {
    return <StripeConfigurationError onClose={onConfigurationError} />
  }

  // Se está configurado, renderiza o Elements provider
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  )
}

export default StripeWrapper
export { stripePromise, stripeKey }
