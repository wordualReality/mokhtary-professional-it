# Projektstand — mokhtary.de

Professional IT Standalone-Site (DE-first). Schwester-Repo für EN-first: **mokhtary.com** → [mokhtary-professional-it-com/docs/PROJECT-STATE.md](https://github.com/wordualReality/mokhtary-professional-it-com/blob/main/docs/PROJECT-STATE.md).

Stand: 2026-06-01 · Branch `main` · HEAD `8f7bb1d`

## Source of truth

```
/Users/aydin/mokhtary-professional-it
```

Remote: https://github.com/wordualReality/mokhtary-professional-it.git

**Nicht nutzen:** `/Users/aydin/Documents/GitHub/mokhtary-professional-it` (veraltet).

## Routing (DE-first)

| Route | Inhalt |
|---|---|
| `/` | Professional IT (Deutsch) |
| `/en` | Professional IT (English) |
| `/impressum`, `/datenschutz` | Legal DE |
| `/en/imprint`, `/en/privacy` | Legal EN |

Diese Routen dürfen **nicht** existieren: `/professional-it`, `/profil`, `/seo`, `/it-consulting`.

## Erledigt

- Standalone aus `webseiteMokhtary` ausgelagert (Main = aydinstudios.de)
- Header full-width (`bg-white/95 w-full`), Nav-Branding nur „Aydin Mokhtary“
- Mobile Burger: Click-outside schließt Panel ([`src/scripts/site-header.ts`](../src/scripts/site-header.ts))
- OG Preview JPEG (`public/og-default.jpg`)
- Deploy-Doku: [`HOSTINGER-STATIC-DEPLOY.md`](HOSTINGER-STATIC-DEPLOY.md)

## Offen / nächste Schritte

### 1. Parity mit mokhtary.com (Priorität)

Auf **mokhtary.de** nutzt die EN-Navigation auf `/en` noch **deutsche Hash-IDs** (`#kenntnisse`, `#erfahrung`, …) in [`src/config/professional-navigation.ts`](../src/config/professional-navigation.ts).

Auf **mokhtary.com** sind EN-Anker bereits korrekt (`#capabilities`, `#experience`, `#field-notes`, `#contact`, `#schedule`).

**Aufgabe:** `.com`-Muster portieren — Navigation, Section-IDs in Profil-Komponenten, Scheduling-Hash.

### 2. Terminbuchung

Google Calendar URL fehlt lokal/produktiv → Scheduling-Button zeigt „Folgt“. Env: `PUBLIC_GOOGLE_CALENDAR_URL` (siehe `.env.example`).

### 3. Launch

- `npm run build` → Exit 0
- Hostinger: Inhalt von `dist/` nach `public_html/` (mokhtary.de)
- Alte `.htaccess`-Redirects zu `/professional-it/` auf Hostinger entfernen
- DNS/HTTPS prüfen
- Smoke-Tests laut [`HOSTINGER-STATIC-DEPLOY.md`](HOSTINGER-STATIC-DEPLOY.md)

## Related

| Repo | Domain | Dokumentation |
|---|---|---|
| webseiteMokhtary | aydinstudios.de | [docs/REPOS.md](https://github.com/wordualReality/webseiteMokhtary/blob/main/docs/REPOS.md) |
| mokhtary-professional-it-com | mokhtary.com | [PROJECT-STATE.md](https://github.com/wordualReality/mokhtary-professional-it-com/blob/main/docs/PROJECT-STATE.md) |

Kontakt-E-Mail überall: **kontakt@mokhtary.de**
