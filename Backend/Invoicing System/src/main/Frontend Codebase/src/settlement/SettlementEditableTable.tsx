import * as React from "react";
import { useCallback, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridColTypeDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Dialog, IconButton } from "@mui/material";
// @ts-ignore
import "../App.css";
import Typography from "@mui/material/Typography";
import InboundStatementModel from "../models/InboundStatementModel";
import { useThemeContext } from "../base/ThemeContext";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api";
import { OverridableStringUnion } from "@mui/types";
import WarnConfirmationDialog from "../Components/WarnConfirmationDialog";
import { blue, grey } from "@mui/material/colors";
import { Cancel, CheckCircle, Edit, Info, Save } from "@mui/icons-material";

interface SettlementDataTableProps {
  navigate?: (path: string | URL, options?: any) => void;
  beforeNavigate?: () => void;
  data: InboundStatementModel[] | undefined | null;
  totalElements?: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: (
    model: GridPaginationModel,
    details: GridCallbackDetails,
  ) => void;
  updateInbound: (updatedRow: GridRowModel | undefined) => void;
  confirmStatement: (inboundId: number) => void;
  isError: boolean;
  isLoading: boolean;
  onViewDetails?: (outboundId: InboundStatementModel | undefined) => void;
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
      <GridToolbarExport
        slotProps={{
          tooltip: { title: "Export data" },
          button: {
            color:
              theme.palette.mode === "dark"
                ? theme.palette.secondary.light
                : theme.palette.secondary.dark,
          },
        }}
      />
    </GridToolbarContainer>
  );
}

