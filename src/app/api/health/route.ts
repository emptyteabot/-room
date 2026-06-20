import { NextResponse } from "next/server";
import { ambienceTracks, focusScenes, musicTracks } from "@/lib/scenes";

export const dynamic = "force-dynamic";

const originHost = "43.135.51.214";

export function GET() {
  const videoHosts = focusScenes.map((scene) => new URL(scene.videoUrl).hostname);
  const posterHosts = focusScenes.map((scene) => new URL(scene.posterUrl).hostname);
  const audioHosts = [...musicTracks, ...ambienceTracks].map((track) => new URL(track.url).hostname);
  const mediaHosts = Array.from(new Set([...videoHosts, ...posterHosts, ...audioHosts])).sort();
  const externalFallbackHosts = ["assets.mixkit.co", "images.unsplash.com", "cdn.pixabay.com"];
  const fallbackMediaHosts = mediaHosts.filter((host) => externalFallbackHosts.includes(host));

  return NextResponse.json({
    ok: true,
    version: process.env.npm_package_version ?? "0.1.0",
    scenes: focusScenes.length,
    media_hosts: mediaHosts,
    fallback_media_hosts: fallbackMediaHosts,
    mainland_cdn_ready: fallbackMediaHosts.length === 0,
    origin_media_leak: mediaHosts.includes(originHost),
    worker_origin_locked: true,
    backup_webhook_enabled: Boolean(process.env.FOCUS_ROOM_BACKUP_WEBHOOK_URL),
    timestamp: new Date().toISOString(),
  });
}
