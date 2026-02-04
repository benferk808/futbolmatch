
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Match, Player } from '../types';
import { TACTICS, DEFAULT_TACTICS } from '../constants';
import SoccerField from './SoccerField';
import PendingPlayersList from './PendingPlayersList';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';
import html2canvas from 'html2canvas';

interface MatchViewProps {
  initialMatch: Match;
  onMatchUpdate: (match: Match) => void;
}

const MatchView: React.FC<MatchViewProps> = ({ initialMatch, onMatchUpdate }) => {
  const { t } = useTranslation();
  const [match, setMatch] = useState<Match>(initialMatch);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [isTacticModalOpen, setTacticModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isUserOrganizer, setIsUserOrganizer] = useState<boolean>(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const [draggedPendingPlayer, setDraggedPendingPlayer] = useState<Player | null>(null);
  const [draggedFieldPlayerId, setDraggedFieldPlayerId] = useState<string | null>(null);

  // Check if current user is organizer
  useEffect(() => {
    const checkOrganizer = async () => {
      const { isOrganizer } = await import('../services/api');
      setIsUserOrganizer(isOrganizer(match.id, match));
    };
    checkOrganizer();
  }, [match.id, match]);

  // Determinar si el usuario puede editar posiciones
  const canEditPositions = useMemo(() => {
    // El organizador SIEMPRE puede editar (incluso en modo libre)
    if (isUserOrganizer) return true;
    // En modo libre, todos pueden editar
    if (match.mode === 'free') return true;
    // En modo técnico, solo el organizador (ya cubierto arriba)
    return false;
  }, [match.mode, isUserOrganizer]);

  // Separar jugadores pendientes de los que tienen posición
  const pendingPlayers = useMemo(() => {
    return match.players.filter(p => p.positionIndex === null);
  }, [match.players]);

  const assignedPlayers = useMemo(() => {
    return match.players.filter(p => p.positionIndex !== null);
  }, [match.players]);

  const totalPositions = useMemo(() => {
    const tacticDetails = TACTICS[match.type][match.tactic];
    if (!tacticDetails) return 0;
    return tacticDetails.positions.length + match.extraSlots;
  }, [match.type, match.tactic, match.extraSlots]);

  const costPerPlayer = useMemo(() => {
    const playerCount = match.players.length;
    if (playerCount === 0 && totalPositions === 0) return 0;
    const denominator = Math.max(playerCount, totalPositions);
    if (denominator === 0) return match.totalCost.toFixed(2);
    return (match.totalCost / denominator).toFixed(2);
  }, [match.players.length, match.totalCost, totalPositions]);
  
  const handleSlotClick = async (positionIndex: number, isOccupied: boolean) => {
    if (isOccupied) {
      const player = match.players.find(p => p.positionIndex === positionIndex);
      if (player && window.confirm(t('removePlayerConfirm', { name: player.name }))) {
        try {
          const { removePlayer } = await import('../services/api');
          await removePlayer(match.id, player.id);

          const updatedPlayers = match.players.filter(p => p.id !== player.id);
          const updatedMatch = { ...match, players: updatedPlayers };
          setMatch(updatedMatch);
          onMatchUpdate(updatedMatch);
          toast.success(t('playerRemoved', { name: player.name }));
        } catch (error: any) {
          toast.error(error.message || 'Failed to remove player');
        }
      }
    } else {
      setSelectedPosition(positionIndex);
      setJoinModalOpen(true);
    }
  };

  const handleJoinMatch = async () => {
    if (!newPlayerName.trim()) {
      toast.error(t('playerNameRequired'));
      return;
    }

    if(match.players.find(p => p.name.toLowerCase() === newPlayerName.trim().toLowerCase())){
      toast.error(t('playerAlreadyExists'));
      return;
    }

    try {
      const { addPlayer } = await import('../services/api');

      // Determinar dónde agregar al jugador
      let positionIndex: number | null = selectedPosition;

      // Si no hay posición seleccionada (botón general "Unirse")
      if (selectedPosition === null) {
        // Siempre agregar como pendiente (banco) cuando se usa el botón general
        positionIndex = null;
      }

      const newPlayer = await addPlayer(match.id, {
        name: newPlayerName.trim(),
        positionIndex: positionIndex,
      });

      const updatedMatch = { ...match, players: [...match.players, newPlayer] };
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);

      if (positionIndex === null) {
        toast.success(t('playerJoinedPending', { name: newPlayer.name }));
      } else {
        toast.success(t('playerJoined', { name: newPlayer.name }));
      }

      setNewPlayerName('');
      setJoinModalOpen(false);
      setSelectedPosition(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add player');
    }
  };
  
  const handleAddSlot = async () => {
    try {
      const { updateExtraSlots } = await import('../services/api');
      const newExtraSlots = match.extraSlots + 1;
      await updateExtraSlots(match.id, newExtraSlots);

      const updatedMatch = {...match, extraSlots: newExtraSlots};
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
      toast.success(t('extraSlotAdded'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to add slot');
    }
  };

  const handleRemoveSlot = async () => {
    if (match.extraSlots <= 0) return;

    const tacticDetails = TACTICS[match.type][match.tactic];
    const lastSlotIndex = tacticDetails.positions.length + match.extraSlots - 1;
    const playerInLastSlot = match.players.find(p => p.positionIndex === lastSlotIndex);

    if (playerInLastSlot) {
      if (!window.confirm(t('removePlayerInSlotConfirm', { name: playerInLastSlot.name }))) {
        return;
      }
    }

    try {
      const { updateExtraSlots, removePlayer } = await import('../services/api');

      // Si hay un jugador en el último slot, eliminarlo primero
      if (playerInLastSlot) {
        await removePlayer(match.id, playerInLastSlot.id);
      }

      const newExtraSlots = match.extraSlots - 1;
      await updateExtraSlots(match.id, newExtraSlots);

      const updatedPlayers = match.players.filter(p => p.positionIndex !== lastSlotIndex);
      const updatedMatch = {...match, players: updatedPlayers, extraSlots: newExtraSlots};
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
      toast.success(t('extraSlotRemoved'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove slot');
    }
  };

  const handleChangeTactic = async (newTactic: string) => {
    if (!canEditPositions) {
      toast.error(t('noPermissionToEdit') || 'Solo el organizador puede cambiar la táctica en modo técnico');
      setTacticModalOpen(false);
      return;
    }

    try {
      const { changeTactic, removePlayer, resetCustomPositions } = await import('../services/api');

      // Simple redistribution: keep players in the same position index if available
      const newTacticDetails = TACTICS[match.type][newTactic];
      const newMaxPositions = newTacticDetails.positions.length + match.extraSlots;

      const redistributedPlayers = match.players.filter(p => p.positionIndex < newMaxPositions);
      const playersToRemove = match.players.filter(p => p.positionIndex >= newMaxPositions);
      const playersOnBenchCount = playersToRemove.length;

      // Eliminar jugadores que quedan fuera de las posiciones disponibles
      for (const player of playersToRemove) {
        await removePlayer(match.id, player.id);
      }

      // Resetear las posiciones personalizadas de los jugadores
      const resetPlayers = redistributedPlayers.map(p => ({
        ...p,
        customX: undefined,
        customY: undefined
      }));

      await changeTactic(match.id, newTactic);

      // Resetear las posiciones personalizadas de la táctica
      await resetCustomPositions(match.id);

      const updatedMatch = {
        ...match,
        tactic: newTactic,
        players: resetPlayers,
        customPositions: {}
      };
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
      setTacticModalOpen(false);
      toast.success(t('tacticChanged', { tactic: newTactic }));
      if (playersOnBenchCount > 0) {
        toast.info(t('playersBenched', { count: playersOnBenchCount }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change tactic');
    }
  };

  const handlePlayerMove = async (playerId: string, newX: number, newY: number) => {
    if (!canEditPositions) {
      toast.error(t('noPermissionToEdit') || 'Solo el organizador puede mover jugadores en modo técnico');
      return;
    }

    try {
      const { updatePlayerPosition } = await import('../services/api');
      await updatePlayerPosition(match.id, playerId, newX, newY);

      const updatedPlayers = match.players.map(p =>
        p.id === playerId ? { ...p, customX: newX, customY: newY } : p
      );
      const updatedMatch = { ...match, players: updatedPlayers };
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
      toast.success(t('playerMoved') || 'Jugador movido');
    } catch (error: any) {
      toast.error(error.message || 'Failed to move player');
    }
  };

  const handlePositionMove = async (positionIndex: number, newX: number, newY: number) => {
    if (!canEditPositions) {
      toast.error(t('noPermissionToEdit') || 'Solo el organizador puede mover posiciones en modo técnico');
      return;
    }

    try {
      const { updateTacticPosition } = await import('../services/api');
      await updateTacticPosition(match.id, positionIndex, newX, newY);

      const updatedCustomPositions = {
        ...match.customPositions,
        [positionIndex]: { x: newX, y: newY }
      };
      const updatedMatch = { ...match, customPositions: updatedCustomPositions };
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
      toast.success(t('positionMoved') || 'Posición movida');
    } catch (error: any) {
      toast.error(error.message || 'Failed to move position');
    }
  };

  const handleShare = () => {
    const locationText = match.locationURL
      ? `${match.location}\n${match.locationURL}`
      : match.location;

    // Construir link correcto con hash
    const matchLink = `${window.location.origin}/#/match/${match.id}`;

    const text = t('whatsAppShareMessage', {
      fieldName: match.fieldName,
      date: match.date,
      time: match.time,
      location: locationText,
      organizer: match.organizerName || 'Organizador',
      link: matchLink,
    });
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!captureRef.current) return;

    const loadingToast = toast.loading(t('generatingImage') || 'Generando imagen...');

    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#1a1a1a',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `futbolmatch-${match.fieldName.replace(/\s+/g, '-')}-${match.date}.png`;
      link.click();

      toast.dismiss(loadingToast);
      toast.success(t('imageDownloaded') || 'Imagen descargada!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(t('imageDownloadError') || 'Error al descargar imagen');
      console.error('Error generating image:', error);
    }
  };

  const handlePendingPlayerDragStart = (player: Player) => {
    setDraggedPendingPlayer(player);
  };

  const handlePendingPlayerDragEnd = () => {
    setDraggedPendingPlayer(null);
  };

  const handleFieldPlayerDrag = (playerId: string) => {
    setDraggedFieldPlayerId(playerId);
  };

  const handleFieldPlayerDragEnd = () => {
    setDraggedFieldPlayerId(null);
  };

  const handleDropFieldPlayerToBench = () => {
    if (!draggedFieldPlayerId) return;
    handleDropPlayerToBench(draggedFieldPlayerId);
    setDraggedFieldPlayerId(null);
  };

  const handleAssignPendingPlayer = async (positionIndex: number) => {
    if (!draggedPendingPlayer) return;

    try {
      const { assignPlayerPosition } = await import('../services/api');
      await assignPlayerPosition(match.id, draggedPendingPlayer.id, positionIndex);

      const updatedPlayers = match.players.map(p =>
        p.id === draggedPendingPlayer.id ? { ...p, positionIndex, customX: undefined, customY: undefined } : p
      );
      const updatedMatch = { ...match, players: updatedPlayers };
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
      toast.success(t('playerAssignedToPosition', { name: draggedPendingPlayer.name }));
      setDraggedPendingPlayer(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign player');
      setDraggedPendingPlayer(null);
    }
  };

  const handleRemovePendingPlayer = async (playerId: string) => {
    const player = match.players.find(p => p.id === playerId);
    if (!player) return;

    if (!window.confirm(t('removePlayerConfirm', { name: player.name }))) {
      return;
    }

    try {
      const { removePlayer } = await import('../services/api');
      await removePlayer(match.id, playerId);

      const updatedPlayers = match.players.filter(p => p.id !== playerId);
      const updatedMatch = { ...match, players: updatedPlayers };
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);
      toast.success(t('playerRemoved', { name: player.name }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove player');
    }
  };

  const handleDropPlayerToBench = async (playerId: string) => {
    try {
      const { unassignPlayerPosition } = await import('../services/api');
      await unassignPlayerPosition(match.id, playerId);

      const updatedPlayers = match.players.map(p =>
        p.id === playerId ? { ...p, positionIndex: null, customX: undefined, customY: undefined } : p
      );
      const updatedMatch = { ...match, players: updatedPlayers };
      setMatch(updatedMatch);
      onMatchUpdate(updatedMatch);

      const player = match.players.find(p => p.id === playerId);
      toast.success(t('playerMovedToBench', { name: player?.name || '' }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to move player to bench');
    }
  };

  return (
    <div className="space-y-6">
      <div ref={captureRef} className="space-y-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-white">{match.fieldName}</h1>
          <p className="text-lg text-indigo-300">{new Date(match.date).toDateString()} at {match.time}</p>
          <p className="text-gray-400 flex items-center justify-center gap-2 mt-1">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
             {match.location}
             {match.locationURL && <a href={match.locationURL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{t('mapLink')}</a>}
          </p>
        </div>

      {/* Indicador de Modo */}
      <div className={`bg-gradient-to-r ${match.mode === 'free' ? 'from-indigo-600 to-indigo-700' : 'from-purple-600 to-purple-700'} rounded-lg p-4 text-center`}>
        <div className="flex items-center justify-center gap-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {match.mode === 'free' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <div>
            <p className="text-white font-bold text-lg">
              {match.mode === 'free' ? t('modeFree') : t('modeCoach')}
            </p>
            <p className="text-sm text-indigo-100">
              {match.mode === 'free'
                ? t('modeFreeActive')
                : isUserOrganizer
                  ? t('modeCoachActiveOrganizer')
                  : t('modeCoachActivePlayer')
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">{t('totalCostLabel')}</p>
          <p className="text-2xl font-bold text-green-400">${match.totalCost}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">{t('playersConfirmed')}</p>
          <p className="text-2xl font-bold text-white">
            <span className={match.players.length >= totalPositions ? 'text-green-400' : 'text-yellow-400'}>{match.players.length}</span> / {totalPositions}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">{t('costPerPlayer')}</p>
          <p className="text-2xl font-bold text-green-400">${costPerPlayer}</p>
        </div>
      </div>

      <SoccerField
        match={{...match, players: assignedPlayers}}
        onSlotClick={handleSlotClick}
        onPlayerMove={handlePlayerMove}
        onPositionMove={handlePositionMove}
        canEdit={canEditPositions}
        draggedPendingPlayer={draggedPendingPlayer}
        onDropPendingPlayer={handleAssignPendingPlayer}
        onDragFieldPlayer={handleFieldPlayerDrag}
      />

      {/* Lista de Jugadores Pendientes */}
      <PendingPlayersList
        players={pendingPlayers}
        onDragStart={handlePendingPlayerDragStart}
        onDragEnd={handlePendingPlayerDragEnd}
        onRemovePlayer={handleRemovePendingPlayer}
        onDropPlayerToBench={handleDropFieldPlayerToBench}
        canDrag={canEditPositions}
        canRemove={isUserOrganizer}
      />
      </div>

      {/* Botón Unirse al Partido */}
      <button
        onClick={() => {
          setSelectedPosition(null);
          setJoinModalOpen(true);
        }}
        className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        <span className="text-lg">{t('joinMatch')}</span>
      </button>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button onClick={handleAddSlot} className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">{t('addExtraSlot')}</button>
        <button onClick={handleRemoveSlot} disabled={match.extraSlots === 0} className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500">{t('removeExtraSlot')}</button>
        <button onClick={() => setTacticModalOpen(true)} className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">{t('changeTactic')}</button>
        <button onClick={handleDownloadImage} className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t('downloadImage')}
        </button>
        <button onClick={handleShare} className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors">{t('shareOnWhatsApp')}</button>
      </div>

      {isJoinModalOpen && (
        <Modal onClose={() => setJoinModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">{t('joinMatchTitle')}</h2>
          <p className="mb-4 text-gray-300">{t('joinMatchSubtitle')}</p>
          <input
            type="text"
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
            maxLength={15}
            placeholder={t('yourNamePlaceholder')}
            className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2"
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && handleJoinMatch()}
          />
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setJoinModalOpen(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white">{t('cancel')}</button>
            <button onClick={handleJoinMatch} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold">{t('confirm')}</button>
          </div>
        </Modal>
      )}

      {isTacticModalOpen && (
        <Modal onClose={() => setTacticModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">{t('changeTacticTitle')}</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(TACTICS[match.type]).map(tactic => (
              <button key={tactic} onClick={() => handleChangeTactic(tactic)} className={`py-3 rounded-lg text-lg font-semibold transition-colors ${match.tactic === tactic ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                {tactic}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MatchView;