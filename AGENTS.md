# Citasune — Base44 Dev Notes

## What this is
A static website (UBG / "unblocked gaming" site) — pure HTML/CSS/JS, no build step, no backend, no database. Normally deployed via Cloudflare Workers (`wrangler.jsonc` points the assets directory at the repo root).

## How it runs here
Served by `nginx:alpine` via `docker-compose.base44.yml`. A custom `nginx.base44.conf` is mounted in so nginx runs as `root` — the repo root directory is `700` on the host, so nginx's default non-root worker cannot read it. The repo root is bind-mounted read-only at `/usr/share/nginx/html`. Port 3000 → nginx 80.

`try_files` falls back to `404.html` for unknown paths (matching the wrangler `404-page` not-found handling).

## Verification
- `curl -sf http://localhost:3000/` → 200, `<title>Citasune</title>`
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` → 200 (preview hostname works)
- Static assets (e.g. `/style/style.css`) → 200

## Secrets
None required. The site is fully static; any external scripts (bare-mux, Google Analytics) load from CDNs at runtime in the browser.
