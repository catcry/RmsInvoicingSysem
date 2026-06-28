import React from "react";
import { useThemeContext } from "../base/ThemeContext";
import { CssBaseline, Grid2, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SettlementSearchView, { Filters } from "./SettlementSearchView";
import { useBackButton } from "../assets/Utils";
import { useNavigate } from "react-router-dom";
// Update the Props interface to make navigate optional
interface SettlementManagementProps extends Filters {
  navigate?: (url: string | URL) => void | undefined;
}
export default function SettlementManagement(
  props: Readonly<SettlementManagementProps>,
) {
  const { theme } = useThemeContext();
  // Use the navigate from props if available, otherwise use useNavigate
  const navigateFromProps = props.navigate;
  const navigateFromHook = useNavigate();
  const navigate = navigateFromProps || navigateFromHook;

  const handleBackButton = () => {
    if (navigate) {
      navigate("/dashboard");
    }
  };
  const { beforeNavigate } = useBackButton(handleBackButton);

  return (
    <Grid2 justifyContent={"center"} pb={"1%"} sx={{ width: "100%" }}>
      <CssBaseline />
      <Grid2
        style={{ width: "100%" }}
        sx={{
          boxShadow: 3,
          width: "100%",
          height: "100%",
          backgroundColor: `${theme.palette.mode === "light" ? theme.palette.primary.light : "#121212"} !important`,
        }}
      >
        <AppBar
          style={{
            margin: "0.2% 0",
            position: "static",
            color:
              theme.palette.mode === "dark"
                ? "#ffffff"
                : theme.palette.primary.dark,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "#1e1e2e"
                : theme.palette.primary.light,
          }}
        >
          <Toolbar>
            <Typography variant="h6">Settlement Management</Typography>
          </Toolbar>
        </AppBar>
        <SettlementSearchView
          {...props}
          beforeNavigate={beforeNavigate}
          navigate={props.navigate}
        />
      </Grid2>
    </Grid2>
  );
}
