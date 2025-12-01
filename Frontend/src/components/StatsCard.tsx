'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  trend = 'neutral',
  trendValue,
  color = '#1976d2'
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp sx={{ color: '#2e7d32', fontSize: 20 }} />;
    if (trend === 'down') return <TrendingDown sx={{ color: '#d32f2f', fontSize: 20 }} />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#2e7d32';
    if (trend === 'down') return '#d32f2f';
    return '#666';
  };

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: color,
            borderRadius: '12px 12px 0 0'
          }}
        />
        <Typography color="textSecondary" gutterBottom variant="body2" sx={{ mt: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
        {trendValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 0.5 }}>
            {getTrendIcon()}
            <Typography
              variant="body2"
              sx={{
                color: getTrendColor(),
                fontWeight: 500
              }}
            >
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}