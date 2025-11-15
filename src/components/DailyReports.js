import React, { useState, useMemo } from "react";
import './DailyReports.css';
import SidebarMenu from '../components/SidebarMenu';
import {
  Download,
  FileText,
  TrendingUp,
  Receipt,
  DollarSign,
  Calendar,
  BarChart3,
  Package
} from "lucide-react";
import { ResponsiveLine } from "@nivo/line";
import { DataGrid } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function DailyReports() {
  const [startDate, setStartDate] = useState(new Date("2024-09-01"));
  const [endDate, setEndDate] = useState(new Date("2024-09-18"));
  const [view, setView] = useState("sales");

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
  }, [startDate, endDate]);

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
      color: "#0d9488",
      data: filteredData.map((item) => ({
        x: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        y: item.totalSales,
      })),
    };

    const unitsLine = {
      id: "Total Units",
      color: "#14b8a6",
      data: filteredData.map((item) => ({
        x: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        y: item.totalUnits,
      })),
    };

    return view === "sales" ? [salesLine] : [unitsLine];
  }, [filteredData, view]);

  // Data grid columns
  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "totalSales",
      headerName: "Total Sales",
      width: 150,
      type: "number",
    },
    {
      field: "totalUnits",
      headerName: "Total Units",
      width: 150,
      type: "number",
    },
    {
      field: "totalInvoices",
      headerName: "Total Invoices",
      width: 150,
      type: "number",
    },
    {
      field: "revenue",
      headerName: "Revenue (Rs.)",
      width: 180,
      type: "number",
      valueFormatter: (params) => `Rs. ${params.value.toLocaleString()}`,
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
      `Rs. ${item.revenue.toLocaleString()}`,
    ]);

    doc.autoTable({
      head: [["Date", "Total Sales", "Total Units", "Total Invoices", "Revenue"]],
      body: tableData,
      startY: 20,
    });

    doc.save("daily-reports.pdf");
  };

  return (
    <div className="reports-page">
      <SidebarMenu active="daily-reports" />
      
      <div className="reports-main-content">
        {/* Header */}
        <div className="reports-header">
          <div className="reports-header-content">
            <div className="reports-header-title">
              <h2>Daily Reports</h2>
              <p className="reports-subtitle">Comprehensive daily sales and performance analytics</p>
            </div>
            <div className="reports-header-actions">
              <button className="export-btn" onClick={exportToExcel} title="Export to Excel">
                <Download size={16} />
                Excel
              </button>
              <button className="export-btn" onClick={exportToPDF} title="Export to PDF">
                <FileText size={16} />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="reports-content">
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
                <TrendingUp size={24} style={{ color: '#1E40AF' }} />
              </div>
              <div className="stat-details">
                <p className="stat-label">Total Sales</p>
                <h3 className="stat-value">{summaryStats.totalSales.toLocaleString()}</h3>
                <p className="stat-change positive">+12% from last period</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#DCFCE7' }}>
                <DollarSign size={24} style={{ color: '#166534' }} />
              </div>
              <div className="stat-details">
                <p className="stat-label">Total Revenue</p>
                <h3 className="stat-value">Rs. {summaryStats.totalRevenue.toLocaleString()}</h3>
                <p className="stat-change positive">+8% from last period</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#FEF3C7' }}>
                <Receipt size={24} style={{ color: '#92400E' }} />
              </div>
              <div className="stat-details">
                <p className="stat-label">Total Invoices</p>
                <h3 className="stat-value">{summaryStats.totalInvoices.toLocaleString()}</h3>
                <p className="stat-change positive">+15% from last period</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#F3E8FF' }}>
                <Calendar size={24} style={{ color: '#6D28D9' }} />
              </div>
              <div className="stat-details">
                <p className="stat-label">Daily Average</p>
                <h3 className="stat-value">Rs. {summaryStats.avgDailyRevenue.toLocaleString()}</h3>
                <p className="stat-change">Avg. per day</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#E0F2F1' }}>
                <Package size={24} style={{ color: '#0d9488' }} />
              </div>
              <div className="stat-details">
                <p className="stat-label">Total Units</p>
                <h3 className="stat-value">{summaryStats.totalUnits.toLocaleString()}</h3>
                <p className="stat-change">Units sold</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#FFF7ED' }}>
                <BarChart3 size={24} style={{ color: '#EA580C' }} />
              </div>
              <div className="stat-details">
                <p className="stat-label">Avg. Sales/Day</p>
                <h3 className="stat-value">{summaryStats.avgDailySales.toLocaleString()}</h3>
                <p className="stat-change">Daily average</p>
              </div>
            </div>
          </div>

          {/* Controls & Filters */}
          <div className="reports-controls">
            <div className="date-filters">
              <div className="date-picker-group">
                <label className="date-label">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="yyyy-MM-dd"
                  className="date-picker-input"
                />
              </div>
              <div className="date-picker-group">
                <label className="date-label">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="yyyy-MM-dd"
                  className="date-picker-input"
                />
              </div>
            </div>

            <div className="view-toggle">
              <button
                className={`toggle-btn ${view === 'sales' ? 'active' : ''}`}
                onClick={() => setView('sales')}
              >
                Sales
              </button>
              <button
                className={`toggle-btn ${view === 'units' ? 'active' : ''}`}
                onClick={() => setView('units')}
              >
                Units
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="chart-container">
            <h3 className="section-title">
              {view === 'sales' ? 'Sales Trend' : 'Units Sold Trend'}
            </h3>
            {formattedData.length > 0 ? (
              <div className="chart-wrapper">
                <ResponsiveLine
                  data={formattedData}
                  theme={{
                    axis: {
                      domain: {
                        line: {
                          stroke: "#9ca3af",
                          strokeWidth: 1,
                        },
                      },
                      legend: {
                        text: {
                          fill: "#6b7280",
                          fontSize: 14,
                          fontWeight: 600,
                        },
                      },
                      ticks: {
                        line: {
                          stroke: "#9ca3af",
                          strokeWidth: 1,
                        },
                        text: {
                          fill: "#6b7280",
                          fontSize: 12,
                        },
                      },
                    },
                    legends: {
                      text: {
                        fill: "#6b7280",
                        fontSize: 13,
                      },
                    },
                    tooltip: {
                      container: {
                        background: "white",
                        color: "#1f2937",
                        fontSize: 13,
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        padding: "12px",
                      },
                    },
                    grid: {
                      line: {
                        stroke: "#e5e7eb",
                        strokeWidth: 1,
                      },
                    },
                  }}
                  colors={{ datum: "color" }}
                  margin={{ top: 50, right: 110, bottom: 80, left: 80 }}
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
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    orient: "bottom",
                    tickSize: 5,
                    tickPadding: 10,
                    tickRotation: -45,
                    legend: "Date",
                    legendOffset: 70,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    orient: "left",
                    tickValues: 5,
                    tickSize: 5,
                    tickPadding: 10,
                    tickRotation: 0,
                    legend: `Total ${view === "sales" ? "Sales" : "Units"}`,
                    legendOffset: -70,
                    legendPosition: "middle",
                  }}
                  enableGridX={false}
                  enableGridY={true}
                  pointSize={8}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
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
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <h3 className="empty-state-title">No data available</h3>
                <p className="empty-state-description">
                  No data available for the selected date range
                </p>
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className="data-table-container">
            <h3 className="section-title">Detailed Report</h3>
            <div className="data-table-wrapper">
              <DataGrid
                rows={filteredData.map((item, index) => ({ ...item, id: index }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #e5e7eb',
                    color: '#1f2937',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f9fafb',
                    color: '#1f2937',
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: 600,
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyReports;