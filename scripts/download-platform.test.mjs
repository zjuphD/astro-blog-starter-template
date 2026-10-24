import test from 'node:test';
import assert from 'node:assert/strict';
import { detectDesktopPlatform, downloadPageHref } from '../public/download-platform.js';

test('Windows visitors get the Windows destination, including Chromium platform hints', () => {
  assert.equal(detectDesktopPlatform({ platform: 'Win32', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }), 'windows');
  assert.equal(detectDesktopPlatform({ userAgentData: { platform: 'Windows' } }), 'windows');
  assert.equal(downloadPageHref('windows'), '/download?platform=windows');
});
test('Mac is detected as an OS without pretending to identify its chip', () => {
  assert.equal(detectDesktopPlatform({ platform: 'MacIntel', maxTouchPoints: 0 }), 'macos');
  assert.equal(detectDesktopPlatform({ userAgentData: { platform: 'macOS' } }), 'macos');
});
test('phones, iPad desktop mode, Linux and unknown clients are never sent to a guessed Mac installer', () => {
  for (const nav of [
    { platform: 'MacIntel', maxTouchPoints: 5, userAgent: 'Macintosh' },
    { platform: 'iPhone', userAgent: 'iPhone; CPU iPhone OS 18 like Mac OS X' },
    { userAgentData: { platform: 'Android' }, userAgent: 'Linux; Android 15' },
    { platform: 'Linux x86_64' }, {},
  ]) assert.equal(detectDesktopPlatform(nav), null);
  assert.equal(downloadPageHref(null), '/download');
});
test('only the two supported platform choices can be put into links, with explicit English navigation', () => {
  assert.equal(downloadPageHref('macos', true), '/download?platform=macos&lang=en');
  assert.equal(downloadPageHref('linux', true), '/download?lang=en');
  assert.equal(downloadPageHref('https://other.example'), '/download');
});
