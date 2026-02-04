# CLAUDE.md - FutbolMatch

> **LEER PRIMERO** al iniciar nueva sesion con Claude

## ESTADO ACTUAL

**URL Produccion:** https://futbolmatch.vercel.app/
**Estado:** EN PRODUCCION - FUNCIONANDO v1.6.0
**Fecha:** 4 Febrero 2026

---

## QUE ES FUTBOLMATCH

App web para organizar partidos de futbol amateur:
1. Organizador crea partido (elige formacion, colores, modo, rival)
2. Obtiene DOS links: uno privado (organizador) y uno publico (jugadores)
3. Comparte el link de jugadores por WhatsApp
4. Jugadores abren el link y se anotan en la lista
5. Organizador asigna posiciones (en modo tecnico)
6. Puede agregar suplentes al banco

---

## CUENTAS (TODAS PERSONALES - NO EMPRESA)

| Servicio | Usuario | Email |
|----------|---------|-------|
| GitHub | benferk808 | fnosieski@hotmail.com |
| Vercel | benferk808 | fnosieski@hotmail.com |
| Supabase | (via GitHub) | fnosieski@hotmail.com |

---

## STACK

- **Frontend:** React 19 + TypeScript + Vite
- **Estilos:** Tailwind CSS (CDN)
- **Backend:** Supabase (PostgreSQL)
- **Deploy:** Vercel (auto-deploy desde GitHub)
- **Repo:** https://github.com/benferk808/futbolmatch

---

## ARCHIVOS IMPORTANTES

| Archivo | Descripcion |
|---------|-------------|
| `CLAUDE.md` | Este archivo - contexto para Claude |
| `ESTADO-PRODUCCION.md` | Documentacion completa del estado actual |
| `App.tsx` | Router principal (hash-based + admin auth) |
| `types.ts` | Tipos TypeScript (Match, Player, etc.) |
| `components/MatchView.tsx` | Vista principal del partido |
| `components/MatchCreatedModal.tsx` | Modal con links organizador/jugador |
| `components/CreateMatchForm.tsx` | Formulario de creacion |
| `components/SoccerField.tsx` | Cancha con posiciones y banco |
| `components/PendingPlayersList.tsx` | Lista de jugadores pendientes |
| `context/LanguageContext.tsx` | Traducciones ES/EN (embebidas) |
| `services/api.ts` | Wrapper API (mock o supabase) |
| `services/supabaseApiService.ts` | Conexion real a Supabase |

---

## MODOS DE PARTIDO

### Modo Libre
- Cualquiera puede mover jugadores
- Cualquiera puede cambiar tactica
- Cualquiera puede agregar/quitar suplentes

### Modo Tecnico (Coach)
- Solo el organizador mueve jugadores
- Solo el organizador cambia tactica
- Solo el organizador agrega/quitar suplentes
- Jugadores solo pueden unirse a lista de pendientes

---

## SISTEMA DE DOS LINKS

Cuando se crea un partido, se generan DOS links:

1. **Link de Jugadores:** `https://futbolmatch.vercel.app/#/match/UUID`
   - Para compartir en WhatsApp
   - Solo permite unirse al partido

2. **Link de Organizador:** `https://futbolmatch.vercel.app/#/match/UUID?admin=TOKEN`
   - PRIVADO - no compartir
   - El parametro `?admin=TOKEN` identifica al organizador
   - El TOKEN coincide con `match.organizerId` en la BD

### Flujo de autenticacion:
1. Al crear partido, se muestra modal con ambos links
2. Organizador guarda su link privado
3. Cuando abre con `?admin=TOKEN`, la app valida el token
4. Si es valido, guarda en `sessionStorage` para la sesion
5. Si cierra el navegador, puede volver a abrir con su link

---

## FUNCIONALIDADES v1.6.0

