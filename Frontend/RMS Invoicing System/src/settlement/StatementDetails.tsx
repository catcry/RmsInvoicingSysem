import React, { useEffect, useState } from "react";
import "../App.css";
// @ts-ignore: allow side-effect CSS import when no type declarations are present
import {
  Autocomplete,
  AutocompleteValue,
  FormControlLabel,
  Grid2,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { FormikValues } from "formik/dist/types";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useThemeContext } from "../base/ThemeContext";
import api from "../base/Api";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import dayjs from "dayjs";
import BaseAggregationTable from "./BaseAggregationTable";
import BaseAggregationModel from "../models/BaseAggregationModel";
import OutboundDetail from "./OutboundDetail";
import OutboundBaseAggregationModel from "../models/OutboundBaseAggregationModel";
import OutboundStatementModel from "../models/OutboundStatementModel";
import SettlementApiResponse from "../models/SettlementApiResponse";
import CountryModel from "../models/CountryModel";
import OperatorModel from "../models/OperatorModel";
import { useBackButton } from "../assets/Utils";
import { useLocation } from "react-router-dom";

export interface Filters extends FormikValues {
  navigate?: (url: string | URL) => void | undefined;
  outboundId?: number | undefined;
  operator?: string | null;
  year?: number | undefined;
  month?: number | undefined;
}

