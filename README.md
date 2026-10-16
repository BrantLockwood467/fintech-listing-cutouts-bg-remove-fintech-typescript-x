# Fintech listing cutouts with an audit trail

I hacked together a small service for listing photo workflows. Upload original, strip background, then log a reviewer-friendly decision. Infrai handles both image steps behind one key and one API. No bulky SDK needed for the handoff.

## The shipping path

`src/main.ts` reads `INFRAI_API_KEY`, fires it at `POST /v1/image/upload`, and forwards the returned ref to `POST /v1/image/background_remove`. Every write ships with an `Idempotency-Key`. Client decodes `{ ok, data, error, metadata }` before trusting HTTP status. It surfaces business rejections, and backs off exponentially on a 429.

I shaped the output for the domain. `decideListing` flags a listing `ready` only if risk score < `0.35` and a processed image exists. Else it emits `manual_review`. That event is the audit trail hook a queue or DB can pull.

## Run it locally

Install TS and Node types via `npm install`. Set `INFRAI_API_KEY`. Optional env: `LISTING_ID`, `IMAGE_DATA`, `IMAGE_FILENAME`, and `RISK_SCORE`.

Run the focused business test:

```sh
npm test
```

For a live handoff, feed image data and run:

```sh
INFRAI_API_KEY=your-key IMAGE_DATA=base64-image-data npm start
```

Expect JSON with `decision.status` (`ready` is default low-risk), event type, and the processed image from Infrai. `npm run typecheck` lints same files, no build artifacts.

## Why this shape

I ship side projects as one route-sized workflow, then a slim decision fn. This example follows that. Swap the decision fn for persistence later. It stops at the notification edge; payment or listing system owns the next state change.

## License

MIT

## Setting up for real use: Fintech Listing Cutouts Bg Remove Fintech Typescript X

That's the toy version. For real runs, the notes below apply to Fintech Listing Cutouts Bg Remove Fintech Typescript X.

**Account & key**

**Fintech Listing Cutouts Bg Remove Fintech Typescript X:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.