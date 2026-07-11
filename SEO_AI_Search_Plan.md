# New Indie Friday — SEO & AI‑Search Readiness Plan

*Prepared July 11, 2026. A plan + primer: it explains how search works now, audits where the site stands, and scopes the work in phases you can approve one at a time.*

---

## 1. The one idea to hold onto

Search in 2026 is no longer "ten blue links." Google answers many queries with an **AI Overview** (a Gemini‑generated summary), and a growing share of people search inside AI browsers and assistants — Perplexity/Comet, ChatGPT, Claude. But the thing that gets you *into* those answers has not become exotic. On **May 15, 2026** Google published its official AI‑search guide, and its headline is blunt: **"AEO and GEO are still SEO."** AI Overviews are built from Google's *normal* search index using retrieval‑augmented generation (RAG); the links under an Overview are ordinary ranking results.

So the goal is not to chase a separate "AI SEO" discipline. The goal is the oldest one in the book: **make your content easy for a machine to fetch, read, and trust.** Your site currently fails the very first step — *fetch and read* — and that is where nearly all the value in this plan sits.

---

## 2. How AI search actually works (the primer)

**Retrieval, then generation.** When you ask Google or Perplexity something, it doesn't invent an answer from memory. It *retrieves* a handful of web pages from an index, then *generates* a summary grounded in them, citing 2–7 sources. To be cited, you must first be in the index, and your page must clearly contain the answer.

**Crawlers read HTML, not your app.** A crawler requests your URL and reads whatever HTML your server sends back. Googlebot *can* run JavaScript in a second "rendering" pass, but it's slower, budget‑limited, and unreliable for SPAs — and the AI‑specific crawlers (GPTBot, ClaudeBot, PerplexityBot, Google‑Extended) **do not run JavaScript at all.** They see only the raw HTML. Industry testing finds JavaScript‑rendered content fails AI parsing roughly three‑quarters of the time.

**Three overlapping audiences, one fix.** Classic Google, Google's AI Overviews, and third‑party AI engines all reward the same fundamentals: crawlable text, unique/high‑quality content, clean structure, and being referenced elsewhere. Optimizing for one optimizes for all. The only real divergence: Google says you *don't* need `llms.txt` or special schema for its AI features, whereas some non‑Google engines make light use of them — so those are "nice to have," not priorities.

**What AI engines reward in the content itself.** Answers that come *first* (the opening ~200 words carry disproportionate weight), original insight over commodity description, visible freshness (dates), and corroboration from other sites.

---

## 3. Where New Indie Friday stands today (honest audit)

| Area | Current state | Verdict |
|:--|:--|:--|
| Rendering | Client‑rendered Vite SPA; release/spotlight text fetched from Sanity *after* load | ❌ Content invisible to non‑JS crawlers — the core problem |
| Page titles | One static `<title>` ("New Indie Friday") for every route | ❌ Every page looks identical to search |
| Meta description | None | ❌ No control over snippets |
| Open Graph / social cards | None | ❌ Shared links render bare |
| Structured data (JSON‑LD) | None | ⚠️ Missing an easy signal |
| robots.txt | Absent | ⚠️ No crawl guidance; AI bots not explicitly welcomed |
| sitemap.xml | Absent | ⚠️ Crawlers must discover pages by luck |
| Canonical URLs | None | ⚠️ Duplicate‑URL risk (e.g. pagination) |
| Analytics | Statcounter + Vercel Web Analytics (now live) | ✅ Fine for traffic; not a search signal |
| Content quality / voice | Original, opinionated curation | ✅ Genuine asset — exactly what AI engines cite |

The pattern: your *content* is strong and your *plumbing* is mostly absent — and the single load‑bearing gap is rendering. Fix rendering and the metadata work suddenly has something to attach to.

---

## 4. The plan, in phases

Phases are ordered so each one delivers value on its own and later phases depend on earlier ones. You can stop after any phase.

### Phase 0 — Crawl plumbing (quick wins, ~½ day, low risk)

Independent of rendering; safe to ship immediately.

