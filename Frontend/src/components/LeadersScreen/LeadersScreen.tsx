'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  SupervisorAccount,
  Person,
  Business,
  TrendingUp
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '../ProtectedRoute';
import StatsCard from '@/components/StatsCard/StatsCard';
import { Leader } from '@/types';

export interface LeadersScreenProps {
  leaders: Leader[];
}

const LeadersScreen: React.FC<LeadersScreenProps> = ({ leaders }) => {
  // Calculate stats
  const totalLeaders = leaders.length;
  const activeLeaders = leaders.filter(leader => 
    leader.interestedParticipants.length > 0 || leader.reservedParticipants.length > 0
  ).length;
  const totalInterested = leaders.reduce((sum, leader) => sum + leader.interestedParticipants.length, 0);
  const totalReserved = leaders.reduce((sum, leader) => sum + leader.reservedParticipants.length, 0);

  // Get departments
  const departments = Array.from(new Set(leaders.map(leader => leader.department)));
  const departmentStats = departments.map(dept => ({
    department: dept,
    count: leaders.filter(leader => leader.department === dept).length,
    interested: leaders.filter(leader => leader.department === dept)
      .reduce((sum, leader) => sum + leader.interestedParticipants.length, 0)
  }));

  // Most active leader
  const mostActiveLeader = leaders.reduce((prev, current) => 
    (current.interestedParticipants.length + current.reservedParticipants.length) > 
    (prev.interestedParticipants.length + prev.reservedParticipants.length) ? current : prev
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getAreaColor = (area: string) => {
    const colors: { [key: string]: string } = {
      'Desenvolvimento': '#1976d2',
      'UX/UI Design': '#7b1fa2',
      'Quality Assurance': '#388e3c',
      'Data Science': '#f57c00',
      'Product Management': '#d32f2f',
      'Marketing Digital': '#0288d1'
    };
    return colors[area] || '#666';
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Líderes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Gestores e líderes de área interessados nos talentos
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total de Líderes"
              value={totalLeaders}
              subtitle="Cadastrados na plataforma"
              trend="up"
              trendValue="+3 este mês"
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Líderes Ativos"
              value={activeLeaders}
              subtitle="Com interesse em talentos"
              trend="up"
              trendValue="+15% esta semana"
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Interesses"
              value={totalInterested}
              subtitle="Total de manifestações"
              trend="up"
              trendValue="+22 hoje"
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Reservas"
              value={totalReserved}
              subtitle="Talentos reservados"
              trend="up"
              trendValue="+8 esta semana"
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Leaders List */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Lista de Líderes
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell>Líder</TableCell>
                      <TableCell>Área</TableCell>
                      <TableCell>Departamento</TableCell>
                      <TableCell align="center">Interessados</TableCell>
                      <TableCell align="center">Reservados</TableCell>
                      <TableCell>Desde</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaders.map((leader) => (
                      <TableRow key={leader.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={leader.photo} sx={{ width: 40, height: 40 }}>
                              {leader.name[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {leader.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {leader.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={leader.area}
                            size="small"
                            sx={{
                              backgroundColor: getAreaColor(leader.area) + '20',
                              color: getAreaColor(leader.area),
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>{leader.department}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={leader.interestedParticipants.length} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={leader.reservedParticipants.length} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{formatDate(leader.joinDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Sidebar Stats */}
          <Grid item xs={12} lg={4}>
            {/* Most Active Leader */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Líder Mais Ativo
              </Typography>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar src={mostActiveLeader.photo} sx={{ width: 50, height: 50 }}>
                    {mostActiveLeader.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {mostActiveLeader.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {mostActiveLeader.area}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">
                    {mostActiveLeader.interestedParticipants.length + mostActiveLeader.reservedParticipants.length} interações
                  </Typography>
                  <TrendingUp color="success" />
                </Box>
              </Card>
            </Paper>

            {/* Department Statistics */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Por Departamento
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {departmentStats.map((dept, index) => (
                  <Card key={index} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {dept.department}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SupervisorAccount sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{dept.count}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        {dept.interested} interesses
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(dept.interested / totalInterested) * 100}
                        sx={{ width: 60, height: 4, borderRadius: 2 }}
                      />
                    </Box>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </ProtectedRoute>
  );
};

export default LeadersScreen;