# HNUT Lock-In — Human Nutrition 1: Vitamins

Practice site for **HNUT10010 / HNUT10020 Human Nutrition 1: Understanding Nutrients** (UCD), Lectures 12–15: vitamins A, K, D, E and B1, B2, B3, B5, B6, B7, B9.

Built on the same engine as [SSD Lock-In](https://github.com/albinjoby82-ops/SSD_Lock-In). The site reads the markdown in `TOPICS.md`, `notes/`, `questions/` and `mock/` at runtime, so editing those files updates the site. No build step.

Start at **[TOPICS.md](TOPICS.md)** (progress tracker). One-page sheets: **[key-numbers.md](key-numbers.md)** and **[vitamin-table.md](vitamin-table.md)**. Mock exams: **[mock/](mock/midterm-1.md)**.

## Put it online (GitHub Pages)
1. Create a new repo, e.g. `HNUT_Lock-In`, and upload everything in this folder (keep `.nojekyll`).
2. Settings → Pages → Deploy from branch → `main` / root.
3. In `site/app.js`, line 7, set `REPO_BLOB` to `https://github.com/<you>/HNUT_Lock-In/blob/main/`.

To test locally: `python3 -m http.server` in this folder, then open http://localhost:8000.

## Reading style (dyslexia-friendly)
- One idea per line. Short sentences.
- Key rules and equations on their own line.
- Lots of space between sections.

## How each topic is built
- `notes/NN-topic.md`: slide diagrams + short explanation, with **🧠 check questions inline**.
- `questions/NN-topic.md`: end-of-topic test with
  1. **Part A, core questions** straight from the learning outcomes (function, sources, deficiency), tagged `(Core Qn)`, and
  2. **Part B, exam-style questions**: true/false, multiple choice, explain, calculation.
- Every conversion or intake formula gets a **📐 box**: what each symbol means, when to use it, what to watch out for.
- Questions with "Calculation" in the title get a number-check box and, where there's a generator in `site/scramble.js`, a **🔀 New numbers** button.
- **Rule:** every answer is taught in that topic's notes, and cites the notes section (§).

## Adding more topics (vitamin C, B12, minerals…)
1. Add `notes/13-x.md` and `questions/13-x.md` in the same format.
2. Add a row to the table in `TOPICS.md` (copy an existing row).
3. Done. The site picks it up.
