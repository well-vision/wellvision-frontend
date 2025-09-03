import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Card,
  CardContent,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import {
  Save,
  Print,
  Receipt,
  Calculate,
} from "@mui/icons-material";
import UserHeader from "./UserHeader";
import FlexBetween from "./FlexBetween";
import { toast } from 'react-toastify';

const UserWellVisionInvoice = () => {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    orderNo: '',
    date: new Date().toISOString().slice(0, 10),
    billNo: '',
    name: '',
    tel: '',
    address: '',
    items: Array(4).fill(null).map(() => ({ item: '', description: '', rs: '', cts: '' })),
    amount: '',
    advance: '',
    balance: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch next Bill No from backend
  useEffect(() => {
    const fetchBillNo = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/invoices/next-bill-no');
        const data = await res.json();

        if (data.success) {
          setFormData(prev => ({ ...prev, billNo: data.nextBillNo }));
        } else {
          toast.error(data.message || 'Failed to load Bill No');
        }
      } catch (err) {
        toast.error('Error fetching Bill No');
        console.error(err);
      }
    };

    fetchBillNo();
  }, []);

  // Recalculate amount & balance when items or advance changes
  useEffect(() => {
    const total = formData.items.reduce((acc, curr) => {
      const rs = parseFloat(curr.rs) || 0;
      const cts = parseFloat(curr.cts) || 0;
      return acc + rs + cts / 100;
    }, 0);

    const advance = parseFloat(formData.advance) || 0;
    const balance = total - advance;

    setFormData(prev => ({
      ...prev,
      amount: total.toFixed(2),
      balance: balance.toFixed(2)
    }));
  }, [formData.items, formData.advance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    if (!formData.tel.trim()) newErrors.tel = 'Telephone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Check if at least one item is filled
    const hasItems = formData.items.some(item => 
      item.item.trim() || item.description.trim() || item.rs || item.cts
    );
    if (!hasItems) newErrors.items = 'At least one item is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:4000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('Invoice saved successfully!');
        // Reset form or redirect
        handleReset();
      } else {
        toast.error(data.message || 'Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      orderNo: '',
      date: new Date().toISOString().slice(0, 10),
      billNo: '',
      name: '',
      tel: '',
      address: '',
      items: Array(4).fill(null).map(() => ({ item: '', description: '', rs: '', cts: '' })),
      amount: '',
      advance: '',
      balance: '',
    });
    setErrors({});
  };

  const handlePrint = () => {
    window.print();
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: theme.palette.secondary[100],
      '& fieldset': {
        borderColor: theme.palette.secondary[300],
      },
      '&:hover fieldset': {
        borderColor: theme.palette.secondary[200],
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.secondary.main,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.secondary[200],
    },
  };

  return (
    <Box m="1.5rem 2.5rem">
      {/* HEADER */}
      <FlexBetween mb="2rem">
        <UserHeader title="INVOICE" subtitle="Create and manage invoices" />
        
        <Box display="flex" gap="1rem">
          <Button
            onClick={handlePrint}
            sx={{
              backgroundColor: theme.palette.primary[300],
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <Print sx={{ mr: "10px" }} />
            Print
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <Save sx={{ mr: "10px" }} />
            {isSubmitting ? 'Saving...' : 'Save Invoice'}
          </Button>
        </Box>
      </FlexBetween>

      {/* INVOICE FORM */}
      <Card sx={{ backgroundColor: theme.palette.background.alt }}>
        <CardContent>
          {/* COMPANY HEADER */}
          <Box textAlign="center" mb="2rem">
            <Typography variant="h3" color={theme.palette.secondary[100]} fontWeight="bold">
              WELLVISION
            </Typography>
            <Typography variant="h6" color={theme.palette.secondary[200]}>
              Eye Care & Optical Services
            </Typography>
            <Typography variant="body2" color={theme.palette.secondary[300]}>
              123 Main Street, Colombo 01 | Tel: +94 11 234 5678
            </Typography>
          </Box>

          <Divider sx={{ backgroundColor: theme.palette.secondary[300], mb: "2rem" }} />

          {/* INVOICE DETAILS */}
          <Grid container spacing={3} mb="2rem">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Order No"
                name="orderNo"
                value={formData.orderNo}
                onChange={handleInputChange}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bill No"
                name="billNo"
                value={formData.billNo}
                onChange={handleInputChange}
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>

          {/* CUSTOMER DETAILS */}
          <Typography variant="h5" color={theme.palette.secondary[100]} mb="1rem">
            Customer Details
          </Typography>
          <Grid container spacing={3} mb="2rem">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telephone"
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                error={!!errors.tel}
                helperText={errors.tel}
                sx={textFieldStyles}
              />
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
                error={!!errors.address}
                helperText={errors.address}
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>

          {/* ITEMS TABLE */}
          <Typography variant="h5" color={theme.palette.secondary[100]} mb="1rem">
            Items
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{ 
              backgroundColor: theme.palette.background.default,
              mb: "2rem"
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.secondary[100], fontWeight: 'bold' }}>
                    Item
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.secondary[100], fontWeight: 'bold' }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.secondary[100], fontWeight: 'bold' }}>
                    Rs.
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.secondary[100], fontWeight: 'bold' }}>
                    Cts.
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={item.item}
                        onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                        sx={textFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        sx={textFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={item.rs}
                        onChange={(e) => handleItemChange(index, 'rs', e.target.value)}
                        sx={textFieldStyles}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={item.cts}
                        onChange={(e) => handleItemChange(index, 'cts', e.target.value)}
                        sx={textFieldStyles}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {errors.items && (
            <Typography color="error" variant="body2" mb="1rem">
              {errors.items}
            </Typography>
          )}

          {/* TOTALS */}
          <Box display="flex" justifyContent="flex-end">
            <Box width="300px">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" color={theme.palette.secondary[100]}>
                    Total Amount:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color={theme.palette.secondary[100]} textAlign="right">
                    Rs. {formData.amount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Advance"
                    name="advance"
                    type="number"
                    value={formData.advance}
                    onChange={handleInputChange}
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" height="100%">
                    <Typography variant="body1" color={theme.palette.secondary[200]}>
                      Rs. {formData.advance || '0.00'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color={theme.palette.secondary[100]} fontWeight="bold">
                    Balance:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography 
                    variant="h6" 
                    color={theme.palette.secondary.main} 
                    textAlign="right"
                    fontWeight="bold"
                  >
                    Rs. {formData.balance}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* ACTION BUTTONS */}
          <Box display="flex" justifyContent="center" gap="2rem" mt="3rem">
            <Button
              onClick={handleReset}
              variant="outlined"
              sx={{
                borderColor: theme.palette.secondary[300],
                color: theme.palette.secondary[200],
                '&:hover': {
                  borderColor: theme.palette.secondary[200],
                  backgroundColor: theme.palette.primary[800],
                }
              }}
            >
              Reset Form
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.background.default,
                px: "2rem",
                '&:hover': {
                  backgroundColor: theme.palette.secondary.light,
                }
              }}
            >
              <Receipt sx={{ mr: "10px" }} />
              {isSubmitting ? 'Saving...' : 'Generate Invoice'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserWellVisionInvoice;