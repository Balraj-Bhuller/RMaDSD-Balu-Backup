(function () {
    'use strict';

    var bootLines = [
        '> INITIALIZING CORE SYSTEMS...',
        '> LOADING NEURAL INTERFACE...',
        '> CALIBRATING HUD MODULES...',
        '> ESTABLISHING SECURE LINK...',
        '> ALL SYSTEMS NOMINAL'
    ];

    // Hide main content immediately when script is parsed
    document.documentElement.classList.add('boot-active');

    document.addEventListener('DOMContentLoaded', function () {
        var bootScreen = document.getElementById('boot-screen');
        var textSequence = document.getElementById('boot-text-sequence');
        var progressFill = document.getElementById('boot-progress-fill');
        var percentageEl = document.getElementById('boot-percentage');
        var finalText = document.getElementById('boot-final');

        if (!bootScreen) return;

        var progressDuration = 2800;
        var lineStartDelay = 300;
        var lineInterval = 500;
        var pauseAfterComplete = 400;
        var fadeOutDuration = 600;

        var startTime = null;

        // Smoothly animate the progress bar and percentage counter
        function animateProgress(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / progressDuration, 1);
            var pct = Math.floor(progress * 100);
            progressFill.style.width = pct + '%';
            percentageEl.textContent = pct + '%';
            if (progress < 1) {
                requestAnimationFrame(animateProgress);
            }
        }

        requestAnimationFrame(animateProgress);

        // Show boot text lines one by one
        bootLines.forEach(function (line, i) {
            setTimeout(function () {
                var el = document.createElement('div');
                el.className = 'boot-line';
                el.textContent = line;
                textSequence.appendChild(el);
            }, lineStartDelay + i * lineInterval);
        });

        // Ensure progress shows 100% and reveal final text
        setTimeout(function () {
            progressFill.style.width = '100%';
            percentageEl.textContent = '100%';
            finalText.classList.add('visible');
        }, progressDuration);

        // Fade out boot screen and reveal main content
        setTimeout(function () {
            bootScreen.classList.add('boot-fade-out');
            document.documentElement.classList.remove('boot-active');
        }, progressDuration + pauseAfterComplete);

        // Remove boot screen from layout after fade-out completes
        setTimeout(function () {
            bootScreen.style.display = 'none';
        }, progressDuration + pauseAfterComplete + fadeOutDuration);
    });
}());
