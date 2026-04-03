// ===================================
// Web3Forms Submission
// ===================================
function getWeb3FormsKey() {
    return (typeof window !== 'undefined' && window.WEB3FORMS_KEY &&
            window.WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY')
        ? window.WEB3FORMS_KEY : null;
}

async function submitForm(data) {
    const key = getWeb3FormsKey();
    if (!key) throw new Error('Web3Forms key not configured');

    const payload = {
        access_key: key,
        subject: 'TURN Website — ' + (data.form === 'demo_request' ? 'New Demo Request' : 'New Contact Message'),
        from_name: 'TURN Website',
        ...data
    };

    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Submission failed');
    return true;
}

// ===================================
// Mobile Hamburger Menu
// ===================================

(function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('.nav-link, .mobile-demo-link').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
})();

// Prevent browser scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Ensure page starts at top on load (unless there's a hash)
function resetScrollPosition() {
    // Only reset if there's no hash in the URL
    if (!window.location.hash) {
        // Immediately scroll to top
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
}

// Reset scroll position as soon as possible (only if no hash)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resetScrollPosition);
} else {
    resetScrollPosition();
}

// Handle hash links - scroll to hash after page loads
function scrollToHash() {
    const hash = window.location.hash;
    if (hash) {
        // Try to find the target element
        const target = document.querySelector(hash);
        if (target) {
            // Calculate header height dynamically
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80;
            
            // Get the element's position
            const elementTop = target.getBoundingClientRect().top + window.pageYOffset;
            
            // Calculate scroll position with extra padding to ensure section is fully visible
            const scrollPosition = elementTop - headerHeight - 20; // 20px extra padding
            
            // Scroll to the calculated position
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
            return true;
        }
    }
    return false;
}

// Try scrolling to hash on multiple events to ensure it works
if (window.location.hash) {
    // Don't reset scroll if there's a hash
    // Try immediately if DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // Small delay to ensure layout is complete
        setTimeout(scrollToHash, 50);
    }
    
    // Try on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(scrollToHash, 100);
        });
    }
    
    // Try on window load (most reliable for cross-page navigation)
    window.addEventListener('load', function() {
        setTimeout(scrollToHash, 200);
    });
    
    // Also handle hashchange event (for same-page hash changes)
    window.addEventListener('hashchange', function() {
        setTimeout(scrollToHash, 100);
    });
    
    // Fallback: try again after a longer delay in case images/content are still loading
    setTimeout(function() {
        if (window.location.hash) {
            scrollToHash();
        }
    }, 500);
} else {
    // No hash - ensure we're at the top
    window.addEventListener('load', resetScrollPosition);
}

// ===================================
// Set active navigation link based on current page
// ===================================
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navLinks.length === 0) return;
    
    // Get the current page filename - normalize the path
    let currentPage = currentPath.split('/').pop() || '';
    if (currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }
    // Remove query strings if any
    currentPage = currentPage.split('?')[0];
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (!href) return;
        
        // Extract the target page from href (remove hash and query string if present)
        let hrefPage = href.split('#')[0].split('?')[0];
        
        // Normalize: if hrefPage is empty, it means current page (for #home links)
        if (hrefPage === '') {
            hrefPage = 'index.html';
        }
        
        // For Home link - check if we're on index.html or root
        if (href === '#home' || hrefPage === 'index.html') {
            if (currentPage === 'index.html' || currentPage === '' || currentHash === '#home') {
                link.classList.add('active');
            }
        }
        // For About page - check exact match or if pathname includes it
        else if (hrefPage === 'about.html' || hrefPage.includes('about.html')) {
            if (currentPage === 'about.html' || currentPath.includes('about.html')) {
                link.classList.add('active');
            }
        }
        // For Platform/Features page
        else if (hrefPage === 'features.html' || hrefPage.includes('features.html')) {
            if (currentPage === 'features.html' || currentPath.includes('features.html')) {
                link.classList.add('active');
            }
        }
        // For Contact page
        else if (hrefPage === 'contact.html' || hrefPage.includes('contact.html')) {
            if (currentPage === 'contact.html' || currentPath.includes('contact.html')) {
                link.classList.add('active');
            }
        }
    });
}

