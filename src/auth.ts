import type { AccessTokenResponse, ResolvedConfig } from "./types.js";

export interface CachedToken {
  accessToken: string;
  expiresAtEpochMs: number;
  tokenType: string;
}

function parseExpiry(expiresInRaw: string): number {
  const seconds = Number.parseInt(expiresInRaw, 10);
  if (Number.isNaN(seconds) || seconds <= 0) {
    return 3600;
  }
  return seconds;
}

export async function requestAccessToken(config: ResolvedConfig): Promise<CachedToken> {
  if (config.accessToken) {
    return {
      accessToken: config.accessToken,
      expiresAtEpochMs: Date.now() + 24 * 60 * 60 * 1000,
      tokenType: "bearer",
    };
  }

  if (!config.auth) {
    throw new Error("Missing auth config.");
  }

  const payload =
    config.auth.grantType === "client_credentials"
      ? {
          grant_type: "client_credentials",
          client_id: config.auth.clientId,
          client_secret: config.auth.clientSecret,
        }
      : {
          grant_type: "password",
          username: config.auth.username,
          password: config.auth.password,
        };

  const response = await fetch(`${config.baseUrl}/api/v1/auth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed (${response.status}): ${errorText || response.statusText}`);
  }

  const json = (await response.json()) as AccessTokenResponse;
  const expiresIn = parseExpiry(json.expires_in);
  const expiresAtEpochMs = Date.now() + Math.max(expiresIn - 30, 30) * 1000;

  return {
    accessToken: json.access_token,
    expiresAtEpochMs,
    tokenType: json.token_type,
  };
}
