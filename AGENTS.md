# Projects Root Guidelines & System Architecture

## Multi-Machine Environment (Desktop & Mini PC)
- **Primary Desktop**: Main Windows PC where development, testing, and agent pairing occur.
- **Always-On Mini PC**: 24/7 host running Plex Media Server in Tailscale exit node mode. Runs scheduled crawlers via Windows Task Scheduler.
- **Sync Protocol**: Push from Desktop, pull on Mini PC (`git pull`). Automated background jobs on the Mini PC must never push to GitHub code branches to prevent merge conflicts.
  - *Note*: Git sync is ONLY for codebase changes. Sanity content updates do not require Git; they pull directly from the cloud.

## Ecosystem Overview
- **`music-search-master`**:
  - 10+ discovery crawlers and radars looking for new music releases.
  - Automatically diffs and emails results.
  - Generates local dashboard: `dashboard.html` / Fleet Command Center.
  - Pushes telemetry to GitHub Gist: `https://gist.github.com/thewayrider/9d9f324ab82907243f576f71ca001523`.
  - Secrets stored exclusively in `configs/secrets.json` (gitignored).
- **`NewIndieFriday`**:
  - Public discovery destination (`streamusique.com`) with Sanity Studio.
  - **Content Workflow**: Sanity Studio is deployed to `https://newindiefriday.sanity.studio/`. Updates automatically trigger Vercel rebuilds via webhook. No local dev server or `git push` is required for data entry.
- **`live-music-crawler-monitor-android`**:
  - Independent mobile monitoring app reading telemetry from GitHub Gist.
  - Built with Jetpack Compose + Material 3, 100% FOSS compliant for F-Droid.

## Future / Travel Environments
- **Chromebook Remote Setup (KL Trip)**: Target architecture for mobile development on an Acer Chromebook, leveraging the always-on Mini PC via Tailscale or cloud-based IDEs to maintain access to all projects.

## Android Debian VM & Deployment Notes (`NewIndieFriday`)
- **Frontend (`frontend/`)**:
  - Shared storage (`/storage/emulated/10`) uses `virtiofs`, which blocks `.bin` symlinks. Install with `npm install --no-bin-links --cache "$HOME/.cache/projects/frontend/npm"`.
  - Run dev/build directly via Node: `node ./node_modules/@react-router/dev/bin.js dev --host 0.0.0.0 --port 5173` (or `build`). If Vite HMR doesn't pick up edits across `virtiofs`, restart the dev server.
  - Note: With `ssr: false` and `prerender()`, non-prerendered temporary routes cannot export `loader`/`clientLoader` (use `useEffect` fetch instead).
- **Sanity Studio (`studio/`)**:
  - Copy Studio source files (`package.json`, `package-lock.json`, `sanity.cli.js`, `sanity.config.js`, `schemaTypes`, `actions`, `components`, `static`) to the VM's native `ext4` disk (`~/nif-studio`) with `ulimit -n 65536`, then run `npm install --legacy-peer-deps`, `npx sanity login`, and `npx sanity deploy` to avoid `virtiofs` stalls and `EMFILE` open-file limits.
  - **Curation Schema (`studio/schemaTypes/homePage.js`)**: Keeps `name: 'homePage'` for data compatibility, titled **`Song Pool`** in Studio, and holds `spotifyPlaylistUrl` (`Weekly Pool Songs`) + `standoutSongs` (`Standout Songs`).