// Set active nav link when DOM is ready, on load, and on hash change
function initActiveNavLink() {
    setActiveNavLink();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActiveNavLink);
} else {
    // DOM already loaded, run immediately
    initActiveNavLink();
}

// Also run on window load as a fallback
window.addEventListener('load', setActiveNavLink);

// Update active state when hash changes (for Home link)
window.addEventListener('hashchange', setActiveNavLink);


// Smooth scrolling for anchor links (exclude join waitlist and get demo buttons)
document.querySelectorAll('a[href^="#"]:not([data-join-waitlist]):not([data-get-demo])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add subtle scroll effect to header - shadow fades in on scroll
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }, { passive: true });
}

// ===================================
// Analytics Chart Animation
// Smooth sine-wave based movement with trend-aware arrow
// ===================================

(function initAnalyticsChart() {
    const chart = document.getElementById('analytics-chart');
    if (!chart) return;

    // Get all animated elements
    const bars = [
        document.getElementById('bar-1'),
        document.getElementById('bar-2'),
        document.getElementById('bar-3'),
        document.getElementById('bar-4')
    ];
    const points = [
        document.getElementById('point-1'),
        document.getElementById('point-2'),
        document.getElementById('point-3'),
        document.getElementById('point-4')
    ];
    const trendLine = document.getElementById('trend-line');
    const trendArrow = document.getElementById('trend-arrow');

    // Chart dimensions
    const CHART_BOTTOM = 60;
    const CENTER_HEIGHT = 30;  // Middle point for oscillation
    const AMPLITUDE = 14;      // How far bars swing from center
    const BAR_X_CENTERS = [20, 32, 44, 56];

    // Each bar has unique wave properties for organic movement
    // [frequency multiplier, phase offset, amplitude modifier]
    const waveParams = [
        { freq: 0.8,  phase: 0,        amp: 1.0  },  // Bar 1: slowest
        { freq: 1.1,  phase: Math.PI * 0.5, amp: 0.9  },  // Bar 2: slightly faster, offset
        { freq: 0.9,  phase: Math.PI,       amp: 1.1  },  // Bar 3: medium, opposite phase
        { freq: 1.0,  phase: Math.PI * 1.5, amp: 0.85 }   // Bar 4: base speed, different phase
    ];

    // Animation timing
    const BASE_SPEED = 0.0012;  // Gentle wave cycle
    let time = 0;

    /**
     * Calculate bar height using smooth sine wave
     */
    function getHeight(barIndex, t) {
        const params = waveParams[barIndex];
        const wave = Math.sin(t * params.freq + params.phase);
        return CENTER_HEIGHT + (wave * AMPLITUDE * params.amp);
    }

    /**
     * Update a single bar's visual representation
     */
    function updateBar(bar, height) {
        if (!bar) return;
        const y = CHART_BOTTOM - height;
        bar.setAttribute('y', y.toFixed(1));
        bar.setAttribute('height', height.toFixed(1));
    }

    /**
     * Update a data point's position
     */
    function updatePoint(point, height, index) {
        if (!point) return;
        const cy = CHART_BOTTOM - height;
        point.setAttribute('cy', cy.toFixed(1));
        point.setAttribute('cx', BAR_X_CENTERS[index]);
    }

    /**
     * Update the trend line path
     */
    function updateTrendLine(heights) {
        if (!trendLine) return;
        const pathParts = heights.map((h, i) => {
            const x = BAR_X_CENTERS[i];
            const y = CHART_BOTTOM - h;
            return `${i === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`;
        });
        trendLine.setAttribute('d', pathParts.join(' '));
    }

    /**
     * Update arrow direction and color based on trend
     */
    function updateArrow(heights) {
        if (!trendArrow) return;
        const positive = heights[3] >= heights[0];
        
        if (positive) {
            trendArrow.classList.remove('trend-down');
            trendArrow.classList.add('trend-up');
        } else {
            trendArrow.classList.remove('trend-up');
            trendArrow.classList.add('trend-down');
        }
    }

    /**
     * Main animation frame
     */
    function animate() {
        time += BASE_SPEED;
        
        // Calculate all heights using sine waves
        const heights = bars.map((_, i) => getHeight(i, time));

        // Update all visual elements
        bars.forEach((bar, i) => updateBar(bar, heights[i]));
        points.forEach((point, i) => updatePoint(point, heights[i], i));
        updateTrendLine(heights);
        updateArrow(heights);

        requestAnimationFrame(animate);
    }

    /**
     * Initialize
     */
    function initialize() {
        // Set bar colors
        bars.forEach((bar, i) => {
            if (bar) {
                bar.style.fill = i === 0 ? '#e5e5e5' : '#CD6633';
            }
        });
    }

    // Start animation
    initialize();
    requestAnimationFrame(animate);
})();

