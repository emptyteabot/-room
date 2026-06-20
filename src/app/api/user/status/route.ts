import { NextResponse } from "next/server";
import { getVipUserStatus } from "@/lib/vip-ledger";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const anonymousUserId = String(searchParams.get("anonymous_user_id") ?? "").trim();

  if (!anonymousUserId) {
    return NextResponse.json({ ok: false, error: "missing_anonymous_user_id" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    ...getVipUserStatus(anonymousUserId),
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { anonymous_user_id?: string };
  const anonymousUserId = String(payload.anonymous_user_id ?? "").trim();

  if (!anonymousUserId) {
    return NextResponse.json({ ok: false, error: "missing_anonymous_user_id" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    ...getVipUserStatus(anonymousUserId),
  });
}
