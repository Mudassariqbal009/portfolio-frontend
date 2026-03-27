/* ============================================================
   CLOUDOPS AGENCY — MAIN SCRIPT
   ============================================================ */

/* ── PRELOADER ──────────────────────────────────────────────── */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide after bar animation (~2.2s total)
  setTimeout(() => {
    preloader.classList.add('hide');
    setTimeout(() => preloader.remove(), 800);
    // Trigger hero after preloader leaves
    document.querySelector('.hero')?.classList.add('hero-loaded');
  }, 2200);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── DARK MODE ──────────────────────────────────────────── */
  const themeBtn = document.getElementById('themeToggle');
  const root     = document.documentElement;

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', savedTheme);

  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ── MOBILE HAMBURGER ───────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── SCROLL REVEAL (IntersectionObserver) ───────────────── */
  const allReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  allReveal.forEach(el => revealObserver.observe(el));

  /* ── ACTIVE NAV ON SCROLL ───────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  /* ── STATS COUNTER ──────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      counters.forEach(el => {
        const target   = +el.getAttribute('data-count');
        const duration = 1800;
        const step     = target / (duration / 16);
        let current    = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target; clearInterval(timer); }
          else { el.textContent = Math.floor(current); }
        }, 16);
      });
    }
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) countObserver.observe(statsBar);

  /* ── BACK TO TOP ────────────────────────────────────────── */
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    backTop?.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── NAV SCROLL SHADOW ──────────────────────────────────── */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── CANVAS PARTICLE NETWORK ─────────────────────────────── */
  (function initCanvas() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles;
    const COUNT     = 55;
    const MAX_DIST  = 140;
    const SPEED     = 0.4;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function mkParticle() {
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r:  Math.random() * 1.5 + 0.8,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, mkParticle);
    }

    function getColors() {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        dot:  dark ? 'rgba(96,165,250,'  : 'rgba(37,99,235,',
        line: dark ? 'rgba(96,165,250,'  : 'rgba(37,99,235,',
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const { dot, line } = getColors();

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = line + alpha + ')';
            ctx.lineWidth   = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = dot + '0.5)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Move
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener('resize', () => {
      resize();
      particles.forEach(p => {
        p.x = Math.min(p.x, W);
        p.y = Math.min(p.y, H);
      });
    });
  })();

  /* ── CURSOR GLOW ─────────────────────────────────────────── */
  (function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(hover: none)').matches) return;

    let visible = false;
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
      if (!visible) { glow.style.opacity = '1'; visible = true; }
    });
    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0'; visible = false;
    });
  })();

  /* ── WORD CYCLING IN HERO ────────────────────────────────── */
  (function initWordCycle() {
    const el = document.querySelector('.word-cycle');
    if (!el) return;

    const words = ['Scales', 'Performs', 'Evolves', 'Delivers', 'Excels'];
    let index = 0;

    setInterval(() => {
      el.classList.remove('fade-in');
      el.classList.add('fade-out');

      setTimeout(() => {
        index = (index + 1) % words.length;
        el.textContent = words[index];
        el.classList.remove('fade-out');
        el.classList.add('fade-in');
      }, 300);
    }, 2800);
  })();

  /* ── CONTACT FORM ───────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const formWrap   = document.getElementById('formWrap');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';

      const data = new FormData(form);

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          formWrap.style.display  = 'none';
          successMsg.style.display = 'block';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';
        showGlobalError('Failed to send. Please email us directly.');
      }
    });
  }

  function validateForm() {
    let valid = true;
    form.querySelectorAll('[data-required]').forEach(field => {
      clearError(field);
      if (!field.value.trim()) { showError(field, 'This field is required'); valid = false; }
    });
    const emailField = form.querySelector('[type="email"]');
    if (emailField?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      showError(emailField, 'Please enter a valid email address'); valid = false;
    }
    return valid;
  }

  function showError(field, msg) {
    field.classList.add('error');
    const err = document.createElement('span');
    err.className   = 'field-error';
    err.textContent = msg;
    field.parentNode.appendChild(err);
  }

  function clearError(field) {
    field.classList.remove('error');
    field.parentNode.querySelector('.field-error')?.remove();
  }

  function showGlobalError(msg) {
    form.querySelector('.global-error')?.remove();
    const div = document.createElement('div');
    div.className    = 'global-error';
    div.style.cssText = 'color:#ef4444;font-size:13px;text-align:center;margin-top:8px;';
    div.textContent  = msg;
    form.appendChild(div);
  }

});
