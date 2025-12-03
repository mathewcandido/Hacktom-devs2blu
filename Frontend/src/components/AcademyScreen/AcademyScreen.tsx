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
import { ProtectedRoute } from '../ProtectedRoute';
import StatsCard from '@/components/StatsCard/StatsCard';

// Interfaces for Academy data
interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  level: string;
  participants: number;
  instructor: string;
  technologies: string[];
  status: string;
  progress?: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  duration: string;
  instructor: string;
  description: string;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  size: string;
  downloads: number;
  category: string;
}

interface AcademyStats {
  totalCourses: number;
  totalParticipants: number;
  activeCourses: number;
  upcomingEvents: number;
}

export interface AcademyScreenProps {
  courses: Course[];
  upcomingEvents: UpcomingEvent[];
  resources: Resource[];
  stats: AcademyStats;
}

const AcademyScreen: React.FC<AcademyScreenProps> = ({ courses, upcomingEvents, resources, stats }) => {
  // Calculate additional stats
  const averageProgress = courses.filter(c => c.progress !== undefined).reduce((sum, course) => sum + (course.progress || 0), 0) / courses.filter(c => c.progress !== undefined).length || 0;

  // Status distribution
  const statusDistribution = [
    { name: 'Ativos', value: courses.filter(c => c.status === 'active').length, color: '#1976d2' },
    { name: 'Concluídos', value: courses.filter(c => c.status === 'completed').length, color: '#2e7d32' },
    { name: 'Em Inscrição', value: courses.filter(c => c.status === 'enrolling').length, color: '#ed6c02' }
  ];

  // Progress by area
  const areaProgress = [
    { area: 'Dev', progress: 85 },
    { area: 'UX/UI', progress: 78 },
    { area: 'QA', progress: 92 },
    { area: 'Data', progress: 73 },
    { area: 'Product', progress: 88 },
    { area: 'Marketing', progress: 81 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'upcoming': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'completed': return 'Concluída';
      case 'upcoming': return 'Próxima';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

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
              title="Total de Cursos"
              value={stats.totalCourses}
              subtitle="Cursos disponíveis"
              trend="up"
              trendValue="+1 este mês"
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Cursos Ativos"
              value={stats.activeCourses}
              subtitle="Em andamento"
              trend="neutral"
              trendValue="Estável"
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Participantes"
              value={stats.totalParticipants}
              subtitle="Total matriculados"
              trend="up"
              trendValue="+15 este mês"
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Eventos Próximos"
              value={stats.upcomingEvents}
              subtitle="Workshops e palestras"
              trend="up"
              trendValue="+2 esta semana"
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Courses List */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Cursos Disponíveis
              </Typography>
              <Grid container spacing={2}>
                {courses.map((course) => (
                  <Grid item xs={12} sm={6} key={course.id}>
                    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {course.name}
                        </Typography>
                        <Chip 
                          label={course.status === 'active' ? 'Ativo' : course.status === 'enrolling' ? 'Inscrições' : 'Completo'} 
                          size="small" 
                          color={getStatusColor(course.status) as any}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="textSecondary">
                            Duração: {course.duration}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="textSecondary">
                            Instrutor: {course.instructor}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Participantes</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {course.participants}
                          </Typography>
                        </Box>
                        {course.progress !== undefined && (
                          <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Progresso</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {course.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={course.progress}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {course.technologies.slice(0, 3).map((tech, index) => (
                          <Chip key={index} label={tech} size="small" variant="outlined" />
                        ))}
                        {course.technologies.length > 3 && (
                          <Chip label={`+${course.technologies.length - 3}`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Upcoming Events */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Próximos Eventos
              </Typography>
              <List sx={{ p: 0 }}>
                {upcomingEvents.slice(0, 3).map((event, index) => (
                  <React.Fragment key={event.id}>
                    <ListItem sx={{ p: 0, mb: 2 }}>
                      <ListItemIcon>
                        <CalendarToday sx={{ color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {event.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(event.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                            <Typography variant="caption" display="block" color="textSecondary">
                              {event.instructor} • {event.duration}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingEvents.slice(0, 3).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            {/* Status Distribution */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Status dos Cursos
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                {statusDistribution.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%' }} />
                    <Typography variant="body2">
                      {item.name}: {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Resources List */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recursos Disponíveis
              </Typography>
              <List sx={{ p: 0 }}>
                {resources.slice(0, 4).map((resource, index) => (
                  <React.Fragment key={resource.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <School color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={resource.title}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              Tipo: {resource.type}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {resource.downloads} downloads • {resource.size}
                            </Typography>
                            <Chip 
                              label={resource.category} 
                              size="small" 
                              variant="outlined" 
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < resources.slice(0, 4).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </ProtectedRoute>
  );
};

export default AcademyScreen;