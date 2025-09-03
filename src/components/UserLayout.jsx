import React, { useState, useMemo } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "../admin/theme";
import UserNavbar from "./UserNavbar";
import UserSidebar from "./UserSidebar";

const UserLayout = ({ activePage, onNavigate, children }) => {
  const mode = useSelector((state) => state.global?.mode) || "light";
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display={isNonMobile ? "flex" : "block"} width="100%" minHeight="100vh">
        <UserSidebar
          isNonMobile={isNonMobile}
          drawerWidth="250px"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activePage={activePage}
          onNavigate={onNavigate}
        />
        <Box flexGrow={1} display="flex" flexDirection="column">
          <UserNavbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Box flexGrow={1} p={2}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UserLayout;