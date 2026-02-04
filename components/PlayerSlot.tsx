
import React from 'react';
import type { Player, Position } from '../types';

interface PlayerSlotProps {
  player?: Player;
  onClick: () => void;
  isExtra?: boolean;
  role?: Position['role'];
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDraggable?: boolean;
  teamColor?: string;
  teamColorSecondary?: string;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({ player, onClick, isExtra = false, role, onDragStart, onDragEnd, isDraggable = false, teamColor = '#667eea', teamColorSecondary }) => {
  const baseClasses = "relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-lg border-4";
  const textClasses = "text-xs md:text-sm font-bold text-center break-words px-1";

  // Función para determinar si el texto debe ser blanco o negro según el fondo
  const getTextColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  // Función para hacer el color un poco más claro para el borde (fallback si no hay color secundario)
  const getBorderColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const lighten = (c: number) => Math.min(255, c + 40);
    return `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`;
  };

  if (player) {
    // Usar color secundario si existe, sino calcular automáticamente
    const borderColor = teamColorSecondary || getBorderColor(teamColor);
    // El texto usa el color secundario si existe, sino calcula según brillo del fondo
    const textColor = teamColorSecondary || getTextColor(teamColor);

    return (
      <div
        onClick={onClick}
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          onDragStart?.();
        }}
        onDragEnd={onDragEnd}
        className={`${baseClasses} cursor-move hover:shadow-2xl`}
        style={{
          backgroundColor: teamColor,
          borderColor: borderColor,
          color: textColor
        }}
        title="Arrastra para mover"
      >
        <span className={textClasses}>{player.name}</span>
      </div>
    );
  }

  const roleColors = {
    GK: 'bg-yellow-500/80 border-yellow-300',
    DF: 'bg-blue-500/80 border-blue-300',
    MF: 'bg-green-600/80 border-green-400',
    FW: 'bg-red-500/80 border-red-300',
  };

  const emptyClasses = isExtra
    ? "bg-gray-600 border-gray-400 hover:bg-gray-500"
    : role ? roleColors[role] : "bg-black bg-opacity-30 border-dashed border-gray-300 hover:bg-opacity-50 hover:border-solid";

  const cursorClass = isDraggable ? "cursor-move" : "cursor-pointer";

  return (
    <div
      onClick={onClick}
      draggable={isDraggable}
      onDragStart={(e) => {
        if (isDraggable) {
          e.dataTransfer.effectAllowed = 'move';
          onDragStart?.();
        }
      }}
      onDragEnd={onDragEnd}
      className={`${baseClasses} ${emptyClasses} ${cursorClass}`}
      title={isDraggable ? "Arrastra para mover esta posición" : "Clic para agregar jugador"}
    >
      <span className="text-3xl font-light text-white opacity-80">+</span>
    </div>
  );
};

export default PlayerSlot;