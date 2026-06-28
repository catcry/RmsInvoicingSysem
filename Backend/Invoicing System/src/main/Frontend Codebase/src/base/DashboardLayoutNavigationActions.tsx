import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { AppProvider, Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import {
  Dashboard,
  DarkMode,
  Info,
  LightMode,
  Logout,
  Reviews,
} from "@mui/icons-material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SettlementManagement from "../settlement/SettlementManagement";
import Overview from "../Overview/Overview";
import { useThemeContext } from "./ThemeContext";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { Grid2 } from "@mui/material";
import StatementDetails from "../settlement/StatementDetails";
import { isTokenExpired } from "./AuthService";
import { ThemeMode } from "./ThemeColorEnum";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <Dashboard />,
  },
  {
    segment: "settlement-management",
    title: "Settlement Management",
    icon: <Reviews />,
  },
  {
    segment: "statement-details",
    title: "Statement Details",
    icon: <Info />,
  },
];

const queryClient = new QueryClient();

function useCustomRouter(initialPath?: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = useState(
    initialPath || location.pathname || "/dashboard",
  );

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  const router = {
    pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path: string | URL, options?: any) => {
      if (typeof path === "string") {
        navigate(path, options);
      } else {
        navigate(path.toString(), options);
      }
    },
  };
  return router;
}

function DemoPageContent(
  props: Readonly<{
    pathname: string;
    navigate: (path: string | URL, options?: any) => void;
  }>,
) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  if (props.pathname.startsWith("/settlement-management")) {
    const { year, month, operator } = location.state || {};
    if (year && month && operator) {
      return (
        <QueryClientProvider client={queryClient}>
          <SettlementManagement
            month={Number(month)}
            year={Number(year)}
            operator={operator}
            navigate={props.navigate}
          />
        </QueryClientProvider>
      );
    }
    return (
      <QueryClientProvider client={queryClient}>
        <SettlementManagement navigate={props.navigate} />
      </QueryClientProvider>
    );
  } else if (props.pathname.startsWith("/statement-details")) {
    const { outboundId, year, month, operator } = location.state || {};
    if (outboundId) {
      return (
        <StatementDetails
          outboundId={outboundId}
          year={year}
          operator={operator}
          month={month}
          navigate={props.navigate}
        />
      );
    }
    return <StatementDetails navigate={props.navigate} />;
  } else if (
    props.pathname === "/dashboard" ||
    props.pathname === "/settlement"
  ) {
    return <Overview navigate={props.navigate} />;
  } else {
    return (
      <Box
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography>Dashboard content for {props.pathname}</Typography>
      </Box>
    );
  }
}

function ToolbarActionsLogout() {
  const navigate = useNavigate();
  const { mode, setMode } = useThemeContext();

  const handleLogout = () => {
    sessionStorage.setItem("jwt", "");
    navigate("/login");
  };

  const handleToggleMode = () => {
    setMode((prev: ThemeMode) =>
      prev === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT,
    );
  };

  return (
    <Grid2 sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip
        title={
          mode === ThemeMode.LIGHT
            ? "Switch to Dark Mode"
            : "Switch to Light Mode"
        }
      >
        <Button
          onClick={handleToggleMode}
          sx={{ minWidth: "auto", px: 1 }}
          variant="text"
          style={{ color: mode === ThemeMode.DARK ? "#ffd54f" : "#5c6bc0" }}
        >
          {mode === ThemeMode.LIGHT ? (
            <DarkMode sx={{ fontSize: 26 }} />
          ) : (
            <LightMode sx={{ fontSize: 26 }} />
          )}
        </Button>
      </Tooltip>
      <Tooltip title="Logout">
        <Button
          sx={{ mr: 3 }}
          variant="outlined"
          style={{
            color: mode === ThemeMode.DARK ? "#ffffff" : "#0f4ca8",
            borderColor: mode === ThemeMode.DARK ? "#ffffff" : "#0f4ca8",
          }}
          onClick={handleLogout}
        >
          Logout
          <Logout aria-label={"Log out"} sx={{ ml: 0.5 }} />
        </Button>
      </Tooltip>
    </Grid2>
  );
}

export default function DashboardLayoutNavigationActions(
  props: Readonly<{ initialUri?: string }>,
) {
  const router = useCustomRouter(props.initialUri);
  const { demoTheme } = useThemeContext();
  const { mode } = useThemeContext();
  const logoSrc =
    mode === ThemeMode.LIGHT
      ? "/images/BonLogo_blue-dark.png"
      : "/images/BonLogo_blue-light.png";
  const navigate = useNavigate();

  if (isTokenExpired()) {
    sessionStorage.removeItem("jwtToken");
    navigate("/login");
    return null;
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        logo: <img src={logoSrc} alt="MUI logo" />,
        title: "",
        homeUrl: props.initialUri,
      }}
    >
      <DashboardLayout
        sidebarExpandedWidth={"14%"}
        slots={{
          toolbarActions: ToolbarActionsLogout,
        }}
      >
        <DemoPageContent
          navigate={router.navigate}
          pathname={router.pathname}
        />
      </DashboardLayout>
    </AppProvider>
  );
}
