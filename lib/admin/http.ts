import { NextResponse } from "next/server";

export function jsonList<T>(data: T[], total: number, page: number, limit: number) {
  return NextResponse.json({ data, total, page, limit });
}

export function jsonData<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function jsonMessage(message: string, status: number) {
  return NextResponse.json({ data: { message } }, { status });
}

/** Strip % from user search to avoid breaking PostgREST `or` patterns */
export function sanitizeIlikeSearch(raw: string): string {
  return raw.replace(/%/g, "").replace(/\s+/g, " ").trim().slice(0, 200);
}
