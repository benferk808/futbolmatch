# FutbolMatch

App para organizar partidos de futbol amateur. Crea un partido, comparte el link por WhatsApp, y los jugadores se anotan solos.

## Features

- Crear partidos con diferentes formaciones (5, 7, 8, 11 jugadores)
- Modo Libre (todos editan) o Modo Tecnico (solo el organizador)
- Colores de equipo personalizables
- Drag & drop de jugadores a posiciones
- Lista de jugadores pendientes (banco)
- Descargar imagen de la formacion
- Compartir por WhatsApp
- Multiidioma (ES/EN)

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Realtime)
- **Deploy:** Vercel

## Run Locally

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Environment Variables

Copia `.env.example` a `.env.local` y configura:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Sin estas variables, la app usa un mock local (localStorage).

## Deploy

Ver `DEPLOYMENT-PLAN.md` para instrucciones completas.

## License

MIT
