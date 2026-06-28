import {CircularProgress, Grid2} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InternationalOutboundsSummaryModel from "../models/InternationalOutboundsSummaryModel";
import * as React from "react";

export interface LastMonthHistoryOverviewProps {
    ioSummary: InternationalOutboundsSummaryModel | undefined;
    isLoading:boolean;
}
function LastMonthHistoryOverview(props: Readonly<LastMonthHistoryOverviewProps>) {
    if (props.isLoading) {
        return <CircularProgress color='info'/>;
    }
    return (

        <Box
            px={'4%'}
            mt={'0.5%'} sx={{
            width: '80%',
            overflow: 'auto',
            // padding: '0.5%',
            boxSizing: 'border-box'
        }}>
            <Grid2 container={true} size={12} spacing={3}>
                <Grid2 size={4}>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"small"}
                        >Closed Invoices:</Typography>
                        <Typography
                            alignContent={'center'}
                            fontSize={"small"}
                        >{props.ioSummary?.closedInvoices}</Typography>
                    </Grid2>
                    <Grid2 container={true} spacing={1}>
                        <Typography
                            fontSize={"small"}
                        >Pending Invoices: </Typography>
                        <Typography
                            alignContent={'center'}
                            fontSize={"small"}
                        >{props.ioSummary?.pendingInvoices}</Typography>
                    </Grid2>
                </Grid2>
                <Grid2 size={4}>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"small"}
                        >Closed TAP3 Amounts: </Typography>
                        <Typography
                            alignContent={'center'}
                            fontSize={"small"}
                        >{props.ioSummary?.closedTap3Amounts}</Typography>
                    </Grid2>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"small"}
                        >Pending TAP3 Amounts: </Typography>
                        <Typography
                            alignContent={'center'}
                            fontSize={"small"}
                        >{props.ioSummary?.pendingTap3Amounts}</Typography>
                    </Grid2>
                </Grid2>
                <Grid2 size={4}>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"small"}
                        >Closed Difference Amounts: </Typography>
                        <Typography
                            alignContent={'center'}
                            fontSize={"small"}
                        >{props.ioSummary?.closedDiffAmounts}</Typography>
                    </Grid2>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"small"}
                        >Pending Difference Amounts: </Typography>
                        <Typography
                            alignContent={'center'}
                            fontSize={"small"}
                        >{props.ioSummary?.pendingDiffAmounts}</Typography>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>
    );
}

export default LastMonthHistoryOverview;