import React, { useState, useMemo } from "react";
import './DailyReports.css';
import {
  Box,
  useTheme,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Download,
  FileText,
  TrendingUp,
  Receipt,
  DollarSign,
  Calendar,
} from "lucide-react";
import { ResponsiveLine } from "@nivo/line";
import { DataGrid } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DailyReports = () => {
  const [startDate, setStartDate] = useState(new Date("2024-09-01"));
  const [endDate, setEndDate] = useState(new Date("2024-09-18"));
  const [view, setView] = useState("sales");
  const theme = useTheme();

  // Sample data for demonstration
  const sampleData = [
    { date: "2024-09-01", totalSales: 120, totalUnits: 60, totalInvoices: 12, revenue: 12000 },
    { date: "2024-09-02", totalSales: 150, totalUnits: 75, totalInvoices: 15, revenue: 15000 },
    { date: "2024-09-03", totalSales: 180, totalUnits: 90, totalInvoices: 18, revenue: 18000 },
    { date: "2024-09-04", totalSales: 200, totalUnits: 100, totalInvoices: 20, revenue: 20000 },
    { date: "2024-09-05", totalSales: 220, totalUnits: 110, totalInvoices: 22, revenue: 22000 },
    { date: "2024-09-06", totalSales: 190, totalUnits: 95, totalInvoices: 19, revenue: 19000 },
    { date: "2024-09-07", totalSales: 210, totalUnits: 105, totalInvoices: 21, revenue: 21000 },
    { date: "2024-09-08", totalSales: 230, totalUnits: 115, totalInvoices: 23, revenue: 23000 },
    { date: "2024-09-09", totalSales: 250, totalUnits: 125, totalInvoices: 25, revenue: 25000 },
    { date: "2024-09-10", totalSales: 270, totalUnits: 135, totalInvoices: 27, revenue: 27000 },
    { date: "2024-09-11", totalSales: 240, totalUnits: 120, totalInvoices: 24, revenue: 24000 },
    { date: "2024-09-12", totalSales: 260, totalUnits: 130, totalInvoices: 26, revenue: 26000 },
    { date: "2024-09-13", totalSales: 280, totalUnits: 140, totalInvoices: 28, revenue: 28000 },
    { date: "2024-09-14", totalSales: 300, totalUnits: 150, totalInvoices: 30, revenue: 30000 },
    { date: "2024-09-15", totalSales: 320, totalUnits: 160, totalInvoices: 32, revenue: 32000 },
    { date: "2024-09-16", totalSales: 290, totalUnits: 145, totalInvoices: 29, revenue: 29000 },
    { date: "2024-09-17", totalSales: 310, totalUnits: 155, totalInvoices: 31, revenue: 31000 },
    { date: "2024-09-18", totalSales: 330, totalUnits: 165, totalInvoices: 33, revenue: 33000 },
  ];

  // Filter data based on date range
  const filteredData = useMemo(() => {
    return sampleData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }, [sampleData, startDate, endDate]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalSales = filteredData.reduce((sum, item) => sum + item.totalSales, 0);
    const totalUnits = filteredData.reduce((sum, item) => sum + item.totalUnits, 0);
    const totalInvoices = filteredData.reduce((sum, item) => sum + item.totalInvoices, 0);
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const avgDailySales = filteredData.length > 0 ? totalSales / filteredData.length : 0;
    const avgDailyRevenue = filteredData.length > 0 ? totalRevenue / filteredData.length : 0;

    return {
      totalSales,
      totalUnits,
      totalInvoices,
      totalRevenue,
      avgDailySales: Math.round(avgDailySales),
      avgDailyRevenue: Math.round(avgDailyRevenue),
    };
  }, [filteredData]);

  // Prepare chart data
  const formattedData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return [];
    }

    const salesLine = {
      id: "Total Sales",
      color: theme.palette.secondary.main,
      data: filteredData.map((item) => ({
        x: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        y: item.totalSales,
      })),
    };

    const unitsLine = {
      id: "Total Units",
      color: theme.palette.secondary[600],
      data: filteredData.map((item) => ({
        x: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        y: item.totalUnits,
      })),
    };

    return view === "sales" ? [salesLine] : [unitsLine];
  }, [filteredData, view, theme.palette.secondary]);

  // Data grid columns
  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "totalSales",
      headerName: "Total Sales",
      width: 120,
      type: "number",
    },
    {
      field: "totalUnits",
      headerName: "Total Units",
      width: 120,
      type: "number",
    },
    {
      field: "totalInvoices",
      headerName: "Total Invoices",
      width: 140,
      type: "number",
    },
    {
      field: "revenue",
      headerName: "Revenue ($)",
      width: 120,
      type: "number",
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
    },
  ];

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Reports");
    XLSX.writeFile(workbook, "daily-reports.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Reports", 20, 10);

    const tableData = filteredData.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.totalSales,
      item.totalUnits,
      item.totalInvoices,
      `$${item.revenue.toLocaleString()}`,
    ]);

    doc.autoTable({
      head: [["Date", "Total Sales", "Total Units", "Total Invoices", "Revenue"]],
      body: tableData,
      startY: 20,
    });

    doc.save("daily-reports.pdf");
  };

  return (
    <div className="daily-reports-container">
      {/* Header */}
      <h1 className="reports-header-title">DAILY REPORTS</h1>
      <p className="reports-header-subtitle">
        Comprehensive daily sales and performance analytics
      </p>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: theme.palette.background.alt }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color={theme.palette.secondary[100]}>
                    Total Sales
                  </Typography>
                  <Typography variant="h4" color={theme.palette.secondary[100]}>
                    {summaryStats.totalSales.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp size={32} color={theme.palette.secondary.main} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: theme.palette.background.alt }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color={theme.palette.secondary[100]}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" color={theme.palette.secondary[100]}>
                    ${summaryStats.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <DollarSign size={32} color={theme.palette.secondary.main} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: theme.palette.background.alt }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color={theme.palette.secondary[100]}>
                    Total Invoices
                  </Typography>
                  <Typography variant="h4" color={theme.palette.secondary[100]}>
                    {summaryStats.totalInvoices.toLocaleString()}
                  </Typography>
                </Box>
                <Receipt size={32} color={theme.palette.secondary.main} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: theme.palette.background.alt }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color={theme.palette.secondary[100]}>
                    Daily Average
                  </Typography>
                  <Typography variant="h4" color={theme.palette.secondary[100]}>
                    ${summaryStats.avgDailyRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <Calendar size={32} color={theme.palette.secondary.main} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" gap={2}>
          <Button
            sx={{
              backgroundColor: view === "sales" ? theme.palette.secondary[300] : "transparent",
              color: view === "sales" ? theme.palette.primary[600] : theme.palette.secondary[100],
            }}
            onClick={() => setView("sales")}
          >
            Sales
          </Button>
          <Button
            sx={{
              backgroundColor: view === "units" ? theme.palette.secondary[300] : "transparent",
              color: view === "units" ? theme.palette.primary[600] : theme.palette.secondary[100],
            }}
            onClick={() => setView("units")}
          >
            Units
          </Button>
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Export to Excel">
            <IconButton onClick={exportToExcel} sx={{ color: theme.palette.secondary[100] }}>
              <Download size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to PDF">
            <IconButton onClick={exportToPDF} sx={{ color: theme.palette.secondary[100] }}>
              <FileText size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Date Pickers */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" gap={2}>
          <Box>
            <Typography variant="body2" color={theme.palette.secondary[200]} mb={1}>
              Start Date
            </Typography>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
            />
          </Box>
          <Box>
            <Typography variant="body2" color={theme.palette.secondary[200]} mb={1}>
              End Date
            </Typography>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
            />
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box
        className="chart-container"
        mb={4}
        sx={{
          position: "relative",
          overflow: "visible",
          padding: "20px",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "8px",
          border: `1px solid ${theme.palette.secondary[200]}`,
          "& > div": {
            overflow: "visible !important",
          },
          "& svg": {
            overflow: "visible !important",
          },
        }}
      >
        {formattedData.length > 0 ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 2,
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                    fontSize: 14,
                    fontWeight: 600,
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 2,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                    fontSize: 13,
                    fontWeight: 500,
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                  fontSize: 13,
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                  background: theme.palette.background.paper,
                  boxShadow: theme.shadows[4],
                  borderRadius: "4px",
                  padding: "8px",
                },
              },
              grid: {
                line: {
                  stroke: theme.palette.secondary[300],
                  strokeWidth: 1,
                  opacity: 0.6,
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 20, right: 100, bottom: 60, left: 80 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.0f"
            curve="catmullRom"
            enableArea={false}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 10,
              tickPadding: 20,
              tickRotation: -45,
              legend: "Date",
              legendOffset: 60,
              legendPosition: "middle",
              format: (value) => value,
              tickValues: filteredData.length <= 15 ? "every 1 day" : "every 2 days",
            }}
            axisLeft={{
              orient: "left",
              tickValues: 5,
              tickSize: 10,
              tickPadding: 15,
              tickRotation: 0,
              legend: `Total ${view === "sales" ? "Sales" : "Units"}`,
              legendOffset: -80,
              legendPosition: "middle",
              format: (value) => value.toLocaleString(),
            }}
            enableGridX={true}
            enableGridY={true}
            gridXValues={filteredData.length <= 10 ? filteredData.map((_, i) => i) : undefined}
            gridYValues={5}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={3}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-18}
            useMesh={true}
            animate={false}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: -50,
                translateY: 30,
                itemsSpacing: 8,
                itemDirection: "left-to-right",
                itemWidth: 120,
                itemHeight: 24,
                itemOpacity: 0.95,
                symbolSize: 14,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            sx={{
              backgroundColor: theme.palette.background.alt,
              borderRadius: "8px",
              border: `1px solid ${theme.palette.secondary[200]}`,
            }}
          >
            <Typography variant="h6" color={theme.palette.secondary[200]}>
              No data available for the selected date range
            </Typography>
          </Box>
        )}
      </Box>

      {/* Data Grid */}
      <Box
        sx={{
          height: 400,
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: theme.palette.background.alt,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.secondary[200]}`,
            color: theme.palette.secondary[100],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: `1px solid ${theme.palette.secondary[200]}`,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: `1px solid ${theme.palette.secondary[200]}`,
          },
        }}
      >
        <DataGrid
          rows={filteredData.map((item, index) => ({ ...item, id: index }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default DailyReports;
