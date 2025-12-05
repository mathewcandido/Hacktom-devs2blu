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
  FormHelperText,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  School,
  CalendarToday,
  Group,
  Person,
} from "@mui/icons-material";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "../ProtectedRoute";
import { EnumArea } from "@/types";

interface BatchFormData {
  name: string;
  area: EnumArea | "";
  startDate: string;
  endDate: string;
  maxStudents: number;
  description: string;
  instructor: string;
  schedule: string;
  location: string;
}

const RegisterBatchScreen: React.FC = () => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<BatchFormData>({
    name: "",
    area: "",
    startDate: "",
    endDate: "",
    maxStudents: 25,
    description: "",
    instructor: "",
    schedule: "",
    location: "",
  });

  const handleInputChange = (field: keyof BatchFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'maxStudents' ? Number(value) : value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Simular salvamento
    console.log("Dados da turma:", formData);
    
    // Mostrar mensagem de sucesso
    setShowSuccess(true);
    
    // Resetar formulário após 2 segundos
    setTimeout(() => {
      setFormData({
        name: "",
        area: "",
        startDate: "",
        endDate: "",
        maxStudents: 25,
        description: "",
        instructor: "",
        schedule: "",
        location: "",
      });
      setShowSuccess(false);
    }, 2000);
  };

  const isFormValid = () => {
    return formData.name && formData.area && formData.startDate && 
           formData.endDate && formData.instructor;
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
              <School color="primary" />
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#1a1a1a",
                  fontSize: { xs: '18px', sm: '18px', md: '24px' }
                }}
              >
                Cadastrar Nova Turma
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="body1" 
            color="textSecondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Preencha os dados para criar uma nova turma de formação
          </Typography>
        </Box>

        {/* Success Alert */}
        {showSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setShowSuccess(false)}
          >
            Turma cadastrada com sucesso! 🎉
          </Alert>
        )}

        {/* Form */}
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, maxWidth: 800, mx: "auto" }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {/* Nome da Turma */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Nome da Turma"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                  placeholder="Ex: Turma 2025.1 - Full Stack Development"
                  InputProps={{
                    startAdornment: <Group sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Área */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Área de Formação</InputLabel>
                  <Select
                    value={formData.area}
                    label="Área de Formação"
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

              {/* Datas */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Início"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange('startDate')}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Término"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange('endDate')}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Instrutor */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Instrutor Responsável"
                  value={formData.instructor}
                  onChange={handleInputChange('instructor')}
                  required
                  placeholder="Nome do instrutor"
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Máximo de Alunos */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Máximo de Alunos"
                  type="number"
                  value={formData.maxStudents}
                  onChange={handleInputChange('maxStudents')}
                  inputProps={{ min: 1, max: 50 }}
                  helperText="Limite de participantes"
                />
              </Grid>

              {/* Horário */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Horário das Aulas"
                  value={formData.schedule}
                  onChange={handleInputChange('schedule')}
                  placeholder="Ex: Seg a Sex, 19h às 22h"
                />
              </Grid>

              {/* Local */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Local/Modalidade"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  placeholder="Ex: Presencial - Sala 101 / Online"
                />
              </Grid>

              {/* Descrição */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição da Turma"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="Descreva os objetivos, tecnologias que serão abordadas, pré-requisitos, etc..."
                />
              </Grid>

              {/* Preview */}
              {formData.area && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Preview da Turma:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={formData.area.replace('_', ' ')} size="small" color="primary" />
                      {formData.maxStudents && (
                        <Chip label={`${formData.maxStudents} vagas`} size="small" variant="outlined" />
                      )}
                      {formData.location && (
                        <Chip label={formData.location} size="small" variant="outlined" />
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
                    Cadastrar Turma
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

export default RegisterBatchScreen;