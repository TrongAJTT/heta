import { useState, useEffect, useCallback } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";

/**
 * Custom hook for managing localStorage with auto-sync
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {[any, function, boolean]} - [value, setValue, loading]
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        const stored = await getFromStorage(key);
        if (stored !== null && stored !== undefined) {
          setValue(stored);
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
      } finally {
        setLoading(false);
      }
    };
    loadValue();
  }, [key]);

  // Save value to storage
  const updateValue = useCallback(
    async (newValue) => {
      try {
        const valueToStore =
          typeof newValue === "function" ? newValue(value) : newValue;
        setValue(valueToStore);
        await saveToStorage(key, valueToStore);
      } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
      }
    },
    [key, value]
  );

  return [value, updateValue, loading];
};
