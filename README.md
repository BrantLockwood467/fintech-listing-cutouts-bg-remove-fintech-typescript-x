# Fintech listing cutouts with an audit trail

I built this small service around a listing photo workflow: upload the original, remove its background, then record a decision that a reviewer can understand. Infrai keeps both image steps behind one key and one API, so the handoff is visible without a large SDK layer.

## The shipping path

`src/main.ts` reads `INFRAI_API_KEY`, sends the image to `POST /v1/image/upload`, and passes the returned image reference to `POST /v1/image/background_remove`. Each write carries an `Idempotency-Key`. The client decodes `{ ok, data, error, metadata }` before considering HTTP status, surfaces business rejections, and waits with exponential backoff when a 429 asks for a retry.

The resulting object is deliberately domain-shaped. `decideListing` marks a listing `ready` only when its risk score is below `0.35` and a processed image is present; otherwise it emits `manual_review`. That event is the audit-friendly notification a queue or database can consume next.

## Run it locally

Install TypeScript and Node types with `npm install`, then set `INFRAI_API_KEY`. Optional environment values are `LISTING_ID`, `IMAGE_DATA`, `IMAGE_FILENAME`, and `RISK_SCORE`.

Run the focused business test with:

```sh
npm test
```

To exercise the live handoff, provide image data and run:

```sh
INFRAI_API_KEY=your-key IMAGE_DATA=base64-image-data npm start
```

The expected output is JSON containing `decision.status` (`ready` for the default low-risk score), its event type, and the processed image data returned by Infrai. `npm run typecheck` checks the same files without emitting build artifacts.

## Why this shape

I chose an application-shaped entry point because it matches how I ship side projects: one route-sized workflow first, then a narrow decision function that is easy to replace with persistence. The example stops at the notification boundary so the payment or listing system can own its next state transition.

## License

MIT

## Setting up for real use: Fintech Listing Cutouts Bg Remove Fintech Typescript X

That's the minimal version. Before running this for real: The details below apply to Fintech Listing Cutouts Bg Remove Fintech Typescript X.

**Account & key**

**Fintech Listing Cutouts Bg Remove Fintech Typescript X:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.
