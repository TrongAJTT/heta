import React, { useState } from "react";
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
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";
import { useInstances } from "../hooks";
import { INSTANCE_COLORS, INSTANCE_ICONS } from "../constants";
import { validateInstance } from "../models/instanceModel";
import InfoDialog from "../components/InfoDialog";
import OpenInstanceDialog from "../components/OpenInstanceDialog";
import ToastWithProgress from "../components/ToastWithProgress";
import { TOAST_DURATION } from "../constants/ui";

const Instance = () => {
  const {
    instances,
    mostRecentSaved,
    mostRecentOpened,
    loading,
    error,
    save,
    remove,
    saveTabsTo,
    openTabs,
    create,
    initialize,
  } = useInstances();

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);

  // Edit states
  const [editingInstance, setEditingInstance] = useState(null);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [newInstanceColor, setNewInstanceColor] = useState(INSTANCE_COLORS[0]);
  const [newInstanceIcon, setNewInstanceIcon] = useState(INSTANCE_ICONS[0]);
  const [withCurrentTabs, setWithCurrentTabs] = useState(true);

  // Open dialog states
  const [instanceToOpen, setInstanceToOpen] = useState(null);
  const [appendMode, setAppendMode] = useState(false);

  // Menu states
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuInstance, setMenuInstance] = useState(null);

  // UI states
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // === CREATE INSTANCE ===
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

  // === EDIT INSTANCE ===
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
      setMenuAnchor(null);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update instance");
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (instance) => {
    setEditingInstance({ ...instance });
    setShowEditDialog(true);
    setMenuAnchor(null);
    clearMessages();
  };

  // === DELETE INSTANCE ===
  const handleDeleteInstance = async (instanceId) => {
    setMenuAnchor(null);

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

  // === SAVE INSTANCE TABS ===
  const handleSaveInstance = async (instanceId) => {
    clearMessages();
    setActionLoading(true);
    try {
      const result = await saveTabsTo(instanceId);
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save tabs");
    } finally {
      setActionLoading(false);
    }
  };

  // === OPEN INSTANCE TABS ===
  const handleOpenInstanceClick = (instance) => {
    setInstanceToOpen(instance);
    setAppendMode(false);
    setShowOpenDialog(true);
    clearMessages();
  };

  const handleConfirmOpenInstance = async () => {
    if (!instanceToOpen) return;

    console.log("Opening instance with append mode:", appendMode);
    setActionLoading(true);
    try {
      const result = await openTabs(instanceToOpen.id, appendMode);
      console.log("Open result:", result);
      if (result.success) {
        setSuccessMessage(result.message);
        setShowOpenDialog(false);
        setInstanceToOpen(null);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to open instance");
    } finally {
      setActionLoading(false);
    }
  };

  // === MENU HANDLERS ===
  const handleMenuOpen = (event, instance) => {
    setMenuAnchor(event.currentTarget);
    setMenuInstance(instance);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuInstance(null);
  };

  // === RENDER BADGES ===
  const renderInstanceBadges = (instance) => {
    const badges = [];

    // Tab count with hover list
    badges.push(
      <Tooltip
        key="tabcount"
        title={
          <Box
            sx={{ maxWidth: 360, maxHeight: 240, overflowY: "auto", p: 0.5 }}
          >
            {(instance.tabs || []).length === 0 ? (
              <Typography variant="caption" color="text.secondary">
                No tabs
              </Typography>
            ) : (
              <Stack spacing={0.5}>
                {(instance.tabs || []).map((t, idx) => (
                  <Box
                    key={idx}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {idx + 1}.
                    </Typography>
                    <Typography variant="caption">
                      {t.title || t.url || `Tab ${idx + 1}`}
                    </Typography>
                  </Box>
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
          sx={{ height: 20 }}
        />
      </Tooltip>
    );

    if (mostRecentSaved && instance.id === mostRecentSaved.id) {
      badges.push(
        <Tooltip
          key="saved"
          title={`Most recently saved at ${new Date(
            mostRecentSaved.time || instance.modifiedAt || Date.now()
          ).toLocaleString()}`}
        >
          <Chip
            icon={<CloudUploadIcon fontSize="small" />}
            label=""
            size="small"
            color="success"
            sx={{
              height: 20,
              minWidth: 24,
              "& .MuiChip-label": { px: 0 },
              "& .MuiChip-icon": { m: 0 },
            }}
          />
        </Tooltip>
      );
    }

    if (mostRecentOpened && instance.id === mostRecentOpened.id) {
      badges.push(
        <Tooltip
          key="opened"
          title={`Most recently opened at ${new Date(
            mostRecentOpened.time || instance.modifiedAt || Date.now()
          ).toLocaleString()}`}
        >
          <Chip
            icon={<AccessTimeIcon fontSize="small" />}
            label=""
            size="small"
            color="primary"
            sx={{
              height: 20,
              minWidth: 24,
              "& .MuiChip-label": { px: 0 },
              "& .MuiChip-icon": { m: 0 },
            }}
          />
        </Tooltip>
      );
    }

    return badges;
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              size="small"
            >
              CREATE
            </Button>
          </Stack>
        </Stack>

        {/* Messages */}
        <ToastWithProgress
          open={!!successMessage}
          onClose={clearMessages}
          message={successMessage}
          severity="success"
          duration={TOAST_DURATION}
          position="bottom"
        />
        <ToastWithProgress
          open={!!(errorMessage || error)}
          onClose={clearMessages}
          message={errorMessage || error}
          severity="error"
          duration={TOAST_DURATION}
          position="bottom"
        />

        {/* Instances List */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <Stack spacing={1.5}>
            {instances.length === 0 ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  bgcolor: "background.default",
                }}
              >
                <Typography color="text.secondary">
                  No instances yet. Create your first instance!
                </Typography>
              </Paper>
            ) : (
              instances.map((instance) => (
                <Paper
                  key={instance.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderLeft: "4px solid",
                    borderLeftColor: instance.color,
                    borderRadius: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: 2,
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {/* Instance Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {instance.name}
                        </Typography>
                        {renderInstanceBadges(instance)}
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {instance.modifiedAt &&
                          `Modified: ${new Date(
                            instance.modifiedAt
                          ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`}
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Save current tabs to this instance">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleSaveInstance(instance.id)}
                          disabled={actionLoading}
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Open instance tabs">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleOpenInstanceClick(instance)}
                          disabled={actionLoading}
                        >
                          <FolderOpenIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="More options">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, instance)}
                          disabled={actionLoading}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Paper>
              ))
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => openEditDialog(menuInstance)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteInstance(menuInstance?.id)}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* CREATE DIALOG */}
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
              fullWidth
              value={newInstanceName}
              onChange={(e) => setNewInstanceName(e.target.value)}
              placeholder="My Workspace"
              autoFocus
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Color
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, 36px)",
                  gap: 1,
                }}
              >
                {INSTANCE_COLORS.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setNewInstanceColor(color)}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: color,
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor:
                        newInstanceColor === color
                          ? "text.primary"
                          : "transparent",
                      transition: "all 0.15s",
                      "&:hover": {
                        transform: "scale(1.06)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <input
                type="checkbox"
                checked={withCurrentTabs}
                onChange={(e) => setWithCurrentTabs(e.target.checked)}
                id="with-current-tabs"
              />
              <label htmlFor="with-current-tabs">
                <Typography variant="body2">
                  Create with current tabs
                </Typography>
              </label>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateInstance}
            variant="contained"
            disabled={actionLoading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
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
                fullWidth
                value={editingInstance.name}
                onChange={(e) =>
                  setEditingInstance({
                    ...editingInstance,
                    name: e.target.value,
                  })
                }
                autoFocus
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Color
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, 36px)",
                    gap: 1,
                  }}
                >
                  {INSTANCE_COLORS.map((color) => (
                    <Box
                      key={color}
                      onClick={() =>
                        setEditingInstance({
                          ...editingInstance,
                          color,
                        })
                      }
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: color,
                        cursor: "pointer",
                        border: "2px solid",
                        borderColor:
                          editingInstance.color === color
                            ? "text.primary"
                            : "transparent",
                        transition: "all 0.15s",
                        "&:hover": {
                          transform: "scale(1.06)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleEditInstance}
            variant="contained"
            disabled={actionLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* OPEN INSTANCE DIALOG */}
      <OpenInstanceDialog
        open={showOpenDialog}
        onClose={() => setShowOpenDialog(false)}
        onConfirm={handleConfirmOpenInstance}
        instance={instanceToOpen}
        append={appendMode}
        onAppendChange={setAppendMode}
        loading={actionLoading}
      />

      {/* INFO DIALOG (same structure as Redirect) */}
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
          'Use "Save" to save current tabs to the selected instance',
          'Use "Open" to load tabs from an instance (append or replace)',
          "Edit or delete instances from the menu",
        ]}
        additionalFeatures={[
          "Color-coded instances for easy identification",
          "Tab count display for each instance",
          "Badges for most recently saved/opened instances",
          "Optional append mode when opening tabs",
        ]}
        note="Opening an instance in replace mode will close current tabs before loading saved ones."
      />

      {/* Toast Messages */}
      {actionLoading && <ToastWithProgress message="Processing..." />}
    </div>
  );
};

export default Instance;
