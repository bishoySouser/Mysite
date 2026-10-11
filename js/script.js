// ==========================================================================
// Comprehensive Animation Engine (BDSN Club + Dave Holloway UK)
// - Lenis Inertia Smooth Scroll
// - Dave Holloway Mechanical Rolling Split-Text
// - Dave Holloway Studio Gold Theme Mode & Ambient Particle Canvas
// - Dave Holloway Interactive Project Stepper (1 / 06)
// - Dave Holloway Rolling Arrow Micro-Interactions
// - 3D Card Tilt, Magnetic Physics, and Staggered Viewport Reveals
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. LENIS INERTIA SMOOTH SCROLL ---
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // --- 2. DAVE HOLLOWAY MECHANICAL ROLLING SPLIT-TEXT INITIALIZER ---
  // Transforms links into mechanical split-flap vertical text rollers
  function initRollingText(elements) {
    elements.forEach(el => {
      if (el.querySelector('.dh-roll-inner')) return; // already initialized
      const text = el.textContent.trim();
      if (!text) return;

      // Keep icons if present
      const icon = el.querySelector('.plus-icon');
      const arrow = el.querySelector('.arrow-icon');
      
      const rollWrapper = document.createElement('span');
      rollWrapper.className = 'dh-roll-text';
      
      const rollInner = document.createElement('span');
      rollInner.className = 'dh-roll-inner';
      
      const span1 = document.createElement('span');
      span1.textContent = text;
      
      const span2 = document.createElement('span');
      span2.className = 'dh-roll-dup';
      span2.textContent = text;
      
      rollInner.appendChild(span1);
      rollInner.appendChild(span2);
      rollWrapper.appendChild(rollInner);

      el.textContent = '';
      if (icon) el.appendChild(icon);
      el.appendChild(rollWrapper);
      if (arrow) el.appendChild(arrow);
    });
  }

  initRollingText(document.querySelectorAll('.ch-nav-link'));
  initRollingText(document.querySelectorAll('.ch-ext-link'));
  initRollingText(document.querySelectorAll('.filter-pill'));

  // --- 3. DAVE HOLLOWAY STUDIO GOLD MODE TOGGLE ---
  const goldBtn = document.getElementById('goldModeBtn');
  const savedTheme = localStorage.getItem('theme-mode');

  if (savedTheme === 'gold') {
    document.documentElement.setAttribute('data-theme', 'gold');
  }

  if (goldBtn) {
    goldBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'gold') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme-mode', 'default');
      } else {
        document.documentElement.setAttribute('data-theme', 'gold');
        localStorage.setItem('theme-mode', 'gold');
      }
      triggerCurtainWipe();
    });
  }

  // --- 4. DAVE HOLLOWAY AMBIENT GOLD DUST / SNOW CANVAS ---
  const canvas = document.getElementById('goldSnowCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAngle: Math.random() * Math.PI * 2
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      const isGold = document.documentElement.getAttribute('data-theme') === 'gold';

      if (isGold) {
        ctx.fillStyle = '#fbbf24';
        particles.forEach(p => {
          p.swayAngle += p.swaySpeed;
          p.x += p.speedX + Math.sin(p.swayAngle) * 0.5;
          p.y += p.speedY;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        });
      }

      requestAnimationFrame(renderParticles);
    }
    requestAnimationFrame(renderParticles);
  }

  // --- 5. DAVE HOLLOWAY VENETIAN BLIND CURTAIN TRANSITION ---
  function triggerCurtainWipe() {
    const overlay = document.createElement('div');
    overlay.className = 'dh-transition-overlay';

    for (let i = 0; i < 8; i++) {
      const row = document.createElement('div');
      row.className = 'dh-transition-row';
      row.style.transitionDelay = `${i * 0.03}s`;
      overlay.appendChild(row);
    }

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.querySelectorAll('.dh-transition-row').forEach(row => {
        row.style.transform = 'scaleY(1)';
      });

      setTimeout(() => {
        overlay.querySelectorAll('.dh-transition-row').forEach(row => {
          row.style.transformOrigin = 'bottom';
          row.style.transform = 'scaleY(0)';
        });
        setTimeout(() => {
          overlay.remove();
        }, 500);
      }, 350);
    });
  }

  // --- 6. DAVE HOLLOWAY INTERACTIVE PROJECT STEPPER (1 / 06) ---
  const projectArticles = document.querySelectorAll('.project-card');
  const stepperCounter = document.getElementById('stepperCounter');
  const stepperPrev = document.getElementById('stepperPrev');
  const stepperNext = document.getElementById('stepperNext');
  let currentProjectIdx = 0;

  function updateStepperDisplay() {
    if (stepperCounter) {
      stepperCounter.textContent = `${String(currentProjectIdx + 1).padStart(2, '0')} / ${String(projectArticles.length).padStart(2, '0')}`;
    }
  }

  if (stepperPrev && stepperNext && projectArticles.length > 0) {
    updateStepperDisplay();

    stepperNext.addEventListener('click', () => {
      currentProjectIdx = (currentProjectIdx + 1) % projectArticles.length;
      updateStepperDisplay();
      const targetCard = projectArticles[currentProjectIdx];
      if (lenis) {
        lenis.scrollTo(targetCard, { offset: -60 });
      } else {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      targetCard.style.transform = 'translateY(-8px) scale(1.02)';
      setTimeout(() => { targetCard.style.transform = ''; }, 400);
    });

    stepperPrev.addEventListener('click', () => {
      currentProjectIdx = (currentProjectIdx - 1 + projectArticles.length) % projectArticles.length;
      updateStepperDisplay();
      const targetCard = projectArticles[currentProjectIdx];
      if (lenis) {
        lenis.scrollTo(targetCard, { offset: -60 });
      } else {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      targetCard.style.transform = 'translateY(-8px) scale(1.02)';
      setTimeout(() => { targetCard.style.transform = ''; }, 400);
    });
  }

  // --- 7. LIVE CAIRO CLOCK ---
  const clockElement = document.getElementById('liveClock');
  function updateCairoClock() {
    if (!clockElement) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Africa/Cairo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeFormatter = new Intl.DateTimeFormat('en-GB', options);
      const cairoTime = timeFormatter.format(now);
      clockElement.textContent = `Cairo EET  ${cairoTime}`;
    } catch (e) {
      const d = new Date();
      clockElement.textContent = `Cairo  ${d.toLocaleTimeString()}`;
    }
  }
  updateCairoClock();
  setInterval(updateCairoClock, 1000);

  // --- 8. STAGGERED SCROLL REVEALS ---
  const revealElements = document.querySelectorAll('.bdsn-reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    revealElements.forEach((el, index) => {
      if (!el.classList.contains('bdsn-delay-1') && !el.classList.contains('bdsn-delay-2')) {
        const delay = (index % 4) * 0.08;
        if (delay > 0) el.style.transitionDelay = `${delay}s`;
      }
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- 9. STATS ANIMATED NUMBER COUNTERS ---
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  let statsCounted = false;

  function countUp(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - (frame / totalFrames), 3);
      const current = progress * target;

      if (isDecimal) {
        element.textContent = `${prefix}${current.toFixed(1)}${suffix}`;
      } else {
        element.textContent = `${prefix}${Math.round(current)}${suffix}`;
      }

      if (frame >= totalFrames) {
        clearInterval(counter);
        element.textContent = `${prefix}${target}${suffix}`;
      }
    }, frameRate);
  }

  const statsSection = document.querySelector('.about-stats-row');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(stat => countUp(stat));
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // --- 10. INTERACTIVE 3D MAGNETIC TILT ---
  const tiltCards = document.querySelectorAll('.project-card, .about-photo-wrap');
  tiltCards.forEach(card => {
    let bounds;
    function onMouseEnter() { bounds = card.getBoundingClientRect(); }
    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = mouseX / bounds.width - 0.5;
      const yPct = mouseY / bounds.height - 0.5;
      const rotX = -yPct * 7.5;
      const rotY = xPct * 7.5;
      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-5px)`;
    }
    function onMouseLeave() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      bounds = null;
    }
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });

  // --- 11. MAGNETIC BUTTONS (Pull towards cursor) ---
  const magneticElements = document.querySelectorAll('.magnetic-elem, .footer-email-btn, .hero-hello, .dh-gold-btn');
  magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      elem.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    elem.addEventListener('mouseleave', () => {
      elem.style.transform = '';
    });
  });

  // --- 12. EMOJI EASTER EGGS ---
  const helloHeading = document.getElementById('heroHello');
  const handEmoji = document.querySelector('.wave-hand');
  if (helloHeading && handEmoji) {
    const greetings = ['👋', '⚡', '💻', '🚀', '✨', '👋'];
    let gIdx = 0;
    helloHeading.addEventListener('click', () => {
      gIdx = (gIdx + 1) % greetings.length;
      handEmoji.textContent = greetings[gIdx];
      handEmoji.style.transform = 'rotate(25deg) scale(1.3)';
      setTimeout(() => { handEmoji.style.transform = ''; }, 350);
    });
  }

  const farewellHeading = document.getElementById('farewellHeading');
  const footerEmoji = document.querySelector('.footer-emoji');
  if (farewellHeading && footerEmoji) {
    const farewells = ['🥺', '✨', '☕', '🚀', '✌️', '😎'];
    let fIdx = 0;
    farewellHeading.addEventListener('click', () => {
      fIdx = (fIdx + 1) % farewells.length;
      footerEmoji.textContent = farewells[fIdx];
      footerEmoji.style.transform = 'rotate(-25deg) scale(1.3)';
      setTimeout(() => { footerEmoji.style.transform = ''; }, 350);
    });
  }

  // --- 13. SMOOTH ANCHOR SCROLLING WITH LENIS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetElem, { offset: -20 });
        } else {
          targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // --- 14. GALLERY SECTION FILTER SWITCHER ---
  const filterPills = document.querySelectorAll('.filter-pill');
  const filterableSections = document.querySelectorAll('[data-category]');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');
      triggerCurtainWipe();

      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      setTimeout(() => {
        filterableSections.forEach(section => {
          if (filter === 'all' || section.getAttribute('data-category') === filter) {
            section.style.display = '';
            section.style.opacity = '0';
            setTimeout(() => {
              section.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
              section.style.opacity = '1';
            }, 10);
          } else {
            section.style.display = 'none';
          }
        });
        if (lenis) lenis.resize();
      }, 150);
    });
  });

  // --- 15. TECHNICAL SCHEMATIC LIGHTBOX ---
  const lightboxModal = document.getElementById('schematicLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaptionTitle = document.getElementById('lightboxCaptionTitle');
  const lightboxCaptionId = document.getElementById('lightboxCaptionId');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.project-preview-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      const title = wrap.getAttribute('data-title') || 'Technical Architecture Blueprint';
      const id = wrap.getAttribute('data-id') || 'SCHEMATIC';

      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
        if (lightboxCaptionTitle) lightboxCaptionTitle.textContent = title;
        if (lightboxCaptionId) lightboxCaptionId.textContent = id;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

});