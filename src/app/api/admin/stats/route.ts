import { NextResponse } from "next/server";
import { getBuddySceneBreakdown, getBuddyStatus } from "@/lib/buddies";
import { getVipAggregateStats } from "@/lib/vip-ledger";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const authorization = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (adminSecret && authorization !== adminSecret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const buddyStatus = getBuddyStatus();
  const vipStats = getVipAggregateStats();
  const topScenes = getBuddySceneBreakdown().slice(0, 5);

  return NextResponse.json({
    ok: true,
    overview: {
      online_now: buddyStatus.online_count,
      focusing_now: buddyStatus.focusing_count,
      total_users: vipStats.total_users,
      active_vip_count: vipStats.active_vip_count,
      total_revenue: vipStats.total_revenue,
      referred_conversion_count: vipStats.referred_conversion_count,
      total_focus_seconds: vipStats.total_focus_seconds,
      total_completed_sessions: vipStats.total_completed_sessions,
    },
    top_scenes: topScenes,
    timestamp: new Date().toISOString(),
  });
}
