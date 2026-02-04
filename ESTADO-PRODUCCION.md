# ESTADO DE PRODUCCION - FutbolMatch

> **Fecha:** 4 Febrero 2026
> **Version:** 1.6.0 (en produccion)
> **URL:** https://futbolmatch.vercel.app/

---

## RESUMEN EJECUTIVO

FutbolMatch es una app para organizar partidos de futbol amateur. El organizador crea un partido, guarda su link privado, comparte el link de jugadores por WhatsApp, y los jugadores se anotan solos.

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
  |                        |<-- match.id + orgId ---|
  |<-- Modal 2 links ------|                        |
  |                        |                        |
  |-- Guardar link org --->| (privado)              |
  |-- Compartir link jug ->| (WhatsApp)             |
  |                        |                        |
Jugador                    |                        |
  |-- Abrir link --------->|                        |
  |                        |-- SELECT match ------->|
  |                        |<-- match data ---------|
  |<-- Ver partido --------|                        |
  |                        |                        |
  |-- Unirse ------------->|                        |
  |                        |-- INSERT player ------>|
  |<-- Confirmacion -------|                        |
```

---

## STACK TECNOLOGICO

| Capa | Tecnologia | Notas |
|------|------------|-------|
| Frontend | React 19 + TypeScript + Vite | SPA con hash routing |
| Estilos | Tailwind CSS (CDN) | Warning en consola, no afecta |
| Backend | Supabase | PostgreSQL + REST API |
| Deploy | Vercel | Auto-deploy desde GitHub |
| Repo | GitHub | https://github.com/benferk808/futbolmatch |

---

## FUNCIONALIDADES IMPLEMENTADAS

### Crear Partido
- Nombre del organizador
- Seleccionar tipo (5, 7, 8, 11 jugadores)
- Elegir tactica/formacion
- Colores de equipo personalizables (primario + secundario)
- Modo Libre o Modo Tecnico
- Fecha, hora, ubicacion, costo
- Link de Google Maps (opcional)
- Nombre del rival/oponente (opcional)

### Sistema de Dos Links
Al crear partido se muestra un modal con:
- **Link Organizador:** `#/match/UUID?admin=TOKEN` (privado, guardar)
- **Link Jugadores:** `#/match/UUID` (compartir en WhatsApp)

El organizador puede recuperar su rol abriendo su link privado.

### Modo Libre vs Modo Tecnico
| Accion | Modo Libre | Modo Tecnico |
|--------|------------|--------------|
| Unirse al partido | Todos | Todos |
| Elegir posicion al unirse | Todos | Solo organizador |
| Mover jugadores | Todos | Solo organizador |
| Cambiar tactica | Todos | Solo organizador |
| Agregar/quitar suplentes | Todos | Solo organizador |

### Banco de Suplentes
- Se pueden agregar espacios para suplentes
- Los jugadores pendientes se pueden arrastrar al banco
- Visual: area resaltada cuando se arrastra sobre ella

### Compartir en WhatsApp
Mensaje formateado con:
- Link para unirse
- Datos del partido (fecha, hora, cancha)
- Rival (si existe)
- Ubicacion + link Google Maps (si existe)

### Vista de Jugadores
- Jugadores en cancha (con posicion asignada)
- Lista de pendientes (sin posicion)
- Banco de suplentes
- Drag & drop para mover jugadores

### Costos
- Costo total configurable
- Costo por jugador calculado automaticamente (total / jugadores anotados)

### Otras
- Descargar imagen de la formacion (PNG)
- Multiidioma (ES/EN)
- Responsive (desktop + mobile)

---

## ESTRUCTURA DE ARCHIVOS

```
C:\Users\Usuario\Futbolmatch\
├── App.tsx                    # Router principal (hash-based + admin auth)
├── index.html                 # HTML base + Tailwind CDN
├── index.tsx                  # Entry point React
├── types.ts                   # Tipos TypeScript
├── constants.ts               # Tacticas y configuraciones
│
├── components/
│   ├── CreateMatchForm.tsx    # Formulario crear partido
│   ├── MatchView.tsx          # Vista del partido (principal)
│   ├── MatchCreatedModal.tsx  # Modal con los dos links
│   ├── SoccerField.tsx        # Cancha con posiciones + banco
│   ├── PlayerSlot.tsx         # Slot de jugador
│   ├── PendingPlayersList.tsx # Lista de jugadores pendientes
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
├── context/
│   └── LanguageContext.tsx    # Traducciones ES/EN (embebidas)
│
└── hooks/
    └── useTranslation.ts      # Hook de traduccion
```

---

## BASE DE DATOS (Supabase)

### Tabla: matches
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  type INTEGER NOT NULL,
  tactic TEXT NOT NULL,
  duration_days INTEGER DEFAULT 7,
  date DATE NOT NULL,
  time TIME NOT NULL,
  field_name TEXT NOT NULL,
  location TEXT NOT NULL,
  location_url TEXT,
  total_cost DECIMAL NOT NULL,
  extra_slots INTEGER DEFAULT 0,
  organizer_name TEXT,
  opponent TEXT,
  team_color TEXT,
  team_color_secondary TEXT,
  mode TEXT DEFAULT 'free',
  organizer_id TEXT,
  custom_positions JSONB DEFAULT '{}'
);
```

### Tabla: players
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position_index INTEGER,
  custom_x DECIMAL,
  custom_y DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Politicas RLS
Actualmente: **Permisivas (allow all)** - Para MVP

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
2. **Sin autenticacion real** - Cualquiera con el link puede unirse (por diseno)

---

## PROXIMAS MEJORAS SUGERIDAS

1. **Supabase Realtime** - Actualizaciones en vivo
2. **Notificaciones** - Avisar cuando alguien se une
3. **Historial de partidos** - Ver partidos anteriores
4. **Tailwind via PostCSS** - Eliminar warning de CDN
5. **Tests** - Agregar tests unitarios y e2e

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
