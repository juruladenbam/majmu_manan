import { useState, useEffect, useCallback } from 'react';

// A simple hook to manage state in local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch a custom event so other components using this hook update
        window.dispatchEvent(new CustomEvent('local-storage-update', { detail: { key } }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: Event) => {
      if ((event as CustomEvent).detail?.key === key) {
        setStoredValue(readValue());
      }
    };

    const handleNativeStorageChange = (event: StorageEvent) => {
      if (event.key === key || event.key === null) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener('local-storage-update', handleStorageChange);
    window.addEventListener('storage', handleNativeStorageChange);

    return () => {
      window.removeEventListener('local-storage-update', handleStorageChange);
      window.removeEventListener('storage', handleNativeStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue] as const;
}
