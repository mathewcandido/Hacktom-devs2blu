'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Paper
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { getParticipants } from '@/services/api';
import { Participant, ParticipantStatus, Area } from '@/types';
import { statusColors, areaColors } from '@/mocks/status';

export default function Dashboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getParticipants();
        setParticipants(data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Layout><Typography>Carregando...</Typography></Layout>;
  }

  // Stats calculations
  const totalParticipants = participants.length;
  const availableParticipants = participants.filter(p => p.status === ParticipantStatus.AVAILABLE).length;
  const reservedParticipants = participants.filter(p => p.status === ParticipantStatus.RESERVED).length;
  const hiredParticipants = participants.filter(p => p.status === ParticipantStatus.HIRED).length;
  const averageEvolution = Math.round(
    participants.reduce((sum, p) => sum + p.evolution, 0) / participants.length
  );

  // Status distribution for pie chart
  const statusDistribution = [
    {
      name: ParticipantStatus.IN_TRAINING,
      value: participants.filter(p => p.status === ParticipantStatus.IN_TRAINING).length,
      color: statusColors[ParticipantStatus.IN_TRAINING].color
    },
    {
      name: ParticipantStatus.AVAILABLE,
      value: availableParticipants,
      color: statusColors[ParticipantStatus.AVAILABLE].color
    },
    {
      name: ParticipantStatus.RESERVED,
      value: reservedParticipants,
      color: statusColors[ParticipantStatus.RESERVED].color
    },
    {
      name: ParticipantStatus.HIRED,
      value: hiredParticipants,
      color: statusColors[ParticipantStatus.HIRED].color
    }
  ].filter(item => item.value > 0);

  // Area distribution for bar chart
  const areaDistribution = [Area.DEVELOPMENT, Area.UX_DESIGN, Area.QA, Area.DATA_SCIENCE, Area.PRODUCT, Area.MARKETING].map(area => ({
    area: area.split(' ')[0], // Shorten names for better display
    count: participants.filter(p => p.area === area).length,
    color: areaColors[area].color
  }));

  // Evolution by batch
  const uniqueBatches = Array.from(new Set(participants.map(p => p.batch)));
  const evolutionByBatch = uniqueBatches.map(batch => {
    const batchParticipants = participants.filter(p => p.batch === batch);
    const avgEvolution = Math.round(
      batchParticipants.reduce((sum, p) => sum + p.evolution, 0) / batchParticipants.length
    );
    return {
      batch: batch.replace('Turma ', ''),
      evolution: avgEvolution,
      count: batchParticipants.length
    };
  }).sort((a, b) => a.batch.localeCompare(b.batch));

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a' }}>
          Dashboard Geral
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Visão geral da incubadora de talentos
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total de Talentos"
            value={totalParticipants}
            subtitle="Participantes ativos"
            trend="up"
            trendValue="+12% este mês"
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Disponíveis"
            value={availableParticipants}
            subtitle="Prontos para contratação"
            trend="up"
            trendValue="+8% esta semana"
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Reservados"
            value={reservedParticipants}
            subtitle="Em processo seletivo"
            trend="neutral"
            trendValue="Estável"
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Evolução Média"
            value={`${averageEvolution}%`}
            subtitle="Progresso geral"
            trend="up"
            trendValue="+5% este mês"
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Distribuição por Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
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
          </Paper>
        </Grid>

        {/* Area Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Talentos por Área
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="area" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Evolution by Batch */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Evolução Média por Turma
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionByBatch}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="batch" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value: any, name: any) => [`${value}%`, 'Evolução Média']}
                    labelFormatter={(label: any) => `Turma ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="evolution" 
                    stroke="#1976d2" 
                    strokeWidth={3}
                    dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}