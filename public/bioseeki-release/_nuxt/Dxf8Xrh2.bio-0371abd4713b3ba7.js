import{An as e,Cn as t,Dn as n,Fn as r,Kn as i,Mn as a,Rn as o,Un as s,_r as c,cn as l,dr as u,fn as d,fr as f,hn as p,hr as m,ir as h,ln as g,on as _,pn as v,sn as y,sr as ee,tn as te,un as b,vn as x,vr as S}from"./D2iM4HuY.bio-0371abd4713b3ba7.js";import{n as C,t as w}from"./D_MXVlNm.bio-0371abd4713b3ba7.js";import{S as T,y as E}from"./DgKyamBT.bio-0371abd4713b3ba7.js";import{i as D}from"./CHPGZPBR.bio-0371abd4713b3ba7.js";import{C as ne,S as re,_ as O,a as ie,b as ae,c as oe,d as se,f as ce,g as le,h as ue,i as de,l as k,m as fe,n as A,p as pe,r as j,s as M,t as me,u as he,v as ge,x as _e,y as ve}from"./DyNU7o7B.bio-0371abd4713b3ba7.js";import{c as N,o as P}from"./BeRlVVji.bio-0371abd4713b3ba7.js";var F=.4,I=.35,L=(e,t=0,n=1)=>Math.min(n,Math.max(t,Number(e)||0)),R=e=>e*e*(3-2*e);function z(e,t){return L(e)*Math.max(t-1,0)}function B(e,t){return L((e-t+1)/2)}function V(e,t=F){let n=Math.abs(L(e)*2-1);return R(L((.5+t/2-n)/t))}function ye(e,t,n=F){if(t<2)return{from:0,to:0,amount:0};let r=Math.min(Math.max(Math.floor(e),0),t-2),i=R(L((e-r-(.5-n/2))/n));return{from:r,to:r+1,amount:i}}function be(e,t){return Math.min(Math.max(Math.round(e),0),Math.max(t-1,0))}function xe(e,t,n=F,r=null){let{from:i,to:a,amount:o}=ye(e,t,n),s=r?.from===i,c=s?r.incoming:null;o<=0||o>=1?c=null:c===null&&(c=!r||(s?o>=r.amount:e>=r.position)?a:i);let l=c??a;return{under:l===a?i:a,over:l,spread:c===i?1-o:o,from:i,amount:o,position:e,incoming:c}}var Se=`
precision highp float;
uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform sampler2D tFromHaze;
uniform sampler2D tToHaze;
uniform vec2 uResolution;
uniform vec2 uOrigin;
uniform vec2 uBox;
uniform vec4 uRadius;
uniform vec4 uSides;
uniform vec2 uFromSize;
uniform vec2 uToSize;
uniform vec2 uFromFocus;
uniform vec2 uToFocus;
uniform float uAmount;
uniform float uRising;
uniform float uMotion;
uniform float uSwell;
uniform float uAmplitude;
uniform float uEdge;
uniform float uIntro;
uniform float uScatter;
uniform float uPixel;
uniform float uGrain;
uniform vec2 uHaze;
uniform vec2 uHazeSize;
uniform float uShade;
uniform vec4 uTint;
uniform float uTintFrom;
varying vec2 vUv;
${M}
${k}
${A}
${j}

const int TAPS = 9;
const float PI = 3.14159265;
// Half the width of the change's front, of the way it travels.
const float BAND = 0.2;

// A hash without sine, from 0 to 1.
float random(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

// Smooth noise from 0 to 1: the hash at the corners of p's cell, eased between them.
float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 part = fract(p);
  part = part * part * (3.0 - 2.0 * part);
  return mix(
    mix(random(cell), random(cell + vec2(1.0, 0.0)), part.x),
    mix(random(cell + vec2(0.0, 1.0)), random(cell + vec2(1.0, 1.0)), part.x),
    part.y
  );
}

// The distance from p (CSS pixels from the frame's bottom left) to the frame's rounded edge, below
// zero inside it; past the sides that do not end the picture the frame runs on.
float frameDistance(vec2 p) {
  vec2 low = mix(vec2(-1.0e5), vec2(0.0), uSides.xz);
  vec2 high = mix(vec2(1.0e5), uBox, uSides.yw);
  vec2 q = p - 0.5 * (low + high);
  vec2 corners = q.x > 0.0 ? uRadius.xy : uRadius.zw;
  float radius = q.y > 0.0 ? corners.x : corners.y;
  vec2 d = abs(q) - 0.5 * (high - low) + radius;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
}

void main() {
  vec2 point = vUv * uResolution;
  vec2 place = (point - uOrigin) / uBox;
  float t = uAmount;
  float rise = sin(t * PI);
  vec2 aspect = vec2(uBox.x / uBox.y, 1.0);
  // The front: shape is how late the tide reaches this point, from about -0.25 to 1, the way it
  // goes bent by two octaves of noise, square in the frame's proportions.
  float along = mix(1.0 - place.y, place.y, uRising);
  vec2 drift = place * aspect * 1.6 + vec2(0.0, t * 0.5);
  float bent = noise(drift) * 0.65 + noise(drift * 2.3 + 17.0) * 0.35;
  float shape = along * 0.75 + (bent - 0.5) * 0.5;
  float front = mix(-0.25 - BAND, 1.0 + BAND, t);
  float reveal = 1.0 - smoothstep(front - BAND, front + BAND, shape);
  // Within the front the incoming image rises into its place and the other moves on, a few pixels,
  // and both ripple faintly.
  float crest = sin(reveal * PI) * uMotion;
  vec2 way = vec2(0.0, mix(-1.0, 1.0, uRising)) * uMotion;
  vec2 ripple = vec2(sin(place.y * 40.0 + t * 7.0), sin(place.x * aspect.x * 34.0 - t * 6.0));
  ripple *= 0.0025 * crest;
  vec2 fromShift = -way * reveal * 0.006 + ripple;
  vec2 toShift = way * (1.0 - reveal) * 0.012 + ripple;

  float calm = settle(place, uBox, uEdge) * uMotion;
  // The swell stirs a little as the slides change.
  vec3 moving = swell(place, uBox, uAmplitude) * calm * uSwell * (1.0 + 0.6 * rise);
  // The entrance's water: deeper at first, settling as the image fades in.
  float settling = (1.0 - uIntro) * (1.0 - uIntro);
  moving += swell(place, uBox, uAmplitude * 3.0) * calm * settling;
  vec3 water = wake(vUv) * uMotion;
  vec2 bend = moving.xy + water.xy * uResolution / uBox;

  float change = mix(t, reveal, uMotion);
  // Only the images that show are read: at rest, one.
  bool fromShows = change < 1.0;
  bool toShows = change > 0.0;

  // The texture: the points of this pixel's grain, in CSS pixels. Its colour breathes: in soft
  // patches that drift with uTime the points it shows reach a little further or less far, so the
  // grain thickens and thins slowly where it is, never drawn anew. Whether a point lies past the
  // edge follows the point at its own distance, so the picture's outline stays the frame's.
  vec2 cell = floor(gl_FragCoord.xy);
  int taps = uScatter > 0.0 ? TAPS : 1;
  float breath = 1.0;
  if (uScatter > 0.0) {
    vec2 spot = point / (uScatter * 24.0);
    float thick = noise(spot + uTime * vec2(0.07, -0.05)) * 0.6
      + noise(spot * 2.6 + 11.0 - uTime * vec2(0.05, 0.08)) * 0.4;
    breath = mix(0.35, 1.78, thick);
  }
  vec3 sum = vec3(0.0);
  float shown = 0.0;
  for (int i = 0; i < TAPS; i++) {
    if (i >= taps) break;
    vec2 seed = cell + float(i) * vec2(13.37, 7.91);
    float away = uScatter * sqrt(-2.0 * log(max(random(seed), 1.0e-4)));
    float turn = random(seed + 19.19) * 6.2831853 + (random(seed + 47.47) - 0.5) * 0.8 * uTime;
    vec2 toward = away * vec2(cos(turn), sin(turn));
    vec2 source = point + toward * breath;
    float edge = frameDistance(point + toward - uOrigin);
    float inside = uScatter > 0.0 ? step(edge, 0.0) : clamp(0.5 - edge / uPixel, 0.0, 1.0);
    vec2 tap = (source - uOrigin) / uBox + bend;
    vec3 from = vec3(0.0);
    vec3 to = vec3(0.0);
    if (fromShows) {
      from = texture2D(tFrom, cover(tap + fromShift, uBox, uFromSize, uFromFocus)).rgb;
    }
    if (toShows) to = texture2D(tTo, cover(tap + toShift, uBox, uToSize, uToFocus)).rgb;
    vec3 color = mix(from, to, change);
    color *= 1.0 - uGrain * random(floor(source / uPixel) + 71.7);
    sum += color * inside;
    shown += inside;
  }
  vec3 color = shown > 0.0 ? sum / shown : vec3(0.0);
  float hazed = smoothstep(uHaze.x, uHaze.y, 1.0 - place.y);
  if (hazed > 0.0) {
    vec2 tap = place + bend;
    vec3 from = fromShows ? smoothTexture(tFromHaze, tap + fromShift, uHazeSize) : vec3(0.0);
    vec3 to = toShows ? smoothTexture(tToHaze, tap + toShift, uHazeSize) : vec3(0.0);
    color = mix(color, mix(from, to, change), hazed);
  }
  color *= (1.0 - uShade) * (1.0 + moving.z);
  float tinted = clamp((1.0 - place.y - uTintFrom) / max(1.0 - uTintFrom, 1.0e-4), 0.0, 1.0);
  color = mix(color, uTint.rgb, uTint.a * tinted);
  // Light catches the front, faintly.
  color += crest * 0.02 + water.z;
  // Premultiplied, as the canvas is composited (createGlRenderer).
  float alpha = shown / float(taps) * uIntro;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
}
`,Ce=.25,we=.75,H=[`top`,`right`,`bottom`,`left`],U=[`left`,`right`,`bottom`,`top`],Te=(e=[])=>U.map(t=>+!!e.includes(t)),Ee=[2,3],De=[0,0,0,0];function Oe(e){let t=window.devicePixelRatio||1;return e?Math.min(t/Math.max(1,Math.round(e*t)),3):Math.min(t,2)}function ke(e){let t=e=>Number.parseFloat(e)||0;return[t(e.borderTopRightRadius),t(e.borderBottomRightRadius),t(e.borderTopLeftRadius),t(e.borderBottomLeftRadius)]}function W({canvas:t,images:r,frame:i=h(null),position:a=h(0),transition:o=h(F),motion:c=h(!0),intro:l=h(1),edges:d=h(H),grain:f=h(0),haze:p=h(null),blur:m=h(20),shade:g=h(0),tint:_=h(null),tintFrom:v=h(0),amplitude:y=h(me),wake:ee=h(!1),surface:te=()=>u(t)?.parentElement,swell:b=h(!1)}){let x=h(!1),S=h(!1),C,w,T,E,D,k,A,j=null,M=!1,N=!1,P=0,I=1,L=[1,1],R=null,z=[],B=()=>!!(u(b)&&u(c)),V=se(ye,{fps:60});function ye(e=performance.now(),t=0){C&&x.value&&(B()&&(P+=Math.min(t,100)/1e3),we(e),W())}function we(e=performance.now()){j=xe(u(a),D.length,u(o),j);let t=D[j.under],n=D[j.over],r=j.spread,i=Math.min(Math.max(u(l),0),1);(i<1||D.length<2)&&(t=n=D[be(u(a),D.length)],r=0);let s=!!(t.targets&&u(p)),m=w.uniforms;m.tFrom.value=t.texture,m.tTo.value=n.texture,m.tFromHaze.value=s?t.targets[1].texture:k,m.tToHaze.value=s?n.targets[1].texture:k,m.uFromSize.value=t.size,m.uToSize.value=n.size,m.uFromFocus.value=t.focus,m.uToFocus.value=n.focus,m.uAmount.value=r,m.uRising.value=+(j.over>=j.under),m.uMotion.value=+!!u(c),m.uSwell.value=+!!B(),m.uAmplitude.value=u(y)??.008,m.uIntro.value=i,m.uSides.value=Te(u(d)),m.uGrain.value=u(f)||0,m.uHaze.value=s?u(p):Ee,m.uShade.value=u(g)||0,m.uTint.value=u(_)||De,m.uTintFrom.value=u(v)||0,m.uTime.value=P,N=A.flow(e/1e3)>0,C.render({scene:T})}function U(){V.request()}function W(){V.play(x.value&&(B()&&M||N))}function G(e){if(!e.targets)return;let{texture:t,size:n,focus:r,targets:i}=e;w.uniforms.uHazeSize.value=he(C,E,{texture:t,size:n,focus:r,box:L,blur:u(m)*I,targets:i})}function Ae(){let e=u(t),n=e?.parentElement?.getBoundingClientRect(),r=u(i)??e?.parentElement,a=r===e?.parentElement?n:r?.getBoundingClientRect();if(!n?.width||!n.height||!a?.width||!a.height)return!1;I=ge(),L=[a.width,a.height];let o=getComputedStyle(r),s=pe(o,`--water-texture`);S.value=s>0,C.dpr=Oe(s>0?pe(o,`--water-texture-size`)||I:0),C.setSize(n.width,n.height),A.resize(n.width,n.height);let c=w.uniforms;return c.uResolution.value=[n.width,n.height],c.uOrigin.value=a===n?[0,0]:[a.left-n.left,n.bottom-a.bottom],c.uBox.value=L,c.uRadius.value=ke(o),c.uScatter.value=s*Ce,c.uPixel.value=1/C.dpr,c.uEdge.value=32*I,!0}function je(){if(C&&!C.gl.isContextLost()&&Ae()){try{for(let e of D)G(e);we()}catch{J();return}x.value||(x.value=!0,W())}}function Me(e,t){e.texture.image=t,e.texture.needsUpdate=!0,e.size=[t.naturalWidth,t.naturalHeight],e.focus=ue(t)}function K(){let e=u(r)||[];if(!u(t)?.parentElement||!e.length||e.some(e=>!e))return;let n=t=>{if(!C){e.every(le)&&q(e);return}C.gl.isContextLost()||(Me(D[t],e[t]),G(D[t]),U())};e.forEach((e,t)=>{let r=()=>n(t);e.addEventListener(`load`,r),z.push(()=>e.removeEventListener(`load`,r))}),e.every(le)&&q(e)}function q(e){let n=u(t);if(C=ce(n,{powerPreference:`low-power`,alpha:!0}),!C)return;let r=C.gl;k=new _e(r,{image:new Uint8Array([0,0,0,255]),width:1,height:1,generateMipmaps:!1,minFilter:r.NEAREST,magFilter:r.NEAREST}),R={surface:u(te),hazy:!!u(p)},A=de(C,{canvas:n,surface:R.surface,active:()=>x.value&&u(ee)&&u(c),moved:()=>N||U(),fallback:k}),D=e.map(e=>{let t={texture:new _e(r,{generateMipmaps:!1,minFilter:r.LINEAR}),targets:R.hazy?[0,1].map(()=>new ae(r,{width:1,height:1,depth:!1})):null};return Me(t,e),t});let a=new ve(r);R.hazy&&(E=new re(r,{geometry:a,program:new ne(r,{vertex:oe,fragment:ie,uniforms:{tMap:{value:k},uBox:{value:[1,1]},uImageSize:{value:[1,1]},uFocus:{value:[.5,.5]},uStep:{value:[0,0]},uCover:{value:1}}})})),w=new ne(r,{vertex:oe,fragment:Se,uniforms:{tFrom:{value:k},tTo:{value:k},tFromHaze:{value:k},tToHaze:{value:k},uResolution:{value:[1,1]},uOrigin:{value:[0,0]},uBox:{value:[1,1]},uRadius:{value:[0,0,0,0]},uSides:{value:[0,0,0,0]},uFromSize:{value:[1,1]},uToSize:{value:[1,1]},uFromFocus:{value:[.5,.5]},uToFocus:{value:[.5,.5]},uAmount:{value:0},uRising:{value:1},uMotion:{value:1},uSwell:{value:0},uAmplitude:{value:me},uEdge:{value:32},uIntro:{value:1},uScatter:{value:0},uPixel:{value:1},uGrain:{value:0},uHaze:{value:Ee},uHazeSize:{value:[1,1]},uShade:{value:0},uTint:{value:De},uTintFrom:{value:0},uTime:{value:P},...A.uniforms}}),T=new re(r,{geometry:a,program:w}),z.push(O(n,{lost:()=>{V.stop(),x.value=!1},restored:()=>{J({release:!1}),K()}}));let o=new ResizeObserver(je);o.observe(n.parentElement);let s=u(i);s&&s!==n.parentElement&&o.observe(s);let l=new IntersectionObserver(e=>{M=e.at(-1).isIntersecting,W()});l.observe(n),z.push(()=>{o.disconnect(),l.disconnect()}),je()}function J({release:e=!0,lose:t=!1}={}){V.stop(),M=N=!1;for(let e of z.splice(0))e();if(A?.dispose({release:e}),C&&e){let e=C.gl;for(let{texture:t,targets:n}of D)e.deleteTexture(t.texture),n&&fe(e,n);e.deleteTexture(k.texture),T.geometry.remove(),w.remove(),E?.program.remove(),t&&e.getExtension(`WEBGL_lose_context`)?.loseContext()}C=w=T=E=D=k=A=j=R=null,x.value=!1}function Y(){J(),K()}return e(K),n(()=>J({lose:!0})),s(()=>u(r),Y),s([()=>u(te),()=>!!u(p)],([e,t])=>{R&&(e!==R.surface||t!==R.hazy)&&Y()}),s(()=>u(m),()=>{if(C&&x.value){for(let e of D)G(e);U()}}),s([()=>u(a),()=>u(o),()=>u(c),()=>u(l),()=>u(b),()=>String(u(d)),()=>u(f),()=>String(u(p)),()=>u(g),()=>String(u(_)),()=>u(v),()=>u(y)],U),{ready:x,textured:S}}var G={__name:`AWaveCanvas`,props:{images:{type:Array,default:()=>[]},frame:{type:Object,default:null},position:{type:Number,default:0},transition:{type:Number,default:F},intro:{type:Number,default:1},edges:{type:Array,default:()=>H},grain:{type:Number,default:0},haze:{type:Array,default:null},blur:{type:Number,default:20},shade:{type:Number,default:0},tint:{type:Array,default:null},tintFrom:{type:Number,default:0},amplitude:{type:Number,default:void 0},wake:Boolean,surface:{type:Object,default:null},swell:Boolean,motion:{type:Boolean,default:!0}},emits:[`ready`],setup(e,{emit:t}){let n=e,r=t,i=h(null),o=h(null),{ready:c,textured:l}=W({canvas:o,images:()=>n.images,frame:()=>n.frame,position:()=>n.position,transition:()=>n.transition,intro:()=>n.intro,edges:()=>n.edges,grain:()=>n.grain,haze:()=>n.haze,blur:()=>n.blur,shade:()=>n.shade,tint:()=>n.tint,tintFrom:()=>n.tintFrom,amplitude:()=>n.amplitude,wake:()=>n.wake,surface:()=>n.wake?n.surface??i.value?.parentElement:null,swell:()=>n.swell,motion:()=>n.motion});return s(c,e=>r(`ready`,e)),(e,t)=>(a(),b(`div`,{ref_key:`box`,ref:i,class:`relative size-full overflow-hidden`},[y(`canvas`,{ref_key:`canvas`,ref:o,class:m([`absolute inset-0 block transition-opacity duration-300`,[f(c)?`opacity-100`:`opacity-0`,{"[image-rendering:pixelated]":f(l)}]]),"aria-hidden":`true`},null,2)],512))}},Ae={crossorigin:`anonymous`};function je(e){let[t,n,r,i=1]=e.match(/[\d.]+/g)?.map(Number)??[];return t===void 0?null:[t/255,n/255,r/255,i]}var Me={__name:`MWaterImage`,props:{image:{type:Object,default:null},images:{type:Array,default:null},position:{type:Number,default:0},transition:{type:Number,default:F},intro:{type:Number,default:1},sizes:{type:String,default:`100vw`},edges:{type:Array,default:()=>H},grain:{type:Number,default:0},haze:{type:Array,default:null},blur:{type:Number,default:20},shade:{type:Number,default:0},tint:{type:String,default:null},tintFrom:{type:Number,default:0},amplitude:{type:Number,default:void 0},wake:Boolean,surface:{type:Object,default:null},swell:{type:Boolean,default:!0},pictureClass:{type:[String,Array,Object],default:null}},emits:[`ready`],setup(t,{emit:n}){let i=t,o=n,u=_(()=>(i.images?.length?i.images:[i.image]).filter(Boolean)),d=h(null),p=h(null),x=h(null),S=[],C=ee(null);function w(){let e=u.value.map((e,t)=>S[t]?.el?.querySelector(`img`));C.value=e.length&&e.every(Boolean)?e:null}e(w),s(()=>u.value.length,w,{flush:`post`});let T=E(),D=h(!1);function ne(e){D.value=e,o(`ready`,e)}let re=e=>u.value.length>1?V(B(i.position,e),i.transition):1,O=_(()=>Math.round(255*(1-i.shade)*(1-i.grain/2))),ie=_(()=>`${Number((i.tintFrom*100).toFixed(2))}%`),ae=ee(null);e(()=>{x.value&&(ae.value=je(getComputedStyle(x.value).color))});let oe=`calc(var(--water-texture, 0px) * -${we})`,se=_(()=>H.map(e=>i.edges.includes(e)?oe:`0px`).join(` `));return(e,n)=>{let i=N,o=G;return a(),b(`div`,{ref_key:`root`,ref:d,class:`m-water-image relative size-full rounded-[inherit]`},[y(`div`,{ref_key:`frame`,ref:p,class:m([`absolute inset-0 overflow-hidden rounded-[inherit]`,{"opacity-0":f(D)}]),style:c(f(O)<255?{backgroundColor:`rgb(${f(O)} ${f(O)} ${f(O)})`}:null)},[(a(!0),b(te,null,r(f(u),(e,n)=>(a(),l(i,{key:n,ref_for:!0,ref:e=>S[n]=e,image:e,sizes:t.sizes,"img-attrs":Ae,class:m([`absolute inset-0 size-full`,[t.pictureClass,{"mix-blend-multiply":f(O)<255}]]),style:c(f(u).length>1?{opacity:re(n)}:null)},null,8,[`image`,`sizes`,`class`,`style`]))),128)),t.tint?(a(),b(`div`,{key:0,ref_key:`tintLayer`,ref:x,class:`absolute inset-0`,style:c({color:t.tint,backgroundImage:`linear-gradient(to bottom, transparent ${f(ie)}, currentColor)`})},null,4)):g(``,!0)],6),f(C)?(a(),b(`div`,{key:0,class:`pointer-events-none absolute`,style:c({inset:f(se)})},[v(o,{images:f(C),frame:f(p),position:t.position,transition:t.transition,intro:t.intro,edges:t.edges,grain:t.grain,haze:t.haze,blur:t.blur,shade:t.shade,tint:f(ae),"tint-from":t.tintFrom,amplitude:t.amplitude,wake:t.wake,surface:t.surface??f(d),swell:t.swell,motion:f(T)!==`reduce`,onReady:ne},null,8,[`images`,`frame`,`position`,`transition`,`intro`,`edges`,`grain`,`haze`,`blur`,`shade`,`tint`,`tint-from`,`amplitude`,`wake`,`surface`,`swell`,`motion`])],4)):g(``,!0)],512)}}};function K(e){return e._type===`span`&&`text`in e&&typeof e.text==`string`&&(e.marks===void 0||Array.isArray(e.marks)&&e.marks.every(e=>typeof e==`string`))}function q(e){return typeof e._type==`string`&&e._type[0]!==`@`&&(!(`markDefs`in e)||!e.markDefs||Array.isArray(e.markDefs)&&e.markDefs.every(e=>typeof e._key==`string`))&&`children`in e&&Array.isArray(e.children)&&e.children.every(e=>typeof e==`object`&&`_type`in e)}function J(e){return q(e)&&`listItem`in e&&typeof e.listItem==`string`&&(e.level===void 0||typeof e.level==`number`)}function Y(e){return e._type===`@list`}function Ne(e){return e._type===`@span`}function Pe(e){return e._type===`@text`}var Fe=[`strong`,`em`,`code`,`underline`,`strike-through`];function Ie(e,t,n){if(!K(e)||!e.marks||!e.marks.length)return[];let r=e.marks.slice(),i={};return r.forEach(e=>{i[e]=1;for(let r=t+1;r<n.length;r++){let t=n[r];if(t&&K(t)&&Array.isArray(t.marks)&&t.marks.indexOf(e)!==-1)i[e]++;else break}}),r.sort((e,t)=>Le(i,e,t))}function Le(e,t,n){let r=e[t],i=e[n];if(r!==i)return i-r;let a=Fe.indexOf(t),o=Fe.indexOf(n);return a===o?t.localeCompare(n):a-o}function Re(e){let{children:t}=e,n=e.markDefs??[];if(!t||!t.length)return[];let r=t.map(Ie),i={_type:`@span`,children:[],markType:`<unknown>`},a=[i];for(let e=0;e<t.length;e++){let i=t[e];if(!i)continue;let o=r[e]||[],s=1;if(a.length>1)for(;s<a.length;s++){let e=o.indexOf(a[s]?.markKey||``);if(e===-1)break;o.splice(e,1)}a=a.slice(0,s);let c=a[a.length-1];if(c){for(let e of o){let t=n?.find(t=>t._key===e),r={_type:`@span`,_key:i._key,children:[],markDef:t,markType:t?t._type:e,markKey:e};c.children.push(r),a.push(r),c=r}if(K(i)){let e=i.text.split(`
`);for(let t=e.length;t-->1;)e.splice(t,0,`
`);c.children=c.children.concat(e.map(e=>({_type:`@text`,text:e})))}else c.children=c.children.concat(i)}}return i.children}function ze(e,t){let n=[],r;for(let i=0;i<e.length;i++){let a=e[i];if(a){if(!J(a)){n.push(a),r=void 0;continue}if(!r){let e=X(a,i,t,0);r=e.current,n.push(e.root);continue}if(Be(a,r)){r.children.push(a);continue}if((a.level||1)>r.level){let e=X(a,i,t,r.level);We(r,e.root),r=e.current;continue}if((a.level||1)<r.level){let e=n[n.length-1],o=e&&Ge(e,a);if(o){r=o,r.children.push(a);continue}let s=X(a,i,t,0);r=s.current,n.push(s.root);continue}if(a.listItem!==r.listItem){let e=n[n.length-1],o=e&&Ge(e,{level:a.level||1});if(o&&o.listItem===a.listItem){r=o,r.children.push(a);continue}{let e=X(a,i,t,0);r=e.current,n.push(e.root);continue}}console.warn(`Unknown state encountered for block`,a),n.push(a)}}return n}function Be(e,t){return(e.level||1)===t.level&&e.listItem===t.listItem}function Ve(e,t,n,r,i){let a=r===(e.level||1)?``:`-${r}`;return{_type:`@list`,_key:`${e._key||`${t}`}-parent${a}`,mode:n,level:r,listItem:e.listItem,children:i}}function X(e,t,n,r){let i=e.level||1,a=r+1,o=Ve(e,t,n,a,He(e,t,n,a,i)),s=o;for(let r=a+1;r<=i;r++){let a=Ve(e,t,n,r,He(e,t,n,r,i));We(s,a),s=a}return{root:o,current:s}}function He(e,t,n,r,i){return r===i?[e]:n===`html`?[Ue(e,t,r)]:[]}function Ue(e,t,n){return{...e,_key:`${e._key||`${t}`}-placeholder-${n}`,children:[],level:n}}function We(e,t){if(e.mode===`html`&&t.mode===`html`){let n=e.children.length-1,r=e.children[n];if(!r)return;e.children[n]={...r,children:[...r.children,t]};return}e.mode===`direct`&&t.mode===`direct`&&e.children.push(t)}function Ge(e,t){let n=t.level||1,r=t.listItem||`normal`,i=typeof t.listItem==`string`;if(Y(e)&&(e.level||1)===n&&i&&(e.listItem||`normal`)===r)return e;if(!(`children`in e))return;let a=e.children[e.children.length-1];return a&&!K(a)?Ge(a,t):void 0}function Ke(e){let t=``;return e.children.forEach(e=>{Pe(e)?t+=e.text:Ne(e)&&(t+=Ke(e))}),t}var qe=`html`;function Je(e,t){let{block:n,list:r,listItem:i,marks:a,types:o,...s}=t;return{...e,block:Z(e,t,`block`),list:Z(e,t,`list`),listItem:Z(e,t,`listItem`),marks:Z(e,t,`marks`),types:Z(e,t,`types`),...s}}function Z(e,t,n){let r=t[n],i=e[n];return typeof r==`function`||r&&typeof i==`function`?r:r?{...i,...r}:i}var Q=e=>(t,{slots:n})=>x(e,n.default?.call(n)),Ye=({value:e},{slots:t})=>x(`a`,{href:e?.href},t.default?.call(t)),Xe={textDecoration:`underline`},Ze={code:Q(`code`),em:Q(`em`),link:Ye,"strike-through":Q(`del`),strong:Q(`strong`),underline:(e,{slots:t})=>x(`span`,{style:Xe},t.default?.call(t))},Qe={number:Q(`ol`),bullet:Q(`ul`)},$e=Q(`li`),$=(e,t)=>`[@portabletext/vue] Unknown ${e}, specify a component for it in the \`components.${t}\` prop`,et=e=>$(`block type "${e}"`,`types`),tt=e=>$(`mark type "${e}"`,`marks`),nt=e=>$(`block style "${e}"`,`block`),rt=e=>$(`list style "${e}"`,`list`),it=e=>$(`list item style "${e}"`,`listItem`);function at(e){console.warn(e)}var ot={display:`none`},st=({value:e,isInline:t})=>{let n=et(e._type);return x(t?`span`:`div`,{style:ot},n)},ct=({markType:e},{slots:t})=>x(`span`,{class:`unknown__pt__mark__${e}`},t.default?.call(t)),lt=Q(`p`),ut=Q(`ul`),dt=Q(`li`),ft={types:{},block:{normal:Q(`p`),blockquote:Q(`blockquote`),h1:Q(`h1`),h2:Q(`h2`),h3:Q(`h3`),h4:Q(`h4`),h5:Q(`h5`),h6:Q(`h6`)},marks:Ze,list:Qe,listItem:$e,hardBreak:()=>x(`br`),unknownType:st,unknownMark:ct,unknownList:ut,unknownListItem:dt,unknownBlockStyle:lt},pt=(e,t)=>{function n(e){let{node:t,index:n,isInline:d}=e,f=t._key||`node-${n}`;return Y(t)?a(t,n,f):J(t)?i(t,n,f):Ne(t)?o(t,n,f):r(t)?u(t,n,f,d):q(t)?s(t,n,f,d):Pe(t)?c(t,f):l(t,n,f,d)}function r(t){return t._type in e.types}function i(r,i,a){let o=mt({node:r,index:i,isInline:!1,renderNode:n}),s=e.listItem,c=(typeof s==`function`?s:s[r.listItem])||e.unknownListItem;if(c===e.unknownListItem){let e=r.listItem||`bullet`;t(it(e),{type:e,nodeType:`listItemStyle`})}let l=o.children;if(r.style&&r.style!==`normal`){let{listItem:e,...t}=r;l=n({node:t,index:i,isInline:!1,renderNode:n})}return x(c,{key:a,value:r,index:i,isInline:!1,renderNode:n},()=>l)}function a(r,i,a){let o=r.children.map((e,t)=>n({node:e._key?e:{...e,_key:`li-${i}-${t}`},index:t,isInline:!1,renderNode:n})),s=e.list,c=(typeof s==`function`?s:s[r.listItem])||e.unknownList;if(c===e.unknownList){let e=r.listItem||`bullet`;t(rt(e),{nodeType:`listStyle`,type:e})}return x(c,{key:a,value:r,index:i,isInline:!1,renderNode:n},()=>o)}function o(r,i,a){let{markDef:o,markType:s,markKey:c}=r,l=e.marks[s]||e.unknownMark,u=r.children.map((e,t)=>n({node:e,index:t,isInline:!0,renderNode:n}));return l===e.unknownMark&&t(tt(s),{nodeType:`mark`,type:s}),x(l,{key:a,text:Ke(r),value:o,markType:s,markKey:c,renderNode:n},()=>u)}function s(r,i,a,o){let{_key:s,children:c,...l}=mt({node:r,index:i,isInline:o,renderNode:n}),u=l.node.style||`normal`,d=(typeof e.block==`function`?e.block:e.block[u])||e.unknownBlockStyle;return d===e.unknownBlockStyle&&t(nt(u),{nodeType:`blockStyle`,type:u}),x(d,{key:a,...l,value:l.node,renderNode:n},()=>c)}function c(t,n){if(t.text===`
`){let t=e.hardBreak;return t?x(t,{key:n}):`
`}return t.text}function l(r,i,a,o){let s={value:r,isInline:o,index:i,renderNode:n};t(et(r._type),{nodeType:`block`,type:r._type});let c=e.unknownType;return x(c,{key:a,...s})}function u(t,r,i,a){let o={value:t,isInline:a,index:r,renderNode:n},s=e.types[t._type];return s?x(s,{key:i,...o}):void 0}return n};function mt(e){let{node:t,index:n,isInline:r,renderNode:i}=e,a=Re(t).map((e,t)=>i({node:e,isInline:!0,index:t,renderNode:i}));return{_key:t._key||`block-${n}`,children:a,index:n,isInline:r,node:t}}var ht=p({__name:`vue-portable-text`,props:{value:{},components:{},onMissingComponent:{type:[Function,Boolean],default:()=>at},listNestingMode:{}},setup(e){function t(){}let n=e,r=()=>{let e=n.onMissingComponent||t,r=ze(Array.isArray(n.value)?n.value:[n.value],n.listNestingMode||qe),i=pt(n.components?Je(ft,n.components):ft,e);return r.map((e,t)=>i({node:e,index:t,isInline:!1,renderNode:i}))};return(e,t)=>(a(),l(r))}}),gt={__name:`ARichText`,props:{value:{type:[Array,String],default:null},tag:{type:String,default:`div`},lines:Boolean,inline:Boolean,clauses:Boolean,headingTag:{type:String,default:null},types:{type:Object,default:null}},setup(e){let t=e,n=({value:e},{slots:t})=>x(C,{href:e?.href??null,newTab:!!e?.newTab},t.default),r=(e,{slots:n})=>x(t.headingTag,n.default?.()),s=_(()=>{if(t.headingTag)return{h2:r,h3:r};if(t.inline)return{normal:(e,{slots:t})=>t.default?.()};if(t.lines)return{normal:(e,{slots:t})=>x(`span`,{class:`block`},t.default?.())}}),c=(e,{slots:t})=>x(`span`,{class:`clause`},t.default?.()),u=(e,t)=>e.map(e=>{if(e._type!==`block`||!Array.isArray(e.children)||t&&!t.includes(e.style))return e;let n=[...e.markDefs||[]],r=e.children.flatMap(e=>{let t=e._type===`span`?P(e.text):[];return t.length<2?[e]:t.map((t,r)=>{let i=`${e._key}-clause-${r}`;return t.trim()?(n.push({_key:i,_type:`clause`}),{...e,_key:i,text:t,marks:[...e.marks||[],i]}):{...e,_key:i,text:t}})});return{...e,children:r,markDefs:n}}),d=_(()=>Array.isArray(t.value)?t.headingTag?u(t.value,[`h2`,`h3`]):t.lines||t.inline||t.clauses?u(t.value):t.value:t.value),f=_(()=>({marks:{link:n,internalLink:n,clause:c},...s.value&&{block:s.value},...t.types&&{types:Object.fromEntries(Object.entries(t.types).map(([e,t])=>[e,({value:{_key:e,_type:n,...r}})=>x(t,r)]))}})),p=()=>typeof t.value==`string`?t.value:x(ht,{value:d.value,components:f.value});return(t,n)=>e.tag&&e.value?.length?(a(),l(o(e.tag),{key:0},{default:i(()=>[v(p)]),_:1})):e.value?.length?(a(),l(p,{key:1})):g(``,!0)}},_t={__name:`MFadeButton`,props:{button:{type:Object,default:null},addToTimeline:{type:Function,default:void 0},delay:{type:Number,default:0},variant:{type:String,default:void 0},buttonClass:{type:[String,Array,Object],default:null},buttonAttrs:{type:Object,default:()=>({})}},setup(e){return(n,r)=>{let o=w,s=D;return e.button?.href?(a(),l(s,{key:0,preset:`fadeUp`,"add-to-timeline":e.addToTimeline,delay:e.delay,class:`m-fade-button flex`},{default:i(()=>[v(o,t(e.buttonAttrs,{href:e.button.href,"new-tab":e.button.newTab,variant:e.variant,class:e.buttonClass}),{default:i(()=>[d(S(e.button.title),1)]),_:1},16,[`href`,`new-tab`,`variant`,`class`])]),_:1},8,[`add-to-timeline`,`delay`])):g(``,!0)}}};function vt(){let e=T(`header-clears`,()=>[]);return{cleared:_(()=>e.value.length>0),clear(t){e.value.includes(t)||(e.value=[...e.value,t])},release(t){e.value=e.value.filter(e=>e!==t)}}}function yt(){let e=T(`header-holds`,()=>[]);return{held:_(()=>e.value.length>0),hold(t){e.value.includes(t)||(e.value=[...e.value,t])},release(t){e.value=e.value.filter(e=>e!==t)}}}export{Me as a,be as c,V as d,gt as i,z as l,vt as n,I as o,_t as r,F as s,yt as t,B as u};