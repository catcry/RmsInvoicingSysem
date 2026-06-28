import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useThemeContext } from "./base/ThemeContext";
import DashboardLayoutNavigationActions from "./base/DashboardLayoutNavigationActions";
import { ThemeProvider } from "@mui/material/styles";
import LoginPage from "./login/LoginPage";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { isTokenExpired } from "./base/AuthService";

const App: React.FC = () => {
  const { theme } = useThemeContext();

  if (isTokenExpired()) {
    sessionStorage.removeItem("jwtToken");
  }

  const isDark = theme.palette.mode === "dark";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            backgroundColor: isDark ? "#121212" : theme.palette.primary.light,
            color: isDark ? "#ffffff" : theme.palette.text.primary,
            margin: 0,
            padding: 0,
            height: "100%",
          },
          html: {
            backgroundColor: isDark ? "#121212" : theme.palette.primary.light,
            margin: 0,
            padding: 0,
            height: "100%",
          },
        }}
      />
      <div
        id={"root"}
        className={"container"}
        style={{
          height: "100%",
          alignContent: "flex-start",
          backgroundColor: isDark ? "#121212" : theme.palette.primary.light,
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/settlement"
              element={
                <DashboardLayoutNavigationActions initialUri={"dashboard"} />
              }
            />
            <Route
              path="/settlement-management"
              element={
                <DashboardLayoutNavigationActions
                  initialUri={"settlement-management"}
                />
              }
            />
            <Route
              path="/statement-details"
              element={
                <DashboardLayoutNavigationActions
                  initialUri={"statement-details"}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardLayoutNavigationActions initialUri={"dashboard"} />
              }
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
