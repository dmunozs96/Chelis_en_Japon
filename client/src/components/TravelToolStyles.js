export const TRAVEL_TOOL_STYLES = `
.travel-tool__back,.travel-source{min-height:44px}.travel-source{display:flex;align-items:center}
.travel-tool{position:fixed;inset:0;z-index:260;max-width:var(--shell-max);margin:0 auto;background:var(--ink-950);overflow-y:auto}
.travel-tool__nav{position:sticky;top:0;z-index:5;height:calc(56px + env(safe-area-inset-top));display:flex;align-items:center;padding:env(safe-area-inset-top) var(--page-padding) 0;border-bottom:1px solid var(--separator);background:rgb(13 14 16 / 94%)}
.travel-tool__back{display:inline-flex;min-width:72px;min-height:44px;padding:8px 0;align-items:center;gap:6px;border:0;background:none;color:var(--paper-100);font:650 13px var(--font);cursor:pointer}
.travel-tool__title{flex:1;margin-right:72px;color:var(--paper-100);font-family:var(--font-display);font-size:16px;font-weight:600;text-align:center}
.travel-tool__body{display:flex;padding:20px var(--page-padding) 40px;flex-direction:column;gap:0}
.travel-tool__intro{padding:0 0 24px;color:var(--stone-500);font-size:14px;line-height:1.55}
.travel-card{padding:22px 0;border:0;border-bottom:1px solid var(--separator);border-radius:0;background:transparent;box-shadow:none}
.travel-card--danger{border-color:rgb(224 90 90 / 45%)}
.travel-card__eyebrow{color:var(--stone-500);font-size:9px;font-weight:750;letter-spacing:.12em;text-transform:uppercase}
.travel-card__title{margin-top:5px;color:var(--paper-100);font-family:var(--font-display);font-size:20px;font-weight:600;letter-spacing:-.02em}
.travel-card__text{margin-top:8px;color:var(--paper-300);font-size:14px;line-height:1.58}
.travel-call{display:flex;min-height:46px;margin-top:14px;padding:11px 14px;align-items:center;justify-content:space-between;gap:12px;border:1px solid var(--signal-500);border-radius:var(--radius-btn);background:var(--signal-500);color:#fff;font-weight:700;text-decoration:none}
.travel-call--secondary{border-color:var(--separator);background:transparent;color:var(--paper-100)}
.travel-input{width:100%;margin-top:8px;padding:12px;border:1px solid var(--separator);border-radius:var(--radius-btn);background:var(--ink-900);color:var(--paper-100);font:15px var(--font)}
.travel-label{display:block;margin-top:14px;color:var(--paper-300);font-size:12px;font-weight:600}
.travel-steps{margin:14px 0 0;padding-left:22px;color:var(--paper-300);font-size:14px;line-height:1.62}
.travel-steps li+li{margin-top:8px}
.travel-warning{margin-top:12px;padding:11px 0;border-block:1px solid rgb(215 160 84 / 35%);border-radius:0;background:transparent;color:var(--amber-500);font-size:13px;line-height:1.48}
.travel-source{display:inline-block;margin-top:12px;color:var(--paper-300);font-size:13px;font-weight:600;text-decoration:underline;text-decoration-color:var(--stone-700);text-underline-offset:3px}
.travel-loading{padding:40px 20px;color:var(--stone-500);text-align:center}
`;
