(function () {
    const STORAGE_KEY = 'rol-docs-theme';

    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateIcon(isDark) {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }
    }

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark-mode', isDark);
        localStorage.setItem(STORAGE_KEY, theme);
        updateIcon(isDark);
    }

    document.addEventListener('DOMContentLoaded', function () {
        applyTheme(getPreferredTheme());

        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                const isDark = document.documentElement.classList.contains('dark-mode');
                applyTheme(isDark ? 'light' : 'dark');
            });
        }
    });
})();
