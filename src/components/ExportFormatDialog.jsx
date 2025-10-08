import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import { ExportFormatProcessor } from "../utils/exportFormatProcessor";

const ExportFormatDialog = ({
  open,
  onClose,
  exportFormat,
  onSave,
  selectedTabs = [],
}) => {
  const [localFormat, setLocalFormat] = useState(exportFormat);

  const formattedExportData = useMemo(
    () => ExportFormatProcessor.process(localFormat, selectedTabs),
    [selectedTabs, localFormat]
  );

  const handleSave = () => {
    onSave(localFormat);
    onClose();
  };

  const handleCancel = () => {
    setLocalFormat(exportFormat); // Reset to original value
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Export Format</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={localFormat}
              onChange={(e) => setLocalFormat(e.target.value)}
              placeholder="Enter format template..."
              label="Format Template"
            />

            {selectedTabs.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
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

            {/* Export Format Help */}
            <Box
              sx={{
                bgcolor: "grey.50",
                p: 2,
                borderRadius: 1,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Available Parameters:
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: 2,
                  m: 0,
                  fontSize: "0.75rem",
                  color: "text.secondary",
                }}
              >
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportFormatDialog;
