
export interface Player {
  id: string;
  name: string;
  positionIndex: number | null; // null = jugador pendiente (sin posición asignada)
  customX?: number; // Custom X position (percentage)
  customY?: number; // Custom Y position (percentage)
}

export interface Position {
  role: 'GK' | 'DF' | 'MF' | 'FW';
  x: number; // percentage from left
  y: number; // percentage from top
}

export type MatchMode = 'free' | 'coach';

export interface Match {
  id: string;
  type: number;
  tactic: string;
  durationDays: number;
  date: string;
  time: string;
  fieldName: string;
  location: string;
  locationURL?: string;
  totalCost: number;
  players: Player[];
  extraSlots: number;
  organizerName?: string;
  customPositions?: Record<number, { x: number; y: number }>; // positionIndex -> {x, y}
  teamColor?: string; // Color principal del equipo (hex)
  teamColorSecondary?: string; // Color secundario del equipo (hex) - para borde/número
  mode: MatchMode; // 'free' = cualquiera puede editar, 'coach' = solo organizador puede editar posiciones
  organizerId?: string; // ID del organizador (para modo coach)
}

export interface TacticDetails {
  positions: Position[];
}