// ===================================
// Page-like Section Transitions (Scroll Progression)
// High polish, IntersectionObserver-driven reveals + staggering
// ===================================

(function initPageLikeTransitions() {
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // In reduced motion mode we simply mark everything visible and skip observers.
    if (prefersReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
        document
            .querySelectorAll(
                [
                    '.hero',
                    '.dashboard-section',
                    '.problem-section',
                    '.solution-section',
                    '.pillars-section',
                    '.process-marquee-section',
                    '.final-cta-section',
                    '.feature-card',
                    '.problem-card',
                    '.step-card',
                    '.pillar-card',
                    '.summary-card',
                    '.hero-title',
                    '.hero-subtitle',
                    '.features-title',
                    '.features-subtitle',
                    '.steps-title',
                    '.pillars-title',
                    '.process-marquee-title',
                    '.final-cta-title',
                    '.final-cta-description',
                    '.waitlist-form'
                ].join(',')
            )
            .forEach((el) => {
                el.classList.add('reveal', 'is-visible');
            });
        return;
    }

    const supportsIO = 'IntersectionObserver' in window;
    if (!supportsIO) {
        // Older browsers: just show content (no hidden state).
        document.documentElement.classList.add('no-io');
        return;
    }

    /**
     * Utility: add reveal classes safely without duplicating work.
     */
    function ensureReveal(el, variantClass) {
        if (!el) return;
        el.classList.add('reveal');
        if (variantClass) el.classList.add(variantClass);
    }

    /**
     * Utility: set a CSS variable-based delay in ms.
     */
    function setDelayMs(el, delayMs) {
        if (!el) return;
        // Keep inline style minimal (only a variable) for “surgical” control.
        el.style.setProperty('--reveal-delay', `${delayMs}ms`);
    }

    /**
     * SECTION REVEALS
     * Sections animate in like “page transitions” as you scroll down.
     */
    const sectionEls = Array.from(
        document.querySelectorAll(
            [
                '.hero',
                '.dashboard-section',
                '.problem-section',
                '.solution-section',
                '.pillars-section',
                '.process-marquee-section',
                '.final-cta-section'
            ].join(',')
        )
    );

    sectionEls.forEach((el) => ensureReveal(el, 'reveal--section'));

    // Debounce timers to prevent bouncing
    const sectionTimers = new WeakMap();

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // Clear any pending timer
                const existingTimer = sectionTimers.get(entry.target);
                if (existingTimer) {
                    clearTimeout(existingTimer);
                    sectionTimers.delete(entry.target);
                }

                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    // Only remove if element is completely out of view (prevents bouncing)
                    // Use a small delay to ensure smooth transitions
                    const timer = setTimeout(() => {
                        if (entry.intersectionRatio === 0) {
                            entry.target.classList.remove('is-visible');
                        }
                    }, 100);
                    sectionTimers.set(entry.target, timer);
                }
            });
        },
        {
            root: null,
            // Add 50px buffer inside viewport edges to prevent threshold glitch/flickering
            rootMargin: '-50px 0px -50px 0px',
            // Require 20% visibility before triggering (prevents hysteresis)
            threshold: 0.2
        }
    );

    sectionEls.forEach((el) => sectionObserver.observe(el));

    /**
     * TEXT REVEALS
     * Headlines/subtitles appear with a crisp, short motion.
     */
    const textEls = Array.from(
        document.querySelectorAll(
            [
                '.hero-title',
                '.hero-subtitle',
                '.features-title',
                '.features-subtitle',
                '.steps-title',
                '.pillars-title',
                '.process-marquee-title',
                '.final-cta-title',
                '.final-cta-description',
                '.waitlist-form'
            ].join(',')
        )
    );

    textEls.forEach((el) => ensureReveal(el, 'reveal--text'));

    // Debounce timers to prevent bouncing
    const textTimers = new WeakMap();

    const textObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // Clear any pending timer
                const existingTimer = textTimers.get(entry.target);
                if (existingTimer) {
                    clearTimeout(existingTimer);
                    textTimers.delete(entry.target);
                }

                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    // Only remove if element is completely out of view (prevents bouncing)
                    // Use a small delay to ensure smooth transitions
                    const timer = setTimeout(() => {
                        if (entry.intersectionRatio === 0) {
                            entry.target.classList.remove('is-visible');
                        }
                    }, 100);
                    textTimers.set(entry.target, timer);
                }
            });
        },
        {
            root: null,
            // Add 50px buffer inside viewport edges to prevent threshold glitch/flickering
            rootMargin: '-50px 0px -50px 0px',
            // Require 20% visibility before triggering (prevents hysteresis)
            threshold: 0.2
        }
    );

    textEls.forEach((el) => textObserver.observe(el));

    /**
     * DASHBOARD “HERO PRODUCT” REVEAL
     * Slight scale + lift, timed after the dashboard section enters.
     */
    const dashboardHero = document.querySelector('.dashboard-placeholder');
    if (dashboardHero) {
        ensureReveal(dashboardHero, 'reveal--scale');
        setDelayMs(dashboardHero, 120);
        // Debounce timer to prevent bouncing
        let dashboardTimer = null;
        const dashboardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Clear any pending timer
                    if (dashboardTimer) {
                        clearTimeout(dashboardTimer);
                        dashboardTimer = null;
                    }

                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        // Only remove if element is completely out of view (prevents bouncing)
                        // Use a small delay to ensure smooth transitions
                        dashboardTimer = setTimeout(() => {
                            if (entry.intersectionRatio === 0) {
                                entry.target.classList.remove('is-visible');
                            }
                        }, 100);
                    }
                });
            },
            { 
                root: null, 
                // Add 50px buffer inside viewport edges to prevent threshold glitch/flickering
                rootMargin: '-50px 0px -50px 0px', 
                // Require 20% visibility before triggering (prevents hysteresis)
                threshold: 0.2 
            }
        );
        dashboardObserver.observe(dashboardHero);
    }

    /**
     * CARD REVEALS (STAGGERED)
     * Feature cards, pillars, steps, summary cards animate with per-grid staggering.
     * We stagger *within each container* so it always feels intentional.
     */
    const cardGroups = [
        '.dashboard-summary-cards .summary-card',
        '.dashboard-top-cards .top-card',
        '.problem-grid .problem-card',
        '.features-grid .feature-card',
        '.steps-grid .step-card',
        '.pillars-grid .pillar-card'
    ];

    // Prepare cards and assign local stagger delays by nearest parent grid/container.
    cardGroups.forEach((selector) => {
        const cards = Array.from(document.querySelectorAll(selector));
        if (!cards.length) return;

        // Try to find a sensible container for local staggering.
        const container =
            cards[0].closest(
                '.dashboard-summary-cards, .dashboard-top-cards, .problem-grid, .features-grid, .steps-grid, .pillars-grid'
            ) || cards[0].parentElement;

        // If container exists, stagger by DOM order within that container only.
        const scopedCards = container
            ? Array.from(container.querySelectorAll(selector.split(' ').slice(-1)[0]))
            : cards;

        scopedCards.forEach((card, i) => {
            ensureReveal(card, 'reveal--card');
            // Slightly slower stagger for larger tiles, faster for dense grids.
            const base = selector.includes('pillar') ? 70 : 55;
            const delay = Math.min(420, i * base);
            setDelayMs(card, delay);
        });
    });

    // Debounce timers to prevent bouncing
    const cardTimers = new WeakMap();

    const cardObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // Clear any pending timer
                const existingTimer = cardTimers.get(entry.target);
                if (existingTimer) {
                    clearTimeout(existingTimer);
                    cardTimers.delete(entry.target);
                }

                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    // Only remove if element is completely out of view (prevents bouncing)
                    // Use a small delay to ensure smooth transitions
                    const timer = setTimeout(() => {
                        if (entry.intersectionRatio === 0) {
                            entry.target.classList.remove('is-visible');
                        }
                    }, 100);
                    cardTimers.set(entry.target, timer);
                }
            });
        },
        {
            root: null,
            // Add 50px buffer inside viewport edges to prevent threshold glitch/flickering
            rootMargin: '-50px 0px -50px 0px',
            // Require 20% visibility before triggering (prevents hysteresis)
            threshold: 0.2
        }
    );

    document.querySelectorAll('.reveal--card').forEach((el) => cardObserver.observe(el));

    /**
     * TOP SCROLL PROGRESS INDICATOR
     * Subtle “progression” cue like multi-step pages.
     */
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    const progressFill = document.createElement('div');
    progressFill.className = 'scroll-progress__fill';
    progress.appendChild(progressFill);

    let ticking = false;
    function updateProgress() {
        ticking = false;
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const winHeight = window.innerHeight || document.documentElement.clientHeight || 1;
        const maxScroll = Math.max(1, docHeight - winHeight);
        const pct = Math.min(1, Math.max(0, scrollTop / maxScroll));
        progressFill.style.transform = `scaleX(${pct})`;
    }

    window.addEventListener(
        'scroll',
        () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateProgress);
        },
        { passive: true }
    );

    // Initialize instantly.
    updateProgress();
})();

