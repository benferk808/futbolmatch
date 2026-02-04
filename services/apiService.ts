/**
 * API Service - Conecta el frontend con el backend de Cloudflare Workers
 */

import type { Match, Player } from '../types';

// URL base de la API
// En desarrollo local: http://localhost:8787
// En producción: https://futbolmatch-api.tu-cuenta.workers.dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

interface CreateMatchPayload {
  type: number;
  tactic: string;
  durationDays: number;
  date: string;
  time: string;
  fieldName: string;
  location: string;
  locationURL?: string;
  totalCost: number;
  extraSlots?: number;
}

interface AddPlayerPayload {
  name: string;
  positionIndex: number;
}

/**
 * Crear un nuevo partido
 */
export async function createMatch(data: CreateMatchPayload): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE_URL}/api/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create match');
  }

  return response.json();
}

/**
 * Obtener partido por ID
 */
export async function getMatch(matchId: string): Promise<Match> {
  const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch match');
  }

  return response.json();
}

/**
 * Agregar jugador a un partido
 */
export async function addPlayer(matchId: string, data: AddPlayerPayload): Promise<Player> {
  const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}/players`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add player');
  }

  return response.json();
}

/**
 * Eliminar jugador de un partido
 */
export async function removePlayer(matchId: string, playerId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}/players/${playerId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove player');
  }
}

/**
 * Cambiar táctica del partido
 */
export async function changeTactic(matchId: string, tactic: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}/tactic`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tactic }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to change tactic');
  }
}

/**
 * Actualizar slots extra del partido
 */
export async function updateExtraSlots(matchId: string, extraSlots: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}/extra-slots`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ extraSlots }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update extra slots');
  }
}
