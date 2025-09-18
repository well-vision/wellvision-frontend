import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { useGetAdminsQuery } from "../../state/api"; // Changed path
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header"; // Changed path
import CustomColumnMenu from "../../components/DataGridCustomColumnMenu"; // Changed path

const Admin = () => {
  const theme = useTheme();
  const { data, isLoading, error } = useGetAdminsQuery();

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        if (!params.value) return "N/A";
        const phoneStr = params.value.toString();
        if (phoneStr.length === 10) {
          return phoneStr.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
        }
        return phoneStr;
      },
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
    },
  ];

  if (isLoading) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="ADMINS" subtitle="Managing admins and list of admins" />
        <Typography variant="h6" sx={{ mt: "20px" }}>
          Loading admins...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="ADMINS" subtitle="Managing admins and list of admins" />
        <Typography variant="h6" color="error" sx={{ mt: "20px" }}>
          Error loading admins: {error.message || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  // Defensive check for data
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="ADMINS" subtitle="Managing admins and list of admins" />
        <Typography variant="h6" sx={{ mt: "20px" }}>
          No admins found
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADMINS" subtitle="Managing admins and list of admins" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={false}
          getRowId={(row) => row._id}
          rows={safeData}
          columns={columns}
          // Temporarily remove custom column menu to avoid runtime error
          // components={{
          //   ColumnMenu: CustomColumnMenu,
          // }}
        />
      </Box>
    </Box>
  );
};

export default Admin;