# UCLID website

Source for the website of the **University of Cincinnati Lab for Interfacial Dynamics (UCLID)**, led by Prof. Kishan Bellur — <https://kishanbellur.github.io>.

It is a [Jekyll](https://jekyllrb.com/) site built on the [academicpages](https://github.com/academicpages/academicpages.github.io) fork of the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme (MIT — see [LICENSE](LICENSE)), plus a few custom classroom tools (LecturePulse and SAM) described below.

**Publishing:** GitHub Pages builds and deploys automatically on every push to `master`. There is no CI workflow to run; just push and wait a few minutes.

Select UCLID students have edit access. If that's you, follow the how-tos below and add a line to the changelog at the bottom.

---

## Repository layout

| Path | What lives there |
| --- | --- |
| [_config.yml](_config.yml) | Site-wide settings: title, author, collections, nav defaults, analytics |
| [_data/navigation.yml](_data/navigation.yml) | Top menu links |
| [_data/authors.yml](_data/authors.yml) | Author sidebar profiles |
| [_pages/](_pages/) | Standalone pages (`about`, `people`, `research`, `talks`, `teaching`, plus the classroom apps) |
| [_people/](_people/) | One markdown file per lab member |
| [_research/](_research/) | Research topic pages |
| [_publications/](_publications/) | **Generated** — do not hand-edit; see below |
| [_talks/](_talks/) | **Generated** — do not hand-edit; see below |
| [_teaching/](_teaching/) | Course pages |
| [_posts/](_posts/) | News / updates, shown under "Posts & Updates" |
| [_includes/](_includes/), [_layouts/](_layouts/), [_sass/](_sass/), [assets/](assets/) | Theme internals — rarely need changes |
| [images/](images/) | Photos and figures referenced by pages |
| [files/](files/) | PDFs (papers, slides) linked from publications and talks |
| [markdown_generator/](markdown_generator/) | Scripts that turn `talks.tsv` / `pubs.bib` into markdown |
| [study-buddy-worker/](study-buddy-worker/) | Cloudflare Worker backend for SAM |
| [talkmap.py](talkmap.py), [talkmap/](talkmap/) | Builds the interactive map on the talks page |

---

## Running the site locally (optional but recommended)

You can edit and push without this, but a local preview catches broken YAML before it reaches the live site.

```bash
bundle install          # first time only
bundle exec jekyll serve --config _config.yml,_config.dev.yml
```

Then open <http://localhost:4000>. Pages rebuild on save; `_config.yml` changes require restarting the server.

If `bundle install` fails or GitHub warns about a vulnerable dependency, delete `Gemfile.lock` and run it again. (The file is gitignored, so this is always safe.)

---

## Updating **Talks**

Talk pages are generated from a spreadsheet — edit the TSV, not the markdown.

1. Pull the latest version from GitHub.
2. Edit [markdown_generator/talks.tsv](markdown_generator/talks.tsv). Columns: `title`, `type`, `url_slug`, `venue`, `date`, `location`, `talk_url`, `description`.
   - `title`, `url_slug`, and `date` are required; the rest may be blank.
   - Dates are `YYYY-MM-DD`.
   - `date` + `url_slug` must be unique — together they become the filename and URL.
3. From `markdown_generator/`, run `python3 talks.py`. This writes/refreshes files in `_talks/`.
4. From the repo root, run `python3 talkmap.py` to update the map on the talks page.
5. Commit and push.
6. Check the live site after a few minutes.
7. Add a changelog entry below.

## Updating **Publications**

1. Pull the latest version from GitHub.
2. Ask Prof. Bellur for an updated `pubs.bib` and replace [markdown_generator/pubs.bib](markdown_generator/pubs.bib).
3. From `markdown_generator/`, run `python3 pubsFromBib.py`. This writes/refreshes files in `_publications/`.
4. *(Optional)* Add the PDF to [files/](files/) and link it from the generated markdown file.
5. Commit and push.
6. Check the live site after a few minutes.
7. Add a changelog entry below.

Both scripts need `pandas` (talks) and `pybtex` (publications): `pip3 install pandas pybtex`.

## Adding or updating **People**

Copy an existing file in [_people/](_people/) — e.g. [_people/AmirhoseinSarchami.md](_people/AmirhoseinSarchami.md) — and edit the front matter:

```yaml
---
title: "Full Name"
collection: people
permalink: /people/fullname     # lowercase, no spaces
position: PhD Student
start: 2023
end: present                    # or a year, for alumni
order: 3                        # controls sort position on /people/
author: Full Name
author_profile: true
excerpt: <font size="3"> Research keywords, comma separated </font>
---
```

Put the headshot in [images/](images/) and reference it from the body. Everything below the front matter is normal markdown.

## Adding a **post / update**

Create `_posts/YYYY-MM-DD-short-title.md` following an existing post. Posts dated in the future are not published (`future: false` in `_config.yml`).

## Research and Teaching pages

Add or edit files in [_research/](_research/) and [_teaching/](_teaching/), copying the front matter of a neighboring file. Both are Jekyll collections, so a new file appears on the corresponding index page automatically.

---

## Classroom tools

Two in-house teaching apps ship with the site and are linked from [/teaching/](_pages/teaching.html).

### LecturePulse — live "am I following?" check-in

| | |
| --- | --- |
| Student page | [/lecturepulse/](_pages/student-check-in.md) — students tap green / yellow / red |
| Instructor page | [/lecturepulse-admin/](_pages/lecture-pulse.md) — live tally, gated by an access code |
| Backend | Firebase Realtime Database (project `lecture-feedback-e758b`), configured inline in both pages |

Everything is client-side; there is nothing to deploy beyond pushing the site.

### SAM (Student Assistant Model) — lecture-grounded Q&A

| | |
| --- | --- |
| Student page | [/sam/](_pages/sam.md) — asks questions, gated by the class access code |
| Instructor page | [/sam-admin/](_pages/sam-admin.md) — uploads lecture content, gated by Google sign-in |
| Backend | [study-buddy-worker/](study-buddy-worker/) — Cloudflare Worker + D1, calling the Gemini API |

The pages point at the Worker via `window.SAM_API_BASE`, set near the bottom of each page. If the Worker is redeployed to a different URL, update it in **both** files. Setup, secrets, local development, and deployment for the backend are documented in [study-buddy-worker/README.md](study-buddy-worker/README.md).

Note that CORS on the Worker is locked to `https://kishanbellur.github.io`, so SAM only works from the live site — not from a local Jekyll preview.

---

## Changelog

- 2026-03-01: Kishan updates talks and pubs
