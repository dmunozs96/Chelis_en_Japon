import React, { useMemo, useState } from 'react';
import { useShoppingGuideData } from '../hooks/useShoppingGuideData.js';
import { useTravelToolsData } from '../hooks/useTravelToolsData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';

const STYLES = `
.shop-tabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}.shop-tab{flex:none;border:1px solid var(--glass-border);border-radius:999px;padding:8px 13px;background:var(--bg-surface);color:var(--label-secondary);font:12px var(--font);font-weight:600}.shop-tab--active{border-color:var(--accent);color:#fff;background:var(--accent)}
.shop-filters{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin-top:4px}.shop-filter{flex:none;border:1px solid var(--glass-border);border-radius:999px;padding:6px 10px;background:var(--bg-surface);color:var(--label-secondary);font:12px var(--font)}.shop-filter--active{border-color:var(--accent);color:#fff;background:var(--accent)}
.shop-store__name{color:var(--label-primary);font-size:16px;font-weight:700}.shop-store__zone{display:block;color:var(--accent);font-size:11px;font-weight:700;text-transform:uppercase;margin-top:2px}.shop-store__meta{margin-top:6px;color:var(--label-secondary);font-size:13px;line-height:1.5}.shop-store__meta strong{color:var(--label-primary)}
.shop-needs-confirm{display:inline-block;margin-top:6px;padding:3px 8px;border-radius:7px;background:rgba(255,159,10,.18);color:#ffcf8a;font-size:11px;font-weight:700}
.shop-route__badge{display:inline-block;padding:3px 9px;border-radius:7px;background:var(--bg-secondary);color:var(--accent);font-size:11px;font-weight:700;text-transform:uppercase}
.shop-calc-row{display:flex;align-items:center;gap:8px;margin-top:10px}.shop-calc-row input[type=number]{flex:1}
.shop-calc-toggle{display:flex;align-items:center;gap:8px;margin-top:10px;color:var(--label-primary);font-size:14px}
.shop-calc-result{margin-top:14px;color:var(--label-primary);font-size:26px;font-weight:800;text-align:right}
.shop-calc-result-label{color:var(--label-secondary);font-size:12px;text-align:right}
.shop-wishlist-group{margin-top:10px}.shop-wishlist-group h3{color:var(--label-primary);font-size:13px;text-transform:uppercase;letter-spacing:.4px}
.shop-wishlist-item{margin-top:6px;padding:8px 10px;border-radius:9px;background:var(--bg-secondary);font-size:13px;color:var(--label-secondary)}.shop-wishlist-item strong{color:var(--label-primary)}
`;

const TABS = ['Tiendas', 'Ruta 24 ago', 'Normativa', 'Calculadora'];
const PRIORITY_LABEL = { imprescindible: 'Imprescindible', oportunidad: 'Oportunidad', si_hay_precio: 'Solo si hay precio' };

