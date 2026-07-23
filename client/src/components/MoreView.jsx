import React from 'react';
import Icon from './ui/Icon.jsx';

const STYLES = `
.more-view{padding:0 0 34px;overflow:hidden}
.more-hero{position:relative;min-height:330px;margin-bottom:28px;padding:30px var(--page-padding);display:flex;align-items:flex-end;isolation:isolate;overflow:hidden}
.more-hero__image{position:absolute;z-index:-2;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 54%;filter:saturate(.72) contrast(1.08) brightness(.68);transform:scale(1.01)}
.more-hero::after{position:absolute;z-index:-1;inset:0;background:linear-gradient(180deg,rgb(7 8 9 / 8%),rgb(7 8 9 / 18%) 30%,var(--ink-950) 98%);content:""}
.more-hero__eyebrow{color:var(--paper-300);font-size:10px;font-weight:750;letter-spacing:.15em;text-transform:uppercase}
.more-hero h1{max-width:310px;margin-top:9px;font-size:42px;letter-spacing:-.055em}
.more-hero p{max-width:31ch;margin-top:9px;color:var(--paper-300);font:450 18px/1.35 var(--font-editorial)}
.more-section{padding:0 var(--page-padding);margin-top:30px}
.more-section__title{margin-bottom:13px;color:var(--paper-300);font-size:10px;font-weight:750;letter-spacing:.14em;text-transform:uppercase}
.more-feature{position:relative;width:100%;min-height:174px;padding:20px;display:flex;align-items:flex-end;overflow:hidden;border:1px solid rgb(241 237 229 / 16%);border-radius:18px;background:var(--ink-900);color:var(--paper-100);text-align:left;isolation:isolate}
.more-feature img{position:absolute;z-index:-2;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.65) brightness(.48)}
.more-feature::after{position:absolute;z-index:-1;inset:0;background:linear-gradient(90deg,rgb(7 8 9 / 88%),rgb(7 8 9 / 20%)),linear-gradient(0deg,rgb(7 8 9 / 82%),transparent 70%);content:""}
.more-feature__icon{margin-bottom:20px;color:var(--champagne-400)}
.more-feature strong{display:block;font:620 24px/1.05 var(--font-display);letter-spacing:-.035em}
.more-feature span{display:block;margin-top:5px;color:var(--paper-300);font-size:12px}
.more-feature__arrow{position:absolute;right:18px;bottom:18px;color:var(--torii-500);font-size:24px}
.more-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.more-tile{position:relative;min-height:146px;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;border:1px solid rgb(241 237 229 / 13%);border-radius:15px;background:var(--ink-900);color:var(--paper-100);text-align:left;isolation:isolate}
.more-tile img{position:absolute;z-index:-2;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.62) brightness(.44)}
.more-tile::after{position:absolute;z-index:-1;inset:0;background:linear-gradient(0deg,rgb(7 8 9 / 94%),rgb(7 8 9 / 5%) 88%);content:""}
.more-tile__icon{margin-bottom:auto;color:var(--paper-100)}
.more-tile strong{font:620 16px/1.1 var(--font-display)}
.more-tile span{margin-top:4px;color:var(--paper-300);font-size:10px;line-height:1.3}
.more-list{border-top:1px solid var(--separator)}
.more-row{width:100%;min-height:58px;padding:10px 0;display:flex;align-items:center;gap:13px;border:0;border-bottom:1px solid var(--separator);background:transparent;color:var(--paper-100);text-align:left}
.more-row__icon{display:grid;width:30px;place-items:center;color:var(--paper-300)}
.more-row strong{font-size:14px}.more-row span:last-child{margin-left:auto;color:var(--stone-500);font-size:20px}
.more-feature:active,.more-tile:active{transform:scale(.985)}
@media(max-width:350px){.more-hero{min-height:300px}.more-hero h1{font-size:36px}.more-tile{min-height:132px}}
@media(prefers-reduced-motion:no-preference){.more-feature,.more-tile{transition:transform var(--duration-press) var(--ease)}}
`;

const visualTools = [
  { icon:'climate', label:'Clima', copy:'Qué esperar en cada etapa', destination:'climate', image:'/visual-library/nature/mount-fuji.jpg', fallback:'/days/day-05.jpg' },
  { icon:'phrases', label:'Frases', copy:'Hablar con confianza', destination:'phrases', image:'/visual-library/culture/noren.jpg', fallback:'/pois/yanaka.jpg' },
  { icon:'shopping', label:'Compras', copy:'Objetos que merecen volver', destination:'shopping', image:'/visual-library/objects/japanese-ceramics.jpg', fallback:'/pois/ginza-six.jpg' },
  { icon:'culture', label:'Cultura', copy:'Leer Japón con otros ojos', destination:'culture', image:'/visual-library/culture/tea-ceremony.jpg', fallback:'/pois/fushimi-inari.jpg' },
];

const utilityTools = [
  { icon:'hotel', label:'Llegar al hotel', destination:'last-mile' },
  { icon:'ic', label:'Guía Suica', destination:'ic-card' },
  { icon:'currency', label:'Conversor ¥/€', destination:'currency' },
  { icon:'check', label:'Preparar viaje', destination:'preparation' },
  { icon:'emergency', label:'Emergencias', destination:'emergency' },
];

export default function MoreView({ onNavigate }) {
  return <><style>{STYLES}</style><div className="more-view">
    <header className="more-hero">
      <img className="more-hero__image" src="/days/day-09.jpg" alt="" />
      <div><div className="more-hero__eyebrow">La guía completa</div><h1>Todo Japón,<br/>a vuestro alcance</h1><p>Documentos, cultura y herramientas elegidas para este viaje.</p></div>
    </header>
    <section className="more-section" aria-labelledby="need-now">
      <h2 className="more-section__title" id="need-now">Lo que necesitas ahora</h2>
      <button className="more-feature" onClick={()=>onNavigate?.('tickets')}>
        <img src="/JapanPics/Tokyo.jpg" alt="" /><div><Icon name="tickets" size={26} className="more-feature__icon"/><strong>Billetes y reservas</strong><span>Vuelos · hoteles · trenes · siempre offline</span></div><b className="more-feature__arrow" aria-hidden="true">→</b>
      </button>
    </section>
    <section className="more-section" aria-labelledby="enjoy">
      <h2 className="more-section__title" id="enjoy">Moverte, hablar y disfrutar</h2>
      <div className="more-tiles">{visualTools.map(tool=><button className="more-tile" key={tool.destination} onClick={()=>onNavigate?.(tool.destination)}>
        <img src={tool.image} alt="" onError={tool.fallback ? e=>{e.currentTarget.src=tool.fallback} : undefined}/><Icon name={tool.icon} size={22} className="more-tile__icon"/><strong>{tool.label}</strong><span>{tool.copy}</span>
      </button>)}</div>
    </section>
    <section className="more-section" aria-labelledby="utilities"><h2 className="more-section__title" id="utilities">Utilidades</h2><div className="more-list">
      {utilityTools.map(tool=><button className="more-row" key={tool.destination} onClick={()=>onNavigate?.(tool.destination)}><Icon name={tool.icon} size={20} className="more-row__icon"/><strong>{tool.label}</strong><span aria-hidden="true">›</span></button>)}
    </div></section>
  </div></>;
}
