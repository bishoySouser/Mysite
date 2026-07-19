/**
 * Portfolio Interaction & Logic - Bishoy Souser
 * Completely Vanilla JS for zero-dependency high performance.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme Switcher
    initTheme();

    // Initialize Sticky Header
    initStickyHeader();

    // Initialize Scroll Indicators / Section Highlighting
    initSectionObserver();

    // Initialize Mobile Navigation Menu
    initMobileNav();

    // Initialize Fade-In On Scroll animations
    initScrollAnimations();

    // Initialize Form Submission Handler
    initContactForm();
});

/**
 * 1. Dark/Light Theme Switcher Logic
 */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }

    // Toggle theme on click
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // Sun SVG representation
    const sunIcon = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
        </svg>
    `;

    // Moon SVG representation
    const moonIcon = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
    `;

    themeBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
}

/**
 * 2. Sticky Header Logic
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * 3. Navigation Highlighting using IntersectionObserver
 */
function initSectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section occupies center of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * 4. Mobile Navigation Menu Toggle
 */
function initMobileNav() {
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (!menuBtn || !navLinks) return;

    // We toggle the active state of navigation
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        navLinks.style.display = isExpanded ? 'none' : 'flex';
        
        if (!isExpanded) {
            navLinks.style.position = 'absolute';
            navLinks.style.top = 'var(--header-height)';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.flexDirection = 'column';
            navLinks.style.backgroundColor = 'var(--bg-secondary)';
            navLinks.style.padding = '24px';
            navLinks.style.borderBottom = '1px solid var(--border-color)';
            navLinks.style.gap = '20px';
        } else {
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.width = '';
            navLinks.style.flexDirection = '';
            navLinks.style.backgroundColor = '';
            navLinks.style.padding = '';
            navLinks.style.borderBottom = '';
            navLinks.style.gap = '';
        }
    });

    // Close menu when clicking any link on mobile
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuBtn.setAttribute('aria-expanded', 'false');
                navLinks.style.display = 'none';
            }
        });
    });

    // Handle viewport resize to reset navigation visibility
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.width = '';
            navLinks.style.flexDirection = '';
            navLinks.style.backgroundColor = '';
            navLinks.style.padding = '';
            navLinks.style.borderBottom = '';
            navLinks.style.gap = '';
        } else {
            if (menuBtn.getAttribute('aria-expanded') !== 'true') {
                navLinks.style.display = 'none';
            }
        }
    });
}

/**
 * 5. Scroll Animations (Fade in on scroll)
 */
function initScrollAnimations() {
    // If the browser doesn't support IntersectionObserver, skip animation to avoid breaking the layout
    if (!('IntersectionObserver' in window)) return;

    const animItems = document.querySelectorAll('.card, .timeline-item, .skills-category, .edu-card, .cert-item');
    
    // Add initial styling via JS so JS-disabled users still see the page immediately
    animItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                observer.unobserve(item); // Only animate once
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.05
    });

    animItems.forEach(item => animObserver.observe(item));
}

/**
 * 6. Interactive Contact Form Submission Placeholder
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 20px; height: 20px; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
            </svg>
            Sending Message...
        `;

        // Simulate network latency (800ms)
        setTimeout(() => {
            // Show success state
            submitBtn.style.backgroundColor = 'var(--success)';
            submitBtn.style.borderColor = 'var(--success)';
            submitBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 20px; height: 20px; margin-right: 8px;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Message Sent Successfully!
            `;
            
            form.reset();

            // Reset button to normal after 3 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.borderColor = '';
                submitBtn.innerHTML = originalText;
            }, 3000);
        }, 800);
    });
}

// Add animation keyframes in CSS for contact form spinning icon dynamically if needed
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
