/**
 * Supabase API Service - Backend real con Supabase
 * Este servicio reemplaza a mockApiService.ts en producción
 */

import { supabase } from '../lib/supabase';
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
  positionIndex: number | null;
  customX?: number;
  customY?: number;
}

// Generador de IDs únicos (para organizerId en sessionStorage)
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

/**
 * Crear un nuevo partido
 */
export async function createMatch(data: CreateMatchPayload): Promise<{ id: string; organizerId: string }> {
  if (!supabase) throw new Error('Supabase not configured');

  const organizerId = generateId();

  // Construir objeto sin valores undefined (Supabase no los acepta)
  const insertData: Record<string, unknown> = {
    type: data.type,
    tactic: data.tactic,
    duration_days: data.durationDays,
    date: data.date,
    time: data.time,
    field_name: data.fieldName,
    location: data.location,
    total_cost: data.totalCost,
    extra_slots: data.extraSlots ?? 0,
    mode: data.mode,
    organizer_id: organizerId,
    custom_positions: {},
  };

  // Solo agregar campos opcionales si tienen valor
  if (data.locationURL) insertData.location_url = data.locationURL;
  if (data.organizerName) insertData.organizer_name = data.organizerName;
  if (data.teamColor) insertData.team_color = data.teamColor;
  if (data.teamColorSecondary) insertData.team_color_secondary = data.teamColorSecondary;

  const { data: match, error } = await supabase
    .from('matches')
    .insert(insertData)
    .select('id')
    .single();

  if (error) throw error;

  // Guardar organizerId en sessionStorage
  sessionStorage.setItem(`organizer_${match.id}`, organizerId);

  return { id: match.id, organizerId };
}

/**
 * Obtener partido por ID
 */
export async function getMatch(matchId: string): Promise<Match> {
  if (!supabase) throw new Error('Supabase not configured');

  // Obtener partido
  const { data: matchData, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (matchError) throw matchError;

  // Obtener jugadores
  const { data: playersData, error: playersError } = await supabase
    .from('players')
    .select('*')
    .eq('match_id', matchId);

  if (playersError) throw playersError;

  // Convertir a formato de la app
  const match: Match = {
    id: matchData.id,
    type: matchData.type,
    tactic: matchData.tactic,
    durationDays: matchData.duration_days,
    date: matchData.date,
    time: matchData.time,
    fieldName: matchData.field_name,
    location: matchData.location,
    locationURL: matchData.location_url,
    totalCost: parseFloat(matchData.total_cost),
    extraSlots: matchData.extra_slots,
    organizerName: matchData.organizer_name,
    teamColor: matchData.team_color,
    teamColorSecondary: matchData.team_color_secondary,
    mode: matchData.mode as MatchMode,
    organizerId: matchData.organizer_id,
    customPositions: matchData.custom_positions || {},
    players: (playersData || []).map(p => ({
      id: p.id,
      name: p.name,
      positionIndex: p.position_index,
      customX: p.custom_x ? parseFloat(p.custom_x) : undefined,
      customY: p.custom_y ? parseFloat(p.custom_y) : undefined,
    })),
  };

  return match;
}

/**
 * Agregar jugador a un partido
 */
export async function addPlayer(matchId: string, data: AddPlayerPayload): Promise<Player> {
  if (!supabase) throw new Error('Supabase not configured');

  // Verificar posición no ocupada (si no es pendiente)
  if (data.positionIndex !== null) {
    const { data: existing } = await supabase
      .from('players')
      .select('id')
      .eq('match_id', matchId)
      .eq('position_index', data.positionIndex);

    if (existing && existing.length > 0) throw new Error('Position already occupied');
  }

  const { data: player, error } = await supabase
    .from('players')
    .insert({
      match_id: matchId,
      name: data.name,
      position_index: data.positionIndex,
      custom_x: data.customX,
      custom_y: data.customY,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: player.id,
    name: player.name,
    positionIndex: player.position_index,
    customX: player.custom_x ? parseFloat(player.custom_x) : undefined,
    customY: player.custom_y ? parseFloat(player.custom_y) : undefined,
  };
}

/**
 * Eliminar jugador de un partido
 */
export async function removePlayer(matchId: string, playerId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', playerId)
    .eq('match_id', matchId);

  if (error) throw error;
}

/**
 * Cambiar táctica del partido
 */
export async function changeTactic(matchId: string, tactic: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('matches')
    .update({ tactic })
    .eq('id', matchId);

  if (error) throw error;
}

/**
 * Actualizar slots extra del partido
 */
export async function updateExtraSlots(matchId: string, extraSlots: number): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('matches')
    .update({ extra_slots: extraSlots })
    .eq('id', matchId);

  if (error) throw error;
}

/**
 * Actualizar posición personalizada de un jugador
 */
export async function updatePlayerPosition(matchId: string, playerId: string, customX: number, customY: number): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('players')
    .update({ custom_x: customX, custom_y: customY })
    .eq('id', playerId)
    .eq('match_id', matchId);

  if (error) throw error;
}

