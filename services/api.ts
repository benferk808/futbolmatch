/**
 * API Service - Selecciona automáticamente mock o supabase
 *
 * En desarrollo sin credenciales: usa mockApiService (localStorage)
 * En producción o con credenciales: usa supabaseApiService (Supabase)
 */

import { supabase } from '../lib/supabase';

// Importar ambos servicios
import * as mockApi from './mockApiService';
import * as supabaseApi from './supabaseApiService';

// Detectar qué servicio usar
const useSupabase = !!supabase;

console.log(`[API] Using ${useSupabase ? 'Supabase' : 'Mock'} API`);

// Exportar funciones del servicio activo
export const createMatch = useSupabase ? supabaseApi.createMatch : mockApi.createMatch;
export const getMatch = useSupabase ? supabaseApi.getMatch : mockApi.getMatch;
export const addPlayer = useSupabase ? supabaseApi.addPlayer : mockApi.addPlayer;
export const removePlayer = useSupabase ? supabaseApi.removePlayer : mockApi.removePlayer;
export const changeTactic = useSupabase ? supabaseApi.changeTactic : mockApi.changeTactic;
export const updateExtraSlots = useSupabase ? supabaseApi.updateExtraSlots : mockApi.updateExtraSlots;
export const updatePlayerPosition = useSupabase ? supabaseApi.updatePlayerPosition : mockApi.updatePlayerPosition;
export const updateTacticPosition = useSupabase ? supabaseApi.updateTacticPosition : mockApi.updateTacticPosition;
export const resetCustomPositions = useSupabase ? supabaseApi.resetCustomPositions : mockApi.resetCustomPositions;
export const assignPlayerPosition = useSupabase ? supabaseApi.assignPlayerPosition : mockApi.assignPlayerPosition;
export const unassignPlayerPosition = useSupabase ? supabaseApi.unassignPlayerPosition : mockApi.unassignPlayerPosition;
export const isOrganizer = useSupabase ? supabaseApi.isOrganizer : mockApi.isOrganizer;

// Funciones de Realtime (solo disponibles con Supabase)
export const subscribeToMatch = useSupabase ? supabaseApi.subscribeToMatch : () => null;
export const unsubscribeFromMatch = useSupabase ? supabaseApi.unsubscribeFromMatch : () => {};
