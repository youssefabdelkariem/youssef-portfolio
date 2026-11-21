// FrameSentry beta application form enhancement.
// Without JavaScript, the form posts directly to the configured endpoint.
// With JavaScript, it validates fields inline and submits via fetch with in-page confirmation.

const form = document.querySelector<HTMLFormElement>('#beta-form');
const statusEl = document.querySelector<HTMLElement>('#beta-status');
const done = document.querySelector<HTMLElement>('#beta-done');

if (form && statusEl && done) {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type="hidden"]), select, textarea')]
    .filter((f) => f.name !== '_gotcha');

  const messageFor = (f: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string => {
    const v = f.validity;
    if (v.valueMissing) {
      return f instanceof HTMLInputElement && f.type === 'checkbox'
        ? 'Please tick the box to agree.'
        : f.tagName === 'SELECT'
          ? 'Please choose an option.'
          : 'This field is required.';
    }
    if (v.typeMismatch) return 'Please enter a valid email address, for example name@example.com.';
    if (v.tooShort) return 'Please write at least a brief note (15 characters or more).';
    return f.validationMessage;
  };

  const clear = (f: Element) => {
    f.removeAttribute('aria-invalid');
    const e = f.closest('.field')?.querySelector('.err');
    if (e) e.remove();
  };

  const flag = (f: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    clear(f);
    if (f.checkValidity()) return true;
    f.setAttribute('aria-invalid', 'true');
    const p = document.createElement('p');
    p.className = 'err';
    p.id = `${f.id}-err`;
    p.textContent = messageFor(f);
    f.closest('.field')?.append(p);
    const ids = (f.getAttribute('aria-describedby') ?? '').split(' ').filter((x) => x && !x.endsWith('-err'));
    f.setAttribute('aria-describedby', [...ids, p.id].join(' '));
    return false;
  };

  for (const f of fields) {
    f.addEventListener('blur', (e) => {
      if ((e as FocusEvent).relatedTarget === button) return;
      if (f.value || f.getAttribute('aria-invalid')) flag(f);
    });
    f.addEventListener('input', () => {
      if (f.getAttribute('aria-invalid')) flag(f);
    });
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    statusEl.textContent = '';
    const bad = fields.filter((f) => !flag(f));
    if (bad.length) {
      statusEl.textContent = `Please fix ${bad.length === 1 ? 'one field' : `${bad.length} fields`} and submit again.`;
      bad[0].focus();
      return;
    }
    if (button) {
      button.disabled = true;
      button.textContent = 'Submitting...';
    }
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch {
      statusEl.textContent = 'Sorry, your application could not be submitted. Please check your connection and try again.';
      if (button) {
        button.disabled = false;
        button.textContent = 'Apply for Beta';
      }
    }
  });
}
