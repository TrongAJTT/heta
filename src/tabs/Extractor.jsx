import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DescriptionIcon from "@mui/icons-material/Description";
import TabChecklist from "../components/TabChecklist";
import { queryCurrentWindowHttpTabs, downloadTextFile } from "../utils/tabs";
import { ExportFormatProcessor } from "../utils/exportFormatProcessor";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Data access and file operations are moved to utils/tabs.js

const Extractor = ({ exportFormat: initialFormat, onExportFormatChange }) => {
  const [tabs, setTabs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filterText, setFilterText] = useState("");
  const [exportFormat, setExportFormat] = useState(initialFormat || "<url>");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [exportFormatExpanded, setExportFormatExpanded] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    if (initialFormat) {
      setExportFormat(initialFormat);
    }
  }, [initialFormat]);

  useEffect(() => {
    (async () => {
      const all = await queryCurrentWindowHttpTabs();
      setTabs(all);
      setSelectedIds(new Set(all.map((t) => t.id))); // default select all
    })();
  }, []);

  const filteredTabs = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return tabs;
    return tabs.filter((t) => (t.url || "").toLowerCase().includes(q));
  }, [tabs, filterText]);

  const allSelectedVisible = useMemo(
    () =>
      filteredTabs.length > 0 &&
      filteredTabs.every((t) => selectedIds.has(t.id)),
    [filteredTabs, selectedIds]
  );
  const anySelectedVisible = useMemo(
    () => filteredTabs.some((t) => selectedIds.has(t.id)),
    [filteredTabs, selectedIds]
  );

  const selectedUrls = useMemo(
    () =>
      tabs
        .filter((t) => selectedIds.has(t.id))
        .map((t) => t.url)
        .filter(Boolean),
    [tabs, selectedIds]
  );

  const selectedTabs = useMemo(
    () => tabs.filter((t) => selectedIds.has(t.id)).filter((t) => t.url),
    [tabs, selectedIds]
  );

  const formattedExportData = useMemo(
    () => ExportFormatProcessor.process(exportFormat, selectedTabs),
    [selectedTabs, exportFormat]
  );

  const toggleAll = (checked) => {
    setSelectedIds(checked ? new Set(tabs.map((t) => t.id)) : new Set());
  };

  const toggleOne = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleCopy = async () => {
    const text = formattedExportData.join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error(e);
      alert("Copy failed.");
    }
  };

  const handleDownload = () => {
    const text = formattedExportData.join("\n");
    downloadTextFile(text, "tabs.txt");
  };

  return (
    <>
      <div className="fixed-height-container">
        <Stack spacing={2} sx={{ height: "100%" }}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1,
                bgcolor: "#fafafa",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                disabled={allSelectedVisible}
                onClick={() => {
                  const visibleIds = new Set(filteredTabs.map((t) => t.id));
                  setSelectedIds((prev) => new Set([...prev, ...visibleIds]));
                }}
              >
                Select All
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={!anySelectedVisible}
                onClick={() => {
                  const visibleIds = new Set(filteredTabs.map((t) => t.id));
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    visibleIds.forEach((id) => next.delete(id));
                    return next;
                  });
                }}
              >
                Clear
              </Button>
              <Box
                sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <TextField
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  size="small"
                  placeholder="Filter URLs..."
                  sx={{
                    width: 220,
                    "& .MuiInputBase-root": {
                      height: "32px", // Match button height
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
              <TabChecklist
                tabs={filteredTabs}
                selectedIds={selectedIds}
                onToggleOne={toggleOne}
              />
            </Box>
          </Box>

          {/* Export Format Section */}
          <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Box
              onClick={() => setExportFormatExpanded((v) => !v)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1,
                cursor: "pointer",
                userSelect: "none",
                bgcolor: "#fafafa",
                borderBottom: exportFormatExpanded
                  ? "1px solid #e0e0e0"
                  : "none",
              }}
            >
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                Export Format
              </Typography>
              {!exportFormatExpanded && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  {exportFormat}
                </Typography>
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setExportFormatExpanded((v) => !v);
                }}
              >
                {exportFormatExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            {exportFormatExpanded && (
              <Box sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    value={exportFormat}
                    onChange={(e) => {
                      const newFormat = e.target.value;
                      setExportFormat(newFormat);
                      if (onExportFormatChange) {
                        onExportFormatChange(newFormat);
                      }
                    }}
                    placeholder="Enter format template..."
                  />
                  <Tooltip title="Format parameters help">
                    <IconButton
                      size="small"
                      onClick={() => setInfoDialogOpen(true)}
                      sx={{
                        border: "1px solid",
                        borderColor: "info.main",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "info.dark",
                          bgcolor: "info.lighter",
                        },
                      }}
                    >
                      <InfoIcon color="info" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                {selectedTabs.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Preview (first 2 items):
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: "grey.50",
                        p: 1,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        maxHeight: 60,
                        overflow: "auto",
                      }}
                    >
                      {formattedExportData.slice(0, 2).map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <TextField
              label="Count"
              size="small"
              value={`${selectedUrls.length}`}
              InputProps={{ readOnly: true }}
              sx={{ width: 100 }}
            />
            <Tooltip title="Copy selected URLs to clipboard">
              <span>
                <Button
                  variant="contained"
                  onClick={handleCopy}
                  disabled={selectedUrls.length === 0}
                  startIcon={<ContentCopyIcon />}
                >
                  Copy
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Export selected URLs to .txt file">
              <span>
                <Button
                  variant="outlined"
                  onClick={handleDownload}
                  disabled={selectedUrls.length === 0}
                  startIcon={<DescriptionIcon />}
                >
                  Export
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </div>

      {/* Format Parameters Info Dialog */}
      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Export Format Parameters</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Use these parameters in your format template to customize the export
            output:
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Available Parameters:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <code>&lt;id&gt;</code> - Index number (1, 2, 3...)
              </li>
              <li>
                <code>&lt;idp&gt;</code> - Zero-padded index (01, 02, 03...)
              </li>
              <li>
                <code>&lt;url&gt;</code> - Full URL of the tab
              </li>
              <li>
                <code>&lt;name&gt;</code> - Page title
              </li>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Examples:
            </Typography>
            <Box
              sx={{
                bgcolor: "grey.50",
                p: 1,
                borderRadius: 1,
                fontSize: "0.875rem",
                fontFamily: "monospace",
              }}
            >
              <div>
                <code>&lt;url&gt;</code> → https://example.com
              </div>
              <div>
                <code>&lt;id&gt;. &lt;name&gt;</code> → 1. Example Page
              </div>
              <div>
                <code>&lt;idp&gt;. &lt;name&gt;</code> → 01. Example Page
              </div>
              <div>
                <code>&lt;id&gt;. &lt;name&gt; - &lt;url&gt;</code> → 1. Example
                Page - https://example.com
              </div>
              <div>
                <code>&lt;name&gt; (&lt;url&gt;)</code> → Example Page
                (https://example.com)
              </div>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Parameters are case-sensitive and must be enclosed in angle
            brackets.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Extractor;
