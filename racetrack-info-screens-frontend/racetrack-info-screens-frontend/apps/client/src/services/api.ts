import type { RaceSession, NewSessionData } from '../types/types';

const API_URL = '';

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const key = sessionStorage.getItem('racetrack_key_receptionist');
  if (key) {
    headers['Authorization'] = `Bearer ${key}`;
  }
  return headers;
}

export async function getSessions(): Promise<RaceSession[]> {
  try {
    const response = await fetch(`${API_URL}/race-sessions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function createSession(
  session: NewSessionData
): Promise<RaceSession> {
  const response = await fetch(`${API_URL}/race-sessions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(session),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || 'Failed to create session');
  }
  const data = await response.json();
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/race-sessions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete session');
  }
}

export async function updateSession(
  id: string,
  updates: Partial<NewSessionData>
) {
  const response = await fetch(`${API_URL}/race-sessions/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await response.json();
  return data;
}
