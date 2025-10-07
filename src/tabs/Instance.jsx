import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Stack,
  TextField,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import RefreshIcon from "@mui/icons-material/Refresh";
import TabIcon from "@mui/icons-material/Tab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { useInstances } from "../hooks";
import { INSTANCE_COLORS, INSTANCE_ICONS } from "../constants";
import { validateInstance } from "../models/instanceModel";
import InfoDialog from "../components/InfoDialog";
import ToastWithProgress from "../components/ToastWithProgress";

const Instance = () => {
  const {
    instances,
    currentInstanceId,
    loading,
    error,
    save,
    remove,
    switchTo,
    create,
    saveCurrentTabs,
  } = useInstances();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [editingInstance, setEditingInstance] = useState(null);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [newInstanceColor, setNewInstanceColor] = useState(INSTANCE_COLORS[0]);
  const [newInstanceIcon, setNewInstanceIcon] = useState(INSTANCE_ICONS[0]);
  const [withCurrentTabs, setWithCurrentTabs] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCreateInstance = async () => {
    clearMessages();

    const validation = validateInstance({
      name: newInstanceName,
      color: newInstanceColor,
      icon: newInstanceIcon,
    });

    if (!validation.isValid) {
      setErrorMessage(validation.errors.join(", "));
      return;
    }

    setActionLoading(true);
    try {
      await create(
        {
          name: newInstanceName,
          color: newInstanceColor,
          icon: newInstanceIcon,
        },
        withCurrentTabs
      );
      setSuccessMessage("Instance created successfully!");
      setShowCreateDialog(false);
      setNewInstanceName("");
      setNewInstanceColor(INSTANCE_COLORS[0]);
      setNewInstanceIcon(INSTANCE_ICONS[0]);
      setWithCurrentTabs(false);
    } catch (err) {
      setErrorMessage(err.message || "Failed to create instance");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditInstance = async () => {
    clearMessages();

    if (!editingInstance) return;

    const validation = validateInstance(editingInstance);
    if (!validation.isValid) {
      setErrorMessage(validation.errors.join(", "));
      return;
    }

    setActionLoading(true);
    try {
      await save(editingInstance);
      setSuccessMessage("Instance updated successfully!");
      setShowEditDialog(false);
      setEditingInstance(null);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update instance");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInstance = async (instanceId) => {
    if (!confirm("Are you sure you want to delete this instance?")) {
      return;
    }

    clearMessages();
    setActionLoading(true);
    try {
      await remove(instanceId);
      setSuccessMessage("Instance deleted successfully!");
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete instance");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSwitchInstance = async (instanceId) => {
    if (instanceId === currentInstanceId) {
      return;
    }

    if (
      !confirm(
        "Switching instance will close current tabs and open tabs from selected instance.\n" +
          "⚠️ IMPORTANT: Make sure you have saved your current instance data before switching!\n" +
          "Continue?"
      )
    ) {
      return;
    }

    clearMessages();
    setActionLoading(true);
    try {
      const result = await switchTo(instanceId);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to switch instance");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveCurrentTabs = async () => {
    clearMessages();
    setActionLoading(true);
    try {
      const success = await saveCurrentTabs();
      if (success) {
        setSuccessMessage("Current tabs saved to instance!");
      } else {
        setErrorMessage("Failed to save current tabs");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save current tabs");
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (instance) => {
    setEditingInstance({ ...instance });
    setShowEditDialog(true);
    clearMessages();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
            <TabIcon />
            <Typography variant="h6">Instance Manager</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="About Instance feature">
              <IconButton
                color="info"
                size="small"
                onClick={() => setShowInfoDialog(true)}
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
            {currentInstanceId && (
              <Tooltip title="Save current tabs to active instance">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={handleSaveCurrentTabs}
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "primary.dark",
                      bgcolor: "primary.lighter",
                    },
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => {
                setShowCreateDialog(true);
                clearMessages();
              }}
            >
              Create
            </Button>
          </Stack>
        </Stack>

        {/* Messages */}
        {/* Floating Toast for Error */}
        <ToastWithProgress
          open={!!(errorMessage || error)}
          onClose={clearMessages}
          message={errorMessage || error}
          severity="error"
          duration={5000}
          position="bottom"
        />

        {/* Instances List */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {instances.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <TabIcon
                sx={{ fontSize: 48, color: "text.secondary", opacity: 0.5 }}
              />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No instances yet.
                <br />
                Create your first instance to manage tab workspaces.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {instances.map((instance) => (
                <Paper
                  key={instance.id}
                  variant="outlined"
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    borderColor: instance.color,
                    borderWidth: instance.id === currentInstanceId ? 2 : 1,
                    bgcolor:
                      instance.id === currentInstanceId
                        ? `${instance.color}20`
                        : undefined,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Stack flex={1} spacing={0.25}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {instance.name}
                      </Typography>
                      {instance.id === currentInstanceId && (
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ color: "success.main" }}
                        />
                      )}
                      <Tooltip
                        title={
                          <Box
                            sx={{
                              maxWidth: 360,
                              maxHeight: 240,
                              overflowY: "auto",
                              p: 0.5,
                            }}
                          >
                            {(instance.tabs || []).length === 0 ? (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                No tabs
                              </Typography>
                            ) : (
                              <Stack spacing={0.5}>
                                {(instance.tabs || []).map((t, idx) => (
                                  <Typography
                                    key={idx}
                                    variant="caption"
                                    sx={{ display: "block" }}
                                  >
                                    {t.title || t.url || `Tab ${idx + 1}`}
                                  </Typography>
                                ))}
                              </Stack>
                            )}
                          </Box>
                        }
                        placement="top"
                        arrow
                      >
                        <Chip
                          label={`${instance.tabs?.length || 0} tabs`}
                          size="small"
                          variant="outlined"
                          sx={{ ml: "auto", cursor: "default" }}
                        />
                      </Tooltip>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      Modified: {new Date(instance.modifiedAt).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    {instance.id !== currentInstanceId && (
                      <Tooltip title="Switch to this instance">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleSwitchInstance(instance.id)}
                        >
                          <SwitchAccountIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit instance">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => openEditDialog(instance)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete instance">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteInstance(instance.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        {/* Create Instance Dialog */}
        <Dialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Instance</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Instance Name"
                value={newInstanceName}
                onChange={(e) => setNewInstanceName(e.target.value)}
                fullWidth
                required
                autoFocus
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Color
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {INSTANCE_COLORS.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setNewInstanceColor(color)}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: color,
                        borderRadius: 1,
                        cursor: "pointer",
                        border: newInstanceColor === color ? 3 : 0,
                        borderColor: "text.primary",
                        "&:hover": { opacity: 0.8 },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <input
                    type="checkbox"
                    checked={withCurrentTabs}
                    onChange={(e) => setWithCurrentTabs(e.target.checked)}
                    id="withCurrentTabs"
                  />
                  <label htmlFor="withCurrentTabs">
                    <Typography variant="body2">
                      Include current tabs in new instance
                    </Typography>
                  </label>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button
              onClick={handleCreateInstance}
              variant="contained"
              disabled={actionLoading}
              startIcon={
                actionLoading ? <CircularProgress size={16} /> : <AddIcon />
              }
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Instance Dialog */}
        <Dialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Instance</DialogTitle>
          <DialogContent>
            {editingInstance && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Instance Name"
                  value={editingInstance.name}
                  onChange={(e) =>
                    setEditingInstance({
                      ...editingInstance,
                      name: e.target.value,
                    })
                  }
                  fullWidth
                  required
                  autoFocus
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Color
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {INSTANCE_COLORS.map((color) => (
                      <Box
                        key={color}
                        onClick={() =>
                          setEditingInstance({ ...editingInstance, color })
                        }
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: color,
                          borderRadius: 1,
                          cursor: "pointer",
                          border: editingInstance.color === color ? 3 : 0,
                          borderColor: "text.primary",
                          "&:hover": { opacity: 0.8 },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  This instance has {editingInstance.tabs?.length || 0} tabs
                </Typography>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button
              onClick={handleEditInstance}
              variant="contained"
              disabled={actionLoading}
              startIcon={
                actionLoading ? <CircularProgress size={16} /> : <SaveIcon />
              }
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Info Dialog */}
        <InfoDialog
          open={showInfoDialog}
          onClose={() => setShowInfoDialog(false)}
          title="Instance Manager Feature"
          description="The Instance Manager allows you to create and manage multiple tab workspaces."
          features={[
            "Organizing different projects or workflows",
            "Switching between different sets of tabs quickly",
            "Saving and restoring specific tab configurations",
            "Managing multiple browser sessions efficiently",
          ]}
          howToUse={[
            'Click "Create" to create a new instance',
            'Use "Save" to save current tabs to the active instance',
            "Click the switch icon to switch to a different instance",
            "Edit or delete instances as needed",
          ]}
          additionalFeatures={[
            "Color-coded instances for easy identification",
            "Tab count display for each instance",
            "Modified timestamp tracking",
            "Quick switching between instances",
          ]}
          note="Switching instances will close current tabs and open tabs from the selected instance."
        />

        {/* Floating Toast for Success */}
        <ToastWithProgress
          open={!!successMessage}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
          severity="success"
          duration={5000}
          position="bottom"
        />
      </Stack>
    </div>
  );
};

export default Instance;
