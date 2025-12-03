'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  School,
  CalendarToday,
  People,
  TrendingUp,
  Assignment,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import StatsCard from '@/components/StatsCard/StatsCard';

export default function AcademyPage() {
  // Mock data for the academy
  const batches = [
    {
      id: 1,
      name: 'Turma 2024-2',
      startDate: '2024-08-01',
      endDate: '2024-12-15',
      participants: 15,
      progress: 75,
      status: 'Em Andamento',
      areas: ['Desenvolvimento', 'UX/UI Design', 'QA']
    },
    {
      id: 2,
      name: 'Turma 2024-1',
      startDate: '2024-03-01',
      endDate: '2024-07-15',
      participants: 18,
      progress: 100,
      status: 'Concluída',
      areas: ['Desenvolvimento', 'Data Science', 'Product']
    },
    {
      id: 3,
      name: 'Turma 2023-2',
      startDate: '2023-08-01',
      endDate: '2023-12-15',
      participants: 12,
      progress: 100,
      status: 'Concluída',
      areas: ['Desenvolvimento', 'UX/UI Design']
    }
  ];

  const modules = [
    { name: 'Fundamentos', completed: 100, total: 15 },
    { name: 'Tecnologias Core', completed: 85, total: 20 },
    { name: 'Projetos Práticos', completed: 60, total: 25 },
    { name: 'Soft Skills', completed: 90, total: 12 },
    { name: 'Metodologias Ágeis', completed: 75, total: 8 }
  ];

  const progressData = modules.map(module => ({
    name: module.name,
    completed: (module.completed / module.total) * 100,
    total: 100
  }));

  const batchDistribution = [
    { name: 'Em Andamento', value: 1, color: '#1976d2' },
    { name: 'Concluídas', value: 2, color: '#2e7d32' },
    { name: 'Planejadas', value: 1, color: '#ed6c02' }
  ];

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento': return '#1976d2';
      case 'Concluída': return '#2e7d32';
      case 'Planejada': return '#ed6c02';
      default: return '#666';
    }
  };

  const totalParticipants = batches.reduce((sum, batch) => sum + batch.participants, 0);
  const activeBatches = batches.filter(batch => batch.status === 'Em Andamento').length;
  const completedBatches = batches.filter(batch => batch.status === 'Concluída').length;
  const averageProgress = Math.round(batches.reduce((sum, batch) => sum + batch.progress, 0) / batches.length);

  return (
    <ProtectedRoute>
      <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a' }}>
          Academia
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Gestão de turmas e progresso da incubadora
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total de Turmas"
            value={batches.length}
            subtitle="Histórico completo"
            trend="up"
            trendValue="+1 este semestre"
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Turmas Ativas"
            value={activeBatches}
            subtitle="Em formação"
            trend="neutral"
            trendValue="Estável"
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total de Alunos"
            value={totalParticipants}
            subtitle="Todos os períodos"
            trend="up"
            trendValue="+25% este ano"
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Progresso Médio"
            value={`${averageProgress}%`}
            subtitle="Turmas ativas"
            trend="up"
            trendValue="+10% este mês"
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Batch Progress Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Progresso por Módulo
            </Typography>
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Progresso']} />
                  <Bar dataKey="completed" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Batch Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Status das Turmas
            </Typography>
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={batchDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {batchDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Batches List */}
        <Grid item xs={12}>
          <Paper sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Turmas da Incubadora
              </Typography>
            </Box>
            <Grid container spacing={0}>
              {batches.map((batch, index) => (
                <Grid item xs={12} key={batch.id}>
                  <Card sx={{ m: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {batch.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarToday sx={{ fontSize: 16, color: '#666' }} />
                              <Typography variant="body2" color="textSecondary">
                                {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <People sx={{ fontSize: 16, color: '#666' }} />
                              <Typography variant="body2" color="textSecondary">
                                {batch.participants} participantes
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {batch.areas.map((area, areaIndex) => (
                              <Chip
                                key={areaIndex}
                                label={area}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))}
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip
                            label={batch.status}
                            sx={{
                              backgroundColor: batch.status === 'Em Andamento' ? '#e3f2fd' :
                                              batch.status === 'Concluída' ? '#e8f5e8' : '#fff3e0',
                              color: getStatusColor(batch.status),
                              fontWeight: 500,
                              mb: 1
                            }}
                          />
                          <Box sx={{ minWidth: 120 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                {batch.progress}%
                              </Typography>
                              <TrendingUp sx={{ fontSize: 16, color: '#2e7d32' }} />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={batch.progress}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: batch.progress === 100 ? '#2e7d32' : 
                                                 batch.progress >= 75 ? '#1976d2' : '#ed6c02',
                                  borderRadius: 4
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  {index < batches.length - 1 && <Divider />}
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Modules Progress */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Módulos do Programa
            </Typography>
            <List>
              {modules.map((module, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Assignment sx={{ color: '#1976d2' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {module.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {module.completed}/{module.total}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <LinearProgress
                        variant="determinate"
                        value={(module.completed / module.total) * 100}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: (module.completed / module.total) >= 0.8 ? '#2e7d32' :
                                           (module.completed / module.total) >= 0.6 ? '#1976d2' : '#ed6c02',
                            borderRadius: 3
                          }
                        }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Informações da Academia
            </Typography>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <School sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Duração do Programa"
                  secondary="16 semanas intensivas"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Schedule sx={{ color: '#2e7d32' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Carga Horária"
                  secondary="320 horas (20h/semana)"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: '#ed6c02' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Taxa de Conclusão"
                  secondary="85% dos participantes"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <TrendingUp sx={{ color: '#9c27b0' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Taxa de Contratação"
                  secondary="78% pós-formação"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
    </ProtectedRoute>
  );
}