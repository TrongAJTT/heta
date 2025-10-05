import React, { useRef, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { importProfilesFromJsonText } from "../utils/profileIO";

/**
 * ProfileImportButton is responsible for importing a profile from a JSON file
 * and persisting it. UI and file handling live here to keep parent simple.
 */
const ProfileImportButton = ({
  size = "medium",
  variant = "outlined",
  onImported,
}) => {
  const inputRef = useRef(null);
  const [isBusy, setIsBusy] = useState(false);

  const triggerPicker = () => inputRef.current && inputRef.current.click();

  const readFileText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const handleFiles = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = ""; // allow re-selecting same file later
    if (!file) return;
    setIsBusy(true);
    try {
      const text = await readFileText(file);
      const importedCount = await importProfilesFromJsonText(text);
      if (importedCount > 0) {
        onImported && onImported(importedCount);
      }
      alert(`Imported ${importedCount} profile(s).`);
    } catch (err) {
      console.error("Import profile error:", err);
      alert("Failed to import profile.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: "none" }}
        onChange={handleFiles}
      />
      <Tooltip title="Import profile from JSON">
        <span>
          <Button
            variant={variant}
            size={size}
            startIcon={<UploadFileIcon />}
            onClick={triggerPicker}
            disabled={isBusy}
          >
            Import
          </Button>
        </span>
      </Tooltip>
    </>
  );
};

export default ProfileImportButton;
