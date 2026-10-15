// Finds a local Chromium-based browser for the checks. Set CHROME_PATH to override.
import fs from 'node:fs';

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
