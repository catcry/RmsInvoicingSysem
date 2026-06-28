import React, {useEffect, useState} from 'react';
import '../App.css'
import {
    Autocomplete,
    AutocompleteRenderInputParams,
    Grid2,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Slider,
    TextField
} from "@mui/material";
import {FormikValues} from "formik/dist/types";
import Box from "@mui/material/Box";
import {useThemeContext} from "../base/ThemeContext";
import api from "../base/Api";
import {Page} from "../types";
import {GridPaginationModel} from "@mui/x-data-grid/models/gridPaginationProps";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import {BarChart} from '@mui/x-charts/BarChart';
import InternationalOutboundsSummaryModel from "../models/InternationalOutboundsSummaryModel";
import DailyBaseAggregationReportModel from "../models/DailyBaseAggregationReportModel";
import {MakeOptional} from "@mui/x-charts/internals";
import {BarSeriesType} from "@mui/x-charts";
import SettlementApiResponse from "../models/SettlementApiResponse";
import dayjs, {Dayjs} from "dayjs";
import ProfileViewModel from "../Overview/ProfileViewModel";
import LastMonthHistoryOverview from "../Overview/LastMonthHistoryOverview";
import OverviewDataTable from "../Overview/OverviewDataTable";
import {NavigateFunction} from "react-router-dom";

interface SeriesType extends MakeOptional<BarSeriesType, "type"> {
    label: string;
    data: (number)[];
}

export interface OverviewProps extends FormikValues {
    navigate: (path: string | URL, options?: any) => void;
}

const now:Dayjs = dayjs(new Date());
const lastMonths: Dayjs[] = [
    now.subtract(1, "month"),
    now.subtract(2, "month"),
    now.subtract(3, "month"),
];
const InternationalOutboundOverview: React.FC<OverviewProps> = (props: OverviewProps) => {
    const {theme} = useThemeContext();
    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });

    const [internationalOutboundsSummary, setInternationalOutboundsSummary] = useState<InternationalOutboundsSummaryModel | undefined>(undefined);
    const [dailyReports, setDailyReports] = useState<DailyBaseAggregationReportModel[]|undefined>([]);
    const [dailyReportSeries, setDailyReportSeries] = useState<SeriesType[]>([
        {label: 'SDR Amount', data: []},
        {label: 'File Count', data: []}
    ])
    const [pendingData, setPendingData] = useState<Page<ProfileViewModel> | undefined>(undefined);
    const [closedData, setClosedData] = useState<Page<ProfileViewModel> | undefined>(undefined);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [IO_date, setIO_date] = React.useState<Dayjs>(lastMonths[0]);
    const [itemNb, setItemNb] = React.useState<number[]>([0, 20]);
    const [skipAnimation, setSkipAnimation] = React.useState(false);
    const datasetType = {
        months: Array.from({length: 12}, (_, i) => new Date(0, i).toLocaleString('en', {month: 'long'})),
        days: Array.from({length: 31}, (_, i) => (i + 1).toString().padStart(2, '0')),
    };
    const defaultProps = {
        options: lastMonths,
        getOptionLabel: (option: Dayjs) => option.year() + '-' + (option.month()< 9 && option.month().toString().length < 2?
            '0':'') + (option.month() + 1).toString(),
    };
    useEffect(() => {
        handleSearch()
    },  [IO_date]);
    useEffect(() => {
    },  [internationalOutboundsSummary, isLoading]);
    const handleLastDatesChange = (event: any, newValue: Dayjs | null) => {
        setIO_date(newValue ?? defaultProps.options[0]);
    };
    const handleSearch = () => {
        setIsLoading(true);
        setIsError(false);
        try {
            api.get<SettlementApiResponse<InternationalOutboundsSummaryModel>>(`api/summary/` + (
                IO_date.year() + '-' + (IO_date.month().toString().length ===1? '0': '')+ (IO_date.month()+1).toString()
            ), {})
                .then(internationalSummaryResponse => {
                    if (internationalSummaryResponse.data.exception) {
                        alert(internationalSummaryResponse.data.exception.message);
                        setIsError(true);
                    } else {
                        setInternationalOutboundsSummary(
                            new InternationalOutboundsSummaryModel({...internationalSummaryResponse.data.responseBody})
                        );
                    }
                    setIsLoading(false);
                });
            api.get<SettlementApiResponse<DailyBaseAggregationReportModel[]>>(`api/base-aggregation/daily-report`, {
                params: {
                    year: IO_date.year(),
                    month: (IO_date.month().toString().length ===1? '0': '')+ (IO_date.month()+1).toString() ,
                }
            }).then(dailyReportResponse => {
                if (dailyReportResponse.data) {
                    if (dailyReportResponse.data.exception) {
                        alert(dailyReportResponse.data.exception?.message)
                        setIsError(true);
                    } else {
                        const dailyReportsData: DailyBaseAggregationReportModel[] | undefined =
                            dailyReportResponse.data.responseBody?.map(report => new DailyBaseAggregationReportModel(report));
                        const sdrAmountData: number[] = dailyReportsData? dailyReportsData
                            .map(value => (value.totalAmount?
                                value.totalAmount / 100: undefined)) : new Array(0);
                        const fileCountData: number[] = dailyReportsData ? dailyReportsData
                            .map(value => value.fileCount) : new Array(0);
                        setDailyReportSeries([
                            {label: 'SDR Amount', data: sdrAmountData,
                                valueFormatter: (value:number | null) => value? `${value}%`:''},
                            {label: 'File Count', data: fileCountData}
                        ])
                        setDailyReports(dailyReportResponse.data.responseBody);
                    }
                }
                // setIsLoading(false);
            });
            api.get<SettlementApiResponse<Page<ProfileViewModel>>>(`profile-view`, {
                headers: {'Content-Type': 'application/json'},
                params: {
                    page: paginationModel.page,
                    size: paginationModel.pageSize,
                    sort: 'tap3Amount,desc',
                    status: false,
                }
            }).then(pendingInvoicesResponse => {
                if (pendingInvoicesResponse.data.exception) {
                    alert(pendingInvoicesResponse.data.exception.message);
                    setIsError(true);
                } else {
                    setPendingData(pendingInvoicesResponse.data.responseBody);
                }
                // setIsLoading(false);
            });
            api.get<SettlementApiResponse<Page<ProfileViewModel>>>(`profile-view`, {
                headers: {'Content-Type': 'application/json'},
                params: {
                    page: paginationModel.page,
                    size: paginationModel.pageSize,
                    sort: 'tap3Amount,desc',
                    status: true,
                }
            }).then(closedInvoicesResponse => {
                if (closedInvoicesResponse.data.exception) {
                    alert(closedInvoicesResponse.data.exception?.message)
                    setIsError(true);
                } else {
                    setClosedData(closedInvoicesResponse.data.responseBody);
                }
                // setIsLoading(false);
            });
        } catch (error) {
            setIsError(true);
            setIsLoading(false);
        }
    };
    const handleItemNbChange = (event: Event, newValue:number | number[]) => {
        setItemNb(newValue as number[]);
    };

    return (
        <Grid2 sx={{width: '100%'}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'center'}}>
                <Typography variant="h4" justifyContent={'center'} component="div">
                    International Outbound
                </Typography>
            </Toolbar>
            <Grid2 rowSpacing={1} width={'100%'} mt={'1%'} mb={'1%'}>

                <Grid2 container={true} sx={{
                    width: '96%',
                    margin: '0 2%',
                    padding: '2%',
                    boxShadow: 3,
                    border: 1,
                    borderRadius: '0.5px',
                    borderColor: 'primary.light',
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                    }
                }}>
                    <Grid2 sx={{width: '15%', display: 'flex', alignContent: 'center'}}>
                        <Autocomplete {...defaultProps}
                                      id="A-lastDates"
                                      fullWidth
                                      size={"small"}
                                      defaultValue={IO_date}
                                      disableClearable
                                      onChange={handleLastDatesChange}
                                      options={defaultProps.options}
                                      getOptionLabel={defaultProps.getOptionLabel}
                                      renderInput={(params: AutocompleteRenderInputParams) => (
                                          <TextField
                                              {...params}
                                              label="last dates"
                                              size={"small"}
                                              slotProps={{
                                                  htmlInput: {
                                                      ...params.inputProps,
                                                      autoComplete: 'new-password', // disable autocomplete and autofill
                                                  },
                                              }}
                                              id={'TF' + params.id}
                                          />
                                      )}>


                        </Autocomplete>
                    </Grid2>
                    <LastMonthHistoryOverview ioSummary={internationalOutboundsSummary} isLoading={isLoading}/>

                </Grid2>
                <Grid2
                    display='flex'
                    justifyContent='center'
                >
                    <Box sx={{width: '80%'}}>
                        <BarChart
                            height={300}
                            xAxis={[{
                                scaleType: 'band',
                                data: datasetType.days.slice(itemNb[0], itemNb[1]),
                                dataKey: 'day'
                            }]}
                            yAxis={[{
                                scaleType: 'linear',
                                data: datasetType.months,
                                dataKey: 'day'
                            }]}
                            series={dailyReportSeries ? dailyReportSeries
                                .slice(0, 2)
                                .map((s) => ({...s, data: s.data.slice(itemNb[0], itemNb[1])})) : [
                                {label: 'SDR Amount', data: []},
                                {label: 'File Count', data: []}
                            ].map((s) => ({...s, data: s.data.slice(itemNb[0], itemNb[1])}))
                            }
                            skipAnimation={skipAnimation}
                        />
                        <Typography id="input-item-number" gutterBottom>
                            Number of items
                        </Typography>
                        <Slider

                            value={itemNb}
                            onChange={handleItemNbChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={31}
                            aria-labelledby="input-item-number"
                        />
                    </Box>
                </Grid2>
                <Grid2 container={true} size={12}>
                    {pendingData ?
                        <Box mt={'0.5%'} sx={{
                            width: '48%',
                            height: '100%',
                            justifyContent: 'center',
                            padding: '1%',
                            boxSizing: 'border-box',
                        }}>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Typography variant="subtitle1" sx={{marginBottom: 2}}>
                                    Top 5 Operators <label style={{fontSize: 'medium'}}>(SDR)</label> - Invoice Pending
                                </Typography>
                            </div>
                            <OverviewDataTable navigate={props?.navigate} data={pendingData} isError={isError}
                                               isLoading={isLoading}
                                               paginationModel={paginationModel}
                                               setPaginationModel={setPaginationModel}
                            />
                        </Box> : null
                    }
                    {closedData ?
                        <Box mt={'0.5%'} sx={{
                            width: '48%',
                            height: '100%',
                            // display: 'flex',
                            justifyContent: 'center',
                            padding: '1%',
                            boxSizing: 'border-box',
                        }}>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Typography variant="subtitle1" sx={{marginBottom: 2}}>
                                    Top 5 Operators <label style={{fontSize: 'medium'}}>(SDR)</label> - Invoice Closed
                                </Typography>
                            </div>
                            <OverviewDataTable navigate={props?.navigate} data={closedData} isError={isError}
                                               isLoading={isLoading}
                                               paginationModel={paginationModel}
                                               setPaginationModel={setPaginationModel}
                            />
                        </Box> : null
                    }
                </Grid2>

            </Grid2>
            {/*</PageContainer>*/}
        </Grid2>
    );
}
export default InternationalOutboundOverview;