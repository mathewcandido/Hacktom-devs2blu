'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  FavoriteOutlined,
  BookmarkBorder,
  Email,
  Phone,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Layout from '@/components/Layout';
import ParticipantTimeline from '@/components/ParticipantTimeline';
import EvaluationCard from '@/components/EvaluationCard';
import { getParticipant, markInterest, reserveParticipant } from '@/services/api';
import { Participant } from '@/types';
import { statusColors, areaColors } from '@/mocks/status';

export default function ParticipantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const id = params.id as string;
        const data = await getParticipant(id);
        setParticipant(data);
      } catch (error) {
        console.error('Error fetching participant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchParticipant();
    }
  }, [params.id]);

  const handleMarkInterest = async () => {
    if (participant) {
      try {
        await markInterest(participant.id, 'current-leader-id');
        alert('Interesse marcado com sucesso!');
      } catch (error) {
        console.error('Error marking interest:', error);
      }
    }
  };

  const handleReserve = async () => {
    if (participant) {
      try {
        await reserveParticipant(participant.id, 'current-leader-id');
        alert('Participante reservado com sucesso!');
      } catch (error) {
        console.error('Error reserving participant:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Generate evolution chart data
  const evolutionData = participant?.evaluations.map((evaluation, index) => ({
    evaluation: `Avaliação ${index + 1}`,
    score: evaluation.score,
    date: evaluation.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  })).reverse() || [];

  if (loading) {
    return (
      <Layout>
        <Typography>Carregando participante...</Typography>
      </Layout>
    );
  }

  if (!participant) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Participante não encontrado
          </Typography>
          <Button onClick={() => router.back()} startIcon={<ArrowBack />}>
            Voltar
          </Button>
        </Box>
      </Layout>
    );
  }

  const averageScore = participant.evaluations.length > 0 
    ? participant.evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / participant.evaluations.length 
    : 0;

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Detalhes do Participante
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', mb: 3 }}>
            <Avatar
              src={participant.photo}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {participant.name}
            </Typography>
            <Chip
              label={participant.area}
              sx={{
                backgroundColor: areaColors[participant.area].background,
                color: areaColors[participant.area].color,
                fontWeight: 500,
                mb: 2
              }}
            />
            <Box sx={{ mb: 2 }}>
              <Chip
                label={participant.status}
                sx={{
                  backgroundColor: statusColors[participant.status].background,
                  color: statusColors[participant.status].color,
                  fontWeight: 500
                }}
              />
            </Box>
            
            {/* Contact Info */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, color: '#666', fontSize: 20 }} />
              <Typography variant="body2" color="textSecondary">
                {participant.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, color: '#666', fontSize: 20 }} />
              <Typography variant="body2" color="textSecondary">
                {participant.phone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 1, color: '#666', fontSize: 20 }} />
              <Typography variant="body2" color="textSecondary">
                Início: {formatDate(participant.startDate)}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<FavoriteOutlined />}
                onClick={handleMarkInterest}
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                Tenho Interesse
              </Button>
              <Button
                variant="contained"
                startIcon={<BookmarkBorder />}
                onClick={handleReserve}
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                Reservar
              </Button>
            </Box>
          </Paper>

          {/* Skills */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Habilidades
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {participant.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          {/* Progress Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {participant.evolution}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Evolução
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={participant.evolution}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    {averageScore.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nota Média
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: '#2e7d32', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#2e7d32', ml: 0.5 }}>
                      +0.5 este mês
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#ed6c02' }}>
                    {participant.evaluations.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avaliações
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#9c27b0' }}>
                    {participant.batch.split('-')[1]}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Turma
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Evolution Chart */}
          {evolutionData.length > 0 && (
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Evolução das Avaliações
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="evaluation" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip
                      formatter={(value: any) => [`${value}/10`, 'Nota']}
                      labelFormatter={(label: any) => `${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#1976d2"
                      strokeWidth={3}
                      dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          )}

          {/* Bio */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Sobre
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
              {participant.bio}
            </Typography>
          </Paper>

          {/* Evaluations */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Avaliações Recentes
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {participant.evaluations.slice(0, 5).map((evaluation) => (
                <EvaluationCard key={evaluation.id} evaluation={evaluation} />
              ))}
            </Box>
          </Paper>

          {/* Timeline */}
          <ParticipantTimeline events={participant.timeline} />
        </Grid>
      </Grid>
    </Layout>
  );
}