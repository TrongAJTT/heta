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
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearIcon from "@mui/icons-material/Clear";
import SettingsIcon from "@mui/icons-material/Settings";
import TabChecklist from "../components/TabChecklist";
import ExportFormatDialog from "../components/ExportFormatDialog";
import ToastWithProgress from "../components/ToastWithProgress";
import { queryCurrentWindowHttpTabs, downloadTextFile } from "../utils/tabs";
import { ExportFormatProcessor } from "../utils/exportFormatProcessor";
import { TOAST_DURATION } from "../constants/ui";

// Data access and file operations are moved to utils/tabs.js

const Extractor = ({ exportFormat: initialFormat, onExportFormatChange }) => {
  const [tabs, setTabs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filterText, setFilterText] = useState("");
  const [exportFormat, setExportFormat] = useState(initialFormat || "<url>");
  const [exportFormatDialogOpen, setExportFormatDialogOpen] = useState(false);
  const [copyToastOpen, setCopyToastOpen] = useState(false);

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

  const selectedVisibleCount = useMemo(
    () => filteredTabs.filter((t) => selectedIds.has(t.id)).length,
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
      setCopyToastOpen(true);
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
                p: 0,
                mb: 1.5,
              }}
            >
              <Typography variant="h6">
                Export ({selectedVisibleCount}/{filteredTabs.length})
              </Typography>
              <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                <Tooltip title="Select all visible">
                  <span>
                    <IconButton
                      size="small"
                      disabled={allSelectedVisible}
                      onClick={() => {
                        const visibleIds = new Set(
                          filteredTabs.map((t) => t.id)
                        );
                        setSelectedIds(
                          (prev) => new Set([...prev, ...visibleIds])
                        );
                      }}
                      sx={{
                        border: "1px solid",
                        borderColor: "primary.main",
                        borderRadius: 2,
                        height: 36,
                        width: 36,
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "primary.lighter",
                          borderColor: "primary.dark",
                        },
                        "&:disabled": {
                          borderColor: "grey.300",
                          cursor: "not-allowed",
                          "& .MuiSvgIcon-root": {
                            color: "grey.400",
                          },
                        },
                      }}
                    >
                      <SelectAllIcon fontSize="small" color="primary" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Clear selection (visible)">
                  <span>
                    <IconButton
                      size="small"
                      disabled={!anySelectedVisible}
                      onClick={() => {
                        const visibleIds = new Set(
                          filteredTabs.map((t) => t.id)
                        );
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          visibleIds.forEach((id) => next.delete(id));
                          return next;
                        });
                      }}
                      sx={{
                        border: "1px solid",
                        borderColor: "error.main",
                        borderRadius: 2,
                        height: 36,
                        width: 36,
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "error.lighter",
                          borderColor: "error.dark",
                        },
                        "&:disabled": {
                          borderColor: "grey.300",
                          cursor: "not-allowed",
                          "& .MuiSvgIcon-root": {
                            color: "grey.400",
                          },
                        },
                      }}
                    >
                      <ClearIcon fontSize="small" color="error" />
                    </IconButton>
                  </span>
                </Tooltip>
                <TextField
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  size="small"
                  placeholder="Filter URLs..."
                  sx={{
                    width: 160,
                    backgroundColor: "#fff",
                    "& .MuiInputBase-root": {
                      height: "36px",
                    },
                  }}
                />
              </Stack>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                minHeight: 0,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
              }}
            >
              <TabChecklist
                tabs={filteredTabs}
                selectedIds={selectedIds}
                onToggleOne={toggleOne}
              />
            </Box>
          </Box>

          {/* Export Row */}
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Tooltip title={`Export Format: ${exportFormat}`}>
              <span>
                <IconButton
                  onClick={() => setExportFormatDialogOpen(true)}
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    height: 36,
                    width: 36,
                    "&:hover": {
                      bgcolor: "primary.lighter",
                      borderColor: "primary.dark",
                    },
                  }}
                >
                  <SettingsIcon fontSize="small" color="primary" />
                </IconButton>
              </span>
            </Tooltip>
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

      {/* Export Format Dialog */}
      <ExportFormatDialog
        open={exportFormatDialogOpen}
        onClose={() => setExportFormatDialogOpen(false)}
        exportFormat={exportFormat}
        onSave={(newFormat) => {
          setExportFormat(newFormat);
          if (onExportFormatChange) {
            onExportFormatChange(newFormat);
          }
        }}
        selectedTabs={selectedTabs}
      />

      {/* Copy Toast */}
      <ToastWithProgress
        open={copyToastOpen}
        onClose={() => setCopyToastOpen(false)}
        message="Content copied to clipboard"
        severity="success"
        duration={TOAST_DURATION}
      />
    </>
  );
};

export default Extractor;
