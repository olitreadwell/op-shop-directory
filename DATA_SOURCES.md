# Data sources

All sources are public. Scrapers live in `src/lib/scrapers/`, run daily via
Vercel Cron, and record every run in `scrapes` (DB mode) or
`logs/scrapes.jsonl` (snapshot mode) with status, items found and items new.

## Working now

| Source | What we get | Status |
| --- | --- | --- |
| Mary Potter Hospice shop locations (`marypotter.org.nz/shops/shop-locations-and-hours/`) | 8 Wellington region hospice shops, addresses, phones, hours | ✅ curated 2026-08-30 |
| Vinnies shop locations (`svdp.org.nz/our-shops/`) | 8 Wellington region St Vincent de Paul shops | ✅ curated 2026-08-30 |
| Salvation Army Family Store locator (`salvationarmy.org.nz/location/*-family-store/`) | 11 Wellington region Family Stores | ✅ curated 2026-08-30 |
| OpenStreetMap Nominatim | coordinates for every listing | ✅ curated 2026-08-30 |
<!-- SEED-SOURCES -->

Projects run `pnpm run setup` to list their own initial sources here; the
scraper framework in `src/lib/scrapers/` turns each into a `Scraper`.

## Best-effort (fetched, no structured extraction yet)

| Source | What we want | Status |
| --- | --- | --- |
| _(add sources here as scrapers land)_ | | ⚠️ |

## Key-gated (enable via env)

| Source | Env var | Notes |
| --- | --- | --- |
| _(add keyed APIs here, e.g. Eventfinda/Meetup)_ | `..._API_KEY` | Free key at the provider portal |

## Planned

- Scrapers for SPCA, Red Cross and independent op shops (addresses live
  behind JS maps on those sites — headless-browser pass needed)
- Headless-browser fallback for JS-rendered listing pages
- Enrichment passes (socials, contact, coordinates) with sources per field

## Rules

- Respect `robots.txt` (enforced in `src/lib/scrapers/http.ts`)
- 500ms+ delay between requests per source
- 15s request timeout; failures are recorded, never fatal
- No paywalled, logged-in, or private data. Ever.
- Update this table when a source changes status — it is the project's
  transparency record.
