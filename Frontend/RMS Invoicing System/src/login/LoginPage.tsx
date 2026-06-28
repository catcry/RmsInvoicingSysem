import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { useThemeContext } from "../base/ThemeContext";
import { loginApi } from "../base/AuthService";
import { LockOutlined, PersonOutline } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";

type User = {
  username: string;
  password: string;
};

function LoginPage() {
  const { theme } = useThemeContext();
  const [user, setUser] = useState<User>({ username: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isDark = theme.palette.mode === "dark";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const token = await loginApi(user.username, user.password)
      .then()
      .catch((error) => {
        console.error("Login failed: ", error);
        setOpen(true);
      });
    setIsLoading(false);
    if (token) setIsAuthenticated(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") handleLogin();
  };

  if (isAuthenticated) {
    navigate("/settlement");
    return null;
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
      {/* کارت لاگین */}
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
        }}
      >
        {/* آیکون بالا */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: isDark ? "#ffffff" : "#1a1a2e",
              letterSpacing: "-0.3px",
            }}
          >
            Welcome back
          </div>
          <div
            style={{
              fontSize: "13px",
              color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
              marginTop: "4px",
            }}
          >
            Sign in to your account
          </div>
        </div>

        {/* فیلدها */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            name="username"
            label="Username"
            size="small"
            variant="outlined"
            fullWidth
            autoFocus
            autoComplete="username"
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline
                    style={{
                      fontSize: "18px",
                      color: isDark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(0,0,0,0.35)",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(69,136,214,0.04)",
                "& fieldset": {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(69,136,214,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: isDark ? "rgba(255,255,255,0.25)" : "#4588d6",
                },
              },
              "& .MuiInputLabel-root": {
                color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
              },
              "& .MuiOutlinedInput-input": {
                color: isDark ? "#ffffff" : "#1a1a2e",
                "&:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 100px ${isDark ? "#2a2a3e" : "#eef4ff"} inset`,
                  WebkitTextFillColor: isDark ? "#ffffff" : "#1a1a2e",
                  caretColor: isDark ? "#ffffff" : "#1a1a2e",
                },
              },
            }}
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            size="small"
            variant="outlined"
            fullWidth
            autoComplete="current-password"
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined
                    style={{
                      fontSize: "18px",
                      color: isDark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(0,0,0,0.35)",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(69,136,214,0.04)",
                "& fieldset": {
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(69,136,214,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: isDark ? "rgba(255,255,255,0.25)" : "#4588d6",
                },
              },
              "& .MuiInputLabel-root": {
                color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
              },
              "& .MuiOutlinedInput-input": {
                color: isDark ? "#ffffff" : "#1a1a2e",
                "&:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 100px ${isDark ? "#2a2a3e" : "#eef4ff"} inset`,
                  WebkitTextFillColor: isDark ? "#ffffff" : "#1a1a2e",
                  caretColor: isDark ? "#ffffff" : "#1a1a2e",
                },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              marginTop: "8px",
              height: "44px",
              borderRadius: "10px",
              background: isLoading
                ? isDark
                  ? "rgba(69,136,214,0.4)"
                  : "rgba(69,136,214,0.5)"
                : "linear-gradient(135deg, #4588d6 0%, #0f4ca8 100%)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.3px",
              boxShadow: isLoading
                ? "none"
                : "0 4px 16px rgba(69, 136, 214, 0.4)",
              textTransform: "none",
              transition: "all 0.2s ease",
            }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </div>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Login failed: Check your username and password"
      />
    </div>
  );
}

export default LoginPage;
