# Local Workflow — mokhtary-professional-it

## Source of truth (only folder to use)

```
/Users/aydin/mokhtary-professional-it
```

Remote: `https://github.com/wordualReality/mokhtary-professional-it.git`

Do **not** use `Documents/GitHub/mokhtary-professional-it` — that copy is outdated.

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
