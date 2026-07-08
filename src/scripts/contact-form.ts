/**
 * @file src/scripts/contact-form.ts
 * @summary Kontaktformular: Validierung, Web3Forms-POST (wenn Key gesetzt) oder Mailto-Fallback.
 */

function escapeForMailto(s: string): string {
  return s.replace(/\r?\n/g, '\n').trim();
}

function readFields(form: HTMLFormElement) {
  const fd = new FormData(form);
  const name = String(fd.get('name') ?? '').trim();
  const email = String(fd.get('email') ?? '').trim();
  const unternehmen = String(fd.get('unternehmen') ?? '').trim();
  const thema = String(fd.get('thema') ?? '').trim();
  const nachricht = String(fd.get('nachricht') ?? '').trim();
  const themaSelect = form.querySelector<HTMLSelectElement>('select[name="thema"]');
  const themaLabel =
    themaSelect?.options[themaSelect.selectedIndex]?.text?.trim() || thema;

  return { name, email, unternehmen, thema, nachricht, themaLabel };
}

function validate(form: HTMLFormElement, status: HTMLElement): boolean {
  const invalid: HTMLElement[] = [];
  form
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[required]')
    .forEach((el) => {
      const ok = !!el.value?.trim();
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok) invalid.push(el);
    });
  if (invalid.length) {
    status.dataset.state = 'error';
    status.textContent = 'Bitte füllen Sie die markierten Felder aus.';
    invalid[0].focus();
    return false;
  }
  return true;
}

async function submitWeb3Forms(
  form: HTMLFormElement,
  accessKey: string,
  status: HTMLElement,
): Promise<void> {
  const { name, email, unternehmen, themaLabel, nachricht } = readFields(form);
  const subjectPrefix = form.dataset.subjectPrefix || 'Anfrage';
  const subject = `${subjectPrefix} · ${themaLabel}`.trim();

  const payload = {
    access_key: accessKey,
    subject,
    name,
    email,
    unternehmen: unternehmen || undefined,
    thema: themaLabel,
    message: nachricht,
    from_name: 'mokhtary.de Kontaktformular',
  };

  status.dataset.state = 'pending';
  status.textContent = 'Wird gesendet …';

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { success?: boolean; message?: string };

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Senden fehlgeschlagen.');
    }

    status.dataset.state = 'success';
    status.textContent = 'Danke — wir melden uns innerhalb von 24 Stunden.';
    form.reset();
  } catch {
    status.dataset.state = 'error';
    status.textContent =
      'Senden hat nicht geklappt. Schreiben Sie uns direkt an kontakt@mokhtary.de.';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function submitMailto(form: HTMLFormElement, status: HTMLElement): void {
  const { name, email, unternehmen, themaLabel, nachricht } = readFields(form);
  const subjectPrefix = form.dataset.subjectPrefix || 'Anfrage';
  const subject = `${subjectPrefix} · ${themaLabel}`.trim();
  const bodyLines = [
    `Name: ${name}`,
    `E-Mail: ${email}`,
    unternehmen ? `Unternehmen: ${unternehmen}` : null,
    `Thema: ${themaLabel}`,
    '',
    'Worum es geht:',
    escapeForMailto(nachricht),
  ].filter(Boolean) as string[];
  const body = bodyLines.join('\n');

  const href = `mailto:kontakt@mokhtary.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.dataset.state = 'success';
  status.textContent = 'Ihr Mail-Programm öffnet sich, Sie können die Nachricht prüfen und abschicken.';
  window.location.href = href;
}

function handle(form: HTMLFormElement, status: HTMLElement): void {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(form, status)) return;

    const accessKey = form.dataset.web3formsKey?.trim();
    if (accessKey) {
      void submitWeb3Forms(form, accessKey, status);
      return;
    }
    submitMailto(form, status);
  });
}

function initContactForms(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-contact-form]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-contact-status]');
    if (status) handle(form, status);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForms, { once: true });
} else {
  initContactForms();
}
