import {Grid2} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import OutboundStatementModel from "../models/OutboundStatementModel";


export interface OutboundDetailProps {
    outbound: OutboundStatementModel | undefined,
}
export default function OutboundDetail(props: OutboundDetailProps) {
    return (
        <Box
            px={'4%'}
            mt={'0.5%'} sx={{
            width: '80%',
            overflow: 'auto',
            // padding: '0.5%',
            boxSizing: 'border-box'
        }}>
            <Grid2 container={true} size={12} spacing={1}>
                <Grid2 size={3}>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"medium"}
                        >Operator:</Typography>
                        <Typography
                            fontSize={"small"}
                            alignContent='center'
                        >{props.outbound?.operator}</Typography>
                    </Grid2>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"medium"}
                        >Year: </Typography>
                        <Typography
                            fontSize={"small"}
                            alignContent='center'
                        >{props.outbound?.year}</Typography>
                    </Grid2>
                </Grid2>
                <Grid2 size={3}>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"medium"}
                        >Sequence From: </Typography>
                        <Typography
                            fontSize={"small"}
                            alignContent='center'
                        >{props.outbound?.sequenceFrom}</Typography>
                    </Grid2>

                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"medium"}
                        >Month: </Typography>
                        <Typography
                            fontSize={"small"}
                            alignContent='center'
                        >{props.outbound?.month}</Typography>
                    </Grid2>
                </Grid2>
                <Grid2 size={3}>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"medium"}
                        >Sequence To: </Typography>
                        <Typography
                            fontSize={"small"}
                            alignContent='center'
                        >{props.outbound?.sequenceTo}</Typography>
                    </Grid2>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"medium"}
                        >TAP3 amount: </Typography>
                        <Typography
                            fontSize={"small"}
                            alignContent='center'
                        >{props.outbound?.tap3Amount}</Typography>
                    </Grid2>
                </Grid2>
                <Grid2 size={3}>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"medium"}
                        >Stream Type: </Typography>
                        <Typography
                            fontSize={"small"}
                            alignContent='center'
                        >{props.outbound?.streamType==='IO'? 'International Outbound':''}</Typography>
                    </Grid2>
                    <Grid2 spacing={1} container={true}>
                        <Typography
                            fontSize={"medium"}
                        >File Count: </Typography>
                        <Typography
                            fontSize={"small"}
                            alignContent='center'
                        >{props.outbound?.fileCount}</Typography>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box>
    );
}