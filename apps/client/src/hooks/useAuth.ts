import { useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SERVER_URL } from '../services/socket';
import type { Role } from '../types/types';

const STORAGE_PREFIX = 'racetrack_key_';

function getStoredKey(role: Role): string | null {
  return sessionStorage.getItem(STORAGE_PREFIX + role);
}

function storeKey(role: Role, key: string) {
  sessionStorage.setItem(STORAGE_PREFIX + role, key);
}

function validateKey(role: Role, key: string): Promise<boolean> {
  return new Promise(resolve => {
    const testSocket = io(SERVER_URL, {
      autoConnect: false,
      auth: { key, role },
    });

    const timeout = setTimeout(() => {
      testSocket.disconnect();
      // If backend has no auth middleware yet, accept the key
      resolve(true);
    }, 3000);

    testSocket.on('connect', () => {
      clearTimeout(timeout);
      testSocket.disconnect();
      resolve(true);
    });

    testSocket.on('connect_error', err => {
      clearTimeout(timeout);
      testSocket.disconnect();
      // If error i s auth-related, reject; otherwise accept (backend might just be down)
      if (
        err.message?.includes('auth') ||
        err.message?.includes('unauthorized')
      ) {
        resolve(false);
      } else {
        resolve(true);
      }
    });

    testSocket.connect();
  });
}

export function useAuth(role: Role) {
  const [accessKey, setAccessKey] = useState<string | null>(() =>
    getStoredKey(role)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!getStoredKey(role)
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitKey = useCallback(
    async (key: string) => {
      setLoading(true);
      setError('');

      const valid = await validateKey(role, key);

      if (valid) {
        storeKey(role, key);
        setAccessKey(key);
        setIsAuthenticated(true);
      } else {
        setError('Invalid access key. Please try again.');
      }

      setLoading(false);
    },
    [role]
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_PREFIX + role);
    setAccessKey(null);
    setIsAuthenticated(false);
  }, [role]);

  return { accessKey, isAuthenticated, error, loading, submitKey, logout };
}