// ===================================
// Process Section - Carousel Navigation
// Single card carousel with arrow navigation
// ===================================

(function initProcessCarousel() {
    const cardsTrack = document.querySelector('.process-cards-track');
    const cardsWrapper = document.querySelector('.process-cards-wrapper');
    const prevButton = document.querySelector('.process-carousel-arrow-left');
    const nextButton = document.querySelector('.process-carousel-arrow-right');
    
    if (!cardsTrack || !cardsWrapper || !prevButton || !nextButton) return;
    
    const cards = Array.from(cardsTrack.querySelectorAll('.process-card'));
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    /**
     * Update carousel position based on current index
     */
    function updateCarousel() {
        // Get the wrapper width (visible area) since each card is 100% width
        const wrapperWidth = cardsWrapper.offsetWidth;
        const translateX = -currentIndex * wrapperWidth;
        
        cardsTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === totalCards - 1;
    }
    
    /**
     * Navigate to next card
     */
    function nextCard() {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    /**
     * Navigate to previous card
     */
    function prevCard() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Event listeners
    nextButton.addEventListener('click', nextCard);
    prevButton.addEventListener('click', prevCard);
    
    // Keyboard navigation
    const carouselContainer = cardsTrack.closest('.process-carousel-container');
    if (carouselContainer) {
        carouselContainer.setAttribute('tabindex', '0');
        carouselContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevCard();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextCard();
            }
        });
    }
    
    // Initialize
    updateCarousel();
    
    // Recalculate on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel();
        }, 150);
    }, { passive: true });
})();

