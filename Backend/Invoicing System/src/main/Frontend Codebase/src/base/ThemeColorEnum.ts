// themeEnums.ts
import { createTheme, Theme } from '@mui/material/styles';
import {useMemo} from "react";
import {
    amber,
    blue,
    cyan, deepOrange,
    deepPurple,
    green,
    indigo,
    lightBlue,
    lightGreen, lime, orange,
    pink,
    purple,
    red,
    teal, yellow
} from "@mui/material/colors";

export type CustomTheme = {
    color: ColorTheme,
    mode: ThemeMode
}

export enum ThemeMode {
    LIGHT = 'light',
    DARK = 'dark',
}

export enum ColorTheme {
    RED = 'red',
    PINK = 'pink',
    PURPLE = 'purple',
    DEEP_PURPLE = 'deepPurple',
    INDIGO = 'indigo',
    BLUE = 'blue',
    LIGHT_BLUE = 'lightBlue',
    CYAN = 'cyan',
    TEAL = 'teal',
    GREEN = 'green',
    LIGHT_GREEN = 'lightGreen',
    LIME = 'lime',
    YELLOW = 'yellow',
    AMBER = 'amber',
    ORANGE = 'orange',
    DEEP_ORANGE = 'deepOrange',
}
