'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Paper, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import { ArrowBack, PersonOff, ExpandMore, BugReport } from '@mui/icons-material';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '../ProtectedRoute';
import { getParticipants } from '@/services/api';

interface ParticipantNotFoundProps {
  message?: string;
  requestedId?: string;
}

const ParticipantNotFound: React.FC<ParticipantNotFoundProps> = ({ 
  message = "O participante que você está procurando não existe ou foi removido.",
  requestedId 
}) => {
  const router = useRouter();
  const [availableParticipants, setAvailableParticipants] = useState<any[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Carregar participantes disponíveis para debug
    const loadParticipants = async () => {
      try {
        const participants = await getParticipants();
        setAvailableParticipants(participants);
      } catch (error) {
        console.error('Erro ao carregar participantes:', error);
      }
    };

    if (process.env.NODE_ENV === 'development') {
      loadParticipants();
    }
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleViewAll = () => {
    router.push('/participants');
  };

  const handleViewParticipant = (id: string) => {
    router.push(`/participants/${id}`);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              maxWidth: 500,
              width: '100%'
            }}
          >
            <PersonOff 
              sx={{ 
                fontSize: 80, 
                color: 'error.main', 
                mb: 3 
              }} 
            />
            
            <Typography 
              variant="h4" 
              color="error" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Participante não encontrado
            </Typography>
            
            <Typography 
              variant="body1" 
              color="textSecondary" 
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              {message}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={handleGoBack}
                size="large"
              >
                Voltar
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleViewAll}
                size="large"
              >
                Ver todos os participantes
              </Button>
            </Box>

            {/* Debug info - apenas em desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 3 }}>
                <Button
                  startIcon={<BugReport />}
                  onClick={() => setShowDebug(!showDebug)}
                  size="small"
                  color="secondary"
                >
                  {showDebug ? 'Ocultar' : 'Mostrar'} Debug Info
                </Button>
                
                {showDebug && (
                  <Box sx={{ mt: 2, textAlign: 'left' }}>
                    {requestedId && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>ID solicitado:</strong> {requestedId}
                      </Typography>
                    )}
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">
                          Participantes disponíveis ({availableParticipants.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {availableParticipants.slice(0, 10).map((participant) => (
                            <ListItem 
                              key={participant.id}
                              button
                              onClick={() => handleViewParticipant(participant.id)}
                            >
                              <ListItemText
                                primary={participant.name}
                                secondary={`ID: ${participant.id}`}
                              />
                            </ListItem>
                          ))}
                          {availableParticipants.length > 10 && (
                            <ListItem>
                              <ListItemText
                                secondary={`... e mais ${availableParticipants.length - 10} participantes`}
                              />
                            </ListItem>
                          )}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Layout>
    </ProtectedRoute>
  );
};

export default ParticipantNotFound;