/**
 * Actualizar posición personalizada de una posición de la táctica
 */
export async function updateTacticPosition(matchId: string, positionIndex: number, customX: number, customY: number): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  // Obtener posiciones actuales
  const { data: match, error: fetchError } = await supabase
    .from('matches')
    .select('custom_positions')
    .eq('id', matchId)
    .single();

  if (fetchError) throw fetchError;

  const customPositions = match.custom_positions || {};
  customPositions[positionIndex] = { x: customX, y: customY };

  const { error } = await supabase
    .from('matches')
    .update({ custom_positions: customPositions })
    .eq('id', matchId);

  if (error) throw error;
}

/**
 * Resetear todas las posiciones personalizadas de la táctica
 */
export async function resetCustomPositions(matchId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('matches')
    .update({ custom_positions: {} })
    .eq('id', matchId);

  if (error) throw error;
}

/**
 * Asignar posición a un jugador pendiente
 */
export async function assignPlayerPosition(matchId: string, playerId: string, positionIndex: number): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  // Verificar posición no ocupada
  const { data: existing } = await supabase
    .from('players')
    .select('id')
    .eq('match_id', matchId)
    .eq('position_index', positionIndex)
    .neq('id', playerId);

  if (existing && existing.length > 0) throw new Error('Position already occupied');

  const { error } = await supabase
    .from('players')
    .update({
      position_index: positionIndex,
      custom_x: null,
      custom_y: null,
    })
    .eq('id', playerId)
    .eq('match_id', matchId);

  if (error) throw error;
}

/**
 * Mover jugador de una posición a pendientes
 */
export async function unassignPlayerPosition(matchId: string, playerId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('players')
    .update({
      position_index: null,
      custom_x: null,
      custom_y: null,
    })
    .eq('id', playerId)
    .eq('match_id', matchId);

  if (error) throw error;
}

/**
 * Verificar si el usuario actual es el organizador del partido
 */
export function isOrganizer(matchId: string, match: Match): boolean {
  const storedOrganizerId = sessionStorage.getItem(`organizer_${matchId}`);
  return storedOrganizerId === match.organizerId;
}

/**
 * Suscribirse a cambios en tiempo real del partido
 */
export function subscribeToMatch(matchId: string, onUpdate: () => void) {
  if (!supabase) return null;

  const channel = supabase
    .channel(`match:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `id=eq.${matchId}`,
      },
      onUpdate
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `match_id=eq.${matchId}`,
      },
      onUpdate
    )
    .subscribe();

  return channel;
}

/**
 * Desuscribirse de cambios en tiempo real
 */
export function unsubscribeFromMatch(channel: ReturnType<typeof subscribeToMatch>) {
  if (channel && supabase) {
    supabase.removeChannel(channel);
  }
}
