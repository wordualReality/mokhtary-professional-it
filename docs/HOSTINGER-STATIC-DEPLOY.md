# Hostinger Static Deploy — mokhtary.de

Kurzanleitung für den Launch auf Hostinger Webspace (Apache, statisches Hosting).

## Build

```bash
rm -rf dist .astro
npm run build
```

Der Build muss mit Exit Code `0` enden.

## Upload

| Quelle | Ziel |
|---|---|
| **Gesamter Inhalt** von `dist/` | Hostinger `public_html/` |

Upload only the **contents** of `dist/` — not the `dist` folder wrapper, not `src/`, `node_modules/`, or `.git`.

**Nicht hochladen:**

- `src/`
- `node_modules/`
- `.env` (nur `.env.example` im Repo)
- Repo-Root / Git-Metadaten (`.git`, etc.)
- `dist/` als Ordner-Wrapper — nur den **Inhalt** von `dist/` kopieren

**Keine `.htaccess`-Root-Redirects** — alte Redirect-Regeln auf Hostinger entfernen, falls noch vorhanden.

## Vor dem Upload prüfen

```bash
test -f dist/index.html
test -f dist/en/index.html
test -f dist/impressum/index.html
test -f dist/datenschutz/index.html
test -d dist/_astro
```

## Smoke-Test (nach Upload)

| Route | Erwartung |
|---|---|
| `/` | 200 — Professional IT DE |
| `/en` | 200 — Professional IT EN |
| `/impressum` | 200 — Impressum |
| `/datenschutz` | 200 — Datenschutz |
| `/en/imprint` | 200 — Imprint EN |
| `/en/privacy` | 200 — Privacy EN |

Diese Routen dürfen **nicht** existieren: `/professional-it`, `/profil`, `/seo`, `/it-consulting`.

Optional per Terminal:

```bash
curl -I https://mokhtary.de/
curl -I https://mokhtary.de/en
```

Assets unter `/_astro/`, `/images/`, `/videos/` sollten mit HTTP 200 antworten.

## Professional IT Standalone-Paket

```bash
npm run package:hostinger
```

Erzeugt `release/professional-it-hostinger/` — nur diesen Ordner-Inhalt nach `public_html/` hochladen. Details siehe `release/professional-it-hostinger/README-DEPLOY.txt` nach dem Packaging-Lauf.
