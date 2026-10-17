# Contact form: "Hire me"

Status: **enabled** with the owner's Formspree endpoint (`https://formspree.io/f/mwlvydjd`, supplied 2026-10-17); real delivery has not been tested by the agent. Owner approved the approach (a form posted to a form service) on 2026-10-17. Satisfies the owner-approved contact destination in [requirements](REQUIREMENTS.md) (FR-05b): the page is built only when a real destination exists, so the site never shows a form that cannot send.

## What it is

A page at `/contact/` with a project-brief form: name, email, company (optional), what is needed (product and CGI rendering, VFX and compositing, CAD and engineering, something else), timeline and budget (both optional), a project description, links (optional) and a consent checkbox. Submissions go to the owner's inbox through [Formspree](https://formspree.io); no email address is published on the site. A hidden honeypot field (`_gotcha`) catches simple bots.

The "Hire me" link appears in the header and footer, on the home page call to action, the end of the Aurelia case study and walkthrough, and the end of each project page.

## Turn it on (owner steps)

1. Create a free Formspree account and a new form that delivers to the inbox you want. Formspree shows a form URL like `https://formspree.io/f/abcdwxyz`. That URL is public by design; it is not a secret.
2. In Formspree, add your site `youssef.studio` as an allowed domain if you want submissions limited to it, and turn on its spam filtering.
3. Give the URL to the agent, or edit `src/data/contact.json` yourself: set `endpoint` to the URL, `approvedBy` to your name and `approvedOn` to the date.
4. Run `npm run verify` and merge. The build then emits `/contact/`, the Hire me links and the sitemap entry; `scripts/check-live.mjs` expects the page to serve the form.

To switch it off again, set `endpoint` back to `null`: the route, links and sitemap entry disappear on the next build.

## Behaviour and privacy

- Nothing is sent until the visitor presses Send; no Formspree script or font is loaded by the page.
- With JavaScript: inline error messages per field, a JSON submit and an in-page confirmation. Without it: a plain form post to Formspree, which shows its own confirmation.
- The consent text says the message is sent through Formspree and used only to reply. That sentence is a policy statement by the owner; change it if it is not accurate.
- No reply-time promise is made on the page.

## Checks

`npm run test:contact` (part of `verify`): while dormant, `dist/` contains no contact route, link or sitemap entry; a fixture build (`YS_CONTACT_FIXTURE=1`, synthetic endpoint, scratch output) exercises the form in a browser at 1440 and 390 px: no request before submit, validation errors and focus, an invalid email, the failure path keeping the visitor's text, the success path, axe (WCAG 2.2 AA tags), labels on every field and the no-JavaScript form. Not verified: real delivery to an inbox, which needs the owner's endpoint.
