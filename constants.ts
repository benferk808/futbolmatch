
import type { TacticDetails } from './types';

// Positions are defined with x, y coordinates as percentages (0-100)
// x: 0 = left edge, 100 = right edge
// y: 0 = top edge (goal line), 100 = bottom edge (opposite goal line)
export const TACTICS: Record<number, Record<string, TacticDetails>> = {
  5: {
    '1-2-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 25, y: 35 }, { role: 'DF', x: 75, y: 35 },
      { role: 'FW', x: 25, y: 70 }, { role: 'FW', x: 75, y: 70 },
    ]},
    '1-1-2-1': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 50, y: 30 },
      { role: 'MF', x: 25, y: 60 }, { role: 'MF', x: 75, y: 60 },
      { role: 'FW', x: 50, y: 85 },
    ]},
  },
  6: {
    '1-2-2-1': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 30, y: 30 }, { role: 'DF', x: 70, y: 30 },
      { role: 'MF', x: 30, y: 60 }, { role: 'MF', x: 70, y: 60 },
      { role: 'FW', x: 50, y: 85 },
    ]},
    '1-2-1-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 30, y: 30 }, { role: 'DF', x: 70, y: 30 },
      { role: 'MF', x: 50, y: 55 },
      { role: 'FW', x: 35, y: 80 }, { role: 'FW', x: 65, y: 80 },
    ]},
    '1-3-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 20, y: 30 }, { role: 'DF', x: 50, y: 28 }, { role: 'DF', x: 80, y: 30 },
      { role: 'FW', x: 35, y: 75 }, { role: 'FW', x: 65, y: 75 },
    ]},
  },
  7: {
    '1-2-3-1': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 30, y: 28 }, { role: 'DF', x: 70, y: 28 },
      { role: 'MF', x: 20, y: 55 }, { role: 'MF', x: 50, y: 50 }, { role: 'MF', x: 80, y: 55 },
      { role: 'FW', x: 50, y: 85 },
    ]},
    '1-3-2-1': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 20, y: 30 }, { role: 'DF', x: 50, y: 25 }, { role: 'DF', x: 80, y: 30 },
      { role: 'MF', x: 35, y: 55 }, { role: 'MF', x: 65, y: 55 },
      { role: 'FW', x: 50, y: 85 },
    ]},
    '1-3-1-2': { positions: [
        { role: 'GK', x: 50, y: 8 },
        { role: 'DF', x: 20, y: 30 }, { role: 'DF', x: 50, y: 25 }, { role: 'DF', x: 80, y: 30 },
        { role: 'MF', x: 50, y: 55 },
        { role: 'FW', x: 35, y: 80 }, { role: 'FW', x: 65, y: 80 },
    ]},
  },
  8: {
    '1-3-2-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 20, y: 30 }, { role: 'DF', x: 50, y: 25 }, { role: 'DF', x: 80, y: 30 },
      { role: 'MF', x: 35, y: 55 }, { role: 'MF', x: 65, y: 55 },
      { role: 'FW', x: 35, y: 80 }, { role: 'FW', x: 65, y: 80 },
    ]},
    '1-3-3-1': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 20, y: 30 }, { role: 'DF', x: 50, y: 25 }, { role: 'DF', x: 80, y: 30 },
      { role: 'MF', x: 25, y: 60 }, { role: 'MF', x: 50, y: 55 }, { role: 'MF', x: 75, y: 60 },
      { role: 'FW', x: 50, y: 85 },
    ]},
    '1-2-3-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 35, y: 25 }, { role: 'DF', x: 65, y: 25 },
      { role: 'MF', x: 25, y: 55 }, { role: 'MF', x: 50, y: 50 }, { role: 'MF', x: 75, y: 55 },
      { role: 'FW', x: 35, y: 80 }, { role: 'FW', x: 65, y: 80 },
    ]},
  },
  9: {
    '1-3-3-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 20, y: 28 }, { role: 'DF', x: 50, y: 25 }, { role: 'DF', x: 80, y: 28 },
      { role: 'MF', x: 25, y: 55 }, { role: 'MF', x: 50, y: 52 }, { role: 'MF', x: 75, y: 55 },
      { role: 'FW', x: 40, y: 80 }, { role: 'FW', x: 60, y: 80 },
    ]},
    '1-4-2-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 15, y: 30 }, { role: 'DF', x: 40, y: 28 }, { role: 'DF', x: 60, y: 28 }, { role: 'DF', x: 85, y: 30 },
      { role: 'MF', x: 35, y: 55 }, { role: 'MF', x: 65, y: 55 },
      { role: 'FW', x: 40, y: 80 }, { role: 'FW', x: 60, y: 80 },
    ]},
    '1-3-4-1': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 25, y: 28 }, { role: 'DF', x: 50, y: 25 }, { role: 'DF', x: 75, y: 28 },
      { role: 'MF', x: 15, y: 55 }, { role: 'MF', x: 40, y: 52 }, { role: 'MF', x: 60, y: 52 }, { role: 'MF', x: 85, y: 55 },
      { role: 'FW', x: 50, y: 85 },
    ]},
  },
  10: {
    '1-4-3-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 15, y: 30 }, { role: 'DF', x: 40, y: 28 }, { role: 'DF', x: 60, y: 28 }, { role: 'DF', x: 85, y: 30 },
      { role: 'MF', x: 25, y: 55 }, { role: 'MF', x: 50, y: 52 }, { role: 'MF', x: 75, y: 55 },
      { role: 'FW', x: 40, y: 80 }, { role: 'FW', x: 60, y: 80 },
    ]},
    '1-3-4-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 25, y: 28 }, { role: 'DF', x: 50, y: 25 }, { role: 'DF', x: 75, y: 28 },
      { role: 'MF', x: 15, y: 55 }, { role: 'MF', x: 40, y: 52 }, { role: 'MF', x: 60, y: 52 }, { role: 'MF', x: 85, y: 55 },
      { role: 'FW', x: 40, y: 80 }, { role: 'FW', x: 60, y: 80 },
    ]},
    '1-4-4-1': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 15, y: 30 }, { role: 'DF', x: 40, y: 28 }, { role: 'DF', x: 60, y: 28 }, { role: 'DF', x: 85, y: 30 },
      { role: 'MF', x: 15, y: 55 }, { role: 'MF', x: 40, y: 52 }, { role: 'MF', x: 60, y: 52 }, { role: 'MF', x: 85, y: 55 },
      { role: 'FW', x: 50, y: 85 },
    ]},
  },
  11: {
    '1-4-4-2': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 15, y: 30 }, { role: 'DF', x: 40, y: 28 }, { role: 'DF', x: 60, y: 28 }, { role: 'DF', x: 85, y: 30 },
      { role: 'MF', x: 15, y: 55 }, { role: 'MF', x: 40, y: 52 }, { role: 'MF', x: 60, y: 52 }, { role: 'MF', x: 85, y: 55 },
      { role: 'FW', x: 40, y: 80 }, { role: 'FW', x: 60, y: 80 },
    ]},
    '1-4-3-3': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 15, y: 30 }, { role: 'DF', x: 40, y: 28 }, { role: 'DF', x: 60, y: 28 }, { role: 'DF', x: 85, y: 30 },
      { role: 'MF', x: 25, y: 55 }, { role: 'MF', x: 50, y: 50 }, { role: 'MF', x: 75, y: 55 },
      { role: 'FW', x: 20, y: 80 }, { role: 'FW', x: 50, y: 85 }, { role: 'FW', x: 80, y: 80 },
    ]},
    '1-3-4-3': { positions: [
      { role: 'GK', x: 50, y: 8 },
      { role: 'DF', x: 25, y: 28 }, { role: 'DF', x: 50, y: 25 }, { role: 'DF', x: 75, y: 28 },
      { role: 'MF', x: 15, y: 55 }, { role: 'MF', x: 40, y: 52 }, { role: 'MF', x: 60, y: 52 }, { role: 'MF', x: 85, y: 55 },
      { role: 'FW', x: 20, y: 80 }, { role: 'FW', x: 50, y: 85 }, { role: 'FW', x: 80, y: 80 },
    ]},
  },
};

export const DEFAULT_TACTICS: Record<number, string> = {
  5: '1-2-2',
  6: '1-2-2-1',
  7: '1-3-2-1',
  8: '1-3-2-2',
  9: '1-3-3-2',
  10: '1-4-3-2',
  11: '1-4-4-2',
};

export const MATCH_TYPES = [5, 6, 7, 8, 9, 10, 11];
export const DURATION_OPTIONS = [7, 15, 30];