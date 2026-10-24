/** Platform hints guide navigation; the visitor always chooses the installer. */
export function detectDesktopPlatform({ userAgent = '', platform = '', userAgentData, maxTouchPoints = 0 } = {}) {
  const hint = userAgentData?.platform || platform;
  if (/Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent) || (/Mac/i.test(hint) && maxTouchPoints > 1)) return null;
  if (/Win/i.test(hint) || /Windows NT/i.test(userAgent)) return 'windows';
  if (/Mac/i.test(hint) || /Macintosh|Mac OS X/i.test(userAgent)) return 'macos';
  return null;
}

export function downloadPageHref(platform, english = false) {
  const query = new URLSearchParams();
  if (platform === 'windows' || platform === 'macos') query.set('platform', platform);
  if (english) query.set('lang', 'en');
  return '/download' + (query.size ? '?' + query : '');
}

export function refreshHomeDownloadLinks(doc, nav) {
  const platform = detectDesktopPlatform(nav);
  const english = doc.documentElement.lang.startsWith('en');
  const targets = doc.querySelectorAll('a[data-bio-home-download], a[href="/download"]');
  for (const link of targets) {
    const primary = link.dataset.bioHomeDownload === 'primary' || Boolean(link.closest('.o-home-hero'));
    if (!link.dataset.bioHomeDownload) link.dataset.bioHomeDownload = primary ? 'primary' : 'generic';
    const label = primary && platform
      ? (english ? `Download for ${platform === 'windows' ? 'Windows' : 'macOS'}` : `下载 ${platform === 'windows' ? 'Windows' : 'macOS'} 版`)
      : (english ? 'Download BioSeeki' : '下载 BioSeeki');
    const href = downloadPageHref(primary ? platform : null, english);
    if (link.getAttribute('href') !== href) link.setAttribute('href', href);
    // Preserve the arrow/icon and the landing page's existing button structure.
    const walker = doc.createTreeWalker(link, 4);
    let node;
    while ((node = walker.nextNode())) {
      if (/下载|Download/.test(node.textContent)) {
        if (node.textContent.trim() !== label) node.textContent = label;
        break;
      }
    }
    link.removeAttribute('download');
    if (link.dataset.localDestination) link.dataset.localDestination = href;
  }
}

export function enhanceDownloadPage(doc, nav, location) {
  if (!doc.querySelector('[data-download-page]')) return;
  const english = doc.documentElement.lang.startsWith('en');
  const detected = detectDesktopPlatform(nav);
  const selected = new URLSearchParams(location.search).get('platform');
  const active = ['windows', 'macos'].includes(selected) ? selected : detected;
  for (const card of doc.querySelectorAll('[data-download-platform]')) {
    const matches = card.dataset.downloadPlatform === active;
    card.classList.toggle('is-selected', matches);
    const hint = card.querySelector('[data-platform-hint]');
    if (hint) {
      hint.hidden = !matches;
      hint.textContent = selected === active
        ? (english ? 'Your selection' : '你选择的版本')
        : (english ? 'Your current system' : '当前使用的系统');
    }
  }
  const guide = active && doc.getElementById('install-' + active);
  if (guide) guide.open = true;
}

if (typeof document !== 'undefined') {
  enhanceDownloadPage(document, navigator, location);
  refreshHomeDownloadLinks(document, navigator);
}
