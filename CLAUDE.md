# CLAUDE.md

Website for UCLID (University of Cincinnati Lab for Interfacial Dynamics, PI Kishan Bellur): https://kishanbellur.github.io. It's a Jekyll site on the academicpages / Minimal Mistakes theme, plus two custom classroom apps (LecturePulse and SAM). Contributor how-tos (talks, publications, people, posts) are in [README.md](README.md). Read it first and keep it in sync when workflows change.

## Build & deploy

- GitHub Pages builds `master` automatically on push. There is no CI and no test suite. Pushing to `master` publishes to the live site, so confirm before you push.
- Local preview: `bundle exec jekyll serve --config _config.yml,_config.dev.yml` → http://localhost:4000. Restart after editing `_config.yml`.
- `Gemfile` uses the `github-pages` gem, so GitHub builds in safe mode. **Custom `_plugins/` do not run on GitHub.** [_plugins/ruby_compat.rb](_plugins/ruby_compat.rb) exists only so local builds work on newer Ruby (it restores `Object#tainted?`).
- `Gemfile.lock` is gitignored. If `bundle install` breaks, delete it and try again.
- `assets/js/main.min.js` is the theme bundle (built with `npm run build:js` from the root `package.json`). The classroom-app JS files in `assets/js/` are loaded directly and are not part of that bundle.

## Content model

- Collections (`_config.yml`): `teaching`, `publications`, `research`, `talks`, `people`. Standalone pages are in `_pages/`, and each sets its own `permalink`.
- **`_talks/` and `_publications/` are generated.** Edit `markdown_generator/talks.tsv` / `pubs.bib`, then run `python3 talks.py` / `python3 pubsFromBib.py` from `markdown_generator/`. After changing talks, also run `python3 talkmap.py` from the repo root. Needs `pandas`, `pybtex` (and `getorg` + `geopy` for the talkmap).
- **People:** [_pages/people.md](_pages/people.md) groups members with `where: "position", "..."` on these exact strings: `Principal Investigator`, `PhD Student`, `MS Student`, `BS Student`, `PhD Alum`, `MS Alum`, `BS Alum`. Any other `position` value leaves the person off the page. Within each group, people are sorted by the `order` front-matter field; anyone without `order` goes last.
- Top nav: [_data/navigation.yml](_data/navigation.yml).
- Posts dated in the future don't render (`future: false`). `_posts/2199-01-01-future-post.md` is a theme placeholder.

## Classroom apps

Each app's markup and page-specific CSS are inline in a `_pages/*.md` file, with logic in `assets/js/`. Firebase config is inline in the pages. All of them use Firebase project `lecture-feedback-e758b`.

| App | Page (permalink) | JS | Backend |
| --- | --- | --- | --- |
| LecturePulse (student) | `_pages/student-check-in.md` (`/lecturepulse/`) | `student-check-in.js` | Firebase Realtime DB |
| LecturePulse (instructor) | `_pages/lecture-pulse.md` (`/lecturepulse-admin/`) | `lecture-pulse.js` | Firebase Realtime DB, client-side access code |
| SAM (student) | `_pages/sam.md` (`/sam/`) | `sam.js` | Cloudflare Worker, gated by class code |
| SAM (instructor) | `_pages/sam-admin.md` (`/sam-admin/`) | `sam-admin.js` (ES module) | Worker, gated by Firebase Google sign-in |

The file names don't match the permalinks, because the apps were renamed (student check-in → LecturePulse, Study Buddy → SAM). Links on [_pages/teaching.html](_pages/teaching.html) use the permalinks. `lecture-pulse-test.html` at the root is a standalone prototype.

### SAM backend: [study-buddy-worker/](study-buddy-worker/)

- Cloudflare Worker + D1 (`study-buddy-db`, one `lectures` table, see `schema.sql`), which calls the Gemini API. It's excluded from the Jekyll build.
- Routes (`src/index.js`): `POST /api/ask` (class code), `POST /api/ingest`, `GET /api/lectures`, and `DELETE /api/lectures/:id`. The last three are admin-only (`src/auth.js` verifies the Firebase ID token against the `ADMIN_EMAIL` secret).
- `src/relevance.js` does keyword-overlap filtering of lectures. There are no embeddings.
- `wrangler.toml` holds non-secret vars (`GEMINI_MODEL`, `FIREBASE_PROJECT_ID`, `ALLOWED_ORIGIN`). The secrets `GEMINI_API_KEY`, `ADMIN_EMAIL`, and `CLASS_ACCESS_CODE` are set with `wrangler secret put`. Never commit them.
- Dev/deploy: `npm install`, `npx wrangler dev`, `npx wrangler deploy` (run from `study-buddy-worker/`). Deploying is a separate step from pushing the site.
- The Worker URL is hardcoded as `window.SAM_API_BASE` in **both** `sam.md` and `sam-admin.md`.
- CORS only allows `https://kishanbellur.github.io`, so SAM won't work from a local Jekyll preview.
- The directory, Worker, and D1 database keep the old "study-buddy" names so the deployed URL doesn't change. Everything user-facing is called SAM. Full setup steps are in `study-buddy-worker/README.md`.

## Conventions / gotchas

- Most files come from the upstream theme (`_layouts/`, `_includes/`, `_sass/`, `CHANGELOG.md`, `CONTRIBUTING.md`, and demo pages like `_pages/markdown.md` and `archive-layout-with-content.md`). Avoid changing them unless the task requires it.
- Contributors are lab students editing by hand. Keep changes simple and add a changelog line at the bottom of README.md for content updates.
- `.DS_Store` is gitignored. Don't add it back.
