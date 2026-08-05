/* ============================================
   AZ Advanced Care — Script
   Progressive enhancement only.
   Site is fully usable with JS disabled.
   ============================================ */

(function () {
    'use strict';

    // Signal that JS is available
    document.documentElement.classList.add('js');

    // --- Mobile Navigation Toggle ---
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-is-open', isOpen);
        });

        // Close menu when a nav link is clicked
        var navLinks = navMenu.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-is-open');
            });
        }

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-is-open');
                navToggle.focus();
            }
        });
    }

    // --- Contact Form Client-Side Validation ---
    var form = document.querySelector('.contact-form');

    if (form) {
        form.setAttribute('novalidate', '');

        form.addEventListener('submit', function (e) {
            var firstInvalid = null;
            var inputs = form.querySelectorAll('input[required]');

            // Clear previous error states
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
                    // Validate radio group
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
