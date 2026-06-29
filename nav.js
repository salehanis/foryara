(function () {
    // ── Bottom tab bar ──
    var tabs = [
        { href: 'index.html',     icon: '🏠', label: 'Home' },
        { href: 'vent.html',      icon: '📓', label: 'Vent' },
        { href: 'selfcare.html',  icon: '🍵', label: 'Care' },
        { href: 'countdown.html', icon: '💛', label: 'Us' },
        { href: 'log.html',       icon: '📊', label: 'Log' },
    ];

    var current = window.location.pathname.split('/').pop() || 'index.html';

    var nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.setAttribute('aria-label', 'Main navigation');
    nav.innerHTML = tabs.map(function (t) {
        var active = current === t.href;
        return '<a href="' + t.href + '" class="bnav-item' + (active ? ' bnav-active' : '') + '"' +
            ' aria-label="' + t.label + '"' +
            ' aria-current="' + (active ? 'page' : 'false') + '">' +
            '<span class="bnav-icon" aria-hidden="true">' + t.icon + '</span>' +
            '<span class="bnav-label">' + t.label + '</span>' +
            '</a>';
    }).join('');
    document.body.appendChild(nav);

    // ── Offline banner ──
    var banner = document.createElement('div');
    banner.className = 'offline-banner';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.textContent = '📡 no connection — changes will sync when you\'re back online';
    document.body.appendChild(banner);

    function updateOnline() {
        var online = navigator.onLine;
        banner.classList.toggle('offline-show', !online);
    }

    window.addEventListener('online', function () {
        banner.classList.remove('offline-show');
        if (typeof window.toast === 'function') window.toast('Back online ✓', 'success');
    });
    window.addEventListener('offline', function () {
        banner.classList.add('offline-show');
    });
    updateOnline();

    // ── Swipe right from left edge → go back ──
    var touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
        if (dx > 90 && touchStartX < 44 && dy < 60 && current !== 'index.html') {
            history.back();
        }
    }, { passive: true });
})();
