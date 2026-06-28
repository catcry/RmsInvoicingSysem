import DialogContent from '@mui/material/DialogContent';
import {DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import DialogActions from "@mui/material/DialogActions";

type DialogFormProps = {
    handleClose: () => void;
    handleConfirm: () => void;
    contentMessage: string;
}

function WarnConfirmationDialog(props: Readonly<DialogFormProps>) {
    return (
        <>
            <DialogTitle color='warning'>{"Warnings!"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="data-exist-alert">
                    {props.contentMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>No</Button>
                <Button onClick={props.handleConfirm}>Yes</Button>
            </DialogActions>
        </>
    );
}

export default WarnConfirmationDialog;