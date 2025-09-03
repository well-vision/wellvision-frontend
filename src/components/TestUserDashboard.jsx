import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const TestUserDashboard = () => {
  const theme = useTheme();
  
  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h2" color={theme.palette.secondary[100]}>
        Test User Dashboard
      </Typography>
      <Typography variant="body1" color={theme.palette.secondary[200]}>
        This is a test to verify Material-UI theming is working correctly.
      </Typography>
    </Box>
  );
};

export default TestUserDashboard;