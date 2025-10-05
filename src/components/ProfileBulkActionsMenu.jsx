import React, { useRef, useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import {
  importProfilesFromJsonText,
  exportAllProfilesToFile,
} from "../utils/profileIO";

const ProfileBulkActionsMenu = ({ onChanged }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const open = Boolean(anchorEl);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const triggerImport = () => inputRef.current && inputRef.current.click();

  const handleImportFiles = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const count = await importProfilesFromJsonText(text);
      if (count > 0 && onChanged) onChanged();
    } catch (err) {
      console.error(err);
      alert("Failed to import.");
    } finally {
      closeMenu();
    }
  };

  const handleExport = async () => {
    try {
      const count = await exportAllProfilesToFile();
    } finally {
      closeMenu();
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: "none" }}
        onChange={handleImportFiles}
      />
      <IconButton size="small" onClick={openMenu}>
        <MoreHorizIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        <MenuItem onClick={triggerImport}>
          <ListItemIcon>
            <UploadFileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Batch Import</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Batch Export</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileBulkActionsMenu;
