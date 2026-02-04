-- FUTBOLMATCH Database Schema
-- SQLite database for Cloudflare D1

-- Tabla de partidos
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  type INTEGER NOT NULL,
  tactic TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  field_name TEXT NOT NULL,
  location TEXT NOT NULL,
  location_url TEXT,
  total_cost REAL NOT NULL,
  extra_slots INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1
);

-- Tabla de jugadores
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  name TEXT NOT NULL,
  position_index INTEGER NOT NULL,
  joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_matches_expires_at ON matches(expires_at);
CREATE INDEX IF NOT EXISTS idx_matches_is_active ON matches(is_active);
CREATE INDEX IF NOT EXISTS idx_players_match_id ON players(match_id);
