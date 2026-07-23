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
  tickets: (
    <>
      <path d="M4 7.5h16v9H4z" />
      <path d="M8 7.5v9M16 7.5v9M10.5 12h3" />
    </>
  ),
  shopping: <path d="M5 8h14l-1 13H6L5 8Zm4 0a3 3 0 0 1 6 0" />,
  check: <path d="m5 12 4 4L19 6" />,
  culture: (
    <>
      <path d="M4 9h16M6 9l1-4h10l1 4M7 9v10M17 9v10M4 19h16" />
      <path d="M10 13h4v6" />
    </>
  ),
  phrases: (
    <>
      <path d="M4 5h11v9H8l-4 4V5Z" />
      <path d="M15 9h5v9l-3-3h-3" />
    </>
  ),
  currency: <path d="M7 4l5 8 5-8M8 12h8M8 16h8M12 12v8" />,
  emergency: (
    <>
      <path d="M12 3 2.8 20h18.4L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </>
  ),
  ic: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h4M7 13h7M17 9h.01" />
    </>
  ),
  hotel: (
    <>
      <path d="M4 20V5h10v15M14 10h6v10M2 20h20" />
      <path d="M8 9h2M8 13h2M8 17h2M17 14h.01" />
    </>
  ),
  climate: (
    <>
      <path d="M8 15a4 4 0 1 1 3-6.7A5 5 0 0 1 20 11a4 4 0 0 1-4 4H8Z" />
      <path d="M8 18l-1 2M13 18l-1 2M18 18l-1 2" />
    </>
  ),
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
