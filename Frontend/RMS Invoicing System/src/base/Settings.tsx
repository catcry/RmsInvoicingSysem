import React from 'react';
import {Dialog, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup} from '@mui/material';
import {useThemeContext} from './ThemeContext';
import Typography from "@mui/material/Typography";
import {ColorTheme} from "./ThemeColorEnum";

const SettingsDialog = (props: { open: boolean, onClose: () => void }) => {
    const {mode, setMode, color, setColor} = useThemeContext();

    const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setMode(value);
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setColor(value);
    };
    const getEnumValue = (key: string) => {
        return ColorTheme[key as keyof typeof ColorTheme];
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <Typography> Color:</Typography>
                <RadioGroup value={color} onChange={handleColorChange}>
                    <FormControlLabel key={ColorTheme.PURPLE} value={ColorTheme.PURPLE} control={<Radio />} label={ColorTheme.PURPLE} />
                </RadioGroup>
                <Typography> Mode:</Typography>
                <RadioGroup value={mode} onChange={handleModeChange}>
                    <FormControlLabel value="light" control={<Radio/>} label="Light Mode"/>
                    <FormControlLabel value="dark" control={<Radio/>} label="Dark Mode"/>
                </RadioGroup>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsDialog;