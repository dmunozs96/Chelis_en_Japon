import React from 'react';

export default function RecoverableState({ title = 'No se pudo cargar', detail, onRetry }) {
  return (
    <section className="recoverable-state" role="alert">
      <h2>{title}</h2>
      {detail && <p>{detail}</p>}
      <div>
        <button type="button" onClick={onRetry ?? (() => window.location.reload())}>Reintentar</button>
        <a href="/">Volver a inicio</a>
      </div>
    </section>
  );
}
