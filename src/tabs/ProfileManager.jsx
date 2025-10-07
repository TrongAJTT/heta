import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Typography,
  Stack,
  TextField,
  Chip,
  Tooltip,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import ProfileImportButton from "../components/ProfileImportButton";
import ProfileBulkActionsMenu from "../components/ProfileBulkActionsMenu";
import { createProfile, normalizeProfile } from "../models/profileModel";
import InfoDialog from "../components/InfoDialog";
import {
  getAllProfiles,
  saveProfile,
  deleteProfile,
  getActiveProfileId,
  setActiveProfileId,
} from "../utils/storage";
import { cleanProfileData } from "../utils/profileIO";

const ProfileManager = ({ currentState, onLoadProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfile] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileDescription, setNewProfileDescription] = useState("");
  const [showNewProfileInput, setShowNewProfileInput] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    loadProfiles();
    loadActiveProfile();
  }, []);

  const loadProfiles = async () => {
    const allProfiles = await getAllProfiles();
    const normalized = (allProfiles || []).map((p) => normalizeProfile(p));
    setProfiles(normalized);
  };

  const loadActiveProfile = async () => {
    const activeId = await getActiveProfileId();
    setActiveProfile(activeId);
  };

  const handleCreateProfile = async () => {
    const trimmedName = newProfileName.trim();
    const trimmedDescription = newProfileDescription.trim();

    // Validate profile name
    if (!trimmedName) {
      alert("Please enter a profile name.");
      return;
    }

    if (trimmedName.length < 2) {
      alert("Profile name must be at least 2 characters.");
      return;
    }

    // Check for duplicate names
    if (
      profiles.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      alert("Profile name already exists. Please choose another name.");
      return;
    }

    const newProfile = createProfile({
      name: trimmedName,
      description: trimmedDescription,
      data: currentState || {},
    });

    await saveProfile(newProfile);
    await setActiveProfileId(newProfile.id);
    setNewProfileName("");
    setNewProfileDescription("");
    setShowNewProfileInput(false);
    await loadProfiles();
    await loadActiveProfile();
  };

  const handleSaveCurrentProfile = async () => {
    if (!activeProfileId) return;

    const profile = profiles.find((p) => p.id === activeProfileId);
    if (profile) {
      profile.data = currentState;
      const nowIso = new Date().toISOString();
      profile.modifiedAt = nowIso;
      await saveProfile(profile);
      await loadProfiles();
    }
  };

  const handleLoadProfile = async (profileId) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile) {
      await setActiveProfileId(profileId);
      setActiveProfile(profileId);
      onLoadProfile(profile.data);
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      await deleteProfile(profileId);
      if (activeProfileId === profileId) {
        await setActiveProfileId(null);
        setActiveProfile(null);
      }
      await loadProfiles();
    }
  };

  const handleRenameProfile = async (profileId, newName) => {
    const profile = profiles.find((p) => p.id === profileId);
    if (profile && newName.trim()) {
      profile.name = newName.trim();
      const nowIso = new Date().toISOString();
      profile.modified = nowIso;
      await saveProfile(profile);
      await loadProfiles();
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
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon />
            <Typography variant="h6">Profile Manager</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="About Profile Manager">
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
            {activeProfileId && (
              <>
                <Tooltip title="Save current profile">
                  <IconButton
                    color="success"
                    size="small"
                    onClick={handleSaveCurrentProfile}
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
                <Tooltip title="Export profile as JSON">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      const profile = profiles.find(
                        (p) => p.id === activeProfileId
                      );
                      if (profile) {
                        // Clean profile data before export
                        const cleanedProfile = {
                          ...profile,
                          data: cleanProfileData(profile.data),
                        };
                        const dataStr =
                          "data:text/json;charset=utf-8," +
                          encodeURIComponent(
                            JSON.stringify(cleanedProfile, null, 2)
                          );
                        const downloadAnchorNode = document.createElement("a");
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute(
                          "download",
                          `${profile.name || "profile"}.json`
                        );
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                      }
                    }}
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
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <ProfileBulkActionsMenu
              onChanged={async () => {
                await loadProfiles();
                await loadActiveProfile();
              }}
            />
          </Stack>
        </Stack>

        {/* Scrollable profiles area */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {profiles.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "grey.50",
                border: "2px dashed",
                borderColor: "grey.300",
                borderRadius: 2,
              }}
            >
              <Box sx={{ mb: 2 }}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ opacity: 0.5 }}
                >
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill="currentColor"
                  />
                </svg>
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No profiles yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first profile or import existing ones to get started
              </Typography>

              {/* Action buttons or input form inside the card */}
              {!showNewProfileInput ? (
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setShowNewProfileInput(true)}
                  >
                    Create New
                  </Button>
                  <ProfileImportButton
                    variant="outlined"
                    onImported={async () => {
                      await loadProfiles();
                      await loadActiveProfile();
                    }}
                  />
                </Stack>
              ) : (
                <Stack spacing={1} sx={{ maxWidth: 500, mx: "auto" }}>
                  <TextField
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Profile name..."
                    size="small"
                    autoFocus
                    onKeyPress={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleCreateProfile()
                    }
                    fullWidth
                  />
                  <TextField
                    value={newProfileDescription}
                    onChange={(e) => setNewProfileDescription(e.target.value)}
                    placeholder="Description (optional)..."
                    size="small"
                    multiline
                    rows={2}
                    fullWidth
                  />
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={handleCreateProfile}
                      sx={{ flex: 1 }}
                    >
                      Create
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => {
                        setShowNewProfileInput(false);
                        setNewProfileName("");
                        setNewProfileDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Paper>
          ) : (
            <Stack spacing={0.5}>
              {profiles.map((profile) => (
                <Paper
                  key={profile.id}
                  variant={
                    activeProfileId === profile.id ? "outlined" : "elevation"
                  }
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    borderColor:
                      activeProfileId === profile.id
                        ? "primary.main"
                        : undefined,
                    bgcolor:
                      activeProfileId === profile.id
                        ? "primary.lighter"
                        : undefined,
                  }}
                >
                  <Stack flex={1} spacing={0.25}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {profile.name}
                      </Typography>
                      {activeProfileId === profile.id && (
                        <Chip label="Active" color="primary" size="small" />
                      )}
                    </Stack>
                    {profile.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.8125rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {profile.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {`Modified: ${new Date(profile.modifiedAt).toLocaleString(
                        "en-US"
                      )}`}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Load">
                      <span>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleLoadProfile(profile.id)}
                          disabled={activeProfileId === profile.id}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => {
                          setEditingProfile(profile);
                          setEditName(profile.name || "");
                          setEditDescription(profile.description || "");
                          setEditDialogOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteProfile(profile.id)}
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

        {/* Fixed bottom controls - only show when there are profiles */}
        {profiles.length > 0 && (
          <Box className="fixed-bottom">
            {!showNewProfileInput ? (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setShowNewProfileInput(true)}
                >
                  Create New
                </Button>
                <ProfileImportButton
                  variant="outlined"
                  onImported={async () => {
                    await loadProfiles();
                    await loadActiveProfile();
                  }}
                />
              </Stack>
            ) : (
              <Stack spacing={1}>
                <TextField
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Profile name..."
                  size="small"
                  autoFocus
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleCreateProfile()
                  }
                  fullWidth
                />
                <TextField
                  value={newProfileDescription}
                  onChange={(e) => setNewProfileDescription(e.target.value)}
                  placeholder="Description (optional)..."
                  size="small"
                  multiline
                  rows={2}
                  fullWidth
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleCreateProfile}
                    sx={{ flex: 1, borderRadius: 2 }}
                  >
                    Create
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => {
                      setShowNewProfileInput(false);
                      setNewProfileName("");
                      setNewProfileDescription("");
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            )}
          </Box>
        )}
      </Stack>

      {/* Info Dialog */}
      <InfoDialog
        open={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        title="Profile Manager Feature"
        description="The Profile Manager allows you to save, load, and manage different configurations of your browser extension settings."
        features={[
          "Saving current extension state as profiles",
          "Switching between different configurations quickly",
          "Organizing settings for different projects or workflows",
          "Backing up and restoring extension data",
        ]}
        howToUse={[
          'Click "Create New" to create a new profile',
          'Use "Save" to save current state to active profile',
          "Click the load icon to switch to a different profile",
          'Use "Rename" to change profile name or "Delete" to remove',
        ]}
        additionalFeatures={[
          "Import/export profiles as JSON files",
          "Bulk operations for managing multiple profiles",
          "Active profile indicator with visual highlighting",
          "Automatic timestamp tracking for modifications",
        ]}
        note="Profiles contain all your extension settings including redirect rules, blocked domains, batch URLs, and instance data."
      />

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ px: 2, py: 1.5 }}>Edit Profile</DialogTitle>
        <DialogContent sx={{ px: 2, pt: 1.5, pb: 0.5, overflow: "visible" }}>
          <Stack spacing={1.25}>
            <TextField
              label="Name"
              size="small"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              fullWidth
            />
            <TextField
              label="Description"
              size="small"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!editingProfile) return;
              const trimmedName = (editName || "").trim();
              if (!trimmedName) return;
              const updated = {
                ...editingProfile,
                name: trimmedName,
                description: editDescription || "",
                modifiedAt: new Date().toISOString(),
              };
              await saveProfile(updated);
              setEditDialogOpen(false);
              setEditingProfile(null);
              await loadProfiles();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfileManager;
