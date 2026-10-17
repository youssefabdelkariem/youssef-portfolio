/**
 * The "work with me" form. DORMANT until contact.json holds the owner's Formspree endpoint and the approval fields: while
 * dormant, no /contact/ route, no "Hire me" link and no sitemap entry is built, so the site never shows a form that cannot send.
 * `YS_CONTACT_FIXTURE=1` (build-time only, used by `npm run test:contact`) substitutes a synthetic endpoint so the form can be
 * tested; the production build never sets it.
 */
import config from './contact.json';

export const endpointPattern = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,}$/;

function load(): { enabled: boolean; endpoint: string | null } {
  if (process.env.YS_CONTACT_FIXTURE === '1') return { enabled: true, endpoint: 'https://formspree.io/f/fixture0001' };
  const c = config as { endpoint: string | null; approvedBy: string | null; approvedOn: string | null };
  if (!c.endpoint) return { enabled: false, endpoint: null };
  if (!endpointPattern.test(c.endpoint) || !c.approvedBy || !c.approvedOn) {
    throw new Error('contact.json: the endpoint must look like https://formspree.io/f/<id> and approvedBy and approvedOn are required');
  }
  return { enabled: true, endpoint: c.endpoint };
}

export const contact = load();
