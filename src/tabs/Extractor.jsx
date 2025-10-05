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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Data access and file operations are moved to utils/tabs.js

const Extractor = () => {
  const [tabs, setTabs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [expanded, setExpanded] = useState(true);
  const [filterText, setFilterText] = useState("");

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
    const text = selectedUrls.join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error(e);
      alert("Copy failed.");
    }
  };

  const handleDownload = () => {
    const text = selectedUrls.join("\n");
    downloadTextFile(text, "tabs.txt");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Tab Extractor
          </Typography>
          <TextField
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            size="small"
            placeholder="Filter URLs..."
            sx={{ width: 220 }}
          />
        </Stack>

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
            <Button
              variant="outlined"
              size="small"
              disabled={allSelectedVisible}
              onClick={(e) => {
                e.stopPropagation();
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
              onClick={(e) => {
                e.stopPropagation();
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
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
              sx={{ ml: "auto" }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          {expanded && (
            <TabChecklist
              tabs={filteredTabs}
              selectedIds={selectedIds}
              onToggleOne={toggleOne}
              maxHeight={400}
            />
          )}
        </Box>

        <Stack direction="row" spacing={1}>
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
    </Box>
  );
};

export default Extractor;
