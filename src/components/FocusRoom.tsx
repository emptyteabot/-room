"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Expand, LogIn, Search, Settings2, Users } from "lucide-react";
import { ControlPanel } from "@/components/ControlPanel";
import { defaultScene, focusScenes } from "@/lib/scenes";
import { useTimerAudio } from "@/hooks/useTimerAudio";

type UserStatus = {
  vip_expires_at: string | null;
  referred_success_count: number;
  stats: UserStats | null;
};

type UserStats = {
  stats_date: string;
  today_focus_seconds: number;
  completed_sessions: number;
  total_focus_seconds: number;
  current_task?: string;
  synced_at: string;
};

type BuddyStatus = {
  online_count: number;
  same_scene_count: number;
  focusing_count: number;
  updated_at: string;
};

export function FocusRoom() {
  const timer = useTimerAudio();
  const initialPromo = getInitialPromo();
  const [sceneId, setSceneId] = useState(initialPromo.sceneId);
  const [immersive, setImmersive] = useState(initialPromo.cinematic);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [buddyStatus, setBuddyStatus] = useState<BuddyStatus | null>(null);
  const [cinematicPromo] = useState(initialPromo.cinematic);
  const shareTimerRef = useRef<number | null>(null);
  const syncedSessionsRef = useRef(0);
  const scene = useMemo(
    () => focusScenes.find((item) => item.id === sceneId) ?? defaultScene,
    [sceneId],
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const referrerId = searchParams.get("ref");
    const storedUserId = window.localStorage.getItem("anonymous_user_id");
    const nextUserId = storedUserId ?? createAnonymousUserId();

    if (!storedUserId) {
      window.localStorage.setItem("anonymous_user_id", nextUserId);
    }

    if (referrerId && referrerId !== nextUserId) {
      window.localStorage.setItem("referrer_id", referrerId);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    return () => {
      if (shareTimerRef.current) {
        window.clearTimeout(shareTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadUserStatus = async () => {
      const anonymousUserId = getAnonymousUserId();
      const response = await fetch(`/focus-room/api/user/status?anonymous_user_id=${encodeURIComponent(anonymousUserId)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as UserStatus & { ok: boolean };

      if (active && payload.ok) {
        setUserStatus({
          vip_expires_at: payload.vip_expires_at,
          referred_success_count: payload.referred_success_count,
          stats: payload.stats,
        });
      }
    };

    void loadUserStatus();
    const intervalId = window.setInterval(() => void loadUserStatus(), 45000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const beat = async () => {
      const response = await fetch("/focus-room/api/buddies/heartbeat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          anonymous_user_id: getAnonymousUserId(),
          scene_id: sceneId,
          scene_title: scene.title,
          is_focusing: timer.isRunning,
          current_task: timer.currentTask,
        }),
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as BuddyStatus & { ok: boolean };

      if (active && payload.ok) {
        setBuddyStatus({
          online_count: payload.online_count,
          same_scene_count: payload.same_scene_count,
          focusing_count: payload.focusing_count,
          updated_at: payload.updated_at,
        });
      }
    };

    void beat();
    const intervalId = window.setInterval(() => void beat(), 30000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [scene.title, sceneId, timer.currentTask, timer.isRunning]);

  useEffect(() => {
    if (timer.completedSessions <= 0 || timer.completedSessions === syncedSessionsRef.current) {
      return;
    }

    syncedSessionsRef.current = timer.completedSessions;
    void syncUserStats({
      stats_date: timer.statsDate,
      today_focus_seconds: timer.todayFocusSeconds,
      completed_sessions: timer.completedSessions,
      total_focus_seconds: timer.totalFocusSeconds,
      current_task: timer.currentTask,
    }).then((nextStatus) => {
      if (nextStatus) {
        setUserStatus(nextStatus);
      }
    });
  }, [
    timer.completedSessions,
    timer.currentTask,
    timer.statsDate,
    timer.todayFocusSeconds,
    timer.totalFocusSeconds,
  ]);

  const showShareToast = () => {
    setShareCopied(true);

    if (shareTimerRef.current) {
      window.clearTimeout(shareTimerRef.current);
    }

    shareTimerRef.current = window.setTimeout(() => setShareCopied(false), 1800);
  };

  const handleShare = () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("ref", getAnonymousUserId());
    const link = shareUrl.toString();

    if (navigator.clipboard && window.isSecureContext) {
      void navigator.clipboard.writeText(link).then(showShareToast);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = link;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    tryCopySelection();
    textarea.remove();
    showShareToast();
  };

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  }, []);

  const startFocus = async () => {
    if (!timer.isRunning) {
      timer.toggle();
    }

    setImmersive(true);
    setDrawerOpen(false);

    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  };

  const moveScene = (direction: -1 | 1) => {
    const currentIndex = focusScenes.findIndex((item) => item.id === scene.id);
    const nextIndex = (currentIndex + direction + focusScenes.length) % focusScenes.length;
    setSceneId(focusScenes[nextIndex].id);
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <video
        key={scene.videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
        src={scene.videoUrl}
        poster={scene.posterUrl}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={`absolute inset-0 transition duration-500 ${cinematicPromo ? "bg-black/0" : immersive ? "bg-black/18" : "bg-black/40"}`} />
      {!cinematicPromo ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.1),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.52),rgba(0,0,0,0.08)_48%,rgba(0,0,0,0.48))]" />
      ) : null}
      {!cinematicPromo ? (
        <Header
          immersive={immersive}
          sceneTitle={scene.title}
          onOpenSettings={() => setDrawerOpen(true)}
          onToggleImmersive={() => setImmersive((value) => !value)}
          onToggleFullscreen={toggleFullscreen}
        />
      ) : null}
      {!cinematicPromo ? (
        <button
          className="fixed left-5 top-1/2 z-20 grid size-14 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-black/22 text-white/72 backdrop-blur-xl transition hover:border-white/28 hover:bg-white/10 hover:text-white"
          onClick={() => moveScene(-1)}
          aria-label="上一个场景"
        >
          <ChevronLeft className="size-7" />
        </button>
      ) : null}
      {!cinematicPromo ? (
        <button
          className="fixed right-5 top-1/2 z-20 grid size-14 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-black/22 text-white/72 backdrop-blur-xl transition hover:border-white/28 hover:bg-white/10 hover:text-white"
          onClick={() => moveScene(1)}
          aria-label="下一个场景"
        >
          <ChevronRight className="size-7" />
        </button>
      ) : null}
      {!immersive ? (
        <section className="relative z-10 flex min-h-dvh items-center px-6 pb-24 pt-28 sm:px-10 lg:px-14">
          <div className="max-w-5xl">
            <p className="mb-5 text-xs font-semibold tracking-[0.44em] text-white/54">FOCUS · LEARN · GROW</p>
            <h1 className="max-w-5xl text-[clamp(4rem,8vw,8.5rem)] font-semibold leading-[0.95] text-white">
              进入{scene.title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-white/72">
              选择动态场景、音乐与节奏，点击开始后直接进入全屏沉浸学习。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                className="inline-flex h-15 items-center gap-3 rounded-full border border-white/24 bg-white/14 px-7 text-base font-semibold text-white shadow-2xl shadow-black/35 backdrop-blur-xl transition hover:border-white/42 hover:bg-white/20"
                onClick={startFocus}
              >
                开始学习
                <ChevronRight className="size-5" />
              </button>
              <button
                className="inline-flex h-15 items-center gap-3 rounded-full border border-white/14 bg-black/20 px-6 text-base font-medium text-white/78 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                onClick={() => setDrawerOpen(true)}
              >
                <Settings2 className="size-5" />
                调整场景
              </button>
              <span className="inline-flex h-15 items-center gap-2 rounded-full border border-white/12 bg-black/18 px-5 text-sm text-white/58 backdrop-blur-xl">
                <Users className="size-4" />
                {buddyStatus?.online_count ?? 1} 人在线 · {scene.title}
              </span>
            </div>
          </div>
        </section>
      ) : !cinematicPromo ? (
        <div className="pointer-events-none fixed right-6 top-26 z-10 hidden rounded-full border border-white/10 bg-black/18 px-4 py-2 text-sm text-white/58 backdrop-blur-xl sm:block">
          {scene.title} · {buddyStatus?.same_scene_count ?? 1} 位同场景
        </div>
      ) : (
        null
      )}
      {!cinematicPromo ? (
        <ControlPanel
          mode="drawer"
          open={drawerOpen}
          selectedSceneId={scene.id}
          immersive={immersive}
          fullscreen={fullscreen}
          timer={timer}
          userStatus={userStatus}
          buddyStatus={buddyStatus}
          shareCopied={shareCopied}
          onClose={() => setDrawerOpen(false)}
          onSceneChange={setSceneId}
          onShare={handleShare}
          onToggleImmersive={() => setImmersive((value) => !value)}
          onToggleFullscreen={toggleFullscreen}
        />
      ) : null}
      {drawerOpen ? (
        <button
          className="fixed inset-0 z-20 cursor-default bg-black/18 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-0"
          onClick={() => setDrawerOpen(false)}
          aria-label="关闭设置遮罩"
        />
      ) : null}
      {!drawerOpen && !cinematicPromo ? (
        <ControlPanel
          mode="dock"
          selectedSceneId={scene.id}
          immersive={immersive}
          fullscreen={fullscreen}
          timer={timer}
          userStatus={userStatus}
          buddyStatus={buddyStatus}
          shareCopied={shareCopied}
          onSceneChange={setSceneId}
          onShare={handleShare}
          onToggleImmersive={() => {
            if (immersive) {
              setImmersive(false);
              setDrawerOpen(true);
              return;
            }

            setImmersive(true);
          }}
          onToggleFullscreen={toggleFullscreen}
        />
      ) : null}
    </main>
  );
}

function Header({
  immersive,
  sceneTitle,
  onOpenSettings,
  onToggleImmersive,
  onToggleFullscreen,
}: {
  immersive: boolean;
  sceneTitle: string;
  onOpenSettings: () => void;
  onToggleImmersive: () => void;
  onToggleFullscreen: () => void;
}) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 border-b border-white/8 px-5 py-4 transition duration-500 sm:px-8 lg:px-12 ${
        immersive ? "opacity-0 hover:opacity-100" : "opacity-100"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/8 backdrop-blur-xl">
            <BookOpen className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold text-white sm:text-2xl">专注一隅</p>
            <p className="truncate text-xs text-white/44">{sceneTitle}</p>
          </div>
        </div>
        <label className="hidden h-11 w-full max-w-sm items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 text-white/50 backdrop-blur-xl md:flex">
          <Search className="size-4" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/42"
            placeholder="搜索你感兴趣的内容"
          />
        </label>
        <nav className="hidden items-center gap-7 text-sm font-medium text-white/62 lg:flex">
          <button className="transition hover:text-white" onClick={onOpenSettings}>场景</button>
          <button className="transition hover:text-white" onClick={onOpenSettings}>音乐</button>
          <button className="transition hover:text-white" onClick={onOpenSettings}>计划</button>
          <button className="transition hover:text-white" onClick={onOpenSettings}>会员</button>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            className="hidden h-11 items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 text-sm font-medium text-white/74 backdrop-blur-xl transition hover:border-white/28 hover:bg-white/12 hover:text-white sm:inline-flex"
            onClick={onToggleImmersive}
          >
            <Expand className="size-4" />
            沉浸模式
          </button>
          <button
            className="hidden h-11 items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 text-sm font-medium text-white/74 backdrop-blur-xl transition hover:border-white/28 hover:bg-white/12 hover:text-white sm:inline-flex"
            onClick={onToggleFullscreen}
          >
            <Expand className="size-4" />
            全屏
          </button>
          <button
            className="grid size-11 place-items-center rounded-full border border-white/14 bg-white/8 text-white/74 backdrop-blur-xl transition hover:border-white/28 hover:bg-white/12 hover:text-white"
            onClick={onOpenSettings}
            aria-label="打开设置"
          >
            <Settings2 className="size-5" />
          </button>
          <button className="hidden h-11 items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 text-sm font-medium text-white/74 backdrop-blur-xl transition hover:border-white/28 hover:bg-white/12 hover:text-white sm:inline-flex">
            <LogIn className="size-4" />
            登录
          </button>
        </div>
      </div>
    </header>
  );
}

function getAnonymousUserId() {
  const storedUserId = window.localStorage.getItem("anonymous_user_id");

  if (storedUserId) {
    return storedUserId;
  }

  const nextUserId = createAnonymousUserId();
  window.localStorage.setItem("anonymous_user_id", nextUserId);
  return nextUserId;
}

function createAnonymousUserId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function getInitialPromo() {
  if (typeof window === "undefined") {
    return {
      cinematic: false,
      sceneId: defaultScene.id,
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const sceneParam = searchParams.get("scene");
  const cinematic = searchParams.get("promo") === "cinematic";
  const sceneId = sceneParam && focusScenes.some((item) => item.id === sceneParam) ? sceneParam : defaultScene.id;

  return {
    cinematic,
    sceneId,
  };
}

async function syncUserStats(stats: Omit<UserStats, "synced_at">) {
  const response = await fetch("/focus-room/api/user/status", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      anonymous_user_id: getAnonymousUserId(),
      stats,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as UserStatus & { ok: boolean };

  if (!payload.ok) {
    return null;
  }

  return {
    vip_expires_at: payload.vip_expires_at,
    referred_success_count: payload.referred_success_count,
    stats: payload.stats,
  };
}

function tryCopySelection() {
  try {
    document.execCommand("copy");
  } catch {
    return false;
  }

  return true;
}
