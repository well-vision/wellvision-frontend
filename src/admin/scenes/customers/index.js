import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Customers = () => {
  const theme = useTheme();

  return (
    <Box m="1.5rem 2.5rem">
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        CUSTOMERS
      </Typography>
      <Typography variant="h5" color={theme.palette.secondary[300]}>
        Manage your customers
      </Typography>
      
      <Box mt="20px">
        <Typography variant="body1" color={theme.palette.secondary[200]}>
          Customer management functionality will be implemented here.
        </Typography>
      </Box>
    </Box>
  );
};

export default Customers;