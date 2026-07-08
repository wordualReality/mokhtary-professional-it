#!/usr/bin/env bash
# Package Professional IT static release for Hostinger (root one-pager).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
RELEASE="$ROOT/release/professional-it-hostinger"

echo "==> npm run build"
cd "$ROOT"
npm run build

if [[ ! -f "$DIST/index.html" ]]; then
  echo "ERROR: $DIST/index.html not found after build." >&2
  exit 1
fi

echo "==> Clean release folder"
rm -rf "$RELEASE"
mkdir -p "$RELEASE"

copy_if_exists() {
  local src="$1"
  local dest="$2"
  if [[ -e "$src" ]]; then
    mkdir -p "$(dirname "$dest")"
    cp -R "$src" "$dest"
  else
    echo "WARN: missing optional source: $src" >&2
  fi
}

echo "==> Copy dist to release (root routes)"
cp -R "$DIST"/. "$RELEASE/"

PATHS_FILE="$(mktemp)"
trap 'rm -f "$PATHS_FILE"' EXIT

add_path() {
  local p="$1"
  [[ -z "$p" ]] && return 0
  [[ "$p" == /* ]] || return 0
  [[ "$p" == mailto:* ]] && return 0
  [[ "$p" == \#* ]] && return 0
  [[ "$p" == http://* || "$p" == https://* ]] && return 0
  [[ "$p" == /sitemap* ]] && return 0
  p="${p%%\?*}"
  p="${p%%#*}"
  [[ -z "$p" || "$p" == "/" ]] && return 0
  echo "$p" >> "$PATHS_FILE"
}

harvest_from_file() {
  local file="$1"
  grep -oE '(src|href|poster|content)="/[^"]+"' "$file" 2>/dev/null \
    | sed -E 's/^(src|href|poster|content)="//; s/"$//' \
    | while read -r p; do add_path "$p"; done || true
  grep -oE 'url\(/[^)]+\)' "$file" 2>/dev/null \
    | sed -E 's/^url\(\//\//; s/\)$//' \
    | while read -r p; do add_path "$p"; done || true
}

echo "==> Harvest asset paths from HTML"
while IFS= read -r html; do
  harvest_from_file "$html"
done < <(find "$RELEASE" -name '*.html' -type f)

echo "==> Harvest asset paths from _astro CSS"
while IFS= read -r css; do
  harvest_from_file "$css"
done < <(find "$RELEASE/_astro" -name '*.css' -type f 2>/dev/null || true)

echo "==> Copy harvested assets"
sort -u "$PATHS_FILE" | while read -r rel; do
  [[ -z "$rel" ]] && continue
  rel="${rel#/}"
  src="$DIST/$rel"
  dest="$RELEASE/$rel"
  if [[ -e "$src" ]]; then
    mkdir -p "$(dirname "$dest")"
    cp -R "$src" "$dest"
  else
    echo "WARN: referenced asset missing in dist: /$rel" >&2
  fi
done

echo "==> Remove legacy .htaccess if present"
rm -f "$RELEASE/.htaccess"

echo "==> Write robots.txt"
cat > "$RELEASE/robots.txt" <<'EOF'
User-agent: *
Allow: /
Disallow: /styleguide
EOF

echo "==> Verify required routes"
REQUIRED=(
  "index.html"
  "en/index.html"
  "impressum/index.html"
  "datenschutz/index.html"
  "en/imprint/index.html"
  "en/privacy/index.html"
)
for f in "${REQUIRED[@]}"; do
  if [[ ! -f "$RELEASE/$f" ]]; then
    echo "ERROR: missing page file: $f" >&2
    exit 1
  fi
done

echo "==> Verify legacy routes are excluded"
FORBIDDEN=(
  "professional-it"
  "profil"
  "it-consulting"
  "seo"
  "wachstum"
  "webdesign"
  "social-media"
  "systeme"
  "ki-automation"
  "apps"
)
for d in "${FORBIDDEN[@]}"; do
  if [[ -e "$RELEASE/$d" ]]; then
    echo "ERROR: forbidden path in release: $d" >&2
    exit 1
  fi
done

echo "==> Verify exclusions"
for bad in node_modules dist/server package.json package-lock.json; do
  if [[ -e "$RELEASE/$bad" ]]; then
    echo "ERROR: forbidden release content: $bad" >&2
    exit 1
  fi
done

echo "==> Asset integrity check"
MISSING=0
while IFS= read -r html; do
  harvest_from_file "$html"
done < <(find "$RELEASE" -name '*.html' -type f)

while IFS= read -r css; do
  harvest_from_file "$css"
done < <(find "$RELEASE/_astro" -name '*.css' -type f 2>/dev/null || true)

while read -r rel; do
  [[ -z "$rel" ]] && continue
  rel="${rel#/}"
  [[ "$rel" == "favicon.ico" ]] && continue
  if [[ ! -e "$RELEASE/$rel" ]]; then
    echo "ERROR: missing asset in release: /$rel" >&2
    MISSING=1
  fi
done < <(sort -u "$PATHS_FILE")

if [[ "$MISSING" -ne 0 ]]; then
  exit 1
fi

FILE_COUNT="$(find "$RELEASE" -type f | wc -l | tr -d ' ')"

echo "==> Write README-DEPLOY.txt"
cat > "$RELEASE/README-DEPLOY.txt" <<EOF
Professional IT — Hostinger Static Release
==========================================

Dieses Paket ist der statische Upload für Professional IT (Standalone Root One-Pager).

Upload-Ziel: Hostinger public_html/
Nur den Inhalt DIESES Ordners hochladen.

NICHT hochladen:
- src/
- node_modules/
- dist/server/
- das gesamte Repo

Enthaltene Dateien: $FILE_COUNT

Smoke-Test nach Upload:
- /                → 200 — Professional IT DE
- /en              → 200 — Professional IT EN
- /impressum       → 200 — Impressum
- /datenschutz     → 200 — Datenschutz
- /en/imprint      → 200 — Imprint EN
- /en/privacy      → 200 — Privacy EN

Keine Legacy-Routen: /professional-it, /profil, /seo, /it-consulting

Erzeugt: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

echo ""
echo "=========================================="
echo "Professional IT Hostinger package ready"
echo "=========================================="
echo "Build:           exit 0"
echo "Release folder:  $RELEASE"
echo "File count:      $FILE_COUNT"
echo "Top-level:"
ls -1A "$RELEASE" | sed 's/^/  - /'
echo ""
echo "node_modules:    not included"
echo "dist/server:     not included"
echo "Main-business:   not included"
echo "Legal pages:     present"
echo ""
echo "Upload: Copy contents of release/professional-it-hostinger/ to Hostinger public_html/"
