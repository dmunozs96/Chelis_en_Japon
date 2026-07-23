import React, { useEffect, useMemo, useState } from 'react';
import { useTravelToolsData } from '../hooks/useTravelToolsData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';
import Icon from './ui/Icon.jsx';

const RATE_KEY = 'eur_jpy_rate';
const EXTRA_STYLES = `
.currency-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.currency-toggle button { padding: 10px; border: 1px solid var(--glass-border); border-radius: 10px; background: var(--bg-surface); color: var(--label-secondary); font: 600 14px var(--font); }
.currency-toggle button.active { background: var(--paper-100); border-color: var(--paper-100); color: var(--ink-1000); }
.currency-amount { width: 100%; margin-top: 20px; padding: 14px 0; border: 0; border-bottom: 1px solid var(--separator); border-radius: 0; background: transparent; color: var(--paper-100); font: 650 38px var(--font-display); font-variant-numeric:tabular-nums; text-align: right; }
.currency-result { margin-top: 20px; color: var(--paper-100); font-family:var(--font-display); font-size: 42px; font-weight: 650; font-variant-numeric:tabular-nums; text-align: right; word-break: break-word; }
.currency-result-label { color: var(--label-secondary); font-size: 13px; text-align: right; }
.currency-rate-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.currency-rate-row input { flex: 1; min-width: 0; }
`;

const parseNumber = (value) => Number(String(value).replace(',', '.'));

export default function CurrencyConverterView({ onBack }) {
  const { data, loading, error } = useTravelToolsData();
  const currency = data?.currency;
  const [direction, setDirection] = useState('jpy');
  const [amount, setAmount] = useState('1000');
  const [rate, setRate] = useState(null);

  useEffect(() => {
    if (!currency || rate !== null) return;
    try {
      const saved = Number(localStorage.getItem(RATE_KEY));
      setRate(saved > 0 ? saved : currency.default_rate);
    } catch { setRate(currency.default_rate); }
  }, [currency, rate]);

  useEffect(() => {
    if (rate > 0) {
      try { localStorage.setItem(RATE_KEY, String(rate)); } catch {}
    }
  }, [rate]);

  const result = useMemo(() => {
    const numericAmount = parseNumber(amount);
    if (!Number.isFinite(numericAmount) || !rate) return null;
    return direction === 'jpy' ? numericAmount / rate : numericAmount * rate;
  }, [amount, rate, direction]);

  const resultText = result === null ? '—' : direction === 'jpy'
    ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(result)
    : new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(result);

  return (
    <>
      <style>{TRAVEL_TOOL_STYLES}{EXTRA_STYLES}</style>
      <div className="travel-tool" role="main" aria-label="Conversor yen euro">
        <nav className="travel-tool__nav"><button className="travel-tool__back" onClick={onBack}><Icon name="back" size={20}/> Volver</button><div className="travel-tool__title">Conversor ¥ / €</div></nav>
        {loading && <div className="travel-loading">Cargando conversor…</div>}
        {error && <div className="travel-loading">No se pudo cargar el conversor: {error}</div>}
        {currency && rate !== null && (
          <div className="travel-tool__body">
            <section className="travel-card">
              <div className="currency-toggle">
                <button className={direction === 'jpy' ? 'active' : ''} onClick={() => { setDirection('jpy'); setAmount('1000'); }}>¥ → €</button>
                <button className={direction === 'eur' ? 'active' : ''} onClick={() => { setDirection('eur'); setAmount('10'); }}>€ → ¥</button>
              </div>
              <input className="currency-amount" inputMode="decimal" aria-label={direction === 'jpy' ? 'Cantidad en yenes' : 'Cantidad en euros'} value={amount} onChange={(event) => setAmount(event.target.value)} />
              <div className="currency-result">{resultText}</div>
              <div className="currency-result-label">Resultado orientativo</div>
            </section>

            <section className="travel-card">
              <div className="travel-card__eyebrow">Tipo utilizado</div>
              <div className="currency-rate-row"><span>1 € =</span><input className="travel-input" style={{ marginTop: 0 }} type="number" min="1" step="0.01" inputMode="decimal" value={rate} onChange={(event) => setRate(Number(event.target.value))} /><span>¥</span></div>
              <div className="travel-card__text">Referencia inicial: {new Date(`${currency.rate_date}T00:00:00`).toLocaleDateString('es-ES')} · Puedes sustituirla por el cambio real de tu tarjeta.</div>
              <button className="travel-call travel-call--secondary" style={{ width: '100%', border: 0, justifyContent: 'center' }} onClick={() => setRate(currency.default_rate)}>Restaurar tipo del BCE</button>
            </section>

            <section className="travel-card"><div className="travel-warning">{currency.note}</div><a className="travel-source" href={currency.source} target="_blank" rel="noreferrer">Fuente: Banco Central Europeo ↗</a></section>
          </div>
        )}
      </div>
    </>
  );
}
