import React from 'react';

const paths = {
  today: (
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9h17M8 3.5v3M16 3.5v3M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
    </>
  ),
  route: (
    <>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="M7 6h4.5a3 3 0 0 1 0 6h-1a3 3 0 0 0 0 6H17" />
    </>
  ),
  alert: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 6-2.5 8-2.5 8h17S18 15 18 9Z" />
      <path d="M10 21h4" />
    </>
  ),
  restaurant: (
    <>
      <path d="M7 3v7M4.5 3v5A2.5 2.5 0 0 0 7 10.5 2.5 2.5 0 0 0 9.5 8V3M7 10.5V21" />
      <path d="M16.5 21v-8M16.5 13c2.2 0 3.5-1.8 3.5-4V3c-3 0-5.5 2.5-5.5 6v2a2 2 0 0 0 2 2Z" />
    </>
  ),
  more: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  back: <path d="m15 18-6-6 6-6" />,
};

export default function Icon({ name, size = 24, className = '', title }) {
  const content = paths[name];
  if (!content) return null;

  return (
    <span className={`ui-icon ${className}`.trim()} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={title ? undefined : 'true'}
        role={title ? 'img' : undefined}
      >
        {title && <title>{title}</title>}
        {content}
      </svg>
    </span>
  );
}
