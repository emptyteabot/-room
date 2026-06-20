import { NextResponse } from "next/server";
import { getVipUserStatus, syncVipUserStats } from "@/lib/vip-ledger";

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
  const payload = (await request.json()) as {
    anonymous_user_id?: string;
    stats?: {
      stats_date?: string;
      today_focus_seconds?: number;
      completed_sessions?: number;
      total_focus_seconds?: number;
      current_task?: string;
    };
  };
  const anonymousUserId = String(payload.anonymous_user_id ?? "").trim();

  if (!anonymousUserId) {
    return NextResponse.json({ ok: false, error: "missing_anonymous_user_id" }, { status: 400 });
  }

  if (payload.stats) {
    const statsDate = String(payload.stats.stats_date ?? "").trim();
    const todayFocusSeconds = Number(payload.stats.today_focus_seconds ?? 0);
    const completedSessions = Number(payload.stats.completed_sessions ?? 0);
    const totalFocusSeconds = Number(payload.stats.total_focus_seconds ?? 0);
    const currentTask = String(payload.stats.current_task ?? "").trim();

    if (
      !statsDate ||
      !Number.isFinite(todayFocusSeconds) ||
      !Number.isFinite(completedSessions) ||
      !Number.isFinite(totalFocusSeconds)
    ) {
      return NextResponse.json({ ok: false, error: "invalid_stats" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      ...(await syncVipUserStats({
        anonymousUserId,
        statsDate,
        todayFocusSeconds,
        completedSessions,
        totalFocusSeconds,
        currentTask,
      })),
    });
  }

  return NextResponse.json({
    ok: true,
    ...getVipUserStatus(anonymousUserId),
  });
}
