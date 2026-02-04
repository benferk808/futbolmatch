/**
 * Mock API Service - Simula el backend para testing sin Cloudflare Workers
 * Este servicio usa localStorage para persistir los datos
 */

import type { Match, Player, MatchMode } from '../types';

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
  organizerName?: string;
  teamColor?: string;
  teamColorSecondary?: string;
  mode: MatchMode;
}

interface AddPlayerPayload {
  name: string;
  positionIndex: number | null; // null = jugador pendiente
  customX?: number;
  customY?: number;
}

// Generador de IDs únicos
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Clave para localStorage
const STORAGE_KEY = 'futbolmatch_data';

// Helper para obtener datos del storage
function getStorage(): Record<string, Match> {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Helper para guardar datos en storage
function setStorage(data: Record<string, Match>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Crear un nuevo partido
 */
export async function createMatch(data: CreateMatchPayload): Promise<{ id: string; organizerId: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = generateId();
      const organizerId = generateId(); // ID único del organizador (simula sesión)
      const matches = getStorage();

      const newMatch: Match = {
        id,
        type: data.type,
        tactic: data.tactic,
        durationDays: data.durationDays,
        date: data.date,
        time: data.time,
        fieldName: data.fieldName,
        location: data.location,
        locationURL: data.locationURL,
        totalCost: data.totalCost,
        players: [],
        extraSlots: data.extraSlots || 0,
        organizerName: data.organizerName,
        customPositions: {},
        teamColor: data.teamColor,
        teamColorSecondary: data.teamColorSecondary,
        mode: data.mode,
        organizerId,
      };

      matches[id] = newMatch;
      setStorage(matches);

      // Guardar el organizerId en sessionStorage para saber si este usuario es el organizador
      sessionStorage.setItem(`organizer_${id}`, organizerId);

      resolve({ id, organizerId });
    }, 300); // Simula latencia de red
  });
}

/**
 * Obtener partido por ID
 */
export async function getMatch(matchId: string): Promise<Match> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      resolve(match);
    }, 200);
  });
}

/**
 * Agregar jugador a un partido
 */
export async function addPlayer(matchId: string, data: AddPlayerPayload): Promise<Player> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      // Verificar que la posición no esté ocupada (solo si no es jugador pendiente)
      if (data.positionIndex !== null) {
        const positionOccupied = match.players.some(p => p.positionIndex === data.positionIndex);
        if (positionOccupied) {
          reject(new Error('Position already occupied'));
          return;
        }
      }

      const newPlayer: Player = {
        id: generateId(),
        name: data.name,
        positionIndex: data.positionIndex,
        customX: data.customX,
        customY: data.customY,
      };

      match.players.push(newPlayer);
      matches[matchId] = match;
      setStorage(matches);

      resolve(newPlayer);
    }, 300);
  });
}

/**
 * Eliminar jugador de un partido
 */
export async function removePlayer(matchId: string, playerId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      match.players = match.players.filter(p => p.id !== playerId);
      matches[matchId] = match;
      setStorage(matches);

      resolve();
    }, 200);
  });
}

/**
 * Cambiar táctica del partido
 */
export async function changeTactic(matchId: string, tactic: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      match.tactic = tactic;
      matches[matchId] = match;
      setStorage(matches);

      resolve();
    }, 200);
  });
}

/**
 * Actualizar slots extra del partido
 */
export async function updateExtraSlots(matchId: string, extraSlots: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      match.extraSlots = extraSlots;
      matches[matchId] = match;
      setStorage(matches);

      resolve();
    }, 200);
  });
}

/**
 * Actualizar posición personalizada de un jugador
 */
export async function updatePlayerPosition(matchId: string, playerId: string, customX: number, customY: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      const playerIndex = match.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) {
        reject(new Error('Player not found'));
        return;
      }

      match.players[playerIndex].customX = customX;
      match.players[playerIndex].customY = customY;
      matches[matchId] = match;
      setStorage(matches);

      resolve();
    }, 200);
  });
}

/**
 * Actualizar posición personalizada de una posición de la táctica (sin jugador asignado)
 */
export async function updateTacticPosition(matchId: string, positionIndex: number, customX: number, customY: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      if (!match.customPositions) {
        match.customPositions = {};
      }

      match.customPositions[positionIndex] = { x: customX, y: customY };
      matches[matchId] = match;
      setStorage(matches);

      resolve();
    }, 200);
  });
}

/**
 * Resetear todas las posiciones personalizadas de la táctica
 */
export async function resetCustomPositions(matchId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      match.customPositions = {};
      matches[matchId] = match;
      setStorage(matches);

      resolve();
    }, 200);
  });
}

/**
 * Asignar posición a un jugador pendiente
 */
export async function assignPlayerPosition(matchId: string, playerId: string, positionIndex: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      const playerIndex = match.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) {
        reject(new Error('Player not found'));
        return;
      }

      // Verificar que la posición no esté ocupada
      const positionOccupied = match.players.some(p => p.positionIndex === positionIndex && p.id !== playerId);
      if (positionOccupied) {
        reject(new Error('Position already occupied'));
        return;
      }

      match.players[playerIndex].positionIndex = positionIndex;
      match.players[playerIndex].customX = undefined;
      match.players[playerIndex].customY = undefined;
      matches[matchId] = match;
      setStorage(matches);

      resolve();
    }, 200);
  });
}

/**
 * Mover jugador de una posición a pendientes (quitar de cancha)
 */
export async function unassignPlayerPosition(matchId: string, playerId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matches = getStorage();
      const match = matches[matchId];

      if (!match) {
        reject(new Error('Match not found'));
        return;
      }

      const playerIndex = match.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) {
        reject(new Error('Player not found'));
        return;
      }

      match.players[playerIndex].positionIndex = null;
      match.players[playerIndex].customX = undefined;
      match.players[playerIndex].customY = undefined;
      matches[matchId] = match;
      setStorage(matches);

      resolve();
    }, 200);
  });
}

/**
 * Verificar si el usuario actual es el organizador del partido
 */
export function isOrganizer(matchId: string, match: Match): boolean {
  const storedOrganizerId = sessionStorage.getItem(`organizer_${matchId}`);
  return storedOrganizerId === match.organizerId;
}
