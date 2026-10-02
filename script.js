/* ============================================
   Arizona Advanced Psychiatric Care — Script
   Progressive enhancement only.
   Site is fully usable with JS disabled.
   ============================================ */

(function () {
    'use strict';

    // Signal that JS is available
    document.documentElement.classList.add('js');

    // Check if user prefers reduced motion
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Mobile Navigation Toggle ---
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });

        var navLinks = navMenu.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open menu');
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Tab' && navMenu.classList.contains('is-open')) {
                var lastLink = navLinks[navLinks.length - 1];
                if (e.shiftKey && document.activeElement === navToggle) {
                    e.preventDefault(); lastLink.focus();
                } else if (!e.shiftKey && document.activeElement === lastLink) {
                    e.preventDefault(); navToggle.focus();
                }
            }

            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open menu');
                navToggle.focus();
            }
        });
    }

    // --- Scroll Reveal Animations ---
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {

        // Mark elements for reveal
        var revealSections = document.querySelectorAll('.section-header, .hero-content');
        var revealCards = document.querySelectorAll('.condition-card, .step, .option-card, .insurance-card, .faq-item');
        var revealBlocks = document.querySelectorAll('.about-bio, .about-credentials, .form-shell, .contact-info');

        // Apply initial hidden state via class (not inline style, so no-JS stays clean)
        function markForReveal(elements, stagger) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.add('reveal');
                if (stagger) {
                    // Stagger within groups that share a parent
                    var parent = elements[i].parentElement;
                    var siblings = parent.querySelectorAll('.reveal');
                    var index = 0;
                    for (var j = 0; j < siblings.length; j++) {
                        if (siblings[j] === elements[i]) { index = j; break; }
                    }
                    elements[i].style.transitionDelay = (index * 60) + 'ms';
                }
            }
        }

        markForReveal(revealSections, false);
        markForReveal(revealCards, true);
        markForReveal(revealBlocks, false);

        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('revealed');
                    observer.unobserve(entries[i].target);
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        var allRevealElements = document.querySelectorAll('.reveal');
        for (var r = 0; r < allRevealElements.length; r++) {
            observer.observe(allRevealElements[r]);
        }
    }

})();
