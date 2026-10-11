// ==========================================================================
// BDSN Club (bdsn.club) Animation Engine & Interactivity
// Inertia Smooth Scroll (Lenis), Staggered Reveals, 3D Card Tilt,
// Magnetic Physics, Animated Counters, and Live Clock
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. LENIS INERTIA SMOOTH SCROLL (bdsn.club signature) ---
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

  // --- 2. LIVE CAIRO CLOCK ---
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

  // --- 3. STAGGERED SCROLL REVEALS (Intersection Observer) ---
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
      // Stagger children within grids
      if (!el.classList.contains('bdsn-delay-1') && !el.classList.contains('bdsn-delay-2')) {
        const delay = (index % 4) * 0.08;
        if (delay > 0) el.style.transitionDelay = `${delay}s`;
      }
      revealObserver.observe(el);
    });
  } else {
    // Fallback
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- 4. STATS ANIMATED NUMBER COUNTERS ---
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
      // Easing out cubic
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

  // --- 5. INTERACTIVE 3D MAGNETIC TILT (bdsn.club physics) ---
  const tiltCards = document.querySelectorAll('.project-card, .about-photo-wrap');

  tiltCards.forEach(card => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = mouseX / bounds.width - 0.5;
      const yPct = mouseY / bounds.height - 0.5;

      const rotX = -yPct * 7.5; // deg
      const rotY = xPct * 7.5;  // deg

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

  // --- 6. MAGNETIC BUTTONS (Pull towards cursor) ---
  const magneticElements = document.querySelectorAll('.magnetic-elem, .footer-email-btn, .hero-hello');

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

  // --- 7. EMOJI EASTER EGGS ---
  const helloHeading = document.getElementById('heroHello');
  const handEmoji = document.querySelector('.wave-hand');
  if (helloHeading && handEmoji) {
    const greetings = ['👋', '⚡', '💻', '🚀', '✨', '👋'];
    let gIdx = 0;
    helloHeading.addEventListener('click', () => {
      gIdx = (gIdx + 1) % greetings.length;
      handEmoji.textContent = greetings[gIdx];
      handEmoji.style.transform = 'rotate(25deg) scale(1.3)';
      setTimeout(() => {
        handEmoji.style.transform = '';
      }, 350);
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
      setTimeout(() => {
        footerEmoji.style.transform = '';
      }, 350);
    });
  }

  // --- 8. SMOOTH ANCHOR SCROLLING WITH LENIS ---
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

  // --- 9. GALLERY SECTION FILTER SWITCHER ---
  const filterPills = document.querySelectorAll('.filter-pill');
  const filterableSections = document.querySelectorAll('[data-category]');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');

      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

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
    });
  });

  // --- 10. TECHNICAL SCHEMATIC LIGHTBOX ---
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