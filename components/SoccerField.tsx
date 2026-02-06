
import React, { useState, useRef } from 'react';
import type { Match, Position, Player } from '../types';
import { TACTICS } from '../constants';
import PlayerSlot from './PlayerSlot';
import { useTranslation } from '../hooks/useTranslation';

interface SoccerFieldProps {
  match: Match;
  onSlotClick: (positionIndex: number, isOccupied: boolean) => void;
  onPlayerMove?: (playerId: string, newX: number, newY: number) => void;
  onPositionMove?: (positionIndex: number, newX: number, newY: number) => void;
  canEdit?: boolean;
  draggedPendingPlayer?: Player | null;
  onDropPendingPlayer?: (positionIndex: number) => void;
  onDragFieldPlayer?: (playerId: string) => void;
}

const SoccerField: React.FC<SoccerFieldProps> = ({ match, onSlotClick, onPlayerMove, onPositionMove, canEdit = true, draggedPendingPlayer, onDropPendingPlayer, onDragFieldPlayer }) => {
  const { t } = useTranslation();
  const tacticDetails = TACTICS[match.type]?.[match.tactic];
  const playersByPosition = new Map(match.players.map(p => [p.positionIndex, p]));
  const fieldRef = useRef<HTMLDivElement>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [draggedPosition, setDraggedPosition] = useState<number | null>(null);

  const handleDragStart = (player: Player | null, positionIndex: number) => {
    if (player) {
      setDraggedPlayer(player);
      // Notificar al padre que se está arrastrando un jugador de la cancha
      onDragFieldPlayer?.(player.id);
    } else {
      setDraggedPosition(positionIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
    setDraggedPosition(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!fieldRef.current) return;

    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Limitar a los bordes de la cancha
    const clampedX = Math.max(10, Math.min(90, x));
    const clampedY = Math.max(5, Math.min(95, y));

    // Si se está arrastrando un jugador pendiente, buscar la posición más cercana vacía
    if (draggedPendingPlayer && onDropPendingPlayer) {
      const emptyPositionIndex = findClosestEmptyPosition(clampedX, clampedY);
      if (emptyPositionIndex !== null) {
        onDropPendingPlayer(emptyPositionIndex);
      }
      return;
    }

    if (draggedPlayer && onPlayerMove) {
      onPlayerMove(draggedPlayer.id, clampedX, clampedY);
    } else if (draggedPosition !== null && onPositionMove) {
      onPositionMove(draggedPosition, clampedX, clampedY);
    }

    setDraggedPlayer(null);
    setDraggedPosition(null);
  };

  // Función para encontrar la posición vacía más cercana al punto de drop
  const findClosestEmptyPosition = (dropX: number, dropY: number): number | null => {
    if (!tacticDetails) return null;

    let closestIndex: number | null = null;
    let closestDistance = Infinity;

    // Revisar posiciones de la táctica
    tacticDetails.positions.forEach((pos: Position, index: number) => {
      const player = playersByPosition.get(index);
      if (!player) { // Posición vacía
        let posX = pos.x;
        let posY = pos.y;

        // Usar posición personalizada si existe
        if (match.customPositions?.[index]) {
          posX = match.customPositions[index].x;
          posY = match.customPositions[index].y;
        }

        const distance = Math.sqrt(Math.pow(dropX - posX, 2) + Math.pow(dropY - posY, 2));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    // También revisar slots extra
    for (let i = 0; i < match.extraSlots; i++) {
      const extraIndex = tacticDetails.positions.length + i;
      const player = playersByPosition.get(extraIndex);
      if (!player) {
        // Los slots extra no tienen posición fija, usar distancia al centro inferior
        const distance = Math.sqrt(Math.pow(dropX - 50, 2) + Math.pow(dropY - 95, 2));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = extraIndex;
        }
      }
    }

    return closestIndex;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const renderField = () => {
    if (!tacticDetails) {
      return <p className="text-center text-red-500">{t('invalidTactic')}</p>;
    }

    return tacticDetails.positions.map((pos: Position, index: number) => {
        const player = playersByPosition.get(index);

        // Orden de prioridad: posición del jugador > posición personalizada de la táctica > posición base
        let xPos = pos.x;
        let yPos = pos.y;

        if (player?.customX !== undefined) {
          xPos = player.customX;
          yPos = player.customY!;
        } else if (match.customPositions?.[index]) {
          xPos = match.customPositions[index].x;
          yPos = match.customPositions[index].y;
        }

        return (
            <div
                key={`pos-${index}`}
                className="absolute z-10"
                style={{ top: `${yPos}%`, left: `${xPos}%`, transform: 'translate(-50%, -50%)' }}
            >
                <PlayerSlot
                    player={player}
                    role={pos.role}
                    onClick={() => {
                      // Si hay un jugador pendiente siendo arrastrado, asignarlo a esta posición
                      if (draggedPendingPlayer && !player && onDropPendingPlayer) {
                        onDropPendingPlayer(index);
                      } else {
                        onSlotClick(index, !!player);
                      }
                    }}
                    onDragStart={() => handleDragStart(player || null, index)}
                    onDragEnd={handleDragEnd}
                    isDraggable={canEdit}
                    teamColor={match.teamColor}
                    teamColorSecondary={match.teamColorSecondary}
                />
            </div>
        );
    });
  };

  // Manejar drop en la zona de suplentes
  const handleDropOnBench = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Si hay un jugador pendiente siendo arrastrado, asignarlo al primer slot vacío
    if (draggedPendingPlayer && onDropPendingPlayer && tacticDetails) {
      for (let i = 0; i < match.extraSlots; i++) {
        const extraIndex = tacticDetails.positions.length + i;
        const player = playersByPosition.get(extraIndex);
        if (!player) {
          onDropPendingPlayer(extraIndex);
          return;
        }
      }
    }
  };

  const renderExtraSlots = () => {
      if (match.extraSlots === 0) return null;

      const extraSlotItems = Array.from({ length: match.extraSlots }).map((_, index) => {
          const positionIndex = (tacticDetails?.positions.length || 0) + index;
          const player = playersByPosition.get(positionIndex);
          return (
            <PlayerSlot
              key={`extra-${positionIndex}`}
              player={player}
              onClick={() => {
                // Si hay un jugador pendiente siendo arrastrado, asignarlo a este espacio extra
                if (draggedPendingPlayer && !player && onDropPendingPlayer) {
                  onDropPendingPlayer(positionIndex);
                } else {
                  onSlotClick(positionIndex, !!player);
                }
              }}
              isExtra={true}
              onDragStart={() => handleDragStart(player || null, positionIndex)}
              onDragEnd={handleDragEnd}
              isDraggable={canEdit && !!player}
              teamColor={match.teamColor}
              teamColorSecondary={match.teamColorSecondary}
            />
          );
      });

      return (
          <div
            onDrop={handleDropOnBench}
            onDragOver={handleDragOver}
            className={`${draggedPendingPlayer ? 'bg-yellow-500 bg-opacity-20 border-2 border-dashed border-yellow-500' : ''}`}
          >
            <h3 className="text-center font-bold mt-4 text-gray-400 border-t border-gray-700 pt-4">{t('substituteBench')}</h3>
            <div className="flex flex-wrap justify-center gap-4 p-4">
                {extraSlotItems}
            </div>
          </div>
      );
  };

  const getDragMessage = () => {
    if (draggedPlayer) {
      return `Arrastra a ${draggedPlayer.name}`;
    } else if (draggedPosition !== null) {
      return `Moviendo posición`;
    }
    return '';
  };

  // Colores para la cancha
  const grassDark = '#2d5a27';
  const grassLight = '#3d7a37';
  const lineColor = 'rgba(255, 255, 255, 0.9)';

  // Generar franjas de pasto (10 franjas)
  const grassStripes = Array.from({ length: 10 }, (_, i) => (
    <div
      key={`grass-${i}`}
      className="absolute w-full"
      style={{
        top: `${i * 10}%`,
        height: '10%',
        backgroundColor: i % 2 === 0 ? grassDark : grassLight,
      }}
    />
  ));

  return (
    <div className="border-4 rounded-lg overflow-hidden shadow-2xl" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
      <div
        ref={fieldRef}
        className="relative aspect-[7/10]"
        style={{ backgroundColor: grassDark }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
       {/* Franjas de pasto */}
       {grassStripes}

       {/* Field Markings - Línea central */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[5px] z-[1]" style={{ backgroundColor: lineColor }}></div>
       {/* Círculo central */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 md:h-60 md:w-60 rounded-full z-[1]" style={{ border: `5px solid ${lineColor}` }}></div>
       {/* Punto central */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 md:h-7 md:w-7 rounded-full z-[1]" style={{ backgroundColor: lineColor }}></div>

       {/* Goal Areas - Áreas grandes */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 h-24 md:h-36 w-3/5 md:w-1/2 rounded-b-lg z-[1]" style={{ borderLeft: `5px solid ${lineColor}`, borderRight: `5px solid ${lineColor}`, borderBottom: `5px solid ${lineColor}` }}></div>
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 md:h-36 w-3/5 md:w-1/2 rounded-t-lg z-[1]" style={{ borderLeft: `5px solid ${lineColor}`, borderRight: `5px solid ${lineColor}`, borderTop: `5px solid ${lineColor}` }}></div>

       {/* Área chica superior */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 h-12 md:h-18 w-2/5 md:w-1/3 rounded-b-md z-[1]" style={{ borderLeft: `5px solid ${lineColor}`, borderRight: `5px solid ${lineColor}`, borderBottom: `5px solid ${lineColor}` }}></div>
       {/* Área chica inferior */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-12 md:h-18 w-2/5 md:w-1/3 rounded-t-md z-[1]" style={{ borderLeft: `5px solid ${lineColor}`, borderRight: `5px solid ${lineColor}`, borderTop: `5px solid ${lineColor}` }}></div>

       {/* Arco superior */}
       <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 md:w-44 h-6 md:h-9 z-[2]" style={{
         backgroundColor: '#ffffff',
         borderRadius: '0 0 8px 8px',
         boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)'
       }}>
         {/* Red del arco */}
         <div className="absolute inset-0 opacity-30" style={{
           backgroundImage: 'repeating-linear-gradient(90deg, #666 0px, #666 1px, transparent 1px, transparent 6px), repeating-linear-gradient(0deg, #666 0px, #666 1px, transparent 1px, transparent 6px)',
           borderRadius: '0 0 8px 8px'
         }}></div>
       </div>

       {/* Arco inferior */}
       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 md:w-44 h-6 md:h-9 z-[2]" style={{
         backgroundColor: '#ffffff',
         borderRadius: '8px 8px 0 0',
         boxShadow: '0 -4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.2)'
       }}>
         {/* Red del arco */}
         <div className="absolute inset-0 opacity-30" style={{
           backgroundImage: 'repeating-linear-gradient(90deg, #666 0px, #666 1px, transparent 1px, transparent 6px), repeating-linear-gradient(0deg, #666 0px, #666 1px, transparent 1px, transparent 6px)',
           borderRadius: '8px 8px 0 0'
         }}></div>
       </div>

       {/* Banderines de córner */}
       {/* Esquina superior izquierda */}
       <div className="absolute top-2 left-2 z-[2]">
         <div className="w-2 h-8 md:h-10 bg-yellow-400 rounded-sm" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}></div>
         <div className="absolute -top-4 -left-2 w-5 h-4 bg-red-500" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }}></div>
       </div>
       {/* Esquina superior derecha */}
       <div className="absolute top-2 right-2 z-[2]">
         <div className="w-2 h-8 md:h-10 bg-yellow-400 rounded-sm" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}></div>
         <div className="absolute -top-4 -right-2 w-5 h-4 bg-red-500" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }}></div>
       </div>
       {/* Esquina inferior izquierda */}
       <div className="absolute bottom-2 left-2 z-[2]">
         <div className="w-2 h-8 md:h-10 bg-yellow-400 rounded-sm" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}></div>
         <div className="absolute -bottom-4 -left-2 w-5 h-4 bg-red-500" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }}></div>
       </div>
       {/* Esquina inferior derecha */}
       <div className="absolute bottom-2 right-2 z-[2]">
         <div className="w-2 h-8 md:h-10 bg-yellow-400 rounded-sm" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}></div>
         <div className="absolute -bottom-4 -right-2 w-5 h-4 bg-red-500" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }}></div>
       </div>

        {renderField()}

        {/* Mensaje de ayuda cuando se está arrastrando */}
        {(draggedPlayer || draggedPosition !== null) && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg text-center pointer-events-none z-50">
            <p className="font-bold">{getDragMessage()}</p>
            <p className="text-sm">Suelta donde quieras posicionarlo</p>
          </div>
        )}
      </div>
      {renderExtraSlots()}
    </div>
  );
};

export default SoccerField;
