import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    path: "/dashboard"
  },
  {
    text: "Customers",
    icon: <Groups2Outlined />,
    path: "/customers"
  },
  {
    text: "Invoice",
    icon: <ReceiptLongOutlined />,
    path: "/invoice"
  },
  {
    text: "Profile",
    icon: <PersonOutlined />,
    path: "/profile"
  },
];

const UserSidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
  activePage,
  onNavigate,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleNavigation = (text, path) => {
    navigate(path);
    if (onNavigate) {
      const pageKey = path.substring(1) || 'dashboard';
      onNavigate(pageKey);
    }
  };

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                color={theme.palette.secondary.main}
              >
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    WELLVISION
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </Box>
            </Box>
            <List>
              {navItems.map(({ text, icon, path }) => {
                const lcText = text.toLowerCase();
                const isActive = active === lcText || activePage === lcText;

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(text, path)}
                      sx={{
                        backgroundColor: isActive
                          ? theme.palette.secondary[300]
                          : "transparent",
                        color: isActive
                          ? theme.palette.primary[600]
                          : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color: isActive
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {isActive && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default UserSidebar;