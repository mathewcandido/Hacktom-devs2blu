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
  LinearProgress,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import { MatchingService } from '../../services/matching';
import { generateParticipants } from '../../mocks/generateParticipants';
import { generateLeaders } from '../../mocks/generateLeaders';
import { EnumArea, EnumParticipantStatus, MatchResult } from '../../types';

export default function MatchesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [participants] = useState(generateParticipants);
  const [leaders] = useState(generateLeaders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<EnumArea | 'all'>('all');
  const [minScore, setMinScore] = useState(0);

  const allMatches = useMemo(() => {
    const matchingService = new MatchingService(participants, leaders);
    let allMatches = matchingService.getAllMatches();
    
    // Validação adicional para garantir não há duplicatas nem nomes iguais
    if (!MatchingService.validateNoDuplicates(allMatches)) {
      console.warn('Duplicatas de ID encontradas nos matches, removendo...');
      const seen = new Set<string>();
      allMatches = allMatches.filter(match => {
        const key = `${match.participantId}-${match.leaderId}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    
    if (!MatchingService.validateUniqueNames(allMatches)) {
      // console.warn('⚠️ MATCHES: Nomes duplicados detectados, aplicando filtro...');
      const seenNames = new Set<string>();
      allMatches = allMatches.filter(match => {
        const participantName = match.participant.name.toLowerCase().trim();
        const leaderName = match.leader.name.toLowerCase().trim();
        
        if (seenNames.has(participantName) || 
            seenNames.has(leaderName) || 
            participantName === leaderName) {
          return false;
        }
        
        seenNames.add(participantName);
        seenNames.add(leaderName);
        return true;
      });
      console.log(`✅ MATCHES: Filtro aplicado. Total com nomes únicos: ${allMatches.length}`);
    }

    return allMatches
      .filter(match => {
        const matchesSearch = searchTerm === '' || 
          match.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.leader.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesArea = selectedArea === 'all' || 
          match.participant.area === selectedArea ||
          match.leader.area === selectedArea;
        
        const matchesScore = match.score >= minScore;

        return matchesSearch && matchesArea && matchesScore;
      })
      .sort((a, b) => b.score - a.score);
  }, [participants, leaders, searchTerm, selectedArea, minScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    return 'Regular';
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Matches de Talentos
        </Typography>

        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Buscar participante ou líder"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Área</InputLabel>
                  <Select
                    value={selectedArea}
                    label="Área"
                    onChange={(e) => setSelectedArea(e.target.value as EnumArea | 'all')}
                  >
                    <MenuItem value="all">Todas as áreas</MenuItem>
                    <MenuItem value={EnumArea.DEVELOPMENT}>Desenvolvimento</MenuItem>
                    <MenuItem value={EnumArea.UX_DESIGN}>UX/UI Design</MenuItem>
                    <MenuItem value={EnumArea.QA}>Quality Assurance</MenuItem>
                    <MenuItem value={EnumArea.DATA_SCIENCE}>Data Science</MenuItem>
                    <MenuItem value={EnumArea.PRODUCT}>Product Management</MenuItem>
                    <MenuItem value={EnumArea.MARKETING}>Marketing Digital</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Score mínimo"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  inputProps={{ min: 0, max: 100 }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    {allMatches.length} matches encontrados
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Lista de Matches */}
        <Grid container spacing={2}>
          {allMatches.map((match, index) => (
            <Grid item xs={12} key={`${match.leader.id}-${match.participant.id}-${index}`}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 2
                  }}>
                    {/* Score */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      minWidth: isMobile ? 'auto' : 120 
                    }}>
                      <StarIcon sx={{ color: getScoreColor(match.score), mr: 1 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ color: getScoreColor(match.score), fontWeight: 'bold' }}
                      >
                        {match.score.toFixed(0)}%
                      </Typography>
                      <Chip 
                        label={getScoreLabel(match.score)}
                        size="small"
                        sx={{ 
                          ml: 1,
                          backgroundColor: getScoreColor(match.score),
                          color: 'white'
                        }}
                      />
                    </Box>

                    {/* Participant Info */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      flex: 1,
                      minWidth: 0
                    }}>
                      <Avatar 
                        src={match.participant.photo}
                        sx={{ mr: 2, width: 40, height: 40 }}
                      >
                        {match.participant.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle1" noWrap>
                          {match.participant.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {match.participant.area} • {match.participant.status}
                        </Typography>
                      </Box>
                    </Box>

                    {!isMobile && (
                      <>
                        <Box sx={{ mx: 2 }}>
                          <TrendingUpIcon color="action" />
                        </Box>

                        {/* Leader Info */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          flex: 1,
                          minWidth: 0
                        }}>
                          <Avatar 
                            src={match.leader.photo}
                            sx={{ mr: 2, width: 40, height: 40 }}
                          >
                            {match.leader.name.charAt(0)}
                          </Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle1" noWrap>
                              {match.leader.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {match.leader.department} • {match.leader.area}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {/* Participant Details */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              src={match.participant.photo}
                              sx={{ mr: 2, width: 60, height: 60 }}
                            >
                              {match.participant.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {match.participant.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Participante
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Área: {match.participant.area}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Status: {match.participant.status}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Evolução: {match.participant.evolution}%
                            </Typography>
                          </Box>

                          {match.participant.skills && match.participant.skills.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Habilidades:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {match.participant.skills.slice(0, 5).map((skill, idx) => (
                                  <Chip key={idx} label={skill} size="small" />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Leader Details */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              src={match.leader.photo}
                              sx={{ mr: 2, width: 60, height: 60 }}
                            >
                              {match.leader.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {match.leader.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Líder
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Área: {match.leader.area}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Departamento: {match.leader.department}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Data de Ingresso: {new Date(match.leader.joinDate).toLocaleDateString()}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Departamento: {match.leader.department}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Match Details */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Análise do Match
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Compatibilidade de Área (40%)
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={(match.participant.area === match.leader.area ? 100 : 0)}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Experiência (30%)
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={75} // Simplified calculation
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Potencial de Evolução (20%)
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={85} // Simplified calculation
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Status (10%)
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={match.participant.status === EnumParticipantStatus.AVAILABLE ? 100 : 50}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="contained" size="small">
                          Aprovar Match
                        </Button>
                        <Button variant="outlined" size="small">
                          Agendar Reunião
                        </Button>
                        <Button variant="text" size="small">
                          Ver Detalhes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>

        {allMatches.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhum match encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tente ajustar os filtros para encontrar matches compatíveis.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Layout>
  );
}