- **`robots.txt`** in `public/` that allows all crawlers, explicitly welcomes the AI bots (GPTBot, ClaudeBot, PerplexityBot, Google‑Extended), and points to the sitemap.
- **`sitemap.xml`** generated at build time by a small Node script that queries Sanity for all release and spotlight slugs and writes the file — so it stays current automatically each deploy.
- **Baseline meta in `index.html`**: a default meta description, Open Graph and Twitter‑card tags, and a canonical link, so *something* correct is served even before per‑page rendering.
- **Register** the site with Google Search Console and Bing Webmaster Tools and submit the sitemap (this is also how you'll *see* AI/search performance later).

*Value on its own:* crawlers can discover every page and you control the homepage's appearance. It does **not** yet expose the per‑page body text — that's Phase 1.

### Phase 1 — Make content crawlable (the big one, ~1–3 days depending on route)

This is the phase that actually matters. The fix is to put the real HTML — headings, blurbs, artist names — into the server response via **prerendering** (generating a static HTML file per page at build time). Your pages only change when you publish, so you don't need a live server; static prerender is the ideal fit. Three routes, lightest to heaviest:

**Option A — Build‑time prerender pipeline (pragmatic, recommended first step).**
Keep the app exactly as it is; add a post‑build step that loads each route in headless Chrome and saves the resulting HTML. Route list comes from your Sanity slugs. Minimal change to your code, reversible, and gets 90% of the benefit. Downside: an extra build dependency and a slightly longer build.

**Option B — Adopt React Router v7 "framework mode" + native prerender (the proper long‑term foundation).**
You're already on RR v7, which has built‑in SSG. This means restructuring routing into framework mode (a routes config + data "loaders" that fetch Sanity data at build) and turning on `prerender`. Best‑integrated, most future‑proof, unlocks per‑route data cleanly — but it's a genuine refactor of `App.jsx` and the data fetching.

**Option C — Prerender service at the edge (lowest code change, ongoing dependency).**
A service (e.g. Prerender.io) detects bots and serves them prerendered HTML. Almost no code change, but adds an external dependency and a monthly cost, and is the least "clean." A fallback, not a first choice.

*My recommendation:* start with **Option A** to get your content visible fast and low‑risk, and treat **Option B** as a later, deliberate upgrade if/when you want the cleaner foundation. I'll give you a clear-eyed migration note either way.

### Phase 2 — Per‑page metadata + structured data (~1 day, depends on Phase 1)

Once pages are prerendered, metadata rendered by React 19 lands in the served HTML:

- **Unique `<title>` and `<meta name="description">` per page**, rendered directly in your route components using React 19's native metadata hoisting — no react‑helmet needed. Titles like *"Skint — The Dead Bolts | New Indie Friday"*.
- **Open Graph / Twitter cards per page** using the release's album art, so a shared link to a specific track looks rich on socials and in chats.
- **JSON‑LD structured data**: `MusicRecording`/`Article` on release pages, `Organization`/`WebSite` on the homepage. Google reads JSON‑LD anywhere in the document; it gives engines an unambiguous machine reading of "who/what/when."
- **Canonical URLs per page**, and correct handling of paginated `/new-releases/page/:page` routes.

### Phase 3 — Content strategy & measurement (ongoing, low effort, high compounding)

No code; this is how you *use* the foundation.

- **Front‑load the answer.** Open each blurb with the concrete who/what/why (artist, track, genre, why it's worth hearing) before the stylistic flourish — that opening is what gets retrieved and quoted.
- **Lean into your voice.** Original opinion is "non‑commodity content," which AI engines preferentially cite over generic descriptions. This is your edge; a Spotify‑scraped summary is not.
- **Keep dates visible** (you already have release dates) — recency is a ranking input for AI answers.
- **Earn mentions/links** on other music sites, socials, and forums; AI systems weigh cross‑web corroboration.
- **Measure** in Search Console (impressions, queries, which pages get picked up) and periodically ask Google AI Mode / Perplexity a question your site should answer, to see whether you're cited.

---

## 5. Effort vs. impact at a glance

| Phase | Effort | Impact | Risk |
|:--|:--|:--|:--|
| 0 — Crawl plumbing | Low (½ day) | Medium | Very low |
| 1 — Rendering (Option A) | Medium (1–2 days) | **Very high** | Low–medium |
| 1 — Rendering (Option B) | High (2–3+ days) | **Very high** | Medium |
| 2 — Metadata + JSON‑LD | Low–medium (1 day) | High | Low |
| 3 — Content & measurement | Ongoing, light | High (compounds) | None |

If you only ever do two things: **Phase 1 (rendering)** and **Phase 3 (voice/front‑loading)**. Everything else multiplies those.

---

## 6. Decisions I need from you

1. **Rendering route:** start with the pragmatic prerender pipeline (Option A), or commit to the React Router v7 framework‑mode refactor (Option B) now?
2. **Scope to start:** ship Phase 0 quick wins immediately while we decide on rendering, or hold and do it all together?
3. **Search Console:** are you set up already, or should that be part of Phase 0? (It's how we'll measure everything afterward.)

---

## 7. How we'll know it worked

- `view-source:` on a release page shows the blurb text in the raw HTML (not just an empty `<div id="root">`).
- Google Search Console's URL Inspection shows the page's real content and no "crawled – rendering" gaps; impressions climb over weeks.
- A shared link to a track shows a rich card with art and description.
- Asking Google AI Mode or Perplexity a question your page answers eventually surfaces New Indie Friday as a cited source.

---

*Next step: pick the rendering route in §6 and I'll turn the chosen phases into concrete code changes in the repo, one phase at a time.*