// ===================================
// Join Waitlist Page (formerly Schedule Intro Call Page)
// Full-page overlay with form
// ===================================

(function initScheduleCallPage() {
    const scheduleCallPage = document.getElementById('scheduleCallPage');
    const scheduleCallTriggers = document.querySelectorAll('[data-join-waitlist]');
    const scheduleCallForm = document.getElementById('scheduleCallForm');
    
    if (!scheduleCallPage || scheduleCallTriggers.length === 0) return;
    
    let isOpen = false;
    
    // Navigation link handlers - only active when modal is open
    let navLinkHandlers = [];
    
    function attachNavLinkHandlers() {
        const closeOnNavLinks = document.querySelectorAll('.header a, .logo a, .footer-link, .nav-link');
        closeOnNavLinks.forEach(link => {
            const handler = (e) => {
                // Get href first
                const href = link.getAttribute('href');
                
                // Prevent default and close modal
                e.preventDefault();
                e.stopPropagation();
                closeScheduleCallPage();
                
                // Handle navigation after closing modal
                if (href && href.startsWith('#') && href !== '#') {
                    // Hash link - scroll to section
                    setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                } else if (href === '/' || href === '#home' || href === 'index.html' || href === 'index.html#home') {
                    // Home link - scroll to top or navigate to index
                    setTimeout(() => {
                        if (href.includes('index.html')) {
                            window.location.href = href;
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 100);
                } else if (href && !href.startsWith('#') && href !== '#') {
                    // Regular page link (features.html, about.html, contact.html) - navigate immediately
                    setTimeout(() => {
                        window.location.href = href;
                    }, 100);
                }
            };
            
            link.addEventListener('click', handler);
            navLinkHandlers.push({ link, handler });
        });
    }
    
    function detachNavLinkHandlers() {
        navLinkHandlers.forEach(({ link, handler }) => {
            link.removeEventListener('click', handler);
        });
        navLinkHandlers = [];
    }
    
    /**
     * Open the join waitlist page (formerly schedule call page)
     */
    function openScheduleCallPage() {
        if (isOpen) return;
        isOpen = true;
        
        document.body.classList.add('schedule-call-open');
        scheduleCallPage.classList.add('is-active');
        scheduleCallPage.setAttribute('aria-hidden', 'false');
        
        // Ensure overlay is scrolled to top to show title - no auto-focus to prevent scroll
        scheduleCallPage.scrollTop = 0;
        
        // Attach navigation link handlers
        attachNavLinkHandlers();
    }
    
    /**
     * Close the join waitlist page
     */
    function closeScheduleCallPage() {
        if (!isOpen) return;
        isOpen = false;
        
        document.body.classList.remove('schedule-call-open');
        scheduleCallPage.classList.remove('is-active');
        scheduleCallPage.setAttribute('aria-hidden', 'true');
        
        // Detach navigation link handlers
        detachNavLinkHandlers();
    }
    
    // Click handlers for all join waitlist triggers (formerly schedule call triggers)
    scheduleCallTriggers.forEach(trigger => {
        // Ensure href is set to # to prevent navigation
        if (trigger.tagName === 'A') {
            trigger.setAttribute('href', '#');
        }
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Close get demo page if open
            const joinWaitlistPage = document.getElementById('joinWaitlistPage');
            if (joinWaitlistPage && joinWaitlistPage.classList.contains('is-active')) {
                document.body.classList.remove('join-waitlist-open');
                joinWaitlistPage.classList.remove('is-active');
                joinWaitlistPage.setAttribute('aria-hidden', 'true');
            }
            openScheduleCallPage();
        });
    });
    
    // Close when clicking outside the card (on the background)
    scheduleCallPage.addEventListener('click', (e) => {
        if (e.target === scheduleCallPage) {
            closeScheduleCallPage();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            closeScheduleCallPage();
        }
    });
    
    // Note: Phone number input restriction moved to Get Demo form handler
    
    // Handle form submission
    if (scheduleCallForm) {
        scheduleCallForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(scheduleCallForm);
            const data = Object.fromEntries(formData.entries());
            
            // For now, just log and show success (implement actual submission later)
            console.log('Join waitlist form submitted:', data);
            
            // Show success feedback
            const submitBtn = scheduleCallForm.querySelector('.schedule-call-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Joined!';
            submitBtn.style.background = '#2d8a4e';
            
            // Reset form after delay
            setTimeout(() => {
                scheduleCallForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                closeScheduleCallPage();
            }, 2000);
        });
    }
})();