const SettlementEditableTable: React.FC<SettlementDataTableProps> = (
  props: SettlementDataTableProps,
) => {
  const [rows, setRows] = React.useState<InboundStatementModel[]>(
    props.data || [],
  );
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const { theme } = useThemeContext();
  const apiRef = useGridApiRef();
  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      // apiRef.current.forceUpdate();
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };
  // Create a handler for the Info button click
  const handleInfoClick = useCallback(
    (outboundId: number) => {
      if (props.navigate && props.beforeNavigate) {
        // Mark this as programmatic navigation
        props.beforeNavigate();

        // Small delay to ensure the flag is set before navigation
        setTimeout(() => {
          props.navigate!("/statement-details/" + "ob=" + outboundId);
        }, 10);
      }
    },
    [props.navigate, props.beforeNavigate],
  );
  const saveRow = useCallback((id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setTimeout(() => {
      const updatedRow = apiRef.current.getRow(id);
      if (updatedRow) {
        props.updateInbound(updatedRow);
      }
    }, 100);
  }, []);
  const handleKeyDown: GridEventListener<"cellKeyDown"> = (params, event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default DataGrid behavior
      saveRow(params.row.id);
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const ConfirmationCellContent = (row: InboundStatementModel) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    let color: OverridableStringUnion<
      "default" | "error" | "success" | "warning"
    >;

    if (row.status)
      return (
        <Typography
          height={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          Confirmed
        </Typography>
      );
    else if (row.diffAmount !== undefined && row.diffAmount === 0) {
      color = "success";
    } else if (row.diffAmount !== undefined && row.diffAmount > 5) {
      color = "error";
    } else {
      color = "warning";
    }

    return (
      <>
        <Dialog
          open={open}
          keepMounted
          onClose={handleClose}
          aria-describedby="data-exist-alert"
        >
          <WarnConfirmationDialog
            handleClose={handleClose}
            handleConfirm={() => {
              props.confirmStatement(row.id ? row.id : -1);
              handleClose();
            }}
            contentMessage={
              "The SDR difference is: " +
              row.diffAmount +
              ", do you sure you want to confirm this invoice? it can`t be unconfirmed later."
            }
          />
        </Dialog>
        <IconButton
          style={{ display: "flex", justifySelf: "center" }}
          color={color}
          onClick={() => setOpen(true)}
        >
          <CheckCircle />
        </IconButton>
      </>
    );
  };

  const usdPrice: GridColTypeDef = {
    type: "number",
    width: 150,
  };
  const parseToSerialList = (value: string): string[] => {
    if (!value) return [];

    return value
      .split(",")
      .map((s) => s.trim())
      .flatMap((part) => {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map((s) => s.trim());
          const startNum = parseInt(start, 10);
          const endNum = parseInt(end, 10);
          if (!isNaN(startNum) && !isNaN(endNum)) {
            const width = 5;
            const range = [];
            for (let i = startNum; i <= endNum; i++) {
              range.push(i.toString().padStart(width, "0"));
            }
            return range;
          }
          return [];
        } else {
          return part;
        }
      });
  };

  const compressSerials = (serialList: string[]): string => {
    if (serialList.length === 0) return "";

    const width = 5;
    const nums = serialList
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    const result: string[] = [];
    let start = nums[0];
    let end = nums[0];

    for (let i = 1; i < nums.length; i++) {
      if (nums[i] === end + 1) {
        end = nums[i];
      } else {
        if (start === end) {
          result.push(start.toString().padStart(width, "0"));
        } else {
          result.push(
            `${start.toString().padStart(width, "0")}-${end.toString().padStart(width, "0")}`,
          );
        }
        start = end = nums[i];
      }
    }

    // Push final segment
    if (start === end) {
      result.push(start.toString().padStart(width, "0"));
    } else {
      result.push(
        `${start.toString().padStart(width, "0")}-${end.toString().padStart(width, "0")}`,
      );
    }

    return result.join(", ");
  };

  const processRowUpdate = (newRow: any, oldRow: any) => {
    const updatedRow = { ...newRow };

    const newIncludes = newRow.includeSerials || "";
    const newExcludes = newRow.excludeSerials || "";
    const oldIncludes = oldRow.includeSerials || "";
    const oldExcludes = oldRow.excludeSerials || "";

    let includeList = parseToSerialList(newIncludes);
    let excludeList = parseToSerialList(newExcludes);

    // Remove conflicts
    if (newIncludes !== oldIncludes) {
      excludeList = excludeList.filter(
        (serial) => !includeList.includes(serial),
      );
    }

    if (newExcludes !== oldExcludes) {
      includeList = includeList.filter(
        (serial) => !excludeList.includes(serial),
      );
    }

    // Compress and set
    updatedRow.includeSerials = compressSerials(includeList);
    updatedRow.excludeSerials = compressSerials(excludeList);

    return updatedRow;
  };

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
      field: "tadig",
      headerClassName: "super-app-theme--header",
      headerName: "TADIG",
      headerAlign: "center",
      width: 100,
      editable: false,
    },

    {
      field: "fromSerial",
      headerClassName: "super-app-theme--header",
      headerName: "From Serial",
      headerAlign: "center",
      width: 120,
      editable: false,
    },
    {
      field: "toSerial",
      headerClassName: "super-app-theme--header",
      headerName: "To Serial",
      headerAlign: "center",
      width: 110,
      editable: false,
    },
    {
      field: "excludeSerials",
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      headerName: "Excluded Serials",
      width: 180,
    },
    {
      field: "includeSerials",
      editable: true,
      headerClassName: "super-app-theme--header",
      headerName: "Included Serials",
      headerAlign: "center",
      width: 180,
    },
    {
      field: "tapAmount",
      headerClassName: "super-app-theme--header",
      headerName: "TAP3 SDR Amount",
      type: "number",
      headerAlign: "center",
      width: 180,
      ...usdPrice,
    },
    {
      field: "invoiceSdr",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      type: "number",
      headerName: "Invoice Amount",
      width: 160,
      editable: true,
      ...usdPrice,
    },
    {
      field: "cdrAmount",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      headerName: "CDR Amount",
      width: 160,
      ...usdPrice,
    },
    {
      field: "diffAmount",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      type: "number",
      headerName: "SDR Difference",
      width: 160,
      ...usdPrice,
    },
    {
      field: "lastUpdateBy",
      headerName: "Last Update By",
      type: "string",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "confirmed",
      headerName: "Confirmation",
      headerClassName: "super-app-theme--header",
      disableExport: true,
      headerAlign: "center",
      renderCell: (params: GridCellParams) => (
        <ConfirmationCellContent {...params.row} />
      ),
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "super-app-theme--header",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params: GridRenderCellParams<InboundStatementModel>) => {
        const { id } = params;
        const rowModes = rowModesModel[id];
        const isInEditMode =
          rowModes?.mode === GridRowModes.Edit && !params.row.status;

        if (isInEditMode) {
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <GridActionsCellItem
                icon={
                  <Save
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.dark,
                    }}
                  />
                }
                label="Save"
                onClick={() => saveRow(id)}
              />
              <GridActionsCellItem
                icon={
                  <Cancel
                    sx={{
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.dark,
                    }}
                  />
                }
                label="Cancel"
                onClick={handleCancelClick(id)}
                color="inherit"
              />
            </div>
          );
        }

        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <GridActionsCellItem
              icon={
                <Edit
                  sx={{
                    color: params.row.status
                      ? (theme) => theme.palette.grey[500]
                      : (theme) =>
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.dark,
                  }}
                />
              }
              label="Edit"
              disabled={params.row.status}
              onClick={handleEditClick(id)}
              color="inherit"
            />
            <GridActionsCellItem
              icon={
                <Info
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : theme.palette.primary.dark,
                  }}
                />
              }
              label="View Details"
              onClick={() => props.onViewDetails?.(params.row)}
              color="inherit"
            />
          </div>
        );
      },
    },
  ];

  if (props.isLoading) {
    // return <CircularProgress color='info'/>;
    return <Typography>Loading...</Typography>;
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
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          isCellEditable={(params) => !params.row.status} // Cell is editable only if status is false
          editMode="row"
          rowModesModel={rowModesModel}
          processRowUpdate={processRowUpdate}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          disableRowSelectionOnClick={true}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 25, 50, 100]}
          slots={{ toolbar: CustomToolbar }}
          pagination={true}
          rowCount={props.totalElements ?? 0}
          paginationModel={props.paginationModel}
          paginationMode="server"
          onPaginationModelChange={props.setPaginationModel}
          onCellKeyDown={handleKeyDown}
          initialState={{
            columns: {
              columnVisibilityModel: {
                lastUpdateBy: false,
                cdrAmount: false,
              },
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
              color:
                theme.palette.mode === "light"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            },
            "& .super-app-theme--cell": {
              backgroundColor: "rgb(192,209,236)",
              color: "#1a3e72",
              fontWeight: "600",
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
export default SettlementEditableTable;
