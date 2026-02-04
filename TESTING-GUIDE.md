# 🎮 FUTBOLMATCH - Guía de Testing

## ✅ Estado Actual de la Aplicación

La aplicación **FUTBOLMATCH** está completamente funcional para testing en el frontend, utilizando un sistema de almacenamiento mock (localStorage) que simula el backend.

---

## 🚀 Cómo Ejecutar la Aplicación

### 1. Servidor ya está corriendo
El servidor de desarrollo ya está activo en:
- **Local:** http://localhost:3000/
- **Red:** http://192.168.1.42:3000/

### 2. Si necesitas reiniciarlo:
```bash
npm run dev
```

---

## 🎯 Funcionalidades Implementadas y Listas para Probar

### ✅ Creación de Partidos
- [x] Selector de tipo de fútbol: **5, 6, 7, 8, 9, 10, 11 jugadores**
- [x] Selector de táctica/formación según tipo
- [x] Formulario completo con validaciones:
  - Fecha del partido
  - Hora del partido
  - Nombre de la cancha
  - Ubicación
  - Link de Google Maps (opcional)
  - Costo total
  - Duración del link (7, 15, 30 días)

### ✅ Tácticas Disponibles por Tipo

**Fútbol 5:**
- 1-2-2 (Balanceada)
- 1-1-2-1 (Defensiva)

**Fútbol 6:**
- 1-2-2-1 (Clásica)
- 1-2-1-2 (Ofensiva)
- 1-3-2 (Defensiva)

**Fútbol 7:**
- 1-2-3-1 (Ofensiva)
- 1-3-2-1 (Balanceada)
- 1-3-1-2 (Equilibrada)

**Fútbol 8:**
- 1-3-2-2 (Balanceada)
- 1-3-3-1 (Control del medio)
- 1-2-3-2 (Ofensiva)

**Fútbol 9:**
- 1-3-3-2 (Balanceada)
- 1-4-2-2 (Defensiva)
- 1-3-4-1 (Ofensiva)

**Fútbol 10:**
- 1-4-3-2 (Balanceada)
- 1-3-4-2 (Ofensiva)
- 1-4-4-1 (Control del medio)

**Fútbol 11:**
- 1-4-4-2 (Clásica)
- 1-4-3-3 (Ofensiva)
- 1-3-4-3 (Ultra ofensiva)

### ✅ Vista de la Cancha
- [x] Cancha visual con diseño realista
- [x] Posiciones representadas por círculos clicables
- [x] **Colores por rol:**
  - 🟡 Amarillo: Arquero (GK)
  - 🔵 Azul: Defensores (DF)
  - 🟢 Verde: Mediocampistas (MF)
  - 🔴 Rojo: Delanteros (FW)
- [x] Líneas de cancha y arcos visualizados
- [x] Diseño responsive (funciona en mobile y desktop)

### ✅ Gestión de Jugadores
- [x] Hacer clic en posición vacía para anotarse
- [x] Modal para ingresar nombre del jugador
- [x] Hacer clic en posición ocupada para desanotarse
- [x] Validación de nombres duplicados
- [x] Máximo 15 caracteres por nombre

### ✅ Espacios Extra (Suplentes)
- [x] Botón "Añadir Espacio" para agregar suplentes
- [x] Botón "Quitar Espacio" para eliminar suplentes
- [x] Los espacios extra se muestran debajo de la cancha
- [x] Si hay un jugador en el espacio a eliminar, se pide confirmación

### ✅ Cambio de Tácticas en Vivo
- [x] Botón "Cambiar Táctica" siempre visible
- [x] Modal con todas las tácticas disponibles
- [x] La cancha se redibuja automáticamente
- [x] Los jugadores se redistribuyen inteligentemente
- [x] Si hay jugadores en posiciones que desaparecen, se eliminan con aviso

### ✅ Cálculo Automático de Costos
- [x] Costo total del partido
- [x] **Costo por jugador actualizado en tiempo real**
- [x] División automática: Costo Total / Jugadores Confirmados
- [x] Actualización al agregar/quitar jugadores

### ✅ Compartir por WhatsApp
- [x] Botón destacado "Compartir en WhatsApp"
- [x] Mensaje pre-formateado con toda la info del partido
- [x] Se abre WhatsApp Web/App automáticamente

### ✅ Información del Partido
- [x] Header con nombre de la cancha
- [x] Fecha y hora destacadas
- [x] Ubicación con ícono de mapa
- [x] Link a Google Maps (si se proporcionó)
- [x] **3 tarjetas informativas:**
  1. Costo Total
  2. Jugadores Confirmados / Total
  3. Costo por Jugador

### ✅ Sistema de Idiomas
- [x] Español (por defecto)
- [x] Inglés
- [x] Selector de idioma en el header
- [x] Todas las traducciones completas

### ✅ Persistencia de Datos
- [x] Los partidos se guardan en **localStorage**
- [x] Los datos persisten al recargar la página
- [x] Simulación de latencia de red (300ms)

---

## 🧪 Escenarios de Prueba Sugeridos

