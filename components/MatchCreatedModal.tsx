import React, { useState } from 'react';
import type { Match } from '../types';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { useTranslation } from '../hooks/useTranslation';

interface MatchCreatedModalProps {
  match: Match;
  onClose: () => void;
}

const MatchCreatedModal: React.FC<MatchCreatedModalProps> = ({ match, onClose }) => {
  const { t } = useTranslation();
  const [copiedOrganizer, setCopiedOrganizer] = useState(false);

  const baseUrl = window.location.origin;
  const playerLink = `${baseUrl}/#/match/${match.id}`;
  const organizerLink = `${baseUrl}/#/match/${match.id}?admin=${match.organizerId}`;

  // Build the full WhatsApp message
  const getWhatsAppMessage = () => {
    const mapsLinkSection = match.locationURL
      ? t('whatsAppMapsLinkSection', { mapsLink: match.locationURL })
      : '';

    const locationSection = match.location
      ? t('whatsAppLocationSection', {
          location: match.location,
          mapsLinkSection: mapsLinkSection
        })
      : '';

    return t('whatsAppShareMessage', {
      fieldName: match.fieldName,
      date: match.date,
      time: match.time,
      locationSection: locationSection,
      link: playerLink,
    });
  };

  const copyOrganizerLink = async () => {
    try {
      await navigator.clipboard.writeText(organizerLink);
      setCopiedOrganizer(true);
      setTimeout(() => setCopiedOrganizer(false), 2000);
      toast.success(t('linkCopied') || 'Link copiado!');
    } catch (err) {
      toast.error('Error al copiar');
    }
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(getWhatsAppMessage())}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('matchCreatedTitle') || 'Partido Creado!'}</h2>
        <p className="text-gray-400 mb-6">{t('matchCreatedSubtitle') || 'Guarda estos links importantes:'}</p>
      </div>

      {/* Link de Organizador */}
      <div className="bg-purple-900 bg-opacity-50 border border-purple-500 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span className="font-bold text-purple-300">{t('organizerLinkTitle') || 'Link de ORGANIZADOR'}</span>
        </div>
        <p className="text-xs text-purple-300 mb-2">{t('organizerLinkDescription') || 'GUARDALO! Te permite editar el partido. No lo compartas.'}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={organizerLink}
            readOnly
            className="flex-1 bg-gray-800 border-gray-600 rounded px-3 py-2 text-sm text-gray-300"
          />
          <button
            onClick={copyOrganizerLink}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              copiedOrganizer ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {copiedOrganizer ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Invitar Jugadores */}
      <div className="bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-bold text-green-300">{t('invitePlayersTitle') || 'Invitar Jugadores'}</span>
        </div>
        <button
          onClick={shareOnWhatsApp}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 mb-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t('sharePlayersLink') || 'Compartir en WhatsApp'}
        </button>
        <p className="text-sm text-green-300 text-center">{t('invitePlayersHint') || 'Compartí este mensaje en el grupo para que los jugadores se anoten'}</p>
      </div>

      {/* Boton Continuar */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg"
        >
          {t('understood') || 'Entendido, continuar'}
        </button>
      </div>
    </Modal>
  );
};

export default MatchCreatedModal;
