import { NextResponse } from "next/server";
import { getBuddyStatus, updateBuddyHeartbeat } from "@/lib/buddies";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sceneId = String(searchParams.get("scene_id") ?? "").trim();

  return NextResponse.json({
    ok: true,
    ...getBuddyStatus(sceneId || undefined),
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    anonymous_user_id?: string;
    scene_id?: string;
    scene_title?: string;
    is_focusing?: boolean;
    current_task?: string;
  };
  const anonymousUserId = String(payload.anonymous_user_id ?? "").trim();
  const sceneId = String(payload.scene_id ?? "").trim();
  const sceneTitle = String(payload.scene_title ?? "").trim();
  const currentTask = String(payload.current_task ?? "").trim();

  if (!anonymousUserId || !sceneId || !sceneTitle) {
    return NextResponse.json({ ok: false, error: "invalid_heartbeat" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    ...(await updateBuddyHeartbeat({
      anonymousUserId,
      sceneId,
      sceneTitle,
      isFocusing: Boolean(payload.is_focusing),
      currentTask,
    })),
  });
}
