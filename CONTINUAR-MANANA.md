# CONTINUAR MAÑANA - Deployment FutbolMatch

> **Fecha:** 3 Febrero 2026
> **Cuentas creadas:** GitHub, Vercel, Supabase (todas con fnosieski@hotmail.com)

---

## CUENTAS YA CREADAS

| Servicio | URL | Usuario |
|----------|-----|---------|
| GitHub | https://github.com/benferk808 | benferk808 |
| Vercel | https://vercel.com/benferk808s-projects | benferk808 |
| Supabase | https://supabase.com | (via GitHub) |

**Email personal:** fnosieski@hotmail.com

---

## ESTADO DEL CÓDIGO

- Git inicializado en `C:\Users\Usuario\Futbolmatch`
- 2 commits realizados
- Todos los archivos listos para Supabase
- El código detecta automáticamente si usar mock o Supabase

---

## PASOS PARA MAÑANA

### PASO 1: Crear repositorio en GitHub (5 min)

1. Ir a https://github.com/new
2. Nombre del repositorio: `futbolmatch`
3. Descripción: `App para organizar partidos de fútbol amateur`
4. **Público** (para que Vercel pueda acceder gratis)
5. NO marcar "Add a README" (ya tenemos uno)
6. Click "Create repository"

### PASO 2: Subir código a GitHub (2 min)

Abrir terminal en `C:\Users\Usuario\Futbolmatch` y ejecutar:

```bash
git remote add origin https://github.com/benferk808/futbolmatch.git
git branch -M main
git push -u origin main
```

Si pide credenciales, usar las de GitHub (benferk808).

### PASO 3: Crear proyecto en Supabase (5 min)

1. Ir a https://supabase.com y hacer login con GitHub
2. Click "New Project"
3. Configurar:
   - **Organization:** (crear una si no existe, ej: "Personal")
   - **Name:** `futbolmatch`
   - **Database Password:** (GUARDAR EN LUGAR SEGURO)
   - **Region:** South America (São Paulo) - el más cercano a Uruguay
4. Click "Create new project"
5. Esperar ~2 minutos a que se cree

### PASO 4: Crear tablas en Supabase (5 min)

1. En el dashboard de Supabase, ir a **SQL Editor** (menú izquierdo)
2. Click "New query"
3. Copiar y pegar TODO este SQL:

```sql
-- Tabla de partidos
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type INTEGER NOT NULL,
  tactic TEXT NOT NULL,
  duration_days INTEGER DEFAULT 7,
  date DATE NOT NULL,
  time TIME NOT NULL,
  field_name TEXT NOT NULL,
  location TEXT NOT NULL,
  location_url TEXT,
  total_cost DECIMAL(10,2) NOT NULL,
  extra_slots INTEGER DEFAULT 0,
  organizer_name TEXT,
  team_color TEXT DEFAULT '#667eea',
  team_color_secondary TEXT DEFAULT '#FFFFFF',
  mode TEXT DEFAULT 'free',
  organizer_id UUID NOT NULL,
  custom_positions JSONB DEFAULT '{}'
);

-- Tabla de jugadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position_index INTEGER,
  custom_x DECIMAL(5,2),
  custom_y DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_players_match_id ON players(match_id);

-- Habilitar Realtime para ambas tablas
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- Row Level Security (RLS)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (MVP)
CREATE POLICY "Matches are viewable by everyone" ON matches FOR SELECT USING (true);
CREATE POLICY "Matches are insertable by everyone" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Matches are updatable by everyone" ON matches FOR UPDATE USING (true);

CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Players are insertable by everyone" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Players are updatable by everyone" ON players FOR UPDATE USING (true);
CREATE POLICY "Players are deletable by everyone" ON players FOR DELETE USING (true);
```

4. Click "Run" (o Ctrl+Enter)
5. Debe aparecer "Success" sin errores

### PASO 5: Obtener credenciales de Supabase (2 min)

