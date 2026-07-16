"use strict";

/* ── Navbar scroll ──────────────────────────────────────── */
const navbar=document.getElementById("navbar");
window.addEventListener("scroll",()=>navbar.classList.toggle("scrolled",window.scrollY>60),{passive:true});

/* ── Mobile nav ─────────────────────────────────────────── */
const navToggle=document.getElementById("navToggle");
const navLinks=document.getElementById("navLinks");
navToggle.addEventListener("click",()=>{
  const open=navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded",open);
});
navLinks.querySelectorAll("a").forEach(l=>l.addEventListener("click",()=>{
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded","false");
}));

/* ── Smooth scroll ──────────────────────────────────────── */
document.querySelectorAll("a[href^=\"#\"]").forEach(a=>{
  a.addEventListener("click",e=>{
    const h=a.getAttribute("href");
    if(h==="#"){e.preventDefault();return;}
    const t=document.querySelector(h);
    if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"});}
  });
});

/* ── Modals ─────────────────────────────────────────────── */
function openModal(id){const m=document.getElementById(id);if(!m)return;m.classList.add("is-open");document.body.style.overflow="hidden";const b=m.querySelector(".modal__close");if(b)setTimeout(()=>b.focus(),50);}
function closeModal(id){const m=document.getElementById(id);if(!m)return;m.classList.remove("is-open");document.body.style.overflow="";}
document.getElementById("btnImpressum").addEventListener("click",()=>openModal("modalImpressum"));
document.getElementById("btnDatenschutz").addEventListener("click",()=>openModal("modalDatenschutz"));
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",()=>closeModal("modal"+el.dataset.close)));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal.is-open").forEach(m=>{m.classList.remove("is-open");document.body.style.overflow="";});});

/* ── Scroll-reveal ──────────────────────────────────────── */
document.querySelectorAll(".feature-card,.char-card,.world-flip,.stat-card,.lb-card,.screenshot-ph,.trailer-box").forEach(el=>el.classList.add("reveal"));
document.querySelectorAll(".reveal").forEach(el=>{
  new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){const i=Array.from(e.target.parentElement.children).indexOf(e.target);setTimeout(()=>e.target.classList.add("in-view"),Math.min(i*75,450));}});
  },{threshold:0.08,rootMargin:"0px 0px -40px 0px"}).observe(el);
});

/* ── World Flip Cards ───────────────────────────────────── */
document.querySelectorAll(".world-flip").forEach(card=>{
  card.addEventListener("click",()=>card.classList.toggle("is-flipped"));
});

/* ── Character Ability Cycler ───────────────────────────── */
document.querySelectorAll(".char-card").forEach(card=>{
  const raw=card.dataset.abilities;
  if(!raw)return;
  let abilities;
  try{abilities=JSON.parse(raw);}catch{return;}
  const accent=card.dataset.accent;
  const cycler=card.querySelector(".char-ability-cycler");
  const pill=card.querySelector(".ability-pill");
  const desc=card.querySelector(".char-card__desc");
  const counter=card.querySelector(".char-ability-cycler__counter");
  let idx=0;
  cycler.addEventListener("click",e=>{
    e.stopPropagation();
    if(cycler.classList.contains("is-flipping"))return;
    cycler.classList.add("is-flipping");
    setTimeout(()=>{
      idx=(idx+1)%abilities.length;
      const ab=abilities[idx];
      pill.textContent=ab.icon+" "+ab.name;
      desc.textContent=ab.desc;
      counter.textContent=(idx+1)+" / "+abilities.length;
    },140);
    setTimeout(()=>cycler.classList.remove("is-flipping"),290);
  });
});

/* ── Download toast ─────────────────────────────────────── */
["heroDownloadBtn","navDownloadBtn"].forEach(id=>{
  const el=document.getElementById(id);
  if(!el)return;
  el.addEventListener("click",e=>{e.preventDefault();showToast("The download link will be available soon. \uD83D\uDE80");});
});
function showToast(msg){
  const ex=document.getElementById("spirelon-toast");if(ex)ex.remove();
  const t=document.createElement("div");t.id="spirelon-toast";t.textContent=msg;
  t.style.cssText="position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:#1a1a2e;border:1px solid rgba(139,92,246,0.4);color:#e2e8f0;padding:0.75rem 1.5rem;border-radius:50px;font-size:0.85rem;font-family:Inter,sans-serif;z-index:9999;opacity:0;transition:opacity 0.3s ease,transform 0.3s ease;box-shadow:0 8px 32px rgba(0,0,0,0.5);white-space:nowrap;";
  document.body.appendChild(t);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{t.style.opacity="1";t.style.transform="translateX(-50%) translateY(0)";}));
  setTimeout(()=>{t.style.opacity="0";t.style.transform="translateX(-50%) translateY(10px)";setTimeout(()=>t.remove(),350);},3000);
}

/* ── Particles ──────────────────────────────────────────── */
(function(){
  const c=document.getElementById("particles");if(!c)return;
  const s=document.createElement("style");
  s.textContent="@keyframes pDrift{0%{transform:translateY(0) scale(0);opacity:0}8%{opacity:.75;transform:translateY(-15px) scale(1)}92%{opacity:.6}100%{transform:translateY(-260px) scale(.4);opacity:0}}";
  document.head.appendChild(s);
  const cols=["rgba(139,92,246,.7)","rgba(0,212,255,.7)","rgba(255,215,0,.5)"];
  for(let i=0;i<45;i++){
    const p=document.createElement("div");
    const sz=Math.random()*3+1;
    p.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random()*cols.length)]};border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:pDrift ${(Math.random()*12+9).toFixed(1)}s ease-in infinite ${-(Math.random()*18).toFixed(1)}s;pointer-events:none;will-change:transform,opacity`;
    c.appendChild(p);
  }
})();
