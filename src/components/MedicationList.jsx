import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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
  ListItemText,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material'
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  CheckCircle as CheckIcon,
  WatchLater as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  LocalPharmacy as PharmacyIcon,
  FitnessCenter as VitaminIcon,
  History as HistoryIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const MedicationList = ({ medications, onEdit, onDelete, onMarkAsTaken }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    return `${hours}h${minutes}`
  }

  const calculateNextDoses = (medication) => {
    const now = new Date()
    const startDate = parseISO(medication.startDate)
    
    if (medication.scheduleType === 'fixed') {
      // For fixed schedule, calculate next doses based on interval
      const doses = []
      let nextDoseTime = new Date(startDate)
      
      // Find the first dose that hasn't passed yet
      while (nextDoseTime < now) {
        nextDoseTime = new Date(nextDoseTime.getTime() + medication.interval * 60 * 60 * 1000)
      }
      
      // Generate next 3 doses
      for (let i = 0; i < 3; i++) {
        const doseTime = new Date(nextDoseTime.getTime() + i * medication.interval * 60 * 60 * 1000)
        doses.push(doseTime)
      }
      
      return doses
    } else {
      // For variable schedule, find next occurrences of specified times
      const doses = []
      let currentDate = new Date(now)
      currentDate.setHours(0, 0, 0, 0)
      
      // Check today and next few days
      for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        for (const time of medication.times) {
          const [hours, minutes] = time.split(':').map(Number)
          const doseTime = new Date(currentDate)
          doseTime.setHours(hours, minutes, 0, 0)
          
          // Only add if it's in the future
          if (doseTime > now) {
            doses.push(doseTime)
          }
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      // Sort and take only the next 3
      return doses.sort((a, b) => a - b).slice(0, 3)
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PharmacyIcon sx={{ mr: 1.5, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h2">
            Minhas Medicações
          </Typography>
          <Chip 
            label={`${medications.length} itens`} 
            color="primary" 
            sx={{ ml: 2, fontWeight: 'bold' }} 
          />
        </Box>
      </motion.div>
      
      {medications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.light', 
              mx: 'auto', 
              mb: 3 
            }}>
              <PharmacyIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Nenhuma medicação cadastrada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Adicione sua primeira medicação usando o botão +
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(67, 97, 238, 0.3)'
              }}
            >
              Adicionar Medicação
            </Button>
          </Paper>
        </motion.div>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {medications.map((medication, index) => {
            const nextDoses = calculateNextDoses(medication)
            
            return (
              <motion.div
                key={medication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: medication.type === 'medication' ? 'primary.main' : 'secondary.main',
                          mr: 2
                        }}>
                          {medication.type === 'medication' ? <PharmacyIcon /> : <VitaminIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                            {medication.name}
                          </Typography>
                          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                            {medication.dosage}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={medication.type === 'medication' ? 'Medicação' : 'Vitamina'} 
                        size="medium" 
                        color={medication.type === 'medication' ? 'primary' : 'secondary'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1, 
                      mb: 2 
                    }}>
                      <Chip 
                        icon={<ScheduleIcon />}
                        label={medication.scheduleType === 'fixed' ? 'Intervalo fixo' : 'Horários específicos'} 
                        color={medication.scheduleType === 'fixed' ? 'success' : 'info'}
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Chip 
                        icon={<AccessTimeIcon />}
                        label={medication.scheduleType === 'fixed' 
                          ? `A cada ${medication.interval} horas` 
                          : `Horários: ${medication.times.map(formatTime).join(', ')}`}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 2
                    }}>
                      <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        <strong>Início:</strong> {format(parseISO(medication.startDate), "dd/MM/yyyy", { locale: ptBR })}
                      </Typography>
                    </Box>
                    
                    {medication.notes && (
                      <Box sx={{ 
                        mb: 2,
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 2
                      }}>
                        <Typography variant="body1">
                          <strong>Observações:</strong> {medication.notes}
                        </Typography>
                      </Box>
                    )}
                    
                    <Accordion sx={{ mt: 2, borderRadius: 2 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ 
                          bgcolor: 'background.default',
                          borderRadius: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">
                            Próximas doses
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {nextDoses.length > 0 ? (
                          <List>
                            {nextDoses.map((dose, doseIndex) => (
                              <ListItem 
                                key={doseIndex} 
                                sx={{ 
                                  border: '1px solid #ddd', 
                                  borderRadius: 2, 
                                  mb: 1,
                                  p: 2
                                }}
                              >
                                <ListItemText 
                                  primary={format(dose, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                  primaryTypographyProps={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                  }}
                                />
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  startIcon={<CheckIcon />}
                                  onClick={() => onMarkAsTaken(medication.id, dose.toISOString())}
                                  sx={{ 
                                    borderRadius: 2,
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                  }}
                                >
                                  Tomado
                                </Button>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography color="text.secondary">
                            Nenhuma dose futura programada
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                    
                    {medication.history && medication.history.length > 0 && (
                      <Accordion sx={{ mt: 1, borderRadius: 2 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ 
                            bgcolor: 'background.default',
                            borderRadius: 2
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">
                              Histórico recente
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List>
                            {medication.history.slice(-3).reverse().map((entry, entryIndex) => (
                              <ListItem 
                                key={entryIndex} 
                                sx={{ 
                                  border: '1px solid #ddd', 
                                  borderRadius: 2, 
                                  mb: 1,
                                  p: 2
                                }}
                              >
                                <ListItemText 
                                  primary={format(parseISO(entry.time), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                  primaryTypographyProps={{ 
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                  }}
                                />
                                <Chip 
                                  label="Tomado" 
                                  color="success" 
                                  icon={<CheckIcon />} 
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Tooltip title="Editar">
                      <IconButton 
                        onClick={() => onEdit(medication)}
                        color="primary"
                        size="large"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton 
                        onClick={() => onDelete(medication.id)}
                        color="error"
                        size="large"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default MedicationList