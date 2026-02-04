# CLAUDE.md - FutbolMatch

> **LEER PRIMERO** al iniciar nueva sesion con Claude

## ESTADO ACTUAL

**URL Produccion:** https://futbolmatch.vercel.app/
**Estado:** EN PRODUCCION - FUNCIONANDO
**Fecha:** 4 Febrero 2026

---

## QUE ES FUTBOLMATCH

App web para organizar partidos de futbol amateur:
1. Organizador crea partido (elige formacion, colores, modo)
2. Obtiene link unico
3. Comparte por WhatsApp
4. Jugadores abren el link y se anotan
5. Organizador asigna posiciones (en modo tecnico)

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
| `ESTADO-PRODUCCION.md` | Documentacion completa del estado actual |
| `App.tsx` | Router principal (hash-based) |
| `components/MatchView.tsx` | Vista principal del partido |
| `services/api.ts` | Wrapper API (mock o supabase) |
| `services/supabaseApiService.ts` | Conexion real a Supabase |

---

## MODOS DE PARTIDO

### Modo Libre
- Cualquiera puede mover jugadores
- Cualquiera puede cambiar tactica

### Modo Tecnico
- Solo el organizador mueve jugadores
- Solo el organizador cambia tactica
- Jugadores solo pueden unirse a lista de espera

---

## COMO FUNCIONA EL ROUTING

La app usa **hash routing** (`#/match/UUID`):
- `https://futbolmatch.vercel.app/` → Crear partido
- `https://futbolmatch.vercel.app/#/match/abc123` → Ver partido abc123

El `App.tsx` lee el hash y carga el partido correspondiente.

---

## COMO SABE QUIEN ES ORGANIZADOR

Cuando se crea un partido:
1. Se genera `organizerId` unico
2. Se guarda en `sessionStorage` del navegador
3. Se guarda en la tabla `matches` de Supabase

Cuando alguien abre el partido:
1. Se compara `sessionStorage.organizer_{matchId}` con `match.organizerId`
2. Si coinciden → es organizador
3. Si no → es jugador

**Limitacion:** Si cierra la pestana, pierde el sessionStorage y el rol.

---

## SUPABASE

**Project URL:** https://jllnkthnduwskdjlhjjm.supabase.co

### Tablas:
- `matches` - Partidos
- `players` - Jugadores (FK a matches)

### RLS:
Actualmente permisivo (allow all) para MVP.

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
