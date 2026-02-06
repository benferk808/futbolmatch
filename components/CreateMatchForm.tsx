
import React, { useState, useEffect } from 'react';
import type { Match, MatchMode } from '../types';
import { TACTICS, DEFAULT_TACTICS, MATCH_TYPES, DURATION_OPTIONS } from '../constants';
import { TEAM_COLORS, DEFAULT_TEAM_COLOR } from '../teamColors';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

interface CreateMatchFormProps {
  onMatchCreated: (match: Match) => void;
}

const CreateMatchForm: React.FC<CreateMatchFormProps> = ({ onMatchCreated }) => {
  const { t } = useTranslation();
  const [organizerName, setOrganizerName] = useState<string>('');
  const [type, setType] = useState<number>(8);
  const [tactic, setTactic] = useState<string>(DEFAULT_TACTICS[8]);
  const [teamColor, setTeamColor] = useState<string>('#DC143C'); // Rojo por defecto
  const [teamColorSecondary, setTeamColorSecondary] = useState<string>('#000000'); // Negro por defecto
  const [mode, setMode] = useState<MatchMode>('free');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [fieldName, setFieldName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [totalCost, setTotalCost] = useState<number | ''>('');
  const [locationURL, setLocationURL] = useState<string>('');
  const [opponent, setOpponent] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTactic(DEFAULT_TACTICS[type]);
  }, [type]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!organizerName.trim()) newErrors.organizerName = t('organizerNameRequired');
    if (!date) newErrors.date = t('dateRequired');
    if (!time) newErrors.time = t('timeRequired');
    if (!fieldName.trim()) newErrors.fieldName = t('fieldNameRequired');
    if (!location.trim()) newErrors.location = t('locationRequired');
    if (totalCost === '' || isNaN(Number(totalCost)) || Number(totalCost) < 0) newErrors.totalCost = t('costRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const loadingToast = toast.loading(t('creatingMatch') || 'Creating match...');

    try {
      // Importar servicio API (usa Supabase en producción, mock en desarrollo)
      const { createMatch } = await import('../services/api');

      const result = await createMatch({
        type,
        tactic,
        durationDays,
        date,
        time,
        fieldName,
        location,
        locationURL: locationURL || undefined,
        totalCost: Number(totalCost),
        extraSlots: 0,
        organizerName: organizerName.trim(),
        opponent: opponent.trim() || undefined,
        teamColor,
        teamColorSecondary,
        mode,
      });

      toast.dismiss(loadingToast);
      toast.success(t('matchCreated') || 'Match created!');

      // Crear objeto Match para el componente
      const newMatch: Match = {
        id: result.id,
        type,
        tactic,
        durationDays,
        date,
        time,
        fieldName,
        location,
        locationURL: locationURL || undefined,
        totalCost: Number(totalCost),
        players: [],
        extraSlots: 0,
        organizerName: organizerName.trim(),
        opponent: opponent.trim() || undefined,
        customPositions: {},
        teamColor,
        teamColorSecondary,
        mode,
        organizerId: result.organizerId,
      };

      onMatchCreated(newMatch);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to create match');
      console.error('Error creating match:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">{t('createMatchTitle')}</h1>
      <p className="text-center text-gray-400 mb-8">{t('createMatchSubtitle')}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="organizerName" className="block text-sm font-medium text-gray-300 mb-1">{t('organizerName')}</label>
          <input type="text" id="organizerName" value={organizerName} onChange={e => setOrganizerName(e.target.value)} placeholder={t('organizerNamePlaceholder')} className={`w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.organizerName ? 'border-red-500' : ''}`} />
          {errors.organizerName && <p className="text-red-400 text-xs mt-1">{errors.organizerName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">{t('matchType')}</label>
            <select id="type" value={type} onChange={e => setType(Number(e.target.value))} className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {MATCH_TYPES.map(tVal => <option key={tVal} value={tVal}>{t('matchTypeOption', {type: tVal})}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="tactic" className="block text-sm font-medium text-gray-300 mb-1">{t('tactic')}</label>
            <select id="tactic" value={tactic} onChange={e => setTactic(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              {Object.keys(TACTICS[type]).map(tac => <option key={tac} value={tac}>{tac}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('teamColors') || 'Colores del equipo'}</label>

          {/* Preview de la camiseta */}
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold"
              style={{
                backgroundColor: teamColor,
                borderColor: teamColorSecondary,
                color: teamColorSecondary
              }}
            >
              10
            </div>
            <span className="ml-3 text-gray-400 text-sm">Vista previa</span>
          </div>

          {/* Color Principal */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-2">{t('primaryColor') || 'Color principal (fondo)'}</label>
            <div className="grid grid-cols-9 gap-2">
              {['#DC143C', '#002D72', '#00A651', '#FFD700', '#000000', '#FFFFFF', '#FF6600', '#7B2E8D', '#75AADB'].map((color) => (
                <button
                  key={`primary-${color}`}
                  type="button"
                  onClick={() => setTeamColor(color)}
                  className={`w-full aspect-square rounded-lg border-3 transition-all transform hover:scale-110 ${
                    teamColor === color ? 'border-white scale-110 ring-2 ring-indigo-400' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {teamColor === color && (
                    <svg className="w-full h-full p-1" fill={color === '#FFFFFF' || color === '#FFD700' ? '#000' : '#FFF'} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Secundario */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">{t('secondaryColor') || 'Color secundario (borde/número)'}</label>
            <div className="grid grid-cols-9 gap-2">
              {['#000000', '#FFFFFF', '#FFD700', '#DC143C', '#002D72', '#00A651', '#FF6600', '#7B2E8D', '#75AADB'].map((color) => (
                <button
                  key={`secondary-${color}`}
                  type="button"
                  onClick={() => setTeamColorSecondary(color)}
                  className={`w-full aspect-square rounded-lg border-3 transition-all transform hover:scale-110 ${
                    teamColorSecondary === color ? 'border-white scale-110 ring-2 ring-purple-400' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {teamColorSecondary === color && (
                    <svg className="w-full h-full p-1" fill={color === '#FFFFFF' || color === '#FFD700' ? '#000' : '#FFF'} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('matchMode')}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('free')}
              className={`p-4 rounded-lg border-2 transition-all ${
                mode === 'free'
                  ? 'border-indigo-500 bg-indigo-500 bg-opacity-20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  mode === 'free' ? 'border-indigo-400' : 'border-gray-500'
                }`}>
                  {mode === 'free' && <div className="w-3 h-3 rounded-full bg-indigo-400"></div>}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-white">{t('modeFree')}</div>
                  <div className="text-xs text-gray-400 mt-1">{t('modeFreeDescription')}</div>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode('coach')}
              className={`p-4 rounded-lg border-2 transition-all ${
                mode === 'coach'
                  ? 'border-purple-500 bg-purple-500 bg-opacity-20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  mode === 'coach' ? 'border-purple-400' : 'border-gray-500'
                }`}>
                  {mode === 'coach' && <div className="w-3 h-3 rounded-full bg-purple-400"></div>}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-white">{t('modeCoach')}</div>
                  <div className="text-xs text-gray-400 mt-1">{t('modeCoachDescription')}</div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">{t('date')}</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} min={today} className={`w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.date ? 'border-red-500' : ''}`} />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">{t('time')}</label>
              <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className={`w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.time ? 'border-red-500' : ''}`} />
              {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
            </div>
        </div>

        <div>
            <label htmlFor="fieldName" className="block text-sm font-medium text-gray-300 mb-1">{t('fieldName')}</label>
            <input type="text" id="fieldName" value={fieldName} onChange={e => setFieldName(e.target.value)} placeholder={t('fieldNamePlaceholder')} className={`w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.fieldName ? 'border-red-500' : ''}`} />
            {errors.fieldName && <p className="text-red-400 text-xs mt-1">{errors.fieldName}</p>}
        </div>
        
        <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">{t('location')}</label>
            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder={t('locationPlaceholder')} className={`w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.location ? 'border-red-500' : ''}`} />
            {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
        </div>

        <div>
            <label htmlFor="locationURL" className="block text-sm font-medium text-gray-300 mb-1">{t('mapsLink')} ({t('optional')})</label>
            <div className="flex gap-2">
              <input type="url" id="locationURL" value={locationURL} onChange={e => setLocationURL(e.target.value)} placeholder="https://maps.google.com/..." className="flex-1 bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              <button
                type="button"
                onClick={() => {
                  const searchQuery = fieldName || location || '';
                  if (searchQuery.trim()) {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery.trim())}`, '_blank');
                  } else {
                    window.open('https://www.google.com/maps', '_blank');
                  }
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors flex items-center gap-2 whitespace-nowrap"
                title="Buscar en Google Maps"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="hidden sm:inline">Buscar en Maps</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Buscá la cancha en Maps, copiá el link y pegalo acá</p>
        </div>

        <div>
            <label htmlFor="opponent" className="block text-sm font-medium text-gray-300 mb-1">{t('opponent')} ({t('optional')})</label>
            <input type="text" id="opponent" value={opponent} onChange={e => setOpponent(e.target.value)} placeholder={t('opponentPlaceholder')} className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="totalCost" className="block text-sm font-medium text-gray-300 mb-1">{t('totalCost')}</label>
              <input type="number" id="totalCost" value={totalCost} onChange={e => setTotalCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder={t('totalCostPlaceholder')} className={`w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.totalCost ? 'border-red-500' : ''}`} />
              {errors.totalCost && <p className="text-red-400 text-xs mt-1">{errors.totalCost}</p>}
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">{t('linkActiveFor')}</label>
              <select id="duration" value={durationDays} onChange={e => setDurationDays(Number(e.target.value))} className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                {DURATION_OPTIONS.map(d => <option key={d} value={d}>{t('days', {count: d})}</option>)}
              </select>
            </div>
        </div>

        <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
          {t('createMatchButton')}
        </button>
      </form>
    </div>
  );
};

export default CreateMatchForm;
