import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAllInstances,
  saveInstance,
  deleteInstance,
  saveCurrentTabsToInstance,
  openInstanceTabs,
  createNewInstance,
  initializeInstanceSystem,
} from "../utils/instanceManager";
import {
  normalizeInstance,
  getMostRecentlySaved,
  getMostRecentlyOpened,
} from "../models/instanceModel";

/**
 * Custom hook for managing instances
 * @returns {object} Instance management functions and state
 */
export const useInstances = () => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Computed: most recently saved instance
  const mostRecentSaved = useMemo(() => {
    return getMostRecentlySaved(instances);
  }, [instances]);

  // Computed: most recently opened instance
  const mostRecentOpened = useMemo(() => {
    return getMostRecentlyOpened(instances);
  }, [instances]);

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
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error deleting instance:", err);
        setError(err.message);
        return false;
      }
    },
    [loadInstances]
  );

  // Save current tabs to instance
  const saveTabsTo = useCallback(
    async (instanceId) => {
      try {
        setError(null);
        const result = await saveCurrentTabsToInstance(instanceId);
        if (result.success) {
          await loadInstances();
        }
        return result;
      } catch (err) {
        console.error("Error saving tabs to instance:", err);
        setError(err.message);
        return { success: false, message: err.message };
      }
    },
    [loadInstances]
  );

  // Open instance tabs
  const openTabs = useCallback(
    async (instanceId, append = false) => {
      try {
        setError(null);
        const result = await openInstanceTabs(instanceId, append);
        if (result.success) {
          await loadInstances();
        }
        return result;
      } catch (err) {
        console.error("Error opening instance tabs:", err);
        setError(err.message);
        return { success: false, message: err.message };
      }
    },
    [loadInstances]
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

  // Get instance by ID
  const getInstance = useCallback(
    (instanceId) => {
      return instances.find((i) => i.id === instanceId);
    },
    [instances]
  );

  // Initialize
  const initialize = useCallback(async () => {
    try {
      setError(null);
      await initializeInstanceSystem();
      await loadInstances();
      return true;
    } catch (err) {
      console.error("Error initializing instances:", err);
      setError(err.message);
      return false;
    }
  }, [loadInstances]);

  // Initial load
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
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
    getInstance,
    initialize,
  };
};

export default useInstances;
