/* ============================================================
   SPIRELON – main.js
   bitrylon-studio © 2026
============================================================ */

'use strict';

/* ── Navbar scroll effect ──────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile nav toggle ─────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
});

// Close menu when any nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── Smooth scroll for all anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') { e.preventDefault(); return; }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height compensation
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Modal system ──────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  // Focus the close button for accessibility
  const closeBtn = modal.querySelector('.modal__close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

// Open buttons
document.getElementById('btnImpressum').addEventListener('click', () => openModal('modalImpressum'));
document.getElementById('btnDatenschutz').addEventListener('click', () => openModal('modalDatenschutz'));

// Close buttons & overlays (data-close="ModalId")
document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', () => closeModal('modal' + el.dataset.close));
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.is-open').forEach(m => {
      m.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }
});

/* ── Scroll-reveal (IntersectionObserver) ───────────────── */
const revealTargets = document.querySelectorAll(
  '.feature-card, .char-card, .world-card, .stat-card, .lb-card, ' +
  '.screenshot-ph, .trailer-box'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on index within its parent
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 75, 400); // max 400ms stagger
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

revealTargets.forEach(el => revealObserver.observe(el));

/* ── Floating particles (Hero background) ───────────────── */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  // One shared keyframe for all particles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleDrift {
      0%   { transform: translateY(0)     scale(0);   opacity: 0; }
      8%   { opacity: 0.75;  transform: translateY(-15px)  scale(1); }
      92%  { opacity: 0.6; }
      100% { transform: translateY(-260px) scale(0.4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const colors = [
    'rgba(139,92,246,0.7)',
    'rgba(0,212,255,0.7)',
    'rgba(255,215,0,0.5)',
  ];

  for (let i = 0; i < 45; i++) {
    const p = document.createElement('div');
    const size     = Math.random() * 3 + 1;
    const color    = colors[Math.floor(Math.random() * colors.length)];
    const left     = Math.random() * 100;
    const startTop = Math.random() * 100;
    const dur      = (Math.random() * 12 + 9).toFixed(1);
    const delay    = -(Math.random() * 18).toFixed(1);

    p.style.cssText = [
      'position:absolute',
      `width:${size}px`,
      `height:${size}px`,
      `background:${color}`,
      'border-radius:50%',
      `left:${left}%`,
      `top:${startTop}%`,
      `animation:particleDrift ${dur}s ease-in infinite ${delay}s`,
      'pointer-events:none',
      'will-change:transform,opacity',
    ].join(';');

    container.appendChild(p);
  }
})();

/* ── Placeholder download button tooltip ────────────────── */
['heroDownloadBtn', 'navDownloadBtn'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', e => {
    e.preventDefault();
    showToast('Der Download-Link wird bald verfügbar sein. 🚀');
  });
});

function showToast(message) {
  // Remove existing toast if any
  const existing = document.getElementById('spirelon-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'spirelon-toast';
  toast.textContent = message;
  toast.style.cssText = [
    'position:fixed',
    'bottom:2rem',
    'left:50%',
    'transform:translateX(-50%) translateY(20px)',
    'background:#1a1a2e',
    'border:1px solid rgba(139,92,246,0.4)',
    'color:#e2e8f0',
    'padding:0.75rem 1.5rem',
    'border-radius:50px',
    'font-size:0.85rem',
    'font-family:Inter,sans-serif',
    'z-index:9999',
    'opacity:0',
    'transition:opacity 0.3s ease, transform 0.3s ease',
    'box-shadow:0 8px 32px rgba(0,0,0,0.5)',
    'white-space:nowrap',
  ].join(';');

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  // Animate out after 3s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}
