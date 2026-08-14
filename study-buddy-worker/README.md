# Study Buddy Worker

Backend for the "Study Buddy" surrogate-student assistant (`/studybuddy/` and
`/studybuddy-admin/` on the main site). Cloudflare Worker + D1, calling the free
Gemini API. See `/Users/kishanbellur/.claude/plans/sprightly-kindling-parasol.md`
for the full design writeup.

## One-time setup (all free, no credit card)

1. Install `wrangler` and log in:
   ```
   npm install
   npx wrangler login
   ```
2. Create the D1 database and copy its `database_id` into `wrangler.toml`:
   ```
   npx wrangler d1 create study-buddy-db
   ```
3. Apply the schema, locally and remotely:
   ```
   npx wrangler d1 execute study-buddy-db --file=./schema.sql
   npx wrangler d1 execute study-buddy-db --file=./schema.sql --remote
   ```
4. Get a free Gemini API key at https://aistudio.google.com (no card required).
5. Set secrets (never committed to git):
   ```
   npx wrangler secret put GEMINI_API_KEY
   npx wrangler secret put ADMIN_EMAIL          # kishanbellur@gmail.com
   npx wrangler secret put CLASS_ACCESS_CODE    # whatever you hand out to students
   ```
6. Deploy:
   ```
   npx wrangler deploy
   ```
   Note the resulting `*.workers.dev` URL — put it in place of
   `https://study-buddy-worker.YOUR-SUBDOMAIN.workers.dev` in both
   `_pages/study-buddy.md` and `_pages/study-buddy-admin.md`
   (`window.STUDY_BUDDY_API_BASE`).
7. In the Firebase console for the existing `lecture-feedback-e758b` project:
   - Authentication → Sign-in method → enable **Google**.
   - Authentication → Settings → Authorized domains → confirm
     `kishanbellur.github.io` is listed (LecturePulse never exercised Firebase
     Auth, only Realtime Database, so this has likely never been checked).
8. After deploying, sanity-check both pages from the live
   `https://kishanbellur.github.io` URL (not just a local file) — CORS is
   locked to that exact origin.

## Local development

```
npm install
npx wrangler dev
```

## Testing the API directly

```
curl -X POST https://<your-worker>.workers.dev/api/ask \
  -H "Content-Type: application/json" \
  -d '{"classCode":"...","question":"When did we cover backpropagation?"}'
```

Ingest requires a real Firebase ID token (sign in on `/studybuddy-admin/` and
copy it from the browser devtools/network tab if you want to test via curl).

## Notes

- Model is set via the `GEMINI_MODEL` var in `wrangler.toml` (default
  `gemini-3.5-flash`, 15 req/min & 1,500 req/day free as of Aug 2026 — Google
  retires old model IDs for new API keys periodically, so if you see a 404
  telling you a model "is no longer available to new users," check
  https://ai.google.dev/gemini-api/docs/pricing for the current free-tier
  Flash model name and update this var). Switch to `gemini-3.5-flash-lite`
  (higher req/min) if the class hits rate limits.
- No embeddings/vector DB — `src/relevance.js` does a cheap keyword-overlap
  filter so prompt size (and therefore token cost) stays roughly flat as more
  lectures are added over the semester, instead of growing unbounded.
