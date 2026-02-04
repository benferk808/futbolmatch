# ESTADO DE PRODUCCION - FutbolMatch

> **Fecha:** 4 Febrero 2026
> **Version:** 1.4.0 (en produccion)
> **URL:** https://futbolmatch.vercel.app/

---

## RESUMEN EJECUTIVO

FutbolMatch es una app para organizar partidos de futbol amateur. El organizador crea un partido, comparte el link por WhatsApp, y los jugadores se anotan solos.

**ESTA EN PRODUCCION Y FUNCIONANDO.**

---

## CUENTAS Y SERVICIOS

| Servicio | URL | Usuario |
|----------|-----|---------|
| **GitHub** | https://github.com/benferk808/futbolmatch | benferk808 |
| **Vercel** | https://vercel.com/benferk808s-projects/futbolmatch | benferk808 |
| **Supabase** | https://supabase.com/dashboard/project/jllnkthnduwskdjlhjjm | via GitHub |

**Email:** fnosieski@hotmail.com (cuenta personal, NO empresa)

---

## ARQUITECTURA

```
Usuario                App (Vercel)              Supabase
  |                        |                        |
  |-- Crear partido ------>|                        |
  |                        |-- INSERT match ------->|
  |                        |<-- match.id -----------|
  |<-- URL con #/match/id -|                        |
  |                        |                        |
  |-- Compartir link ----->| (WhatsApp)             |
  |                        |                        |
Jugador                    |                        |
  |-- Abrir link --------->|                        |
  |                        |-- SELECT match ------->|
  |                        |<-- match data ---------|
  |<-- Ver partido --------|                        |
  |                        |                        |
  |-- Unirse ------------->|                        |
  |                        |-- INSERT player ------>|
  |                        |<-- player.id ----------|
  |<-- Confirmacion -------|                        |
```

---

## STACK TECNOLOGICO

| Capa | Tecnologia | Notas |
|------|------------|-------|
| Frontend | React 19 + TypeScript + Vite | SPA con hash routing |
| Estilos | Tailwind CSS (CDN) | Warning en consola, no afecta |
| Backend | Supabase | PostgreSQL + REST API |
| Realtime | Supabase Realtime | Configurado, listo para usar |
| Deploy | Vercel | Auto-deploy desde GitHub |
| Repo | GitHub | https://github.com/benferk808/futbolmatch |

---

## FUNCIONALIDADES IMPLEMENTADAS

### Crear Partido
- Seleccionar tipo (5, 7, 8, 11 jugadores)
- Elegir tactica/formacion
- Colores de equipo personalizables (primario + secundario)
- Modo Libre o Modo Tecnico
- Fecha, hora, ubicacion, costo

### Modo Libre vs Modo Tecnico
| Accion | Modo Libre | Modo Tecnico |
|--------|------------|--------------|
| Unirse al partido | Todos | Todos |
| Elegir posicion al unirse | Todos | Solo organizador |
| Mover jugadores | Todos | Solo organizador |
| Cambiar tactica | Todos | Solo organizador |
| Agregar/quitar slots | Todos | Solo organizador |

### Compartir
- Boton "Compartir por WhatsApp" genera mensaje con link
- Link formato: `https://futbolmatch.vercel.app/#/match/UUID`
- Al abrir el link, carga el partido automaticamente

### Vista de Jugadores
- Jugadores en cancha (con posicion asignada)
- Lista de pendientes/banco (sin posicion)
- Drag & drop para mover jugadores (solo si tiene permiso)

### Otras
- Descargar imagen de la formacion (PNG)
- Multiidioma (ES/EN)
- Responsive (desktop + mobile)

---

## ESTRUCTURA DE ARCHIVOS CLAVE

```
C:\Users\Usuario\Futbolmatch\
├── App.tsx                    # Router principal (hash-based)
├── index.html                 # HTML base + Tailwind CDN
├── index.tsx                  # Entry point React
├── types.ts                   # Tipos TypeScript
├── constants.ts               # Tacticas y configuraciones
│
├── components/
│   ├── CreateMatchForm.tsx    # Formulario crear partido
│   ├── MatchView.tsx          # Vista del partido (principal)
│   ├── SoccerField.tsx        # Cancha con posiciones
│   ├── PlayerSlot.tsx         # Slot de jugador
│   ├── PendingPlayersList.tsx # Lista de jugadores en banco
│   ├── Header.tsx             # Cabecera
│   └── Modal.tsx              # Modal reutilizable
│
├── services/
│   ├── api.ts                 # Wrapper (elige mock o supabase)
│   ├── mockApiService.ts      # API mock (localStorage)
│   └── supabaseApiService.ts  # API real (Supabase)
│
├── lib/
│   └── supabase.ts            # Cliente Supabase
│
├── locales/
│   ├── es.json                # Traducciones espanol
│   └── en.json                # Traducciones ingles
│
├── context/
│   └── LanguageContext.tsx    # Contexto de idioma
│
└── hooks/
    └── useTranslation.ts      # Hook de traduccion
```

---

## BASE DE DATOS (Supabase)

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
extra_slots INTEGER
organizer_name TEXT
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

### Politicas RLS
Actualmente: **Permisivas (allow all)** - Para MVP
Futuro: Restringir por organizador

---

## VARIABLES DE ENTORNO

### Vercel (Produccion)
```
VITE_SUPABASE_URL=https://jllnkthnduwskdjlhjjm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs... (sin espacios!)
```

### Local (.env.local)
Mismo contenido que Vercel.

**IMPORTANTE:** Las variables NO deben tener espacios al inicio/final.

---

## FLUJO DE DESARROLLO

1. Hacer cambios en codigo local
2. `git add -A && git commit -m "mensaje" && git push`
3. Vercel detecta el push y redeploya automaticamente (~1 min)
4. Verificar en https://futbolmatch.vercel.app/

---

## PROBLEMAS CONOCIDOS (no criticos)

1. **Warning Tailwind CDN** - Aparece en consola, no afecta funcionamiento
2. **sessionStorage para organizador** - Si cierra la pestana, pierde el rol de organizador
3. **Sin autenticacion real** - Cualquiera con el link puede unirse

---

## PROXIMAS MEJORAS SUGERIDAS

1. **React Router** - Reemplazar hash routing por path routing real
2. **Supabase Realtime** - Actualizaciones en vivo (ya configurado, falta implementar)
3. **Autenticacion** - Login para organizadores
4. **Tailwind via PostCSS** - Eliminar warning de CDN
5. **Historial de partidos** - Ver partidos anteriores
6. **Notificaciones** - Avisar cuando alguien se une

---

## COMANDOS UTILES

```bash
# Ir al proyecto
cd C:\Users\Usuario\Futbolmatch

# Instalar dependencias
npm install

# Correr en local
npm run dev

# Build de produccion
npm run build

# Ver estado git
git status

# Ver historial de commits
git log --oneline

# Subir cambios
git add -A && git commit -m "mensaje" && git push
```

---

## CONTACTO

**Proyecto:** FutbolMatch
**Usuario:** Fernando (Pinar del Este FC)
**Equipo:** Liga Solymar Verano 2026, categoria +30

---

**Ultima actualizacion:** 4 Febrero 2026
