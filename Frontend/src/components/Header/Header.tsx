"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import { NotificationsOutlined, LogoutOutlined, PersonOutlined, SettingsOutlined, BugReport } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 280;

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    router.push('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'leader': return 'warning';
      case 'participant': return 'info';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'leader': return 'Líder';
      case 'participant': return 'Participante';
      default: return role;
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: "white",
        color: "#1a1a1a",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, color: "#1a1a1a" }}
        >
          Painel de Controle
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Debug button - only in development */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              size="small"
              startIcon={<BugReport />}
              onClick={() => router.push('/debug')}
              sx={{ 
                color: '#666',
                '&:hover': { 
                  backgroundColor: 'rgba(0,0,0,0.04)' 
                }
              }}
            >
              Debug
            </Button>
          )}
          
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ color: "#666", fontSize: '0.875rem' }}>
                {user.name}
              </Typography>
              <Chip 
                label={getRoleLabel(user.role)} 
                size="small" 
                color={getRoleColor(user.role) as any}
                variant="outlined"
              />
            </Box>
          )}
          
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            sx={{ color: "#666" }}
          >
            <NotificationsOutlined />
          </IconButton>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ color: "#666" }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <PersonOutlined sx={{ mr: 2 }} />
              Perfil
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <SettingsOutlined sx={{ mr: 2 }} />
              Configurações
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutOutlined sx={{ mr: 2 }} />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
