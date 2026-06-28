import React, { useEffect, useState } from "react";
// @ts-ignore: allow side-effect CSS import when no type declarations are present
import "../App.css";
import {
  Autocomplete,
  AutocompleteValue,
  CircularProgress,
  Dialog,
  FormControlLabel,
  Grid2,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import CountryModel from "../models/CountryModel";
import Button from "@mui/material/Button";
import { FormikValues } from "formik/dist/types";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useThemeContext } from "../base/ThemeContext";
import api from "../base/Api";
import { Page } from "../types";
import InboundStatementModel from "../models/InboundStatementModel";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import SettlementEditableTable from "./SettlementEditableTable";
import UploadCsv from "../base/FileUploader";
import WarnConfirmationDialog from "../Components/WarnConfirmationDialog";
import { GridRowModel } from "@mui/x-data-grid";
import { HttpStatusCode } from "axios";
import dayjs from "dayjs";
import OperatorModel from "../models/OperatorModel";
import SettlementApiResponse from "../models/SettlementApiResponse";
import { StreamType, StreamTypeLabel } from "../models/StreamType";

export interface Filters extends FormikValues {
  navigate?: (path: string | URL, options?: any) => void;
  beforeNavigate?: () => void;
  country?: string | null;
  operator?: string | null;
  year?: number | undefined;
  month?: number | undefined;
}

