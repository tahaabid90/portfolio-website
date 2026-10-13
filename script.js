/* ============================================================
   Muhammad Taha - Portfolio JavaScript
   Fully fault-tolerant & robust for Local and GitHub Pages hosting
   ============================================================ */

/* ── 1. Defensive Defaults for Optional Integrations ── */
if (typeof FIREBASE_CONFIG === 'undefined') window.FIREBASE_CONFIG = null;
if (typeof EMAILJS_CONFIG  === 'undefined') window.EMAILJS_CONFIG  = null;
if (typeof USE_FIREBASE    === 'undefined') window.USE_FIREBASE    = false;
if (typeof USE_EMAILJS     === 'undefined') window.USE_EMAILJS     = false;

let db = null;

if (USE_FIREBASE && FIREBASE_CONFIG && typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.firestore();
        console.log("✅ Firebase connected.");
    } catch (e) {
        console.warn("⚠️ Firebase init failed:", e.message);
    }
}

if (USE_EMAILJS && EMAILJS_CONFIG && typeof emailjs !== 'undefined') {
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log("✅ EmailJS ready.");
    } catch (e) {
        console.warn("⚠️ EmailJS init failed:", e.message);
    }
}

/* ── 2. Failsafe Preloader Dismissal ── */
(function setupLoader() {
    let dismissed = false;
    function hideLoader() {
        if (dismissed) return;
        dismissed = true;
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('loaded');
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }

    // A) If page is already loaded (fast CDN or browser cache)
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 800);
    } else {
        // B) Normal window load event
        window.addEventListener('load', () => {
            setTimeout(hideLoader, 900);
        });
        // C) DOM ready fallback in case heavy CDN assets stall window.load
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(hideLoader, 1600);
        });
    }

    // D) Absolute safety timeout: never allow loader to hang on GitHub Pages
    setTimeout(hideLoader, 2800);
})();

/* ── 3. Main Application Initializer ── */
function initApp() {
    initTheme();
    initNavbar();
    initMobileMenu();
    initTypewriter();
    initScrollReveal();
    initCounters();
    initContactForm();
    initSmoothScroll();
}

// Ensure initApp executes regardless of whether DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

/* ── 4. Theme Management (Dark / Light) ── */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const body     = document.body;
    if (!themeBtn || !body) return;

    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem('ar-theme') || 'dark';
    } catch (e) {
        console.warn('localStorage read error:', e);
    }

    applyTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const current = body.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('ar-theme', theme);
        } catch (e) {}
        themeBtn.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/* ── 5. Sticky Navbar, Scroll-Spy & Back to Top ── */
function initNavbar() {
    const header    = document.querySelector('header');
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.navbar a');
    const backToTop = document.getElementById('back-to-top');

    function updateNavbar() {
        const scrollY = window.scrollY || window.pageYOffset || 0;

        if (header) {
            header.classList.toggle('sticky', scrollY > 70);
        }

        let currentSection = '';
        sections.forEach(sec => {
            const top    = sec.offsetTop - 170;
            const height = sec.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSection && link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        if (backToTop) {
            backToTop.classList.toggle('show', scrollY > 400);
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ── 6. Mobile Menu Toggle ── */
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const navbar  = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');

    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', () => {
            navbar.classList.toggle('open');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.className = navbar.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('open');
                const icon = menuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }
}

/* ── 7. Dynamic Typewriter (with bulletproof fallback) ── */
function initTypewriter() {
    const typedEl = document.querySelector('.typed');
    if (!typedEl) return;

    const roles = [
        'Web Developer',
        'Frontend Specialist',
        'React Developer',
        'UI/UX Enthusiast',
        'Problem Solver'
    ];

    // Attempt Typed.js if library loaded successfully
    if (typeof Typed !== 'undefined') {
        try {
            new Typed('.typed', {
                strings:    roles,
                typeSpeed:  80,
                backSpeed:  45,
                backDelay:  1200,
                startDelay: 400,
                loop:       true,
                showCursor: true,
                cursorChar: '|'
            });
            return;
        } catch (e) {
            console.warn('Typed.js initialization failed, using fallback:', e);
        }
    }

    // Pure Vanilla JS Typewriter Fallback if CDN blocked or slow
    let strIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function tick() {
        const currentStr = roles[strIdx];
        if (isDeleting) {
            typedEl.textContent = currentStr.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typedEl.textContent = currentStr.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 85;

        if (!isDeleting && charIdx === currentStr.length) {
            speed = 1200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            strIdx = (strIdx + 1) % roles.length;
            speed = 300;
        }

        setTimeout(tick, speed);
    }

    tick();
}

/* ── 8. ScrollReveal Animations ── */
function initScrollReveal() {
    if (typeof ScrollReveal === 'undefined') return;

    try {
        const sr = ScrollReveal({
            origin:   'bottom',
            distance: '50px',
            duration: 900,
            delay:    120,
            easing:   'cubic-bezier(0.5, 0, 0, 1)',
            reset:    false
        });

        sr.reveal('.hero-content',                { origin: 'left',  delay: 150 });
        sr.reveal('.hero-img',                    { origin: 'right', delay: 200 });
        sr.reveal('.heading',                     { origin: 'top',   delay: 100 });
        sr.reveal('.about-img',                   { origin: 'left',  delay: 150 });
        sr.reveal('.about-content',               { origin: 'right', delay: 200 });
        sr.reveal('.skill-card',                  { interval: 80 });
        sr.reveal('.cert-card',                   { interval: 80 });
        sr.reveal('.project-card',                { interval: 100 });
        sr.reveal('.timeline-container',          { interval: 150 });
        sr.reveal('.stat-item',                   { interval: 100 });
        sr.reveal('.contact-info, .contact-form', { interval: 150 });
    } catch (e) {
        console.warn('ScrollReveal init error:', e);
    }
}

/* ── 9. Animated Stats Counters (Butter-Smooth 60fps & Reliable) ── */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function runCounter(el) {
        if (el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const duration = 1600;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-Out Expo for natural deceleration
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOut * target);

            el.textContent = current + (progress === 1 ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + '+';
            }
        }

        requestAnimationFrame(update);
    }

    // Low threshold (0.15) ensures counters trigger reliably on all screen sizes & mobile
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        counters.forEach(c => observer.observe(c));
    } else {
        counters.forEach(runCounter);
    }

    // Safety fallback: ensure counters never remain at '0' even if observer doesn't fire
    setTimeout(() => {
        counters.forEach(el => {
            if (el.dataset.animated !== 'true') {
                runCounter(el);
            }
        });
    }, 3500);
}

/* ── 10. Contact Form Handling & Validation ── */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMsg     = document.getElementById('form-message');
    if (!contactForm || !formMsg) return;

    const fields = {
        name:    { el: document.getElementById('name'),    minLen: 2, label: 'Full Name'     },
        email:   { el: document.getElementById('email'),   minLen: 5, label: 'Email Address' },
        subject: { el: document.getElementById('subject'), minLen: 2, label: 'Subject'       },
        message: { el: document.getElementById('message'), minLen: 5, label: 'Message'       }
    };

    function validateField(el, minLen) {
        if (!el) return true;
        const val = el.value.trim();
        let ok;
        if (el.type === 'email') {
            ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        } else {
            ok = val.length >= minLen;
        }
        el.classList.toggle('error',   !ok);
        el.classList.toggle('success',  ok);
        return ok;
    }

    Object.values(fields).forEach(({ el, minLen }) => {
        if (!el) return;
        el.addEventListener('blur',  () => validateField(el, minLen));
        el.addEventListener('input', () => {
            if (el.classList.contains('error')) validateField(el, minLen);
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const failedLabels = [];
        Object.values(fields).forEach(({ el, minLen, label }) => {
            if (el && !validateField(el, minLen)) {
                failedLabels.push(label);
            }
        });

        if (failedLabels.length > 0) {
            showFormMsg('error', `⚠️ Please fill in correctly: ${failedLabels.join(', ')}`);
            return;
        }

        const formData = {
            from_name:  fields.name.el ? fields.name.el.value.trim() : '',
            reply_to:   fields.email.el ? fields.email.el.value.trim() : '',
            subject:    fields.subject.el ? fields.subject.el.value.trim() : '',
            message:    fields.message.el ? fields.message.el.value.trim() : '',
            timestamp:  new Date().toISOString()
        };

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled    = true;
            submitBtn.textContent = 'Sending…';
        }

        let emailSent = false;
        let savedToDb = false;

        // A) Send via EmailJS if enabled
        if (USE_EMAILJS && typeof emailjs !== 'undefined' && EMAILJS_CONFIG) {
            try {
                await emailjs.send(
                    EMAILJS_CONFIG.serviceId,
                    EMAILJS_CONFIG.templateId,
                    formData
                );
                emailSent = true;
                console.log("✅ Email sent via EmailJS.");
            } catch (err) {
                console.error("❌ EmailJS error:", err);
            }
        }

        // B) Save to Firebase Firestore if enabled
        if (USE_FIREBASE && db) {
            db.collection('messages').add(formData)
                .then(() => console.log("✅ Message saved to Firestore."))
                .catch(err => console.error("❌ Firestore error:", err));
            savedToDb = true;
        }

        const success = (!USE_EMAILJS && !USE_FIREBASE) || emailSent || savedToDb;

        if (success) {
            showFormMsg('success', 'Thank you! Your message was received successfully. ✅');
            contactForm.reset();
            Object.values(fields).forEach(({ el }) => {
                if (el) el.classList.remove('success', 'error');
            });
        } else {
            showFormMsg('error', '❌ Something went wrong. Please email directly.');
        }

        if (submitBtn) {
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Send Message';
        }
    });

    function showFormMsg(type, text) {
        formMsg.style.whiteSpace = 'pre-line';
        formMsg.textContent = text;
        formMsg.className   = 'form-message ' + (type === 'success' ? 'success-msg' : 'error-msg');
        if (type === 'success') {
            setTimeout(() => {
                formMsg.className   = 'form-message';
                formMsg.textContent = '';
            }, 6000);
        }
    }
}

/* ── 11. Smooth Scrolling for Internal Links ── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
