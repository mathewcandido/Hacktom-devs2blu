'use client';

import React, { useState, useEffect } from 'react';
import LeadersScreen from "../../components/LeadersScreen";
import { getLeadersData } from "@/services/api";
import { Leader } from "@/types";
import { Box, CircularProgress } from '@mui/material';

const LeadersPage = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { leaders } = await getLeadersData();
        setLeaders(leaders);
      } catch (err) {
        setError('Erro ao carregar dados dos líderes');
        console.error('Erro ao carregar líderes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <div>Erro: {error}</div>
      </Box>
    );
  }

  return <LeadersScreen leaders={leaders} />;
};

export default LeadersPage;
