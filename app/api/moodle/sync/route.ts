/**
 * POST /api/moodle/sync
 *
 * Server-side route that performs a full Moodle data sync.
 * Credentials are read from environment variables — never sent from the client.
 * Returns normalized MoodleSyncData.
 */

import { NextResponse } from "next/server";
import { syncMoodleData, MoodleAuthError, MoodleApiClientError } from "@/integrations/moodle";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const data = await syncMoodleData();

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error) {
    // Auth errors (bad credentials, missing env vars)
    if (error instanceof MoodleAuthError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          code: error.code ?? "auth_error",
        },
        { status: 401 },
      );
    }

    // API errors (invalid function, permission denied, etc.)
    if (error instanceof MoodleApiClientError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          code: error.code ?? "api_error",
        },
        { status: 502 },
      );
    }

    // Unknown errors — never leak internals
    const msg = error instanceof Error ? error.message : "Unknown sync error";
    console.error("[Moodle Sync]", msg);
    return NextResponse.json(
      { ok: false, error: "Moodle sync failed. Check server logs." },
      { status: 500 },
    );
  }
}
