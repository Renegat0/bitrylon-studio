"use strict";
const nb=document.getElementById("navbar");
window.addEventListener("scroll",()=>nb.classList.toggle("scrolled",window.scrollY>50),{passive:true});
const nt=document.getElementById("navToggle"),nl=document.getElementById("navLinks");
nt.addEventListener("click",()=>{const o=nl.classList.toggle("is-open");nt.setAttribute("aria-expanded",o);});
nl.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nl.classList.remove("is-open");nt.setAttribute("aria-expanded","false");}));
document.querySelectorAll("a[href^=\"#\"]").forEach(a=>{
  a.addEventListener("click",e=>{
    const h=a.getAttribute("href");if(h==="#"){e.preventDefault();return;}
    const t=document.querySelector(h);
    if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"});}
  });
});
function openModal(id){const m=document.getElementById(id);if(!m)return;m.classList.add("is-open");document.body.style.overflow="hidden";}
function closeModal(id){const m=document.getElementById(id);if(!m)return;m.classList.remove("is-open");document.body.style.overflow="";}
document.getElementById("btnImpressum").addEventListener("click",()=>openModal("modalImpressum"));
document.getElementById("btnDatenschutz").addEventListener("click",()=>openModal("modalDatenschutz"));
document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",()=>closeModal("modal"+el.dataset.close)));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal.is-open").forEach(m=>{m.classList.remove("is-open");document.body.style.overflow="";});});
document.querySelectorAll(".skill-card,.project-card,.a-stat").forEach(el=>{
  el.classList.add("reveal");
  new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){const i=Array.from(e.target.parentElement.children).indexOf(e.target);setTimeout(()=>e.target.classList.add("in-view"),Math.min(i*70,400));}});},{threshold:0.08,rootMargin:"0px 0px -40px 0px"}).observe(el);
});
