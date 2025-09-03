import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Geography = () => {
  const theme = useTheme();

  return (
    <Box m="1.5rem 2.5rem">
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        GEOGRAPHY
      </Typography>
      <Typography variant="h5" color={theme.palette.secondary[300]}>
        Geographic data visualization
      </Typography>
      
      <Box mt="20px">
        <Typography variant="body1" color={theme.palette.secondary[200]}>
          Geographic analytics will be implemented here.
        </Typography>
      </Box>
    </Box>
  );
};

export default Geography;