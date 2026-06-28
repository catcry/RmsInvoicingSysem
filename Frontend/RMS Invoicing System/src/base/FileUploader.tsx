import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useThemeContext } from "./ThemeContext";
import api from "./Api";

const UploadCsv = () => {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useThemeContext();

  const handleClickOpen = () => {
    setFile(null);
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setFile(null);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      await api.post("/api/upload-csv", formData);
      setLoading(false);
      handleClose();
      alert("Successfully imported.");
    } catch (err) {
      setLoading(false);
      setError(
        "Error uploading file. Please check the file format and try again.",
      );
    }
  };

  return (
    <>
      <Button
        variant="contained"
        style={{
          margin: "0.5%",
          color:
            theme.palette.mode === "dark"
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
        }}
        onClick={handleClickOpen}
      >
        Import CSV
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Import CSV File</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-csv"
          />
          <label htmlFor="upload-csv">
            <Button variant="outlined" component="span" disabled={loading}>
              Choose CSV
            </Button>
          </label>
          {file && (
            <Typography variant="body2" style={{ marginTop: "8px" }}>
              {file.name}
            </Typography>
          )}
          {error && (
            <Typography
              variant="body2"
              color="error"
              style={{ marginTop: "8px" }}
            >
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleUpload}
            disabled={!file || loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadCsv;