// ===================================
// Get Demo Page (formerly Join Waitlist Page)
// Full-page overlay with email form
// ===================================

(function initJoinWaitlistPage() {
    const joinWaitlistPage = document.getElementById('joinWaitlistPage');
    const joinWaitlistTriggers = document.querySelectorAll('[data-get-demo]');
    const joinWaitlistForm = document.getElementById('joinWaitlistForm');
    
    if (!joinWaitlistPage || joinWaitlistTriggers.length === 0) return;
    
    let isOpen = false;
    
    // Navigation link handlers - only active when modal is open
    let navLinkHandlers2 = [];
    
    function attachNavLinkHandlers2() {
        const closeOnNavLinks = document.querySelectorAll('.header a:not([data-get-demo]), .logo a:not([data-get-demo]), .footer-link:not([data-get-demo]), .nav-link:not([data-get-demo])');
        closeOnNavLinks.forEach(link => {
            const handler = (e) => {
                // Get href first
                const href = link.getAttribute('href');
                
                // Prevent default and close modal
                e.preventDefault();
                e.stopPropagation();
                closeJoinWaitlistPage();
                
                // Handle navigation after closing modal
                if (href && href.startsWith('#') && href !== '#') {
                    // Hash link - scroll to section
                    setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                } else if (href === '/' || href === '#home' || href === 'index.html' || href === 'index.html#home') {
                    // Home link - scroll to top or navigate to index
                    setTimeout(() => {
                        if (href.includes('index.html')) {
                            window.location.href = href;
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 100);
                } else if (href && !href.startsWith('#') && href !== '#') {
                    // Regular page link (features.html, about.html, contact.html) - navigate immediately
                    setTimeout(() => {
                        window.location.href = href;
                    }, 100);
                }
            };
            
            link.addEventListener('click', handler);
            navLinkHandlers2.push({ link, handler });
        });
    }
    
    function detachNavLinkHandlers2() {
        navLinkHandlers2.forEach(({ link, handler }) => {
            link.removeEventListener('click', handler);
        });
        navLinkHandlers2 = [];
    }
    
    /**
     * Open the get demo page (formerly join waitlist page)
     */
    function openJoinWaitlistPage() {
        if (isOpen) return;
        isOpen = true;
        
        document.body.classList.add('join-waitlist-open');
        joinWaitlistPage.classList.add('is-active');
        joinWaitlistPage.setAttribute('aria-hidden', 'false');
        
        // Ensure overlay is scrolled to top to show title - no auto-focus to prevent scroll
        joinWaitlistPage.scrollTop = 0;
        
        // Attach navigation link handlers
        attachNavLinkHandlers2();
    }
    
    /**
     * Close the get demo page
     */
    function closeJoinWaitlistPage() {
        if (!isOpen) return;
        isOpen = false;
        
        document.body.classList.remove('join-waitlist-open');
        joinWaitlistPage.classList.remove('is-active');
        joinWaitlistPage.setAttribute('aria-hidden', 'true');
        
        // Detach navigation link handlers
        detachNavLinkHandlers2();
    }
    
    // Click handlers for all get demo triggers (formerly join waitlist triggers)
    joinWaitlistTriggers.forEach(trigger => {
        // Ensure href is set to # to prevent navigation
        if (trigger.tagName === 'A') {
            trigger.setAttribute('href', '#');
        }
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Close join waitlist page if open
            const scheduleCallPage = document.getElementById('scheduleCallPage');
            if (scheduleCallPage && scheduleCallPage.classList.contains('is-active')) {
                document.body.classList.remove('schedule-call-open');
                scheduleCallPage.classList.remove('is-active');
                scheduleCallPage.setAttribute('aria-hidden', 'true');
            }
            openJoinWaitlistPage();
        });
    });
    
    // Restrict phone number input to numbers only (for Get Demo form)
    const phoneInput = joinWaitlistPage.querySelector('#phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Remove any non-numeric characters
            e.target.value = e.target.value.replace(/\D/g, '');
        });
        
        // Also prevent non-numeric characters on paste
        phoneInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numericOnly = pastedText.replace(/\D/g, '');
            phoneInput.value = numericOnly;
        });
    }
    
    // Close when clicking outside the card (on the background)
    joinWaitlistPage.addEventListener('click', (e) => {
        if (e.target === joinWaitlistPage) {
            closeJoinWaitlistPage();
        }
    });
    
    // Close on Escape key (check if this page is open)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            closeJoinWaitlistPage();
        }
    });
    
    // Handle form submission
    if (joinWaitlistForm) {
        joinWaitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(joinWaitlistForm);
            const data = Object.fromEntries(formData.entries());
            const submitBtn = joinWaitlistForm.querySelector('.join-waitlist-submit');
            const originalText = submitBtn.textContent;
            
            function showSuccess() {
                submitBtn.textContent = 'Requested!';
                submitBtn.style.background = '#2d8a4e';
                setTimeout(() => {
                    joinWaitlistForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    closeJoinWaitlistPage();
                }, 2000);
            }
            
            function showError(msg) {
                submitBtn.textContent = msg || 'Try again';
                submitBtn.style.background = '#b91c1c';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            try {
                await submitForm({
                    form: 'demo_request',
                    full_name: data.fullName || '',
                    email: data.emailAddress || '',
                    phone: data.phoneNumber || '',
                    company: data.company || '',
                    message: data.message || '',
                    submitted_at: new Date().toISOString()
                });
                showSuccess();
            } catch (err) {
                console.error('Demo request submit error:', err);
                showError('Something went wrong');
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
})();

// ===================================
// Contact Form Handler
// Handles form submission on contact.html page
// ===================================

(function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        function showSuccess() {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#2d8a4e';
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 2000);
        }
        
        function showError(msg) {
            submitBtn.textContent = msg || 'Try again';
            submitBtn.style.background = '#b91c1c';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        try {
            await submitForm({
                form: 'contact_message',
                full_name: data.fullName || '',
                email: data.email || '',
                company: data.company || '',
                message: data.message || '',
                submitted_at: new Date().toISOString()
            });
            showSuccess();
        } catch (err) {
            console.error('Contact form submit error:', err);
            showError('Something went wrong');
        } finally {
            submitBtn.disabled = false;
        }
    });
})();

