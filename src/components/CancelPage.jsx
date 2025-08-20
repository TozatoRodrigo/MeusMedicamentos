import React from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert
} from '@mui/material'
import {
  Cancel as CancelIcon,
  Home as HomeIcon,
  Refresh as RetryIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const CancelPage = ({ onNavigateHome, onRetryPayment }) => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ 
          maxWidth: 500,
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            p: 4,
            textAlign: 'center',
            color: 'white'
          }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CancelIcon sx={{ fontSize: 80, mb: 2 }} />
            </motion.div>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Pagamento Cancelado
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Nenhuma cobrança foi realizada
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Não se preocupe! Você pode tentar novamente a qualquer momento. 
                Seus dados estão seguros e nenhuma cobrança foi processada.
              </Typography>
            </Alert>

            {/* Motivos comuns */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Por que isso aconteceu?
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Você clicou em "Voltar" durante o pagamento
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Houve um problema temporário com o pagamento
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Você decidiu não prosseguir neste momento
                </Typography>
              </Box>
            </Box>

            {/* Lembrete dos benefícios */}
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid',
              borderColor: 'primary.light',
              mb: 3
            }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                🌟 Lembre-se dos benefícios Premium:
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                • Notificações inteligentes personalizadas
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                • Backup automático na nuvem
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                • Relatórios detalhados de adesão
              </Typography>
              <Typography variant="body2">
                • Histórico ilimitado de medicações
              </Typography>
            </Box>

            {/* Botões de Ação */}
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={onRetryPayment}
                startIcon={<RetryIcon />}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Tentar Novamente
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={onNavigateHome}
                startIcon={<HomeIcon />}
                sx={{
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Voltar ao App
              </Button>
            </Box>

            {/* Footer */}
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 3 
              }}
            >
              Tem dúvidas? Entre em contato: suporte@meusmedicamentos.com
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}

export default CancelPage
