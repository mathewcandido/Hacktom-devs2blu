'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { EnumArea, EnumParticipantStatus } from '../../types';

interface ParticipantFormData {
  name: string;
  email: string;
  phone: string;
  area: EnumArea | '';
  batch: string;
  status: EnumParticipantStatus;
  skills: string[];
  bio: string;
  photo: string;
}

const initialFormData: ParticipantFormData = {
  name: '',
  email: '',
  phone: '',
  area: '',
  batch: '',
  status: EnumParticipantStatus.IN_TRAINING,
  skills: [],
  bio: '',
  photo: '',
};

const steps = ['Informações Básicas', 'Área e Habilidades', 'Informações Adicionais'];

const predefinedSkills = [
  // Desenvolvimento
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'Go', 'PHP', 'Ruby',
  'HTML', 'CSS', 'Sass', 'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL',
  
  // Design
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 
  'Prototyping', 'User Research', 'Wireframing', 'Design Systems', 'UI/UX Design',
  
  // QA
  'Test Automation', 'Selenium', 'Cypress', 'Jest', 'Postman', 'API Testing', 'Performance Testing',
  'Manual Testing', 'Bug Tracking', 'Test Planning', 'Quality Assurance',
  
  // Data Science
  'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'Statistics', 'Data Visualization',
  'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Tableau', 'Power BI', 'Excel',
  
  // Product & Marketing
  'Product Management', 'Scrum', 'Agile', 'Analytics', 'A/B Testing', 'Market Research',
  'Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Email Marketing',
];

const RegisterParticipantScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ParticipantFormData>(initialFormData);
  const [skillInput, setSkillInput] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ParticipantFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (field: keyof ParticipantFormData) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddPredefinedSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Informações Básicas
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        break;
        
      case 1: // Área e Habilidades
        if (!formData.area) newErrors.area = 'Área é obrigatória';
        if (!formData.batch.trim()) newErrors.batch = 'Turma é obrigatória';
        if (formData.skills.length === 0) newErrors.skills = 'Adicione pelo menos uma habilidade';
        break;
        
      case 2: // Informações Adicionais
        if (!formData.bio.trim()) newErrors.bio = 'Biografia é obrigatória';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      console.log('📝 Cadastrando participante:', formData);
      setSuccessMessage('Participante cadastrado com sucesso!');
      
      // Reset form
      setTimeout(() => {
        setFormData(initialFormData);
        setActiveStep(0);
        setSuccessMessage('');
      }, 2000);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Informações Básicas
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon /> Informações Pessoais
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="(11) 99999-9999"
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL da Foto (Opcional)"
                value={formData.photo}
                onChange={handleInputChange('photo')}
                placeholder="https://exemplo.com/foto.jpg"
              />
            </Grid>
          </Grid>
        );

      case 1: // Área e Habilidades
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon /> Área de Atuação e Habilidades
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.area}>
                <InputLabel>Área de Especialização</InputLabel>
                <Select
                  value={formData.area}
                  label="Área de Especialização"
                  onChange={handleSelectChange('area')}
                >
                  <MenuItem value={EnumArea.DEVELOPMENT}>Desenvolvimento</MenuItem>
                  <MenuItem value={EnumArea.UX_DESIGN}>UX/UI Design</MenuItem>
                  <MenuItem value={EnumArea.QA}>Quality Assurance</MenuItem>
                  <MenuItem value={EnumArea.DATA_SCIENCE}>Data Science</MenuItem>
                  <MenuItem value={EnumArea.PRODUCT}>Product Management</MenuItem>
                  <MenuItem value={EnumArea.MARKETING}>Marketing Digital</MenuItem>
                </Select>
                {errors.area && <Typography variant="caption" color="error">{errors.area}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Turma/Batch"
                value={formData.batch}
                onChange={handleInputChange('batch')}
                error={!!errors.batch}
                helperText={errors.batch}
                placeholder="Ex: Turma 2024-01"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={handleSelectChange('status')}
                >
                  <MenuItem value={EnumParticipantStatus.IN_TRAINING}>Em Treinamento</MenuItem>
                  <MenuItem value={EnumParticipantStatus.AVAILABLE}>Disponível</MenuItem>
                  <MenuItem value={EnumParticipantStatus.RESERVED}>Reservado</MenuItem>
                  <MenuItem value={EnumParticipantStatus.HIRED}>Contratado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Adicionar Habilidades */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                <TextField
                  fullWidth
                  label="Adicionar Habilidade"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddSkill}
                  startIcon={<AddIcon />}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  {isMobile ? '' : 'Adicionar'}
                </Button>
              </Box>
              
              {errors.skills && (
                <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>
                  {errors.skills}
                </Typography>
              )}
              
              {/* Habilidades Adicionadas */}
              {formData.skills.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Habilidades Selecionadas:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="primary"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {/* Habilidades Sugeridas */}
              <Typography variant="subtitle2" gutterBottom>
                Habilidades Sugeridas:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: 200, overflowY: 'auto' }}>
                {predefinedSkills
                  .filter(skill => !formData.skills.includes(skill))
                  .slice(0, 20)
                  .map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onClick={() => handleAddPredefinedSkill(skill)}
                      variant="outlined"
                      size="small"
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 2: // Informações Adicionais
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CodeIcon /> Informações Adicionais
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Biografia/Descrição"
                value={formData.bio}
                onChange={handleInputChange('bio')}
                error={!!errors.bio}
                helperText={errors.bio || 'Conte um pouco sobre você, seus objetivos e experiências'}
                placeholder="Descreva sua experiência, objetivos de carreira, projetos relevantes..."
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const renderPreview = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Avatar
            src={formData.photo || undefined}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          >
            {formData.name.charAt(0)}
          </Avatar>
          <Typography variant="h6">{formData.name}</Typography>
          <Typography variant="body2" color="text.secondary">{formData.email}</Typography>
          <Typography variant="body2" color="text.secondary">{formData.phone}</Typography>
        </Box>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>Informações Profissionais</Typography>
        <Typography><strong>Área:</strong> {formData.area}</Typography>
        <Typography><strong>Turma:</strong> {formData.batch}</Typography>
        <Typography><strong>Status:</strong> {formData.status}</Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Habilidades</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {formData.skills.map((skill, index) => (
            <Chip key={index} label={skill} size="small" color="primary" />
          ))}
        </Box>
        
        <Typography variant="h6" gutterBottom>Biografia</Typography>
        <Typography variant="body2">{formData.bio}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Cadastrar Novo Participante
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }} orientation={isMobile ? 'vertical' : 'horizontal'}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Voltar
            </Button>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => setPreviewOpen(true)}
                startIcon={<PreviewIcon />}
                disabled={!formData.name}
              >
                Visualizar
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<SaveIcon />}
                >
                  Cadastrar Participante
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Preview do Participante
          <Button
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          {renderPreview()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegisterParticipantScreen;