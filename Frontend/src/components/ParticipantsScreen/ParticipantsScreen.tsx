'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '../ProtectedRoute';
import { Participant, ParticipantStatus, EnumArea } from '@/types';
import { statusColors, areaColors } from '@/mocks/status';

export interface ParticipantsScreenProps {
  participants: Participant[];
}

const ParticipantsScreen: React.FC<ParticipantsScreenProps> = ({ participants }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState<EnumArea | 'all'>('all');

  // Filter participants based on search and filters
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || participant.status === statusFilter;
    const matchesArea = areaFilter === 'all' || participant.area === areaFilter;
    
    return matchesSearch && matchesStatus && matchesArea;
  });

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

        {/* Filters */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as ParticipantStatus | 'all')}
              >
                <MenuItem value="all">Todos os status</MenuItem>
                {Object.values(ParticipantStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Área</InputLabel>
              <Select
                value={areaFilter}
                label="Área"
                onChange={(e) => setAreaFilter(e.target.value as EnumArea | 'all')}
              >
                <MenuItem value="all">Todas as áreas</MenuItem>
                {Object.values(EnumArea).map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Results Summary */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Mostrando {filteredParticipants.length} de {participants.length} participantes
          </Typography>
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