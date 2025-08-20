import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  TextField,
  Grid,
  useTheme
} from '@mui/material'
import {
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import ApiService from '../services/api'

const CheckoutForm = ({ onPaymentSuccess, onPaymentError, customerEmail, amount }) => {
  const theme = useTheme()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: customerEmail || '',
    phone: ''
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!customerInfo.email.trim()) {
      setError('Por favor, preencha seu email.')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Criar sessão de checkout no backend
      const { sessionId, url } = await ApiService.createCheckoutSession(
        customerInfo.email.trim()
      )

      // Redirecionar para o Stripe Checkout
      window.location.href = url

    } catch (err) {
      console.error('Erro ao criar checkout:', err)
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.')
      setIsProcessing(false)
      onPaymentError?.(err)
    }
  }

  const handleInputChange = (field) => (event) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    // Limpar erro quando o usuário começar a digitar
    if (error) setError('')
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ 
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: 'white',
            textAlign: 'center'
          }}>
            <SecurityIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Checkout Seguro
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Processado com segurança pelo Stripe
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Informações do Cliente */}
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1 }} />
                Informações para Assinatura
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    value={customerInfo.name}
                    onChange={handleInputChange('name')}
                    disabled={isProcessing}
                    helperText="Como você gostaria de ser chamado"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={customerInfo.email}
                    onChange={handleInputChange('email')}
                    required
                    disabled={isProcessing}
                    helperText="Usaremos este email para enviar recibos e notificações"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telefone (opcional)"
                    value={customerInfo.phone}
                    onChange={handleInputChange('phone')}
                    disabled={isProcessing}
                    helperText="Para notificações importantes sobre sua assinatura"
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {/* Resumo */}
              <Card sx={{ mb: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Resumo da Assinatura
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Meus Medicamentos Premium</Typography>
                    <Typography fontWeight={600}>R$ 4,99/mês</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, color: 'success.main' }}>
                    <Typography>Desconto primeiro mês (50%)</Typography>
                    <Typography fontWeight={600}>-R$ 2,50</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    pt: 2, 
                    borderTop: '1px solid',
                    borderColor: 'grey.300'
                  }}>
                    <Typography variant="h6" fontWeight={700}>Total hoje:</Typography>
                    <Typography variant="h6" fontWeight={700} color="primary.main">R$ 2,49</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Depois R$ 4,99/mês. Cancele quando quiser.
                  </Typography>
                </CardContent>
              </Card>

              {/* Info sobre Stripe Checkout */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Checkout Seguro:</strong> Você será redirecionado para o Stripe, 
                  a plataforma de pagamento mais segura do mundo, para finalizar sua assinatura.
                </Typography>
              </Alert>

              {/* Benefícios */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  ✨ Você terá acesso a:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>• Notificações inteligentes personalizadas</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>• Backup automático na nuvem</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>• Relatórios detalhados de adesão</Typography>
                  <Typography variant="body2">• Histórico ilimitado de medicações</Typography>
                </Box>
              </Box>

              {/* Erro */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Botão de Submit */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isProcessing || !customerInfo.email.trim()}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: 'grey.300'
                  }
                }}
                startIcon={isProcessing ? <CircularProgress size={20} /> : <CheckIcon />}
              >
                {isProcessing ? 'Redirecionando...' : 'Continuar para Pagamento'}
              </Button>

              {/* Segurança */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mt: 3,
                p: 2,
                borderRadius: 2,
                background: 'rgba(76, 175, 80, 0.1)'
              }}>
                <SecurityIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                <Typography variant="body2" color="success.dark" textAlign="center">
                  Seus dados estão protegidos com criptografia SSL de 256 bits
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}

export default CheckoutForm
