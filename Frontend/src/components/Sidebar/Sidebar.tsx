"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SupervisorAccount as LeaderIcon,
  School as AcademyIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

const drawerWidth = 280;

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "Participantes",
    icon: <PeopleIcon />,
    path: "/participants",
  },
  {
    text: "Líderes",
    icon: <LeaderIcon />,
    path: "/leaders",
  },
  {
    text: "Academia",
    icon: <AcademyIcon />,
    path: "/academy",
  },
];

export interface SidebarProps {
  mobileOpen?: boolean;
  onDrawerToggle?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onDrawerToggle, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile && onDrawerToggle) {
      onDrawerToggle();
    }
  };

  const drawerContent = (
    <>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ color: "white", fontWeight: 600 }}
        >
          Talent Lab
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: "#333" }} />
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={
                  pathname === item.path || pathname?.startsWith(item.path)
                }
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 2,
                  mb: 1,
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: drawerWidth }, 
        flexShrink: { md: 0 } 
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#1a1a1a',
            color: 'white',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#1a1a1a',
            color: 'white',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;