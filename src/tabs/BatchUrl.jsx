import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Tooltip,
  Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  generateUrls,
  openAllUrls,
  openSingleBatch,
  calculateBatchInfo,
} from "../utils/urlUtils";
import {
  BatchUrlGenerator,
  UrlPatternManager,
  BatchUrlFactory,
  BATCH_URL_CONSTANTS,
} from "../utils/batchUrlGenerator";

const BatchUrl = ({ currentState, onStateChange }) => {
  const [urlPattern, setUrlPattern] = useState("");
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [generatedUrls, setGeneratedUrls] = useState([]);
  const [batchSize, setBatchSize] = useState(
    BATCH_URL_CONSTANTS.DEFAULT_BATCH_SIZE
  );
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [currentOpenIndex, setCurrentOpenIndex] = useState(0); // Track progress for "Open Each"
  const [expanded, setExpanded] = useState(true);

  // Load state from props
  useEffect(() => {
    if (currentState) {
      const urls = currentState.generatedUrls || [];
      const bs = currentState.batchSize || 8;
      const opened = currentState.currentOpenIndex || 0;
      setUrlPattern(currentState.urlPattern || "");
      setStartId(currentState.startId || "");
      setEndId(currentState.endId || "");
      setGeneratedUrls(urls);
      setBatchSize(bs);
      setCurrentOpenIndex(opened);

      // Reconstruct progress UI if there was prior progress
      if (urls.length > 0 && opened > 0) {
        const batchInfo = BatchUrlGenerator.calculateBatchInfo(
          urls.length,
          opened - 1,
          bs
        );
        setProgress({
          currentBatch: batchInfo.currentBatch,
          totalBatches: batchInfo.totalBatches,
          urlsOpened: opened,
          totalUrls: batchInfo.totalUrls,
          rangeStart: batchInfo.rangeStart,
          rangeEnd: batchInfo.rangeEnd,
        });
      }
    }
  }, [currentState]);

  // Save state whenever it changes
  // Chỉ lưu state khi tạo link (handleGenerateUrls)

  const handleGenerateUrls = () => {
    setError("");
    try {
      const urls = BatchUrlGenerator.generate(urlPattern, startId, endId);

      // Warning for large batches
      if (urls.length > BATCH_URL_CONSTANTS.WARNING_THRESHOLD) {
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
      // Don't override generatedUrls when there's an error
    }
  };

  const handleOpenAll = async () => {
    if (generatedUrls.length === 0) return;
    if (
      !confirm(
        `You are about to open ${generatedUrls.length} tabs. This may impact browser performance. Continue?`
      )
    ) {
      return;
    }
    setProgress({ message: "Opening all links..." });
    await openAllUrls(generatedUrls);
    setProgress({ message: `Opened ${generatedUrls.length} links` });
  };

  const handleOpenEach = async () => {
    if (generatedUrls.length === 0) return;

    // Calculate batch info using utility
    const batchInfo = BatchUrlGenerator.calculateBatchInfo(
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
    <div className="fixed-height-container">
      <Stack spacing={2} sx={{ height: "100%" }}>
        {/* Fixed sections at top */}
        <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
          <Box
            onClick={() => setExpanded((v) => !v)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1,
              cursor: "pointer",
              userSelect: "none",
              bgcolor: "#fafafa",
              borderBottom: expanded ? "1px solid #e0e0e0" : "none",
            }}
          >
            <Typography variant="subtitle1" sx={{ flex: 1 }}>
              URL Pattern
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {expanded && (
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField
                  label="URL Pattern"
                  variant="outlined"
                  value={urlPattern}
                  onChange={(e) => setUrlPattern(e.target.value)}
                  placeholder={`https://example.com/page/${BATCH_URL_CONSTANTS.ID_PLACEHOLDER}`}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Tooltip
                  title={`Insert ${BATCH_URL_CONSTANTS.ID_PLACEHOLDER} placeholder`}
                >
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      height: 40,
                      width: 40,
                      border: "1px solid",
                      borderColor: "primary.main",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "primary.lighter",
                      },
                    }}
                    onClick={() => {
                      const currentValue = urlPattern;
                      const cursorPos =
                        document.activeElement?.selectionStart ||
                        currentValue.length;
                      const newValue = BatchUrlGenerator.insertIdPlaceholder(
                        currentValue,
                        cursorPos
                      );
                      setUrlPattern(newValue);
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {BATCH_URL_CONSTANTS.ID_PLACEHOLDER}
                    </Typography>
                  </IconButton>
                </Tooltip>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-end"
                sx={{ mt: 2 }}
              >
                <TextField
                  label="Start ID"
                  type="number"
                  value={startId}
                  onChange={(e) => setStartId(e.target.value)}
                  placeholder="1"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Tooltip title="Shift both IDs to the right">
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      height: 40,
                      width: 40,
                      border: "1px solid",
                      borderColor: "primary.main",
                      borderRadius: 2,
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
                  placeholder="10"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Tooltip title="Generate Links">
                  <IconButton
                    color="primary"
                    size="small"
                    sx={{
                      height: 40,
                      width: 40,
                      border: "1px solid",
                      borderColor: "primary.main",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "primary.lighter",
                      },
                    }}
                    onClick={handleGenerateUrls}
                  >
                    <AutoFixHighIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Expandable Batch Links section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
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
            value={generatedUrls.join("\n")}
            onChange={(e) => handleGeneratedUrlsChange(e.target.value)}
            fullWidth
            sx={{
              flex: 1,
              display: "flex",
              "& .MuiInputBase-root": {
                height: "100%",
                alignItems: "stretch",
              },
              "& .MuiInputBase-inputMultiline": {
                height: "100% !important",
                overflow: "auto",
                resize: "none",
              },
            }}
          />
        </Box>

        {/* Fixed controls at bottom */}
        <Box className="fixed-bottom">
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
            <Tooltip title="Open all URLs at once">
              <Button
                variant="contained"
                color="success"
                onClick={handleOpenAll}
                startIcon={<OpenInNewIcon />}
              >
                All
              </Button>
            </Tooltip>
            <Tooltip title="Open URLs in batches">
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenEach}
                startIcon={<PlayArrowIcon />}
              >
                Each
              </Button>
            </Tooltip>
          </Stack>

          {progress && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Opened batch {progress.currentBatch} of {progress.totalBatches}{" "}
                (
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
        </Box>
      </Stack>

      {/* Floating Toast for Error */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            position: "fixed",
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 1000,
            maxWidth: "calc(100% - 32px)",
          }}
        >
          {error}
        </Alert>
      )}
    </div>
  );
};

export default BatchUrl;
