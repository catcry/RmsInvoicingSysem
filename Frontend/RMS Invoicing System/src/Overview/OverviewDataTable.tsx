import * as React from "react";
import { useEffect, useState } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridEventListener,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";
// @ts-ignore: allow side-effect CSS import when no type declarations are present
import "../App.css";
import { useThemeContext } from "../base/ThemeContext";
import { Page } from "../types";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api";
import { Check, Close } from "@mui/icons-material";
import ProfileViewModel from "./ProfileViewModel";
import { useNavigate } from "react-router-dom";
import { OverviewProps } from "./Overview";
import { Filters } from "../settlement/SettlementSearchView";

interface OverviewDataTableProps extends OverviewProps {
  navigate: (path: string | URL, options?: any) => void;
  data: Page<ProfileViewModel>;
  paginationModel: GridPaginationModel;
  setPaginationModel: (
    model: GridPaginationModel,
    details: GridCallbackDetails,
  ) => void;
  isError: boolean;
  isLoading: boolean;
}

const OverviewDataTable: React.FC<OverviewDataTableProps> = (
  props: OverviewDataTableProps,
) => {
  const [rows, setRows] = React.useState<ProfileViewModel[]>(
    props.data?.content || [],
  );

  const [hash, setHash] = useState(window.location.hash.replace("#", ""));
  const { theme } = useThemeContext();

  const navigate = useNavigate();

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash.replace("#", ""));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      disableExport: true,
      width: 5,
    },

    {
      field: "yearMonth",
      headerClassName: "super-app-theme--header",
      headerName: "Year-Month",
      width: 100,
      // editable: true
    },

    {
      field: "operator",
      headerClassName: "super-app-theme--header",
      headerName: "Operator",
      width: 80,
      // editable: true
    },
    {
      field: "country",
      headerClassName: "super-app-theme--header",
      headerName: "Country",
      width: 80,
    },
    {
      field: "status",
      // editable: false,
      headerClassName: "super-app-theme--header",
      headerName: "Status",
      renderCell: (params: GridCellParams) =>
        params.row.status ? <Check /> : <Close />,
      width: 60,
    },
    {
      field: "tap3Amount",
      // editable: true,
      headerClassName: "super-app-theme--header",
      headerName: "Tap3 Amount",
      width: 120,
    },
  ];
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    if (props.navigate) {
      const [year, month] = params.row.yearMonth.split("-");
      const filterData: Filters = {
        operator: params.row.operator,
        navigate: props.navigate,
        year,
        month,
      };
      props.navigate("/settlement-management", {
        state: { year, month, operator: filterData.operator },
      });
    }
  };

  if (props.isLoading) {
    return <CircularProgress />;
  } else if (props.isError) {
    return <span>Error loading data...</span>;
  } else {
    return (
      <div
        style={{
          height: "100%",
          // width: '100%',
          paddingBottom: "1%",
          display: "grid",
          justifyContent: "center",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
          hideFooter={true}
          disableRowSelectionOnClick={true}
          getRowId={(row) => row.id}
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            "& .super-app-theme--header": {
              color: "#ffffff",
              backgroundColor: theme.palette.primary.main,
            },
          }}
          slotProps={{
            toolbar: {
              style: {
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.secondary.light
                    : theme.palette.secondary.dark,
              },
            },
          }}
        />
      </div>
    );
  }
};

export default OverviewDataTable;
