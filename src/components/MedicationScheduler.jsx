import { useState, useEffect } from 'react'
import { format, parseISO, isToday, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Avatar,
  Badge
} from '@mui/material'
import { 
  CheckCircle as CheckIcon, 
  WatchLater as ScheduleIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  LocalPharmacy as PharmacyIcon,
  FitnessCenter as VitaminIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const MedicationScheduler = ({ medications, onMarkAsTaken }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [nextDoses, setNextDoses] = useState([])

  // Calculate next doses whenever medications change
  useEffect(() => {
    const calculateAllNextDoses = () => {
      const allDoses = []
      const now = new Date()
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      medications.forEach(medication => {
        const startDate = parseISO(medication.startDate)
        
        if (medication.scheduleType === 'fixed') {
          // For fixed schedule, find doses in the next 24 hours
          let doseTime = new Date(startDate)
          
          // Find the first dose
          while (doseTime < now) {
            doseTime = new Date(doseTime.getTime() + medication.interval * 60 * 60 * 1000)
          }
          
          // Add doses in the next 24 hours
          let currentDose = new Date(doseTime)
          while (currentDose < next24Hours) {
            allDoses.push({
              medication,
              time: new Date(currentDose)
            })
            currentDose = new Date(currentDose.getTime() + medication.interval * 60 * 60 * 1000)
          }
        } else {
          // For variable schedule, check for doses in the next 24 hours
          const today = new Date(now)
          today.setHours(0, 0, 0, 0)
          
          // Check today and next few days
          for (let dayOffset = 0; dayOffset <= 2; dayOffset++) {
            const checkDate = new Date(today)
            checkDate.setDate(checkDate.getDate() + dayOffset)
            
            for (const time of medication.times) {
              const [hours, minutes] = time.split(':').map(Number)
              const doseTime = new Date(checkDate)
              doseTime.setHours(hours, minutes, 0, 0)
              
              // For today, if the time has already passed, schedule it for tomorrow instead
              if (dayOffset === 0 && doseTime < now) {
                // Skip today's doses that have already passed
                continue
              }
              
              // Add if it's in the next 24 hours
              if (doseTime >= now && doseTime < next24Hours) {
                allDoses.push({
                  medication,
                  time: doseTime
                })
              }
            }
          }
        }
      })

      // Sort by time
      return allDoses.sort((a, b) => a.time - b.time)
    }

    setNextDoses(calculateAllNextDoses())
  }, [medications])

  const formatTime = (date) => {
    return format(date, "HH:mm", { locale: ptBR })
  }

  const formatDate = (date) => {
    if (isToday(date)) return 'Hoje'
    if (isTomorrow(date)) return 'Amanhã'
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }

  // Calculate time remaining until dose
  const getTimeRemaining = (doseTime) => {
    const now = new Date()
    const diffMs = doseTime - now
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes} minutos`
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: isMobile ? 2 : 3, 
        mb: 4,
        background: 'linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%)',
        borderRadius: 3
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ScheduleIcon sx={{ mr: 1.5, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h2">
            Próximas Medicações
          </Typography>
          <Chip 
            label={`${nextDoses.length} doses`} 
            color="primary" 
            sx={{ ml: 2, fontWeight: 'bold' }} 
          />
        </Box>
        
        {nextDoses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.light', 
              mx: 'auto', 
              mb: 3 
            }}>
              <ScheduleIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Nenhuma medicação programada
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Adicione medicações para ver suas próximas doses
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={isMobile ? 2 : 3}>
            {nextDoses.map((dose, index) => {
              const timeRemaining = getTimeRemaining(dose.time)
              const isUrgent = dose.time - new Date() < 2 * 60 * 60 * 1000 // Less than 2 hours
              
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: isUrgent ? '2px solid #f44336' : '1px solid #ddd',
                        position: 'relative'
                      }}
                    >
                      {isUrgent && (
                        <Badge 
                          badgeContent="Urgente" 
                          color="error"
                          sx={{ 
                            position: 'absolute',
                            right: 16,
                            top: 16
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: dose.medication.type === 'medication' ? 'primary.main' : 'secondary.main',
                            mr: 2
                          }}>
                            {dose.medication.type === 'medication' ? <PharmacyIcon /> : <VitaminIcon />}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                              {dose.medication.name}
                            </Typography>
                            <Typography color="text.secondary">
                              {dose.medication.dosage}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatTime(dose.time)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            {formatDate(dose.time)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Tempo restante
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {timeRemaining}
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, Math.max(0, 100 - (dose.time - new Date()) / (24 * 60 * 60 * 1000) * 100))}
                            color={isUrgent ? "error" : "primary"}
                          />
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          fullWidth
                          startIcon={<CheckIcon />}
                          onClick={() => onMarkAsTaken(dose.medication.id, dose.time.toISOString())}
                          sx={{ 
                            mt: 2,
                            py: 1.5,
                            borderRadius: 3,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          Marcar como tomado
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              )
            })}
          </Grid>
        )}
      </motion.div>
    </Paper>
  )
}

export default MedicationScheduler