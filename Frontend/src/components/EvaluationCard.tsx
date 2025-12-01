'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Rating
} from '@mui/material';
import { Evaluation, EvaluationCategory } from '@/types';

interface EvaluationCardProps {
  evaluation: Evaluation;
}

export default function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryColor = (category: EvaluationCategory) => {
    switch (category) {
      case EvaluationCategory.TECHNICAL:
        return '#1976d2';
      case EvaluationCategory.SOFT_SKILLS:
        return '#2e7d32';
      case EvaluationCategory.LEADERSHIP:
        return '#ed6c02';
      case EvaluationCategory.COMMUNICATION:
        return '#9c27b0';
      default:
        return '#666';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: getCategoryColor(evaluation.category),
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                mb: 0.5
              }}
            >
              {evaluation.category}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formatDate(evaluation.date)} • {evaluation.evaluatorName}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              {evaluation.score}/10
            </Typography>
            <Rating
              value={evaluation.score / 2}
              precision={0.5}
              readOnly
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={evaluation.score * 10}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#f5f5f5',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getCategoryColor(evaluation.category),
                borderRadius: 4
              }
            }}
          />
        </Box>

        <Typography variant="body2" color="textSecondary">
          {evaluation.feedback}
        </Typography>
      </CardContent>
    </Card>
  );
}