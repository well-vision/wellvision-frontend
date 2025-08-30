import React from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid"; // ✅ free version

import FlexBetween from "./FlexBetween";

const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  const handleSearch = () => {
    setSearch(searchInput);
    setSearchInput("");
  };

  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        {/* Left-side buttons */}
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </FlexBetween>

        {/* Right-side search input */}
        <TextField
          label="Search..."
          variant="standard"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ mb: "0.5rem", width: "15rem" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FlexBetween>
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
