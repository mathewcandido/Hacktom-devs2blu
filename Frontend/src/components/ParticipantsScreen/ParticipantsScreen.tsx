'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Card,
  CardContent,
} from '@mui/material';
import { Search, Visibility, Clear, FilterList, TrendingUp, People, School, CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '../ProtectedRoute';
import { Participant, EnumParticipantStatus, EnumArea } from '@/types';
import { statusColors, areaColors } from '@/mocks/status';

export interface ParticipantsScreenProps {
  participants: Participant[];
}

const ParticipantsScreen: React.FC<ParticipantsScreenProps> = ({ participants }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnumParticipantStatus | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState<EnumArea | 'all'>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [evolutionRange, setEvolutionRange] = useState<number[]>([0, 100]);

  // Get unique batches for filter
  const uniqueBatches = useMemo(() => {
    return Array.from(new Set(participants.map(p => p.batch))).sort();
  }, [participants]);

  // Filter participants based on search and filters
  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.area.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || participant.status === statusFilter;
      const matchesArea = areaFilter === 'all' || participant.area === areaFilter;
      const matchesBatch = batchFilter === 'all' || participant.batch === batchFilter;
      const matchesEvolution = participant.evolution >= evolutionRange[0] && participant.evolution <= evolutionRange[1];
      
      return matchesSearch && matchesStatus && matchesArea && matchesBatch && matchesEvolution;
    });
  }, [participants, searchTerm, statusFilter, areaFilter, batchFilter, evolutionRange]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredParticipants.length,
      available: filteredParticipants.filter(p => p.status === EnumParticipantStatus.AVAILABLE).length,
      inTraining: filteredParticipants.filter(p => p.status === EnumParticipantStatus.IN_TRAINING).length,
      avgEvolution: Math.round(filteredParticipants.reduce((sum, p) => sum + p.evolution, 0) / filteredParticipants.length) || 0
    };
  }, [filteredParticipants]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAreaFilter('all');
    setBatchFilter('all');
    setEvolutionRange([0, 100]);
  };

  const handleViewParticipant = (id: string) => {
    router.push(`/participants/${id}`);
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
            Participantes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Gestão de todos os talentos da incubadora
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Total</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats.total}</Typography>
                  </Box>
                  <People sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Disponíveis</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats.available}</Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Em Treinamento</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats.inTraining}</Typography>
                  </Box>
                  <School sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Evolução Média</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats.avgEvolution}%</Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 32, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FilterList color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Filtros</Typography>
            <Box sx={{ ml: 'auto' }}>
              <Button 
                startIcon={<Clear />} 
                onClick={clearFilters}
                size="small"
                variant="outlined"
              >
                Limpar Filtros
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Buscar participante"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as EnumParticipantStatus | 'all')}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {Object.values(EnumParticipantStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Área</InputLabel>
                <Select
                  value={areaFilter}
                  label="Área"
                  onChange={(e) => setAreaFilter(e.target.value as EnumArea | 'all')}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {Object.values(EnumArea).map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Turma</InputLabel>
                <Select
                  value={batchFilter}
                  label="Turma"
                  onChange={(e) => setBatchFilter(e.target.value)}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {uniqueBatches.map((batch) => (
                    <MenuItem key={batch} value={batch}>
                      {batch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Evolução: {evolutionRange[0]}% - {evolutionRange[1]}%
              </Typography>
              <Slider
                value={evolutionRange}
                onChange={(_, newValue) => setEvolutionRange(newValue as number[])}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                min={0}
                max={100}
                step={5}
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Results Summary */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Mostrando {filteredParticipants.length} de {participants.length} participantes
          </Typography>
          {(searchTerm || statusFilter !== 'all' || areaFilter !== 'all' || batchFilter !== 'all' || evolutionRange[0] > 0 || evolutionRange[1] < 100) && (
            <Chip 
              label="Filtros ativos" 
              color="primary" 
              variant="outlined" 
              size="small"
              onDelete={clearFilters}
            />
          )}
        </Box>

        {/* Participants Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Participante</TableCell>
                <TableCell>Área</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Evolução</TableCell>
                <TableCell>Turma</TableCell>
                <TableCell>Data de Início</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={participant.photo} sx={{ width: 40, height: 40 }}>
                        {participant.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {participant.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {participant.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={participant.area}
                      size="small"
                      sx={{
                        backgroundColor: areaColors[participant.area]?.color + '20',
                        color: areaColors[participant.area]?.color,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={participant.status}
                      size="small"
                      sx={{
                        backgroundColor: statusColors[participant.status]?.color + '20',
                        color: statusColors[participant.status]?.color,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={participant.evolution}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 35 }}>
                        {participant.evolution}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{participant.batch}</TableCell>
                  <TableCell>{formatDate(participant.startDate)}</TableCell>
                  <TableCell align="center">
                    <Button
                      startIcon={<Visibility />}
                      onClick={() => handleViewParticipant(participant.id)}
                      size="small"
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Empty State */}
        {filteredParticipants.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Nenhum participante encontrado
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Tente ajustar os filtros ou termos de busca
            </Typography>
          </Box>
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default ParticipantsScreen;