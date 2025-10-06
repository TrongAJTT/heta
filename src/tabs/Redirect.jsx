import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Paper,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  getRedirectRules,
  saveRedirectRules,
  updateRedirectRules,
} from "../utils/redirectManager";
import { RedirectValidator } from "../utils/redirectValidator";

const Redirect = () => {
  const [redirectRules, setRedirectRules] = useState([]);
  const [fromUrl, setFromUrl] = useState("");
  const [toUrl, setToUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingFromUrl, setEditingFromUrl] = useState("");
  const [editingToUrl, setEditingToUrl] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  useEffect(() => {
    loadRedirectRules();
  }, []);

  const loadRedirectRules = async () => {
    const rules = await getRedirectRules();
    setRedirectRules(rules);
  };

  const validateRule = (from, to) => {
    return RedirectValidator.validate(from, to, redirectRules, editingId);
  };

  const handleAddRule = () => {
    setError("");
    const validation = validateRule(fromUrl, toUrl);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const newRule = {
      id: Date.now().toString(),
      fromUrl: validation.fromUrl,
      toUrl: validation.toUrl,
      createdAt: new Date().toISOString(),
    };

    setRedirectRules([...redirectRules, newRule]);
    setFromUrl("");
    setToUrl("");
    setSuccessMessage("Redirect rule added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteRule = (id) => {
    setRedirectRules(redirectRules.filter((rule) => rule.id !== id));
    setSuccessMessage("Redirect rule removed!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleStartEdit = (rule) => {
    setEditingId(rule.id);
    setEditingFromUrl(rule.fromUrl);
    setEditingToUrl(rule.toUrl);
    setError("");
  };

  const handleSaveEdit = () => {
    setError("");
    const validation = validateRule(editingFromUrl, editingToUrl);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setRedirectRules(
      redirectRules.map((rule) =>
        rule.id === editingId
          ? {
              ...rule,
              fromUrl: validation.fromUrl,
              toUrl: validation.toUrl,
              updatedAt: new Date().toISOString(),
            }
          : rule
      )
    );

    setEditingId(null);
    setEditingFromUrl("");
    setEditingToUrl("");
    setSuccessMessage("Redirect rule updated!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingFromUrl("");
    setEditingToUrl("");
    setError("");
  };

  const handleSaveRedirectList = async () => {
    try {
      await saveRedirectRules(redirectRules);
      await updateRedirectRules(redirectRules);
      setSuccessMessage("Redirect rules applied successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to apply redirect rules. Please try again.");
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all redirect rules? This will also clear all active redirects."
      )
    ) {
      setRedirectRules([]);
      setSuccessMessage("All redirect rules cleared!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="fixed-height-container">
      <Stack spacing={2} sx={{ height: "100%" }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <SwapHorizIcon />
            <Typography variant="h6">Redirect Manager</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="About Redirect feature">
              <IconButton
                color="info"
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
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save and apply redirect rules">
              <IconButton
                color="success"
                size="small"
                onClick={handleSaveRedirectList}
                sx={{
                  border: "1px solid",
                  borderColor: "success.main",
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "success.dark",
                    bgcolor: "success.lighter",
                  },
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            {redirectRules.length > 0 && (
              <Tooltip title="Clear all redirect rules">
                <IconButton
                  color="error"
                  size="small"
                  onClick={handleClearAll}
                  sx={{
                    border: "1px solid",
                    borderColor: "error.main",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "error.dark",
                      bgcolor: "error.lighter",
                    },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {/* Add Redirect Rule Section */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="From URL Pattern"
                value={fromUrl}
                onChange={(e) => setFromUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddRule()}
                size="small"
                sx={{ flex: 1 }}
                placeholder="example.com or *.example.com"
              />
              {/* <SwapHorizIcon color="action" sx={{ opacity: 0.6 }} /> */}
              <TextField
                label="To URL (Redirect Target)"
                value={toUrl}
                onChange={(e) => setToUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddRule()}
                size="small"
                sx={{ flex: 1 }}
                placeholder="https://newsite.com"
              />
            </Stack>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddRule}
              disabled={!fromUrl.trim() || !toUrl.trim()}
            >
              Add Redirect Rule
            </Button>
          </Stack>
        </Paper>

        {/* Redirect Rules List */}
        {redirectRules.length > 0 && (
          <Typography variant="subtitle2" color="text.secondary">
            Redirect Rules ({redirectRules.length})
          </Typography>
        )}

        {/* Scrollable redirect rules section */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {redirectRules.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SwapHorizIcon
                sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5 }}
              />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No redirect rules yet.
                <br />
                Add a redirect rule above to get started.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {redirectRules.map((rule) => (
                <Paper
                  key={rule.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {editingId === rule.id ? (
                    <Stack spacing={1} flex={1}>
                      <TextField
                        label="From URL"
                        value={editingFromUrl}
                        onChange={(e) => setEditingFromUrl(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSaveEdit()
                        }
                        size="small"
                        fullWidth
                        autoFocus
                      />
                      <TextField
                        label="To URL"
                        value={editingToUrl}
                        onChange={(e) => setEditingToUrl(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSaveEdit()
                        }
                        size="small"
                        fullWidth
                      />
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <>
                      <Stack flex={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body1" fontWeight={500}>
                            {rule.fromUrl}
                          </Typography>
                          <SwapHorizIcon
                            fontSize="small"
                            color="action"
                            sx={{ opacity: 0.6 }}
                          />
                          <Typography
                            variant="body1"
                            color="primary"
                            sx={{ wordBreak: "break-all" }}
                          >
                            {rule.toUrl}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Added: {new Date(rule.createdAt).toLocaleString()}
                          {rule.updatedAt && (
                            <>
                              {" "}
                              | Updated:{" "}
                              {new Date(rule.updatedAt).toLocaleString()}
                            </>
                          )}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit redirect rule">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleStartEdit(rule)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove redirect rule">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>

      {/* Toast Notifications */}
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
      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage("")}
          sx={{
            position: "fixed",
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 1000,
            maxWidth: "calc(100% - 32px)",
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Info Dialog */}
      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Redirect Manager Feature</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            The Redirect Manager allows you to automatically redirect from one
            URL to another. This is useful for:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <li>Redirecting old domains to new ones</li>
            <li>Blocking ads by redirecting to blank pages</li>
            <li>Creating custom shortcuts to frequently visited pages</li>
            <li>Redirecting tracking URLs to privacy-friendly alternatives</li>
          </Box>
          <Typography variant="body2" paragraph>
            <strong>How to use:</strong>
          </Typography>
          <Box component="ol" sx={{ pl: 2, mb: 2 }}>
            <li>Enter the source URL pattern (supports wildcards with *)</li>
            <li>Enter the target URL (must start with http:// or https://)</li>
            <li>Click "Add Redirect Rule"</li>
            <li>Click the Save button to apply all redirect rules</li>
          </Box>

          <Typography variant="body2" paragraph>
            <strong>Examples:</strong>
          </Typography>
          <Box
            sx={{
              bgcolor: "grey.50",
              p: 1,
              borderRadius: 1,
              fontSize: "0.875rem",
              fontFamily: "monospace",
              mb: 2,
            }}
          >
            <div>old.example.com → https://new.example.com</div>
            <div>*.ads.com → https://blank.page</div>
            <div>example.com → https://example.net</div>
            <div>tracking.site.com → https://privacy.site.com</div>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Note: Changes take effect immediately after saving. You can edit or
            delete rules at any time.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Redirect;
