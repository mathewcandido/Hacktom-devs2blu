"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  Chip,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Person,
  Email,
  Phone,
  Business,
  LinkedIn,
  GitHub,
  Badge,
} from "@mui/icons-material";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "../ProtectedRoute";
import { EnumArea } from "@/types";

interface LeaderFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  area: EnumArea | "";
  experience: string;
  linkedin: string;
  github: string;
  bio: string;
  skills: string[];
  isActive: boolean;
  canMentor: boolean;
  canInterview: boolean;
}

const RegisterLeaderScreen: React.FC = () => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState<LeaderFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    area: "",
    experience: "",
    linkedin: "",
    github: "",
    bio: "",
    skills: [],
    isActive: true,
    canMentor: true,
    canInterview: true,
  });

  const handleInputChange = (field: keyof LeaderFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Simular salvamento
    console.log("Dados do líder:", formData);
    
    // Mostrar mensagem de sucesso
    setShowSuccess(true);
    
    // Resetar formulário após 2 segundos
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        area: "",
        experience: "",
        linkedin: "",
        github: "",
        bio: "",
        skills: [],
        isActive: true,
        canMentor: true,
        canInterview: true,
      });
      setShowSuccess(false);
    }, 2000);
  };

  const isFormValid = () => {
    return formData.name && formData.email && formData.company && 
           formData.position && formData.area;
  };

  return (
    <ProtectedRoute>
      <Layout>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Badge color="primary" />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#1a1a1a",
                  fontSize: { xs: '18px', sm: '20px', md: '24px' }
                }}
              >
                Cadastrar Novo Líder
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="body1" 
            color="textSecondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Registre um novo líder empresarial para participar da incubadora
          </Typography>
        </Box>

        {/* Success Alert */}
        {showSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setShowSuccess(false)}
          >
            Líder cadastrado com sucesso! 🎉
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, maxWidth: 800, mx: "auto" }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {/* Informações Pessoais */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Informações Pessoais
                </Typography>
              </Grid>

              {/* Nome */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                  placeholder="Ex: Maria Silva Santos"
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Avatar Preview */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                    {formData.name ? formData.name[0].toUpperCase() : '?'}
                  </Avatar>
                </Box>
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  placeholder="email@empresa.com"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Telefone */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="(11) 99999-9999"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Divider */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Informações Profissionais
                </Typography>
              </Grid>

              {/* Empresa */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Empresa"
                  value={formData.company}
                  onChange={handleInputChange('company')}
                  required
                  placeholder="Nome da empresa"
                  InputProps={{
                    startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Cargo */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cargo/Posição"
                  value={formData.position}
                  onChange={handleInputChange('position')}
                  required
                  placeholder="Ex: CTO, Tech Lead, Senior Developer"
                />
              </Grid>

              {/* Área de Atuação */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Área de Especialização</InputLabel>
                  <Select
                    value={formData.area}
                    label="Área de Especialização"
                    onChange={handleInputChange('area')}
                  >
                    {Object.values(EnumArea).map((area) => (
                      <MenuItem key={area} value={area}>
                        {area.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Anos de Experiência */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Anos de Experiência"
                  value={formData.experience}
                  onChange={handleInputChange('experience')}
                  placeholder="Ex: 8 anos"
                />
              </Grid>

              {/* LinkedIn */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={formData.linkedin}
                  onChange={handleInputChange('linkedin')}
                  placeholder="https://linkedin.com/in/usuario"
                  InputProps={{
                    startAdornment: <LinkedIn sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* GitHub */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GitHub"
                  value={formData.github}
                  onChange={handleInputChange('github')}
                  placeholder="https://github.com/usuario"
                  InputProps={{
                    startAdornment: <GitHub sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Skills */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      label="Adicionar Habilidade"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                      placeholder="Ex: React, Node.js, Python"
                      sx={{ flexGrow: 1 }}
                    />
                    <Button variant="outlined" onClick={handleSkillAdd}>
                      Adicionar
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleSkillRemove(skill)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Bio */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Biografia/Resumo Profissional"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange('bio')}
                  placeholder="Descreva sua experiência profissional, conquistas e áreas de interesse para mentoria..."
                />
              </Grid>

              {/* Divider */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Configurações de Participação
                </Typography>
              </Grid>

              {/* Switches */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleInputChange('isActive')}
                        color="primary"
                      />
                    }
                    label="Líder ativo na plataforma"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.canMentor}
                        onChange={handleInputChange('canMentor')}
                        color="primary"
                      />
                    }
                    label="Disponível para mentoria"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.canInterview}
                        onChange={handleInputChange('canInterview')}
                        color="primary"
                      />
                    }
                    label="Disponível para entrevistas"
                  />
                </Box>
              </Grid>

              {/* Preview */}
              {formData.area && formData.company && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Preview do Líder:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={formData.area.replace('_', ' ')} size="small" color="primary" />
                      <Chip label={formData.company} size="small" variant="outlined" />
                      {formData.experience && (
                        <Chip label={`${formData.experience} exp.`} size="small" variant="outlined" />
                      )}
                      {formData.canMentor && (
                        <Chip label="Mentor" size="small" color="success" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                </Grid>
              )}

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: { xs: 'stretch', sm: 'flex-end' },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    sx={{ minWidth: { sm: 120 } }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={!isFormValid()}
                    sx={{ minWidth: { sm: 120 } }}
                  >
                    Cadastrar Líder
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Layout>
    </ProtectedRoute>
  );
};

export default RegisterLeaderScreen;