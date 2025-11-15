(function () {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('panelToggle');
    const closeBtn = document.getElementById('panelClose');
    const body = document.body;

    const MOBILE_BREAKPOINT = 768;

    function isMobile() {
        return window.innerWidth < MOBILE_BREAKPOINT;
    }

    function openPanel() {
        sidebar.classList.add('open');
        body.classList.add('panel-open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function closePanel() {
        sidebar.classList.remove('open');
        body.classList.remove('panel-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function initState() {
        if (isMobile()) {
            closePanel();
            toggle.style.display = 'flex';
        } else {
            sidebar.classList.remove('open');
            body.classList.remove('panel-open');
            toggle.style.display = 'none';
        }
    }

    // Event listeners
    toggle.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);

    // Close panel when user applies config (mobile only)
    document.getElementById('applyBtn').addEventListener('click', () => {
        if (isMobile()) {
            setTimeout(closePanel, 300);
        }
    });

    // Close panel on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobile() && sidebar.classList.contains('open')) {
            closePanel();
        }
    });

    // Close panel when clicking outside (mobile only)
    document.addEventListener('click', (e) => {
        if (isMobile() && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                closePanel();
            }
        }
    });

    // Respond to window resize
    window.addEventListener('resize', initState);

    // Initial setup
    initState();
})();