function StoreCard({ store, zoneById }) {
  const zone = zoneById.get(store.zone_id);
  return (
    <div className="travel-card">
      <span className="shop-store__name">{store.name}</span>
      <span className="shop-store__zone">{zone ? `${zone.name} · ${zone.city}` : ''}</span>
      <div className="shop-store__meta"><strong>Dirección:</strong> {store.address}</div>
      <div className="shop-store__meta"><strong>Horario:</strong> {store.hours}</div>
      <div className="shop-store__meta">{store.specialty}</div>
      {store.verification_status === 'needs_confirmation' && <span className="shop-needs-confirm">Pendiente de confirmar</span>}
      {(store.sources ?? []).map((source) => <a className="travel-source" key={source.url} href={source.url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>{source.name} ↗</a>)}
    </div>
  );
}

function TiendasTab({ categories, stores, zones }) {
  const [categoryId, setCategoryId] = useState('all');
  const zoneById = useMemo(() => new Map(zones.map((zone) => [zone.id, zone])), [zones]);
  const visible = categoryId === 'all' ? stores : stores.filter((store) => (store.category_tags ?? []).includes(categoryId));
  return <>
    <div className="shop-filters">
      <button className={`shop-filter ${categoryId === 'all' ? 'shop-filter--active' : ''}`} onClick={() => setCategoryId('all')}>Todas</button>
      {categories.map((cat) => <button key={cat.id} className={`shop-filter ${categoryId === cat.id ? 'shop-filter--active' : ''}`} onClick={() => setCategoryId(cat.id)}>{cat.icon} {cat.title}</button>)}
    </div>
    {categoryId !== 'all' && (() => { const cat = categories.find((c) => c.id === categoryId); return cat && (
      <div className="travel-card">
        <div className="travel-card__text">{cat.summary}</div>
        {cat.buying_tips.length > 0 && <ul className="travel-steps">{cat.buying_tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>}
      </div>
    ); })()}
    {visible.map((store) => <StoreCard key={store.id} store={store} zoneById={zoneById} />)}
  </>;
}

function RutaTab({ routes, excluded, zoneById }) {
  return <>
    {routes.map((route) => <div className="travel-card" key={route.id}>
      <span className="shop-route__badge">{route.variant}</span>
      <div className="travel-card__title">{route.name}</div>
      <div className="travel-card__text">{route.description}</div>
      <div className="shop-store__meta"><strong>Duración estimada:</strong> {route.estimated_hours}</div>
      <div className="shop-store__meta"><strong>Zonas:</strong> {route.zone_ids.map((id) => zoneById.get(id)?.name).filter(Boolean).join(' → ')}</div>
    </div>)}
    {excluded && <div className="travel-card travel-card--danger">
      <div className="travel-card__eyebrow">Estudiado y descartado</div>
      <div className="travel-card__title">{excluded.candidate}</div>
      <div className="travel-card__text">{excluded.reason}</div>
    </div>}
  </>;
}

function NormativaTab({ taxFreeRules, customsReturn, electrical, riskNotes }) {
  return <>
    {taxFreeRules && <div className="travel-card">
      <div className="travel-card__title">Tax-free en Japón (sistema vigente durante el viaje)</div>
      <div className="travel-warning">{taxFreeRules.note}</div>
      <div className="shop-store__meta"><strong>Elegibilidad:</strong> {taxFreeRules.current_system.eligibility}</div>
      <div className="shop-store__meta"><strong>Umbrales:</strong> {taxFreeRules.current_system.thresholds}</div>
      <div className="shop-store__meta"><strong>Trámite:</strong> {taxFreeRules.current_system.how_it_works}</div>
      <div className="shop-store__meta"><strong>Consumibles:</strong> {taxFreeRules.current_system.consumables_restriction}</div>
      <div className="shop-store__meta"><strong>Comisiones:</strong> {taxFreeRules.current_system.store_commission_example}</div>
      {taxFreeRules.sources.map((s) => <a className="travel-source" key={s.url} href={s.url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>{s.name} ↗</a>)}
    </div>}
    {customsReturn && <div className="travel-card">
      <div className="travel-card__title">Aduana de vuelta a España</div>
      <div className="shop-store__meta">Franquicia por vía aérea: <strong>{customsReturn.thresholds.air_or_sea_eur} €</strong> · vía terrestre: <strong>{customsReturn.thresholds.land_eur} €</strong> · menores de 15: <strong>{customsReturn.thresholds.minors_under_15_eur} €</strong></div>
      <div className="shop-store__meta">{customsReturn.over_threshold}</div>
      {customsReturn.sources.map((s) => <a className="travel-source" key={s.url} href={s.url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>{s.name} ↗</a>)}
    </div>}
    {electrical && <div className="travel-card">
      <div className="travel-card__title">Compatibilidad eléctrica</div>
      <div className="shop-store__meta">Japón: {electrical.japan_voltage}, clavijas {electrical.japan_plug_types.join('/')} · España: {electrical.spain_voltage}, clavijas {electrical.spain_plug_types.join('/')}</div>
      <div className="shop-store__meta">{electrical.note}</div>
    </div>}
    {riskNotes.map((risk) => <div className="travel-card" key={risk.id}>
      <div className="travel-card__title">{risk.icon} {risk.title}</div>
      <div className="travel-card__text">{risk.body}</div>
      {risk.sources.map((s) => <a className="travel-source" key={s.url} href={s.url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>{s.name} ↗</a>)}
    </div>)}
  </>;
}

function CalculadoraTab({ wishlistTemplate }) {
  const { data } = useTravelToolsData();
  const defaultRate = data?.currency?.default_rate ?? 165;
  const [price, setPrice] = useState('10000');
  const [taxFree, setTaxFree] = useState(true);
  const rate = defaultRate;
  const numericPrice = Number(String(price).replace(',', '.')) || 0;
  const afterTaxFree = taxFree ? numericPrice / 1.1 : numericPrice;
  const eur = afterTaxFree / rate;
  const grouped = useMemo(() => {
    const byPriority = { imprescindible: [], oportunidad: [], si_hay_precio: [] };
    wishlistTemplate.forEach((item) => { byPriority[item.priority]?.push(item); });
    return byPriority;
  }, [wishlistTemplate]);
  return <>
    <div className="travel-card">
      <div className="travel-card__title">Precio final estimado</div>
      <div className="travel-card__text">Orientativo: aplica el 10% de exención tax-free si procede y convierte a euros con el tipo del conversor. No incluye comisiones de tarjeta ni de gestión de la tienda — revisa la pestaña Normativa.</div>
      <label className="travel-label">Precio en yenes (con impuesto)</label>
      <div className="shop-calc-row"><input className="travel-input" style={{ marginTop: 0 }} type="number" min="0" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} /><span>¥</span></div>
      <div className="shop-calc-toggle"><input type="checkbox" checked={taxFree} onChange={(event) => setTaxFree(event.target.checked)} id="tax-free-toggle" /><label htmlFor="tax-free-toggle">Aplica exención tax-free (10%, sujeto a umbral mínimo ¥5.000/tienda/día)</label></div>
      <div className="shop-calc-result">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(eur)}</div>
      <div className="shop-calc-result-label">≈ {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(afterTaxFree)} · tipo 1€ = {rate}¥</div>
    </div>
    <div className="travel-card">
      <div className="travel-card__title">Mi lista personal</div>
      {Object.entries(PRIORITY_LABEL).map(([key, label]) => grouped[key]?.length > 0 && (
        <div className="shop-wishlist-group" key={key}>
          <h3>{label}</h3>
          {grouped[key].map((item) => <div className="shop-wishlist-item" key={item.category}><strong>{item.category.replace('cat_', '')}</strong> — {item.note}</div>)}
        </div>
      ))}
    </div>
  </>;
}

export default function ShoppingGuideView({ onBack }) {
  const { categories, zones, stores, taxFreeRules, customsReturn, electrical, riskNotes, day24Routes, day24Excluded, wishlistTemplate, lastVerifiedAt, loading, error } = useShoppingGuideData();
  const [tab, setTab] = useState('Tiendas');
  const zoneById = useMemo(() => new Map(zones.map((zone) => [zone.id, zone])), [zones]);
  return <div className="travel-tool"><style>{TRAVEL_TOOL_STYLES}{STYLES}</style><nav className="travel-tool__nav"><button className="travel-tool__back" onClick={onBack}>‹ Volver</button><h1 className="travel-tool__title">Guía de compras</h1></nav><main className="travel-tool__body">
    <p className="travel-tool__intro">Zonas, tiendas verificadas, normativa fiscal/aduanera y una calculadora orientativa. Verificado {lastVerifiedAt ?? '—'}.</p>
    {loading && <div className="travel-loading">Cargando guía de compras…</div>}{error && <div className="travel-warning">No se pudo cargar: {error}</div>}
    <div className="shop-tabs">{TABS.map((item) => <button key={item} className={`shop-tab ${tab === item ? 'shop-tab--active' : ''}`} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === 'Tiendas' && <TiendasTab categories={categories} stores={stores} zones={zones} />}
    {tab === 'Ruta 24 ago' && <RutaTab routes={day24Routes} excluded={day24Excluded} zoneById={zoneById} />}
    {tab === 'Normativa' && <NormativaTab taxFreeRules={taxFreeRules} customsReturn={customsReturn} electrical={electrical} riskNotes={riskNotes} />}
    {tab === 'Calculadora' && <CalculadoraTab wishlistTemplate={wishlistTemplate} />}
  </main></div>;
}
