import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";
// @ts-ignore: allow side-effect CSS import when no type declarations are present
import "../App.css";
import Typography from "@mui/material/Typography";
import { useThemeContext } from "../base/ThemeContext";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api";
import BaseAggregationModel from "../models/BaseAggregationModel";

interface BaseAggregationTableProps {
  data: BaseAggregationModel[] | undefined;
  totalElements?: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: (
    model: GridPaginationModel,
    details: GridCallbackDetails,
  ) => void;
  isError: boolean;
  isLoading: boolean;
}

function CustomToolbar() {
  const { theme } = useThemeContext();

  return (
    <GridToolbarContainer
      style={{
        color:
          theme.palette.mode === "dark"
            ? theme.palette.secondary.light
            : theme.palette.secondary.dark,
      }}
    >
      <GridToolbarColumnsButton
        slotProps={{
          tooltip: { title: "Columns" },
          button: {
            style: {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.secondary.light
                  : theme.palette.secondary.dark,
            },
          },
        }}
      />
      <GridToolbarFilterButton
        slotProps={{
          tooltip: { title: "Filters" },
          button: {
            style: {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.secondary.light
                  : theme.palette.secondary.dark,
            },
          },
        }}
      />
      <GridToolbarDensitySelector
        slotProps={{
          tooltip: { title: "Change density" },
          button: {
            style: {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.secondary.light
                  : theme.palette.secondary.dark,
            },
          },
        }}
      />
    </GridToolbarContainer>
  );
}

const BaseAggregationTable: React.FC<BaseAggregationTableProps> = (
  props: BaseAggregationTableProps,
) => {
  const [rows, setRows] = React.useState<BaseAggregationModel[]>(
    props.data || [],
  );
  const { theme } = useThemeContext();

  const columns: GridColDef[] = [
    {
      field: "rowNumber",
      headerName: "#",
      headerClassName: "super-app-theme--header",
      disableExport: true,
      width: 50,
      renderCell: (params) => (
        <Typography variant="button">
          {params.api.getRowIndexRelativeToVisibleRows(params.id) +
            1 +
            props.paginationModel.page * props.paginationModel.pageSize}
        </Typography>
      ),
    },
    {
      field: "tapSequenceNumber",
      headerClassName: "super-app-theme--header",
      headerName: "Tap Sequence",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "totalCharge",
      headerClassName: "super-app-theme--header",
      headerName: "Total Charge",
      headerAlign: "center",
      width: 120,
    },
    {
      field: "totalTaxValue",
      headerClassName: "super-app-theme--header",
      headerName: "Total Tax",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "totalDiscountValue",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Total Discount",
      width: 180,
    },
    {
      field: "localCurrency",
      headerClassName: "super-app-theme--header",
      headerName: "Local Currency",
      headerAlign: "center",
      width: 180,
    },
    {
      field: "tapCurrency",
      headerClassName: "super-app-theme--header",
      headerName: "TAP Currency",
      headerAlign: "center",
      width: 160,
    },
    {
      field: "fileCreationTime",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      headerName: "File Creation Time",
      width: 160,
    },
    {
      field: "fileCreationUtcTo",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "File Creation UTC To",
      width: 160,
    },
    {
      field: "callEventDetailsCnt",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Call Event Details CNT",
      width: 160,
    },
    {
      field: "exchangeRate",
      headerName: "Exchange Rate",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 150,
    },
  ];
  if (props.isLoading) {
    return <CircularProgress />;
  } else if (props.isError) {
    return <span>Error loading data...</span>;
  } else {
    return (
      <div
        style={{
          height: "60%",
          width: "100%",
          paddingBottom: "1%",
          display: "grid",
          justifyContent: "center",
        }}
      >
        <DataGrid
          // apiRef={apiRef}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 25, 50, 100]}
          slots={{ toolbar: CustomToolbar }}
          pagination={true}
          rowCount={props.totalElements ?? 0}
          paginationModel={props.paginationModel}
          paginationMode="server"
          onPaginationModelChange={props.setPaginationModel}
          initialState={{
            columns: {
              columnVisibilityModel: {},
            },
          }}
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            "& .super-app-theme--header": {
              display: "flex",
              justifyContent: "center",
              color: "#ffffff",
              backgroundColor: theme.palette.primary.main,
            },
            // '& .super-app-theme--cell': {
            //     backgroundColor: 'rgb(192,209,236)',
            //     color: '#1a3e72',
            //     fontWeight: '600',
            // },
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
export default BaseAggregationTable;