export default function SettlementSearchView(props: Readonly<Filters>) {
  const [countryList, setCountryList] = useState<CountryModel[]>([]);
  const [operators, setOperators] = useState<OperatorModel[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryModel | null>(
    null,
  );
  const [tapFileType, setTapFileType] = useState<string | null>("TAP_IN");
  const [selectedOperator, setSelectedOperator] = useState<
    OperatorModel | null | undefined
  >(new OperatorModel({ tadigCode: props?.operator }));
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    props?.year,
  );
  const [selectedYearError, setSelectedYearError] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    props?.month,
  );
  const [selectedMonthError, setSelectedMonthError] = useState<boolean>(false);
  const { theme } = useThemeContext();
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });
  const [{ dataContent, dataTotalElements, isLoading }, setData] = useState<{
    dataContent: InboundStatementModel[] | null;
    dataTotalElements: number;
    isLoading: boolean;
  }>({
    dataContent: null,
    dataTotalElements: 0,
    isLoading: false,
  });
  const [isError, setIsError] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [streamType, setStreamType] = useState<StreamType | null>(null);
  const streamTypeOptions = Object.values(StreamType);
  // Function to navigate to statement details
  const handleViewStatementDetails = (
    row: InboundStatementModel | undefined,
  ) => {
    if (props.beforeNavigate) {
      props.beforeNavigate();
    }

    // Format month to ensure it's two digits
    let monthParam;
    if (selectedMonth) {
      monthParam =
        selectedMonth.toString().length === 1
          ? "0" + selectedMonth
          : selectedMonth;
    }

    // Navigate with search parameters
    props.navigate?.("/statement-details", {
      state: {
        outboundId: row?.outboundId,
        year: selectedYear,
        month: monthParam,
        operator: row?.tadig,
      },
    });
    // props.navigate?.(`/statement-details?ob=${outboundId}&y=${selectedYear}&m=${monthParam}&o=${selectedOperator?.tadigCode}`);
  };

  const handleClose = () => {
    setOpen(false);
    handleSearch();
  };

  const loadCountryOptions = async (value?: string) => {
    try {
      const response = await api.get<CountryModel[]>(
        `api/country/load-options`,
        {
          headers: { "Content-Type": "application/json" },
          params: {
            filter: value ? value : props.country,
          },
        },
      );
      setCountryList(response.data);
    } catch (error) {
      console.error("Search error", error);
    }
  };

  const loadOperatorOptions = async (value?: string) => {
    try {
      const response = await api.get<OperatorModel[]>(
        `api/operator/load-options`,
        {
          headers: { "Content-Type": "application/json" },
          params: {
            filter: value ? value : props.operator,
            countryId: selectedCountry?.id,
          },
        },
      );
      setOperators(response.data);
    } catch (error) {
      console.error("Search error", error);
    }
  };

  const recreateInbounds = async () => {
    setData({
      dataContent: null,
      dataTotalElements: 0,
      isLoading: true,
    });
    setOpen(false);
    setIsError(false);
    try {
      let month;
      if (selectedMonth) {
        month =
          selectedMonth.toString().length === 1
            ? "0" + selectedMonth
            : selectedMonth;
      }
      const response = await api.post<
        SettlementApiResponse<Page<InboundStatementModel>>
      >(`api/settlements/recreate`, null, {
        headers: { "Content-Type": "application/json" },
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          tapFileType: tapFileType,
          streamType: streamType,
          countryId: selectedCountry?.id,
          operator: selectedOperator?.tadigCode,
          year: selectedYear,
          month,
        },
      });
      if (response.data.exception) {
        setData({
          dataContent: null,
          dataTotalElements: 0,
          isLoading: false,
        });
        setIsError(true);
        alert(new Error(response.data.exception?.message));
      } else
        setData({
          dataContent: response.data.responseBody
            ? response.data.responseBody.content
            : null,
          dataTotalElements: response.data.responseBody
            ? response.data.responseBody.totalElements
            : 0,
          isLoading: false,
        });
      setOpen(false);
    } catch (error) {
      setIsError(true);
    }
  };

  const validate = (): boolean => {
    let hasError = false;
    if (!selectedYear) {
      setSelectedYearError(true);
      hasError = true;
    }
    if (!selectedMonth) {
      setSelectedMonthError(true);
      hasError = true;
    }
    return !hasError;
  };

  useEffect(() => {
    handleSearch();
  }, [
    selectedOperator,
    selectedMonth,
    selectedYear,
    streamType,
    paginationModel.page,
    paginationModel.pageSize,
  ]);

  useEffect(() => {
    loadOperatorOptions();
  }, [selectedOperator]);

  useEffect(() => {
    loadCountryOptions();
  }, [selectedCountry]);

  const handleSearch = async () => {
    if (!validate()) {
      return;
    }
    setData({
      dataContent: null,
      dataTotalElements: 0,
      isLoading: true,
    });
    setIsError(false);
    try {
      let month;
      if (selectedMonth) {
        month =
          selectedMonth.toString().length === 1
            ? "0" + selectedMonth
            : selectedMonth;
      }
      const response = await api.post<
        SettlementApiResponse<Page<InboundStatementModel>>
      >(`api/settlements/search`, null, {
        headers: { "Content-Type": "application/json" },
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          tapFileType: tapFileType,
          streamType: streamType,
          countryId: selectedCountry?.id,
          operator: selectedOperator?.tadigCode,
          year: selectedYear,
          month,
        },
      });
      if (response.data.exception) {
        setData({
          dataContent: null,
          dataTotalElements: 0,
          isLoading: false,
        });
        setIsError(true);
        alert(new Error(response.data.exception?.message));
      } else
        setData({
          dataContent: response.data.responseBody
            ? response.data.responseBody.content
            : null,
          dataTotalElements: response.data.responseBody
            ? response.data.responseBody.totalElements
            : 0,
          isLoading: false,
        });
      setOpen(false);
    } catch (error) {
      setIsError(true);
    }
  };

  const handleCreate = async () => {
    if (!validate()) {
      return;
    }
    setData({
      dataContent: null,
      dataTotalElements: 0,
      isLoading: true,
    });
    setIsError(false);
    try {
      let month;
      if (selectedMonth) {
        month =
          selectedMonth.toString().length === 1
            ? "0" + selectedMonth
            : selectedMonth;
      }
      const response = await api.post<
        SettlementApiResponse<Page<InboundStatementModel>>
      >(`api/settlements/create`, null, {
        headers: { "Content-Type": "application/json" },
        params: {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          tapFileType: tapFileType,
          streamType: streamType,
          countryId: selectedCountry?.id,
          operator: selectedOperator?.tadigCode,
          year: selectedYear,
          month,
        },
      });
      if (response.data.exception) {
        setData({
          dataContent: null,
          dataTotalElements: 0,
          isLoading: false,
        });
        setIsError(true);
        alert(new Error(response.data.exception?.message));
      } else
        setData({
          dataContent: response.data.responseBody
            ? response.data.responseBody.content
            : null,
          dataTotalElements: response.data.responseBody
            ? response.data.responseBody.totalElements
            : 0,
          isLoading: false,
        });
    } catch (error: any) {
      if (error.toString()?.includes("status code 409")) {
        setData({
          dataContent: null,
          dataTotalElements: 0,
          isLoading: false,
        });
        setOpen(true);
      }
      setIsError(true);
    }
  };

  const handleStreamTypeChange = (
    event: React.SyntheticEvent,
    value: AutocompleteValue<StreamType, false, false, false>,
  ) => {
    setStreamType(value);
  };
  const handleCountryChange = (
    event: React.SyntheticEvent,
    value: AutocompleteValue<CountryModel, false, false, false>,
  ) => {
    if (value?.operators) {
      setSelectedOperator(null);
      setOperators(value.operators);
    }
    setSelectedCountry(value);
  };

  const handleOperatorChange = (
    event: React.SyntheticEvent,
    value: AutocompleteValue<OperatorModel, false, false, false>,
  ) => {
    setSelectedOperator(value);
  };

  const handleYearChange = (value: any) => {
    setSelectedYear(value ? value.year() : null);
    setSelectedYearError(!value);
  };

  const handleMonthChange = (value: any) => {
    setSelectedMonth(value ? value.month() + 1 : null);
    setSelectedMonthError(!value);
  };

  const handleModeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    setTapFileType(value);
  };

  const updateInbound = async (updatedRow: GridRowModel | undefined) => {
    if (!updatedRow || !dataContent) return;
    try {
      const response = await api.put<
        SettlementApiResponse<InboundStatementModel>
      >(`api/settlements/update-inbound`, updatedRow, {
        headers: { "Content-Type": "application/json" },
      });
      if (response?.data?.exception) {
        alert(new Error(response.data.exception?.message));
        return;
      }
      await reloadInbound(updatedRow.id);
    } catch (error: any) {
      if (error?.response?.data?.status === 470) {
        const message = error.response.data.message.substring(
          0,
          error.response.data.message.indexOf("\n"),
        );
        alert(message);
        await reloadInbound(updatedRow.id);
        console.error("Search error", error);
      } else {
        alert(error?.response?.data?.message);
      }
      console.error("error type", typeof error);
    }
  };

  const confirmStatement = async (inboundId: number) => {
    if (!inboundId || !dataContent) return;
    try {
      const confirmResponse = await api.put<HttpStatusCode>(
        `api/settlements/confirm-statement`,
        inboundId,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      if (confirmResponse.status !== HttpStatusCode.Ok) {
        alert(new Error("Failed to confirm"));
        return;
      }
      await reloadInbound(inboundId);
    } catch (error) {
      console.error("Search error", error);
    }
  };

  const reloadInbound = async (inboundId: number) => {
    if (!inboundId || !dataContent) return;
    const dataRows: InboundStatementModel[] = dataContent;
    setData({
      dataContent: null,
      dataTotalElements: 0,
      isLoading: true,
    });
    const loadResponse = await api.get<
      SettlementApiResponse<InboundStatementModel>
    >(`api/settlements/load/` + inboundId, {
      headers: { "Content-Type": "application/json" },
    });
    if (loadResponse.status !== HttpStatusCode.Ok) {
      alert(new Error("Failed to update"));
      return;
    }
    if (loadResponse.data.exception) {
      alert(new Error(loadResponse.data.exception.message));
      return;
    }
    const newRowValues = loadResponse.data.responseBody;
    const updatedRows = dataRows.map((oldRow: InboundStatementModel) =>
      oldRow.id === newRowValues?.id
        ? new InboundStatementModel(newRowValues)
        : oldRow,
    );
    setData({ isLoading: false, dataContent: updatedRows, dataTotalElements });
  };

  return (
    <Grid2 rowSpacing={2} width={"100%"} mt={"1%"} mb={"1%"}>
      <Grid2 container rowSpacing={1} justifyContent={"center"} mt={"1%"}>
        <Grid2 container size={12} spacing={3} width="90%">
          <Grid2 container size={3}>
            <Autocomplete
              id="stream-type-select"
              fullWidth
              options={streamTypeOptions}
              size="medium"
              autoHighlight
              value={streamType}
              onChange={handleStreamTypeChange}
              getOptionLabel={(option: StreamType) =>
                option ? StreamTypeLabel[option] : ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stream Type"
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                      autoComplete: "new-password",
                    },
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={3}>
            <RadioGroup row value={tapFileType} onChange={handleModeChange}>
              {/* <Grid2 container>
                <FormControlLabel
                  value="TAP_IN"
                  control={<Radio />}
                  label="Tap In"
                />
                <FormControlLabel
                  value="TAP_OUT"
                  control={<Radio />}
                  label="Tap Out"
                />
              </Grid2> */}
            </RadioGroup>
          </Grid2>
          <Grid2 size={6} />
        </Grid2>
      </Grid2>

      <Grid2 container rowSpacing={1} justifyContent={"center"} mt={"1%"}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid2 container size={12} spacing={1} width="90%">
            <Grid2 container size={3}>
              <Autocomplete
                id="country-select"
                fullWidth
                options={countryList}
                size="medium"
                autoHighlight
                value={selectedCountry}
                onChange={handleCountryChange}
                onInputChange={(event: React.SyntheticEvent, value: string) =>
                  loadCountryOptions(value)
                }
                getOptionLabel={(option: CountryModel) =>
                  option.name ? option.name : ""
                }
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box
                      {...optionProps}
                      key={key}
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    >
                      {option && option.isoAlpha2 ? (
                        <img
                          loading="lazy"
                          width="20"
                          srcSet={`https://flagcdn.com/w40/${option.isoAlpha2.toLowerCase()}.png 2x`}
                          src={`https://flagcdn.com/w20/${option.isoAlpha2.toLowerCase()}.png`}
                          alt=""
                        />
                      ) : (
                        ""
                      )}
                      {option.name} ({option.isoAlpha2}) +{option.countryCode}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    slotProps={{
                      htmlInput: {
                        ...params.inputProps,
                        autoComplete: "new-password",
                      },
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 container size={3}>
              <Autocomplete
                id="operator-select-demo"
                options={operators}
                fullWidth
                onChange={handleOperatorChange}
                onInputChange={(event: React.SyntheticEvent, value: string) =>
                  loadOperatorOptions(value)
                }
                autoHighlight
                value={selectedOperator}
                getOptionLabel={(option: OperatorModel) =>
                  option.tadigCode ? option.tadigCode : ""
                }
                renderOption={(props, option: OperatorModel) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box key={key} component="li" {...optionProps}>
                      {option.tadigCode}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Operator"
                    slotProps={{
                      htmlInput: {
                        ...params.inputProps,
                        autoComplete: "new-password",
                      },
                    }}
                  />
                )}
              />
            </Grid2>
            <Grid2 container size={3}>
              <DatePicker
                label={"Year"}
                openTo="year"
                views={["year"]}
                value={selectedYear ? dayjs(selectedYear + "--") : null}
                sx={{ width: "100%" }}
                onChange={handleYearChange}
                slotProps={{
                  textField: {
                    error: selectedYearError,
                    helperText: selectedYearError ? "Year is required" : "",
                  },
                }}
              />
            </Grid2>
            <Grid2 container size={3}>
              <DatePicker
                label={"Month"}
                openTo="month"
                views={["month"]}
                sx={{ width: "100%" }}
                value={selectedMonth ? dayjs("-" + selectedMonth + "-") : null}
                onChange={handleMonthChange}
                slotProps={{
                  textField: {
                    error: selectedMonthError,
                    helperText: selectedMonthError ? "Month is required" : "",
                  },
                }}
              />
            </Grid2>
          </Grid2>
        </LocalizationProvider>
      </Grid2>
      <Box sx={{ flexGrow: 1 }} mx={"2%"} py={"1%"}>
        <Grid2 container spacing={2} width={"98%"}>
          <Grid2 container justifyContent={"flex-start"} size={4}>
            <Button
              onClick={handleSearch}
              style={{
                margin: "0.5%",
                color: "#ffffff",
                backgroundColor: theme.palette.primary.main,
              }}
              variant="contained"
            >
              Search
            </Button>
            <Button
              onClick={handleCreate}
              style={{
                margin: "0.5%",
                color: "#ffffff",
                backgroundColor: theme.palette.primary.main,
              }}
              variant="contained"
            >
              Create
            </Button>
          </Grid2>
          <Grid2 container justifyContent={"flex-end"} size={8}>
            <Button
              variant="contained"
              style={{
                margin: "0.5%",
                color: "#ffffff",
                backgroundColor: theme.palette.primary.main,
              }}
              onClick={() => alert("Comming Soon ...")}
            >
              Reload TAP data
            </Button>
            <UploadCsv />
          </Grid2>
        </Grid2>
      </Box>
      {isLoading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        />
      )}
      <Box
        mt={"0.5%"}
        sx={{
          width: "98%",
          overflow: "auto",
          boxSizing: "border-box",
        }}
      >
        {dataContent ? (
          <SettlementEditableTable
            navigate={props.navigate}
            beforeNavigate={props.beforeNavigate}
            onViewDetails={handleViewStatementDetails}
            data={dataContent}
            isError={isError}
            totalElements={dataTotalElements}
            isLoading={isLoading}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            updateInbound={updateInbound}
            confirmStatement={confirmStatement}
          />
        ) : null}{" "}
      </Box>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="data-exist-alert"
      >
        <WarnConfirmationDialog
          handleClose={handleClose}
          handleConfirm={recreateInbounds}
          contentMessage={
            "There is already inbounds for this date. Do you wanna update them?"
          }
        />
      </Dialog>
    </Grid2>
  );
}
