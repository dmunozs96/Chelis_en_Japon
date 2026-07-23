import React, { useMemo, useState } from 'react';
import { usePreparationData } from '../hooks/usePreparationData.js';
import { TRAVEL_TOOL_STYLES } from './TravelToolStyles.js';
import Icon from './ui/Icon.jsx';

const STYLES = `
.prep-progress { height: 8px; margin-top: 12px; overflow: hidden; border-radius: 8px; background: var(--bg-secondary); }
.prep-progress span { display: block; height: 100%; background: #30d158; transition: width .2s ease; }
.prep-summary { display:flex; justify-content:space-between; gap:12px; align-items:end; }
.prep-summary strong { color:var(--label-primary); font-size:28px; }
.prep-filters { display:flex; gap:8px; overflow-x:auto; padding-bottom:3px; scrollbar-width:none; }
.prep-filter { flex:none; border:1px solid var(--glass-border); border-radius:999px; padding:7px 11px; background:var(--bg-surface); color:var(--label-secondary); font:12px var(--font); }
.prep-filter--active { border-color:var(--accent); color:#fff; background:var(--accent); }
.prep-task { display:grid; grid-template-columns:30px 1fr; gap:11px; }
.prep-check { width:26px; height:26px; border:2px solid var(--label-tertiary); border-radius:50%; background:none; color:#fff; font-weight:800; }
.prep-check--done { border-color:#30d158; background:#30d158; }
.prep-task__meta { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:5px; color:var(--label-secondary); font-size:11px; text-transform:uppercase; }
.prep-task__priority--critical { color:#ff6680; font-weight:700; }
.prep-task__title { color:var(--label-primary); font-size:16px; font-weight:700; }
.prep-task__description { margin-top:5px; color:var(--label-secondary); font-size:13px; line-height:1.4; }
.prep-task__blocked { margin-top:7px; color:#ffcc00; font-size:12px; }
.prep-details { margin-top:10px; border-top:1px solid var(--separator); padding-top:9px; }
.prep-details summary { color:var(--accent); font-size:13px; font-weight:700; cursor:pointer; }
.prep-details h3 { margin-top:11px; color:var(--label-primary); font-size:12px; text-transform:uppercase; letter-spacing:.4px; }
.prep-details p { margin-top:4px; color:var(--label-secondary); font-size:13px; line-height:1.45; }
.prep-criteria { margin:5px 0 0; padding-left:19px; color:var(--label-secondary); font-size:13px; line-height:1.45; }
.prep-criteria li + li { margin-top:4px; }
.prep-status { margin-top:10px; border:1px solid var(--glass-border); border-radius:9px; padding:8px; background:var(--bg-secondary); color:var(--label-primary); font:13px var(--font); }
.prep-body{gap:0}.prep-overview{padding:22px 0 28px;border:0;border-bottom:1px solid var(--separator);border-radius:0;background:transparent;box-shadow:none}.prep-summary strong{font-family:var(--font-display);font-size:42px;font-weight:600}.prep-progress{height:3px;border-radius:0;background:var(--ink-800)}.prep-progress span{background:var(--moss-500)}
.prep-filters{padding:16px 0;border-bottom:1px solid var(--separator)}.prep-filter{border:0;border-bottom:1px solid transparent;border-radius:0;padding:7px 3px;background:transparent;color:var(--stone-500)}.prep-filter--active{border-color:var(--torii-500);background:transparent;color:var(--paper-100)}
.prep-task{padding:20px 0;border:0;border-bottom:1px solid var(--separator);border-radius:0;background:transparent;box-shadow:none}.prep-check{appearance:none;position:relative;width:24px;height:24px;margin:0;border:1.5px solid var(--stone-500);border-radius:5px;background:transparent;cursor:pointer}.prep-check:checked{border-color:var(--moss-500);background:var(--moss-500)}.prep-check:checked::after{position:absolute;top:2px;left:7px;width:6px;height:12px;border:solid var(--ink-1000);border-width:0 2px 2px 0;content:"";transform:rotate(45deg)}
.prep-task__meta{font-size:9px;letter-spacing:.08em}.prep-task__title{font-family:var(--font-display);font-size:18px;font-weight:600}.prep-task__description{color:var(--paper-300);font-size:14px}.prep-details summary{color:var(--paper-300)}.prep-status{border-color:var(--separator);border-radius:var(--radius-chip);background:var(--ink-900)}
`;

