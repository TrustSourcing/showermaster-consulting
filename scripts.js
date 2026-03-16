/* ShowerMaster Consulting — scripts.js */
(function() {
  'use strict';

  /* ─── Dark Mode ─────────────────────────────────────────── */
  const html = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) html.setAttribute('data-theme', saved);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.dark-toggle');
    if (!btn) return;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  /* ─── Scroll Progress Bar ───────────────────────────────── */
  const prog = document.getElementById('scroll-progress');
  if (prog) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (window.scrollY / h * 100) + '%';
    }, { passive: true });
  }

  /* ─── Mobile Nav Toggle ─────────────────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.nav-hamburger');
    if (!btn) return;
    document.querySelector('.nav-links')?.classList.toggle('open');
  });

  /* ─── Scroll Animations (IntersectionObserver) ──────────── */
  const animEls = document.querySelectorAll('.fade-in, .slide-up, .scale-in');
  if (animEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    animEls.forEach(el => obs.observe(el));
  }

  /* ─── Animated Stats Counter ────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = parseInt(el.dataset.count), suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current.toLocaleString() + suffix;
        }, 25);
        cObs.unobserve(el);
      });
    }, { threshold: 0.3 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ─── Testimonial Carousel ──────────────────────────────── */
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let idx = 0;
    function showSlide(n) {
      slides.forEach((s, i) => { s.classList.toggle('active', i === n); });
      dots.forEach((d, i) => { d.classList.toggle('active', i === n); });
    }
    setInterval(() => { idx = (idx + 1) % slides.length; showSlide(idx); }, 5000);
    dots.forEach((d, i) => d.addEventListener('click', () => { idx = i; showSlide(idx); }));
    carousel.querySelector('.carousel-prev')?.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; showSlide(idx); });
    carousel.querySelector('.carousel-next')?.addEventListener('click', () => { idx = (idx + 1) % slides.length; showSlide(idx); });
  }

  /* ─── Parallax Hero ─────────────────────────────────────── */
  const heroes = document.querySelectorAll('.hero-parallax');
  if (heroes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      heroes.forEach(h => { h.style.backgroundPositionY = (window.scrollY * 0.4) + 'px'; });
    }, { passive: true });
  }

  /* ─── Team Card Flip (mobile click) ─────────────────────── */
  document.addEventListener('click', e => {
    const card = e.target.closest('.team-card');
    if (card && window.innerWidth < 1024) card.classList.toggle('flipped');
  });

  /* ─── Keyboard Shortcuts ────────────────────────────────── */
  const helpOverlay = document.getElementById('help-overlay');
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'd' || e.key === 'D') document.querySelector('.dark-toggle')?.click();
    if (e.key === '?') { helpOverlay?.classList.toggle('visible'); }
    if (e.key === 't' || e.key === 'T') window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Konami Code Easter Egg ────────────────────────────── */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === konami[kIdx]) { kIdx++; } else { kIdx = 0; }
    if (kIdx === konami.length) {
      kIdx = 0;
      for (let i = 0; i < 50; i++) {
        const duck = document.createElement('div');
        duck.textContent = '🦆';
        duck.style.cssText = `position:fixed;top:-50px;left:${Math.random()*100}vw;font-size:${24+Math.random()*32}px;z-index:99999;pointer-events:none;animation:duckFall ${2+Math.random()*3}s linear forwards;`;
        document.body.appendChild(duck);
        setTimeout(() => duck.remove(), 6000);
      }
    }
  });

  /* ─── Chat Widget ───────────────────────────────────────── */
  const chatBtn = document.querySelector('.chat-bubble');
  const chatPanel = document.querySelector('.chat-panel');
  if (chatBtn && chatPanel) {
    const msgs = [
      { from: 'bot', text: "👋 Welcome to ShowerMaster! I'm your Curtain Consultant." },
      { from: 'bot', text: "Whether you need benchmarking, strategy, or just the perfect ring gauge — I'm here to help." },
      { from: 'bot', text: "Type anything to get started! (This is a demo 🛁)" }
    ];
    chatBtn.addEventListener('click', () => {
      chatPanel.classList.toggle('open');
      if (chatPanel.classList.contains('open') && !chatPanel.dataset.loaded) {
        chatPanel.dataset.loaded = '1';
        const body = chatPanel.querySelector('.chat-body');
        msgs.forEach((m, i) => {
          setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'chat-msg ' + m.from;
            div.textContent = m.text;
            body.appendChild(div);
            body.scrollTop = body.scrollHeight;
          }, i * 800);
        });
      }
    });
    chatPanel.querySelector('.chat-close')?.addEventListener('click', () => chatPanel.classList.remove('open'));
    chatPanel.querySelector('.chat-send')?.addEventListener('click', () => {
      const input = chatPanel.querySelector('.chat-input');
      if (!input.value.trim()) return;
      const body = chatPanel.querySelector('.chat-body');
      const div = document.createElement('div');
      div.className = 'chat-msg user';
      div.textContent = input.value;
      body.appendChild(div);
      input.value = '';
      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'chat-msg bot';
        reply.textContent = "Great question! Our team will follow up within 24 hours. In the meantime, check out our ShowerLAB™ benchmarking program! 🚿";
        body.appendChild(reply);
        body.scrollTop = body.scrollHeight;
      }, 1000);
    });
  }

  /* ─── Configurator ──────────────────────────────────────── */
  const config = document.querySelector('.configurator');
  if (config) {
    const preview = config.querySelector('.curtain-preview');
    const updatePreview = () => {
      const pattern = config.querySelector('[name="pattern"]')?.value || 'solid';
      const material = config.querySelector('[name="material"]')?.value || 'polyester';
      const color = config.querySelector('[name="curtain-color"]')?.value || '#0E7C86';
      const rings = config.querySelector('[name="rings"]')?.value || 'chrome';
      if (!preview) return;
      preview.style.background = color;
      preview.dataset.pattern = pattern;
      preview.dataset.rings = rings;
      const ringBar = preview.querySelector('.curtain-rings');
      if (ringBar) ringBar.className = 'curtain-rings ' + rings;
    };
    config.querySelectorAll('select, input').forEach(el => el.addEventListener('change', updatePreview));
    config.querySelectorAll('input[type="color"]').forEach(el => el.addEventListener('input', updatePreview));
  }

  /* ─── Newsletter Splash ─────────────────────────────────── */
  document.addEventListener('submit', e => {
    const form = e.target.closest('.newsletter-form');
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = '💦 Splash!';
    btn.disabled = true;
    form.querySelector('input').value = '';
    setTimeout(() => { btn.textContent = '✅ Subscribed!'; }, 800);
    setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
  });

  /* ─── Contact Form ──────────────────────────────────────── */
  document.addEventListener('submit', e => {
    const form = e.target.closest('.contact-form');
    if (!form) return;
    e.preventDefault();
    const msg = form.querySelector('.form-success');
    if (msg) { msg.classList.add('visible'); setTimeout(() => msg.classList.remove('visible'), 4000); }
  });

  /* ─── Bubble Particles (Hero) ───────────────────────────── */
  const bubbleContainer = document.querySelector('.hero-bubbles');
  if (bubbleContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 20; i++) {
      const b = document.createElement('span');
      b.className = 'bubble';
      b.style.cssText = `left:${Math.random()*100}%;width:${6+Math.random()*20}px;height:${6+Math.random()*20}px;animation-delay:${Math.random()*8}s;animation-duration:${6+Math.random()*8}s;opacity:${0.1+Math.random()*0.3};`;
      bubbleContainer.appendChild(b);
    }
  }

  /* ─── Smooth Scroll ─────────────────────────────────────── */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });

})();
