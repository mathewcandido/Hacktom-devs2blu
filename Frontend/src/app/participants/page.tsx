"use client";

import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Search, Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { getParticipants } from "@/services/api";
import { Participant, ParticipantStatus, Area } from "@/types";
import { statusColors, areaColors } from "@/mocks/status";
import Loading from "../loading";

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getParticipants();
        setParticipants(data);
        setFilteredParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = participants;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (areaFilter !== "all") {
      filtered = filtered.filter((p) => p.area === areaFilter);
    }

    setFilteredParticipants(filtered);
  }, [participants, searchTerm, statusFilter, areaFilter]);

  const handleViewDetails = (participantId: string) => {
    router.push(`/participants/${participantId}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <Loading />
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, color: "#1a1a1a" }}
          >
            Participantes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Lista completa dos talentos em formação
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar por nome ou email..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
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
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos os Status</MenuItem>
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
                onChange={(e) => setAreaFilter(e.target.value)}
              >
                <MenuItem value="all">Todas as Áreas</MenuItem>
                {Object.values(Area).map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Results count */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {filteredParticipants.length} de {participants.length} participantes
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Participante</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Área</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Turma</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Evolução</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Início</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow
                  key={participant.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    "&:last-child td": { border: 0 },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={participant.photo}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {participant.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
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
                        backgroundColor:
                          areaColors[participant.area].background,
                        color: areaColors[participant.area].color,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{participant.batch}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: 100 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {participant.evolution}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={participant.evolution}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              participant.evolution >= 80
                                ? "#2e7d32"
                                : participant.evolution >= 60
                                ? "#ed6c02"
                                : "#d32f2f",
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={participant.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          statusColors[participant.status].background,
                        color: statusColors[participant.status].color,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(participant.startDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(participant.id)}
                      sx={{ textTransform: "none" }}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredParticipants.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="textSecondary">
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
}
