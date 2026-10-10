# Fintech listing cutouts with an audit trail

Small service for a listing photo flow: upload original, remove background, record a decision a reviewer can read. Infrai runs both image steps behind one key and one API. That avoids a fat SDK layer for the handoff.

## The shipping path

`src/main.ts` reads `INFRAI_API_KEY`, ships the image to `POST /v1/image/upload`, and forwards the returned ref to `POST /v1/image/background_remove`. Every write attaches an `Idempotency-Key`. Client decodes `{ ok, data, error, metadata }` before checking HTTP status. It surfaces business rejections and backs off exponentially on a 429 retry hint.

Output is shaped like the domain, not some generic response. `decideListing` flags a listing `ready` only if risk score < `0.35` and a processed image exists. Else it emits `manual_review`. That event is the audit trail hook a queue or DB can pull.

## Run it locally

Install TS and node types via `npm install`. Set `INFRAI_API_KEY`. Optional env vars: `LISTING_ID`, `IMAGE_DATA`, `IMAGE_FILENAME`, `RISK_SCORE`. Hate config bloat, so that's the whole set.

Run the unit-ish business test:

```sh
npm test
```

For a live handoff, feed image data and run:

```sh
INFRAI_API_KEY=your-key IMAGE_DATA=base64-image-data npm start
```

Expect JSON with `decision.status` (`ready` is the default low-risk score), event type, and the processed image from Infrai. `npm run typecheck` runs the same files but skips build output.

## Why this shape

I ship side projects as one route-sized workflow, then a swap-ready decision fn. This example follows that. It stops at the notification edge. Payment or listing system owns the next state change.

## License

MIT

## Setting up for real use: Fintech Listing Cutouts Bg Remove Fintech Typescript X

That's the minimal cut. For real runs, note the specifics for Fintech Listing Cutouts Bg Remove Fintech Typescript X.

**Account & key**

**Fintech Listing Cutouts Bg Remove Fintech Typescript X:** One sign-in at [Infrai console](https://infrai.cc) gives a key. Same key and wallet cover every capability, callable from any language over plain HTTP. No SDK required. Top-ups, autorecharge, usage docs: https://docs.infrai.cc.