"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  Person,
  Business,
  Star,
  Visibility,
} from "@mui/icons-material";
import {
  MatchingService,
  getCompatibilityColor,
  getCompatibilityLabel,
} from "@/services/matching";
import { Participant, Leader, MatchResult } from "@/types";
import { useRouter } from "next/navigation";

interface MatchingWidgetProps {
  participants: Participant[];
  leaders: Leader[];
  currentUser?: { role: string; id: string };
}

const MatchingWidget: React.FC<MatchingWidgetProps> = ({
  participants,
  leaders,
  currentUser,
}) => {
  const router = useRouter();

  const topMatches = useMemo(() => {
    const service = new MatchingService(participants, leaders);

    let matches = currentUser?.role === "leader"
      ? service.getMatchesForLeader(currentUser.id, 5)
      : service.getBestMatches(8);

    // Debug detalhado (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      MatchingService.debugMatchNames(matches, 'DASHBOARD');
    }

    // Validação adicional para nomes únicos (log de debug)
    if (!MatchingService.validateUniqueNames(matches)) {
      console.warn('⚠️ DASHBOARD: Nomes duplicados detectados nos matches, aplicando filtro adicional...');
      
      // Filtro de segurança adicional
      const seenNames = new Set<string>();
      matches = matches.filter(match => {
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
      
      console.log(`✅ DASHBOARD: Filtro aplicado. Matches únicos: ${matches.length}`);
      
      // Debug após filtro
      if (process.env.NODE_ENV === 'development') {
        MatchingService.debugMatchNames(matches, 'DASHBOARD-PÓS-FILTRO');
      }
    }

    return matches;
  }, [participants, leaders, currentUser]);

  const handleViewParticipant = (participantId: string) => {
    router.push(`/participants/${participantId}`);
  };

  const handleViewLeader = (leaderId: string) => {
    router.push(`/leaders`); // Assumindo que há uma página de detalhes
  };

  if (topMatches.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          🎯 Sistema de Matching
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Não há matches disponíveis no momento.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Star sx={{ mr: 1, color: "#1976d2" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Melhores Matches
        </Typography>
        <Chip
          label={`${topMatches.length} encontrados`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
      >
        {topMatches.map((match, index) => {
          if (index > 3) return null;
          const { participant, leader } = match;

          return (
            <Card
              key={`${match.participantId}-${match.leaderId}`}
              sx={{
                border: "1px solid #e0e0e0",
                "&:hover": {
                  boxShadow: 2,
                  borderColor: "#1976d2",
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Match Score Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      #{index + 1}
                    </Typography>
                    <Chip
                      label={`${match.score}% Match`}
                      size="small"
                      sx={{
                        backgroundColor:
                          getCompatibilityColor(match.compatibility) + "20",
                        color: getCompatibilityColor(match.compatibility),
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={getCompatibilityLabel(match.compatibility)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={match.score}
                    sx={{
                      width: 60,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#f0f0f0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getCompatibilityColor(
                          match.compatibility
                        ),
                      },
                    }}
                  />
                </Box>

                {/* Participant & Leader Info */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  {/* Participant */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={participant.photo}
                      sx={{ width: 40, height: 40 }}
                    >
                      {participant.name[0]}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {participant.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mt: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip label={participant.area} size="small" />
                        <Chip
                          label={`${participant.evolution}% evolução`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewParticipant(participant.id)}
                      sx={{ minWidth: "auto" }}
                    >
                      Ver
                    </Button>
                  </Box>

                  <Box sx={{ display: { xs: "block", sm: "none" } }}>
                    <Divider />
                  </Box>

                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Divider orientation="vertical" flexItem />
                  </Box>

                  {/* Leader */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Business sx={{ color: "text.secondary" }} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {leader.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {leader.department}
                      </Typography>
                      <Chip
                        label={leader.area}
                        size="small"
                        color="secondary"
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Match Reasons */}
                <Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Por que é um bom match:
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {match.reasons.slice(0, 3).map((reason, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{ fontSize: "0.8rem", mb: 0.5 }}
                      >
                        • {reason}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Action Button */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="outlined"
          startIcon={<TrendingUp />}
          onClick={() => router.push("/matches")} // Página dedicada aos matches
          fullWidth={false}
        >
          Ver Todos os Matches
        </Button>
      </Box>
    </Paper>
  );
};

export default MatchingWidget;
