# Memact Landing Page

Version: `v2.0`

This repo is the public marketing/demo page for Memact.

It owns one job:

```text
show the product idea quickly before the full Website app loads
```

The production app lives in [Website](https://github.com/Memact/Website).

## What This Repo Owns

- Static landing page.
- Interactive demo flow.
- SEO files for the public website.
- Render static-site configuration.
- Product copy for visitors, not internal architecture docs.

## Local Preview

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8000
```

## Render Deployment

`render.yaml` is configured for a static site.

Use the repo root as the static publish path.

Build command:

```text
echo "Memact landing ready"
```

## SEO

After `https://www.memact.com` is live:

1. Add `memact.com` in Google Search Console.
2. Verify the domain with the DNS TXT record Google provides.
3. Submit `https://www.memact.com/sitemap.xml`.
4. Inspect `https://www.memact.com/`.
5. Request indexing.

## Design Rules

- minimal
- `#00011B` and white
- mobile-safe
- no unsupported claims
- no internal architecture clutter

## License

See `LICENSE`.
