import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
  IconButton,
  Chip,
  Paper,
  Divider,
  FormHelperText,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material'
import { 
  Delete as DeleteIcon, 
  Add as AddIcon,
  LocalPharmacy as PharmacyIcon,
  FitnessCenter as VitaminIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const MedicationForm = ({ onSubmit, onCancel, initialData }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    type: 'medication', // medication or vitamin
    scheduleType: 'fixed', // fixed or variable
    interval: 12, // hours for fixed schedule
    times: [getRoundedTime()], // for variable schedule, default to next rounded time
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const [errors, setErrors] = useState({})

  // Get the current time rounded to the next 15-minute interval
  function getRoundedTime() {
    const now = new Date()
    // Round to next 15 minutes
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15)
    now.setSeconds(0)
    now.setMilliseconds(0)
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: initialData.startDate || new Date().toISOString().split('T')[0]
      })
    }
  }, [initialData])

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosagem é obrigatória'
    }
    
    if (formData.scheduleType === 'variable') {
      if (formData.times.some(time => !time)) {
        newErrors.times = 'Todos os horários são obrigatórios'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'interval' ? parseInt(value) : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleTimesChange = (index, value) => {
    const newTimes = [...formData.times]
    newTimes[index] = value
    setFormData(prev => ({ ...prev, times: newTimes }))
    
    // Clear error when user starts typing
    if (errors.times) {
      setErrors(prev => ({ ...prev, times: '' }))
    }
  }

  const addTime = () => {
    setFormData(prev => ({ ...prev, times: [...prev.times, getRoundedTime()] }))
  }

  const removeTime = (index) => {
    if (formData.times.length <= 1) return
    const newTimes = formData.times.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, times: newTimes }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: isMobile ? 2 : 4,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%)',
        borderRadius: 3
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {formData.type === 'medication' ? (
            <PharmacyIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          ) : (
            <VitaminIcon sx={{ fontSize: 32, mr: 2, color: 'secondary.main' }} />
          )}
          <Typography variant="h4" component="h2">
            {initialData ? 'Editar Medicação' : 'Nova Medicação'}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nome do medicamento/vitamina"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Dosagem"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            error={!!errors.dosage}
            helperText={errors.dosage || "Ex: 1 comprimido, 10ml, etc."}
            required
            margin="normal"
            variant="outlined"
          />
          
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Tipo</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Tipo"
            >
              <MenuItem value="medication">Medicação</MenuItem>
              <MenuItem value="vitamin">Vitamina/Suplemento</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Data de início"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          
          <FormControl component="fieldset" margin="normal">
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Tipo de agendamento
            </Typography>
            <RadioGroup
              row={!isMobile}
              name="scheduleType"
              value={formData.scheduleType}
              onChange={handleChange}
            >
              <FormControlLabel 
                value="fixed" 
                control={<Radio />} 
                label="Intervalo fixo" 
                sx={{ 
                  p: 2, 
                  border: '1px solid #ddd', 
                  borderRadius: 2, 
                  mr: 2,
                  mb: isMobile ? 1 : 0
                }}
              />
              <FormControlLabel 
                value="variable" 
                control={<Radio />} 
                label="Horários específicos" 
                sx={{ 
                  p: 2, 
                  border: '1px solid #ddd', 
                  borderRadius: 2,
                  mb: isMobile ? 1 : 0
                }}
              />
            </RadioGroup>
          </FormControl>
          
          {formData.scheduleType === 'fixed' ? (
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Intervalo (horas)</InputLabel>
              <Select
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                label="Intervalo (horas)"
              >
                <MenuItem value={6}>A cada 6 horas</MenuItem>
                <MenuItem value={8}>A cada 8 horas</MenuItem>
                <MenuItem value={12}>A cada 12 horas</MenuItem>
                <MenuItem value={24}>Uma vez por dia</MenuItem>
                <MenuItem value={48}>A cada 2 dias</MenuItem>
                <MenuItem value={72}>A cada 3 dias</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Horários:
              </Typography>
              
              <Alert 
                severity="info" 
                icon={<InfoIcon />}
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  Dica
                </Typography>
                Os horários serão agendados para hoje e nos próximos dias. 
                Se você definir um horário que já passou hoje, ele será agendado para amanhã.
              </Alert>
              
              {formData.times.map((time, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    type="time"
                    value={time}
                    onChange={(e) => handleTimesChange(index, e.target.value)}
                    error={!!errors.times}
                    sx={{ mr: 2, flexGrow: 1 }}
                    variant="outlined"
                  />
                  {formData.times.length > 1 && (
                    <IconButton 
                      color="error" 
                      onClick={() => removeTime(index)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              {errors.times && (
                <FormHelperText error>{errors.times}</FormHelperText>
              )}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addTime}
                sx={{ mt: 1 }}
              >
                Adicionar horário
              </Button>
            </Box>
          )}
          
          <TextField
            fullWidth
            label="Observações"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Instruções especiais, efeitos colaterais, etc."
            margin="normal"
            variant="outlined"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={onCancel}
              size="large"
              sx={{ 
                px: 4,
                borderRadius: 3,
                borderWidth: 2
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              type="submit"
              color="primary"
              size="large"
              sx={{ 
                px: 4,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(67, 97, 238, 0.3)'
              }}
            >
              {initialData ? 'Atualizar' : 'Adicionar'}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Paper>
  )
}

export default MedicationForm