import React, { useState, useEffect, useCallback } from 'react';
import { useAlertsData, getUnreadActionCount } from '../hooks/useTripData.js';

/* ---------------------------------------------------------------
   AlertsView
   Pantalla de alertas con tres secciones: Acción, Avisos, Consejos.
   Gestiona el estado leído/no leído en localStorage.
   --------------------------------------------------------------- */

const STYLES = `
.alerts-view {
  padding: var(--page-padding);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.alerts-section {
  margin-bottom: 28px;
}

.alerts-section__header {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--label-secondary);
  text-transform: uppercase;
  padding: 0 4px 8px 4px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-card);
}

.alert-card {
  background: var(--bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 16px 16px 16px 52px;
  position: relative;
  transition: opacity 0.3s var(--ease);
}

.alert-card--dismissed {
  opacity: 0.4;
  order: 999;
}

.alert-dot {
  position: absolute;
  left: 16px;
  top: 18px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-dot--action  { background: #E8002D; }
.alert-dot--warning { background: #FF9500; }
.alert-dot--tip     { background: #007AFF; }

.alert-dismiss {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  color: var(--label-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s var(--ease);
  padding: 0;
}

.alert-dismiss:active {
  background: var(--separator);
}

.alert-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  line-height: 1.3;
  margin-bottom: 4px;
  padding-right: 24px;
}

.alert-body {
  font-size: 15px;
  color: var(--label-secondary);
  line-height: 1.5;
  margin-bottom: 10px;
}

.alert-body:last-child {
  margin-bottom: 0;
}

.alert-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.alert-due-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-chip);
  font-size: 12px;
  font-weight: 600;
  background: var(--accent-soft);
  color: var(--accent);
  letter-spacing: 0.2px;
}

.alert-action-link {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-chip);
  font-size: 12px;
  font-weight: 600;
  background: none;
  border: 1.5px solid var(--accent);
  color: var(--accent);
  text-decoration: none;
  letter-spacing: 0.2px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s var(--ease);
}

.alert-action-link:active {
  background: var(--accent-soft);
}

.alerts-empty {
  font-size: 15px;
  color: var(--label-secondary);
  text-align: center;
  padding: 20px 0;
}

.alerts-loading {
  font-size: 15px;
  color: var(--label-secondary);
  text-align: center;
  padding: 40px 0;
}
.alerts-hero{padding:8px 0 30px}.alerts-hero__eyebrow{color:var(--torii-500);font-size:10px;font-weight:750;letter-spacing:.14em;text-transform:uppercase}.alerts-hero h1{margin-top:7px;font-size:38px;letter-spacing:-.05em}.alerts-hero p{margin-top:9px;color:var(--stone-500);font-size:14px}
.alerts-section{margin-bottom:34px}.alerts-section__header{padding:0 0 10px;color:var(--paper-300);font-size:10px;font-weight:750;letter-spacing:.13em}.alerts-list{gap:0;border-top:1px solid var(--separator)}
.alert-card{padding:18px 36px 18px 20px;border:0!important;border-bottom:1px solid var(--separator)!important;border-radius:0;background:transparent;box-shadow:none}.alert-card::before{position:absolute;top:0;bottom:0;left:0;width:2px;background:var(--alert-color,var(--stone-700));content:""}.alert-card:has(.alert-dot--action){--alert-color:var(--signal-500)}.alert-card:has(.alert-dot--warning){--alert-color:var(--amber-500)}.alert-card:has(.alert-dot--tip){--alert-color:var(--titanium-400)}
.alert-dot{display:none}.alert-kind{display:block;margin-bottom:5px;color:var(--alert-color);font-size:9px;font-weight:750;letter-spacing:.12em;text-transform:uppercase}.alert-title{font-family:var(--font-display);font-size:18px;font-weight:600}.alert-body{color:var(--paper-300);font-size:14px}.alert-dismiss{top:14px;right:0;background:transparent;color:var(--stone-500)}
.alert-card--dismissed{padding-block:13px;opacity:.48}.alert-card--dismissed .alert-body,.alert-card--dismissed .alert-footer,.alert-card--dismissed .alert-kind{display:none}.alert-card--dismissed .alert-title{margin:0;font-size:14px;font-weight:500}
.alert-due-chip{padding:0;background:transparent;color:var(--amber-500)}.alert-action-link{border-color:var(--separator);color:var(--paper-100)}
`;

