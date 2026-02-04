# 🚀 PLAN DE DEPLOYMENT - FUTBOLMATCH

> **IMPORTANTE:** Este proyecto es HOBBIE/PERSONAL. NO usar cuentas de empresa (FERABEN SRL).
> Crear cuentas NUEVAS y separadas para todo.

---

## 📍 ESTADO ACTUAL (3 Febrero 2026)

### ✅ App Funcionando en Localhost
- **URL:** http://localhost:3000/
- **Servidor:** `npm run dev`
- **Estado:** Lista para producción

### ✅ Bugs Arreglados en Esta Sesión
1. **Selector de colores** - Ahora tiene dos selectores independientes (principal + secundario) con vista previa
2. **Drag & drop en modo técnico** - Ahora funciona correctamente, busca posición vacía más cercana

### ✅ Features Implementados
- Crear partido (Modo Libre / Modo Técnico)
- Selección de colores del equipo (combinación libre)
- Unirse al partido (va al banco de pendientes)
- Drag & drop de jugadores a posiciones
- Descargar imagen de la formación
- Compartir por WhatsApp
- Cambiar táctica
- Slots extra
- Multiidioma (ES/EN)

---

## 🎯 OBJETIVO

Llevar FutbolMatch a producción para que:
1. El organizador cree un partido y obtenga un link público
2. Comparta el link en WhatsApp
3. Los jugadores se anoten entrando al link
4. El organizador vea en TIEMPO REAL quién se anotó
5. El organizador asigne posiciones
6. Los jugadores vean su posición en TIEMPO REAL

---

## 🛠️ STACK ELEGIDO

| Componente | Servicio | Cuenta |
|------------|----------|--------|
| **Código** | GitHub | NUEVA cuenta personal |
| **Frontend** | Vercel | NUEVA cuenta personal |
| **Base de datos** | Supabase | NUEVA cuenta personal |
| **Dominio** | Vercel (gratis) | futbolmatch-xxx.vercel.app |

### ¿Por qué este stack?
- **GitHub:** Gratis, versionado, integra con Vercel
- **Vercel:** Deploy automático desde GitHub, gratis, SSL incluido
- **Supabase:** PostgreSQL gratis, tiene Realtime (actualización en vivo), API automática

---

## 📋 PASOS PARA LA PRÓXIMA SESIÓN

### PASO 1: Crear Cuentas Nuevas (10 min)

#### 1.1 GitHub (cuenta personal/hobbie)
1. Ir a https://github.com/signup
2. Crear cuenta con email PERSONAL (no de empresa)
3. Username sugerido: algo relacionado a futbol/hobbie
4. Verificar email

#### 1.2 Vercel (cuenta personal)
1. Ir a https://vercel.com/signup
2. Registrarse con la cuenta de GitHub nueva
3. Plan gratuito (Hobby)

#### 1.3 Supabase (cuenta personal)
1. Ir a https://supabase.com
2. Registrarse con la cuenta de GitHub nueva
3. Plan gratuito (Free tier)

---

### PASO 2: Crear Repositorio en GitHub (5 min)

```bash
cd C:\Users\Usuario\Futbolmatch

# Inicializar git (si no está)
git init

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit - FutbolMatch v1.3.0"

# Agregar remote (reemplazar con tu usuario)
git remote add origin https://github.com/TU_USUARIO/futbolmatch.git

# Subir
git push -u origin main
```

---

### PASO 3: Crear Proyecto en Supabase (15 min)

#### 3.1 Crear proyecto
1. En Supabase Dashboard → New Project
2. Nombre: `futbolmatch`
3. Database Password: (guardar en lugar seguro)
4. Region: South America (São Paulo) - más cercano a Uruguay
5. Esperar que se cree (~2 min)

#### 3.2 Crear tablas

```sql
-- Tabla de partidos
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type INTEGER NOT NULL, -- 5, 7, 8, 11
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
  mode TEXT DEFAULT 'free', -- 'free' o 'coach'
  organizer_id UUID NOT NULL,
  custom_positions JSONB DEFAULT '{}'
);

-- Tabla de jugadores
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position_index INTEGER, -- NULL = pendiente (banco)
  custom_x DECIMAL(5,2),
  custom_y DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_players_match_id ON players(match_id);

-- Habilitar Realtime para ambas tablas
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE players;

-- Row Level Security (RLS) - Permitir acceso público por ahora
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (para MVP)
CREATE POLICY "Matches are viewable by everyone" ON matches FOR SELECT USING (true);
CREATE POLICY "Matches are insertable by everyone" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Matches are updatable by everyone" ON matches FOR UPDATE USING (true);

CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Players are insertable by everyone" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Players are updatable by everyone" ON players FOR UPDATE USING (true);
CREATE POLICY "Players are deletable by everyone" ON players FOR DELETE USING (true);
```

#### 3.3 Obtener credenciales
1. Settings → API
2. Copiar:
   - Project URL: `https://xxxxx.supabase.co`
   - anon/public key: `eyJhbG...`

---

### PASO 4: Conectar App con Supabase (30 min)

#### 4.1 Instalar Supabase client
```bash
npm install @supabase/supabase-js
```

