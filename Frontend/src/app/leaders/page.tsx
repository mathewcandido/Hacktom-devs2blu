'use client';

import React, { useEffect, useState } from 'react';
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
  LinearProgress
} from '@mui/material';
import {
  SupervisorAccount,
  Person,
  Business,
  TrendingUp
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { getLeaders } from '@/services/api';
import { Leader } from '@/types';
import { areaColors } from '@/mocks/status';

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaders();
        setLeaders(data);
      } catch (error) {
        console.error('Error fetching leaders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Typography>Carregando líderes...</Typography>
      </Layout>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const totalInterested = leaders.reduce((sum, leader) => sum + leader.interestedParticipants.length, 0);
  const totalReserved = leaders.reduce((sum, leader) => sum + leader.reservedParticipants.length, 0);
  const mostActiveLeader = leaders.reduce((prev, current) => 
    (prev.interestedParticipants.length + prev.reservedParticipants.length) > 
    (current.interestedParticipants.length + current.reservedParticipants.length) ? prev : current
  );

  return (
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
            value={leaders.length}
            subtitle="Ativos na plataforma"
            trend="up"
            trendValue="+2 este mês"
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Interesses Sinalizados"
            value={totalInterested}
            subtitle="Total de sinalizações"
            trend="up"
            trendValue="+15% esta semana"
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Reservas Ativas"
            value={totalReserved}
            subtitle="Talentos reservados"
            trend="neutral"
            trendValue="Estável"
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Líder + Ativo"
            value={mostActiveLeader.name.split(' ')[0]}
            subtitle={`${mostActiveLeader.interestedParticipants.length + mostActiveLeader.reservedParticipants.length} ações`}
            trend="up"
            trendValue="Mais engajado"
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Leaders Table */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Lista de Líderes
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Líder</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Área</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Departamento</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Interessados</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reservados</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Engajamento</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Desde</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaders.map((leader) => {
                const totalActions = leader.interestedParticipants.length + leader.reservedParticipants.length;
                const engagementLevel = totalActions >= 5 ? 'Alto' : totalActions >= 2 ? 'Médio' : 'Baixo';
                const engagementColor = totalActions >= 5 ? '#2e7d32' : totalActions >= 2 ? '#ed6c02' : '#d32f2f';

                return (
                  <TableRow 
                    key={leader.id}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      '&:last-child td': { border: 0 }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={leader.photo}
                          sx={{ width: 40, height: 40 }}
                        >
                          <SupervisorAccount />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {leader.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
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
                          backgroundColor: areaColors[leader.area].background,
                          color: areaColors[leader.area].color,
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2">
                          {leader.department}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {leader.interestedParticipants.length}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {leader.reservedParticipants.length}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: 100 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '0.75rem',
                              color: engagementColor,
                              fontWeight: 600
                            }}
                          >
                            {engagementLevel}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {totalActions}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((totalActions / 10) * 100, 100)}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: engagementColor,
                              borderRadius: 2
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(leader.joinDate)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Atividade Recente
            </Typography>
            <Box sx={{ mt: 2 }}>
              {leaders.slice(0, 5).map((leader, index) => (
                <Card key={leader.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={leader.photo} sx={{ width: 32, height: 32 }}>
                          <SupervisorAccount />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {leader.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {leader.department}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">
                          {leader.interestedParticipants.length} interessados • {leader.reservedParticipants.length} reservados
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Último acesso há {Math.floor(Math.random() * 5) + 1} dias
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}