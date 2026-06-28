import React from 'react';
import '../App.css'
import {FormikValues} from "formik/dist/types";
import Box from "@mui/material/Box";
import {MakeOptional} from "@mui/x-charts/internals";
import {BarSeriesType} from "@mui/x-charts";
import dayjs, {Dayjs} from "dayjs";
import InternationalOutboundOverview from "../settlement/InternationalOutboundOverview";
import {Paper} from "@mui/material";

interface SeriesType extends MakeOptional<BarSeriesType, "type"> {
    label: string;
    data: (number)[];
}

export interface OverviewProps extends FormikValues {
    navigate: (path: string | URL, options?: any) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const now: Dayjs = dayjs(new Date());
const lastMonths: Dayjs[] = [
    now.subtract(1, "month"),
    now.subtract(2, "month"),
    now.subtract(3, "month"),
];

function CustomTabPanel(props: Readonly<TabPanelProps>) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{p: 3}}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Overview: React.FC<OverviewProps> = (props: OverviewProps) => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // return (
    //     <Box sx={{width: '100%'}}>
    //         <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
    //             <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
    //                 <Tab label="International Outbound" {...a11yProps(0)} />
    //                 <Tab label="International Inbound" {...a11yProps(1)} />
    //                 <Tab label="National Outbound" {...a11yProps(2)} />
    //                 <Tab label="National Inbound" {...a11yProps(3)} />
    //             </Tabs>
    //         </Box>
    //         <CustomTabPanel value={value} index={0}>
    //             <InternationalOutboundOverview {...props}/>
    //         </CustomTabPanel>
    //         <CustomTabPanel value={value} index={1}>
    //             <InternationalInboundOverview {...props}/>
    //         </CustomTabPanel>
    //         <CustomTabPanel value={value} index={2}>
    //             National Outbound (coming soon)
    //         </CustomTabPanel>
    //         <CustomTabPanel value={value} index={3}>
    //             National Inbound (coming soon)
    //         </CustomTabPanel>
    //     </Box>
    // );

    return (
        <Paper sx={{width: '100%'}}>
            <InternationalOutboundOverview {...props}/>
        </Paper>
    );
}
export default Overview;