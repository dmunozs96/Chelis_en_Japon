function minutesFromClock(value) {
  if (!/^\d{2}:\d{2}$/.test(value ?? '')) return null;
  const [hours, minutes] = value.split(':').map(Number);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function flattenTimedSteps(day) {
  return (day?.blocks ?? []).flatMap((block, blockIndex) =>
    (block.steps ?? []).flatMap((step, stepIndex) => {
      const startMinute = minutesFromClock(step.time);
      return startMinute == null ? [] : [{
        ...step,
        block,
        blockIndex,
        stepIndex,
        startMinute,
      }];
    })
  ).sort((a, b) => a.startMinute - b.startMinute);
}

export function getNowState(day, now = new Date()) {
  const steps = flattenTimedSteps(day);
  if (!steps.length) return { phase: 'no_schedule', current: null, next: null };

  const minute = now.getHours() * 60 + now.getMinutes();
  const nextIndex = steps.findIndex((step) => step.startMinute > minute);

  if (nextIndex === 0) {
    return { phase: 'before_start', current: null, next: steps[0] };
  }

  if (nextIndex === -1) {
    const current = steps.at(-1);
    const scheduledEnd = current.startMinute + (current.duration_min ?? 0);
    return {
      phase: minute <= scheduledEnd ? 'in_progress' : 'finished',
      current: minute <= scheduledEnd ? current : null,
      next: null,
    };
  }

  return {
    phase: 'in_progress',
    current: steps[nextIndex - 1],
    next: steps[nextIndex],
  };
}

export function minutesUntil(step, now = new Date()) {
  if (!step) return null;
  return step.startMinute - (now.getHours() * 60 + now.getMinutes());
}

