import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateCalendarProps} from "@mui/x-date-pickers/DateCalendar/DateCalendar.types";

interface CalendarDialogProps extends DateCalendarProps<any>{
    handleChange?:(date:Dayjs|null) => void;
}

const CalendarDialog: React.FC<CalendarDialogProps> = (props: CalendarDialogProps) => {
    const [open, setOpen] = useState(false);
    const [calendarProps] = useState(props);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    let oldDate: Dayjs = props.defaultValue;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        if (props.handleChange) {
            props.handleChange(selectedDate);
        }
        setOpen(false);
    };

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
    };

    return (
        <div>
            <TextField
                size="small"
                label="Selected Date"
                value={selectedDate ? selectedDate.format('YYYY-MM') : ''}
                onClick={handleClickOpen}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select a Date</DialogTitle>
                <DialogContent>
                    {/*<DateCalendar value={selectedDate} onChange={handleDateChange} />*/}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar {...{
                            value:selectedDate,
                            onChange: handleDateChange,
                            ...calendarProps}}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Confirm</Button>
                    <Button onClick={() => {
                        if(selectedDate) {
                            setSelectedDate(oldDate);
                        }
                        handleClose();
                    }}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CalendarDialog;
