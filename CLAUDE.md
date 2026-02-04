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
| `App.tsx` | Router principal (hash-based + admin auth) |
| `components/MatchView.tsx` | Vista principal del partido |
| `components/MatchCreatedModal.tsx` | Modal con links organizador/jugador |
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

### Sistema de Dos Links

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
