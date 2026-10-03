import test from "node:test";
import assert from "node:assert/strict";
import { decideListing } from "../src/background_listing.ts";

test("low-risk listing becomes ready after a processed image arrives", () => {
  const result = decideListing("listing-42", 0.2, { image: "signed-result" });
  assert.equal(result.status, "ready");
  assert.equal(result.event.type, "listing.image_approved");
});

test("higher-risk listing is routed to manual review", () => {
  const result = decideListing("listing-43", 0.8, { image: "signed-result" });
  assert.equal(result.status, "manual_review");
  assert.equal(result.event.type, "listing.review_requested");
});
