// scripts/check-node-version.mjs
// Non-blocking check for Node.js updates, runs before 'npm run dev'.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = path.join(__dirname, '..', '.node-version-cache.json');
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Helper to compare semver versions (e.g., "v24.14.0" vs "v24.22.1")
function semverLt(current, target) {
  const c = current.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  const t = target.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if (c[i] < t[i]) return true;
    if (c[i] > t[i]) return false;
  }
  return false;
}

function parseMajor(versionStr) {
  const match = versionStr.match(/^v?(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

async function getReleases() {
  // Check local cache first
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      if (Date.now() - cache.timestamp < CACHE_TTL_MS && Array.isArray(cache.data)) {
        return cache.data;
      }
    } catch {
      // Ignore cache read errors
    }
  }

  // Fetch from official Node.js distribution list with a 2.5s timeout
  const res = await fetch('https://nodejs.org/dist/index.json', {
    signal: AbortSignal.timeout(2500)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  // Save to cache
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Ignore cache write errors
  }

  return data;
}

async function check() {
  const current = process.version; // e.g. "v24.14.0"
  const currentMajor = parseMajor(current);

  try {
    const releases = await getReleases();
    if (!Array.isArray(releases) || releases.length === 0) return;

    // Filter releases in the same major branch (e.g. v24.x)
    const inMajor = releases.filter(r => parseMajor(r.version) === currentMajor);
    const latestInMajor = inMajor[0];

    // Check if any newer release in this branch has a security patch
    const hasSecurityPatch = inMajor.some(
      r => semverLt(current, r.version) && r.security === true
    );

    // Also get the overall latest LTS
    const latestLts = releases.find(r => r.lts);

    const isBehindBranch = latestInMajor && semverLt(current, latestInMajor.version);

    if (isBehindBranch) {
      // Terminal alert banner
      const title = hasSecurityPatch
        ? '🚨 CRITICAL NODE.JS SECURITY UPDATE AVAILABLE'
        : '⚠️  NODE.JS UPDATE AVAILABLE';
      
      const borderColor = hasSecurityPatch ? '\x1b[31;1m' : '\x1b[33;1m'; // Red or Yellow
      const reset = '\x1b[0m';
      const bold = '\x1b[1m';
      const cyan = '\x1b[36m';
      const green = '\x1b[32m';

      // Ring terminal bell
      process.stdout.write('\x07');

      console.log('\n' + borderColor + '╔════════════════════════════════════════════════════════════════════════════╗' + reset);
      console.log(borderColor + '║ ' + bold + title.padEnd(74) + borderColor + ' ║' + reset);
      console.log(borderColor + '╠════════════════════════════════════════════════════════════════════════════╣' + reset);
      console.log(borderColor + '║ ' + reset + `Current Installed : ${bold}${current}${reset}`.padEnd(83) + borderColor + ' ║' + reset);
      console.log(borderColor + '║ ' + reset + `Latest In Branch  : ${green}${latestInMajor.version}${reset} (${latestInMajor.date})`.padEnd(83) + borderColor + ' ║' + reset);
      if (hasSecurityPatch) {
        console.log(borderColor + '║ ' + '\x1b[31;1m' + 'Status            : Contains HIGH/CRITICAL security patches!'.padEnd(74) + borderColor + ' ║' + reset);
      }
      if (latestLts && parseMajor(latestLts.version) !== currentMajor) {
        console.log(borderColor + '║ ' + reset + `Latest LTS Line   : ${latestLts.version} (${latestLts.lts})`.padEnd(83) + borderColor + ' ║' + reset);
      }
      console.log(borderColor + '║                                                                            ║' + reset);
      console.log(borderColor + '║ ' + bold + 'How to upgrade:' + ' '.repeat(59) + borderColor + ' ║' + reset);
      console.log(borderColor + '║ ' + cyan + '  • Windows: winget upgrade OpenJS.NodeJS' + ' '.repeat(34) + borderColor + ' ║' + reset);
      console.log(borderColor + '║ ' + cyan + '  • Web:     https://nodejs.org/en/download' + ' '.repeat(31) + borderColor + ' ║' + reset);
      console.log(borderColor + '╚════════════════════════════════════════════════════════════════════════════╝\n' + reset);

      // Brief pause so the developer sees the alert before concurrently starts streaming server logs
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
  } catch (err) {
    // Fail silently so development is never blocked if offline or slow
  }
}

await check();
process.exit(0);
