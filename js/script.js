// Spotlight cursor glow
    const spotlight = document.getElementById('spotlight');
    document.addEventListener('mousemove', e => {
      spotlight.style.setProperty('--mx', e.clientX + 'px');
      spotlight.style.setProperty('--my', e.clientY + 'px');
    });

    // Scroll spy
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(n => {
            n.classList.toggle('active', n.dataset.section === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));

    // Smooth nav click
    navItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(item.dataset.section);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });