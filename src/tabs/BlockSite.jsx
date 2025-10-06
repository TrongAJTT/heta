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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import BlockIcon from "@mui/icons-material/Block";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  getBlockedDomains,
  saveBlockedDomains,
  updateBlockRules,
} from "../utils/blockSite";
import { DomainValidator } from "../utils/domainValidator";
import {
  createBlockedDomain,
  normalizeBlockedDomains,
} from "../models/blockDomainModel";

const BlockSite = ({
  blockedDomains: initialDomains,
  onBlockedDomainsChange,
}) => {
  const [blockedDomains, setBlockedDomains] = useState(initialDomains || []);
  const [newDomain, setNewDomain] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [bulkAddDialogOpen, setBulkAddDialogOpen] = useState(false);
  const [bulkAddInput, setBulkAddInput] = useState("");
  const [bulkAddResultDialogOpen, setBulkAddResultDialogOpen] = useState(false);
  const [bulkAddResult, setBulkAddResult] = useState({
    success: [],
    failed: [],
  });

  // Update local state when prop changes
  useEffect(() => {
    if (initialDomains) {
      setBlockedDomains(normalizeBlockedDomains(initialDomains));
    }
  }, [initialDomains]);

  useEffect(() => {
    loadBlockedDomains();
  }, []);

  const loadBlockedDomains = async () => {
    const domains = await getBlockedDomains();
    if (
      domains &&
      domains.length > 0 &&
      (!initialDomains || initialDomains.length === 0)
    ) {
      setBlockedDomains(domains);
      if (onBlockedDomainsChange) {
        onBlockedDomainsChange(domains);
      }
    }
  };

  const updateBlockedDomains = (newDomains) => {
    setBlockedDomains(newDomains);
    if (onBlockedDomainsChange) {
      onBlockedDomainsChange(newDomains);
    }
  };

  const validateDomain = (domain) => {
    return DomainValidator.validate(domain, blockedDomains, editingId);
  };

  const handleAddDomain = () => {
    setError("");
    const validation = validateDomain(newDomain);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const newEntry = createBlockedDomain({ domain: validation.domain });

    const updatedDomains = [...blockedDomains, newEntry];
    updateBlockedDomains(updatedDomains);
    setNewDomain("");
    setError("");
  };

  const handleDeleteDomain = (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this domain from the block list?"
      )
    ) {
      const updatedDomains = blockedDomains.filter((d) => d.id !== id);
      updateBlockedDomains(updatedDomains);
    }
  };

  const handleStartEdit = (domain) => {
    setEditingId(domain.id);
    setEditingValue(domain.domain);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
    setError("");
  };

  const handleSaveEdit = () => {
    setError("");
    const validation = validateDomain(editingValue);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const updatedDomains = blockedDomains.map((d) =>
      d.id === editingId
        ? {
            ...d,
            domain: validation.domain,
            modifiedAt: new Date().toISOString(),
          }
        : d
    );

    updateBlockedDomains(updatedDomains);
    setEditingId(null);
    setEditingValue("");
    setError("");
  };

  const handleSaveBlockList = async () => {
    setError("");
    setSuccessMessage("");

    try {
      // Save to storage
      await saveBlockedDomains(blockedDomains);

      // Update declarativeNetRequest rules
      const result = await updateBlockRules(blockedDomains);

      if (result.success) {
        setSuccessMessage(
          `Successfully saved and applied ${blockedDomains.length} blocked domain(s)`
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.error || "Failed to apply blocking rules");
      }
    } catch (err) {
      console.error("Error saving block list:", err);
      setError("Error saving block list: " + err.message);
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all blocked domains? This will remove all blocking rules."
      )
    ) {
      updateBlockedDomains([]);
      setError("");
      setSuccessMessage("");
    }
  };

  const handleBulkAdd = () => {
    const lines = bulkAddInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      setError("Please enter at least one domain");
      return;
    }

    const success = [];
    const failed = [];
    const newDomains = [...blockedDomains];

    lines.forEach((domain) => {
      const validation = DomainValidator.validate(domain, newDomains, null);
      if (validation.valid) {
        const newEntry = createBlockedDomain({ domain: validation.domain });
        newDomains.push(newEntry);
        success.push(validation.domain);
      } else {
        failed.push({ domain, error: validation.error });
      }
    });

    updateBlockedDomains(newDomains);
    setBulkAddResult({ success, failed });
    setBulkAddDialogOpen(false);
    setBulkAddInput("");
    setBulkAddResultDialogOpen(true);
  };

  const handleCopyBulkResult = (text) => {
    navigator.clipboard.writeText(text).catch((e) => {
      console.error("Failed to copy:", e);
    });
  };

  return (
    <div className="fixed-height-container">
      <Stack spacing={2} sx={{ height: "100%" }}>
        {/* Fixed header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6">
            <BlockIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Block Site Manager
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="About Block Site feature">
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
            <Tooltip title="Save and apply blocking rules">
              <IconButton
                color="success"
                size="small"
                onClick={handleSaveBlockList}
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
            {blockedDomains.length > 0 && (
              <Tooltip title="Clear all domains">
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

        {/* Fixed add domain section */}
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Domain to block"
            variant="outlined"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddDomain()}
            placeholder="example.com"
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddDomain}
            sx={{ minWidth: 100 }}
          >
            Add
          </Button>
          <Tooltip title="Add multiple">
            <IconButton
              color="success"
              onClick={() => setBulkAddDialogOpen(true)}
              sx={{
                bgcolor: "success.main",
                color: "white",
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "success.dark",
                },
              }}
            >
              <PlaylistAddIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Fixed blocked domains header */}
        {blockedDomains.length > 0 && (
          <Typography variant="subtitle2" color="text.secondary">
            Blocked Domains ({blockedDomains.length})
          </Typography>
        )}

        {/* Scrollable blocked domains section */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {blockedDomains.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <BlockIcon
                sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5 }}
              />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No blocked domains yet.
                <br />
                Add a domain above to get started.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0.5}>
              {blockedDomains.map((domain) => (
                <Paper
                  key={domain.id}
                  variant="outlined"
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {editingId === domain.id ? (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      flex={1}
                    >
                      <TextField
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSaveEdit()
                        }
                        size="small"
                        fullWidth
                        autoFocus
                      />
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
                  ) : (
                    <>
                      <Stack flex={1} spacing={0.25}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {domain.domain}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {`Modified: ${new Date(
                            domain.modifiedAt
                          ).toLocaleString()}`}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit domain">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleStartEdit(domain)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove from block list">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteDomain(domain.id)}
                          >
                            <DeleteIcon fontSize="small" />
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
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <BlockIcon color="primary" />
            <Typography variant="h6">Block Site Feature</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1">
              The Block Site feature allows you to prevent access to specific
              domains across your browser.
            </Typography>

            <Typography variant="h6" color="primary">
              How it works:
            </Typography>
            <Typography variant="body2">
              • Add domains to your block list using the input field above
            </Typography>
            <Typography variant="body2">
              • Click the Save button to apply blocking rules
            </Typography>
            <Typography variant="body2">
              • The browser will actively prevent connections to these domains
            </Typography>
            <Typography variant="body2">
              • Both incoming and outgoing requests are blocked
            </Typography>

            <Typography variant="h6" color="primary">
              Features:
            </Typography>
            <Typography variant="body2">
              • Block main domains and all subdomains (e.g., facebook.com blocks
              www.facebook.com)
            </Typography>
            <Typography variant="body2">
              • Block all resource types (pages, scripts, images, etc.)
            </Typography>
            <Typography variant="body2">
              • Edit or remove domains from your block list
            </Typography>
            <Typography variant="body2">
              • Clear all domains at once with the Clear button
            </Typography>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> This feature uses Chrome's
                declarativeNetRequest API to provide efficient, browser-level
                blocking.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)} color="primary">
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Add Dialog */}
      <Dialog
        open={bulkAddDialogOpen}
        onClose={() => setBulkAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Multiple Domains</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Enter each domain on a new line. Example:
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
              <div>example.com</div>
              <div>google.com</div>
              <div>facebook.com</div>
            </Box>
            <TextField
              multiline
              rows={10}
              value={bulkAddInput}
              onChange={(e) => setBulkAddInput(e.target.value)}
              placeholder="example.com&#10;google.com&#10;facebook.com"
              fullWidth
              sx={{
                fontFamily: "monospace",
                "& textarea": {
                  fontFamily: "monospace",
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBulkAdd}
            disabled={!bulkAddInput.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Add Result Dialog */}
      <Dialog
        open={bulkAddResultDialogOpen}
        onClose={() => setBulkAddResultDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Multiple Domains Result</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            {bulkAddResult.success.length > 0 && (
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle1" color="success.main">
                    ✓ Add successfully ({bulkAddResult.success.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() =>
                      handleCopyBulkResult(bulkAddResult.success.join("\n"))
                    }
                  >
                    Copy
                  </Button>
                </Stack>
                <Box
                  sx={{
                    bgcolor: "success.lighter",
                    p: 2,
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  {bulkAddResult.success.map((domain, idx) => (
                    <div key={idx}>{domain}</div>
                  ))}
                </Box>
              </Box>
            )}

            {bulkAddResult.failed.length > 0 && (
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle1" color="error.main">
                    ✗ Add failed ({bulkAddResult.failed.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() =>
                      handleCopyBulkResult(
                        bulkAddResult.failed
                          .map((f) => `${f.domain} - ${f.error}`)
                          .join("\n")
                      )
                    }
                  >
                    Copy
                  </Button>
                </Stack>
                <Box
                  sx={{
                    bgcolor: "error.lighter",
                    p: 2,
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: "auto",
                    fontSize: "0.875rem",
                  }}
                >
                  {bulkAddResult.failed.map((item, idx) => (
                    <Box key={idx} sx={{ mb: 0.5 }}>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ fontFamily: "monospace", fontWeight: 600 }}
                      >
                        {item.domain}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        color="text.secondary"
                      >
                        {" "}
                        - {item.error}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkAddResultDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BlockSite;
