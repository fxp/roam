/**
 * Language switcher component for AI-Buzzwords articles.
 *
 * Usage in any HTML article:
 *   <div data-lang-switcher data-slug="white-collar"></div>
 *   <script src="/AI-Buzzwords/lang-switcher.js" defer></script>
 *
 * The script:
 *   1. Reads /config/languages.json to know which languages exist site-wide
 *   2. Reads <slug>.meta.json sibling file to know which translations exist for this article
 *   3. Renders [ ZH | EN | ... ] buttons in any element with [data-lang-switcher]
 *   4. Highlights current language based on URL filename suffix
 *   5. On click, navigates to corresponding language while preserving #hash
 *
 * Designed to be config-driven: adding a new language to languages.json + meta.json
 * shows it immediately without code changes.
 */
(function () {
  'use strict';

  // Inject minimal CSS once
  const STYLE_ID = 'lang-switcher-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      [data-lang-switcher] {
        display: inline-flex;
        gap: 1px;
        font-family: var(--mono, 'JetBrains Mono', ui-monospace, monospace);
        font-size: 10px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        background: var(--bg-2, rgba(0,0,0,0.04));
        border: 1px solid var(--line-bright, rgba(0,0,0,0.18));
        border-radius: 2px;
        overflow: hidden;
      }
      [data-lang-switcher] a, [data-lang-switcher] span {
        padding: 4px 10px;
        text-decoration: none;
        color: var(--fg-mute, inherit);
        opacity: 0.85;
        transition: color 0.15s, background 0.15s, opacity 0.15s;
        background: transparent;
        cursor: pointer;
        white-space: nowrap;
      }
      [data-lang-switcher] a:hover {
        opacity: 1;
        color: var(--accent, currentColor);
        background: var(--accent-soft, transparent);
      }
      [data-lang-switcher] [aria-current="true"] {
        opacity: 1;
        color: var(--accent, currentColor);
        background: var(--accent-soft, rgba(232,64,64,0.18));
        cursor: default;
      }
      [data-lang-switcher] .ls-divider {
        padding: 0;
        width: 1px;
        background: var(--line-bright, rgba(0,0,0,0.18));
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function parseSlug(pathname) {
    // /deepdive/labor-day-2026/white-collar.cn.html  -> { dir, slug, suffix }
    const file = pathname.split('/').pop() || '';
    const m = file.match(/^(.+?)(\.[a-z]{2}(?:-[a-z]{2,4})?)?\.html$/i);
    if (!m) return null;
    return {
      dir: pathname.substring(0, pathname.lastIndexOf('/') + 1),
      slug: m[1],
      suffix: m[2] || '',
    };
  }

  function suffixToLangCode(suffix, languages) {
    // '' -> default language code; '.en' -> 'en'; '.cn' -> 'zh-cn'
    if (!suffix) {
      const def = languages.find((l) => l.default);
      return def ? def.code : null;
    }
    const found = languages.find((l) => l.filename_suffix === suffix);
    return found ? found.code : null;
  }

  async function fetchJSON(url) {
    try {
      const r = await fetch(url, { cache: 'no-cache' });
      if (!r.ok) return null;
      return await r.json();
    } catch (_) {
      return null;
    }
  }

  function findConfigPath() {
    // Walk up from current path to find /config/languages.json
    // GitHub Pages serves under /AI-Buzzwords/, plain GitHub Pages root is /
    const path = location.pathname;
    if (path.startsWith('/AI-Buzzwords/')) return '/AI-Buzzwords/config/languages.json';
    if (path.startsWith('/blog/ai-buzzwords/')) return '/blog/ai-buzzwords/config/languages.json';
    return '/config/languages.json';
  }

  function basePath() {
    const p = location.pathname;
    if (p.startsWith('/AI-Buzzwords/')) return '/AI-Buzzwords';
    if (p.startsWith('/blog/ai-buzzwords/')) return '/blog/ai-buzzwords';
    return '';
  }

  async function render(container) {
    const slug = container.dataset.slug;
    if (!slug) return;

    const config = await fetchJSON(findConfigPath());
    if (!config || !config.languages) return;

    const here = parseSlug(location.pathname);
    if (!here) return;

    const currentLangCode = suffixToLangCode(here.suffix, config.languages);

    // Try to read meta.json to know which translations actually exist
    const metaUrl = here.dir + here.slug + '.meta.json';
    const meta = await fetchJSON(metaUrl);
    const availableLangs = (meta && meta.languages) || [config.default_language];

    // Build buttons for each language that's both configured AND available for this article
    const items = config.languages
      .filter((l) => availableLangs.includes(l.code))
      .filter((l) => !l.is_edition_of); // editions (e.g. tactful CN) shown separately, not in main switcher

    if (items.length < 2) {
      // Only one language available — hide switcher
      container.style.display = 'none';
      return;
    }

    container.innerHTML = '';
    items.forEach((lang, i) => {
      if (i > 0) {
        const div = document.createElement('span');
        div.className = 'ls-divider';
        container.appendChild(div);
      }
      const target = here.dir + here.slug + lang.filename_suffix + '.html' + location.hash;
      if (lang.code === currentLangCode) {
        const span = document.createElement('span');
        span.setAttribute('aria-current', 'true');
        span.textContent = lang.code.toUpperCase();
        span.title = lang.name;
        container.appendChild(span);
      } else {
        const a = document.createElement('a');
        a.href = target;
        a.textContent = lang.code.toUpperCase();
        a.title = lang.name;
        container.appendChild(a);
      }
    });

    // Also offer edition (tactful) link if current language has one
    const editions = config.languages.filter((l) => l.is_edition_of === currentLangCode);
    if (editions.length > 0) {
      // Render editions as pill links after the main switcher
      const wrap = container.parentElement;
      editions.forEach((ed) => {
        if (!availableLangs.includes(ed.code)) return;
        const pill = document.createElement('a');
        pill.href = here.dir + here.slug + ed.filename_suffix + '.html' + location.hash;
        pill.textContent = ed.name;
        pill.style.cssText =
          'margin-left:8px;font-size:10px;font-family:JetBrains Mono,ui-monospace,monospace;color:#7fb88b;border:1px solid rgba(127,184,139,0.4);padding:2px 8px;border-radius:2px;text-decoration:none;letter-spacing:0.05em;';
        wrap.appendChild(pill);
      });
    }
  }

  function init() {
    document.querySelectorAll('[data-lang-switcher]').forEach(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