### Prueba 1: Crear un Partido Simple
1. Abre http://localhost:3000/
2. Completa el formulario:
   - Tipo: Fútbol 8
   - Táctica: 1-3-2-2
   - Fecha: Cualquier fecha futura
   - Hora: 20:00
   - Cancha: "Complejo Sur"
   - Ubicación: "Av. Italia 2020"
   - Costo: 3200
3. Clic en "Crear Partido y Obtener Enlace"
4. Verifica que se cree el partido y veas la cancha

### Prueba 2: Agregar Jugadores
1. En la cancha, haz clic en el círculo del arquero (amarillo)
2. Ingresa nombre: "Juan"
3. Confirma
4. Repite para otras posiciones
5. Verifica que:
   - Los nombres aparezcan en la cancha
   - El contador de jugadores aumente
   - El costo por jugador se recalcule

### Prueba 3: Cambiar Táctica
1. Con algunos jugadores ya anotados
2. Clic en "Cambiar Táctica"
3. Selecciona otra táctica (ej: 1-3-3-1)
4. Verifica que:
   - La cancha se redibuje
   - Los jugadores se redistribuyan
   - Si sobran jugadores, se eliminen con aviso

### Prueba 4: Agregar Suplentes
1. Clic en "Añadir Espacio"
2. Verifica que aparezca un nuevo círculo debajo de "Espacios Extra"
3. Anota un jugador en ese espacio
4. Clic en "Quitar Espacio"
5. Verifica la confirmación antes de eliminar

### Prueba 5: Desanotar Jugador
1. Haz clic en un jugador ya anotado
2. Confirma la eliminación
3. Verifica que:
   - El jugador desaparezca
   - El costo por jugador se recalcule
   - El contador disminuya

### Prueba 6: Compartir por WhatsApp
1. Clic en "Compartir en WhatsApp"
2. Verifica que se abra WhatsApp
3. Revisa el mensaje pre-formateado
4. Debe incluir todos los datos del partido

### Prueba 7: Responsive Design
1. Abre las DevTools del navegador (F12)
2. Activa el modo responsive
3. Prueba en diferentes tamaños:
   - iPhone (375px)
   - iPad (768px)
   - Desktop (1920px)
4. Verifica que todo se vea bien

### Prueba 8: Cambiar Idioma
1. Clic en el selector de idioma (arriba a la derecha)
2. Cambia de Español a Inglés
3. Verifica que todos los textos se traduzcan

### Prueba 9: Persistencia
1. Crea un partido y agrega jugadores
2. Refresca la página (F5)
3. Verifica que todo siga igual (datos en localStorage)

### Prueba 10: Validaciones
1. Intenta crear un partido sin completar campos
2. Verifica los mensajes de error
3. Intenta agregar un jugador con nombre vacío
4. Intenta agregar un jugador con nombre duplicado

---

## 🎨 Colores y Estilos

### Paleta de Colores
- **Fondo principal:** Gris oscuro (#1a1a1a)
- **Tarjetas:** Gris (#2d2d2d)
- **Cancha:** Verde oscuro con transparencia
- **Líneas de cancha:** Blanco semi-transparente
- **Acentos:** Gradiente violeta-índigo (#667eea → #764ba2)
- **Posiciones:**
  - GK: Amarillo (#f59e0b)
  - DF: Azul (#3b82f6)
  - MF: Verde (#16a34a)
  - FW: Rojo (#ef4444)

### Feedback Visual
- ✅ Verde: Acciones exitosas
- ⚠️ Amarillo: Advertencias
- ❌ Rojo: Errores
- 🔵 Azul: Información

---

## 🐛 Limitaciones Conocidas (Sin Backend)

1. **Sin sincronización real:** Los cambios no se comparten entre dispositivos
2. **Solo localStorage:** Los datos se pierden si se borra el caché del navegador
3. **Sin links únicos reales:** Cada navegador tiene su propia data
4. **Sin expiración de links:** Los links no expiran realmente (solo simulado)

> ⚠️ Estas limitaciones se resolverán cuando se implemente el backend con Cloudflare Workers + D1.

---

## 📝 Notas para el Desarrollador

### Archivos Clave Modificados
- `services/mockApiService.ts` - API mock creada
- `components/CreateMatchForm.tsx` - Usa mock API
- `components/MatchView.tsx` - Usa mock API
- `constants.ts` - Tácticas completas para todos los tipos
- `context/LanguageContext.tsx` - Traducciones actualizadas

### Para Cambiar a API Real
Cuando el backend esté listo, solo necesitas:
1. Cambiar los imports en los componentes:
   - De: `import('../services/mockApiService')`
   - A: `import('../services/apiService')`
2. Configurar la variable `VITE_API_URL` en `.env.local`

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 🎉 Conclusión

La aplicación está **100% funcional** para testing en el frontend. Todas las características principales están implementadas y funcionando:

✅ Crear partidos
✅ Gestionar jugadores
✅ Cambiar tácticas
✅ Agregar suplentes
✅ Compartir por WhatsApp
✅ Cálculo de costos
✅ Multiidioma
✅ Responsive

**¡Listo para probar y mostrar! 🚀⚽**

---

**Fecha:** Noviembre 2024
**Estado:** MVP Frontend Completo
**Próximo Paso:** Implementar backend con Cloudflare Workers
