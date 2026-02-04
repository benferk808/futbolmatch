
import React, { createContext, useState, useCallback, useMemo } from 'react';

const en = {
  "appName": "FUTBOLMATCH",
  "newMatch": "New Match",
  "createMatchTitle": "Create a New Match",
  "createMatchSubtitle": "Fill out the details to generate your unique match link.",
  "organizerName": "Your Name (Organizer)",
  "organizerNamePlaceholder": "e.g., Juan Pérez",
  "organizerNameRequired": "Organizer name is required.",
  "teamColor": "Team Color",
  "matchType": "Match Type",
  "matchTypeOption": "Fútbol {type}",
  "tactic": "Tactic",
  "date": "Date",
  "time": "Time",
  "fieldName": "Field Name",
  "fieldNamePlaceholder": "e.g., Cancha El Pibe",
  "location": "Location",
  "locationPlaceholder": "e.g., Av. Siempreviva 742, Springfield",
  "verify": "Verify",
  "verifying": "Verifying...",
  "verifyingLocation": "Verifying location...",
  "locationVerified": "Location verified!",
  "couldNotVerifyLocation": "Could not verify location with Google Maps.",
  "errorVerifyingLocation": "Error verifying location.",
  "locationVerifiedSuccess": "✓ Location verified. Click to view on map.",
  "totalCost": "Total Cost ($)",
  "totalCostPlaceholder": "100",
  "linkActiveFor": "Link Active For",
  "days": "{count} days",
  "createMatchButton": "Create Match & Get Link",
  "dateRequired": "Date is required.",
  "timeRequired": "Time is required.",
  "fieldNameRequired": "Field name is required.",
  "locationRequired": "Location is required.",
  "costRequired": "A valid cost is required.",
  "locationEmpty": "Location cannot be empty.",
  "mapLink": "(Map)",
  "totalCostLabel": "Total Cost",
  "playersConfirmed": "Players Confirmed",
  "costPerPlayer": "Cost per Player",
  "addExtraSlot": "Add Extra Slot",
  "removeExtraSlot": "Remove Slot",
  "changeTactic": "Change Tactic",
  "shareOnWhatsApp": "Share on WhatsApp",
  "removePlayerConfirm": "Do you want to remove {name}?",
  "removePlayerInSlotConfirm": "This will remove {name} from the match to delete the slot. Continue?",
  "playerRemoved": "{name} removed from the match.",
  "playerAlreadyExists": "A player with this name is already in the match.",
  "playerJoined": "{name} joined the match!",
  "playerNameRequired": "Player name cannot be empty.",
  "extraSlotAdded": "Extra player slot added.",
  "extraSlotRemoved": "Extra player slot removed.",
  "tacticChanged": "Tactic changed to {tactic}.",
  "playersBenched": "{count} player(s) moved to bench as their position was removed.",
  "whatsAppShareMessage": "⚽ *Welcome to FUTBOLMATCH!* ⚽\n\n📋 *Join the player list:*\n{link}\n\n📅 *Date:* {date}\n⏰ *Time:* {time}\n🏟️ *Field:* {fieldName}{locationSection}",
  "whatsAppLocationSection": "\n\n📍 *Location:*\n{location}{mapsLinkSection}",
  "whatsAppMapsLinkSection": "\n🗺️ *View on Google Maps:*\n{mapsLink}",
  "positionMoved": "Position moved",
  "joinMatchTitle": "Join Match",
  "joinMatchSubtitle": "Enter your name to claim this position.",
  "yourNamePlaceholder": "Your Name",
  "cancel": "Cancel",
  "confirm": "Confirm",
  "changeTacticTitle": "Change Tactic",
  "invalidTactic": "Invalid tactic selected.",
  "extraSlots": "Extra Slots",
  "footerText": "FUTBOLMATCH © 2024 - Powered by Gemini",
  "creatingMatch": "Creating match...",
  "matchCreated": "Match created successfully!",
  "mapsLink": "Google Maps Link",
  "optional": "optional",
  "playerMoved": "Player moved to new position",
  "matchMode": "Match Mode",
  "modeFree": "Free Mode",
  "modeFreeDescription": "Anyone can edit positions",
  "modeFreeActive": "All players can move and organize themselves",
  "modeCoach": "Coach Mode",
  "modeCoachDescription": "Only organizer controls positions",
  "modeCoachActiveOrganizer": "You control all positions",
  "modeCoachActivePlayer": "Only the organizer can move positions",
  "noPermissionToEdit": "Only the organizer can edit positions in coach mode",
  "downloadImage": "Download",
  "generatingImage": "Generating image...",
  "imageDownloaded": "Image downloaded successfully!",
  "imageDownloadError": "Error downloading image",
  "pendingPlayers": "Pending Players",
  "dragPlayersToField": "Drag players to the field to assign positions",
  "waitingForOrganizer": "Waiting for the organizer to assign positions",
  "removePlayer": "Remove player",
  "joinMatch": "Join Match",
  "playerJoinedPending": "{name} joined! Waiting for position assignment",
  "playerAssignedToPosition": "{name} assigned to position",
  "playerMovedToBench": "{name} moved to bench",
  "matchCreatedTitle": "Match Created!",
  "matchCreatedSubtitle": "Save these important links:",
  "organizerLinkTitle": "ORGANIZER Link",
  "organizerLinkDescription": "SAVE IT! This lets you edit the match. Don't share it.",
  "invitePlayersTitle": "Invite Players",
  "invitePlayersHint": "Share this message in the group so players can sign up",
  "linkCopied": "Link copied!",
  "sharePlayersLink": "Share on WhatsApp",
  "understood": "Got it, continue"
};

