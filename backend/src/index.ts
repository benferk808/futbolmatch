/**
 * FUTBOLMATCH API - Cloudflare Worker
 * Backend serverless para gestión de partidos de fútbol
 */

interface Env {
  DB: D1Database;
}

interface Match {
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
}

interface Player {
  id: string;
  name: string;
  positionIndex: number;
}

// CORS headers para permitir requests desde el frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Manejo de preflight requests (OPTIONS)
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders,
  });
}

// Respuesta JSON con CORS
function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Manejo de CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    try {
      // Rutas de la API

      // POST /api/matches - Crear nuevo partido
      if (path === '/api/matches' && method === 'POST') {
        const body: any = await request.json();

        // Validaciones
        if (!body.type || !body.tactic || !body.fieldName || !body.location) {
          return jsonResponse({ error: 'Missing required fields' }, 400);
        }

        const matchId = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + body.durationDays * 24 * 60 * 60 * 1000).toISOString();

        // Insertar partido en la base de datos
        await env.DB.prepare(
          `INSERT INTO matches (
            id, type, tactic, duration_days, date, time,
            field_name, location, location_url, total_cost,
            extra_slots, created_at, expires_at, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            matchId,
            body.type,
            body.tactic,
            body.durationDays,
            body.date,
            body.time,
            body.fieldName,
            body.location,
            body.locationURL || null,
            body.totalCost,
            body.extraSlots || 0,
            createdAt,
            expiresAt,
            1
          )
          .run();

        return jsonResponse({
          id: matchId,
          message: 'Match created successfully',
        }, 201);
      }

      // GET /api/matches/:id - Obtener partido por ID
      if (path.startsWith('/api/matches/') && method === 'GET') {
        const matchId = path.split('/')[3];

        if (!matchId) {
          return jsonResponse({ error: 'Match ID required' }, 400);
        }

        // Obtener partido
        const match = await env.DB.prepare(
          'SELECT * FROM matches WHERE id = ? AND is_active = 1'
        )
          .bind(matchId)
          .first();

        if (!match) {
          return jsonResponse({ error: 'Match not found or expired' }, 404);
        }

        // Verificar si expiró
        const now = new Date();
        const expiresAt = new Date(match.expires_at as string);
        if (now > expiresAt) {
          // Marcar como inactivo
          await env.DB.prepare('UPDATE matches SET is_active = 0 WHERE id = ?')
            .bind(matchId)
            .run();
          return jsonResponse({ error: 'Match expired' }, 410);
        }

        // Obtener jugadores del partido
        const playersResult = await env.DB.prepare(
          'SELECT id, name, position_index as positionIndex FROM players WHERE match_id = ? ORDER BY joined_at ASC'
        )
          .bind(matchId)
          .all();

        const matchData: Match = {
          id: match.id as string,
          type: match.type as number,
          tactic: match.tactic as string,
          durationDays: match.duration_days as number,
          date: match.date as string,
          time: match.time as string,
          fieldName: match.field_name as string,
          location: match.location as string,
          locationURL: match.location_url as string | undefined,
          totalCost: match.total_cost as number,
          extraSlots: match.extra_slots as number,
          players: playersResult.results as Player[],
        };

        return jsonResponse(matchData);
      }

      // POST /api/matches/:id/players - Agregar jugador al partido
      if (path.match(/^\/api\/matches\/[^\/]+\/players$/) && method === 'POST') {
        const matchId = path.split('/')[3];
        const body: any = await request.json();

        if (!body.name || body.positionIndex === undefined) {
          return jsonResponse({ error: 'Name and positionIndex required' }, 400);
        }

        // Verificar que el partido existe y está activo
        const match = await env.DB.prepare(
          'SELECT id FROM matches WHERE id = ? AND is_active = 1'
        )
          .bind(matchId)
          .first();

        if (!match) {
          return jsonResponse({ error: 'Match not found' }, 404);
        }

        // Verificar que no haya otro jugador en esa posición
        const existingPlayer = await env.DB.prepare(
          'SELECT id FROM players WHERE match_id = ? AND position_index = ?'
        )
          .bind(matchId, body.positionIndex)
          .first();

        if (existingPlayer) {
          return jsonResponse({ error: 'Position already occupied' }, 409);
        }

        const playerId = crypto.randomUUID();
        const joinedAt = new Date().toISOString();

        // Insertar jugador
        await env.DB.prepare(
          'INSERT INTO players (id, match_id, name, position_index, joined_at) VALUES (?, ?, ?, ?, ?)'
        )
          .bind(playerId, matchId, body.name, body.positionIndex, joinedAt)
          .run();

        return jsonResponse({
          id: playerId,
          name: body.name,
          positionIndex: body.positionIndex,
          message: 'Player added successfully',
        }, 201);
      }

      // DELETE /api/matches/:matchId/players/:playerId - Eliminar jugador
      if (path.match(/^\/api\/matches\/[^\/]+\/players\/[^\/]+$/) && method === 'DELETE') {
        const parts = path.split('/');
        const matchId = parts[3];
        const playerId = parts[5];

        const result = await env.DB.prepare(
          'DELETE FROM players WHERE id = ? AND match_id = ?'
        )
          .bind(playerId, matchId)
          .run();

        if (result.meta.changes === 0) {
          return jsonResponse({ error: 'Player not found' }, 404);
        }

        return jsonResponse({ message: 'Player removed successfully' });
      }

      // PATCH /api/matches/:id/tactic - Cambiar táctica del partido
      if (path.match(/^\/api\/matches\/[^\/]+\/tactic$/) && method === 'PATCH') {
        const matchId = path.split('/')[3];
        const body: any = await request.json();

        if (!body.tactic) {
          return jsonResponse({ error: 'Tactic required' }, 400);
        }

        await env.DB.prepare('UPDATE matches SET tactic = ? WHERE id = ?')
          .bind(body.tactic, matchId)
          .run();

        return jsonResponse({ message: 'Tactic updated successfully' });
      }

      // PATCH /api/matches/:id/extra-slots - Actualizar slots extra
      if (path.match(/^\/api\/matches\/[^\/]+\/extra-slots$/) && method === 'PATCH') {
        const matchId = path.split('/')[3];
        const body: any = await request.json();

        if (body.extraSlots === undefined) {
          return jsonResponse({ error: 'extraSlots required' }, 400);
        }

        await env.DB.prepare('UPDATE matches SET extra_slots = ? WHERE id = ?')
          .bind(body.extraSlots, matchId)
          .run();

        return jsonResponse({ message: 'Extra slots updated successfully' });
      }

      // Ruta no encontrada
      return jsonResponse({ error: 'Not found' }, 404);

    } catch (error: any) {
      console.error('Error:', error);
      return jsonResponse({ error: 'Internal server error', details: error.message }, 500);
    }
  },
};
