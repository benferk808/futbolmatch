
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

// Componente SVG de camiseta
const JerseyIcon: React.FC<{ fillColor: string; strokeColor: string }> = ({ fillColor, strokeColor }) => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
  >
    {/* Camiseta principal */}
    <path
      d="M20 25 L35 20 L40 30 L45 25 L55 25 L60 30 L65 20 L80 25 L85 45 L75 50 L75 85 L25 85 L25 50 L15 45 Z"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth="3"
    />
    {/* Cuello */}
    <path
      d="M45 25 Q50 32 55 25"
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
    />
    {/* Línea decorativa en mangas */}
    <path
      d="M25 35 L35 32"
      stroke={strokeColor}
      strokeWidth="2"
      opacity="0.6"
    />
    <path
      d="M75 35 L65 32"
      stroke={strokeColor}
      strokeWidth="2"
      opacity="0.6"
    />
  </svg>
);

// Componente SVG de camiseta vacía (para posiciones sin jugador)
const EmptyJerseyIcon: React.FC<{ fillColor: string; strokeColor: string; isDashed?: boolean }> = ({ fillColor, strokeColor, isDashed = false }) => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
  >
    {/* Camiseta principal */}
    <path
      d="M20 25 L35 20 L40 30 L45 25 L55 25 L60 30 L65 20 L80 25 L85 45 L75 50 L75 85 L25 85 L25 50 L15 45 Z"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth="3"
      strokeDasharray={isDashed ? "5,5" : "none"}
    />
    {/* Signo + en el centro */}
    <text
      x="50"
      y="62"
      textAnchor="middle"
      fontSize="30"
      fill="white"
      opacity="0.8"
      fontWeight="300"
    >
      +
    </text>
  </svg>
);

const PlayerSlot: React.FC<PlayerSlotProps> = ({ player, onClick, isExtra = false, role, onDragStart, onDragEnd, isDraggable = false, teamColor = '#667eea', teamColorSecondary }) => {
  const baseClasses = "relative w-28 h-32 md:w-40 md:h-48 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105";

  // Función para determinar si el texto debe ser blanco o negro según el fondo
  const getTextColor = (hexColor: string) => {
    try {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#000000' : '#FFFFFF';
    } catch {
      return '#FFFFFF';
    }
  };

  // Función para hacer el color un poco más claro para el borde
  const getBorderColor = (hexColor: string) => {
    try {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const lighten = (c: number) => Math.min(255, c + 60);
      return `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`;
    } catch {
      return '#FFFFFF';
    }
  };

  if (player) {
    const strokeColor = teamColorSecondary || getBorderColor(teamColor);
    const textColor = getTextColor(teamColor);

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
        title="Arrastra para mover"
      >
        {/* Sombra proyectada sobre el pasto */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-4 md:w-28 md:h-6 rounded-full opacity-30"
          style={{ backgroundColor: '#000', filter: 'blur(4px)' }}
        />

        {/* Camiseta */}
        <div className="relative w-24 h-28 md:w-36 md:h-44">
          <JerseyIcon fillColor={teamColor} strokeColor={strokeColor} />
          {/* Nombre del jugador sobre la camiseta */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: textColor }}
          >
            <span className="text-sm md:text-base font-bold text-center leading-tight px-1" style={{
              textShadow: textColor === '#FFFFFF' ? '0 1px 3px rgba(0,0,0,0.9)' : '0 1px 3px rgba(255,255,255,0.6)',
              maxWidth: '85%',
              lineHeight: '1.1',
            }}>
              {player.name.length > 10 ? player.name.substring(0, 10) : player.name}
            </span>
          </div>
        </div>
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

  const getEmptyColors = () => {
    if (isExtra) {
      return { bg: 'rgb(75, 85, 99)', border: 'rgb(156, 163, 175)', isDashed: false };
    }
    if (role && roleColors[role]) {
      return { bg: roleColors[role].bg, border: roleColors[role].border, isDashed: false };
    }
    return { bg: 'rgba(0, 0, 0, 0.4)', border: 'rgb(209, 213, 219)', isDashed: true };
  };

  const emptyColors = getEmptyColors();

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
      title={isDraggable ? "Arrastra para mover esta posición" : "Clic para agregar jugador"}
    >
      <div className="relative w-24 h-28 md:w-36 md:h-44">
        <EmptyJerseyIcon
          fillColor={emptyColors.bg}
          strokeColor={emptyColors.border}
          isDashed={emptyColors.isDashed}
        />
      </div>
    </div>
  );
};

export default PlayerSlot;
