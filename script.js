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
            document.body.classList.toggle('nav-is-open', isOpen);
        });

        var navLinks = navMenu.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-is-open');
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-is-open');
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

    // --- Contact Form Client-Side Validation ---
    var form = document.querySelector('.contact-form');

    if (form) {
        form.setAttribute('novalidate', '');

        form.addEventListener('submit', function (e) {
            var firstInvalid = null;
            var inputs = form.querySelectorAll('input[required]');

            var errorMsgs = form.querySelectorAll('.form-error');
            for (var j = 0; j < errorMsgs.length; j++) {
                errorMsgs[j].remove();
            }
            var errorInputs = form.querySelectorAll('.input-error');
            for (var k = 0; k < errorInputs.length; k++) {
                errorInputs[k].classList.remove('input-error');
            }

            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];

                if (input.type === 'radio') {
                    var groupName = input.name;
                    var groupChecked = form.querySelector('input[name="' + groupName + '"]:checked');
                    if (!groupChecked) {
                        var fieldset = input.closest('.form-fieldset');
                        if (fieldset && !fieldset.querySelector('.form-error')) {
                            var error = document.createElement('p');
                            error.className = 'form-error';
                            error.setAttribute('role', 'alert');
                            error.textContent = 'Please select an option.';
                            fieldset.appendChild(error);
                            if (!firstInvalid) firstInvalid = input;
                        }
                    }
                } else {
                    if (!input.value.trim() || !input.checkValidity()) {
                        input.classList.add('input-error');
                        var group = input.closest('.form-group');
                        if (group && !group.querySelector('.form-error')) {
                            var msg = document.createElement('p');
                            msg.className = 'form-error';
                            msg.setAttribute('role', 'alert');
                            if (!input.value.trim()) {
                                msg.textContent = 'This field is required.';
                            } else if (input.type === 'email') {
                                msg.textContent = 'Please enter a valid email address.';
                            } else {
                                msg.textContent = 'Please check this field.';
                            }
                            group.appendChild(msg);
                        }
                        if (!firstInvalid) firstInvalid = input;
                    }
                }
            }

            if (firstInvalid) {
                e.preventDefault();
                firstInvalid.focus();
            }

            // PLACEHOLDER: Remove this preventDefault once a real form handler is configured
            e.preventDefault();
        });
    }
})();
