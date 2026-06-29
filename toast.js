(function () {
    // ── Toast notifications ──
    function getWrap() {
        let w = document.getElementById('_toast_wrap');
        if (!w) { w = document.createElement('div'); w.id = '_toast_wrap'; document.body.appendChild(w); }
        return w;
    }

    window.toast = function (msg, type, duration) {
        type = type || 'success';
        duration = duration || 3200;
        const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠️' };
        const t = document.createElement('div');
        t.className = 'toast toast-' + type;
        t.innerHTML = '<span class="toast-icon" aria-hidden="true">' + (icons[type] || '✓') + '</span><span>' + msg + '</span>';
        getWrap().appendChild(t);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () { t.classList.add('toast-show'); });
        });

        function remove() {
            if (!t.parentNode) return;
            t.classList.remove('toast-show');
            t.addEventListener('transitionend', function () { t.remove(); }, { once: true });
        }
        var timer = setTimeout(remove, duration);
        t.addEventListener('click', function () { clearTimeout(timer); remove(); });
    };

    // ── Custom confirm modal ──
    window.showConfirm = function (msg, onYes, yesLabel) {
        yesLabel = yesLabel || 'yes, delete';
        var overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML =
            '<div class="confirm-box">' +
                '<div class="confirm-msg">' + msg + '</div>' +
                '<div class="confirm-btns">' +
                    '<button class="confirm-no-btn">cancel</button>' +
                    '<button class="confirm-yes-btn">' + yesLabel + '</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);

        requestAnimationFrame(function () { overlay.classList.add('confirm-show'); });

        function close() {
            overlay.classList.remove('confirm-show');
            overlay.addEventListener('transitionend', function () { overlay.remove(); }, { once: true });
        }

        overlay.querySelector('.confirm-no-btn').addEventListener('click', close);
        overlay.querySelector('.confirm-yes-btn').addEventListener('click', function () { close(); onYes(); });
        overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

        // Focus the cancel button (safe default)
        overlay.querySelector('.confirm-no-btn').focus();
    };
})();
