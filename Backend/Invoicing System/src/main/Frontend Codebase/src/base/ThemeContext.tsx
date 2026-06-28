import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ColorTheme, ThemeMode } from "./ThemeColorEnum";
import ThemeMap from "./ThemeMap";
import { createTheme } from "@mui/material/styles";

const ThemeContext = createContext<any>(undefined);

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

const TOOLPAD_MODE_KEY = "toolpad-mode";
const APP_MODE_KEY = "themeMode";

const applyMode = (mode: ThemeMode) => {
  localStorage.setItem(TOOLPAD_MODE_KEY, mode);
  localStorage.setItem(APP_MODE_KEY, mode);
  document.documentElement.setAttribute("data-toolpad-color-scheme", mode);
};

export const ThemeProvider = (props: { children: any }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // اگه toolpad-mode روی 'system' مونده بود، از themeMode بخون
    const toolpadMode = localStorage.getItem(TOOLPAD_MODE_KEY);
    const saved = localStorage.getItem(APP_MODE_KEY) as ThemeMode;
    const initial =
      toolpadMode === "system" || !toolpadMode
        ? saved || ThemeMode.LIGHT
        : (toolpadMode as ThemeMode);
    applyMode(initial);
    return initial;
  });

  const [color, setColor] = useState<ColorTheme>(ColorTheme.INDIGO);

  const theme = useMemo(() => {
    return ThemeMap.getTheme(color, mode);
  }, [mode, color]);

  React.useEffect(() => {
    applyMode(mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      color,
      setColor,
      theme,
      demoTheme,
    }),
    [mode, color],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
