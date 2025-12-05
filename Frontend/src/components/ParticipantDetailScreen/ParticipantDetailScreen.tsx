"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
} from "@mui/material";
import {
  ArrowBack,
  FavoriteOutlined,
  BookmarkBorder,
  Email,
  Phone,
  CalendarToday,
  TrendingUp,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "../ProtectedRoute";
import ParticipantTimeline from "@/components/ParticipantTimeline/ParticipantTimeline";
import EvaluationCard from "@/components/EvaluationCard/EvaluationCard";
import { Participant } from "@/types";
import { statusColors, areaColors } from "@/mocks/status";
import { faker } from "@faker-js/faker";

export interface ParticipantDetailScreenProps {
  participant: Participant;
  onMarkInterest?: (participantId: string, leaderId: string) => Promise<void>;
  onReserve?: (participantId: string, leaderId: string) => Promise<void>;
}

const ParticipantDetailScreen: React.FC<ParticipantDetailScreenProps> = ({
  participant,
  onMarkInterest,
  onReserve,
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
  const evolutionData =
    participant.evaluations
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

  const average = faker.number.float({ min: 5, max: 10, precision: 0.1 });
  const mediaNote = faker.number.int({ min: 5, max: 10 });
  return (
    <ProtectedRoute>
      <Layout>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600, 
                color: "#1a1a1a",
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' }
              }}
            >
              Detalhes do Participante
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Left Column */}
          <Grid item xs={12} lg={4}>
            {/* Profile Card */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: { xs: 2, md: 3 } }}>
              <Box sx={{ textAlign: "center", mb: { xs: 2, md: 3 } }}>
                <Avatar
                  src={participant.photo}
                  sx={{ 
                    width: { xs: 80, sm: 100, md: 120 }, 
                    height: { xs: 80, sm: 100, md: 120 }, 
                    mx: "auto", 
                    mb: 2 
                  }}
                >
                  {participant.name[0]}
                </Avatar>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  {participant.name}
                </Typography>
                <Chip
                  label={participant.area}
                  size="small"
                  sx={{
                    backgroundColor: areaColors[participant.area]?.color + "20",
                    color: areaColors[participant.area]?.color,
                    fontWeight: 500,
                    mb: 1,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={participant.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        statusColors[participant.status]?.color + "20",
                      color: statusColors[participant.status]?.color,
                      fontWeight: 500,
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: { xs: 2, md: 3 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Email
                    sx={{ 
                      mr: 1, 
                      fontSize: { xs: 18, sm: 20 }, 
                      color: "text.secondary" 
                    }}
                  />
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      wordBreak: 'break-all'
                    }}
                  >
                    {participant.email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Phone
                    sx={{ 
                      mr: 1, 
                      fontSize: { xs: 18, sm: 20 }, 
                      color: "text.secondary" 
                    }}
                  />
                  <Typography 
                    variant="body2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {participant.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarToday
                    sx={{ 
                      mr: 1, 
                      fontSize: { xs: 18, sm: 20 }, 
                      color: "text.secondary" 
                    }}
                  />
                  <Typography 
                    variant="body2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Início: {formatDate(participant.startDate)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: { xs: 2, md: 3 } }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                >
                  Evolução Geral
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={participant.evolution}
                    sx={{ 
                      flexGrow: 1, 
                      height: { xs: 6, sm: 8 }, 
                      borderRadius: 4, 
                      mr: 2 
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {participant.evolution}%
                  </Typography>
                </Box>
                <Typography 
                  variant="caption" 
                  color="textSecondary"
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  Turma: {participant.batch}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5 } }}>
                <Button
                  variant="contained"
                  startIcon={<FavoriteOutlined />}
                  onClick={handleMarkInterest}
                  fullWidth
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 }
                  }}
                >
                  Marcar Interesse
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<BookmarkBorder />}
                  onClick={handleReserve}
                  fullWidth
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    py: { xs: 1, sm: 1.5 }
                  }}
                >
                  Reservar Talento
                </Button>
              </Box>
            </Paper>

            {/* Skills */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Habilidades
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 0.5, sm: 1 } }}>
                {participant.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      height: { xs: 24, sm: 32 }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={8}>
            {/* Bio */}
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Sobre
              </Typography>
              <Typography 
                variant="body1" 
                color="textSecondary"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: { xs: 1.5, sm: 1.6 }
                }}
              >
                {participant.bio}
              </Typography>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2, md: 3 } }}>
              <Grid item xs={4}>
                <Card sx={{ p: { xs: 1, sm: 2 }, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    color="primary"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', sm: '2.125rem' }
                    }}
                  >
                    {/* {participant.evaluations.length} */}
                    {average}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                  >
                    Avaliações
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ p: { xs: 1, sm: 2 }, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    color="success.main"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', sm: '2.125rem' }
                    }}
                  >
                    {/* {averageScore.toFixed(1)} */}
                    {mediaNote}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                  >
                    Nota Média
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ p: { xs: 1, sm: 2 }, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    color="warning.main"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', sm: '2.125rem' }
                    }}
                  >
                    {/* {participant.timeline.length} */}
                    {average}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                  >
                    Eventos
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Evolution Chart */}
            {evolutionData.length > 0 && (
              <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: { xs: 2, md: 3 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingUp sx={{ 
                    mr: 1, 
                    color: "primary.main",
                    fontSize: { xs: '1.2rem', sm: '1.5rem' }
                  }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Evolução das Avaliações
                  </Typography>
                </Box>
                <Box sx={{ height: { xs: 250, sm: 300 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        tick={{ fontSize: 12 }}
                      />
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
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: { xs: 2, md: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Avaliações Recentes
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                {participant.evaluations.slice(0, 4).map((evaluation) => (
                  <Grid item xs={12} sm={6} key={evaluation.id}>
                    <EvaluationCard evaluation={evaluation} />
                  </Grid>
                ))}
              </Grid>
              {participant.evaluations.length === 0 && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="center"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
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
