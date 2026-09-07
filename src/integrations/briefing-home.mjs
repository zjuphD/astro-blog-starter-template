export default function briefingHome() {
  return {
    name: "aiseeki-briefing-home",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        injectScript(
          "page",
          `
(function(){
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;
  function esc(s){return String(s ?? "").replace(/[&<>\"']/g,function(c){return ({"&":"&amp;","<":"&lt;",">":"&gt;","\\\"":"&quot;","'":"&#39;"})[c] || c;});}
  function init(){
    var nav = document.querySelector('.nav-links');
    if(nav && !nav.querySelector('[data-briefing-link]')){
      var a=document.createElement('a');a.href='/briefing';a.textContent='前沿快讯';a.setAttribute('data-briefing-link','1');nav.prepend(a);
    }
    fetch('/briefings.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():Promise.reject();}).then(function(items){
      if(!Array.isArray(items)||!items.length||document.querySelector('[data-briefing-home]')) return;
      var top=items.slice(0,3);
      var target=document.querySelector('#principles');
      if(!target) return;
      var style=document.createElement('style');
      style.textContent='.brief-home{padding:clamp(4.5rem,9vh,7.5rem) 0}.brief-home-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.brief-home-card{padding:1.35rem;display:flex;flex-direction:column;min-height:260px}.brief-home-meta{display:flex;gap:8px;align-items:center;font-family:"IBM Plex Mono","PingFang SC",monospace;font-size:.62rem;color:var(--ink-soft);margin-bottom:.8rem}.brief-home-score{margin-left:auto;color:var(--ochre-deep)}.brief-home-card h3{font-family:var(--font-display);font-size:1.18rem;line-height:1.45;margin:0 0 .75rem}.brief-home-card p{font-size:.88rem;color:var(--ink-soft);margin:0}.brief-home-link{margin-top:auto;padding-top:1rem;font-weight:600;font-size:.84rem;color:var(--sage-deep)}.brief-home-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:2rem}.brief-home-head .section-head{margin-bottom:0}.brief-home-all{font-size:.88rem;font-weight:600;color:var(--sage-deep);white-space:nowrap}@media(max-width:920px){.brief-home-grid{grid-template-columns:1fr}.brief-home-head{align-items:start;flex-direction:column}.brief-home-card{min-height:auto}}';
      document.head.appendChild(style);
      var cards=top.map(function(x){return '<article class="glass brief-home-card"><div class="brief-home-meta"><span>'+esc(x.category)+'</span><span>· '+esc(x.source)+'</span><span class="brief-home-score">AISK / '+esc(x.score)+'</span></div><h3>'+esc(x.titleZh)+'</h3><p>'+esc(x.summary)+'</p><a class="brief-home-link" href="/briefing">查看快讯详情 →</a></article>';}).join('');
      var section=document.createElement('section');section.className='brief-home';section.setAttribute('data-briefing-home','1');section.innerHTML='<div class="wrap"><div class="brief-home-head"><div class="section-head"><p class="eyebrow"><span class="section-num">NEWS</span> · AI FOR SCIENCE DAILY</p><h2 class="section-title">今天，哪些科研进展值得你花时间看？</h2><p class="section-lede">每日筛选精准医疗、肿瘤生物学、AI 药物发现与 AI for Science 的重要新进展。</p></div><a class="brief-home-all" href="/briefing">查看全部前沿快讯 ↗</a></div><div class="brief-home-grid">'+cards+'</div></div>';
      target.parentNode.insertBefore(section,target);
    }).catch(function(){});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
          `,
        );
      },
    },
  };
}
