import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Stack,
  Paper,
  TextField,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import ProfileImportButton from "../components/ProfileImportButton";
import ProfileBulkActionsMenu from "../components/ProfileBulkActionsMenu";
import {
  getAllProfiles,
  saveProfile,
  deleteProfile,
  getActiveProfileId,
  setActiveProfileId,
} from "../utils/storage";

const ProfileManager = ({ currentState, onLoadProfile }) => {
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfile] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [showNewProfileInput, setShowNewProfileInput] = useState(false);

  useEffect(() => {
    loadProfiles();
    loadActiveProfile();
  }, []);

  const loadProfiles = async () => {
    const allProfiles = await getAllProfiles();
    setProfiles(allProfiles);
  };

  const loadActiveProfile = async () => {
    const activeId = await getActiveProfileId();
    setActiveProfile(activeId);
  };

  const handleCreateProfile = async () => {
    const trimmedName = newProfileName.trim();

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

    const newProfile = {
      id: Date.now().toString(),
      name: trimmedName,
      createdAt: new Date().toISOString(),
      data: currentState || {},
    };

    await saveProfile(newProfile);
    await setActiveProfileId(newProfile.id);
    setNewProfileName("");
    setShowNewProfileInput(false);
    await loadProfiles();
    await loadActiveProfile();
  };

  const handleSaveCurrentProfile = async () => {
    if (!activeProfileId) return;

    const profile = profiles.find((p) => p.id === activeProfileId);
    if (profile) {
      profile.data = currentState;
      profile.updatedAt = new Date().toISOString();
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
      profile.updatedAt = new Date().toISOString();
      await saveProfile(profile);
      await loadProfiles();
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Profile Manager</Typography>
            <Stack direction="row" spacing={1}>
              {activeProfileId && (
                <>
                  <Tooltip title="Save current profile">
                    <IconButton
                      color="success"
                      size="small"
                      onClick={handleSaveCurrentProfile}
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
                          const dataStr =
                            "data:text/json;charset=utf-8," +
                            encodeURIComponent(
                              JSON.stringify(profile, null, 2)
                            );
                          const downloadAnchorNode =
                            document.createElement("a");
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

          <Box>
            {profiles.length === 0 ? (
              <Typography color="text.secondary" align="center">
                No profiles yet.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {profiles.map((profile) => (
                  <Paper
                    key={profile.id}
                    variant={
                      activeProfileId === profile.id ? "outlined" : "elevation"
                    }
                    sx={{
                      p: 2,
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
                    <Stack flex={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1">
                          {profile.name}
                        </Typography>
                        {activeProfileId === profile.id && (
                          <Chip label="Active" color="primary" size="small" />
                        )}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Created:{" "}
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US"
                        )}
                        {profile.updatedAt && (
                          <>
                            {" "}
                            | Updated:{" "}
                            {new Date(profile.updatedAt).toLocaleDateString(
                              "en-US"
                            )}
                          </>
                        )}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Load">
                        <span>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleLoadProfile(profile.id)}
                            disabled={activeProfileId === profile.id}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Rename">
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => {
                            const newName = prompt(
                              "Enter new name:",
                              profile.name
                            );
                            if (newName)
                              handleRenameProfile(profile.id, newName);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteProfile(profile.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>

          {!showNewProfileInput ? (
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setShowNewProfileInput(true)}
              >
                Create New Profile
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
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <TextField
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Profile name..."
                size="small"
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && handleCreateProfile()}
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleCreateProfile}
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
                }}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProfileManager;
