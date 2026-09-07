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
  function esc(s){return String(s ?? "").replace(/[&<>]/g,function(c){return c==="&"?"&amp;":c==="<"?"&lt;":"&gt;";});}
  function hostOf(url){try{return new URL(url).hostname.replace(/^www\\./,'');}catch(e){return '';}}
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
      style.textContent='.brief-home{padding:clamp(4.5rem,9vh,7.5rem) 0}.brief-home-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;perspective:1200px}.brief-home-card{--rx:0deg;--ry:0deg;--mx:50%;--my:50%;padding:0;overflow:hidden;display:flex;flex-direction:column;min-height:430px;position:relative;transform:perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));transform-style:preserve-3d;transition:transform .18s ease,box-shadow .3s ease,border-color .3s ease}.brief-home-card:hover{box-shadow:0 22px 52px var(--shadow);border-color:color-mix(in srgb,var(--sage) 42%,var(--line))}.brief-home-card:after{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(360px circle at var(--mx) var(--my),rgba(255,255,255,.24),transparent 46%);transition:opacity .2s;z-index:5}.brief-home-card:hover:after{opacity:1}.brief-home-cover{height:178px;position:relative;overflow:hidden;background:linear-gradient(135deg,color-mix(in srgb,var(--sage) 18%,var(--mist)),color-mix(in srgb,var(--ochre) 12%,var(--mist)));border-bottom:1px solid var(--line)}.brief-home-cover img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.85) contrast(.96);transform:scale(1.02);transition:transform .65s cubic-bezier(.2,.7,.2,1),filter .35s}.brief-home-card:hover .brief-home-cover img{transform:scale(1.075);filter:saturate(1) contrast(1)}.brief-home-cover:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.02),rgba(0,0,0,.46));z-index:1}.brief-home-fallback{position:absolute;inset:0;display:flex;align-items:flex-end;padding:16px;font-size:1.1rem;font-weight:600;color:var(--ink)}.brief-home-cover.has-error img{display:none}.brief-home-browser{position:absolute;left:10px;right:10px;top:10px;z-index:3;padding:6px 9px;border-radius:9px;background:rgba(245,247,243,.84);backdrop-filter:blur(10px);color:#364139;font-size:.6rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.brief-home-source{position:absolute;left:14px;bottom:12px;z-index:3;color:white;font-size:.72rem;font-weight:600;text-shadow:0 2px 12px rgba(0,0,0,.32)}.brief-home-body{padding:1.2rem 1.3rem 1.3rem;display:flex;flex-direction:column;flex:1;transform:translateZ(14px)}.brief-home-meta{display:flex;gap:8px;align-items:center;font-family:"IBM Plex Mono","PingFang SC",monospace;font-size:.62rem;color:var(--ink-soft);margin-bottom:.8rem}.brief-home-score{margin-left:auto;color:var(--ochre-deep)}.brief-home-card h3{font-family:var(--font-display);font-size:1.18rem;line-height:1.45;margin:0 0 .75rem}.brief-home-card p{font-size:.88rem;color:var(--ink-soft);margin:0}.brief-home-link{margin-top:auto;padding-top:1rem;font-weight:600;font-size:.84rem;color:var(--sage-deep)}.brief-home-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:2rem}.brief-home-head .section-head{margin-bottom:0}.brief-home-all{font-size:.88rem;font-weight:600;color:var(--sage-deep);white-space:nowrap}@media(max-width:920px){.brief-home-grid{grid-template-columns:1fr}.brief-home-head{align-items:start;flex-direction:column}.brief-home-card{min-height:auto;transform:none!important}.brief-home-cover{height:210px}.brief-home-card:after{display:none}}@media(prefers-reduced-motion:reduce){.brief-home-card,.brief-home-card:hover{transform:none!important;transition:none}.brief-home-cover img,.brief-home-card:hover .brief-home-cover img{transform:none;transition:none}.brief-home-card:after{display:none}}';
      document.head.appendChild(style);
      var cards=top.map(function(x){
        var host=hostOf(x.originalUrl);
        var cover='/briefing-covers/'+encodeURIComponent(x.id)+'.png';
        return '<article class="glass brief-home-card" data-home-tilt><div class="brief-home-cover"><div class="brief-home-fallback">'+esc(x.source)+'</div><img src="'+cover+'" alt="" loading="lazy" data-home-cover><div class="brief-home-browser">'+esc(host)+'</div><div class="brief-home-source">'+esc(x.source)+'</div></div><div class="brief-home-body"><div class="brief-home-meta"><span>'+esc(x.category)+'</span><span>· '+esc(x.source)+'</span><span class="brief-home-score">AISK / '+esc(x.score)+'</span></div><h3>'+esc(x.titleZh)+'</h3><p>'+esc(x.summary)+'</p><a class="brief-home-link" href="/briefing">查看快讯详情 →</a></div></article>';
      }).join('');
      var section=document.createElement('section');section.className='brief-home';section.setAttribute('data-briefing-home','1');section.innerHTML='<div class="wrap"><div class="brief-home-head"><div class="section-head"><p class="eyebrow"><span class="section-num">NEWS</span> · AI FOR SCIENCE DAILY</p><h2 class="section-title">今天，哪些科研进展值得你花时间看？</h2><p class="section-lede">每日筛选精准医疗、肿瘤生物学、AI 药物发现与 AI for Science 的重要新进展。</p></div><a class="brief-home-all" href="/briefing">查看全部前沿快讯 ↗</a></div><div class="brief-home-grid">'+cards+'</div></div>';
      target.parentNode.insertBefore(section,target);

      section.querySelectorAll('[data-home-cover]').forEach(function(img){img.addEventListener('error',function(){var c=img.closest('.brief-home-cover');if(c)c.classList.add('has-error');});});
      var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var fine=window.matchMedia('(pointer: fine)').matches;
      if(!reduced&&fine){section.querySelectorAll('[data-home-tilt]').forEach(function(card){card.addEventListener('pointermove',function(e){var r=card.getBoundingClientRect();var x=(e.clientX-r.left)/r.width;var y=(e.clientY-r.top)/r.height;card.style.setProperty('--ry',((x-.5)*5).toFixed(2)+'deg');card.style.setProperty('--rx',((.5-y)*4).toFixed(2)+'deg');card.style.setProperty('--mx',(x*100).toFixed(1)+'%');card.style.setProperty('--my',(y*100).toFixed(1)+'%');});card.addEventListener('pointerleave',function(){card.style.setProperty('--ry','0deg');card.style.setProperty('--rx','0deg');card.style.setProperty('--mx','50%');card.style.setProperty('--my','50%');});});}
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
