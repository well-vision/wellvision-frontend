import React from "react";
import {
  GridColumnMenuContainer,
  GridColumnMenuSortItem,
  GridColumnMenuFilterItem,
  GridColumnMenuHideItem,
  GridColumnMenuColumnsItem
} from "@mui/x-data-grid"; // ✅ free version

const DataGridCustomColumnMenu = (props) => {
  const { hideMenu, currentColumn, open } = props;

  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      open={open}
    >
      <GridColumnMenuSortItem onClick={hideMenu} column={currentColumn} />
      <GridColumnMenuFilterItem onClick={hideMenu} column={currentColumn} />
      <GridColumnMenuHideItem onClick={hideMenu} column={currentColumn} />
      <GridColumnMenuColumnsItem onClick={hideMenu} column={currentColumn} />
    </GridColumnMenuContainer>
  );
};

export default DataGridCustomColumnMenu;
