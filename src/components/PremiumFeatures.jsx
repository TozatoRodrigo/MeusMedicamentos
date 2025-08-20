import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Dialog,
  Slide
} from '@mui/material'
import {
  Star as StarIcon,
  Lock as LockIcon,
  Notifications as NotificationIcon,
  CloudSync as CloudIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Vibration as VibrationIcon,
  VolumeUp as VolumeIcon,
  Backup as BackupIcon,
  Sync as SyncIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  Storage as StorageIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import SubscriptionModal from './SubscriptionModal'
import PaymentForm from './PaymentForm'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const PremiumFeatures = ({ userSubscription, onSubscribe }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isPremium = userSubscription?.status === 'active'

  const features = [
    {
      id: 'notifications',
      icon: <NotificationIcon />,
      title: 'Notificações Inteligentes',
      description: 'Sistema avançado de lembretes personalizáveis',
      premium: true,
      subFeatures: [
        { icon: <ScheduleIcon />, text: 'Lembretes personalizados por medicação' },
        { icon: <VolumeIcon />, text: 'Sons e toques customizáveis' },
        { icon: <VibrationIcon />, text: 'Padrões de vibração únicos' },
        { icon: <SmsIcon />, text: 'Notificações por SMS' },
        { icon: <EmailIcon />, text: 'Alertas por email' },
        { icon: <PhoneIcon />, text: 'Ligações automáticas (opcional)' }
      ]
    },
    {
      id: 'cloud',
      icon: <CloudIcon />,
      title: 'Backup e Sincronização',
      description: 'Seus dados seguros na nuvem, acessíveis em qualquer lugar',
      premium: true,
      subFeatures: [
        { icon: <BackupIcon />, text: 'Backup automático diário' },
        { icon: <SyncIcon />, text: 'Sincronização entre dispositivos' },
        { icon: <SecurityIcon />, text: 'Criptografia de ponta a ponta' },
        { icon: <StorageIcon />, text: 'Armazenamento ilimitado' }
      ]
    },
    {
      id: 'analytics',
      icon: <AnalyticsIcon />,
      title: 'Relatórios e Análises',
      description: 'Acompanhe sua adesão com gráficos e estatísticas detalhadas',
      premium: true,
      subFeatures: [
        { icon: <AssessmentIcon />, text: 'Dashboard com métricas de adesão' },
        { icon: <TimelineIcon />, text: 'Gráficos de evolução temporal' },
        { icon: <AnalyticsIcon />, text: 'Relatórios mensais automáticos' },
        { icon: <EmailIcon />, text: 'Exportação para PDF/Excel' }
      ]
    },
    {
      id: 'history',
      icon: <HistoryIcon />,
      title: 'Histórico Completo',
      description: 'Acesso ilimitado ao histórico de todas suas medicações',
      premium: true,
      subFeatures: [
        { icon: <HistoryIcon />, text: 'Histórico sem limite de tempo' },
        { icon: <SearchIcon />, text: 'Busca avançada no histórico' },
        { icon: <FilterIcon />, text: 'Filtros personalizados' },
        { icon: <ExportIcon />, text: 'Exportação de dados' }
      ]
    }
  ]

  const handleSubscribeClick = () => {
    setSubscriptionModalOpen(true)
  }

  const handleSubscriptionModalClose = () => {
    setSubscriptionModalOpen(false)
  }

  const handleSubscriptionConfirm = () => {
    setSubscriptionModalOpen(false)
    setPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (paymentData) => {
    setIsLoading(false)
    setPaymentModalOpen(false)
    
    // Simular criação da assinatura
    const mockSubscription = {
      id: 'sub_' + Date.now(),
      status: 'active',
      plan: 'premium',
      amount: 499, // R$ 4,99 em centavos
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: `•••• ${paymentData.paymentMethodId.slice(-4)}`
    }

    onSubscribe(mockSubscription)
  }

  const handlePaymentError = (error) => {
    setIsLoading(false)
    console.error('Payment error:', error)
  }

  const FeatureCard = ({ feature, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card
          sx={{
            height: '100%',
            borderRadius: 3,
            position: 'relative',
            border: feature.premium && !isPremium ? '2px solid' : '1px solid',
            borderColor: feature.premium && !isPremium ? 'primary.main' : 'grey.200',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {/* Premium Badge */}
          {feature.premium && !isPremium && (
            <Chip
              label="PREMIUM"
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 700,
                zIndex: 1
              }}
            />
          )}

          {/* Active Badge */}
          {feature.premium && isPremium && (
            <Chip
              label="ATIVO"
              size="small"
              color="success"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                fontWeight: 700,
                zIndex: 1
              }}
            />
          )}

          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mb: 2,
                  background: feature.premium && !isPremium
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : isPremium
                    ? 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)'
                    : 'grey.200'
                }}
              >
                {React.cloneElement(feature.icon, { 
                  sx: { 
                    fontSize: 28, 
                    color: feature.premium || isPremium ? 'white' : 'grey.600' 
                  } 
                })}
              </Avatar>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {feature.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>

            {/* Sub Features */}
            <Box sx={{ flexGrow: 1 }}>
              <List dense>
                {feature.subFeatures.map((subFeature, subIndex) => (
                  <ListItem 
                    key={subIndex} 
                    disablePadding 
                    sx={{ 
                      mb: 0.5,
                      opacity: feature.premium && !isPremium ? 0.7 : 1
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {React.cloneElement(subFeature.icon, { 
                        sx: { 
                          fontSize: 18, 
                          color: isPremium ? 'success.main' : 'primary.main' 
                        } 
                      })}
                    </ListItemIcon>
                    <ListItemText 
                      primary={subFeature.text}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Lock Overlay for Premium Features */}
            {feature.premium && !isPremium && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(2px)'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Recurso Premium
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            {isPremium ? 'Seus Recursos Premium' : 'Desbloqueie o Premium'}
          </Typography>
          
          {isPremium ? (
            <Chip 
              label="✨ Você é Premium!" 
              color="success" 
              sx={{ 
                fontSize: '1rem', 
                fontWeight: 700,
                px: 2,
                py: 1
              }} 
            />
          ) : (
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Transforme seu controle de medicações com recursos avançados
              </Typography>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubscribeClick}
                  startIcon={<StarIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)'
                    }
                  }}
                >
                  Assinar Premium - R$ 4,99/mês
                </Button>
              </motion.div>
            </Box>
          )}
        </Box>
      </motion.div>

      {/* Features Grid */}
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={feature.id}>
            <FeatureCard feature={feature} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Subscription Modal */}
      <SubscriptionModal
        open={subscriptionModalOpen}
        onClose={handleSubscriptionModalClose}
        onSubscribe={handleSubscriptionConfirm}
        isLoading={isLoading}
      />

      {/* Payment Modal */}
      <Dialog
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: '90vh'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Finalizar Assinatura Premium
          </Typography>
          
          <PaymentForm
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            customerEmail=""
            amount={249} // R$ 2,49 (primeiro mês com desconto)
          />
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="text"
              onClick={() => setPaymentModalOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Voltar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

// Ícones adicionais que não existem no MUI
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
  </svg>
)

const ExportIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
  </svg>
)

export default PremiumFeatures