1. En Supabase, ir a **Settings** → **API** (menú izquierdo)
2. Copiar estos dos valores:
   - **Project URL:** `https://xxxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### PASO 6: Crear archivo .env.local (2 min)

En la carpeta `C:\Users\Usuario\Futbolmatch`, crear archivo `.env.local` con:

```
VITE_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...TU_KEY_AQUI
```

Reemplazar con tus valores reales de Supabase.

### PASO 7: Probar localmente (opcional, 5 min)

```bash
cd C:\Users\Usuario\Futbolmatch
npm run dev
```

Abrir http://localhost:3000 y verificar que funciona.
En la consola del navegador (F12) debe aparecer: `[API] Using Supabase API`

### PASO 8: Deploy en Vercel (10 min)

1. Ir a https://vercel.com/new
2. Click "Import Git Repository"
3. Seleccionar `benferk808/futbolmatch`
4. Configurar:
   - **Framework Preset:** Vite
   - **Root Directory:** (dejar vacío)
   - **Build Command:** (dejar default: `npm run build`)
   - **Output Directory:** (dejar default: `dist`)
5. **Environment Variables** (MUY IMPORTANTE):
   - Click "Add"
   - Name: `VITE_SUPABASE_URL`
   - Value: (tu URL de Supabase)
   - Click "Add" otra vez
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: (tu anon key de Supabase)
6. Click "Deploy"
7. Esperar ~1-2 minutos

### PASO 9: Obtener URL pública

Después del deploy, Vercel te dará una URL tipo:
`https://futbolmatch-xxx.vercel.app`

**¡Esa es tu app en producción!**

### PASO 10: Probar flujo completo

1. Abrir la URL de Vercel
2. Crear un partido de prueba
3. Copiar el link del partido
4. Abrir en modo incógnito o celular
5. Unirse como jugador
6. Verificar que aparece en tiempo real en la otra ventana

---

## COMANDOS RÁPIDOS

```bash
# Ir al proyecto
cd C:\Users\Usuario\Futbolmatch

# Iniciar servidor local
npm run dev

# Ver estado de git
git status

# Subir cambios a GitHub
git add .
git commit -m "Descripción del cambio"
git push

# Ver logs de consola
# En el navegador: F12 → Console
```

---

## TROUBLESHOOTING

### "Supabase credentials not found"
- Verificar que `.env.local` existe y tiene las credenciales correctas
- Las variables deben empezar con `VITE_`

### "Error en SQL de Supabase"
- Ejecutar el SQL completo de una vez, no por partes
- Si ya creaste las tablas antes, primero hacer DROP:
  ```sql
  DROP TABLE IF EXISTS players;
  DROP TABLE IF EXISTS matches;
  ```

### "Push a GitHub falla"
- Verificar que el remote está configurado:
  ```bash
  git remote -v
  ```
- Si no aparece origin, agregarlo:
  ```bash
  git remote add origin https://github.com/benferk808/futbolmatch.git
  ```

### "Deploy en Vercel falla"
- Verificar que las Environment Variables están configuradas
- Revisar los logs de build en Vercel

---

## ARCHIVOS IMPORTANTES

| Archivo | Descripción |
|---------|-------------|
| `services/api.ts` | Wrapper que selecciona mock o Supabase |
| `services/supabaseApiService.ts` | Servicio real de Supabase |
| `services/mockApiService.ts` | Servicio mock para desarrollo |
| `lib/supabase.ts` | Cliente de Supabase |
| `.env.local` | Credenciales (NO subir a GitHub) |
| `.env.example` | Template de credenciales |
| `DEPLOYMENT-PLAN.md` | Plan de deployment completo |

---

## DESPUÉS DEL DEPLOYMENT

Una vez funcionando, compartir el link en el grupo de WhatsApp del equipo:

```
¡Nueva forma de organizar partidos!

Creé un partido para el próximo miércoles.
Entren al link y anótense:

https://futbolmatch-xxx.vercel.app/match/ID_DEL_PARTIDO

Ahí pueden ver quién va, las posiciones y todo.
```

---

## CONTACTO

**Proyecto:** FutbolMatch - Organizador de partidos amateur
**Usuario:** Fernando (Pinar del Este FC)
**Documentado:** 3 Febrero 2026

---

**¡Mañana terminamos el deployment!**
