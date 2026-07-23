import React from 'react';

const STYLES = `
.route-line {
  display: grid;
  gap: 0;
}
.route-line__item {
  display: grid;
  min-height: 64px;
  grid-template-columns: 52px 16px minmax(0, 1fr);
  column-gap: 16px;
}
.route-line__time {
  padding-top: 1px;
  color: var(--stone-500);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 16px;
}
.route-line__rail {
  position: relative;
  display: flex;
  justify-content: center;
}
.route-line__rail::after {
  position: absolute;
  top: 14px;
  bottom: 0;
  width: 1px;
  background: var(--stone-700);
  content: "";
}
.route-line__item:last-child .route-line__rail::after {
  display: none;
}
.route-line__node {
  position: relative;
  z-index: 1;
  width: 9px;
  height: 9px;
  margin-top: 3px;
  border: 2px solid var(--stone-500);
  border-radius: 50%;
  background: var(--ink-950);
}
.route-line__item--past .route-line__node {
  border-color: var(--moss-500);
  background: var(--moss-500);
}
.route-line__item--current .route-line__node {
  width: 12px;
  height: 12px;
  margin-top: 1px;
  border: 3px solid var(--paper-100);
  background: var(--torii-500);
  box-shadow: 0 0 0 4px rgb(232 0 45 / 18%);
}
.route-line__item--transfer .route-line__node {
  border-radius: 2px;
  transform: rotate(45deg);
}
.route-line__body {
  min-width: 0;
  padding: 0 0 22px;
}
.route-line__kicker {
  margin-bottom: 3px;
  color: var(--torii-500);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .11em;
  text-transform: uppercase;
}
.route-line__title {
  color: var(--paper-100);
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 620;
  line-height: 1.25;
}
.route-line__detail {
  margin-top: 4px;
  color: var(--stone-500);
  font-size: 13px;
  line-height: 1.4;
}
`;

export default function RouteLine({ items = [], currentIndex = -1, onSelect, renderAfter }) {
  return (
    <>
      <style>{STYLES}</style>
      <div className="route-line">
        {items.map((item, index) => {
          const state = item.state ?? (index < currentIndex ? 'past' : index === currentIndex ? 'current' : item.transfer ? 'transfer' : 'future');
          const selectable = Boolean(onSelect && item.id);
          return (
            <div className={`route-line__item route-line__item--${state}`} key={item.key ?? item.id ?? index}>
              <time className="route-line__time">{item.time || '—'}</time>
              <div className="route-line__rail"><span className="route-line__node" /></div>
              <div
                className="route-line__body"
                role={selectable ? 'button' : undefined}
                tabIndex={selectable ? 0 : undefined}
                onClick={selectable ? () => onSelect(item) : undefined}
                onKeyDown={selectable ? (event) => event.key === 'Enter' && onSelect(item) : undefined}
              >
                {state === 'current' && <div className="route-line__kicker">Ahora</div>}
                <div className="route-line__title">{item.title}</div>
                {item.detail && <div className="route-line__detail">{item.detail}</div>}
                {renderAfter?.(item, index)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
