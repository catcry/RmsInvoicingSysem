import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../base/ThemeContext";
import { handleKeycloakCallback} from "../base/AuthService";
import { isAuthenticated } from "../base/KeycloakService";
import { CircularProgress, Box } from "@mui/material";

function LoginPage() {
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const handleAuth = async () => {
      // Check if this is a callback from Keycloak
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (code && state) {
        // Handle Keycloak callback
        const user = await handleKeycloakCallback();
        if (user) {
          navigate("/settlement");
          return;
        }
      }

      // Check if already authenticated
      const authed = await isAuthenticated();
      if (authed) {
        navigate("/settlement");
        return;
      }

      setChecking(false);
    };

    handleAuth();
  }, [navigate]);

  const handleLogin = async () => {
    const { handleLoginRedirect } = await import("../base/KeycloakService");
    await handleLoginRedirect();
  };

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDark
            ? "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)"
            : "linear-gradient(135deg, #e8f0fe 0%, #f4f7fb 50%, #dce8ff 100%)",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark
          ? "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)"
          : "linear-gradient(135deg, #e8f0fe 0%, #f4f7fb 50%, #dce8ff 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "0 16px",
          background: isDark
            ? "rgba(30, 30, 50, 0.85)"
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          borderRadius: "20px",
          boxShadow: isDark
            ? "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 8px 40px rgba(69, 136, 214, 0.15), 0 0 0 1px rgba(69,136,214,0.1)",
          padding: "48px 40px 40px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: isDark ? "#ffffff" : "#1a1a2e",
            letterSpacing: "-0.3px",
            marginBottom: "8px",
          }}
        >
          Welcome back
        </div>
        <div
          style={{
            fontSize: "13px",
            color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
            marginBottom: "32px",
          }}
        >
          Sign in with your organization account
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            height: "44px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #4588d6 0%, #0f4ca8 100%)",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.3px",
            boxShadow: "0 4px 16px rgba(69, 136, 214, 0.4)",
            textTransform: "none",
            transition: "all 0.2s ease",
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign in with Keycloak
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
