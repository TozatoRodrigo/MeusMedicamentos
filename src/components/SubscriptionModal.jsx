import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Notifications as NotificationIcon,
  CloudSync as CloudIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  LocalPharmacy as PharmacyIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const SubscriptionModal = ({ open, onClose, onSubscribe, isLoading }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedPlan, setSelectedPlan] = useState('premium')

  const features = [
    {
      icon: <NotificationIcon color="primary" />,
      title: 'Notificações Inteligentes',
      description: 'Lembretes personalizados com sons e vibração'
    },
    {
      icon: <CloudIcon color="primary" />,
      title: 'Backup na Nuvem',
      description: 'Seus dados seguros e sincronizados em todos dispositivos'
    },
    {
      icon: <AnalyticsIcon color="primary" />,
      title: 'Relatórios Detalhados',
      description: 'Gráficos e estatísticas de adesão ao tratamento'
    },
    {
      icon: <SecurityIcon color="primary" />,
      title: 'Histórico Ilimitado',
      description: 'Acesso completo ao histórico de medicações'
    }
  ]

  const handleSubscribe = () => {
    onSubscribe(selectedPlan)
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'rotate 20s linear infinite'
          }
        }}
      />
      
      <DialogContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 4, 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 2,
                position: 'relative'
              }}>
                <StarIcon sx={{ fontSize: 40, color: 'white' }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#ff6b35',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PharmacyIcon sx={{ fontSize: 14, color: 'white' }} />
                </Box>
              </Box>
            </motion.div>
            
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              Premium
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Transforme seu controle de medicações
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', mb: 1 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  color: '#667eea'
                }}
              >
                R$ 4,99
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                /mês
              </Typography>
            </Box>
            
            <Chip 
              label="🔥 Oferta Especial - Primeiro mês 50% OFF" 
              color="error"
              sx={{ 
                fontWeight: 600,
                fontSize: '0.9rem',
                animation: 'pulse 2s infinite'
              }}
            />
          </Box>

          {/* Features */}
          <Box sx={{ p: 4, background: 'rgba(255, 255, 255, 0.98)' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
              Recursos Premium
            </Typography>
            
            <List sx={{ mb: 3 }}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <ListItem sx={{ 
                    mb: 2, 
                    borderRadius: 2, 
                    border: '1px solid',
                    borderColor: 'grey.200',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {feature.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            {/* Guarantee */}
            <Box sx={{ 
              textAlign: 'center', 
              p: 3, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
              border: '1px solid',
              borderColor: 'success.light'
            }}>
              <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Garantia de 30 dias
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Não satisfeito? Cancelamos e devolvemos seu dinheiro, sem perguntas.
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ 
            p: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            borderTop: '1px solid',
            borderColor: 'grey.200'
          }}>
            {isLoading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  sx={{ 
                    borderRadius: 1,
                    height: 6,
                    background: 'rgba(102, 126, 234, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }
                  }} 
                />
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                  Processando sua assinatura...
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={isLoading}
                fullWidth={isMobile}
                sx={{ 
                  borderRadius: 3,
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Talvez depois
              </Button>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: 1 }}
              >
                <Button
                  variant="contained"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
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
                >
                  {isLoading ? 'Processando...' : '🚀 Começar Agora'}
                </Button>
              </motion.div>
            </Box>

            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 2, 
                color: 'text.secondary',
                lineHeight: 1.4
              }}
            >
              Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
              Cobrança recorrente mensal. Cancele quando quiser.
            </Typography>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionModal
