# 🧪 TESTING CHECKLIST - FUTBOLMATCH

> **IMPORTANTE:** Ejecutar TODOS estos tests antes de continuar con nuevas features

---

## 🚀 SETUP INICIAL

```bash
# 1. Verificar que el servidor esté corriendo
# Debería estar en: http://localhost:3000/

# 2. Si no está corriendo:
cd C:\Users\Usuario\Futbolmatch
npm run dev

# 3. Limpiar datos anteriores (opcional)
# En consola del navegador (F12):
localStorage.removeItem('futbolmatch_data')
sessionStorage.clear()
```

---

## ✅ TEST 1: Modo Técnico - Creación y Detección de Organizador

### Pasos:

1. Abrir http://localhost:3000/
2. Click "Nuevo Partido"
3. Llenar formulario:
   - Nombre: "Fernando"
   - Tipo: Fútbol 8
   - Táctica: 1-3-2-2
   - **Modo: TÉCNICO** (tarjeta morada)
   - Fecha: Mañana
   - Hora: 20:00
   - Cancha: "Complejo Sur"
   - Ubicación: "Av. Italia 2020"
   - Costo: 3200
4. Click "Crear Partido"
5. **ABRIR CONSOLA (F12)**
6. Buscar el log: `🔍 Checking organizer:`

### Resultado Esperado:

```javascript
🔍 Checking organizer: {
  matchId: "abc123...",
  matchOrganizerId: "xyz789...",    // ✅ DEBE TENER VALOR
  storedOrganizerId: "xyz789...",   // ✅ DEBE COINCIDIR CON ARRIBA
  isOrganizer: true                 // ✅ DEBE SER TRUE
}
```

### ❌ Si isOrganizer es FALSE:

**HAY BUG - Investigar:**
- ¿`matchOrganizerId` es `undefined`? → Bug en CreateMatchForm
- ¿`storedOrganizerId` es `null`? → Bug al guardar sessionStorage
- ¿No coinciden? → Bug en generación de IDs

---

## ✅ TEST 2: Modo Técnico - Unirse como Jugador

### Pasos:

