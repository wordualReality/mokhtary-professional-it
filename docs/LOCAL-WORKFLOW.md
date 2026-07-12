# Local Workflow — mokhtary-professional-it

**Projektstand & nächste Schritte:** [`docs/PROJECT-STATE.md`](PROJECT-STATE.md)  
**Alle Repos:** [webseiteMokhtary/docs/REPOS.md](https://github.com/wordualReality/webseiteMokhtary/blob/main/docs/REPOS.md)

## Source of truth (only folder to use)

```
/Users/aydin/mokhtary-professional-it
```

Remote: `https://github.com/wordualReality/mokhtary-professional-it.git`

Do **not** use `Documents/GitHub/mokhtary-professional-it` — that copy is outdated.

Sibling repo for **mokhtary.com** (EN-first): `/Users/aydin/mokhtary-professional-it-com` — [PROJECT-STATE.md](https://github.com/wordualReality/mokhtary-professional-it-com/blob/main/docs/PROJECT-STATE.md)

## Git

```bash
cd /Users/aydin/mokhtary-professional-it
git pull origin main
git add .
git commit -m "your message"
git push
```

Never commit: `dist/`, `release/`, `node_modules/`, `.env`

## Build & Hostinger deploy

```bash
cd /Users/aydin/mokhtary-professional-it
rm -rf dist .astro
npm run build
```

Upload **contents of** `dist/` to Hostinger `public_html/`.

Before upload: delete old `.htaccess` on Hostinger if it contains redirects to `/professional-it/`.
