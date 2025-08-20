import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Divider,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Avatar,
  Grid
} from '@mui/material'
import {
  Star as StarIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  CloudSync as CloudIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const SubscriptionManagement = ({ 
  subscription, 
  onCancelSubscription, 
  onUpdatePayment, 
  isLoading 
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [timeLeft, setTimeLeft] = useState('')

  // Calcular tempo restante até a próxima cobrança
  useEffect(() => {
    if (!subscription?.nextBillingDate) return

    const updateTimeLeft = () => {
      const now = new Date()
      const nextBilling = new Date(subscription.nextBillingDate)
      const diff = nextBilling - now

      if (diff <= 0) {
        setTimeLeft('Vencido')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) {
        setTimeLeft(`${days} dias`)
      } else {
        setTimeLeft(`${hours} horas`)
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000 * 60 * 60) // Atualiza a cada hora

    return () => clearInterval(interval)
  }, [subscription?.nextBillingDate])

  const handleCancelClick = () => {
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = () => {
    onCancelSubscription(cancelReason)
    setCancelDialogOpen(false)
    setCancelReason('')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'canceled': return 'error'
      case 'past_due': return 'warning'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Ativa'
      case 'canceled': return 'Cancelada'
      case 'past_due': return 'Vencida'
      default: return 'Desconhecido'
    }
  }

  const premiumFeatures = [
    {
      icon: <NotificationIcon color="primary" />,
      title: 'Notificações Inteligentes',
      description: 'Lembretes personalizados',
      active: true
    },
    {
      icon: <CloudIcon color="primary" />,
      title: 'Backup na Nuvem',
      description: 'Sincronização automática',
      active: true
    },
    {
      icon: <AnalyticsIcon color="primary" />,
      title: 'Relatórios Detalhados',
      description: 'Análises avançadas',
      active: true
    },
    {
      icon: <SecurityIcon color="primary" />,
      title: 'Histórico Ilimitado',
      description: 'Sem limite de tempo',
      active: true
    }
  ]

  if (!subscription) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Nenhuma assinatura ativa encontrada
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <StarIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Meus Medicamentos Premium
          </Typography>
          <Chip 
            label={getStatusText(subscription.status)}
            color={getStatusColor(subscription.status)}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Informações da Assinatura */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CreditCardIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Detalhes da Assinatura
                  </Typography>
                </Box>

                <List disablePadding>
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemText
                      primary="Plano"
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Premium - R$ 4,99/mês
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>

                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <CalendarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Próxima Cobrança"
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {new Date(subscription.nextBillingDate).toLocaleDateString('pt-BR')}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            Em {timeLeft}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>

                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon>
                      <ReceiptIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Método de Pagamento"
                      secondary={subscription.paymentMethod || 'Cartão •••• 1234'}
                    />
                  </ListItem>
                </List>

                {subscription.status === 'active' && (
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    borderRadius: 2, 
                    background: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid',
                    borderColor: 'success.light'
                  }}>
                    <Typography variant="body2" color="success.dark" sx={{ fontWeight: 600 }}>
                      ✅ Sua assinatura está ativa e todos os recursos premium estão disponíveis
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recursos Premium */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <StarIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recursos Ativos
                  </Typography>
                </Box>

                <List disablePadding>
                  {premiumFeatures.map((feature, index) => (
                    <ListItem 
                      key={index} 
                      disablePadding 
                      sx={{ 
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        background: feature.active 
                          ? 'rgba(76, 175, 80, 0.05)' 
                          : 'rgba(0, 0, 0, 0.02)',
                        border: '1px solid',
                        borderColor: feature.active 
                          ? 'success.light' 
                          : 'grey.200'
                      }}
                    >
                      <ListItemIcon>
                        {feature.active ? (
                          <CheckIcon color="success" />
                        ) : (
                          feature.icon
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={feature.title}
                        secondary={feature.description}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          color: feature.active ? 'success.dark' : 'text.primary'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Ações */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Gerenciar Assinatura
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexDirection: isMobile ? 'column' : 'row',
                  flexWrap: 'wrap'
                }}>
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={onUpdatePayment}
                    disabled={isLoading}
                    sx={{ borderRadius: 2 }}
                  >
                    Alterar Pagamento
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<ReceiptIcon />}
                    disabled={isLoading}
                    sx={{ borderRadius: 2 }}
                  >
                    Histórico de Faturas
                  </Button>

                  {subscription.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelClick}
                      disabled={isLoading}
                      sx={{ 
                        borderRadius: 2,
                        ml: 'auto'
                      }}
                    >
                      Cancelar Assinatura
                    </Button>
                  )}
                </Box>

                {isLoading && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress sx={{ borderRadius: 1 }} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog de Cancelamento */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon color="warning" sx={{ mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Cancelar Assinatura Premium
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Você tem certeza?
              </Typography>
              Ao cancelar, você perderá acesso a todos os recursos premium:
              <List dense sx={{ mt: 1 }}>
                <ListItem dense>
                  <ListItemText primary="• Notificações inteligentes" />
                </ListItem>
                <ListItem dense>
                  <ListItemText primary="• Backup na nuvem" />
                </ListItem>
                <ListItem dense>
                  <ListItemText primary="• Relatórios detalhados" />
                </ListItem>
                <ListItem dense>
                  <ListItemText primary="• Histórico ilimitado" />
                </ListItem>
              </List>
            </Alert>

            <DialogContentText>
              Sua assinatura permanecerá ativa até{' '}
              <strong>
                {new Date(subscription.nextBillingDate).toLocaleDateString('pt-BR')}
              </strong>
              , quando será cancelada automaticamente.
            </DialogContentText>

            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Você pode reativar sua assinatura premium a qualquer momento.
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setCancelDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Manter Assinatura
            </Button>
            <Button 
              onClick={handleCancelConfirm}
              color="error" 
              variant="contained"
              disabled={isLoading}
              sx={{ borderRadius: 2 }}
            >
              {isLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  )
}

export default SubscriptionManagement
