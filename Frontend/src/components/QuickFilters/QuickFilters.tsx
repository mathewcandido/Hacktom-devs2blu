"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import {
  BookmarkBorder,
  Bookmark,
  Add,
  Delete,
  FilterList,
} from "@mui/icons-material";
import { EnumArea, EnumParticipantStatus } from "@/types";

interface SavedFilter {
  id: string;
  name: string;
  criteria: {
    areas: EnumArea[];
    statuses: EnumParticipantStatus[];
    minEvolution: number;
    skills: string[];
  };
  createdAt: Date;
}

interface QuickFiltersProps {
  onFilterApply: (criteria: SavedFilter['criteria']) => void;
  currentFilters: SavedFilter['criteria'];
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ onFilterApply, currentFilters }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  
  // Mock saved filters - em produção viria do localStorage ou API
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    {
      id: "1",
      name: "Talentos Sênior",
      criteria: {
        areas: [EnumArea.DEVELOPMENT, EnumArea.DATA_SCIENCE],
        statuses: [EnumParticipantStatus.AVAILABLE],
        minEvolution: 80,
        skills: ["React", "Node.js", "Python"]
      },
      createdAt: new Date()
    },
    {
      id: "2", 
      name: "UX Ready",
      criteria: {
        areas: [EnumArea.UX_DESIGN],
        statuses: [EnumParticipantStatus.AVAILABLE, EnumParticipantStatus.RESERVED],
        minEvolution: 70,
        skills: ["Figma", "Design System"]
      },
      createdAt: new Date()
    },
    {
      id: "3",
      name: "QA Specialists",
      criteria: {
        areas: [EnumArea.QA],
        statuses: [EnumParticipantStatus.AVAILABLE],
        minEvolution: 75,
        skills: ["Selenium", "Jest", "Cypress"]
      },
      createdAt: new Date()
    }
  ]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = (filter: SavedFilter) => {
    onFilterApply(filter.criteria);
    handleMenuClose();
  };

  const handleSaveCurrentFilter = () => {
    if (filterName.trim()) {
      const newFilter: SavedFilter = {
        id: Date.now().toString(),
        name: filterName.trim(),
        criteria: currentFilters,
        createdAt: new Date()
      };
      
      setSavedFilters(prev => [newFilter, ...prev]);
      setSaveDialogOpen(false);
      setFilterName("");
    }
  };

  const handleDeleteFilter = (filterId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    onFilterApply({
      areas: [],
      statuses: [],
      minEvolution: 0,
      skills: []
    });
    handleMenuClose();
  };

  const hasActiveFilters = currentFilters.areas.length > 0 || 
                          currentFilters.statuses.length > 0 || 
                          currentFilters.minEvolution > 0 || 
                          currentFilters.skills.length > 0;

  return (
    <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <FilterList color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Filtros Rápidos
        </Typography>
        
        <Button
          size="small"
          startIcon={<Add />}
          onClick={() => setSaveDialogOpen(true)}
          disabled={!hasActiveFilters}
          variant="outlined"
        >
          Salvar Filtro
        </Button>
        
        <Button
          size="small"
          startIcon={<BookmarkBorder />}
          onClick={handleMenuOpen}
          variant="contained"
        >
          Salvos ({savedFilters.length})
        </Button>
      </Box>

      {/* Quick Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {savedFilters.slice(0, 6).map((filter) => (
          <Chip
            key={filter.id}
            label={filter.name}
            onClick={() => handleApplyFilter(filter)}
            onDelete={(e) => handleDeleteFilter(filter.id, e)}
            deleteIcon={<Delete />}
            color="primary"
            variant="outlined"
            sx={{ 
              '&:hover': { 
                backgroundColor: 'primary.main', 
                color: 'white',
                '& .MuiChip-deleteIcon': {
                  color: 'white'
                }
              }
            }}
          />
        ))}
      </Box>

      {/* Saved Filters Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 250 }
        }}
      >
        <MenuItem onClick={clearAllFilters}>
          <Typography variant="body2" color="error">
            Limpar Todos os Filtros
          </Typography>
        </MenuItem>
        
        {savedFilters.length > 0 && <Divider />}
        
        {savedFilters.map((filter) => (
          <MenuItem 
            key={filter.id} 
            onClick={() => handleApplyFilter(filter)}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="subtitle2">{filter.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                {filter.criteria.areas.length} áreas, {filter.criteria.skills.length} skills
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => handleDeleteFilter(filter.id, e)}
              sx={{ ml: 1 }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>

      {/* Save Filter Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Salvar Filtro Atual</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Filtro"
            fullWidth
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Ex: Desenvolvedores Sênior React"
          />
          
          {/* Preview of current filters */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Critérios salvos:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentFilters.areas.map(area => (
                <Chip key={area} label={area} size="small" />
              ))}
              {currentFilters.minEvolution > 0 && (
                <Chip label={`Min ${currentFilters.minEvolution}%`} size="small" />
              )}
              {currentFilters.skills.map(skill => (
                <Chip key={skill} label={skill} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveCurrentFilter} 
            variant="contained"
            disabled={!filterName.trim()}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default QuickFilters;