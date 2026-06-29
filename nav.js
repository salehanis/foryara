(function () {
    const tabs = [
        { href: 'index.html',     icon: '🏠', label: 'Home' },
        { href: 'vent.html',      icon: '📓', label: 'Vent' },
        { href: 'selfcare.html',  icon: '🍵', label: 'Care' },
        { href: 'countdown.html', icon: '💛', label: 'Us' },
        { href: 'log.html',       icon: '📊', label: 'Log' },
    ];

    const current = window.location.pathname.split('/').pop() || 'index.html';

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.setAttribute('aria-label', 'Main navigation');
    nav.innerHTML = tabs.map(t => `
        <a href="${t.href}" class="bnav-item${current === t.href ? ' bnav-active' : ''}" aria-label="${t.label}" aria-current="${current === t.href ? 'page' : 'false'}">
            <span class="bnav-icon" aria-hidden="true">${t.icon}</span>
            <span class="bnav-label">${t.label}</span>
        </a>`).join('');

    document.body.appendChild(nav);
})();
