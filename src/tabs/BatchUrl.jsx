import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  generateUrls,
  openUrlsInBatches,
  openAllUrls,
  openSingleBatch,
  calculateBatchInfo,
} from "../utils/urlUtils";

const BatchUrl = ({ currentState, onStateChange }) => {
  const [urlPattern, setUrlPattern] = useState("");
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [generatedUrls, setGeneratedUrls] = useState([]);
  const [batchSize, setBatchSize] = useState(8);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [currentOpenIndex, setCurrentOpenIndex] = useState(0); // Track progress for "Open Each"

  // Load state from props
  useEffect(() => {
    if (currentState) {
      setUrlPattern(currentState.urlPattern || "");
      setStartId(currentState.startId || "");
      setEndId(currentState.endId || "");
      setGeneratedUrls(currentState.generatedUrls || []);
      setBatchSize(currentState.batchSize || 8);
      setCurrentOpenIndex(currentState.currentOpenIndex || 0);
    }
  }, [currentState]);

  // Save state whenever it changes
  // Chỉ lưu state khi tạo link (handleGenerateUrls)

  const handleGenerateUrls = () => {
    setError("");
    try {
      const urls = generateUrls(urlPattern, startId, endId);

      // Warning for large batches
      if (urls.length > 500) {
        if (
          !confirm(
            `You are about to generate ${urls.length} URLs. Large numbers may slow down your browser. Continue?`
          )
        ) {
          return;
        }
      }

      setGeneratedUrls(urls);
      setProgress(null);
      setCurrentOpenIndex(0); // Reset progress when generating new URLs

      // Lưu state khi tạo link
      onStateChange({
        urlPattern,
        startId,
        endId,
        generatedUrls: urls,
        batchSize,
        currentOpenIndex: 0,
      });
    } catch (err) {
      setError(err.message);
      setGeneratedUrls([]);
    }
  };

  const handleOpenAll = async () => {
    if (generatedUrls.length === 0) return;

    // Warning for opening many tabs at once
    if (generatedUrls.length > 50) {
      if (
        !confirm(
          `You are about to open ${generatedUrls.length} tabs at once. This may slow down your browser. Continue?`
        )
      ) {
        return;
      }
    }

    setProgress({ message: "Opening all links..." });
    await openAllUrls(generatedUrls);
    setProgress({ message: `Opened ${generatedUrls.length} links` });
  };

  const handleOpenEach = async () => {
    if (generatedUrls.length === 0) return;

    // Calculate batch info using utility
    const batchInfo = calculateBatchInfo(
      generatedUrls.length,
      currentOpenIndex,
      batchSize
    );

    // If all URLs have been opened, reset
    if (batchInfo.isComplete) {
      setCurrentOpenIndex(0);
      setProgress({
        message: "All URLs have been opened. Resetting to start.",
      });
      // Save reset state
      onStateChange({
        urlPattern,
        startId,
        endId,
        generatedUrls,
        batchSize,
        currentOpenIndex: 0,
      });
      return;
    }

    setProgress({
      message: `Opening batch ${batchInfo.currentBatch}/${batchInfo.totalBatches} (${batchInfo.urlsInNextBatch} URLs)...`,
    });

    try {
      // Use utility function to open single batch
      const result = await openSingleBatch(
        generatedUrls,
        currentOpenIndex,
        batchSize
      );

      // Update progress
      setCurrentOpenIndex(result.newIndex);

      // Calculate new batch info for display
      const newBatchInfo = calculateBatchInfo(
        generatedUrls.length,
        result.newIndex,
        batchSize
      );

      // Compute last opened range for concise display
      const lastRangeStart = currentOpenIndex + 1;
      const lastRangeEnd = Math.min(result.newIndex, generatedUrls.length);

      // Update progress display (simple and direct)
      setProgress({
        currentBatch: batchInfo.currentBatch,
        totalBatches: batchInfo.totalBatches,
        urlsOpened: result.newIndex,
        totalUrls: generatedUrls.length,
        rangeStart: lastRangeStart,
        rangeEnd: lastRangeEnd,
      });

      // Save state with progress
      onStateChange({
        urlPattern,
        startId,
        endId,
        generatedUrls,
        batchSize,
        currentOpenIndex: result.newIndex,
      });
    } catch (error) {
      console.error("Error in batch opening:", error);
      setProgress({
        message:
          "Error occurred while opening URLs. Check console for details.",
      });
    }
  };

  const handleGeneratedUrlsChange = (text) => {
    const urls = text
      .split(/\r?\n/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    setGeneratedUrls(urls);
    setCurrentOpenIndex(0); // Reset progress when manually editing URLs
  };

  const handleClearUrls = () => {
    setGeneratedUrls([]);
    setProgress(null);
    setError("");
    setCurrentOpenIndex(0);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle1">
            URL Pattern (use {"{id}"} as placeholder):
          </Typography>
          <TextField
            label="URL Pattern"
            variant="outlined"
            value={urlPattern}
            onChange={(e) => setUrlPattern(e.target.value)}
            placeholder="https://example.com/page/{id}"
            fullWidth
            size="small"
          />

          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              label="Start ID"
              type="number"
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
              placeholder="1"
              size="small"
              sx={{ flex: 1 }}
            />
            <IconButton
              color="primary"
              size="large"
              sx={{ mb: 0.2 }}
              title="Shift both IDs to the right"
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
              <ArrowForwardIcon fontSize="inherit" />
            </IconButton>
            <TextField
              label="End ID"
              type="number"
              value={endId}
              onChange={(e) => setEndId(e.target.value)}
              placeholder="10"
              size="small"
              sx={{ flex: 1 }}
            />
          </Stack>

          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateUrls}
          >
            Generate Links
          </Button>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {generatedUrls.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography variant="subtitle1">
                  Batch Links ({generatedUrls.length} links)
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleClearUrls}
                >
                  Clear
                </Button>
              </Stack>
              <TextField
                multiline
                minRows={3}
                value={generatedUrls.join("\n")}
                onChange={(e) => handleGeneratedUrlsChange(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  "& .MuiInputBase-inputMultiline": {
                    maxHeight: 100,
                    overflow: "auto",
                  },
                }}
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Batch Size"
                  type="number"
                  value={batchSize}
                  onChange={(e) =>
                    setBatchSize(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  size="small"
                  sx={{ width: 120 }}
                  inputProps={{ min: 1 }}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleOpenAll}
                >
                  Open All
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenEach}
                >
                  Open Each
                </Button>
              </Stack>

              {progress && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Opened batch {progress.currentBatch} of{" "}
                    {progress.totalBatches} (
                    {progress.rangeStart ||
                      Math.max(1, progress.urlsOpened - batchSize + 1)}
                    -{progress.rangeEnd || progress.urlsOpened} of{" "}
                    {progress.totalUrls})
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: 6,
                      bgcolor: "#eee",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${
                          (progress.urlsOpened / progress.totalUrls) * 100
                        }%`,
                        height: "100%",
                        bgcolor: "primary.main",
                      }}
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default BatchUrl;
