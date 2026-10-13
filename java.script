/* ── Defensive defaults — if firebase-config.js fails to load, the site still works ── */
if (typeof FIREBASE_CONFIG === 'undefined') window.FIREBASE_CONFIG = null;
if (typeof EMAILJS_CONFIG  === 'undefined') window.EMAILJS_CONFIG  = null;
if (typeof USE_FIREBASE    === 'undefined') window.USE_FIREBASE    = false;
if (typeof USE_EMAILJS     === 'undefined') window.USE_EMAILJS     = false;

let db = null;

if (USE_FIREBASE && FIREBASE_CONFIG) {
    try {
        firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.firestore();
        console.log("✅ Firebase connected.");
    } catch (e) {
        console.warn("⚠️ Firebase init failed:", e.message);
    }
}

if (USE_EMAILJS && EMAILJS_CONFIG) {
    try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log("✅ EmailJS ready.");
    } catch (e) {
        console.warn("⚠️ EmailJS init failed:", e.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('loader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }, 1200);
    });



    if (typeof Typed !== 'undefined') {
        new Typed('.typed', {
            strings: [
                'Web Developer',
                'React Developer',
                'Firebase Developer',
                'UI/UX Enthusiast',
                'Problem Solver'
            ],
            typeSpeed:  90,
            backSpeed:  50,
            backDelay:  1200,
            startDelay: 600,
            loop:       true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    const header   = document.querySelector('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a');

    function updateNavbar() {
        header.classList.toggle('sticky', window.scrollY > 80);

        let currentSection = '';
        sections.forEach(sec => {
            const top    = sec.offsetTop - 160;
            const height = sec.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        const btn = document.getElementById('back-to-top');
        if (btn) btn.classList.toggle('show', window.scrollY > 500);
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    const themeBtn = document.getElementById('theme-toggle');
    const body     = document.body;

    const savedTheme = localStorage.getItem('ar-theme') || 'dark';
    applyTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const current = body.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('ar-theme', theme);
        themeBtn.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    const menuBtn = document.getElementById('menu-btn');
    const navbar  = document.querySelector('.navbar');

    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', () => {
            navbar.classList.toggle('open');
            const icon = menuBtn.querySelector('i');
            icon.className = navbar.classList.contains('open')
                ? 'fas fa-times'
                : 'fas fa-bars';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('open');
                const icon = menuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin:   'bottom',
            distance: '60px',
            duration: 1000,
            delay:    150,
            easing:   'cubic-bezier(0.5, 0, 0, 1)',
            reset:    false
        });

        sr.reveal('.hero-content',               { origin: 'left',  delay: 200 });
        sr.reveal('.hero-img',                   { origin: 'right', delay: 300 });
        sr.reveal('.heading',                    { origin: 'top',   delay: 100 });
        sr.reveal('.about-img',                  { origin: 'left',  delay: 200 });
        sr.reveal('.about-content',              { origin: 'right', delay: 300 });
        sr.reveal('.skill-card',                 { interval: 100 });
        sr.reveal('.cert-card',                  { interval: 100 });
        sr.reveal('.project-card',               { interval: 150 });
        sr.reveal('.timeline-container',         { interval: 200 });
        sr.reveal('.stat-item',                  { interval: 150 });
        sr.reveal('.contact-info, .contact-form',{ interval: 200 });
    }

    const counters = document.querySelectorAll('.counter');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el       = entry.target;
            const target   = +el.getAttribute('data-target');
            const duration = 1800;
            const step     = target / (duration / 16);
            let current    = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 16);

            counterObserver.unobserve(el);
        });
    }, { threshold: 0.6 });

    counters.forEach(c => counterObserver.observe(c));

    const contactForm = document.getElementById('contactForm');
    const formMsg     = document.getElementById('form-message');

    if (contactForm && formMsg) {

        /* Field definitions for validation */
        const fields = {
            name:    { el: document.getElementById('name'),    minLen: 2, label: 'Full Name'     },
            email:   { el: document.getElementById('email'),   minLen: 5, label: 'Email Address' },
            subject: { el: document.getElementById('subject'), minLen: 2, label: 'Subject'       },
            message: { el: document.getElementById('message'), minLen: 5, label: 'Message'       }
        };

        /* Live validation on blur / input */
        Object.values(fields).forEach(({ el, minLen }) => {
            if (!el) return;
            el.addEventListener('blur',  () => validateField(el, minLen));
            el.addEventListener('input', () => {
                if (el.classList.contains('error')) validateField(el, minLen);
            });
        });

        function validateField(el, minLen) {
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

        /* ── Submit handler ── */
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            /* Validate all fields — collect failed labels */
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

            /* Collect data */
            const formData = {
                from_name:  fields.name.el.value.trim(),
                reply_to:   fields.email.el.value.trim(),
                subject:    fields.subject.el.value.trim(),
                message:    fields.message.el.value.trim(),
                timestamp:  new Date().toISOString()
            };

            /* UI feedback — disable button */
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled    = true;
            submitBtn.textContent = 'Sending…';

            let emailSent = false;
            let savedToDb = false;

            /* ── A) Send email via EmailJS ── */
            if (USE_EMAILJS) {
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

            /* ── B) Save to Firebase Firestore — fire & forget (no await) ── */
            if (USE_FIREBASE && db) {
                db.collection('messages').add(formData)
                    .then(() => console.log("✅ Message saved to Firestore."))
                    .catch(err => console.error("❌ Firestore error:", err));
                savedToDb = true; // optimistic — UI doesn't wait for DB
            }

            /* ── C) Show result ── */
            const success = (!USE_EMAILJS && !USE_FIREBASE) || emailSent || savedToDb;

            if (success) {
                showFormMsg(
                    'success',
                    '(Thank you! Your message was received.) ✅'
                );
                contactForm.reset();
                Object.values(fields).forEach(({ el }) => {
                    if (el) el.classList.remove('success', 'error');
                });
            } else {
                showFormMsg('error', '❌ Something went wrong. Please email directly: mahmedraza9029@gmail.com');
            }

            submitBtn.disabled    = false;
            submitBtn.textContent = 'Send Message';
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


    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


}); 
