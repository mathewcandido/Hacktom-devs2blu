'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  FavoriteOutlined,
  BookmarkBorder,
  Email,
  Phone,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '../ProtectedRoute';
import ParticipantTimeline from '@/components/ParticipantTimeline/ParticipantTimeline';
import EvaluationCard from '@/components/EvaluationCard/EvaluationCard';
import { Participant } from '@/types';
import { statusColors, areaColors } from '@/mocks/status';

export interface ParticipantDetailScreenProps {
  participant: Participant;
  onMarkInterest?: (participantId: string, leaderId: string) => Promise<void>;
  onReserve?: (participantId: string, leaderId: string) => Promise<void>;
}

const ParticipantDetailScreen: React.FC<ParticipantDetailScreenProps> = ({ 
  participant,
  onMarkInterest,
  onReserve
}) => {
  const router = useRouter();

  const handleMarkInterest = async () => {
    if (onMarkInterest) {
      try {
        await onMarkInterest(participant.id, "current-leader-id");
        alert("Interesse marcado com sucesso!");
      } catch (error) {
        console.error("Error marking interest:", error);
      }
    }
  };

  const handleReserve = async () => {
    if (onReserve) {
      try {
        await onReserve(participant.id, "current-leader-id");
        alert("Participante reservado com sucesso!");
      } catch (error) {
        console.error("Error reserving participant:", error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Chart data for evolution
  const evolutionData = participant.evaluations
    ?.map((evaluation, index) => ({
      evaluation: `Avaliação ${index + 1}`,
      score: evaluation.score,
      date: evaluation.date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    }))
    .reverse() || [];

  const averageScore =
    participant.evaluations.length > 0
      ? participant.evaluations.reduce(
          (sum, evaluation) => sum + evaluation.score,
          0
        ) / participant.evaluations.length
      : 0;

  return (
    <ProtectedRoute>
      <Layout>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#1a1a1a" }}
            >
              Detalhes do Participante
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            {/* Profile Card */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  src={participant.photo}
                  sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                >
                  {participant.name[0]}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {participant.name}
                </Typography>
                <Chip
                  label={participant.area}
                  sx={{
                    backgroundColor: areaColors[participant.area]?.color + "20",
                    color: areaColors[participant.area]?.color,
                    fontWeight: 500,
                    mb: 1,
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={participant.status}
                    sx={{
                      backgroundColor: statusColors[participant.status]?.color + "20",
                      color: statusColors[participant.status]?.color,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
                  <Typography variant="body2">{participant.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
                  <Typography variant="body2">{participant.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
                  <Typography variant="body2">
                    Início: {formatDate(participant.startDate)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Evolução Geral
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={participant.evolution}
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4, mr: 2 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {participant.evolution}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  Turma: {participant.batch}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<FavoriteOutlined />}
                  onClick={handleMarkInterest}
                  fullWidth
                >
                  Marcar Interesse
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<BookmarkBorder />}
                  onClick={handleReserve}
                  fullWidth
                >
                  Reservar Talento
                </Button>
              </Box>
            </Paper>

            {/* Skills */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Habilidades
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {participant.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={8}>
            {/* Bio */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Sobre
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {participant.bio}
              </Typography>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                    {participant.evaluations.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avaliações
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                    {averageScore.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nota Média
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
                    {participant.timeline.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Eventos
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Evolution Chart */}
            {evolutionData.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingUp sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Evolução das Avaliações
                  </Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip
                        formatter={(value: any) => [`${value}/10`, "Nota"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ fill: "#1976d2", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            )}

            {/* Evaluations */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Avaliações Recentes
              </Typography>
              <Grid container spacing={2}>
                {participant.evaluations.slice(0, 4).map((evaluation) => (
                  <Grid item xs={12} sm={6} key={evaluation.id}>
                    <EvaluationCard evaluation={evaluation} />
                  </Grid>
                ))}
              </Grid>
              {participant.evaluations.length === 0 && (
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  Nenhuma avaliação disponível
                </Typography>
              )}
            </Paper>

            {/* Timeline */}
            <ParticipantTimeline events={participant.timeline} />
          </Grid>
        </Grid>
      </Layout>
    </ProtectedRoute>
  );
};

export default ParticipantDetailScreen;