const LABELS = { pending: 'Pendiente', in_progress: 'En curso', completed: 'Completada', not_applicable: 'No aplica' };
const CATEGORIES = ['todas', 'documentacion', 'frontera', 'salud', 'reservas', 'dinero', 'conectividad', 'equipaje', 'hogar'];

export default function PreparationView({ onBack }) {
  const { tasks, loading, error, setStatus } = usePreparationData();
  const [category, setCategory] = useState('todas');
  const completedIds = useMemo(() => new Set(tasks.filter((task) => ['completed', 'not_applicable'].includes(task.status)).map((task) => task.id)), [tasks]);
  const done = completedIds.size;
  const visible = tasks.filter((task) => category === 'todas' || task.category === category).sort((a, b) => a.due_date_resolved.localeCompare(b.due_date_resolved));

  return <div className="travel-tool">
    <style>{TRAVEL_TOOL_STYLES}{STYLES}</style>
    <nav className="travel-tool__nav"><button className="travel-tool__back" onClick={onBack}><Icon name="back" size={20}/> Volver</button><h1 className="travel-tool__title">Preparar viaje</h1></nav>
    <main className="travel-tool__body prep-body">
      {loading && <div className="travel-loading">Cargando checklist…</div>}
      {error && <div className="travel-warning">No se pudo cargar: {error}</div>}
      {!loading && !error && <>
        <section className="travel-card prep-overview">
          <div className="prep-summary"><div><div className="travel-card__eyebrow">Progreso total</div><strong>{done}/{tasks.length}</strong></div><span className="travel-card__text">{Math.round((done / tasks.length) * 100)} %</span></div>
          <div className="prep-progress"><span style={{ width: `${(done / tasks.length) * 100}%` }} /></div>
          <p className="travel-card__text">Solo se guarda el estado. Los documentos y datos privados permanecen fuera de la app.</p>
        </section>
        <div className="prep-filters" aria-label="Filtrar por categoría">{CATEGORIES.map((item) => <button key={item} className={`prep-filter ${category === item ? 'prep-filter--active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
        {visible.map((task) => {
          const blockers = task.depends_on.filter((id) => !completedIds.has(id));
          return <article className="travel-card prep-task" key={task.id}>
            <input className="prep-check" type="checkbox" checked={task.status === 'completed'} onChange={() => setStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')} aria-label={`Marcar ${task.title} como completada`} />
            <div><div className="prep-task__meta"><span className={`prep-task__priority--${task.priority}`}>{task.priority}</span><span>{task.assignee}</span><span>vence {new Date(`${task.due_date_resolved}T12:00:00`).toLocaleDateString('es-ES', { day:'numeric', month:'short' })}</span></div><h2 className="prep-task__title">{task.title}</h2><p className="prep-task__description">{task.description}</p>{blockers.length > 0 && <p className="prep-task__blocked">Bloqueada por {blockers.length} tarea{blockers.length > 1 ? 's' : ''} pendiente{blockers.length > 1 ? 's' : ''}</p>}<details className="prep-details"><summary>Explicación y cómo completarla</summary><h3>Por qué importa</h3><p>{task.context}</p><h3>Márcala como hecha cuando…</h3><ul className="prep-criteria">{task.completion_criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>{task.source_refs.length > 0 && <><h3>Fuentes</h3>{task.source_refs.map((source) => <a className="travel-source" key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a>)}</>}</details><select className="prep-status" value={task.status} onChange={(event) => setStatus(task.id, event.target.value)}>{Object.entries(LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          </article>;
        })}
      </>}
    </main>
  </div>;
}
