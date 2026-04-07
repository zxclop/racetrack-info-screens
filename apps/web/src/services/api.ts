import type { RaceSession } from '../types/types';

const API_URL = '';

export async function getSessions(): Promise<RaceSession[]> {
  try {
    const response = await fetch(`${API_URL}/race-sessions`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}
