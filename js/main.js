/* ============================================================
   CLOUDOPS AGENCY — MAIN SCRIPT
   ============================================================ */

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

  /* ── HERO ANIMATION ─────────────────────────────────────── */
  setTimeout(() => {
    document.querySelector('.hero')?.classList.add('hero-loaded');
  }, 100);

  /* ── MOBILE HAMBURGER ───────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ── SCROLL REVEAL (IntersectionObserver) ───────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
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

  /* ── CONTACT FORM ───────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const formWrap   = document.getElementById('formWrap');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn  = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const data = new FormData(form);

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          formWrap.style.display = 'none';
          successMsg.style.display = 'block';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        showGlobalError('Failed to send. Please email us directly.');
      }
    });
  }

  function validateForm() {
    let valid = true;

    form.querySelectorAll('[data-required]').forEach(field => {
      clearError(field);
      if (!field.value.trim()) {
        showError(field, 'This field is required');
        valid = false;
      }
    });

    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      showError(emailField, 'Please enter a valid email address');
      valid = false;
    }

    return valid;
  }

  function showError(field, msg) {
    field.classList.add('error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = msg;
    field.parentNode.appendChild(err);
  }

  function clearError(field) {
    field.classList.remove('error');
    field.parentNode.querySelector('.field-error')?.remove();
  }

  function showGlobalError(msg) {
    const existing = form.querySelector('.global-error');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.className = 'global-error';
    div.style.cssText = 'color:#ef4444;font-size:13px;text-align:center;margin-top:8px;';
    div.textContent = msg;
    form.appendChild(div);
  }

});