const SECTION_LABELS = {
  action:  'ACCIÓN',
  warning: 'AVISOS',
  tip:     'CONSEJOS',
};

const SECTION_ORDER = ['action', 'warning', 'tip'];

function formatDateES(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

function getDismissed() {
  try {
    return JSON.parse(localStorage.getItem('dismissed_alerts') || '[]');
  } catch {
    return [];
  }
}

function saveDismissed(ids) {
  localStorage.setItem('dismissed_alerts', JSON.stringify(ids));
}

export default function AlertsView({ onBadgeChange }) {
  const { alerts, loading, error } = useAlertsData();
  const [dismissed, setDismissed] = useState(getDismissed);

  // Notify parent of unread action count whenever alerts or dismissed change
  useEffect(() => {
    if (!alerts.length) return;
    const count = alerts.filter(
      (a) => a.type === 'action' && !dismissed.includes(a.id)
    ).length;
    if (onBadgeChange) onBadgeChange(count);
  }, [alerts, dismissed, onBadgeChange]);

  const handleDismiss = useCallback((id) => {
    setDismissed((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveDismissed(next);
      return next;
    });
  }, []);

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="alerts-loading">Cargando alertas…</div>
    </>
  );

  if (error) return (
    <>
      <style>{STYLES}</style>
      <div className="alerts-loading" style={{ color: 'var(--accent)' }}>
        Error cargando alertas: {error}
      </div>
    </>
  );

  // Fecha local del dispositivo (no UTC) — coherente con todayISO() de TodayView.
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Filter out past tips
  const visibleAlerts = alerts.filter((a) => {
    if (a.type === 'tip' && a.related_day && a.related_day < today) return false;
    return true;
  });

  // Group by type
  const grouped = {};
  for (const type of SECTION_ORDER) {
    grouped[type] = visibleAlerts.filter((a) => a.type === type);
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="alerts-view">
        <header className="alerts-hero">
          <div className="alerts-hero__eyebrow">Centro operativo</div>
          <h1>Alertas</h1>
          <p>{visibleAlerts.filter((alert) => !dismissed.includes(alert.id)).length} pendientes · {visibleAlerts.filter((alert) => dismissed.includes(alert.id)).length} leídas</p>
        </header>
        {SECTION_ORDER.map((type) => {
          const items = grouped[type];
          if (!items || items.length === 0) return null;

          // Sort: non-dismissed first, dismissed at end
          const sorted = [...items].sort((a, b) => {
            const da = dismissed.includes(a.id) ? 1 : 0;
            const db = dismissed.includes(b.id) ? 1 : 0;
            return da - db;
          });

          return (
            <div key={type} className="alerts-section">
              <div className="alerts-section__header">{SECTION_LABELS[type]}</div>
              <div className="alerts-list">
                {sorted.map((alert) => {
                  const isDismissed = dismissed.includes(alert.id);
                  return (
                    <div
                      key={alert.id}
                      className={`alert-card${isDismissed ? ' alert-card--dismissed' : ''}`}
                      role="article"
                      aria-label={alert.title}
                    >
                      <div className={`alert-dot alert-dot--${alert.type}`} aria-hidden="true" />
                      <span className="alert-kind">{SECTION_LABELS[alert.type]}</span>

                      {alert.dismissible && (
                        <button
                          className="alert-dismiss"
                          onClick={() => handleDismiss(alert.id)}
                          aria-label={`Descartar: ${alert.title}`}
                          title="Marcar como leída"
                        >
                          ×
                        </button>
                      )}

                      <div className="alert-title">{alert.title}</div>
                      <div className="alert-body">{alert.body}</div>

                      {(alert.due_date || alert.action_url) && (
                        <div className="alert-footer">
                          {alert.due_date && (
                            <span className="alert-due-chip">
                              Antes del {formatDateES(alert.due_date)}
                            </span>
                          )}
                          {alert.action_url && (
                            <a
                              href={alert.action_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="alert-action-link"
                            >
                              Abrir →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {visibleAlerts.length === 0 && (
          <div className="alerts-empty">No hay alertas activas.</div>
        )}
      </div>
    </>
  );
}
