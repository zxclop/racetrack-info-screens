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
  return new Promise((resolve, reject) => {
    const testSocket = io(SERVER_URL, {
      autoConnect: false,
      auth: { key, role },
    });

    const timeout = setTimeout(() => {
      testSocket.disconnect();
      reject(new Error('Connection timeout'));
    }, 5000);

    testSocket.on('connect', () => {
      clearTimeout(timeout);
      testSocket.disconnect();
      resolve(true);
    });

    testSocket.on('connect_error', err => {
      clearTimeout(timeout);
      testSocket.disconnect();
      const msg = (err.message ?? '').toLowerCase();
      if (
        msg.includes('auth') ||
        msg.includes('unauthorized') ||
        msg.includes('invalid')
      ) {
        resolve(false);
      } else {
        // Server is down or other network error — let user retry
        reject(new Error('Cannot connect to server'));
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

      try {
        const valid = await validateKey(role, key);

        if (valid) {
          storeKey(role, key);
          setAccessKey(key);
          setIsAuthenticated(true);
        } else {
          setError('Invalid access key. Please try again.');
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Connection failed. Please try again.'
        );
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
