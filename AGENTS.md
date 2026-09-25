# Projects Root Guidelines & System Architecture

## Multi-Machine Environment (Desktop & Mini PC)
- **Primary Desktop**: Main Windows PC where development, testing, and agent pairing occur.
- **Always-On Mini PC**: 24/7 host running Plex Media Server in Tailscale exit node mode. Runs scheduled crawlers via Windows Task Scheduler.
- **Sync Protocol**: Push from Desktop, pull on Mini PC (`git pull`). Automated background jobs on the Mini PC must never push to GitHub code branches to prevent merge conflicts.

## Ecosystem Overview
- **`live-music-search-agent`**:
  - 10 discovery crawlers looking for new music releases.
  - Automatically diffs and emails results.
  - Generates local dashboard: `view_dashboard.bat` -> `dashboard.html`.
  - Pushes telemetry to GitHub Gist: `https://gist.github.com/thewayrider/9d9f324ab82907243f576f71ca001523`.
  - Secrets stored exclusively in `configs/secrets.json` (gitignored).
- **`NewIndieFriday`**:
  - Public discovery destination (`streamusique.com`) with Sanity Studio.
- **`live-music-crawler-monitor-android`**:
  - Independent mobile monitoring app reading telemetry from GitHub Gist.
  - Built with Jetpack Compose + Material 3, 100% FOSS compliant for F-Droid.