### Crear Partido
- Nombre del organizador
- Tipo de partido (5, 7, 8, 11)
- Tactica/formacion
- Colores del equipo (primario + secundario)
- Modo: Libre o Tecnico
- Fecha y hora
- Nombre de la cancha
- Ubicacion + link Google Maps (opcional)
- Rival/oponente (opcional)
- Costo total

### Vista del Partido
- Cancha con posiciones segun tactica
- Jugadores en cancha (con posicion asignada)
- Lista de pendientes (sin posicion)
- Banco de suplentes (drag & drop)
- Costo por jugador (calculado automaticamente)
- Botones: Añadir/Quitar Suplente, Cambiar Tactica
- Descargar imagen PNG
- Compartir en WhatsApp

### Mensaje WhatsApp
Formato:
```
⚽ *¡Bienvenido a FUTBOLMATCH!* ⚽

📋 *Sumate a la lista de jugadores:*
[link]

📊 *Datos del partido:*
📅 *Fecha:* DD/MM/YYYY
⏰ *Hora:* HH:MM
🏟️ *Cancha:* Nombre
⚔️ *Rival:* Equipo (si existe)
📍 *Ubicación:* Direccion (si existe)
🗺️ *Google Maps:* link (si existe)
```

---

## BASE DE DATOS (Supabase)

**Project URL:** https://jllnkthnduwskdjlhjjm.supabase.co

### Tabla: matches
```sql
id UUID PRIMARY KEY
created_at TIMESTAMPTZ
type INTEGER              -- 5, 7, 8, 11
tactic TEXT               -- "1-3-2-2", etc
duration_days INTEGER
date DATE
time TIME
field_name TEXT
location TEXT
location_url TEXT         -- Link Google Maps
total_cost DECIMAL
extra_slots INTEGER       -- Banco de suplentes
organizer_name TEXT
opponent TEXT             -- Rival (opcional)
team_color TEXT           -- Color primario
team_color_secondary TEXT -- Color secundario
mode TEXT                 -- 'free' o 'coach'
organizer_id TEXT         -- ID unico del organizador
custom_positions JSONB    -- Posiciones personalizadas
```

### Tabla: players
```sql
id UUID PRIMARY KEY
match_id UUID             -- FK a matches
name TEXT
position_index INTEGER    -- NULL = pendiente (banco)
custom_x DECIMAL          -- Posicion X personalizada
custom_y DECIMAL          -- Posicion Y personalizada
created_at TIMESTAMPTZ
```

### RLS
Actualmente: **Permisivas (allow all)** - Para MVP

---

## DESARROLLO LOCAL

```bash
cd C:\Users\Usuario\Futbolmatch
npm install
npm run dev
# Abre http://localhost:3000
```

Sin `.env.local` → usa mock (localStorage)
Con `.env.local` → usa Supabase

### Variables de entorno (.env.local)
```
VITE_SUPABASE_URL=https://jllnkthnduwskdjlhjjm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## DEPLOY

Automatico via Vercel:
1. `git push` a GitHub
2. Vercel detecta y redeploya (~1 min)

---

## CONTEXTO DEL USUARIO

**Nombre:** Fernando
**Equipo:** Pinar del Este FC
**Liga:** Solymar Verano 2026 (Miercoles +30)
**Ubicacion:** Uruguay

El proyecto es HOBBIE/PERSONAL, NO de empresa.

---

## WARNINGS CONOCIDOS (ignorar)

- `cdn.tailwindcss.com should not be used in production` - Cosmetico, no afecta

---

## PROXIMAS MEJORAS SUGERIDAS

1. **Supabase Realtime** - Actualizaciones en vivo cuando alguien se une
2. **Notificaciones** - Avisar al organizador cuando alguien se une
3. **Historial de partidos** - Ver partidos anteriores
4. **Tailwind via PostCSS** - Eliminar warning de CDN
5. **Tests** - Agregar tests unitarios y e2e

---

*Ultima actualizacion: 4 Febrero 2026*
