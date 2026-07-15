import React, { useEffect, useState } from 'react';

const STYLES = `
.offline-banner {
  position: fixed;
  top: env(safe-area-inset-top);
  left: 50%;
  z-index: 500;
  transform: translateX(-50%);
  width: min(calc(100% - 24px), 456px);
  padding: 8px 12px;
  border-radius: 0 0 12px 12px;
  background: #E8002D;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.35);
}
`;

export default function OfflineBanner() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <>
      <style>{STYLES}</style>
      <div className="offline-banner" role="status">
        Sin conexión · la guía sigue disponible; el planificador no se sincronizará
      </div>
    </>
  );
}
