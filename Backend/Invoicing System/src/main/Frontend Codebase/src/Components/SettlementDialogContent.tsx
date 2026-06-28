import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InboundStatementModel from "../models/InboundStatementModel";
import dayjs from "dayjs";

type DialogFormProps = {
    settlement: InboundStatementModel;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function SettlementDialogContent(props: Readonly<DialogFormProps>) {
    const {settlement, handleChange} = props;
    return (
        <DialogContent>
            <Stack spacing={2} mt={1}>
                <TextField label="TADIG" name="tadig" value={settlement.tadig}
                           disabled={true}
                           slotProps={{
                               input: {
                                   readOnly: true,
                               },
                           }}/>
                <TextField label="RegisterDate" name="registerDate"
                           value={(dayjs(settlement.registerDate).year()) + '-' + (dayjs(settlement.registerDate).month() + 1)}
                           disabled={true}
                           slotProps={{
                               input: {
                                   readOnly: true,
                               },
                           }}/>
                <TextField label="From Serial" name="fromSerial"
                           value={settlement.fromSerial} onChange={handleChange}/>
                <TextField label="To Serial" name="toSerial"
                           value={settlement.toSerial} onChange={handleChange}/>
                <TextField label="Include Serials" name="includeSerials"
                           value={settlement.includeSerials} onChange={handleChange}/>
                <TextField label="Exclude Serials" name="excludeSerials"
                           value={settlement.excludeSerials} onChange={handleChange}/>
                <TextField label="Invoice Sdr" name="invoiceSdr"
                           value={settlement.invoiceSdr}
                           disabled={true}
                           slotProps={{
                               input: {
                                   readOnly: true,
                               },
                           }}/>
                <TextField label="Tap Amount" name="tapAmount"
                           value={settlement.tapAmount} onChange={handleChange}/>
                <TextField label="Diff Amount" name="diffAmount"
                           value={settlement.diffAmount}
                           disabled={true}
                           slotProps={{
                               input: {
                                   readOnly: true,
                               },
                           }}/>
                <TextField label="Status" name="status"
                           value={settlement.status ? 'Confirmed' : 'Not Confirmed'}
                           disabled={true}
                           slotProps={{
                               input: {
                                   readOnly: true,
                               },
                           }}/>
            </Stack>
        </DialogContent>
    );
}
export default SettlementDialogContent;