import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useThemeContext } from "./base/ThemeContext";
import DashboardLayoutNavigationActions from "./base/DashboardLayoutNavigationActions";
import { ThemeProvider } from "@mui/material/styles";
import LoginPage from "./login/LoginPage";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { CircularProgress, Box } from "@mui/material";
import { isAuthenticated } from "./base/KeycloakService";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const result = await isAuthenticated();
      setAuthed(result);
    };
    check();
  }, []);

  if (authed === null) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return authed ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { theme } = useThemeContext();
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
                <ProtectedRoute>
                  <DashboardLayoutNavigationActions initialUri={"dashboard"} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settlement-management"
              element={
                <ProtectedRoute>
                  <DashboardLayoutNavigationActions initialUri={"settlement-management"} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statement-details"
              element={
                <ProtectedRoute>
                  <DashboardLayoutNavigationActions initialUri={"statement-details"} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayoutNavigationActions initialUri={"dashboard"} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
