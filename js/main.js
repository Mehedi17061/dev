/* ─── Year ─────────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── Loader ────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1600);
});

/* ─── Header ────────────────────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  highlightNav();
});

/* ─── Mobile Nav ────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-nav .nav-link').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ─── Active nav ────────────────────────────────────────────── */
function highlightNav() {
  let current = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('nav .nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}

/* ─── Scroll Reveal ─────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-level-fill').forEach(f => f.style.width = f.dataset.width);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .timeline-item').forEach(el => revealObs.observe(el));

/* ─── Stats counter ─────────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target), suffix = el.dataset.suffix || '';
  let n = 0; const step = Math.max(1, Math.ceil(target / 60));
  const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = n + suffix; if (n >= target) clearInterval(t); }, 25);
}
new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.stat-num').forEach(animateCounter); obs.disconnect(); } });
}, { threshold: 0.5 }).observe(document.getElementById('stats'));

/* ─── Skills ────────────────────────────────────────────────── */
const SKILLS = {
  Frontend: [
    { name:'HTML / CSS',   icon:'🎨', pct:95 }, { name:'JavaScript', icon:'⚡', pct:90 },
    { name:'React',        icon:'⚛️',  pct:88 }, { name:'Vue.js',     icon:'💚', pct:75 },
    { name:'TypeScript',   icon:'🔷', pct:80 }, { name:'Tailwind',   icon:'🌬️', pct:92 },
  ],
  Backend: [
    { name:'Node.js',   icon:'🟢', pct:85 }, { name:'Python',    icon:'🐍', pct:82 },
    { name:'PHP',       icon:'🐘', pct:70 }, { name:'REST API',  icon:'🔗', pct:90 },
    { name:'GraphQL',   icon:'◈',  pct:72 }, { name:'Firebase',  icon:'🔥', pct:78 },
  ],
  Database: [
    { name:'MySQL',      icon:'🐬', pct:85 }, { name:'PostgreSQL', icon:'🐘', pct:78 },
    { name:'MongoDB',    icon:'🍃', pct:75 }, { name:'Redis',      icon:'🔴', pct:65 },
    { name:'Supabase',   icon:'⚡', pct:72 }, { name:'Firestore',  icon:'☁️', pct:70 },
  ],
  Tools: [
    { name:'Git/GitHub', icon:'🐙', pct:92 }, { name:'Docker',  icon:'🐳', pct:72 },
    { name:'Figma',      icon:'✏️', pct:80 }, { name:'VS Code', icon:'💻', pct:95 },
    { name:'AWS/GCP',    icon:'☁️', pct:68 }, { name:'Linux',   icon:'🐧', pct:75 },
  ],
};

function renderSkills(cat) {
  const g = document.getElementById('skillsGrid');
  g.innerHTML = SKILLS[cat].map(s => `
    <div class="skill-card reveal">
      <div class="skill-icon-wrap">${s.icon}</div>
      <div class="skill-name">${s.name}</div>
      <span class="skill-pct">${s.pct}%</span>
      <div class="skill-level"><div class="skill-level-fill" data-width="${s.pct}%" style="width:0"></div></div>
    </div>`).join('');
  g.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}
document.querySelectorAll('.skill-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSkills(btn.dataset.cat);
  });
});
renderSkills('Frontend');

/* ─── Projects (from json/projects.js → window.PROJECTS) ────── */
let activeFilter = 'All';

function buildFilters() {
  const cats = ['All', ...new Set(PROJECTS.map(p => p.category))];
  const wrap = document.getElementById('filterTabs');
  wrap.innerHTML = cats.map(c => `<button class="filter-btn ${c==='All'?'active':''}" data-cat="${c}">${c}</button>`).join('');
  wrap.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    wrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.cat;
    renderProjects(activeFilter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter));
  }));
}

