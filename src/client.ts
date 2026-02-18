import { requestAccessToken, type CachedToken } from "./auth.js";
import type { ApiRequestOptions, ResolvedConfig } from "./types.js";

function appendQuery(url: URL, query?: Record<string, unknown>): void {
  if (!query) {
    return;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }
      continue;
    }

    url.searchParams.set(key, String(value));
  }
}

function toUrl(baseUrl: string, path: string): URL {
  if (/^https?:\/\//i.test(path)) {
    return new URL(path);
  }

  return new URL(path.startsWith("/") ? path : `/${path}`, `${baseUrl}/`);
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export class TraduoraClient {
  private readonly config: ResolvedConfig;
  private tokenCache?: CachedToken;

  public constructor(config: ResolvedConfig) {
    this.config = config;
  }

  public async getToken(): Promise<CachedToken> {
    if (this.tokenCache && this.tokenCache.expiresAtEpochMs > Date.now()) {
      return this.tokenCache;
    }

    this.tokenCache = await requestAccessToken(this.config);
    return this.tokenCache;
  }

  private async fetchWithAuth(
    method: string,
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<Response> {
    const token = await this.getToken();
    const url = toUrl(this.config.baseUrl, path);
    appendQuery(url, options.query);

    const headers = {
      accept: "application/json",
      authorization: `Bearer ${token.accessToken}`,
      ...(this.config.defaultHeaders ?? {}),
      ...(options.headers ?? {}),
    } as Record<string, string>;

    const hasBody = options.body !== undefined;
    if (hasBody && !headers["content-type"]) {
      headers["content-type"] = "application/json";
    }

    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorPayload = await parseResponse(response);
      const rendered =
        typeof errorPayload === "string" ? errorPayload : JSON.stringify(errorPayload, null, 2);

      throw new Error(
        `API request failed (${response.status} ${response.statusText}) ${method.toUpperCase()} ${url.pathname}\n${rendered}`
      );
    }

    return response;
  }

  public async request<T = unknown>(
    method: string,
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const response = await this.fetchWithAuth(method, path, options);
    return (await parseResponse(response)) as T;
  }

  public async requestBuffer(
    method: string,
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<Buffer> {
    const response = await this.fetchWithAuth(method, path, options);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
