import { NextResponse } from "next/server";
import { focusScenes } from "@/lib/scenes";

export const dynamic = "force-dynamic";

const originHost = "43.135.51.214";

export function GET() {
  const videoHosts = focusScenes.map((scene) => new URL(scene.videoUrl).hostname);
  const posterHosts = focusScenes.map((scene) => new URL(scene.posterUrl).hostname);
  const mediaHosts = Array.from(new Set([...videoHosts, ...posterHosts])).sort();

  return NextResponse.json({
    ok: true,
    version: process.env.npm_package_version ?? "0.1.0",
    scenes: focusScenes.length,
    media_hosts: mediaHosts,
    origin_media_leak: mediaHosts.includes(originHost),
    worker_origin_locked: true,
    backup_webhook_enabled: Boolean(process.env.FOCUS_ROOM_BACKUP_WEBHOOK_URL),
    timestamp: new Date().toISOString(),
  });
}
