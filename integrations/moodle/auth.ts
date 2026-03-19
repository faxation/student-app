/**
 * Moodle authentication — token acquisition.
 * Credentials are read exclusively from environment variables.
 * Tokens are never persisted to disk.
 */

import type { MoodleTokenResponse } from "./types";

export class MoodleAuthError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "MoodleAuthError";
  }
}

/**
 * Acquire a web-service token from Moodle's /login/token.php endpoint.
 * Uses the `moodle_mobile_ws` service which is enabled by default.
 */
export async function getToken(): Promise<string> {
  const baseUrl = process.env.MOODLE_BASE_URL;
  const username = process.env.MOODLE_USERNAME;
  const password = process.env.MOODLE_PASSWORD;

  if (!baseUrl) throw new MoodleAuthError("MOODLE_BASE_URL is not set");
  if (!username) throw new MoodleAuthError("MOODLE_USERNAME is not set");
  if (!password) throw new MoodleAuthError("MOODLE_PASSWORD is not set");

  const url = new URL("/login/token.php", baseUrl);
  url.searchParams.set("username", username);
  url.searchParams.set("password", password);
  url.searchParams.set("service", "moodle_mobile_app");

  const res = await fetch(url.toString(), {
    method: "POST",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new MoodleAuthError(
      `Token request failed: HTTP ${res.status}`,
      "http_error",
    );
  }

  const data: MoodleTokenResponse = await res.json();

  if (data.error || !data.token) {
    throw new MoodleAuthError(
      data.error ?? "No token returned",
      data.errorcode ?? "unknown",
    );
  }

  return data.token;
}