// ===================================
// CTA Email Form — open Get Demo overlay on submit/enter
// ===================================

(function initCtaEmailForm() {
    const form = document.getElementById('ctaEmailForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('ctaEmailInput');
        const emailVal = email ? email.value : '';

        // Open the Get Demo overlay
        const getDemoBtn = document.querySelector('[data-get-demo]');
        if (getDemoBtn) getDemoBtn.click();

        // Pre-fill email in the overlay form
        setTimeout(function () {
            const overlayEmail = document.getElementById('emailAddress');
            if (overlayEmail && emailVal) overlayEmail.value = emailVal;
        }, 100);
    });
})();

// ===================================
// Metric Count-Up Animation
// Animates numeric metrics on card hover
// ===================================

(function initMetricCountUp() {
    const problemCards = document.querySelectorAll('.problem-card');
    
    if (problemCards.length === 0) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Skip animation in reduced motion mode
        return;
    }
    
    /**
     * Animate a number from 0 to target value with linear speed
     * Returns a function to cancel the animation
     */
    function animateValue(element, start, end, duration, suffix) {
        const startTime = performance.now();
        const targetValue = parseFloat(end);
        const sfx = suffix || '';
        let animationId = null;
        let cancelled = false;
        
        // Determine if target is a decimal (for formatting)
        const isDecimal = targetValue % 1 !== 0;
        const decimalPlaces = isDecimal ? (end.toString().split('.')[1] || '').length : 0;
        
        function update(currentTime) {
            if (cancelled) return;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Linear interpolation for perfectly consistent speed
            let current = start + (targetValue - start) * progress;
            
            // Format based on whether it's a decimal
            if (isDecimal) {
                current = parseFloat(current.toFixed(decimalPlaces));
            } else {
                current = Math.round(current);
            }
            
            // Update text - width is already locked
            element.textContent = current + sfx;
            
            if (progress < 1) {
                animationId = requestAnimationFrame(update);
            } else {
                // Ensure final value is set exactly
                element.textContent = targetValue + sfx;
            }
        }
        
        animationId = requestAnimationFrame(update);
        
        // Return cancel function
        return () => {
            cancelled = true;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }
    
    /**
     * Handle card hover - animate .problem-number on enter, reset on leave
     */
    problemCards.forEach(card => {
        const numberEl = card.querySelector('.problem-number');
        if (!numberEl || !numberEl.hasAttribute('data-target')) return;

        const target = numberEl.getAttribute('data-target');
        const startAttr = numberEl.getAttribute('data-start');
        const suffix = numberEl.getAttribute('data-suffix') || '';
        const startVal = startAttr !== null ? parseFloat(startAttr) : 0;
        const finalText = parseFloat(target) + suffix;

        let cancelAnim = null;

        card.addEventListener('mouseenter', () => {
            if (cancelAnim) cancelAnim();
            numberEl.textContent = startVal + suffix;
            cancelAnim = animateValue(numberEl, startVal, target, 1500, suffix);
        });

        card.addEventListener('mouseleave', () => {
            if (cancelAnim) cancelAnim();
            cancelAnim = null;
            numberEl.textContent = finalText;
        });
    });
})();

