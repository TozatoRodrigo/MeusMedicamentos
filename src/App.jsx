import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  AppBar, 
  Toolbar, 
  CssBaseline,
  ThemeProvider,
  createTheme,
  Fab,
  Badge,
  styled,
  keyframes,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import { 
  Add as AddIcon, 
  LocalPharmacy as PharmacyIcon, 
  Notifications as NotificationsIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import './App.css'
import MedicationForm from './components/MedicationForm'
import MedicationList from './components/MedicationList'
import MedicationScheduler from './components/MedicationScheduler'
import PremiumFeatures from './components/PremiumFeatures'
import SubscriptionManagement from './components/SubscriptionManagement'

// Create a professional theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4361ee',
      light: '#4895ef',
      dark: '#3f37c9',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#4cc9f0',
      light: '#48cae4',
      dark: '#4361ee',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    },
    success: {
      main: '#4caf50',
      light: '#66bb6a',
      dark: '#388e3c',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#ff9800',
      light: '#ffa726',
      dark: '#f57c00',
      contrastText: '#ffffff'
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
      contrastText: '#ffffff'
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
      disabled: '#adb5bd'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        contained: {
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }
      }
    }
  }
})

// Create a pulse animation for the notification badge
const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgba(255, 77, 79, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
  }
`

const AnimatedFab = styled(Fab)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  width: 64,
  height: 64,
  '& .MuiSvgIcon-root': {
    fontSize: '2rem'
  }
}))

function App() {
  const [medications, setMedications] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingMedication, setEditingMedication] = useState(null)
  const [upcomingDosesCount, setUpcomingDosesCount] = useState(0)
  const [currentView, setCurrentView] = useState('medications') // medications, premium, subscription
  const [userSubscription, setUserSubscription] = useState(null)
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null)

  // Load medications and subscription from localStorage on initial render
  useEffect(() => {
    const savedMedications = localStorage.getItem('medications')
    if (savedMedications) {
      setMedications(JSON.parse(savedMedications))
    }

    const savedSubscription = localStorage.getItem('userSubscription')
    if (savedSubscription) {
      setUserSubscription(JSON.parse(savedSubscription))
    }
  }, [])

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications))
  }, [medications])

  // Save subscription to localStorage whenever it changes
  useEffect(() => {
    if (userSubscription) {
      localStorage.setItem('userSubscription', JSON.stringify(userSubscription))
    } else {
      localStorage.removeItem('userSubscription')
    }
  }, [userSubscription])

  // Calculate upcoming doses count
  useEffect(() => {
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    let count = 0
    medications.forEach(medication => {
      // Simplified calculation for demo purposes
      count += 1 // In a real app, this would be more complex
    })
    
    setUpcomingDosesCount(count)
  }, [medications])

  const addMedication = (medication) => {
    setMedications(prev => [...prev, { ...medication, id: Date.now() }])
    setShowForm(false)
  }

  const updateMedication = (updatedMedication) => {
    setMedications(prev => 
      prev.map(med => med.id === updatedMedication.id ? updatedMedication : med)
    )
    setEditingMedication(null)
    setShowForm(false)
  }

  const deleteMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id))
  }

  const startEdit = (medication) => {
    setEditingMedication(medication)
    setShowForm(true)
  }

  const markAsTaken = (id, time) => {
    setMedications(prev => 
      prev.map(med => {
        if (med.id === id) {
          const newHistory = [...(med.history || []), { time, taken: true }]
          return { ...med, history: newHistory }
        }
        return med
      })
    )
  }

  const handleSubscribe = (subscriptionData) => {
    setUserSubscription(subscriptionData)
    setCurrentView('medications')
  }

  const handleCancelSubscription = async (reason) => {
    // Aqui você faria a chamada para cancelar no Stripe
    console.log('Cancelando assinatura:', reason)
    
    // Simular cancelamento
    setTimeout(() => {
      setUserSubscription(prev => ({
        ...prev,
        status: 'canceled',
        canceledAt: new Date().toISOString(),
        cancelReason: reason
      }))
    }, 1000)
  }

  const handleUpdatePayment = async () => {
    // Aqui você redirecionaria para o portal do cliente do Stripe
    console.log('Atualizando método de pagamento')
  }

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget)
  }

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null)
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
    handleAccountMenuClose()
  }

  const isPremium = userSubscription?.status === 'active'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AppBar 
          position="static" 
          color="primary"
          elevation={0}
          sx={{ 
            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PharmacyIcon sx={{ mr: 1.5, fontSize: '2rem' }} />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontWeight: 700 }}
              >
                Meus Medicamentos
              </Typography>
              {isPremium && (
                <Box
                  component={motion.div}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Chip 
                    label="PREMIUM" 
                    size="small" 
                    sx={{ 
                      ml: 2,
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: 'black',
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                    }} 
                  />
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge 
                badgeContent={upcomingDosesCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: upcomingDosesCount > 0 ? `${pulse} 2s infinite` : 'none'
                  }
                }}
              >
                <NotificationsIcon sx={{ color: 'white' }} />
              </Badge>

              <IconButton
                onClick={handleAccountMenuOpen}
                sx={{ color: 'white' }}
              >
                <AccountIcon />
              </IconButton>

              <Menu
                anchorEl={accountMenuAnchor}
                open={Boolean(accountMenuAnchor)}
                onClose={handleAccountMenuClose}
                PaperProps={{
                  sx: { borderRadius: 2, mt: 1 }
                }}
              >
                <MenuItem onClick={() => handleViewChange('medications')}>
                  <PharmacyIcon sx={{ mr: 2 }} />
                  Medicações
                </MenuItem>
                
                <MenuItem onClick={() => handleViewChange('premium')}>
                  <StarIcon sx={{ mr: 2 }} />
                  {isPremium ? 'Recursos Premium' : 'Assinar Premium'}
                </MenuItem>
                
                {userSubscription && (
                  <MenuItem onClick={() => handleViewChange('subscription')}>
                    <SettingsIcon sx={{ mr: 2 }} />
                    Gerenciar Assinatura
                  </MenuItem>
                )}
                
                <Divider />
                
                <MenuItem onClick={handleAccountMenuClose}>
                  <SettingsIcon sx={{ mr: 2 }} />
                  Configurações
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {currentView === 'medications' && (
            <>
              {showForm && (
                <Box sx={{ mb: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MedicationForm 
                      onSubmit={editingMedication ? updateMedication : addMedication}
                      onCancel={() => {
                        setShowForm(false)
                        setEditingMedication(null)
                      }}
                      initialData={editingMedication}
                    />
                  </motion.div>
                </Box>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <MedicationScheduler 
                  medications={medications} 
                  onMarkAsTaken={markAsTaken}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <MedicationList 
                  medications={medications} 
                  onEdit={startEdit}
                  onDelete={deleteMedication}
                  onMarkAsTaken={markAsTaken}
                />
              </motion.div>
            </>
          )}

          {currentView === 'premium' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PremiumFeatures 
                userSubscription={userSubscription}
                onSubscribe={handleSubscribe}
              />
            </motion.div>
          )}

          {currentView === 'subscription' && userSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SubscriptionManagement
                subscription={userSubscription}
                onCancelSubscription={handleCancelSubscription}
                onUpdatePayment={handleUpdatePayment}
              />
            </motion.div>
          )}
        </Container>
        
        {currentView === 'medications' && (
          <AnimatedFab 
            color="primary" 
            aria-label="add" 
            onClick={() => setShowForm(true)}
          >
            <AddIcon />
          </AnimatedFab>
        )}
      </motion.div>
    </ThemeProvider>
  )
}

export default App