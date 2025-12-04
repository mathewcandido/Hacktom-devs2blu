'use client';

import React, { useState, useMemo } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {
  SupervisorAccount,
  Person,
  Business,
  TrendingUp,
  FilterList,
  Clear
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '../ProtectedRoute';
import StatsCard from '@/components/StatsCard/StatsCard';
import { Leader } from '@/types';

export interface LeadersScreenProps {
  leaders: Leader[];
}

const LeadersScreen: React.FC<LeadersScreenProps> = ({ leaders }) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');

  // Filter and search leaders
  const filteredLeaders = useMemo(() => {
    return leaders.filter(leader => {
      const matchesSearch = leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           leader.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = !areaFilter || leader.area === areaFilter;
      const matchesDepartment = !departmentFilter || leader.department === departmentFilter;
      
      let matchesActivity = true;
      if (activityFilter === 'active') {
        matchesActivity = leader.interestedParticipants.length > 0 || leader.reservedParticipants.length > 0;
      } else if (activityFilter === 'inactive') {
        matchesActivity = leader.interestedParticipants.length === 0 && leader.reservedParticipants.length === 0;
      }
      
      return matchesSearch && matchesArea && matchesDepartment && matchesActivity;
    });
  }, [leaders, searchTerm, areaFilter, departmentFilter, activityFilter]);

  // Calculate stats based on filtered leaders
  const totalLeaders = filteredLeaders.length;
  const activeLeaders = filteredLeaders.filter(leader => 
    leader.interestedParticipants.length > 0 || leader.reservedParticipants.length > 0
  ).length;
  const totalInterested = filteredLeaders.reduce((sum, leader) => sum + leader.interestedParticipants.length, 0);
  const totalReserved = filteredLeaders.reduce((sum, leader) => sum + leader.reservedParticipants.length, 0);

  // Get unique values for filter options
  const uniqueAreas = Array.from(new Set(leaders.map(leader => leader.area)));
  const uniqueDepartments = Array.from(new Set(leaders.map(leader => leader.department)));

  // Get departments stats based on filtered data
  const departments = Array.from(new Set(filteredLeaders.map(leader => leader.department)));
  const departmentStats = departments.map(dept => ({
    department: dept,
    count: filteredLeaders.filter(leader => leader.department === dept).length,
    interested: filteredLeaders.filter(leader => leader.department === dept)
      .reduce((sum, leader) => sum + leader.interestedParticipants.length, 0)
  }));

  // Most active leader from filtered results
  const mostActiveLeader = filteredLeaders.length > 0 ? filteredLeaders.reduce((prev, current) => 
    (current.interestedParticipants.length + current.reservedParticipants.length) > 
    (prev.interestedParticipants.length + prev.reservedParticipants.length) ? current : prev
  ) : null;

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setAreaFilter('');
    setDepartmentFilter('');
    setActivityFilter('');
  };

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

        {/* Filters Section */}
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterList color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filtros
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Buscar por nome ou email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Área</InputLabel>
                <Select
                  value={areaFilter}
                  label="Área"
                  onChange={(e) => setAreaFilter(e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {uniqueAreas.map(area => (
                    <MenuItem key={area} value={area}>{area}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Departamento"
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {uniqueDepartments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Atividade</InputLabel>
                <Select
                  value={activityFilter}
                  label="Atividade"
                  onChange={(e) => setActivityFilter(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="active">Ativos</MenuItem>
                  <MenuItem value="inactive">Inativos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearFilters}
                sx={{ height: '40px' }}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
        </Paper>

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
                    {filteredLeaders.length > 0 ? (
                      filteredLeaders.map((leader) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                            Nenhum líder encontrado com os filtros aplicados
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
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
              {mostActiveLeader ? (
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
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Nenhum líder encontrado com os filtros aplicados
                </Typography>
              )}
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