# NIF — SEO / SSG Migration Resume Doc

*Pick-up point for the React Router v7 framework‑mode migration. Written July 11, 2026, to resume the week of Friday July 17. Companion to `SEO_AI_Search_Plan.md` (the full strategy + primer).*

---

## Decision (already made)

Go with **Option B** from the plan: migrate NIF's frontend from React Router **library mode** (current `BrowserRouter` + `<Routes>`) to React Router v7 **framework mode** with **`ssr: false` + prerendering (SSG)**, so real content lands in the served HTML and is visible to search engines and AI answer‑engines.

**Why Option B and not the lighter option:** Kim intends to grow NIF toward monetization once traffic justifies it, so she wants the SEO foundation done properly for the long term rather than a stop‑gap. NIF's niche — human‑curated indie/alt/surf rock with an AU/NZ lens, filling the origin‑and‑genre gap Spotify's play‑count logic ignores — is exactly the "non‑commodity" content AI search prefers to cite. Crawlable HTML is the missing foundation under that advantage.

---

## Working method (agreed)

- **Branch:** do all work on `feature/rr7-framework-mode`. Never on `main` during the migration.
- **Verify via Vercel preview:** each push to the branch builds a preview URL; test there. Merge to `main` only after the preview is confirmed good.
- **Local dev will be temporarily broken** mid‑migration (routing layer rebuilt) — expected; only affects the branch.
- **Git note:** git commands run from Kim's own terminal (the sandbox can't manage `.git` lock files reliably). Claude edits files; Kim commits/pushes.

## Publishing cadence (shapes the prerender approach)

- Kim features **1–2 songs/week, often none** — very low cadence.
- Therefore **manual redeploy after publishing is fine**; the Sanity→Vercel auto‑rebuild webhook is optional polish, not required now.
- Prerendered SSG bakes HTML at build time, so **new Sanity content appears only after a rebuild** — nothing breaks, it's just not visible until redeploy.
- The discipline that matters: **enter each release completely in Sanity** (all required fields) so build‑time loaders/prerender never choke. Loaders will also be written defensively.
- Weekly ritual: publish complete release in Sanity → trigger a rebuild → verify it appeared.

---

## The six stages (also in the task list)

1. **Branch + framework‑mode scaffold** — create branch; add `@react-router/dev` + framework deps; convert `vite.config` to the `reactRouter()` plugin; add `react-router.config.js` (`ssr:false` + `prerender` via `getStaticPaths` pulling Sanity slugs); `app/root.jsx` document shell migrated from `index.html`; `app/routes.js`. Boot the shell locally.
2. **Port routes to modules with loaders** — home (Hero+Releases), new‑releases listing + `/page/:page`, release detail (`:slug`, keep LikeDislike), spotlight listing + detail, about, old sessions. Move Sanity fetches into build‑time loaders. Preserve Header/Footer/Song Search.
3. **Per‑page metadata + JSON‑LD** — unique title/description, Open Graph/Twitter cards, canonical, and JSON‑LD (`MusicRecording`/`Article`/`Organization`) per route using **React 19 native metadata** (no react‑helmet needed).
4. **Crawl plumbing** — `robots.txt` (already shipped) + build‑time `sitemap.xml` from Sanity slugs; add the sitemap line to robots.
5. **Vercel build/deploy config + preview** — correct build output/rewrites for framework mode; ensure `api/likes/*` functions still deploy; push branch; verify preview (view‑source has real content, routes work, votes work, analytics + favicon intact).
6. **Verify and merge to main** — final crawlability/metadata/vote/data checks on preview, then merge and confirm production.

---

## Key technical facts to carry in

- **Stack:** Vite + React 19 (`19.2.4`), React Router v7 (`react-router-dom ^7.14.0` — already v7, enables framework mode), Tailwind, Sanity CMS, Vercel (Root Directory = `frontend`), GoDaddy DNS → Vercel.
- **React 19 native metadata:** render `<title>`/`<meta>`/`<link>` in components; React hoists them to `<head>`; works during prerender. No third‑party head library.
- **Prerender API:** `react-router.config.js` → `prerender: async ({ getStaticPaths }) => [...]` — pull release + spotlight slugs from Sanity at build time. `ssr:false` + prerender emits static HTML per path plus a SPA fallback for the rest.
- **Sanity:** project `oeemrqux`, dataset `production`. Query slugs via the API, e.g. `*[_type=="release"]{"slug":slug.current}`. Current spotlight query: `*[_type=="spotlightArtist" && isCurrent==true]`.
- **Keep as‑is:** the like/dislike backend works — `frontend/api/likes/{get,vote}.js` use the `redis` (node‑redis) client against a Vercel **Redis Cloud** store via `REDIS_URL` (TCP). Do **not** switch it to Upstash REST — that store has no REST endpoint. It works; leave it.
- **CORS gotcha:** Sanity only allows browser requests from allow‑listed origins. `http://localhost:5173` is allowed; other ports (e.g. 5174) fail with "Failed to fetch" and the home page then shows the hardcoded Hero fallback ("Stella Donnelly / Image coming soon"). Keep dev on 5173, or add the extra origin in manage.sanity.io → API → CORS.
- **Dev workflow:** NIF root `package.json` now runs both servers via `npm run dev` (concurrently: `[frontend]` 5173, `[studio]` 3333). One "node" terminal runs both (stays open; Ctrl+C stops both); a second terminal for git/one‑offs. Target one project without cd: `npm --prefix frontend run <script>` / `npm --prefix studio run <script>`.
- **Hero fallback lives in** `frontend/src/components/Hero.jsx` (default destructuring values) — carry this behavior into the ported home route/loader.

---

## State at pause (July 11)

- **Done today, unrelated to migration:** favicon restored & live; like/dislike verified working end‑to‑end; Vercel Web Analytics added to `main` and live; root dev‑server launcher (`concurrently`) + `.gitignore` fix.
- **Quick wins — completed & shipped to `main`:**
  - `frontend/public/robots.txt` (welcomes AI bots; sitemap line points to future `/sitemap.xml`).
  - **Google Search Console** verified for `https://www.kimrampling.com` via HTML‑file method — `frontend/public/google26f21278f8ab3b52.html` (keep this file permanently). Now collecting baseline data.
  - **Bing Webmaster Tools** set up by importing from GSC. IMPORTANT: signed in with the **Google account**, not the Microsoft one — use Google to log back in and avoid creating a duplicate.
  - Note: `streamusique.com` (old Blogger site) already exists as a separate GSC property with indexing history — revisit for a possible redirect/consolidation play.
- **Measurement baseline:** both GSC + Bing accruing data over the away week; use as before/after for the migration.
- **Migration itself:** NOT started. No branch created yet. Start at Stage 1 (`git checkout -b feature/rr7-framework-mode`).

---

## Start here next Friday

1. Confirm the robots.txt and Search Console quick wins landed; check any baseline data in Search Console.
2. `cd` to NIF root, stop dev servers, then: `git checkout -b feature/rr7-framework-mode`.
3. Tell Claude "resume the SSG migration, Stage 1" and paste/attach this doc + `SEO_AI_Search_Plan.md` so the fresh session has full context.
4. Proceed stage by stage, verifying on the Vercel preview, merge to `main` only when confirmed.
