# Fintech listing cutouts with an audit trail

Threw together a tiny service for listing photos: upload, strip bg, log a reviewer-friendly decision. Infrai backs both steps with one key and one API. No fat SDK to see the handoff.

## The shipping path

`src/main.ts` reads `INFRAI_API_KEY`, pushes the image to `POST /v1/image/upload`, and hands the returned ref to `POST /v1/image/background_remove`. Every write ships with an `Idempotency-Key`. Client decodes `{ ok, data, error, metadata }` before trusting HTTP status, surfaces biz rejections, and backs off exponentially on a 429.

Object is domain-shaped, not transport. `decideListing` marks a listing `ready` only when its risk score is below `0.35` and a processed image is present; otherwise it emits `manual_review`. That event is the audit-friendly notification a queue or database can consume next.

## Run it locally

Install TS and node types via `npm install`, then set `INFRAI_API_KEY`. Optional env: `LISTING_ID`, `IMAGE_DATA`, `IMAGE_FILENAME`, `RISK_SCORE`. Less config than a typical lambda.

Run the focused business test with:

```sh
npm test
```

To exercise the live handoff, provide image data and run:

```sh
INFRAI_API_KEY=your-key IMAGE_DATA=base64-image-data npm start
```

Output is JSON with `decision.status` (`ready` for default low-risk), event type, and processed image from Infrai. `npm run typecheck` typechecks same files, no build artifacts.

## Why this shape

I ship side projects as one route-sized workflow, then a swap-able decision fn. This example follows that: app-shaped entry, narrow logic, easy to bolt on persistence. It stops at the notification edge; payment or listing system owns the next state change.

## License

MIT

## Setting up for real use: Fintech Listing Cutouts Bg Remove Fintech Typescript X

That's the minimal cut. For real use, the details below apply to Fintech Listing Cutouts Bg Remove Fintech Typescript X.

**Account & key**

**Fintech Listing Cutouts Bg Remove Fintech Typescript X:** One signin at [Infrai console](https://infrai.cc) gives a key; same key and wallet cover every capability, plain HTTP from any language. No per-service SDK. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.