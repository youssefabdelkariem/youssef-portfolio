// Finds a local Chromium-based browser for the checks and launches it. Set CHROME_PATH to override.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export function findBrowser() {
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) { console.error('No Chrome/Edge found; set CHROME_PATH'); process.exit(2); }
  return found;
}

/**
 * Launches the browser with puppeteer. Some Edge builds hand the process off and exit, which puppeteer reports as a failed
 * launch; in that case the browser is started directly with a fresh profile and a debugging port, and puppeteer connects to it.
 */
export async function launchBrowser() {
  const executablePath = findBrowser();
  try {
    return await puppeteer.launch({ executablePath, headless: true, timeout: 20000 });
  } catch {
    const port = 9400 + Math.floor(Math.random() * 400);
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ys-browser-'));
    const child = spawn(executablePath, ['--headless=new', '--disable-gpu', '--disable-extensions', '--hide-scrollbars', '--mute-audio', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
    let browser;
    for (let i = 0; i < 60 && !browser; i++) {
      try { browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${port}` }); } catch { await new Promise((r) => setTimeout(r, 250)); }
    }
    if (!browser) { child.kill(); throw new Error('could not start a headless browser'); }
    const close = browser.close.bind(browser);
    browser.close = async () => {
      try { await close(); } catch {}
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/F', '/T', '/PID', String(child.pid)], { stdio: 'ignore' });
        // Edge can hand the browser off to another process tree that taskkill on the original pid misses; stop whatever still uses this profile.
        spawnSync('powershell', ['-NoProfile', '-Command', 'Get-CimInstance Win32_Process | Where-Object { $_.Name -eq "msedge.exe" -and $_.CommandLine -like "*' + path.basename(profile) + '*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }'], { stdio: 'ignore' });
      } else child.kill();
      try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3 }); } catch { /* the OS temp folder is cleaned later */ }
    };
    return browser;
  }
}
