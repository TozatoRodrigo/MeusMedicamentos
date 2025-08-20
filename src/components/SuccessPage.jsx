import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Home as HomeIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import ApiService from '../services/api'

const SuccessPage = ({ onNavigateHome }) => {
  const theme = useTheme()
  const [searchParams] = useSearchParams()
  const [sessionData, setSessionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      fetchSessionData()
    } else {
      setError('ID da sessão não encontrado')
      setLoading(false)
    }
  }, [sessionId])

  const fetchSessionData = async () => {
    try {
      const data = await ApiService.getCheckoutSession(sessionId)
      setSessionData(data.session)
    } catch (err) {
      console.error('Erro ao buscar dados da sessão:', err)
      setError('Erro ao verificar pagamento')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verificando seu pagamento...
          </Typography>
        </Card>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3
      }}>
        <Card sx={{ maxWidth: 500, p: 4, textAlign: 'center', borderRadius: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={onNavigateHome}
            startIcon={<HomeIcon />}
          >
            Voltar ao App
          </Button>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}>
          {/* Header de Sucesso */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            p: 4,
            textAlign: 'center',
            color: 'white'
          }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckIcon sx={{ fontSize: 80, mb: 2 }} />
            </motion.div>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Bem-vindo ao Premium!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Sua assinatura foi ativada com sucesso
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Informações da Assinatura */}
            {sessionData && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Detalhes da Assinatura
                </Typography>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid',
                  borderColor: 'success.light'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Plano:</Typography>
                    <Typography fontWeight={600}>Meus Medicamentos Premium</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Valor:</Typography>
                    <Typography fontWeight={600}>R$ 4,99/mês</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Status:</Typography>
                    <Typography fontWeight={600} color="success.main">
                      ✅ Ativo
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Recursos Desbloqueados */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1, color: 'gold' }} />
                Recursos Premium Desbloqueados
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  🔔 <span style={{ marginLeft: 8 }}>Notificações inteligentes personalizadas</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  ☁️ <span style={{ marginLeft: 8 }}>Backup automático na nuvem</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  📊 <span style={{ marginLeft: 8 }}>Relatórios detalhados de adesão</span>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  📚 <span style={{ marginLeft: 8 }}>Histórico ilimitado de medicações</span>
                </Typography>
              </Box>
            </Box>

            {/* Informações Importantes */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Importante:</strong> Você receberá um email de confirmação com o recibo. 
                Sua próxima cobrança será em 30 dias por R$ 4,99.
              </Typography>
            </Alert>

            {/* Botão para Voltar */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={onNavigateHome}
              startIcon={<HomeIcon />}
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
              Começar a Usar Premium
            </Button>

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
              Precisa de ajuda? Entre em contato conosco pelo email: suporte@meusmedicamentos.com
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}

export default SuccessPage
