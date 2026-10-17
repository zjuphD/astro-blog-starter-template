/* BioSeeki landing-page navigation and presentation. */
const portalOrigin='https://api.bioseeki.com';
const destinations={
  download:'/download',
  english:'/en',
  login:portalOrigin+'/sign-in?redirect=/me',
  signup:portalOrigin+'/sign-up?redirect=/me',
  subscribe:portalOrigin+'/subscriptions',
  x:'https://x.com/lichenQAQ',
  xiaohongshu:'https://xhslink.cn/o/1FHuh0e2oVK',
};
const plans=[
  {name:'Plus',price:'69',credits:'2,000',use:'日常问答与轻量检索'},
  {name:'Pro',price:'149',credits:'5,000',use:'常规科研分析与长文写作'},
  {name:'Heavy',price:'299',credits:'12,000',use:'高强度长任务与深度推理'},
];
let leftHero=false;
function refreshHeroReturn(){
  if(scrollY>100)leftHero=true;
  document.documentElement.classList.toggle('bio-hero-returned',leftHero&&scrollY<100);
}
addEventListener('scroll',refreshHeroReturn,{passive:true});
addEventListener('resize',refreshHeroReturn,{passive:true});
function anchor(text,href,cls=''){
  const a=document.createElement('a');a.textContent=text;a.href=href;a.className=cls;
  if(!href.startsWith('#'))a.dataset.localDestination=href;
  return a;
}
const socialIcons={
  x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.9 2H22l-7.3 8.3L23 22h-6.5l-5.1-6.7L5.5 22H2.3l7.6-8.8L1 2h6.6l4.6 6.1L18.9 2ZM17.8 20h1.8L6.6 3.9H4.7Z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2.75" y="5" width="18.5" height="14" rx="2.2"/><path d="m3.5 6.2 8.5 6.5 8.5-6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  xiaohongshu:'<svg viewBox="0 0 40 24" aria-hidden="true"><rect x="1" y="1" width="38" height="22" rx="6" fill="none" stroke="currentColor" stroke-width="1.3"/><text x="20" y="16.1" text-anchor="middle" fill="currentColor" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="10.5" font-weight="600" letter-spacing="-.5">小红书</text></svg>',
};
function socialLink(name,href,icon){
  const a=anchor('',href,'bio-social-link');
  a.setAttribute('aria-label',name);a.title=name;a.innerHTML=icon;
  if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}
  return a;
}
function brand(){
  if(document.documentElement.lang!=='zh-CN')document.documentElement.lang='zh-CN';
  document.querySelector('#reference-note')?.remove();
  document.querySelector('.local-visual-label')?.remove();
  document.querySelectorAll('img[src="/images/ambi-logo.svg"]').forEach(img=>{img.src='/product-assets/bioseeki-logo.svg';img.alt='BioSeeki';});
  document.querySelectorAll('img[src="/images/ambi-mark.svg"]').forEach(img=>{img.src='/product-assets/brand-mark.svg';img.alt='';});
  document.querySelectorAll('a.brand').forEach(a=>{a.setAttribute('aria-label','BioSeeki');a.href='/';});
  const header=document.querySelector('.site-header');
  if(header&&!header.dataset.bioHeader){
    header.dataset.bioHeader='true';
    const list=header.querySelector('.nav-list');
    if(list){
      const prototype=list.firstElementChild;
      const items=[['产品','#product'],['科研场景','#research'],['定价','#pricing']].map(([text,href])=>{
        const li=prototype.cloneNode(true),link=li.querySelector('a');
        link.textContent=text;link.href=href;link.className='nav-link';
        delete link.dataset.localDestination;link.removeAttribute('target');return li;
      });
      list.replaceChildren(...items);
    }
    const language=header.querySelector('.header-language');
    language?.replaceChildren(anchor('EN',destinations.english,'bio-language'),anchor('登录',destinations.login,'bio-login'));
  }
  const hero=document.querySelector('.o-home-hero');
  if(hero){
    hero.id='product';
    const heading=hero.querySelector('h1');
    if(heading){
      heading.parentElement.classList.add('bio-hero-copy');
      Array.from(heading.parentElement.children).filter(n=>n!==heading).forEach(n=>n.classList.add('bio-hero-info'));
      heading.querySelectorAll('.hero-line').forEach(line=>{
        const text=line.textContent.trim();
        if(line.dataset.opticalCopy===text&&line.querySelector('.bio-title-body'))return;
        const parts=text.match(/^(.*?)([，。！？、：；]+)$/u);
        if(!parts)return;
        const body=document.createElement('span');body.className='bio-title-body';body.textContent=parts[1];
        const end=document.createElement('span');end.className='bio-title-end';end.textContent=parts[2];
        body.append(end);line.replaceChildren(body);line.dataset.opticalCopy=text;
      });
    }
  }
  refreshHeroReturn();
  const slider=document.querySelector('.o-feature-slider');if(slider)slider.id='research';
  const statements=document.querySelectorAll('.o-statement');
  if(statements[0])statements[0].id='evidence';
  const personal=statements[1];
  if(personal){
    personal.id='personal';
    if(!personal.querySelector('.bio-personal-visual')){
      const figure=document.createElement('figure');figure.className='bio-personal-visual';
      figure.innerHTML='<img src="/product-assets/concepts-v2/memory.png" width="1536" height="1024" loading="lazy" alt="课题记忆、知识库与研究进展连接在一起" />';
      personal.append(figure);
    }
  }
  const faq=document.querySelector('.o-faq');
  if(faq&&!document.querySelector('#pricing')){
    const section=document.createElement('section');section.className='bio-pricing';section.id='pricing';section.setAttribute('aria-labelledby','bio-pricing-title');
    section.innerHTML=`<div class="bio-pricing-intro"><div><p class="bio-eyebrow">按你的研究节奏</p><h2 id="bio-pricing-title">从一个问题开始。<br>让研究，接着向前。</h2></div><p>月付订阅，人民币结算。<br>每份套餐包含固定 credits。</p></div><div class="bio-plan-grid">${plans.map((p,i)=>`<article class="bio-plan ${i===1?'bio-plan--recommended':''}"><div class="bio-plan-head"><h3>${p.name}</h3>${i===1?'<span>日常科研</span>':''}</div><p class="bio-plan-use">${p.use}</p><p class="bio-plan-price"><span>¥</span><strong>${p.price}</strong><span> / 月</span></p><p class="bio-plan-credits"><strong>${p.credits}</strong> credits / 月</p><a href="${destinations.subscribe}" data-local-destination="${destinations.subscribe}" class="bio-plan-action">选择 ${p.name}<span aria-hidden="true">↗</span></a></article>`).join('')}</div><div class="bio-pricing-foot"><p>先试着开始。<a href="${destinations.signup}" data-local-destination="${destinations.signup}">注册即送 1,000 credits ↗</a></p><p>套餐额度到期失效；具体权益以订阅页为准。</p></div>`;
    faq.before(section);
  }
  const footer=document.querySelector('footer');if(footer)footer.id='download';
  if(footer&&!footer.dataset.bioFooter){
    footer.dataset.bioFooter='true';
    const social=footer.querySelector('.footer-strip-social');
    if(social){social.setAttribute('aria-label','BioSeeki 社交与联系');social.replaceChildren(socialLink('X',destinations.x,socialIcons.x),socialLink('邮箱：support@bioseeki.com','mailto:support@bioseeki.com',socialIcons.mail),socialLink('小红书',destinations.xiaohongshu,socialIcons.xiaohongshu));}
    const nav=footer.querySelector('[aria-label="Footer navigation"]');
    if(nav)nav.replaceChildren(anchor('下载 Mac Beta',destinations.download),anchor('定价','#pricing'),anchor('隐私政策','/privacy'),anchor('服务条款','/terms'));
  }
  footer?.querySelectorAll('p').forEach(p=>{if(p.textContent.includes('Ambi ©'))p.textContent='BioSeeki © 2026';});
  document.title='BioSeeki｜越用越懂你的个人科研 Agent';
}
let scheduled=false;
const observer=new MutationObserver(()=>{
  if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;brand();});}
});
observer.observe(document.body,{subtree:true,childList:true});
addEventListener('load',brand,{once:true});brand();
document.addEventListener('click',event=>{
  const a=event.target.closest?.('a');if(!a)return;
  const url=new URL(a.href,location.href);
  const oldSegments={features:'#research',hardware:'#research',trust:'#evidence',about:'#personal'};
  const target=a.getAttribute('href')?.startsWith('#')?url.hash:oldSegments[url.pathname.split('/').filter(Boolean).pop()];
  if(target&&document.querySelector(target)){
    event.preventDefault();event.stopImmediatePropagation();
    const menu=document.querySelector('header button[aria-label="Menu"]');
    if(menu?.getAttribute('aria-expanded')==='true')menu.click();
    const behavior=matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth';
    requestAnimationFrame(()=>target==='#product'?scrollTo({top:0,behavior}):document.querySelector(target).scrollIntoView({behavior,block:'start'}));
  }else if(a.dataset.localDestination){
    event.preventDefault();event.stopImmediatePropagation();
    if(a.target==='_blank')window.open(a.dataset.localDestination,'_blank','noopener');else location.href=a.dataset.localDestination;
  }else if(url.pathname==='/waitlist'){
    event.preventDefault();event.stopImmediatePropagation();location.href=destinations.download;
  }else if(a.classList.contains('brand')){
    event.preventDefault();event.stopImmediatePropagation();scrollTo({top:0,behavior:'smooth'});
  }
},true);

document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const anchor=event.target.closest?.('a');if(!anchor)return;
  const url=new URL(anchor.href,location.href);
  if(url.origin!==location.origin||!['/download','/en','/privacy','/terms'].includes(url.pathname))return;
  event.preventDefault();event.stopImmediatePropagation();
  if(anchor.target==='_blank')window.open(url.href,'_blank','noopener');else location.assign(url.href);
},true);

document.addEventListener('submit',event=>{event.preventDefault();event.stopImmediatePropagation();},true);
