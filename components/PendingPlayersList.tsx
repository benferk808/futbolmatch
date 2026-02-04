import React from 'react';
import type { Player } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface PendingPlayersListProps {
  players: Player[];
  onDragStart?: (player: Player) => void;
  onDragEnd?: () => void;
  onRemovePlayer?: (playerId: string) => void;
  onDropPlayerToBench?: () => void;
  canDrag: boolean;
  canRemove: boolean;
}

const PendingPlayersList: React.FC<PendingPlayersListProps> = ({
  players,
  onDragStart,
  onDragEnd,
  onRemovePlayer,
  onDropPlayerToBench,
  canDrag,
  canRemove,
}) => {
  const { t } = useTranslation();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDropPlayerToBench?.();
  };

  if (players.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-gray-800 rounded-xl shadow-lg p-6"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {t('pendingPlayers')}
        </h3>
        <span className="bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
          {players.length}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        {canDrag ? t('dragPlayersToField') : t('waitingForOrganizer')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {players.map((player) => (
          <div
            key={player.id}
            draggable={canDrag}
            onDragStart={() => onDragStart?.(player)}
            onDragEnd={onDragEnd}
            className={`bg-gray-700 rounded-lg p-3 flex items-center justify-between group ${
              canDrag ? 'cursor-move hover:bg-gray-600 hover:shadow-lg transition-all' : 'cursor-default'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {canDrag && (
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              )}
              <span className="text-white font-medium truncate">{player.name}</span>
            </div>
            {canRemove && (
              <button
                onClick={() => onRemovePlayer?.(player.id)}
                className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                title={t('removePlayer')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingPlayersList;