#### 4.2 Crear archivo de configuración
Crear `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 4.3 Crear archivo .env.local
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

#### 4.4 Crear nuevo servicio API
Crear `services/supabaseApiService.ts` que reemplace a `mockApiService.ts`

---

### PASO 5: Deploy en Vercel (10 min)

1. Ir a https://vercel.com/new
2. Import Git Repository → seleccionar `futbolmatch`
3. Configure Project:
   - Framework Preset: Vite
   - Environment Variables:
     - `VITE_SUPABASE_URL` = tu URL
     - `VITE_SUPABASE_ANON_KEY` = tu key
4. Deploy

**Resultado:** URL pública tipo `futbolmatch-xxx.vercel.app`

---

### PASO 6: Probar con Usuarios Reales

1. Abrir la URL de Vercel
2. Crear partido de prueba
3. Copiar link
4. Abrir en otro navegador/celular (modo incógnito)
5. Unirse como jugador
6. Verificar que aparece en tiempo real

---

## 📁 ARCHIVOS A MODIFICAR/CREAR

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `lib/supabase.ts` | CREAR | Cliente de Supabase |
| `services/supabaseApiService.ts` | CREAR | Servicio real (reemplaza mock) |
| `services/mockApiService.ts` | MANTENER | Para desarrollo local |
| `.env.local` | CREAR | Variables de entorno |
| `.env.example` | CREAR | Template para otros devs |
| `.gitignore` | VERIFICAR | Que ignore `.env.local` |

---

## 🔄 FLUJO DE DATOS CON SUPABASE

```
ORGANIZADOR                          SUPABASE                         JUGADOR
    │                                    │                                │
    ├── Crear partido ─────────────────► INSERT match ◄─────────────────┤
    │                                    │                                │
    │   ◄─────────────────────────────── match_id                        │
    │                                    │                                │
    ├── Compartir link ──────────────────────────────────────────────────►
    │                                    │                                │
    │                                    │ ◄────────── Unirse (INSERT player)
    │                                    │                                │
    │   ◄── Realtime: nuevo jugador ─────┤                                │
    │                                    │                                │
    ├── Asignar posición ──────────────► UPDATE player                   │
    │                                    │                                │
    │                                    ├── Realtime: posición ──────────►
    │                                    │                                │
```

---

## 💰 COSTOS (Todo Gratis para empezar)

| Servicio | Plan | Límites |
|----------|------|---------|
| GitHub | Free | Ilimitado |
| Vercel | Hobby | 100GB bandwidth/mes |
| Supabase | Free | 500MB DB, 2GB transfer |

**Para un equipo de fútbol amateur esto es MÁS que suficiente.**

---

## 🎯 PRÓXIMOS FEATURES (Después del Deploy)

1. **Autenticación simple** - Que el organizador tenga cuenta
2. **Historial de partidos** - Ver partidos anteriores
3. **Plantillas de equipo** - Guardar lista de jugadores frecuentes
4. **Estadísticas** - Goles, asistencias, partidos jugados
5. **Notificaciones** - Avisar cuando alguien se anota
6. **Dominio personalizado** - futbolmatch.com (costo ~$12/año)

---

## 📞 CONTEXTO IMPORTANTE

### Caso de uso real: Pinar del Este FC
- Equipo de fútbol 8 amateur
- Liga Solymar Verano 2026, Uruguay
- 14 jugadores en plantilla
- Torneo los miércoles, categoría +30
- El organizador (Fernando) está ocupado con su empresa
- Necesita forma simple de organizar partidos sin caos en WhatsApp

### Visión del producto
- **Gratis para usuarios**
- Publicidad no invasiva (futuro)
- Patrocinadores locales (canchas, deportivos)
- Expandir a otros equipos amateur de Uruguay y Latinoamérica

---

## ✅ CHECKLIST DEPLOYMENT

### Completado (código listo):
- [x] Crear servicio `services/supabaseApiService.ts`
- [x] Crear wrapper `services/api.ts` (selecciona mock o Supabase automáticamente)
- [x] Crear `lib/supabase.ts` (cliente de Supabase)
- [x] Crear `.env.example` (template)
- [x] Inicializar repositorio git
- [x] Crear commit inicial

### Pendiente (requiere acción manual):
- [ ] **Crear cuenta GitHub personal** (NO empresa) → https://github.com/signup
- [ ] **Crear cuenta Vercel personal** (NO empresa) → https://vercel.com/signup
- [ ] **Crear cuenta Supabase personal** (NO empresa) → https://supabase.com

### Una vez creadas las cuentas:
- [ ] Crear repositorio en GitHub y hacer push
- [ ] Crear proyecto en Supabase (región: São Paulo)
- [ ] Ejecutar SQL para crear tablas (ver sección 3.2)
- [ ] Crear `.env.local` con credenciales de Supabase
- [ ] Conectar Vercel con GitHub y deploy
- [ ] Configurar variables de entorno en Vercel
- [ ] Probar flujo completo con link público
- [ ] Compartir con grupo de WhatsApp real

---

**Creado:** 3 Febrero 2026
**Próxima sesión:** Deployment a producción
