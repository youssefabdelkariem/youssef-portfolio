# Aurelia publication workflow: the film and the walkthrough

Two pieces of Aurelia content are prepared but **dormant**: the finished commercial and the making-of walkthrough. Neither appears in the production build, the sitemap, the navigation or any page text until the owner approves it. This file is the procedure for turning each on. Requirements: FR-01b, FR-01c, QA-07, QA-08, QA-12, QA-13. Source protection: original Aurelia files stay read-only; only approved web derivatives enter the repository.

## 1. Recommendation for hosting the film

| Option | Value | Cost |
| --- | --- | --- |
| **Self-hosted H.264 MP4 (1080p, optional WebM) with a VTT captions file** | Best quality control, no third party before or after play, simple privacy story, works with the poster-first component | GitHub Pages limits: 100 MB per file, about 1 GB site, 100 GB per month soft bandwidth. A 30 to 90 s 1080p H.264 file is typically 15 to 60 MB, which fits |
| YouTube or Vimeo embed (poster-first, privacy-enhanced host loaded only after the click) | No bandwidth cost, adaptive streaming, existing watch page doubles as the external fallback | A third-party player after the click; quality and branding controlled by the platform |

Recommendation: self-host a 1080p MP4 (the 4K ProRes master stays offline) and use the public YouTube or Vimeo watch page as the external playback link. If the file exceeds roughly 60 MB, use the embed kind instead. Either way nothing is fetched from a third party before the visitor presses play, and the film never preloads (QA-08).

## 2. Add the finished commercial

Prerequisites from the owner: the final film, a poster frame (an approved render or a frame from the film), the title and description, a text description of the film (and a transcript or audio-description page if one exists), captions if there is speech or on-screen text that carries meaning, the approval name and date.

1. **Poster derivative.** Add a set `film-poster` to `scripts/aurelia/derivatives.spec.json` (master = the approved poster frame kept outside the repository), run `scripts/aurelia/make-derivatives.py`, then `node scripts/aurelia/sync-media.mjs <derivatives dir>`. This adds the AVIF and JPEG poster files and their manifest entry. Never commit the master.
2. **Film file** (self-hosted kind). Encode H.264 1080p, `-movflags +faststart`, no autoplay assumptions, and put it at `public/media/aurelia/film/aurelia-1080.mp4` (add a WebM next to it if wanted) with `public/media/aurelia/film/aurelia.en.vtt` for captions. Keep each file under 60 MB. The artifact allowlist accepts only `mp4`, `webm` and `vtt` in that folder, and only once a film is configured.
3. **Configure.** In `src/data/aurelia-film.json` replace `{ "film": null }` with the film object described in `src/data/aurelia-film.ts` (title, description, `accessibilityNote`, `duration` as ISO 8601, `uploadDate`, `width`, `height`, `posterId: "film-poster"`, `posterAlt`, `playback`, `externalUrl`, `approvedBy`, `approvedOn`). Playback is one of `{ "kind": "file", "sources": [{ "src": "/media/aurelia/film/aurelia-1080.mp4", "type": "video/mp4" }], "captions": [{ "src": "/media/aurelia/film/aurelia.en.vtt", "srclang": "en", "label": "English", "default": true }] }`, `{ "kind": "youtube", "id": "<id>" }` or `{ "kind": "vimeo", "id": "<id>" }`. The build refuses an incomplete film, a missing poster derivative or a missing approval.
4. **Accessibility.** The component provides the poster alt text, a keyboard-operable play button, a named player, an external watch link, the text description in a disclosure, and the optional transcript link. The owner supplies the content; QA-12 needs captions and a text alternative reviewed before release.
5. **Verify.** `npm run verify` (the dormant checks now expect the film: `check-publication` requires the approval fields and `check-dist` allows the one external watch link), `npm run test:film` (fixtures), then a manual play test on desktop and phone, and Lighthouse on `/work/aurelia/` (the poster is lazy and nothing else loads until play).
6. **Result.** The case study gains a "Watch the film" section after the hero and a hero button. The page structure otherwise does not change.

## 3. Finish and publish the walkthrough

Draft architecture: content in `src/data/walkthrough.json` (13 sections, each with verified points and their sources, a `status` of `ready` or `needs-owner`, the `need` list and required media), page in `src/walkthrough/index.astro`, route injected by `astro.config.mjs` only when published, gate in `src/data/walkthrough-publication.json`. A local draft preview is built with `npm run build:preview` into `dist-preview/` (noindex, shows what each unfinished section needs, never deployed).

Finish the content:

1. For each `needs-owner` section (overview, planning, camera, finishing, challenges, results) obtain the owner's explanation and, where it states a technique, a supporting project file or the owner's written confirmation. Add `points` with a `source`, and set `status` to `ready` and clear `need`. Do not state anything about After Effects or Premiere Pro until it is confirmed.
2. For each media item with `status: needed`, produce an approved web derivative (diagram, comparison, screenshot) and set `status` to `available`; wire it into the page. Keep diagrams drawn only from verified project data.
3. Keep the primary case study visually focused: the walkthrough carries the technical depth.

Publish (owner approval first):

1. Re-run `node scripts/check-publication.mjs`; it lists every remaining blocker. With the gate off it verifies the draft is excluded; with the gate on it fails on any unfinished section, missing media or missing approval.
2. In `src/data/walkthrough-publication.json` set `published: true`, `approvedBy` and `approvedOn`.
3. `npm run verify` and `npm run build`: the route `/work/aurelia/walkthrough/` is built, listed in the sitemap, and the Aurelia page shows "Explore the process". Remove the `walkthrough` entry from the post-deployment "must not be served" list in `scripts/check-live.mjs` and add it to the routes list.
4. Include the film first if possible so the two actions "Watch the film" and "Explore the process" appear together.

## 4. Prove that drafts stay out until publication

`npm run test:publication` (part of `verify`) fails if, while publication is off: the production `dist/` contains a walkthrough route, file, sitemap entry or any text mentioning it; `dist/` contains film markup, a player, an embed host, VideoObject metadata or film files while no film is configured; the preview build is not `noindex` or is linked from any page. `check-artifact` independently rejects walkthrough paths and film files in the publish artifact, and `check-live` expects `/work/aurelia/walkthrough/` to return 404 on the production site. `npm run test:film` exercises the component with synthetic fixtures that never reach the production build.
