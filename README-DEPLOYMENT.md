# 🚀 FUTBOLMATCH - Guía de Deploy Completa

## 📋 **RESUMEN**

FUTBOLMATCH es una aplicación para organizar partidos de fútbol amateur. Permite crear partidos, compartir links por WhatsApp, y que los jugadores se anoten en posiciones visuales.

### **Stack Tecnológico:**
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Cloudflare Workers (serverless)
- **Base de Datos**: Cloudflare D1 (SQLite)
- **Deploy**: Cloudflare Pages + Workers
- **Costo**: 100% GRATIS (dentro del plan gratuito de Cloudflare)

---

## ✅ **CAMBIOS REALIZADOS**

### **Eliminado:**
- ❌ Gemini AI (costaba dinero)
- ❌ Verificación automática de ubicaciones
- ❌ Geolocalización con IA

### **Agregado:**
- ✅ Backend serverless con Cloudflare Workers
- ✅ Base de datos D1 (SQLite en la nube)
- ✅ API REST completa
- ✅ Sistema de links compartibles
- ✅ Campo manual para Google Maps (el usuario pega el link)

---

## 🎯 **PASO A PASO PARA DEPLOYAR**

### **PASO 1: Crear cuenta en Cloudflare (GRATIS)**

1. Ve a: https://dash.cloudflare.com/sign-up
2. Crea tu cuenta con email
3. Verifica tu email
4. Ingresa al dashboard

---

### **PASO 2: Instalar Wrangler CLI**

Wrangler es la herramienta de línea de comandos de Cloudflare.

```bash
npm install -g wrangler
```

Verificar instalación:
```bash
wrangler --version
```

---

### **PASO 3: Login en Cloudflare**

```bash
wrangler login
```

Esto abrirá tu navegador para autenticarte. Acepta los permisos.

---

### **PASO 4: Crear la Base de Datos D1**

```bash
cd C:\Users\Usuario\Futbolmatch
wrangler d1 create futbolmatch-db
```

**IMPORTANTE**: Guarda el output. Te dará un `database_id` como este:
```
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copia ese ID y pégalo en el archivo `wrangler.toml` en ambos lugares donde dice `database_id = ""`

---

### **PASO 5: Aplicar el Schema a la Base de Datos**

```bash
wrangler d1 execute futbolmatch-db --file=./database/schema.sql
```

Esto creará las tablas `matches` y `players`.

---

### **PASO 6: Probar el Backend Localmente**

```bash
wrangler dev
```

Esto iniciará el servidor en `http://localhost:8787`

Prueba que funcione:
```bash
curl http://localhost:8787/api/matches/test-id
```

Deberías ver un error 404 (es normal, solo estamos probando).

---

### **PASO 7: Probar el Frontend Localmente**

Abre otra terminal (deja el wrangler corriendo) y ejecuta:

```bash
npm run dev
```

Esto iniciará Vite en `http://localhost:5173`

Abre tu navegador y prueba:
1. Crear un partido
2. Agregar jugadores
3. Compartir link

---

### **PASO 8: Deploy del Backend (Cloudflare Workers)**

Una vez que todo funcione localmente:

```bash
wrangler deploy
```

Cloudflare te dará una URL como:
```
https://futbolmatch-api.TU-CUENTA.workers.dev
```

**COPIA ESA URL** - la necesitarás para el frontend.

---

### **PASO 9: Configurar la URL de Producción**

Crea un archivo `.env.production`:

```bash
VITE_API_URL=https://futbolmatch-api.TU-CUENTA.workers.dev
```

Reemplaza `TU-CUENTA` con tu URL real.

---

### **PASO 10: Build del Frontend**

```bash
npm run build
```

Esto generará la carpeta `dist` con los archivos estáticos.

---

### **PASO 11: Deploy del Frontend (Cloudflare Pages)**

```bash
wrangler pages deploy dist --project-name=futbolmatch
```

Cloudflare te dará una URL como:
```
https://futbolmatch.pages.dev
```

---

## 🎉 **¡LISTO! Tu app está en producción**

Tu aplicación estará disponible en:
- **Frontend**: `https://futbolmatch.pages.dev`
- **Backend API**: `https://futbolmatch-api.TU-CUENTA.workers.dev`

---

## 🔄 **Actualizar la App**

### **Actualizar Backend:**
```bash
wrangler deploy
```

### **Actualizar Frontend:**
```bash
npm run build
wrangler pages deploy dist --project-name=futbolmatch
```

---

## 💰 **Límites del Plan Gratuito de Cloudflare**

- **Workers**: 100,000 requests/día (GRATIS)
- **D1 Database**: 5 GB almacenamiento (GRATIS)
- **Pages**: 500 builds/mes (GRATIS)

**Para tu caso de uso (partidos entre amigos), esto es MÁS que suficiente.**

---

## 🐛 **Troubleshooting**

### **Error: "Database not found"**
- Verifica que copiaste el `database_id` correctamente en `wrangler.toml`
- Ejecuta: `wrangler d1 list` para ver tus bases de datos

### **Error: "CORS error"**
- El backend ya tiene CORS configurado
- Verifica que la URL en `.env.production` sea correcta

### **No se guardan los partidos**
- Verifica que el schema esté aplicado: `wrangler d1 execute futbolmatch-db --command="SELECT * FROM matches"`

---

## 📝 **Comandos Útiles**

### **Ver logs del Worker:**
```bash
wrangler tail
```

### **Ver datos en D1:**
```bash
wrangler d1 execute futbolmatch-db --command="SELECT * FROM matches"
wrangler d1 execute futbolmatch-db --command="SELECT * FROM players"
```

### **Borrar datos (CUIDADO):**
```bash
wrangler d1 execute futbolmatch-db --command="DELETE FROM players"
wrangler d1 execute futbolmatch-db --command="DELETE FROM matches"
```

---

## 🌐 **Dominio Personalizado (Opcional)**

Si quieres un dominio propio (ej: `futbolmatch.com`):

1. Compra un dominio (Google Domains, Namecheap, etc.)
2. Agrega el dominio a Cloudflare
3. En Cloudflare Pages, ve a "Custom Domains"
4. Agrega tu dominio

---

## 📞 **Contacto y Soporte**

Si tienes problemas, revisa:
- Documentación oficial: https://developers.cloudflare.com/
- Comunidad: https://community.cloudflare.com/

---

**¡Mucha suerte con tu app! ⚽🚀**
