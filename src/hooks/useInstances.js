import { useState, useEffect, useCallback } from "react";
import {
  getAllInstances,
  saveInstance,
  deleteInstance,
  getCurrentInstanceId,
  setCurrentInstanceId,
  saveCurrentTabsToInstance,
  switchToInstance,
  createNewInstance,
  initializeInstanceSystem,
} from "../utils/instanceManager";
import { normalizeInstance } from "../models/instanceModel";

/**
 * Custom hook for managing instances
 * @returns {object} Instance management functions and state
 */
export const useInstances = () => {
  const [instances, setInstances] = useState([]);
  const [currentInstanceId, setCurrentInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load instances
  const loadInstances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allInstances = await getAllInstances();
      const normalized = allInstances.map((i) => normalizeInstance(i));
      setInstances(normalized);
    } catch (err) {
      console.error("Error loading instances:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load current instance ID
  const loadCurrentInstanceId = useCallback(async () => {
    try {
      const currentId = await getCurrentInstanceId();
      setCurrentInstance(currentId);
    } catch (err) {
      console.error("Error loading current instance ID:", err);
    }
  }, []);

  // Save instance
  const save = useCallback(
    async (instance) => {
      try {
        setError(null);
        const success = await saveInstance(instance);
        if (success) {
          await loadInstances();
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error saving instance:", err);
        setError(err.message);
        return false;
      }
    },
    [loadInstances]
  );

  // Delete instance
  const remove = useCallback(
    async (instanceId) => {
      try {
        setError(null);
        const success = await deleteInstance(instanceId);
        if (success) {
          await loadInstances();
          await loadCurrentInstanceId();
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error deleting instance:", err);
        setError(err.message);
        return false;
      }
    },
    [loadInstances, loadCurrentInstanceId]
  );

  // Switch to instance
  const switchTo = useCallback(
    async (instanceId) => {
      try {
        setError(null);
        const result = await switchToInstance(instanceId);
        if (result.success) {
          await loadCurrentInstanceId();
          await loadInstances();
        }
        return result;
      } catch (err) {
        console.error("Error switching instance:", err);
        setError(err.message);
        return { success: false, message: err.message };
      }
    },
    [loadInstances, loadCurrentInstanceId]
  );

  // Create new instance
  const create = useCallback(
    async (options, withCurrentTabs = false) => {
      try {
        setError(null);
        const newInstance = await createNewInstance(options, withCurrentTabs);
        await loadInstances();
        return newInstance;
      } catch (err) {
        console.error("Error creating instance:", err);
        setError(err.message);
        throw err;
      }
    },
    [loadInstances]
  );

  // Save current tabs to current instance
  const saveCurrentTabs = useCallback(async () => {
    try {
      if (!currentInstanceId) {
        throw new Error("No current instance set");
      }
      setError(null);
      const success = await saveCurrentTabsToInstance(currentInstanceId);
      if (success) {
        await loadInstances();
      }
      return success;
    } catch (err) {
      console.error("Error saving current tabs:", err);
      setError(err.message);
      return false;
    }
  }, [currentInstanceId, loadInstances]);

  // Set current instance
  const setCurrent = useCallback(async (instanceId) => {
    try {
      setError(null);
      await setCurrentInstanceId(instanceId);
      setCurrentInstance(instanceId);
      return true;
    } catch (err) {
      console.error("Error setting current instance:", err);
      setError(err.message);
      return false;
    }
  }, []);

  // Get instance by ID
  const getInstance = useCallback(
    (instanceId) => {
      return instances.find((i) => i.id === instanceId);
    },
    [instances]
  );

  // Get current instance object
  const getCurrentInstance = useCallback(() => {
    return getInstance(currentInstanceId);
  }, [currentInstanceId, getInstance]);

  // Initialize
  const initialize = useCallback(async () => {
    try {
      setError(null);
      await initializeInstanceSystem();
      await loadInstances();
      await loadCurrentInstanceId();
      return true;
    } catch (err) {
      console.error("Error initializing instances:", err);
      setError(err.message);
      return false;
    }
  }, [loadInstances, loadCurrentInstanceId]);

  // Initial load
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    instances,
    currentInstanceId,
    loading,
    error,
    loadInstances,
    save,
    remove,
    switchTo,
    create,
    saveCurrentTabs,
    setCurrent,
    getInstance,
    getCurrentInstance,
    initialize,
  };
};

export default useInstances;
