export default function briefingFallback() {
  return {
    name: "aiseeki-briefing-fallback",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        injectScript(
          "page",
          `
(function(){
  function addStyles(){
    if(document.getElementById('aiseeki-briefing-fallback-style')) return;
    var style=document.createElement('style');
    style.id='aiseeki-briefing-fallback-style';
    style.textContent=
      '.cover-shot.has-error,.brief-home-cover.has-error{background:radial-gradient(circle at 82% 18%,rgba(192,138,45,.18),transparent 34%),radial-gradient(circle at 18% 82%,rgba(110,143,124,.28),transparent 42%),linear-gradient(145deg,#edf0e9,#dfe6dd);}' +
      '.cover-shot.has-error:after,.brief-home-cover.has-error:after{display:none!important;}' +
      '.cover-shot.has-error .browser-bar,.cover-shot.has-error .cover-label,.brief-home-cover.has-error .brief-home-browser,.brief-home-cover.has-error .brief-home-source{display:none!important;}' +
      '.cover-shot.has-error .cover-fallback,.brief-home-cover.has-error .brief-home-fallback{z-index:2!important;inset:0!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:space-between!important;padding:26px!important;color:#24312B!important;background:linear-gradient(135deg,rgba(255,255,255,.20),rgba(255,255,255,.02));}' +
      '.brief.featured .cover-shot.has-error .cover-fallback{padding:38px!important;}' +
      '.brief-home-cover.has-error .brief-home-fallback{padding:20px!important;}' +
      '.aiseeki-fallback-kicker{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.66rem;letter-spacing:.13em;color:#54745F;text-transform:uppercase;}' +
      '.aiseeki-fallback-title{font-size:clamp(1.25rem,2.4vw,2.05rem);line-height:1.25;letter-spacing:-.025em;max-width:20ch;color:#24312B;font-weight:700;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;}' +
      '.brief-home-cover .aiseeki-fallback-title{font-size:1.05rem;line-height:1.35;-webkit-line-clamp:3;max-width:24ch;}' +
      '.aiseeki-fallback-meta{display:flex;align-items:center;gap:8px;font-size:.72rem;color:#5A6A62;}' +
      '.aiseeki-fallback-meta:before{content:"";width:7px;height:7px;border-radius:50%;background:#C08A2D;display:block;}' +
      '@media(prefers-color-scheme:dark){.cover-shot.has-error,.brief-home-cover.has-error{background:radial-gradient(circle at 82% 18%,rgba(217,169,78,.18),transparent 34%),radial-gradient(circle at 18% 82%,rgba(143,180,159,.22),transparent 42%),linear-gradient(145deg,#1b2420,#202c26)}.cover-shot.has-error .cover-fallback,.brief-home-cover.has-error .brief-home-fallback{color:#E9ECE5!important}.aiseeki-fallback-kicker{color:#A9CBB8}.aiseeki-fallback-title{color:#E9ECE5}.aiseeki-fallback-meta{color:#A7B4AB}}';
    document.head.appendChild(style);
  }

  function buildFallback(container, fallback, title, category, source){
    if(!container || !fallback || fallback.dataset.enhanced==='1') return;
    fallback.dataset.enhanced='1';
    fallback.textContent='';

    var kicker=document.createElement('span');
    kicker.className='aiseeki-fallback-kicker';
    kicker.textContent='AISEEKI DAILY' + (category ? ' · ' + category : '');

    var headline=document.createElement('strong');
    headline.className='aiseeki-fallback-title';
    headline.textContent=title || source || 'AI for Science';

    var meta=document.createElement('span');
    meta.className='aiseeki-fallback-meta';
    meta.textContent=source || '原始来源暂不可预览';

    fallback.appendChild(kicker);
    fallback.appendChild(headline);
    fallback.appendChild(meta);
  }

  function markIfBroken(img, container, fallback, title, category, source){
    function fail(){
      container.classList.add('has-error');
      buildFallback(container,fallback,title,category,source);
    }
    img.addEventListener('error',fail,{once:true});
    if(img.complete && img.naturalWidth===0) fail();
  }

  function init(){
    addStyles();

    document.querySelectorAll('.cover-shot').forEach(function(container){
      var img=container.querySelector('[data-cover]');
      var fallback=container.querySelector('.cover-fallback');
      var card=container.closest('.brief');
      if(!img || !fallback || !card) return;
      var title=card.querySelector('.brief-body h2')?.textContent?.trim() || '';
      var category=card.querySelector('.cat')?.textContent?.trim() || '';
      var source=card.querySelector('.source')?.textContent?.split('·')[0]?.trim() || fallback.querySelector('b')?.textContent?.trim() || '';
      markIfBroken(img,container,fallback,title,category,source);
      if(container.classList.contains('has-error')) buildFallback(container,fallback,title,category,source);
    });

    document.querySelectorAll('.brief-home-cover').forEach(function(container){
      var img=container.querySelector('[data-home-cover]');
      var fallback=container.querySelector('.brief-home-fallback');
      var card=container.closest('.brief-home-card');
      if(!img || !fallback || !card) return;
      var title=card.querySelector('h3')?.textContent?.trim() || '';
      var metaText=card.querySelector('.brief-home-meta')?.textContent?.trim() || '';
      var source=fallback.textContent?.trim() || '';
      var category=(metaText.split('·')[0] || '').trim();
      markIfBroken(img,container,fallback,title,category,source);
      if(container.classList.contains('has-error')) buildFallback(container,fallback,title,category,source);
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
          `,
        );
      },
    },
  };
}
