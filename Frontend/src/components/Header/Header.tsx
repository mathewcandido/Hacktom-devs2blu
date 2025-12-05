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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider,
} from "@mui/material";
import { 
  NotificationsOutlined, 
  LogoutOutlined, 
  PersonOutlined, 
  SettingsOutlined, 
  BugReport, 
  Menu as MenuIcon,
  School,
  TrendingUp,
  Group,
  CheckCircle
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 280;

interface HeaderProps {
  onDrawerToggle?: () => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle, isMobile }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      title: "Nova Turma de Desenvolvimento",
      message: "Turma 2025.1 de Full Stack Development iniciará em 15 de dezembro",
      time: "2 horas atrás",
      type: "training",
      icon: School,
      color: "#1976d2"
    },
    {
      id: 2,
      title: "Participante Aprovado",
      message: "João Silva foi aprovado na avaliação final de UX Design",
      time: "5 horas atrás",
      type: "achievement",
      icon: CheckCircle,
      color: "#2e7d32"
    },
    {
      id: 3,
      title: "Evolução da Turma",
      message: "Turma de QA atingiu 85% de evolução média geral",
      time: "1 dia atrás",
      type: "progress",
      icon: TrendingUp,
      color: "#ed6c02"
    },
    {
      id: 4,
      title: "Novos Participantes",
      message: "12 novos talentos ingressaram na incubadora esta semana",
      time: "2 dias atrás",
      type: "participants",
      icon: Group,
      color: "#9c27b0"
    }
  ];

  const unreadCount = notifications.length;

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

  const handleNotificationClick = () => {
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const formatTime = (timeString: string) => {
    return timeString;
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
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: 0, md: `${drawerWidth}px` },
        backgroundColor: "white",
        color: "#1a1a1a",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ 
            flexGrow: 1, 
            color: "#1a1a1a",
            fontSize: { xs: '1.1rem', md: '1.25rem' }
          }}
        >
          Painel de Controle
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Debug button - only in development */}
          {/* {process.env.NODE_ENV === 'development' && (
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
          )} */}
          
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 } }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666", 
                  fontSize: '0.875rem',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
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
            onClick={handleNotificationClick}
            sx={{ color: "#666" }}
          >
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <NotificationsOutlined />
            </Badge>
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
          
          {/* Notifications Dialog */}
          <Dialog
            open={notificationOpen}
            onClose={handleNotificationClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: { borderRadius: 2 }
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <NotificationsOutlined color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notificações
                </Typography>
                <Badge badgeContent={unreadCount} color="error" />
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              <List sx={{ py: 0 }}>
                {notifications.map((notification, index) => {
                  const IconComponent = notification.icon;
                  return (
                    <React.Fragment key={notification.id}>
                      <ListItem 
                        sx={{ 
                          py: 2,
                          px: 3,
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' }
                        }}
                      >
                        <ListItemIcon>
                          <IconComponent 
                            sx={{ 
                              color: notification.color,
                              fontSize: '1.5rem'
                            }} 
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle2" 
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                {notification.message}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.disabled"
                              >
                                {formatTime(notification.time)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < notifications.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  );
                })}
              </List>
            </DialogContent>
            
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleNotificationClose} variant="outlined">
                Fechar
              </Button>
              <Button 
                onClick={() => {
                  // Aqui poderia marcar todas como lidas
                  handleNotificationClose();
                }} 
                variant="contained"
              >
                Marcar como Lidas
              </Button>
            </DialogActions>
          </Dialog>
          
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
