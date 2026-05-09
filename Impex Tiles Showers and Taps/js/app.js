// IMPEX TILES — WATER COLLECTION (Page 2) interactions

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Custom copper cursor ---------- */
(function cursor(){
  if (matchMedia('(pointer: coarse)').matches) return;
  const c = document.querySelector('.cursor');
  if (!c) return;
  let x=window.innerWidth/2, y=window.innerHeight/2, tx=x, ty=y;
  document.addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; });
  function tick(){
    x += (tx-x)*0.18; y += (ty-y)*0.18;
    c.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  }
  tick();
  document.querySelectorAll('a,button,.swiper-arrow,.swiper-dots button,.copperbtn,.crosslink-thumb').forEach(el => {
    el.addEventListener('mouseenter', ()=> c.classList.add('is-hot'));
    el.addEventListener('mouseleave', ()=> c.classList.remove('is-hot'));
  });
})();

/* ---------- Lenis smooth scroll ---------- */
let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, smoothTouch: false, easing:(t)=>1 - Math.pow(1-t,3) });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>lenis.raf(time*1000));
    gsap.ticker.lagSmoothing(0);
  }
}

function smoothTo(target){
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior:'smooth' });
}

document.querySelectorAll('[data-scroll-to]').forEach(btn=>{
  btn.addEventListener('click', e=>{
    e.preventDefault();
    smoothTo(btn.getAttribute('data-scroll-to'));
  });
});

/* ---------- Hero word reveal ---------- */
(function heroReveal(){
  const h1 = document.querySelector('.hero h1');
  if (!h1) return;
  // Wrap each word in span.word > span
  const words = h1.textContent.trim().split(/\s+/);
  h1.innerHTML = words.map(w => `<span class="word"><span>${w}</span></span>`).join(' ');
  if (reduceMotion) {
    h1.querySelectorAll('.word > span').forEach(s => s.style.transform = 'translateY(0)');
    document.querySelector('.subhead')?.style.setProperty('opacity','1');
    document.querySelector('.hero .copperbtn')?.style.setProperty('opacity','1');
    return;
  }
  if (!window.gsap) return;
  gsap.set('.subhead', { y:24, opacity:0 });
  gsap.set('.hero .copperbtn', { y:18, opacity:0 });
  const tl = gsap.timeline({ delay:.18, defaults:{ ease:'power3.out' } });
  tl.to('.hero h1 .word > span', { y:'0%', duration:.95, stagger:.085 })
    .to('.subhead', { y:0, opacity:1, duration:.7 }, '-=.55')
    .to('.hero .copperbtn', { y:0, opacity:1, duration:.5 }, '-=.35');
})();

/* ---------- Hero parallax ---------- */
(function heroParallax(){
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('.hero-media', {
    yPercent:14,
    scale:1.08,
    ease:'none',
    scrollTrigger:{
      trigger:'.hero',
      start:'top top',
      end:'bottom top',
      scrub:true,
    }
  });
  gsap.to('.hero-copy', {
    yPercent:-22,
    opacity:0,
    ease:'none',
    scrollTrigger:{
      trigger:'.hero',
      start:'top top',
      end:'bottom top',
      scrub:true,
    }
  });
})();

/* ---------- Generic swiper ---------- */
class Swiper {
  constructor(root){
    this.root = root;
    this.slides = [...root.querySelectorAll('.swiper-slide')];
    this.dots = [...root.querySelectorAll('.swiper-dots button')];
    this.prev = root.querySelector('.swiper-arrow.prev');
    this.next = root.querySelector('.swiper-arrow.next');
    this.copySlots = [...root.querySelectorAll('.collection-copy [data-slide]')];
    this.products = JSON.parse(root.querySelector('[data-products]').textContent);
    this.index = 0;
    this.bind();
    this.go(0, true);
  }
  bind(){
    this.dots.forEach((d,i)=>d.addEventListener('click', ()=>this.go(i)));
    this.prev?.addEventListener('click', ()=>this.go(this.index-1));
    this.next?.addEventListener('click', ()=>this.go(this.index+1));
    let sx=0, sy=0;
    const stage = this.root.querySelector('.swiper-stage');
    stage.addEventListener('touchstart', e => { sx=e.touches[0].clientX; sy=e.touches[0].clientY; }, {passive:true});
    stage.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) this.go(this.index + (dx<0?1:-1));
    });
    // Mouse drag
    let mx=0, dragging=false;
    stage.addEventListener('mousedown', e => { dragging=true; mx=e.clientX; });
    window.addEventListener('mouseup', e => {
      if (!dragging) return; dragging=false;
      const dx = e.clientX - mx;
      if (Math.abs(dx) > 60) this.go(this.index + (dx<0?1:-1));
    });
    // Keyboard
    this.root.tabIndex = 0;
    this.root.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') this.go(this.index+1);
      if (e.key === 'ArrowLeft') this.go(this.index-1);
    });
  }
  go(i, init=false){
    const n = this.slides.length;
    i = ((i % n) + n) % n;
    this.index = i;
    this.slides.forEach((s,si)=>s.classList.toggle('is-active', si===i));
    this.dots.forEach((d,di)=>d.classList.toggle('is-active', di===i));
    const p = this.products[i];
    if (this.copySlots.length){
      const num = this.root.querySelector('[data-slide="num"]');
      const title = this.root.querySelector('[data-slide="title"]');
      const desc = this.root.querySelector('[data-slide="desc"]');
      const specs = this.root.querySelector('[data-slide="specs"]');
      if (num) num.textContent = `0${i+1} / 0${n}`;
      const fade = (el, html) => {
        if (!el) return;
        if (init || reduceMotion){ el.innerHTML = html; return; }
        el.style.transition='opacity .18s ease, transform .18s ease';
        el.style.opacity='0'; el.style.transform='translateY(8px)';
        setTimeout(()=>{
          el.innerHTML = html;
          el.style.opacity='1'; el.style.transform='translateY(0)';
        }, 180);
      };
      fade(title, p.title);
      fade(desc, p.desc);
      fade(specs, p.specs.map(s=>`<div><span>${s[0]}</span><span>${s[1]}</span></div>`).join(''));
    }
  }
}

document.querySelectorAll('[data-swiper]').forEach(el => new Swiper(el));

/* ---------- Promise underline draw ---------- */
(function promise(){
  if (!window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll('.promise-line .underline').forEach(u => u.style.setProperty('--draw','1'));
    return;
  }
  if (reduceMotion){
    document.querySelectorAll('.promise-line .underline').forEach(u => u.style.setProperty('--draw','1'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.promise-line').forEach(line => {
    const u = line.querySelector('.underline');
    gsap.fromTo(line, { y:30, opacity:0 }, {
      y:0, opacity:1, duration:.9, ease:'power3.out',
      scrollTrigger:{ trigger:line, start:'top 78%' }
    });
    if (u){
      ScrollTrigger.create({
        trigger:line,
        start:'top 65%',
        onEnter: ()=> u.style.setProperty('--draw','1'),
      });
    }
  });
})();

/* ---------- Spawn dynamic water particles ---------- */
function spawnDrops(host, count){
  const frag = document.createDocumentFragment();
  for (let i=0;i<count;i++){
    const d = document.createElement('span');
    d.className='drop';
    const left = 22 + Math.random()*56;
    d.style.left = left + '%';
    d.style.animationDelay = (-Math.random()*1.4)+'s';
    d.style.animationDuration = (1.1 + Math.random()*.8)+'s';
    frag.appendChild(d);
  }
  host.appendChild(frag);
}
function spawnHJets(host, count, side='left'){
  const frag = document.createDocumentFragment();
  for (let i=0;i<count;i++){
    const j = document.createElement('span');
    j.className = 'jet';
    j.style.top = (24 + (i*(56/count))) + '%';
    j.style.width = (40 + Math.random()*80) + 'px';
    j.style.animationDelay = (-Math.random()*1.6)+'s';
    j.style.animationDuration = (1.2 + Math.random()*.8)+'s';
    frag.appendChild(j);
  }
  host.appendChild(frag);
}
function spawnBilateral(host){
  const left = host.querySelector('.bilateral-l');
  const right = host.querySelector('.bilateral-r');
  for (let i=0;i<6;i++){
    const j = document.createElement('span');
    j.className='jet-l';
    j.style.top = (38 + i*5) + '%';
    j.style.right = '50%';
    j.style.width = (60 + Math.random()*60) + 'px';
    j.style.animationDelay = (-Math.random()*1.4)+'s';
    left.appendChild(j);
    const r = document.createElement('span');
    r.className='jet-r';
    r.style.top = (38 + i*5) + '%';
    r.style.left = '50%';
    r.style.width = (60 + Math.random()*60) + 'px';
    r.style.animationDelay = (-Math.random()*1.4)+'s';
    right.appendChild(r);
  }
}

document.querySelectorAll('.water-thin-rain').forEach(host => spawnDrops(host, 28));
document.querySelectorAll('.water-jets-h').forEach(host => spawnHJets(host, 8));
document.querySelectorAll('.water-bilateral').forEach(host => spawnBilateral(host));

/* ---------- Year ---------- */
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
