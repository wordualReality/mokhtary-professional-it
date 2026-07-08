# Hostinger Static Deploy — mokhtary.de

Kurzanleitung für den Launch auf Hostinger Webspace (Apache, statisches Hosting).

## Build

```bash
npm run build
```

Der Build muss mit Exit Code `0` enden.

## Upload

| Quelle | Ziel |
|---|---|
| **Gesamter Inhalt** von `dist/` | Hostinger `public_html/` |

**Nicht hochladen:**

- `src/`
- `node_modules/`
- `.env` (nur `.env.example` im Repo)
- Repo-Root / Git-Metadaten (`.git`, etc.)
- `dist/` als Ordner-Wrapper — nur den **Inhalt** von `dist/` kopieren

Nach dem Upload muss `public_html/.htaccess` vorhanden sein (kopiert aus `public/.htaccess` beim Build).

## Vor dem Upload prüfen

```bash
test -f dist/.htaccess
test -f dist/professional-it/index.html
test -f dist/professional-it/en/index.html
test -f dist/professional-it/impressum/index.html
test -f dist/professional-it/datenschutz/index.html
```

## Smoke-Test (nach Upload)

| Route | Erwartung |
|---|---|
| `/` | **302** → `/professional-it/` (`.htaccess`) |
| `/professional-it` | 200 — Professional IT DE |
| `/professional-it/en` | 200 — Professional IT EN |
| `/professional-it/impressum` | 200 — Impressum (Professional Shell) |
| `/professional-it/datenschutz` | 200 — Datenschutz (Professional Shell) |
| `/professional-it/en/imprint` | 200 — Imprint EN |
| `/professional-it/en/privacy` | 200 — Privacy EN |
| `/profil` | **301** → `/professional-it` |
| `/it-consulting` | **301** → `/professional-it` |
| `/seo` | **301** → `/professional-it` |

Optional per Terminal:

```bash
curl -I https://mokhtary.de/profil
curl -I https://mokhtary.de/professional-it
```

Assets unter `/_astro/`, `/images/`, `/videos/` sollten mit HTTP 200 antworten.

## Professional IT Standalone-Paket

Für einen Launch **nur** mit Professional IT (ohne Main-Business-Seiten):

```bash
npm run package:hostinger
```

Erzeugt `release/professional-it-hostinger/` — nur diesen Ordner-Inhalt nach `public_html/` hochladen. Details siehe `release/professional-it-hostinger/README-DEPLOY.txt` nach dem Packaging-Lauf.
