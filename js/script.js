// Carl Hauser Theme Interactivity
document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Cairo Clock (Matches Carl Hauser's Tokyo JST live clock)
  const clockElement = document.getElementById('liveClock');
  
  function updateCairoClock() {
    if (!clockElement) return;
    try {
      const now = new Date();
      // Format time in Cairo (UTC+2 or UTC+3 depending on DST)
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
      // Fallback
      const d = new Date();
      clockElement.textContent = `Cairo  ${d.toLocaleTimeString()}`;
    }
  }

  updateCairoClock();
  setInterval(updateCairoClock, 1000);

  // 2. Interactive Waving Hand & Farewell Emojis
  const helloHeading = document.getElementById('heroHello');
  const handEmoji = document.querySelector('.wave-hand');
  if (helloHeading && handEmoji) {
    const greetings = ['👋', '⚡', '💻', '🚀', '✨', '👋'];
    let gIdx = 0;
    helloHeading.addEventListener('click', () => {
      gIdx = (gIdx + 1) % greetings.length;
      handEmoji.textContent = greetings[gIdx];
      handEmoji.style.transform = 'rotate(25deg) scale(1.25)';
      setTimeout(() => {
        handEmoji.style.transform = '';
      }, 300);
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
      footerEmoji.style.transform = 'rotate(-25deg) scale(1.25)';
      setTimeout(() => {
        footerEmoji.style.transform = '';
      }, 300);
    });
  }

  // 3. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 4. Section Filter Switcher (All / The Process / The Systems / The Career / The Stack / Credentials)
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
            section.style.transition = 'opacity 0.25s ease';
            section.style.opacity = '1';
          }, 10);
        } else {
          section.style.display = 'none';
        }
      });
    });
  });

  // 5. Technical Schematics Lightbox
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
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
});