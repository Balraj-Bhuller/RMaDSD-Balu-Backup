/* ============================================
   RMaDSD-Balu // Navigation & Terminal Logic
   ============================================ */
(function () {
    'use strict';

    /* --- Section registry --- */
    var SECTIONS = [
        { id: 'mission-briefing',  label: 'MISSION BRIEFING',    hash: 'mission-briefing' },
        { id: 'arsenal',           label: 'ARSENAL & RESOURCES',  hash: 'arsenal' },
        { id: 'field-operations',  label: 'FIELD OPERATIONS',     hash: 'field-operations' },
        { id: 'mission-debrief',   label: 'MISSION DEBRIEF',      hash: 'mission-debrief' }
    ];

    var DEFAULT_SECTION = 'mission-briefing';

    /* Terminal lines for forward navigation */
    var TERMINAL_LINES_FWD = [
        '> ACCESSING SECTION: {SECTION}...',
        '> DECRYPTING DATA PACKETS...',
        '> RENDERING INTERFACE...',
        '> ACCESS GRANTED'
    ];

    /* Terminal lines for back navigation */
    var TERMINAL_LINES_BACK = [
        '> RETURNING TO BASE...',
        '> CONNECTION CLEARED'
    ];

    /* --- Helpers --- */
    function getSectionById(id) {
        for (var i = 0; i < SECTIONS.length; i++) {
            if (SECTIONS[i].id === id) return SECTIONS[i];
        }
        return SECTIONS[0];
    }

    function getHashSection() {
        var hash = window.location.hash.replace('#', '');
        for (var i = 0; i < SECTIONS.length; i++) {
            if (SECTIONS[i].hash === hash) return SECTIONS[i].id;
        }
        return DEFAULT_SECTION;
    }

    /* --- Show section (no animation) --- */
    function showSection(sectionId) {
        document.querySelectorAll('.section-page').forEach(function (s) {
            s.classList.remove('active');
        });

        var target = document.getElementById('section-' + sectionId);
        if (target) {
            target.classList.add('active');
            target.scrollTop = 0;
        }

        /* Sync nav links */
        document.querySelectorAll('.nav-link[data-section]').forEach(function (link) {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
        document.querySelectorAll('.mobile-nav-link[data-section]').forEach(function (link) {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        /* Back button visibility */
        var backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.classList.toggle('hidden', sectionId === DEFAULT_SECTION);
        }
    }

    /* --- Terminal overlay animation --- */
    function runTerminal(sectionId, lines, lineDelay, callback) {
        var overlay = document.getElementById('terminal-overlay');
        var body   = document.getElementById('terminal-body');
        if (!overlay || !body) { callback(); return; }

        var label = getSectionById(sectionId).label;

        body.innerHTML = '';
        overlay.classList.remove('fade-out');
        overlay.classList.add('active');

        lines.forEach(function (text, i) {
            setTimeout(function () {
                var line = document.createElement('div');
                line.className = 'terminal-line';
                var content = text.replace('{SECTION}', label);
                /* Blinking cursor on last line */
                if (i === lines.length - 1) {
                    content += '<span class="terminal-cursor">_</span>';
                }
                line.innerHTML = content;
                body.appendChild(line);
            }, i * lineDelay);
        });

        /* Fade out overlay after all lines shown */
        var total = lines.length * lineDelay + 220;
        setTimeout(function () {
            overlay.classList.add('fade-out');
            setTimeout(function () {
                overlay.classList.remove('active', 'fade-out');
                callback();
            }, 300);
        }, total);
    }

    /* --- Animated navigation --- */
    function navigateTo(sectionId, pushState) {
        var isBack   = (sectionId === DEFAULT_SECTION);
        var lines    = isBack ? TERMINAL_LINES_BACK : TERMINAL_LINES_FWD;
        var delay    = isBack ? 280 : 320;  /* ms per line */

        if (pushState) {
            history.pushState({ section: sectionId }, '', '#' + getSectionById(sectionId).hash);
        }

        runTerminal(sectionId, lines, delay, function () {
            showSection(sectionId);
        });
    }

    /* --- Desktop nav link clicks --- */
    document.querySelectorAll('.nav-link[data-section]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            closeMobileNav();
            navigateTo(link.dataset.section, true);
        });
    });

    /* --- Mobile nav link clicks --- */
    document.querySelectorAll('.mobile-nav-link[data-section]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            closeMobileNav();
            navigateTo(link.dataset.section, true);
        });
    });

    /* --- Back button --- */
    var backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            navigateTo(DEFAULT_SECTION, true);
        });
    }

    /* --- Hamburger / Mobile nav --- */
    var mobileNav     = document.getElementById('mobile-nav');
    var mobileOverlay = document.getElementById('mobile-nav-overlay');

    function openMobileNav() {
        if (mobileNav)     mobileNav.classList.add('open');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        document.body.classList.add('nav-open');
    }

    function closeMobileNav() {
        if (mobileNav)     mobileNav.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    var hamburgerBtn  = document.getElementById('hamburger-btn');
    var mobileClose   = document.getElementById('mobile-nav-close');

    if (hamburgerBtn)  hamburgerBtn.addEventListener('click', openMobileNav);
    if (mobileClose)   mobileClose.addEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

    /* --- Browser back/forward --- */
    window.addEventListener('popstate', function (e) {
        var id = (e.state && e.state.section) ? e.state.section : getHashSection();
        showSection(id);
    });

    /* --- Init --- */
    function init() {
        var initial = getHashSection();
        history.replaceState({ section: initial }, '', '#' + getSectionById(initial).hash);
        showSection(initial);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
