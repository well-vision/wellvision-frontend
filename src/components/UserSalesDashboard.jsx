import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputBase,
  ButtonGroup,
} from "@mui/material";
import {
  DownloadOutlined,
  Search,
  TrendingUpOutlined,
  AccountBalanceWalletOutlined,
  MoreVertOutlined,
} from "@mui/icons-material";
import UserHeader from "./UserHeader";
import UserStatBox from "./UserStatBox";
import FlexBetween from "./FlexBetween";

const filters = [
  { key: 'all', label: 'All Sales' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
];

// Currency formatter for Sri Lankan Rupees
const currencyFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
});

const UserSalesDashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  
  const [salesData] = useState([
    { id: 1, item: 'Pending glasses', date: 'Aug 2024 12:04', status: 'Pending', amount: 5000, category: 'glasses' },
    { id: 2, item: 'Lens cleaning kits', date: 'Jul 2024 07:45', status: 'Pending', amount: 2500, category: 'accessories' },
    { id: 3, item: 'Blue light blocking glasses', date: 'Jul 2024 15:30', status: 'Pending', amount: 8000, category: 'glasses' },
    { id: 4, item: 'Lens cleaning kits', date: 'Jul 2024 09:15', status: 'Completed', amount: 2500, category: 'accessories' },
    { id: 5, item: 'Reading glasses', date: 'Jun 2024 14:22', status: 'Completed', amount: 3500, category: 'glasses' },
    { id: 6, item: 'Lens cleaning kits', date: 'Jun 2024 11:08', status: 'Pending', amount: 2500, category: 'accessories' },
    { id: 7, item: 'Reading glasses', date: 'May 2024 16:45', status: 'Completed', amount: 3500, category: 'glasses' }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtered sales list
  const filteredSales = useMemo(() => {
    return salesData.filter(sale => {
      const matchesFilter = filter === 'all' || sale.status.toLowerCase() === filter;
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch =
        sale.item.toLowerCase().includes(lowerSearch) ||
        sale.date.toLowerCase().includes(lowerSearch);
      return matchesFilter && matchesSearch;
    });
  }, [salesData, filter, searchTerm]);

  // Calculate metrics using memo for efficiency
  const completedSales = useMemo(() => filteredSales.filter(sale => sale.status === 'Completed'), [filteredSales]);
  const pendingSales = useMemo(() => filteredSales.filter(sale => sale.status === 'Pending'), [filteredSales]);

  const salesAmount = useMemo(() => completedSales.reduce((sum, sale) => sum + sale.amount, 0), [completedSales]);
  const salesAccount = useMemo(() => pendingSales.reduce((sum, sale) => sum + sale.amount, 0), [pendingSales]);

  const formatCurrency = amount => currencyFormatter.format(amount);

  const getItemIcon = category => {
    switch(category) {
      case 'glasses': return '👓';
      case 'accessories': return '🧽';
      default: return '📦';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Completed' ? 'success' : 'warning';
  };

  const handleFilterChange = (key) => {
    setFilter(key);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box m="1.5rem 2.5rem">
      {/* HEADER */}
      <FlexBetween>
        <UserHeader title="MY SALES" subtitle="Welcome to your sales dashboard" />
        
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
              placeholder="Search sales..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <IconButton>
              <Search />
            </IconButton>
          </Box>
          
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      {/* STATS */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        <UserStatBox
          title="Sales Amount"
          value={formatCurrency(salesAmount)}
          increase="+5%"
          description="from last month"
          icon={
            <TrendingUpOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <UserStatBox
          title="Sales Account"
          value={formatCurrency(salesAccount)}
          increase="-3%"
          description="from last month"
          icon={
            <AccountBalanceWalletOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
      </Box>

      {/* SALES TABLE */}
      <Box mt="40px">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
          <Typography variant="h4" color={theme.palette.secondary[100]}>
            Sales
          </Typography>
          
          <ButtonGroup variant="outlined" size="small">
            {filters.map(f => (
              <Button
                key={f.key}
                variant={filter === f.key ? "contained" : "outlined"}
                onClick={() => handleFilterChange(f.key)}
                sx={{
                  backgroundColor: filter === f.key ? theme.palette.secondary.main : "transparent",
                  color: filter === f.key ? theme.palette.background.default : theme.palette.secondary[200],
                  borderColor: theme.palette.secondary[300],
                }}
              >
                {f.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

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
                <TableCell>Product</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap="10px">
                      <Typography sx={{ fontSize: "1.2rem" }}>
                        {getItemIcon(sale.category)}
                      </Typography>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {sale.item}
                        </Typography>
                        <Typography variant="body2" color={theme.palette.secondary[300]}>
                          {sale.date}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{formatCurrency(sale.amount)}</TableCell>
                  <TableCell>
                    <Chip
                      label={sale.status}
                      color={getStatusColor(sale.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredSales.length === 0 && (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            p="2rem"
            backgroundColor={theme.palette.background.alt}
            borderRadius="0.55rem"
            mt="1rem"
          >
            <Typography variant="h6" color={theme.palette.secondary[300]}>
              No sales found matching your criteria.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserSalesDashboard;