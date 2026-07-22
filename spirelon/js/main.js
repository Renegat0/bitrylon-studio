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
(function(){
  const backdrop=document.createElement("div");
  backdrop.className="worlds-backdrop";
  document.body.appendChild(backdrop);
  let active=null;
  const ASPECT=9/20;

  function px(n){return Math.round(n)+"px";}

  function targetRect(){
    const vw=window.innerWidth,vh=window.innerHeight;
    const maxW=Math.min(310,vw*0.86),maxH=vh*0.88;
    let w=maxW,h=w/ASPECT;
    if(h>maxH){h=maxH;w=h*ASPECT;}
    return{x:Math.round((vw-w)/2),y:Math.round((vh-h)/2),w:Math.round(w),h:Math.round(h)};
  }

  function expand(card){
    const r=card.getBoundingClientRect();
    const L=Math.round(r.left),T=Math.round(r.top),W=Math.round(r.width),H=Math.round(r.height);
    card._or={left:L,top:T,width:W,height:H};
    card._sy=window.scrollY;
    // Fix card at current position, clear CSS transform
    Object.assign(card.style,{position:"fixed",left:px(L),top:px(T),width:px(W),height:px(H),zIndex:"999",margin:"0",transition:"none",transform:"none"});
    // Insert clone to hold grid slot (card already out of flow)
    const ph=card.cloneNode(true);
    ph.style.cssText="visibility:hidden;pointer-events:none";
    ph.setAttribute("aria-hidden","true");
    card.insertAdjacentElement("afterend",ph);
    card._ph=ph;
    // Move card to body: z-index beats backdrop regardless of ancestor stacking contexts
    document.body.appendChild(card);
    // Move card to body: z-index beats backdrop regardless of ancestor stacking contexts
    document.body.appendChild(card);
    card.classList.add("is-expanded","is-flipped");
    backdrop.classList.add("is-active");
    // Compensate for scrollbar removal to prevent layout shift
    const sw=window.innerWidth-document.documentElement.clientWidth;
    if(sw>0) document.body.style.paddingRight=sw+"px";
    document.body.style.overflow="hidden";
    active=card;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const t=targetRect();
      card.style.transition="left .52s cubic-bezier(.4,0,.2,1),top .52s cubic-bezier(.4,0,.2,1),width .52s cubic-bezier(.4,0,.2,1),height .52s cubic-bezier(.4,0,.2,1)";
      card.style.left=px(t.x); card.style.top=px(t.y);
      card.style.width=px(t.w); card.style.height=px(t.h);
    }));
  }

  function collapse(card){
    if(!card._or)return;
    const ds=window.scrollY-card._sy,r=card._or;
    card.style.transition="left .52s cubic-bezier(.4,0,.2,1),top .52s cubic-bezier(.4,0,.2,1),width .52s cubic-bezier(.4,0,.2,1),height .52s cubic-bezier(.4,0,.2,1)";
    card.style.left=px(r.left); card.style.top=px(r.top-ds);
    card.style.width=px(r.width); card.style.height=px(r.height);
    card.classList.remove("is-flipped");
    backdrop.classList.remove("is-active");
    document.body.style.overflow="";
    document.body.style.paddingRight="";
    active=null;
    const onEnd=e=>{
      if(e.propertyName!=="left")return;
      card.removeEventListener("transitionend",onEnd);
      // Move card back before placeholder, then remove placeholder
      if(card._ph){card._ph.insertAdjacentElement("beforebegin",card);card._ph.remove();delete card._ph;}
      card.classList.remove("is-expanded");
      card.style.cssText="";
      delete card._or; delete card._sy;
    };
    card.addEventListener("transitionend",onEnd);
  }

  document.querySelectorAll(".world-flip").forEach(card=>{
    card.addEventListener("click",e=>{
      e.stopPropagation();
      active===card?collapse(card):expand(card);
    });
  });
  backdrop.addEventListener("click",()=>{if(active)collapse(active);});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&active)collapse(active);});

  // Pre-load screenshots when worlds section enters viewport
  const wSec=document.getElementById("worlds");
  if(wSec){
    new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting)return;
      document.querySelectorAll(".world-flip__shot").forEach(img=>{
        if(!img.complete){const s=img.src;img.src="";img.src=s;}
      });
    },{rootMargin:"400px",threshold:0}).observe(wSec);
  }
})();

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
