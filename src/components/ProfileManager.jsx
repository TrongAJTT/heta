import React, { useState, useEffect } from "react";
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
      alert("Vui lòng nhập tên profile");
      return;
    }

    if (trimmedName.length < 2) {
      alert("Tên profile phải có ít nhất 2 ký tự");
      return;
    }

    // Check for duplicate names
    if (
      profiles.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      alert("Tên profile đã tồn tại. Vui lòng chọn tên khác.");
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
    if (confirm("Bạn có chắc muốn xóa profile này?")) {
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
    <div className="profile-manager">
      <div className="section-header">
        <h3>Quản Lý Profiles</h3>
        {activeProfileId && (
          <button
            onClick={handleSaveCurrentProfile}
            className="btn btn-success btn-sm"
          >
            💾 Lưu Profile Hiện Tại
          </button>
        )}
      </div>

      <div className="profiles-list">
        {profiles.length === 0 ? (
          <div className="empty-state">Chưa có profile nào</div>
        ) : (
          profiles.map((profile) => (
            <div
              key={profile.id}
              className={`profile-item ${
                activeProfileId === profile.id ? "active" : ""
              }`}
            >
              <div className="profile-info">
                <div className="profile-name">
                  {profile.name}
                  {activeProfileId === profile.id && (
                    <span className="active-badge">Active</span>
                  )}
                </div>
                <div className="profile-meta">
                  Tạo: {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
                  {profile.updatedAt && (
                    <>
                      {" "}
                      | Cập nhật:{" "}
                      {new Date(profile.updatedAt).toLocaleDateString("vi-VN")}
                    </>
                  )}
                </div>
              </div>
              <div className="profile-actions">
                <button
                  onClick={() => handleLoadProfile(profile.id)}
                  className="btn btn-primary btn-sm"
                  disabled={activeProfileId === profile.id}
                >
                  Tải
                </button>
                <button
                  onClick={() => {
                    const newName = prompt("Nhập tên mới:", profile.name);
                    if (newName) handleRenameProfile(profile.id, newName);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="btn btn-danger btn-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!showNewProfileInput ? (
        <button
          onClick={() => setShowNewProfileInput(true)}
          className="btn btn-primary"
        >
          + Tạo Profile Mới
        </button>
      ) : (
        <div className="new-profile-form">
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Tên profile..."
            className="input-field"
            onKeyPress={(e) => e.key === "Enter" && handleCreateProfile()}
            autoFocus
          />
          <div className="button-group">
            <button
              onClick={handleCreateProfile}
              className="btn btn-success btn-sm"
            >
              Tạo
            </button>
            <button
              onClick={() => {
                setShowNewProfileInput(false);
                setNewProfileName("");
              }}
              className="btn btn-secondary btn-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
