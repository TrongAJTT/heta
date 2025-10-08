import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const PatternImportDialog = ({
  open,
  onClose,
  onImport,
  generator,
  onGenerate,
  initialPattern = "",
  initialStartId = "",
  initialEndId = "",
}) => {
  const [pattern, setPattern] = useState("");
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState("");
  const [importEnabled, setImportEnabled] = useState(false);

  useEffect(() => {
    if (open) {
      setPattern(initialPattern || "");
      setStartId(initialStartId || "");
      setEndId(initialEndId || "");
      setPreview([]);
      setError("");
      setImportEnabled(false);
    }
  }, [open, initialPattern, initialStartId, initialEndId]);

  const handleGenerate = () => {
    setError("");
    try {
      const urls = generator.generate(pattern, startId, endId);
      if (urls.length === 0) {
        setError("No URLs generated.");
        setPreview([]);
        setImportEnabled(false);
        return;
      }
      if (onGenerate) onGenerate({ pattern, startId, endId });
      setPreview([
        ...urls.slice(0, 2),
        ...(urls.length > 4 ? ["..."] : []),
        ...urls.slice(-2),
      ]);
      setImportEnabled(true);
    } catch (e) {
      setError(e.message);
      setPreview([]);
      setImportEnabled(false);
    }
  };

  const handleImport = () => {
    if (!importEnabled) return;
    const urls = generator.generate(pattern, startId, endId);
    onImport(urls);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import From Pattern</DialogTitle>
      <DialogContent sx={{ pt: 1.5, pb: 0.5, overflow: "visible" }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              label="URL Pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="https://example.com/{id}"
              size="small"
              fullWidth
            />
            <Tooltip title="Insert {id}">
              <IconButton
                size="small"
                sx={{
                  height: 40,
                  width: 40,
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "primary.lighter",
                  },
                }}
                onClick={() => {
                  if (!pattern.includes("{id}")) {
                    setPattern(pattern + "{id}");
                  }
                }}
              >
                <Typography variant="body2" fontWeight="bold" color="primary">
                  ID
                </Typography>
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              label="Start ID"
              type="number"
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
              size="small"
              fullWidth
            />
            <Tooltip title="Shift IDs">
              <IconButton
                size="small"
                sx={{
                  height: 40,
                  width: 40,
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "primary.lighter",
                  },
                }}
                onClick={() => {
                  const s = parseInt(startId);
                  const e = parseInt(endId);
                  if (!isNaN(s) && !isNaN(e)) {
                    const delta = e - s;
                    setStartId((s + delta + 1).toString());
                    setEndId((e + delta + 1).toString());
                  }
                }}
              >
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <TextField
              label="End ID"
              type="number"
              value={endId}
              onChange={(e) => setEndId(e.target.value)}
              size="small"
              fullWidth
            />
            <Tooltip title="Generate & Preview">
              <IconButton
                size="small"
                sx={{
                  height: 40,
                  width: 40,
                  borderRadius: 1,
                  bgcolor: "primary.main",
                  color: "#fff",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                onClick={handleGenerate}
              >
                <AutoFixHighIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          {preview.length > 0 && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Preview</Typography>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 1,
                  bgcolor: "grey.50",
                  maxHeight: 160,
                  overflowY: "auto",
                  fontFamily: "monospace",
                }}
              >
                {preview.map((url, idx) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{ fontFamily: "inherit" }}
                  >
                    {url}
                  </Typography>
                ))}
              </Box>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={!importEnabled}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatternImportDialog;