function renderProjects(list) {
  const grid = document.getElementById('projectsGrid');
  if (!list.length) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:3rem;">No projects in this category.</div>`; return; }
  grid.innerHTML = list.map((p, i) => {
    const tags = p.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
    const thumb = p.image
      ? `<img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'project-thumb-placeholder\\'>${p.emoji}</div>'">`
      : `<div class="project-thumb-placeholder">${p.emoji}</div>`;
    return `
      <div class="project-card reveal" style="transition-delay:${i*60}ms" data-id="${p.id}">
        <div class="project-thumb">
          ${thumb}
          ${p.featured ? '<span class="project-featured-badge">Featured</span>' : ''}
          <div class="project-overlay">
            <button class="project-overlay-btn" onclick="openModal(${p.id})">View Details</button>
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="project-overlay-btn outline">Live ↗</a>` : ''}
          </div>
        </div>
        <div class="project-body">
          <div class="project-cat">${p.category}</div>
          <div class="project-name">${p.title}</div>
          <div class="project-desc">${p.desc}</div>
          <div class="project-tags">${tags}</div>
        </div>
      </div>`;
  }).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

function openModal(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  const tags = p.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
  const thumb = p.image
    ? `<img class="modal-img" src="${p.image}" alt="${p.title}">`
    : `<div class="modal-img-placeholder">${p.emoji}</div>`;
  document.getElementById('modalContent').innerHTML = `
    ${thumb}
    <div class="modal-body">
      <div class="modal-cat">${p.category}</div>
      <div class="modal-title">${p.title}</div>
      <p class="modal-desc">${p.fullDesc}</p>
      <div class="modal-tags">${tags}</div>
      <div class="modal-links">
        ${p.liveUrl    ? `<a href="${p.liveUrl}"    target="_blank" class="btn btn-primary">Live Demo ↗</a>` : ''}
        ${p.githubUrl  ? `<a href="${p.githubUrl}"  target="_blank" class="btn btn-outline">GitHub ↗</a>` : ''}
      </div>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === document.getElementById('modalOverlay')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

buildFilters();
renderProjects(window.PROJECTS || []);

/* ─── Contact form (Formspree — free static form handler) ──── */
/*
  To make the contact form work on GitHub Pages:
  1. Sign up at https://formspree.io (free)
  2. Create a new form and get your endpoint like: https://formspree.io/f/YOUR_ID
  3. Replace the FORMSPREE_URL below with your actual endpoint
*/
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'; // 👈 Replace this

function handleContact(e) {
  e.preventDefault();
  const btn  = document.getElementById('submitBtn');
  const msg  = document.getElementById('formMsg');
  const data = new FormData(e.target);

  btn.disabled = true; btn.textContent = 'Sending…'; msg.className = 'form-msg';

  fetch(FORMSPREE_URL, { method:'POST', body:data, headers:{ Accept:'application/json' } })
    .then(r => r.json())
    .then(res => {
      if (res.ok || res.errors === undefined) {
        msg.textContent = '✅ Message sent! I\'ll get back to you soon.';
        msg.className   = 'form-msg success';
        e.target.reset();
      } else {
        throw new Error('Server error');
      }
    })
    .catch(() => {
      msg.textContent = '❌ Something went wrong. Please email me directly.';
      msg.className   = 'form-msg error';
    })
    .finally(() => { btn.disabled = false; btn.textContent = 'Send Message →'; });
}

/* ─── Typed role effect ─────────────────────────────────────── */
const roles = ['Full-Stack Developer','React Specialist','Node.js Expert','UI/UX Enthusiast'];
let ri = 0, ci = 0, del = false;
function typeEffect() {
  const el = document.getElementById('typedRole');
  if (!el) return;
  const cur = roles[ri];
  if (del) { ci--; el.textContent = cur.slice(0,ci); if (ci===0){del=false;ri=(ri+1)%roles.length;setTimeout(typeEffect,500);return;} setTimeout(typeEffect,60); }
  else     { ci++; el.textContent = cur.slice(0,ci); if (ci===cur.length){del=true;setTimeout(typeEffect,2200);return;} setTimeout(typeEffect,110); }
}
setTimeout(typeEffect, 1800);

/* ─── Back to top ───────────────────────────────────────────── */
document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
