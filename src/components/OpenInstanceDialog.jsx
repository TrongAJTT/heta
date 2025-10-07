import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Stack,
  Chip,
} from "@mui/material";
import TabIcon from "@mui/icons-material/Tab";
import WarningIcon from "@mui/icons-material/Warning";

/**
 * Dialog for confirming instance tab loading
 * Shows tab count and append/replace option
 */
const OpenInstanceDialog = ({
  open,
  onClose,
  onConfirm,
  instance,
  append,
  onAppendChange,
  loading,
}) => {
  if (!instance) return null;

  const tabCount = instance.tabs?.length || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <TabIcon color="primary" />
          <Typography variant="h6">Open Instance</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            Open <strong>{instance.name}</strong>?
          </Typography>

          <Chip
            icon={<TabIcon />}
            label={`${tabCount} tab${tabCount !== 1 ? "s" : ""} will be loaded`}
            color="primary"
            variant="outlined"
          />

          {!append && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                p: 1.5,
                bgcolor: "#fff3e0",
                border: "1px solid #ff9800",
                borderRadius: 1,
                alignItems: "flex-start",
              }}
            >
              <WarningIcon sx={{ color: "#e65100", fontSize: 20, mt: 0.25 }} />
              <Typography variant="body2" sx={{ color: "#e65100" }}>
                This will <strong>close all current tabs</strong> and replace
                them with instance tabs.
              </Typography>
            </Stack>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={append}
                onChange={(e) => onAppendChange(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Append tabs instead of replacing current tabs
              </Typography>
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={loading}
          autoFocus
        >
          {append ? "Append Tabs" : "Replace Tabs"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenInstanceDialog;