export default function StatementDetails(props: Readonly<Filters>) {
  const location = useLocation();
  const [countryList, setCountryList] = useState<CountryModel[]>([]);
  const [operators, setOperators] = useState<OperatorModel[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryModel | null>(
    null,
  );
  const [selectedOperatorModel, setSelectedOperatorModel] =
    useState<OperatorModel | null>(null);
  const [tapFileType, setTapFileType] = useState<string | null>("TAP_IN");

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const outboundIdFromUrl = searchParams.get("ob")
    ? Number(searchParams.get("ob"))
    : undefined;
  const operatorFromUrl = searchParams.get("o") || undefined;
  const yearFromUrl = searchParams.get("y")
    ? Number(searchParams.get("y"))
    : undefined;
  const monthFromUrl = searchParams.get("m")
    ? Number(searchParams.get("m"))
    : undefined;

  // Use URL parameters if available, otherwise use props
  const [selectedOperator, setSelectedOperator] = useState<
    string | null | undefined
  >(operatorFromUrl || props?.operator);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    yearFromUrl || props?.year,
  );
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    monthFromUrl || props?.month,
  );

  const [isError, setIsError] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });
  const [{ dataContent, outbound, dataTotalElements, isLoading }, setData] =
    useState<{
      dataContent: BaseAggregationModel[] | null | undefined;
      outbound: OutboundStatementModel | undefined;
      dataTotalElements: number;
      isLoading: boolean;
    }>({
      dataContent: null,
      outbound: undefined,
      dataTotalElements: 0,
      isLoading: false,
    });
  const [
    { selectedOperatorError, selectedYearError, selectedMonthError },
    setFormError,
  ] = useState<{
    selectedOperatorError: boolean;
    selectedYearError: boolean;
    selectedMonthError: boolean;
  }>({
    selectedOperatorError: false,
    selectedYearError: false,
    selectedMonthError: false,
  });

  const handleBackButton = () => {
    if (props.navigate) {
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

      // Navigate back with the same filter parameters
      props.navigate(
        `/settlement-management?y=${selectedYear}&m=${monthParam}&o=${selectedOperator}`,
      );
    }
  };

  const { beforeNavigate } = useBackButton(handleBackButton);
  const { theme } = useThemeContext();

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
            filter: value ?? props.operator,
            countryId: selectedCountry?.id,
          },
        },
      );
      setOperators(response.data);
    } catch (error) {
      console.error("Search error", error);
    }
  };

  useEffect(() => {
    loadCountryOptions();
    loadOperatorOptions();
  }, []);

  useEffect(() => {
    loadOperatorOptions();
  }, [selectedOperatorModel]);

  useEffect(() => {
    loadCountryOptions();
  }, [selectedCountry]);

  const validate = (): boolean => {
    let selectedOperatorError = false;
    let selectedYearError = false;
    let selectedMonthError = false;
    if (!outboundIdFromUrl) {
      if (!selectedOperator) {
        selectedOperatorError = true;
      }
      if (!selectedYear) {
        selectedYearError = true;
      }
      if (!selectedMonth) {
        selectedMonthError = true;
      }
      setFormError({
        selectedOperatorError,
        selectedMonthError,
        selectedYearError,
      });
    }
    return !(selectedOperatorError || selectedYearError || selectedMonthError);
  };

  const handleCountryChange = (
    event: React.SyntheticEvent,
    value: AutocompleteValue<CountryModel, false, false, false>,
  ) => {
    if (value?.operators) {
      setSelectedOperatorModel(null);
      setOperators(value.operators);
    }
    setSelectedCountry(value);
  };

  const handleOperatorChange = (
    event: React.SyntheticEvent,
    value: AutocompleteValue<OperatorModel, false, false, false>,
  ) => {
    setSelectedOperatorModel(value);
    setSelectedOperator(value?.tadigCode);
  };

  useEffect(() => {
    handleSearch();
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleSearch = async () => {
    if (!validate()) {
      return;
    }
    let month;
    if (selectedMonth) {
      month =
        selectedMonth.toString().length === 1
          ? "0" + selectedMonth
          : selectedMonth;
    }
    setData({
      dataContent: null,
      dataTotalElements: 0,
      outbound: undefined,
      isLoading: true,
    });
    setIsError(false);
    let params = outboundIdFromUrl
      ? {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          outboundId: outboundIdFromUrl,
          tapFileType: tapFileType,
        }
      : {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          tapFileType: tapFileType,
          year: selectedYear,
          month: month,
          operator: selectedOperator,
        };
    try {
      const response = await api.get<
        SettlementApiResponse<OutboundBaseAggregationModel>
      >(`api/base-aggregation/outbound-aggregations`, {
        headers: { "Content-Type": "application/json" },
        params,
      });
      if (response.data.exception) {
        alert(response.data.exception?.message);
        setData({
          dataContent: undefined,
          outbound: undefined,
          dataTotalElements: 0,
          isLoading: false,
        });
        setIsError(true);
        return;
      }
      let tadigCode = response.data.responseBody?.outbound?.operator;
      setSelectedOperatorModel(new OperatorModel({ tadigCode }));
      setSelectedOperator(tadigCode);
      setSelectedMonth(Number(response.data.responseBody?.outbound?.month));
      setSelectedYear(Number(response.data.responseBody?.outbound?.year));
      setData({
        dataContent: response.data.responseBody?.baseAggregations?.content,
        outbound: response.data.responseBody?.outbound,
        dataTotalElements: response.data.responseBody?.baseAggregations
          ? response.data.responseBody.baseAggregations.totalElements
          : 0,
        isLoading: false,
      });
    } catch (error) {
      setIsError(true);
    }
  };

  const handleYearChange = (value: any) => {
    setSelectedYear(value ? value.year() : null);
    setFormError({
      selectedYearError: !value,
      selectedMonthError,
      selectedOperatorError,
    });
  };

  const handleMonthChange = (value: any) => {
    setSelectedMonth(value ? value.month() + 1 : null);
    setFormError({
      selectedYearError,
      selectedMonthError: !value,
      selectedOperatorError,
    });
  };

  const handleModeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    setTapFileType(value);
  };

  return (
    <Grid2 rowSpacing={2} width={"100%"} mt={"1%"} mb={"1%"}>
      <RadioGroup value={tapFileType} onChange={handleModeChange}>
        <Grid2 container rowSpacing={1} justifyContent={"center"}>
          <Grid2 container size={12} spacing={1} width="90%">
            {/* <Grid2 container size={2}>
                            <FormControlLabel value="TAP_IN" control={<Radio/>} label="Tap In"/>
                        </Grid2>
                        <Grid2 container size={2}>
                            <FormControlLabel value="TAP_OUT" control={<Radio/>} label="Tap Out"/>
                        </Grid2> */}
          </Grid2>
        </Grid2>
      </RadioGroup>
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
                value={selectedOperatorModel}
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
              onClick={handleBackButton}
              style={{
                margin: "0.5%",
                color: "#ffffff",
                backgroundColor: theme.palette.primary.main,
              }}
              variant="contained"
            >
              Back
            </Button>
          </Grid2>
        </Grid2>
      </Box>
      <Grid2 rowSpacing={1} width={"100%"} mt={"1%"} mb={"1%"}>
        <Grid2
          container={true}
          sx={{
            width: "96%",
            margin: "0 2%",
            padding: "2%",
            boxShadow: 3,
            border: 1,
            borderRadius: "0.5px",
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
        >
          <OutboundDetail outbound={outbound} />
        </Grid2>
      </Grid2>
      {dataContent ? (
        <Box
          mt={"0.5%"}
          sx={{
            width: "98%",
            overflow: "auto",
            boxSizing: "border-box",
          }}
        >
          <BaseAggregationTable
            data={dataContent}
            isError={isError}
            totalElements={dataTotalElements}
            isLoading={isLoading}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
          />
        </Box>
      ) : null}
    </Grid2>
  );
}
