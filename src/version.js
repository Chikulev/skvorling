// Single source of truth for Skvorling version across Popup, Dashboard, Demo, and Landing (including GitHub Pages).
(function (root) {
  'use strict';

  const FALLBACK_VERSION = '2.7.0';

  function getSkvorlingVersion() {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getManifest === 'function') {
        const m = chrome.runtime.getManifest();
        if (m && m.version) return m.version;
      }
    } catch (_) {}
    return FALLBACK_VERSION;
  }

  function hydrateVersionBadges() {
    const ver = getSkvorlingVersion();
    document.querySelectorAll('[data-skvorling-version]').forEach((el) => {
      const prefix = el.dataset.prefix !== undefined ? el.dataset.prefix : 'v';
      el.textContent = prefix + ver;
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hydrateVersionBadges);
    } else {
      hydrateVersionBadges();
    }
  }

  root.SKVORLING_VERSION = FALLBACK_VERSION;
  root.getSkvorlingVersion = getSkvorlingVersion;
})(typeof globalThis !== 'undefined' ? globalThis : this);
