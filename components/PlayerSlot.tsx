
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
  const baseClasses = "relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110";
  const textClasses = "text-base md:text-lg font-bold text-center break-words px-1 drop-shadow-sm";

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
        className={`${baseClasses} cursor-move`}
        style={{
          backgroundColor: teamColor,
          borderWidth: '5px',
          borderStyle: 'solid',
          borderColor: borderColor,
          color: textColor,
          boxShadow: `0 4px 15px ${teamColor}80, 0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`,
        }}
        title="Arrastra para mover"
      >
        <span className={textClasses}>{player.name}</span>
      </div>
    );
  }

  const roleColors = {
    GK: { bg: 'rgba(234, 179, 8, 0.8)', border: '#fde047' },
    DF: { bg: 'rgba(59, 130, 246, 0.8)', border: '#93c5fd' },
    MF: { bg: 'rgba(22, 163, 74, 0.8)', border: '#86efac' },
    FW: { bg: 'rgba(239, 68, 68, 0.8)', border: '#fca5a5' },
  };

  const cursorClass = isDraggable ? "cursor-move" : "cursor-pointer";

  const emptyStyle = isExtra
    ? {
        backgroundColor: 'rgb(75, 85, 99)',
        borderWidth: '5px',
        borderStyle: 'solid',
        borderColor: 'rgb(156, 163, 175)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      }
    : role && roleColors[role]
      ? {
          backgroundColor: roleColors[role].bg,
          borderWidth: '5px',
          borderStyle: 'solid',
          borderColor: roleColors[role].border,
          boxShadow: `0 4px 10px rgba(0,0,0,0.3)`,
        }
      : {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: '5px',
          borderStyle: 'dashed',
          borderColor: 'rgb(209, 213, 219)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        };

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
      className={`${baseClasses} ${cursorClass} hover:opacity-90`}
      style={emptyStyle}
      title={isDraggable ? "Arrastra para mover esta posición" : "Clic para agregar jugador"}
    >
      <span className="text-3xl font-light text-white opacity-80">+</span>
    </div>
  );
};

export default PlayerSlot;