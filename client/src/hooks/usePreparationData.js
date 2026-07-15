import { useEffect, useMemo, useState } from 'react';
import { fetchJsonCached } from '../lib/fetchJsonCached.js';

const STORAGE_KEY = 'preparation_task_statuses_v1';
const VALID_STATUSES = new Set(['pending', 'in_progress', 'completed', 'not_applicable']);

function readStatuses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

export function taskDueDate(task, departureDate) {
  if (task.due_date) return task.due_date;
  const date = new Date(`${departureDate}T12:00:00`);
  date.setDate(date.getDate() - (task.due_days_before ?? 0));
  return date.toISOString().slice(0, 10);
}

export function usePreparationData() {
  const [data, setData] = useState(null);
  const [statuses, setStatuses] = useState(readStatuses);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJsonCached('/data/preparation_checklist.json')
      .then((json) => { if (!cancelled) setData(json); })
      .catch((err) => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, []);

  const tasks = useMemo(() => (data?.tasks ?? []).map((task) => ({
    ...task,
    due_date_resolved: taskDueDate(task, data.departure_date),
    status: VALID_STATUSES.has(statuses[task.id]) ? statuses[task.id] : 'pending',
  })), [data, statuses]);

  function setStatus(id, status) {
    if (!VALID_STATUSES.has(status)) return;
    setStatuses((current) => {
      const next = { ...current, [id]: status };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return { tasks, departureDate: data?.departure_date, loading: !data && !error, error, setStatus };
}
