import { InfraiClient } from "./infrai_client.ts";
import { decideListing, type ListingInput } from "./background_listing.ts";
import { z } from "zod";

const apiKey = process.env.INFRAI_API_KEY;
if (!apiKey) throw new Error("Set INFRAI_API_KEY before running the example");

const listingBody = z.object({
  listingId: z.string().min(1),
  imageFile: z.string().min(1),
  filename: z.string().min(1),
  format: z.string().min(1),
  riskScore: z.number().min(0).max(1),
});

const input: ListingInput = listingBody.parse({
  listingId: process.env.LISTING_ID ?? "demo-card-001",
  imageFile: process.env.IMAGE_DATA ?? "base64-image-data",
  filename: process.env.IMAGE_FILENAME ?? "card-front.png",
  format: "png",
  riskScore: Number(process.env.RISK_SCORE ?? "0.18"),
});

const client = new InfraiClient(apiKey);
const image = await client.upload(input.imageFile, input.filename, `listing-${input.listingId}-upload`);
let processedImageId: string | undefined;
try {
  const processed = await client.removeBackground(image, input.format, `listing-${input.listingId}-background`);
  processedImageId = typeof processed.image_id === "string" ? processed.image_id : undefined;
  const decision = decideListing(input.listingId, input.riskScore, processed);
  console.log(JSON.stringify({ decision, processed }, null, 2));
} finally {
  try {
    if (processedImageId) await client.deleteImage(processedImageId);
  } finally {
    await client.deleteImage(image);
  }
}
