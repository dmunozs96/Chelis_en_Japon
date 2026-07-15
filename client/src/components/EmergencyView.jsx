import React, { useEffect, useState } from 'react';
import { useTravelToolsData } from '../hooks/useTravelToolsData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';

const PRIVATE_KEY = 'private_emergency_contacts';

function loadPrivateContacts() {
  try { return JSON.parse(localStorage.getItem(PRIVATE_KEY) || '{}'); } catch { return {}; }
}

const telHref = (number) => `tel:${number.replace(/[^+\d]/g, '')}`;

export default function EmergencyView({ onBack }) {
  const { data, loading, error } = useTravelToolsData();
  const [privateContacts, setPrivateContacts] = useState(loadPrivateContacts);

  useEffect(() => {
    try { localStorage.setItem(PRIVATE_KEY, JSON.stringify(privateContacts)); } catch {}
  }, [privateContacts]);

  const setPrivate = (field, value) => setPrivateContacts((prev) => ({ ...prev, [field]: value }));
  const emergency = data?.emergency;

  return (
    <>
      <style>{TRAVEL_TOOL_STYLES}</style>
      <div className="travel-tool" role="main" aria-label="Emergencias">
        <nav className="travel-tool__nav">
          <button className="travel-tool__back" onClick={onBack}>← Volver</button>
          <div className="travel-tool__title">Emergencias</div>
        </nav>
        {loading && <div className="travel-loading">Cargando contactos…</div>}
        {error && <div className="travel-loading">No se pudieron cargar los contactos: {error}</div>}
        {emergency && (
          <div className="travel-tool__body">
            <div className="travel-tool__intro">Pulsa el número para llamar. Los campos personales solo se guardan en este móvil.</div>

            {[emergency.police, emergency.ambulance].map((item) => (
              <section className="travel-card travel-card--danger" key={item.number}>
                <div className="travel-card__eyebrow">Japón</div>
                <div className="travel-card__title">{item.label}</div>
                <div className="travel-card__text">{item.note}</div>
                <a className="travel-call" href={telHref(item.number)}><span>Llamar</span><span>{item.number}</span></a>
              </section>
            ))}

            <section className="travel-card">
              <div className="travel-card__eyebrow">Ayuda al viajero</div>
              <div className="travel-card__title">{emergency.visitor_hotline.label}</div>
              <div className="travel-card__text">{emergency.visitor_hotline.note}</div>
              <a className="travel-call travel-call--secondary" href={telHref(emergency.visitor_hotline.number)}><span>Llamar</span><span>{emergency.visitor_hotline.number}</span></a>
            </section>

            <section className="travel-card">
              <div className="travel-card__eyebrow">España</div>
              <div className="travel-card__title">{emergency.embassy.label}</div>
              <div className="travel-card__text">{emergency.embassy.address}<br />{emergency.embassy.note}</div>
              <a className="travel-call" href={telHref(emergency.embassy.consular_emergency)}><span>Emergencia consular</span><span>{emergency.embassy.consular_emergency}</span></a>
              <a className="travel-call travel-call--secondary" href={telHref(emergency.embassy.switchboard)}><span>Centralita</span><span>{emergency.embassy.switchboard}</span></a>
            </section>

            <section className="travel-card">
              <div className="travel-card__eyebrow">Privado · solo este dispositivo</div>
              <div className="travel-card__title">Mis contactos</div>
              <label className="travel-label">Seguro de viaje 24h
                <input className="travel-input" type="tel" inputMode="tel" placeholder="Añadir teléfono" value={privateContacts.insurance ?? ''} onChange={(e) => setPrivate('insurance', e.target.value)} />
              </label>
              {privateContacts.insurance && <a className="travel-call travel-call--secondary" href={telHref(privateContacts.insurance)}>Llamar al seguro</a>}
              <label className="travel-label">Contacto de emergencia en España
                <input className="travel-input" type="tel" inputMode="tel" placeholder="Añadir teléfono" value={privateContacts.spain ?? ''} onChange={(e) => setPrivate('spain', e.target.value)} />
              </label>
              {privateContacts.spain && <a className="travel-call travel-call--secondary" href={telHref(privateContacts.spain)}>Llamar al contacto</a>}
            </section>

            <section className="travel-card">
              <div className="travel-card__eyebrow">Fuentes oficiales</div>
              {emergency.sources.map((source) => <a className="travel-source" key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
