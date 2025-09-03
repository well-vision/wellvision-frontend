import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const AdminDashboard = () => {
  const theme = useTheme();

  return (
    <Box m="1.5rem 2.5rem">
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        DASHBOARD
      </Typography>
      <Typography variant="h5" color={theme.palette.secondary[300]}>
        Welcome to your admin dashboard
      </Typography>
      
      <Box mt="20px">
        <Typography variant="body1" color={theme.palette.secondary[200]}>
          This is the admin dashboard. Here you can manage all aspects of your application.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboard;