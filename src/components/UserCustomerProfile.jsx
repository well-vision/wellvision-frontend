import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  ExpandMore,
  Add,
  Visibility,
  Receipt,
} from "@mui/icons-material";
import UserHeader from "./UserHeader";
import { toast } from 'react-toastify';

const UserCustomerProfile = () => {
  const theme = useTheme();
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/customers/${customerId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch customer');

        setCustomer(data.customer);
        setPrescriptions([
          { id: 1, name: 'Prescription 1', description: 'Reading glasses prescription', date: '2023-07-01', time: '10:00 AM' },
          { id: 2, name: 'Prescription 2', description: 'Distance vision correction', date: '2023-07-05', time: '2:00 PM' },
          { id: 3, name: 'Prescription 3', description: 'Progressive lenses', date: '2023-07-10', time: '11:30 AM' },
        ]);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box m="1.5rem 2.5rem">
        <Typography variant="h4" color={theme.palette.secondary[100]}>
          Loading customer profile...
        </Typography>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box m="1.5rem 2.5rem">
        <Typography variant="h4" color="error">
          Customer not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      {/* HEADER */}
      <Box display="flex" alignItems="center" gap="1rem" mb="2rem">
        <IconButton 
          onClick={() => navigate('/customers')}
          sx={{ color: theme.palette.secondary[300] }}
        >
          <ArrowBack />
        </IconButton>
        <UserHeader 
          title={`${customer.givenName} ${customer.familyName}`} 
          subtitle="Customer Profile" 
        />
      </Box>

      {/* CUSTOMER INFO CARD */}
      <Card 
        sx={{ 
          backgroundColor: theme.palette.background.alt,
          mb: "2rem"
        }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap="1rem" mb="1rem">
                <Person sx={{ color: theme.palette.secondary[300], fontSize: "2rem" }} />
                <Box>
                  <Typography variant="h4" color={theme.palette.secondary[100]}>
                    {customer.givenName} {customer.familyName}
                  </Typography>
                  <Box display="flex" gap="1rem" mt="0.5rem">
                    {customer.gender && (
                      <Chip 
                        label={customer.gender} 
                        size="small" 
                        sx={{ backgroundColor: theme.palette.secondary[300] }}
                      />
                    )}
                    {customer.ageYears && (
                      <Chip 
                        label={`Age: ${customer.ageYears}`} 
                        size="small" 
                        sx={{ backgroundColor: theme.palette.primary[300] }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap="1rem">
                <Box display="flex" alignItems="center" gap="1rem">
                  <Phone sx={{ color: theme.palette.secondary[300] }} />
                  <Typography color={theme.palette.secondary[100]}>
                    {customer.phoneNo}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                  <Email sx={{ color: theme.palette.secondary[300] }} />
                  <Typography color={theme.palette.secondary[100]}>
                    {customer.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap="1rem">
                  <LocationOn sx={{ color: theme.palette.secondary[300] }} />
                  <Typography color={theme.palette.secondary[100]}>
                    {customer.address || 'No address provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: theme.palette.secondary[300] }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.secondary[200],
            },
            '& .Mui-selected': {
              color: theme.palette.secondary[100],
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        >
          <Tab label="Personal Details" />
          <Tab label="Prescriptions" />
          <Tab label="Invoice" />
        </Tabs>
      </Box>

      {/* TAB CONTENT */}
      <Box mt="2rem">
        {activeTab === 0 && (
          <Card sx={{ backgroundColor: theme.palette.background.alt }}>
            <CardContent>
              <Typography variant="h5" color={theme.palette.secondary[100]} mb="1.5rem">
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box mb="1rem">
                    <Typography variant="body2" color={theme.palette.secondary[300]}>
                      Given Name
                    </Typography>
                    <Typography variant="body1" color={theme.palette.secondary[100]}>
                      {customer.givenName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box mb="1rem">
                    <Typography variant="body2" color={theme.palette.secondary[300]}>
                      Family Name
                    </Typography>
                    <Typography variant="body1" color={theme.palette.secondary[100]}>
                      {customer.familyName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box mb="1rem">
                    <Typography variant="body2" color={theme.palette.secondary[300]}>
                      Age
                    </Typography>
                    <Typography variant="body1" color={theme.palette.secondary[100]}>
                      {customer.ageYears || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box mb="1rem">
                    <Typography variant="body2" color={theme.palette.secondary[300]}>
                      Birth Date
                    </Typography>
                    <Typography variant="body1" color={theme.palette.secondary[100]}>
                      {customer.birthDate || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box mb="1rem">
                    <Typography variant="body2" color={theme.palette.secondary[300]}>
                      NIC/Passport
                    </Typography>
                    <Typography variant="body1" color={theme.palette.secondary[100]}>
                      {customer.nicPassport || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box mb="1rem">
                    <Typography variant="body2" color={theme.palette.secondary[300]}>
                      Ethnicity
                    </Typography>
                    <Typography variant="body1" color={theme.palette.secondary[100]}>
                      {customer.ethnicity || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb="1.5rem">
              <Typography variant="h5" color={theme.palette.secondary[100]}>
                Prescriptions
              </Typography>
              <Button
                startIcon={<Add />}
                sx={{
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.background.alt,
                }}
              >
                Add Prescription
              </Button>
            </Box>

            {prescriptions.length === 0 ? (
              <Card sx={{ backgroundColor: theme.palette.background.alt }}>
                <CardContent>
                  <Typography variant="body1" color={theme.palette.secondary[200]} textAlign="center">
                    No prescriptions found for this customer.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box>
                {prescriptions.map((prescription) => (
                  <Accordion 
                    key={prescription.id}
                    sx={{
                      backgroundColor: theme.palette.background.alt,
                      color: theme.palette.secondary[100],
                      mb: "1rem",
                      '&:before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore sx={{ color: theme.palette.secondary[300] }} />}>
                      <Box display="flex" alignItems="center" gap="1rem" width="100%">
                        <Receipt sx={{ color: theme.palette.secondary[300] }} />
                        <Box flexGrow={1}>
                          <Typography variant="h6">{prescription.name}</Typography>
                          <Typography variant="body2" color={theme.palette.secondary[300]}>
                            {prescription.date} at {prescription.time}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" color={theme.palette.secondary[200]}>
                        {prescription.description}
                      </Typography>
                      <Box mt="1rem" display="flex" gap="1rem">
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          sx={{ color: theme.palette.secondary[300] }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Card sx={{ backgroundColor: theme.palette.background.alt }}>
            <CardContent>
              <Typography variant="h5" color={theme.palette.secondary[100]} mb="1.5rem">
                Invoice Management
              </Typography>
              <Typography variant="body1" color={theme.palette.secondary[200]}>
                Invoice functionality will be implemented here.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default UserCustomerProfile;