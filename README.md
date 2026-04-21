# Memact LandingPage

Version: `v2.0`

This is the public landing page for Memact.

Memact is positioned as:

```text
Answers with citations from your own consumed digital activity.
```

The landing page is intentionally static and Render-ready. It includes an interactive sample demo that shows how Memact answers a thought/question using citation links from sample captured activity.

## What This Page Shows

- a minimal Memact hero
- an interactive citation-backed answer demo
- real clickable citation links
- a short explanation of the six-engine architecture
- strict visual consistency with the current Memact Interface style

## Local Preview

```powershell
cd C:\Users\sujay\Downloads\memact_ai\LandingPage
python -m http.server 8000 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8000
```

## Render Deployment

`render.yaml` is configured as a static site.

Use the repo root as the static publish path.

Render can build with:

```text
echo "Memact landing ready"
```

## Design Rules

- minimal and uncluttered
- `#00011B` plus white only
- mobile-first and safe-area aware
- no unsupported claims
- every demo answer includes citation links
- demo data is clearly sample activity

## License

See `LICENSE`.
