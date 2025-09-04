import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  Person,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";
import UserHeader from "./UserHeader";
import FlexBetween from "./FlexBetween";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const UserCustomerDashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const navigate = useNavigate();

  const [allCustomers, setAllCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [mode, setMode] = useState('create'); // create | edit | view

  const [formData, setFormData] = useState({
    givenName: '',
    familyName: '',
    ageYears: '',
    birthDate: '',
    nicPassport: '',
    gender: '',
    ethnicity: '',
    phoneNo: '',
    address: '',
    email: ''
  });

  const handleCustomerClick = async (id) => {
    navigate(`/customer/${id}`);
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/customers');
      const data = await res.json();
      if (res.ok) {
        setAllCustomers(data);
        setFilteredCustomers(data);
      } else {
        toast.error(data.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filtered = allCustomers.filter(customer =>
        customer.givenName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        customer.familyName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        customer.phoneNo?.includes(debouncedSearchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(allCustomers);
    }
  }, [debouncedSearchTerm, allCustomers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.givenName.trim()) newErrors.givenName = 'Given name is required';
    if (!formData.familyName.trim()) newErrors.familyName = 'Family name is required';
    if (!formData.phoneNo.trim()) newErrors.phoneNo = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = mode === 'edit' 
        ? `http://localhost:4000/api/customers/${selectedCustomer._id}`
        : 'http://localhost:4000/api/customers';
      
      const method = mode === 'edit' ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success(mode === 'edit' ? 'Customer updated successfully!' : 'Customer created successfully!');
        setShowDialog(false);
        resetForm();
        fetchCustomers();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setMode('edit');
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/customers/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Customer deleted successfully!');
        fetchCustomers();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const resetForm = () => {
    setFormData({
      givenName: '',
      familyName: '',
      ageYears: '',
      birthDate: '',
      nicPassport: '',
      gender: '',
      ethnicity: '',
      phoneNo: '',
      address: '',
      email: ''
    });
    setErrors({});
    setSelectedCustomer(null);
  };

  const handleAddNew = () => {
    resetForm();
    setMode('create');
    setShowDialog(true);
  };

  return (
    <Box m="1.5rem 2.5rem">
      {/* HEADER */}
      <FlexBetween>
        <UserHeader title="CUSTOMERS" subtitle="Manage your customer database" />
        
        <Box display="flex" gap="1rem" alignItems="center">
          <Box
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
            display="flex"
            alignItems="center"
          >
            <InputBase 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton>
              <Search />
            </IconButton>
          </Box>
          
          <Button
            onClick={handleAddNew}
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <Add sx={{ mr: "10px" }} />
            Add Customer
          </Button>
        </Box>
      </FlexBetween>

      {/* CUSTOMERS TABLE */}
      <Box mt="40px">
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: theme.palette.background.alt,
            "& .MuiTableCell-root": {
              borderBottom: `1px solid ${theme.palette.secondary[300]}`,
              color: theme.palette.secondary[100],
            },
            "& .MuiTableHead-root .MuiTableCell-root": {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.secondary[100],
              fontWeight: "bold",
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>Loading customers...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>No customers found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                (Array.isArray(filteredCustomers) ? filteredCustomers : []).map((customer) => (
                  <TableRow
                    key={customer._id}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.primary[800]
                      }
                    }}
                    onClick={() => handleCustomerClick(customer._id)}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap="10px">
                        <Person sx={{ color: theme.palette.secondary[300] }} />
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {customer.givenName} {customer.familyName}
                          </Typography>
                          <Typography variant="body2" color={theme.palette.secondary[300]}>
                            {customer.gender && (
                              <Chip
                                label={customer.gender}
                                size="small"
                                sx={{ mr: 1, fontSize: '0.7rem' }}
                              />
                            )}
                            Age: {customer.ageYears || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box display="flex" alignItems="center" gap="5px" mb="5px">
                          <Phone sx={{ fontSize: '16px', color: theme.palette.secondary[300] }} />
                          <Typography variant="body2">{customer.phoneNo}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="5px">
                          <Email sx={{ fontSize: '16px', color: theme.palette.secondary[300] }} />
                          <Typography variant="body2">{customer.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          NIC: {customer.nicPassport || 'N/A'}
                        </Typography>
                        <Box display="flex" alignItems="center" gap="5px" mt="5px">
                          <LocationOn sx={{ fontSize: '16px', color: theme.palette.secondary[300] }} />
                          <Typography variant="body2">
                            {customer.address || 'No address'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap="5px">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(customer);
                          }}
                        >
                          <Edit sx={{ fontSize: '18px' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(customer._id);
                          }}
                        >
                          <Delete sx={{ fontSize: '18px' }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ADD/EDIT DIALOG */}
      <Dialog 
        open={showDialog} 
        onClose={() => setShowDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
          }
        }}
      >
        <DialogTitle>
          {mode === 'edit' ? 'Edit Customer' : 'Add New Customer'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Given Name"
                  name="givenName"
                  value={formData.givenName}
                  onChange={handleInputChange}
                  error={!!errors.givenName}
                  helperText={errors.givenName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.secondary[100],
                      '& fieldset': {
                        borderColor: theme.palette.secondary[300],
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.secondary[200],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Family Name"
                  name="familyName"
                  value={formData.familyName}
                  onChange={handleInputChange}
                  error={!!errors.familyName}
                  helperText={errors.familyName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.secondary[100],
                      '& fieldset': {
                        borderColor: theme.palette.secondary[300],
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.secondary[200],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.secondary[100],
                      '& fieldset': {
                        borderColor: theme.palette.secondary[300],
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.secondary[200],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.secondary[100],
                      '& fieldset': {
                        borderColor: theme.palette.secondary[300],
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.secondary[200],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  name="ageYears"
                  type="number"
                  value={formData.ageYears}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.secondary[100],
                      '& fieldset': {
                        borderColor: theme.palette.secondary[300],
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.secondary[200],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: theme.palette.secondary[200] }}>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    sx={{
                      color: theme.palette.secondary[100],
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.secondary[300],
                      },
                    }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.secondary[100],
                      '& fieldset': {
                        borderColor: theme.palette.secondary[300],
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.secondary[200],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="NIC/Passport"
                  name="nicPassport"
                  value={formData.nicPassport}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.secondary[100],
                      '& fieldset': {
                        borderColor: theme.palette.secondary[300],
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.secondary[200],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.secondary[100],
                      '& fieldset': {
                        borderColor: theme.palette.secondary[300],
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.secondary[200],
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setShowDialog(false)}
              sx={{ color: theme.palette.secondary[300] }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.light,
                }
              }}
            >
              {isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserCustomerDashboard;