/* ============================================
   Mili Website - Interactive Scripts
   Theme toggle, scroll animations, mobile nav
   ============================================ */

(function () {
    'use strict';

    // ---- Theme Management ----
    const THEME_KEY = 'mili-theme';
    const root = document.documentElement;

    function getPreferredTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    applyTheme(getPreferredTheme());

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const current = root.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        if (scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }, { passive: true });

    // ---- Mobile Navigation ----
    const navMenuBtn = document.getElementById('navMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (navMenuBtn && navLinks) {
        navMenuBtn.addEventListener('click', function () {
            navMenuBtn.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenuBtn.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    // ---- Reveal on Scroll ----
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = 0;
                    // Stagger sibling reveals within the same container
                    var siblings = el.parentElement ? el.parentElement.querySelectorAll('.reveal') : [];
                    for (var i = 0; i < siblings.length; i++) {
                        if (siblings[i] === el) { delay = i * 80; break; }
                    }
                    setTimeout(function () { el.classList.add('visible'); }, delay);
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all immediately
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ---- Quick Start Tabs ----
    var qsTabs = document.querySelectorAll('.qs-tab');
    var qsPanels = document.querySelectorAll('.qs-panel');

    qsTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var target = tab.getAttribute('data-tab');

            qsTabs.forEach(function (t) { t.classList.remove('active'); });
            qsPanels.forEach(function (p) { p.classList.remove('active'); });

            tab.classList.add('active');
            var panel = document.querySelector('.qs-panel[data-panel="' + target + '"]');
            if (panel) {
                panel.classList.add('active');
                // Re-trigger reveal for panel content
                panel.querySelectorAll('.reveal').forEach(function (el, i) {
                    el.classList.remove('visible');
                    setTimeout(function () { el.classList.add('visible'); }, i * 80);
                });
            }
        });
    });

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = 70; // navbar height
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ---- Active Nav Link Highlight ----
    var sections = document.querySelectorAll('section[id]');
    var navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveNavLink() {
        var scrollPos = window.scrollY + 100;
        var currentId = '';

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.getAttribute('id');
            }
        });

        navLinkEls.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === '#' + currentId) {
                link.style.color = 'var(--text-primary)';
            } else {
                link.style.color = '';
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });

})();
