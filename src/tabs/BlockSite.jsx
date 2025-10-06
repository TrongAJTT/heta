import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Stack,
  Paper,
  Chip,
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
import BlockIcon from "@mui/icons-material/Block";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import {
  getBlockedDomains,
  saveBlockedDomains,
  updateBlockRules,
} from "../utils/blockSite";
import { DomainValidator } from "../utils/domainValidator";

const BlockSite = () => {
  const [blockedDomains, setBlockedDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  useEffect(() => {
    loadBlockedDomains();
  }, []);

  const loadBlockedDomains = async () => {
    const domains = await getBlockedDomains();
    setBlockedDomains(domains);
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

    const newEntry = {
      id: Date.now().toString(),
      domain: validation.domain,
      createdAt: new Date().toISOString(),
    };

    const updatedDomains = [...blockedDomains, newEntry];
    setBlockedDomains(updatedDomains);
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
      setBlockedDomains(updatedDomains);
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
            updatedAt: new Date().toISOString(),
          }
        : d
    );

    setBlockedDomains(updatedDomains);
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
      setBlockedDomains([]);
      setError("");
      setSuccessMessage("");
    }
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

        {/* Fixed alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        )}

        {/* Fixed add domain section */}
        <Paper variant="outlined" sx={{ p: 2 }}>
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
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Examples: facebook.com, youtube.com, twitter.com
          </Typography>
        </Paper>

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
            <Stack spacing={1}>
              {blockedDomains.map((domain) => (
                <Paper
                  key={domain.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {editingId === domain.id ? (
                    <Stack
                      direction="row"
                      spacing={1}
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
                      <Stack flex={1}>
                        <Typography variant="body1" fontWeight={500}>
                          {domain.domain}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Added: {new Date(domain.createdAt).toLocaleString()}
                          {domain.updatedAt && (
                            <>
                              {" "}
                              | Updated:{" "}
                              {new Date(domain.updatedAt).toLocaleString()}
                            </>
                          )}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit domain">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleStartEdit(domain)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove from block list">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteDomain(domain.id)}
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
    </div>
  );
};

export default BlockSite;
