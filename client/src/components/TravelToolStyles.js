export const TRAVEL_TOOL_STYLES = `
.travel-tool { position: fixed; inset: 0; z-index: 260; max-width: 480px; margin: 0 auto; background: var(--bg-primary); overflow-y: auto; }
.travel-tool__nav { position: sticky; top: 0; z-index: 5; height: 56px; display: flex; align-items: center; padding: 0 16px; background: var(--glass-bg); backdrop-filter: blur(20px); border-bottom: 1px solid var(--separator); }
.travel-tool__back { border: 0; background: none; color: var(--accent); font: 17px var(--font); padding: 8px 0; cursor: pointer; }
.travel-tool__title { flex: 1; margin-right: 48px; text-align: center; color: var(--label-primary); font-size: 16px; font-weight: 700; }
.travel-tool__body { padding: 16px var(--page-padding) 40px; display: flex; flex-direction: column; gap: 14px; }
.travel-tool__intro { color: var(--label-secondary); font-size: 14px; line-height: 1.5; }
.travel-card { padding: 16px; border-radius: var(--radius-card); background: var(--bg-surface); border: 1px solid var(--glass-border); box-shadow: var(--shadow-card); }
.travel-card--danger { border-color: rgba(232,0,45,.45); }
.travel-card__eyebrow { color: var(--label-secondary); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
.travel-card__title { margin-top: 4px; color: var(--label-primary); font-size: 18px; font-weight: 700; }
.travel-card__text { margin-top: 7px; color: var(--label-secondary); font-size: 14px; line-height: 1.5; }
.travel-call { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 12px; padding: 11px 14px; border-radius: 12px; background: var(--accent); color: #fff; text-decoration: none; font-weight: 700; }
.travel-call--secondary { background: var(--bg-secondary); color: var(--accent); }
.travel-input { width: 100%; margin-top: 8px; padding: 12px; border: 1px solid var(--glass-border); border-radius: 10px; background: var(--bg-secondary); color: var(--label-primary); font: 15px var(--font); }
.travel-label { display: block; margin-top: 12px; color: var(--label-secondary); font-size: 12px; font-weight: 600; }
.travel-steps { margin: 12px 0 0; padding-left: 22px; color: var(--label-primary); font-size: 14px; line-height: 1.55; }
.travel-steps li + li { margin-top: 7px; }
.travel-warning { margin-top: 10px; padding: 9px 11px; border-radius: 9px; color: #ffd8df; background: rgba(232,0,45,.15); font-size: 13px; line-height: 1.4; }
.travel-source { display: inline-block; margin-top: 12px; color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none; }
.travel-loading { padding: 40px 20px; text-align: center; color: var(--label-secondary); }
`;
