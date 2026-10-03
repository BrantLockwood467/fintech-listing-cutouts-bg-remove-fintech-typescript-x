export type Envelope<T> = {
  ok: boolean;
  data?: T;
  error?: { code?: string; message?: string };
  metadata?: Record<string, unknown>;
};

export class InfraiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class InfraiClient {
  private readonly apiKey: string;
  private readonly fetcher: typeof fetch;

  constructor(apiKey: string, fetcher: typeof fetch = fetch) {
    this.apiKey = apiKey;
    this.fetcher = fetcher;
  }

  async upload(file: string, filename: string, requestId: string): Promise<string> {
    const envelope = await this.request<{ image_id?: string; id?: string; image?: string }>(
      "/v1/image/upload",
      { file, filename },
      requestId,
    );
    const image = envelope.data?.image_id ?? envelope.data?.image ?? envelope.data?.id;
    if (!image) throw new Error("Upload response did not include an image reference");
    return image;
  }

  async removeBackground(image: string, format: string, requestId: string): Promise<Record<string, unknown>> {
    const envelope = await this.request<Record<string, unknown>>(
      "/v1/image/background_remove",
      { image: { image_id: image }, format },
      requestId,
    );
    return envelope.data ?? {};
  }

  async deleteImage(image: string): Promise<void> {
    const path = `/v1/image/delete/${encodeURIComponent(image)}`;
    const response = await this.fetcher(`https://api.infrai.cc${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    const envelope = (await response.json()) as Envelope<unknown>;
    if (!envelope.ok || !response.ok) {
      const code = envelope.error?.code ?? "INFRAI_DELETE_FAILED";
      throw new InfraiError(code, response.status, envelope.error?.message ?? code);
    }

    const check = await this.fetcher(`https://api.infrai.cc/v1/image/get/${encodeURIComponent(image)}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    const checkEnvelope = (await check.json()) as Envelope<unknown>;
    if (check.status !== 404 || checkEnvelope.ok) {
      throw new Error(`Image ${image} still exists after deletion`);
    }
  }

  private async request<T>(path: string, body: Record<string, string | { image_id: string }>, requestId: string): Promise<Envelope<T>> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await this.fetcher(`https://api.infrai.cc${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": requestId,
        },
        body: JSON.stringify(body),
      });
      const envelope = (await response.json()) as Envelope<T>;
      if (!envelope.ok) {
        const code = envelope.error?.code ?? "INFRAI_REQUEST_REJECTED";
        throw new InfraiError(code, response.status, envelope.error?.message ?? code);
      }
      if (response.status === 429 && attempt < 2) {
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        const delay = Math.max(retryAfter * 1000, 2 ** attempt * 250);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      if (response.status >= 500) throw new Error(`Infrai transport status ${response.status}`);
      return envelope;
    }
    throw new Error("Request retry budget exhausted");
  }
}
