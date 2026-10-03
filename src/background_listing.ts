export type ListingInput = {
  listingId: string;
  imageFile: string;
  filename: string;
  format: string;
  riskScore: number;
};

export type ListingDecision = {
  listingId: string;
  status: "ready" | "manual_review";
  event: { type: string; listingId: string; detail: string };
};

export function decideListing(listingId: string, riskScore: number, processedImage: Record<string, unknown>): ListingDecision {
  const status = riskScore < 0.35 && Object.keys(processedImage).length > 0 ? "ready" : "manual_review";
  return {
    listingId,
    status,
    event: {
      type: status === "ready" ? "listing.image_approved" : "listing.review_requested",
      listingId,
      detail: status === "ready" ? "Background removed and image accepted" : "Risk score requires a human check",
    },
  };
}
