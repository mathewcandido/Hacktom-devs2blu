"use client";

import React from "react";
import { Grid, Typography, Box, Paper } from "@mui/material";
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
  Line,
  Legend,
} from "recharts";
import Layout from "@/components/Layout";
import StatsCard from "@/components/StatsCard/StatsCard";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Participant, EnumParticipantStatus, EnumArea } from "@/types";
import { statusColors, areaColors } from "@/mocks/status";

export interface DashboardProps {
  participants: Participant[];
  leaders?: any[];
  stats?: any;
}

const DashboardScreen: React.FC<DashboardProps> = ({ participants }) => {
  if (participants.length < 1) {
    return null;
  }

  const totalParticipants = participants.length;
  const availableParticipants = participants.filter(
    (p) => p.status === EnumParticipantStatus.AVAILABLE
  ).length;
  const reservedParticipants = participants.filter(
    (p) => p.status === EnumParticipantStatus.RESERVED
  ).length;
  const hiredParticipants = participants.filter(
    (p) => p.status === EnumParticipantStatus.HIRED
  ).length;

  const averageEvolution = Math.round(
    participants.reduce((sum, p) => sum + p.evolution, 0) / participants.length
  );

  // Status distribution for pie chart
  const statusDistribution = [
    {
      name: EnumParticipantStatus.IN_TRAINING,
      value: participants.filter(
        (p) => p.status === EnumParticipantStatus.IN_TRAINING
      ).length,
      color: statusColors[EnumParticipantStatus.IN_TRAINING].color,
    },
    {
      name: EnumParticipantStatus.AVAILABLE,
      value: availableParticipants,
      color: statusColors[EnumParticipantStatus.AVAILABLE].color,
    },
    {
      name: EnumParticipantStatus.RESERVED,
      value: reservedParticipants,
      color: statusColors[EnumParticipantStatus.RESERVED].color,
    },
    {
      name: EnumParticipantStatus.HIRED,
      value: hiredParticipants,
      color: statusColors[EnumParticipantStatus.HIRED].color,
    },
  ].filter((item) => item.value > 0);

  // Area distribution for bar chart
  const areaDistribution = [
    EnumArea.DEVELOPMENT,
    EnumArea.UX_DESIGN,
    EnumArea.QA,
    EnumArea.DATA_SCIENCE,
    EnumArea.PRODUCT,
    EnumArea.MARKETING,
  ]
    .map((area) => ({
      area: area.replace("_", " "), // Convert UX_DESIGN to UX DESIGN for better display
      count: participants.filter((p) => p.area === area).length,
      color: areaColors[area]?.color || "#666",
    }))
    .filter((item) => item.count > 0); // Only show areas with participants

  // Evolution by batch
  const uniqueBatches = Array.from(new Set(participants.map((p) => p.batch)));
  const evolutionByBatch = uniqueBatches
    .map((batch) => {
      const batchParticipants = participants.filter((p) => p.batch === batch);
      const avgEvolution = Math.round(
        batchParticipants.reduce((sum, p) => sum + p.evolution, 0) /
          batchParticipants.length
      );
      return {
        batch: batch.replace("Turma ", ""),
        evolution: avgEvolution,
        count: batchParticipants.length,
      };
    })
    .sort((a, b) => a.batch.localeCompare(b.batch));

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, color: "#1a1a1a" }}
          >
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
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
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
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, color: "#1a1a1a" }}
              >
                📈 Evolução Média por Turma
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionByBatch}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="batch" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `${value}%`,
                        "Evolução Média",
                      ]}
                      labelFormatter={(label: any) => `Turma ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="evolution"
                      stroke="#1976d2"
                      strokeWidth={3}
                      dot={{ fill: "#1976d2", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </ProtectedRoute>
  );
};
export default DashboardScreen;