const es = {
  "appName": "FUTBOLMATCH",
  "newMatch": "Nuevo Partido",
  "createMatchTitle": "Crear Nuevo Partido",
  "createMatchSubtitle": "Completa los detalles para generar el enlace único de tu partido.",
  "organizerName": "Tu Nombre (Organizador)",
  "organizerNamePlaceholder": "Ej: Juan Pérez",
  "organizerNameRequired": "El nombre del organizador es obligatorio.",
  "teamColor": "Color del Equipo",
  "matchType": "Tipo de Partido",
  "matchTypeOption": "Fútbol {type}",
  "tactic": "Táctica",
  "date": "Fecha",
  "time": "Hora",
  "fieldName": "Nombre de la Cancha",
  "fieldNamePlaceholder": "Ej: Cancha El Pibe",
  "location": "Ubicación",
  "locationPlaceholder": "Ej: Av. Siempreviva 742, Springfield",
  "verify": "Verificar",
  "verifying": "Verificando...",
  "verifyingLocation": "Verificando ubicación...",
  "locationVerified": "¡Ubicación verificada!",
  "couldNotVerifyLocation": "No se pudo verificar la ubicación con Google Maps.",
  "errorVerifyingLocation": "Error al verificar la ubicación.",
  "locationVerifiedSuccess": "✓ Ubicación verificada. Clic para ver en el mapa.",
  "totalCost": "Costo Total ($)",
  "totalCostPlaceholder": "100",
  "linkActiveFor": "Enlace Activo por",
  "days": "{count} días",
  "createMatchButton": "Crear Partido y Obtener Enlace",
  "dateRequired": "La fecha es obligatoria.",
  "timeRequired": "La hora es obligatoria.",
  "fieldNameRequired": "El nombre de la cancha es obligatorio.",
  "locationRequired": "La ubicación es obligatoria.",
  "costRequired": "Se requiere un costo válido.",
  "locationEmpty": "La ubicación no puede estar vacía.",
  "mapLink": "(Mapa)",
  "totalCostLabel": "Costo Total",
  "playersConfirmed": "Jugadores Confirmados",
  "costPerPlayer": "Costo por Jugador",
  "addExtraSlot": "Añadir Espacio",
  "removeExtraSlot": "Quitar Espacio",
  "changeTactic": "Cambiar Táctica",
  "shareOnWhatsApp": "Compartir en WhatsApp",
  "removePlayerConfirm": "¿Quieres eliminar a {name}?",
  "removePlayerInSlotConfirm": "Esto eliminará a {name} del partido para poder quitar el espacio. ¿Continuar?",
  "playerRemoved": "{name} eliminado del partido.",
  "playerAlreadyExists": "Ya hay un jugador con este nombre en el partido.",
  "playerJoined": "¡{name} se unió al partido!",
  "playerNameRequired": "El nombre del jugador no puede estar vacío.",
  "extraSlotAdded": "Espacio de jugador extra añadido.",
  "extraSlotRemoved": "Espacio de jugador extra eliminado.",
  "tacticChanged": "Táctica cambiada a {tactic}.",
  "playersBenched": "{count} jugador(es) movido(s) a la banca porque su posición fue eliminada.",
  "whatsAppShareMessage": "⚽ *¡Bienvenido a FUTBOLMATCH!* ⚽\n\n📋 *Sumate a la lista de jugadores:*\n{link}\n\n📅 *Fecha:* {date}\n⏰ *Hora:* {time}\n🏟️ *Cancha:* {fieldName}{locationSection}",
  "whatsAppLocationSection": "\n\n📍 *Ubicación:*\n{location}{mapsLinkSection}",
  "whatsAppMapsLinkSection": "\n🗺️ *Ver en Google Maps:*\n{mapsLink}",
  "positionMoved": "Posición movida",
  "joinMatchTitle": "Unirse al Partido",
  "joinMatchSubtitle": "Ingresa tu nombre para ocupar esta posición.",
  "yourNamePlaceholder": "Tu Nombre",
  "cancel": "Cancelar",
  "confirm": "Confirmar",
  "changeTacticTitle": "Cambiar Táctica",
  "invalidTactic": "Táctica seleccionada inválida.",
  "extraSlots": "Espacios Extra",
  "footerText": "FUTBOLMATCH © 2024 - Impulsado por Gemini",
  "creatingMatch": "Creando partido...",
  "matchCreated": "¡Partido creado exitosamente!",
  "mapsLink": "Enlace de Google Maps",
  "optional": "opcional",
  "playerMoved": "Jugador movido a nueva posición",
  "matchMode": "Modo del Partido",
  "modeFree": "Modo Libre",
  "modeFreeDescription": "Cualquiera puede editar posiciones",
  "modeFreeActive": "Todos los jugadores pueden moverse y organizarse",
  "modeCoach": "Modo Técnico",
  "modeCoachDescription": "Solo el organizador controla las posiciones",
  "modeCoachActiveOrganizer": "Tú controlas todas las posiciones",
  "modeCoachActivePlayer": "Solo el organizador puede mover posiciones",
  "noPermissionToEdit": "Solo el organizador puede editar posiciones en modo técnico",
  "downloadImage": "Descargar",
  "generatingImage": "Generando imagen...",
  "imageDownloaded": "¡Imagen descargada exitosamente!",
  "imageDownloadError": "Error al descargar imagen",
  "pendingPlayers": "Jugadores Pendientes",
  "dragPlayersToField": "Arrastra jugadores a la cancha para asignar posiciones",
  "waitingForOrganizer": "Esperando que el organizador asigne posiciones",
  "removePlayer": "Eliminar jugador",
  "joinMatch": "Unirse al Partido",
  "playerJoinedPending": "¡{name} se unió! Esperando asignación de posición",
  "playerAssignedToPosition": "{name} asignado a posición",
  "playerMovedToBench": "{name} movido al banco",
  "matchCreatedTitle": "¡Partido Creado!",
  "matchCreatedSubtitle": "Guarda estos links importantes:",
  "organizerLinkTitle": "Link de ORGANIZADOR",
  "organizerLinkDescription": "¡GUARDALO! Te permite editar el partido. No lo compartas.",
  "invitePlayersTitle": "Invitar Jugadores",
  "invitePlayersHint": "Compartí este mensaje en el grupo para que los jugadores se anoten",
  "linkCopied": "¡Link copiado!",
  "sharePlayersLink": "Compartir en WhatsApp",
  "understood": "Entendido, continuar"
};


const translations = { en, es };

type Language = 'en' | 'es';
type TranslationKey = keyof typeof en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es'); // Default to Spanish

  const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations['es'][key] || key; // Fallback to Spanish, then to key
    if (vars && text) {
      Object.keys(vars).forEach(varKey => {
        const regex = new RegExp(`{${varKey}}`, 'g');
        text = text.replace(regex, String(vars[varKey] ?? ''));
      });
    }
    return text || '';
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
