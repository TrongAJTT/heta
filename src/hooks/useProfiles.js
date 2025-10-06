import { useState, useEffect, useCallback } from "react";
import {
  getAllProfiles,
  saveProfile,
  deleteProfile,
  getActiveProfileId,
  setActiveProfileId,
} from "../utils/storage";
import { normalizeProfile } from "../models/profileModel";

/**
 * Custom hook for managing profiles
 * @returns {object} Profile management functions and state
 */
export const useProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load profiles
  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allProfiles = await getAllProfiles();
      const normalized = (allProfiles || []).map((p) => normalizeProfile(p));
      setProfiles(normalized);
    } catch (err) {
      console.error("Error loading profiles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load active profile
  const loadActiveProfile = useCallback(async () => {
    try {
      const activeId = await getActiveProfileId();
      setActiveProfile(activeId);
    } catch (err) {
      console.error("Error loading active profile:", err);
    }
  }, []);

  // Save profile
  const save = useCallback(
    async (profile) => {
      try {
        setError(null);
        await saveProfile(profile);
        await loadProfiles();
        return true;
      } catch (err) {
        console.error("Error saving profile:", err);
        setError(err.message);
        return false;
      }
    },
    [loadProfiles]
  );

  // Delete profile
  const remove = useCallback(
    async (profileId) => {
      try {
        setError(null);
        await deleteProfile(profileId);
        if (activeProfileId === profileId) {
          await setActiveProfileId(null);
          setActiveProfile(null);
        }
        await loadProfiles();
        return true;
      } catch (err) {
        console.error("Error deleting profile:", err);
        setError(err.message);
        return false;
      }
    },
    [activeProfileId, loadProfiles]
  );

  // Set active profile
  const setActive = useCallback(async (profileId) => {
    try {
      setError(null);
      await setActiveProfileId(profileId);
      setActiveProfile(profileId);
      return true;
    } catch (err) {
      console.error("Error setting active profile:", err);
      setError(err.message);
      return false;
    }
  }, []);

  // Get profile by ID
  const getProfile = useCallback(
    (profileId) => {
      return profiles.find((p) => p.id === profileId);
    },
    [profiles]
  );

  // Initial load
  useEffect(() => {
    loadProfiles();
    loadActiveProfile();
  }, [loadProfiles, loadActiveProfile]);

  return {
    profiles,
    activeProfileId,
    loading,
    error,
    loadProfiles,
    save,
    remove,
    setActive,
    getProfile,
  };
};
