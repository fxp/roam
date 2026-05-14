/**
 * Light / Dark mode toggle for AI Buzzwords pages.
 *
 * Usage in any page:
 *   <button data-toggle-mode aria-label="切换浅色/暗色">
 *     <span data-mode-icon>◐</span>
 *     <span data-mode-label>暗色</span>
 *   </button>
 *   <script src="/AI-Buzzwords/mode-toggle.js" defer></script>
 *
 * The script:
 *   1. Restores saved mode from localStorage (key: ai-bw-mode) on first paint
 *   2. Toggles <html data-mode="light|"> on click
 *   3. Persists to localStorage
 *   4. Respects prefers-color-scheme on first visit (defaults dark)
 *
 * Honored everywhere colors_and_type.css is loaded — that file declares the
 * parchment palette under [data-mode="light"] / [data-theme="light"].
 */
(function () {
  'use strict';
  const KEY = 'ai-bw-mode';
  const root = document.documentElement;

  function pickInitialMode() {
    const saved = (() => { try { return localStorage.getItem(KEY); } catch (_) { return null; } })();
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function apply(mode) {
    if (mode === 'light') {
      root.setAttribute('data-mode', 'light');
    } else {
      root.removeAttribute('data-mode');
    }
    document.querySelectorAll('[data-mode-icon]').forEach((el) => {
      el.textContent = mode === 'light' ? '◑' : '◐';
    });
    // Label: use button's data-label-light / data-label-dark if provided,
    // otherwise infer from <html lang> ('en*' → English, else Chinese).
    const isEN = (document.documentElement.lang || '').toLowerCase().startsWith('en');
    document.querySelectorAll('[data-mode-label]').forEach((el) => {
      const btn = el.closest('[data-toggle-mode]');
      const lightLabel = (btn && btn.dataset.labelLight) || (isEN ? 'Light' : '浅色');
      const darkLabel  = (btn && btn.dataset.labelDark)  || (isEN ? 'Dark'  : '暗色');
      el.textContent = mode === 'light' ? lightLabel : darkLabel;
    });
    document.querySelectorAll('[data-toggle-mode]').forEach((el) => {
      el.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
    });
  }

  function init() {
    const initial = pickInitialMode();
    apply(initial);
    document.querySelectorAll('[data-toggle-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = root.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (_) {}
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
