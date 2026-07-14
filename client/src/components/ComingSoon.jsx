import React from 'react';

/* ---------------------------------------------------------------
   ComingSoon
   Pantalla placeholder para tabs todavía no implementadas.
   --------------------------------------------------------------- */

const STYLES = `
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 144px);
  padding: var(--page-padding);
  background: var(--bg-secondary);
  text-align: center;
  gap: 12px;
}

.coming-soon__icon {
  font-size: 56px;
  line-height: 1;
  margin-bottom: 8px;
}

.coming-soon__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--label-primary);
  letter-spacing: -0.5px;
}

.coming-soon__subtitle {
  font-size: 15px;
  color: var(--label-secondary);
  font-weight: 400;
}
`;

const ICON_MAP = {
  'Mapa':         '🗺',
  'Restaurantes': '🍜',
  'Billetes':     '🎫',
};

export default function ComingSoon({ label }) {
  const icon = ICON_MAP[label] ?? '🔜';

  return (
    <>
      <style>{STYLES}</style>
      <div className="coming-soon" role="main" aria-label={`${label} — próximamente`}>
        <div className="coming-soon__icon" aria-hidden="true">{icon}</div>
        <h2 className="coming-soon__title">{label}</h2>
        <p className="coming-soon__subtitle">Disponible próximamente</p>
      </div>
    </>
  );
}