1. **En la ventana del organizador:** Copiar URL (ej: http://localhost:3000/abc123)
2. **Abrir pestaña incógnito** (Ctrl+Shift+N)
3. Pegar URL
4. Debería ver la cancha vacía
5. Click botón verde "Unirse al Partido"
6. Ingresar nombre: "Pedro"
7. Click "Confirmar"

### Resultado Esperado:

- ✅ Toast: "¡Pedro se unió! Esperando asignación de posición"
- ✅ Aparece sección amarilla "Jugadores Pendientes"
- ✅ Pedro está en la lista

### Verificar en Pestaña Incógnito:

- ⚠️ Console.log debe mostrar `isOrganizer: false`
- ⚠️ NO debe poder arrastrar jugadores (cursor normal, no move)
- ⚠️ Mensaje: "Esperando que el organizador asigne posiciones"

---

## ✅ TEST 3: Modo Técnico - Drag desde Lista a Cancha

### Pasos:

1. **En ventana organizador** (NO incógnito)
2. Debería ver "Jugadores Pendientes" con "Pedro"
3. **Verificar primero:**
   - ¿Cursor cambia a "move" al hover sobre Pedro?
   - ¿Hay ícono de líneas horizontales a la izquierda?
4. **Click y mantener** en "Pedro"
5. **Arrastrar** hacia un círculo vacío en la cancha
6. **Soltar**

### Resultado Esperado:

- ✅ Pedro desaparece de "Jugadores Pendientes"
- ✅ Pedro aparece en la posición donde lo soltaste
- ✅ Toast: "Pedro asignado a posición"

### ❌ Si NO funciona:

**Problema reportado por usuario - Posibles causas:**
1. `isOrganizer` es `false` (ver Test 1)
2. `canDrag` no se está pasando correctamente
3. Bug en `handleAssignPendingPlayer`

**Debug:**
```javascript
// En consola (F12):
console.log('canEditPositions:', /* ver valor */);
// Debe ser TRUE para organizador
```

---

## ✅ TEST 4: Modo Técnico - Click en Lista + Click en Posición

### Pasos (Alternativa al Drag):

1. **En ventana organizador**
2. Agregar otro jugador: Click "Unirse" → "María"
3. **Click en "María"** en la lista (NO arrastrar)
4. **Click en un círculo vacío** de la cancha

### Resultado Esperado:

- ✅ María se asigna a esa posición
- ✅ María desaparece de pendientes

---

## ✅ TEST 5: Modo Técnico - Drag de Cancha a Banco

### Pasos:

1. **En ventana organizador**
2. Tener al menos un jugador EN LA CANCHA (ej: Pedro)
3. **Click y mantener** en "Pedro" en la cancha
4. **Arrastrar** hacia la sección "Jugadores Pendientes" (tarjeta amarilla)
5. **Soltar** sobre la tarjeta amarilla

### Resultado Esperado:

- ✅ Pedro desaparece de la cancha
- ✅ Pedro aparece en "Jugadores Pendientes"
- ✅ Toast: "Pedro movido al banco"
- ✅ El círculo en la cancha queda vacío

---

## ✅ TEST 6: Modo Técnico - Eliminar Jugador Pendiente

### Pasos:

1. **En ventana organizador**
2. Tener al menos un jugador en "Jugadores Pendientes"
3. **Hover** sobre el jugador en la lista
4. Debería aparecer una **X roja** a la derecha
5. **Click en la X**
6. Confirmar en el diálogo

### Resultado Esperado:

- ✅ Jugador desaparece de la lista
- ✅ Toast: "[Nombre] eliminado del partido"

---

## ✅ TEST 7: Modo Libre - Botón Unirse va al Banco

### Pasos:

1. Crear **NUEVO partido**
2. **Modo: LIBRE** (tarjeta azul)
3. Completar formulario y crear
4. Click "Unirse al Partido"
5. Ingresar: "María"
6. Confirmar

### Resultado Esperado:

- ✅ María aparece en "Jugadores Pendientes" (NO en cancha)
- ✅ Toast: "¡María se unió! Esperando asignación de posición"

### ❌ Si María aparece en cancha (posición 0, arco):

**HAY BUG - El fix NO funcionó**
- Verificar MatchView.tsx línea 120-124
- Debe ser `positionIndex = null` siempre

---

## ✅ TEST 8: Modo Libre - Click en Posición Asigna Directamente

### Pasos:

1. **En partido modo LIBRE**
2. **Click en un círculo vacío** de la cancha
3. Ingresar: "Juan"
4. Confirmar

### Resultado Esperado:

- ✅ Juan aparece en esa posición específica
- ✅ NO va a pendientes
- ✅ Toast: "¡Juan se unió al partido!"

---

## ✅ TEST 9: Modo Libre - Todos Pueden Arrastrar

### Pasos:

1. **Partido modo LIBRE**
2. **Pestaña incógnito** con el link
3. Agregar jugador "Luis" en una posición
4. En incógnito: **Intentar arrastrar "Luis"** a otra posición

### Resultado Esperado:

- ✅ SÍ se puede arrastrar (cursor move)
- ✅ Luis se mueve a nueva posición
- ✅ En modo libre TODOS pueden arrastrar

---

## ✅ TEST 10: Modo Libre - Organizador Tiene Permisos Extra

### Pasos:

1. **Partido modo LIBRE**
2. **Pestaña incógnito:** agregar jugador "Ana" en posición
3. **Ventana organizador:** intentar mover "Ana"

### Resultado Esperado:

- ✅ Organizador SÍ puede mover jugadores de otros
- ✅ Organizador puede eliminarlos (X roja)
- ✅ Organizador tiene permisos superiores incluso en modo libre

---

## ✅ TEST 11: Descarga de Imagen

### Pasos:

1. **Crear partido** (cualquier modo)
2. Agregar algunos jugadores (en cancha y/o pendientes)
3. Scroll hasta ver botón azul "Descargar"
4. **Click en "Descargar"**

### Resultado Esperado:

1. ✅ Toast: "Generando imagen..."
2. ✅ Se descarga un archivo PNG automáticamente
3. ✅ Nombre: `futbolmatch-Complejo-Sur-2024-12-03.png`
4. ✅ Toast: "¡Imagen descargada exitosamente!"

### Verificar Contenido de la Imagen:

Abrir la imagen descargada y verificar que incluya:
- ✅ Nombre de cancha, fecha, hora
- ✅ Ubicación
- ✅ Indicador de modo (Libre/Técnico)
- ✅ Stats (Costo total, jugadores, costo por jugador)
- ✅ Cancha completa
- ✅ Todos los jugadores
- ✅ Lista de pendientes (si hay)
- ❌ NO debe incluir botones de acción

---

## ✅ TEST 12: Cambio de Idioma

### Pasos:

1. En cualquier partido
2. Click selector de idioma (arriba derecha)
3. Cambiar de Español → English

### Resultado Esperado:

- ✅ Todas las etiquetas cambian a inglés
- ✅ "Modo Técnico" → "Coach Mode"
- ✅ "Jugadores Pendientes" → "Pending Players"
- ✅ "Unirse al Partido" → "Join Match"

---

## ✅ TEST 13: Mobile Responsive

### Pasos:

1. Abrir DevTools (F12)
2. Click ícono mobile (Ctrl+Shift+M)
3. Seleccionar iPhone 12 Pro
4. Navegar por toda la app

### Resultado Esperado:

- ✅ Formulario se ve bien
- ✅ Cancha es responsive
- ✅ Lista de pendientes se adapta (1 columna)
- ✅ Botones no se salen de pantalla
- ✅ Drag & drop funciona en touch

---

## 📊 RESULTADOS

### Completar esta tabla:

| # | Test | ✅ Pass | ❌ Fail | Notas |
|---|------|---------|---------|-------|
| 1 | Detección Organizador | ⬜ | ⬜ | |
| 2 | Unirse como Jugador | ⬜ | ⬜ | |
| 3 | Drag Lista → Cancha | ⬜ | ⬜ | |
| 4 | Click Lista + Posición | ⬜ | ⬜ | |
| 5 | Drag Cancha → Banco | ⬜ | ⬜ | |
| 6 | Eliminar Pendiente | ⬜ | ⬜ | |
| 7 | Libre: Unirse → Banco | ⬜ | ⬜ | |
| 8 | Libre: Click Posición | ⬜ | ⬜ | |
| 9 | Libre: Todos Arrastran | ⬜ | ⬜ | |
| 10 | Libre: Permisos Extra | ⬜ | ⬜ | |
| 11 | Descarga de Imagen | ⬜ | ⬜ | |
| 12 | Cambio de Idioma | ⬜ | ⬜ | |
| 13 | Mobile Responsive | ⬜ | ⬜ | |

### Si TODO pasa (13/13):

🎉 **CONTINUAR CON NUEVAS FEATURES**

### Si hay FAILS:

🐛 **ARREGLAR BUGS PRIMERO**
- Documentar cada bug en SESION-DICIEMBRE-2024.md
- Arreglar uno por uno
- Re-testear
- Cuando TODO pase → Continuar

---

## 🔍 DEBUGGING TIPS

### Ver localStorage:

```javascript
// En consola (F12):
console.log(JSON.parse(localStorage.getItem('futbolmatch_data')));
```

### Ver sessionStorage:

```javascript
// Ver todos los organizer IDs:
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key.startsWith('organizer_')) {
    console.log(key, sessionStorage.getItem(key));
  }
}
```

### Verificar Estado de Permisos:

```javascript
// En MatchView, agregar temporalmente:
console.log('canEditPositions:', canEditPositions);
console.log('isUserOrganizer:', isUserOrganizer);
console.log('match.mode:', match.mode);
```

### Simular Usuario Diferente:

1. Pestaña normal = Organizador
2. Pestaña incógnito = Otro usuario
3. **NO cerrar pestaña normal** o perderás organizerId

---

**Última actualización:** 2 Diciembre 2024
