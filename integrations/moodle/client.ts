/**
 * Low-level Moodle REST API client.
 * All calls go through callFunction() which handles token, URL
 * construction, error handling, and JSON parsing.
 */

import type { MoodleApiError } from "./types";

export class MoodleApiClientError extends Error {
  constructor(
    message: string,
    public code?: string,
    public debugInfo?: string,
  ) {
    super(message);
    this.name = "MoodleApiClientError";
  }
}

/**
 * Call a Moodle Web Service function and return the parsed JSON response.
 *
 * @param token  - Web service token from auth.getToken()
 * @param wsfunction - The Moodle WS function name (e.g. "core_enrol_get_users_courses")
 * @param params - Additional query parameters for the function
 */
export async function callFunction<T = unknown>(
  token: string,
  wsfunction: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const baseUrl = process.env.MOODLE_BASE_URL;
  if (!baseUrl) throw new MoodleApiClientError("MOODLE_BASE_URL is not set");

  const url = new URL("/webservice/rest/server.php", baseUrl);
  url.searchParams.set("wstoken", token);
  url.searchParams.set("wsfunction", wsfunction);
  url.searchParams.set("moodlewsrestformat", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    throw new MoodleApiClientError(
      `Moodle API HTTP ${res.status} for ${wsfunction}`,
      "http_error",
    );
  }

  const data = await res.json();

  // Moodle returns errors as JSON objects with an "exception" key
  if (data && typeof data === "object" && "exception" in data) {
    const err = data as MoodleApiError;
    throw new MoodleApiClientError(
      err.message ?? `Moodle API error in ${wsfunction}`,
      err.errorcode,
      err.debuginfo,
    );
  }

  return data as T;
}
