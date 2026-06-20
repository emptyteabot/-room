"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Crown,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Sparkles,
  TimerReset,
  Volume2,
  Waves,
} from "lucide-react";
import {
  ambienceTracks,
  focusDurations,
  focusScenes,
  musicTracks,
} from "@/lib/scenes";
import { useTimerAudio } from "@/hooks/useTimerAudio";

type ControlPanelProps = {
  selectedSceneId: string;
  onSceneChange: (sceneId: string) => void;
};

type UserStatus = {
  vip_expires_at: string | null;
  referred_success_count: number;
};

export function ControlPanel({ selectedSceneId, onSceneChange }: ControlPanelProps) {
  const timer = useTimerAudio();
  const progress = 1 - timer.remainingSeconds / (timer.selectedMinutes * 60);
  const [shareCopied, setShareCopied] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const shareTimerRef = useRef<number | null>(null);

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

  return (
    <div className="max-h-[calc(100dvh-7rem)] w-full overflow-y-auto rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/35 backdrop-blur-xl lg:ml-auto lg:max-w-4xl">
      <div className="grid gap-px bg-white/8 lg:grid-cols-[1.12fr_0.88fr]">
        <section id="scenes" className="bg-black/24 p-4 sm:p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.36em] text-white/40">STEP 01</p>
              <h3 className="mt-2 text-xl font-semibold text-white">选择你的学习场景</h3>
            </div>
            <Sparkles className="mt-1 size-5 text-white/46" />
          </div>
          <div className="grid max-h-[20rem] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {focusScenes.map((scene) => {
              const Icon = scene.icon;
              const active = scene.id === selectedSceneId;

              return (
                <button
                  key={scene.id}
                  className={`group relative min-h-32 overflow-hidden rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-white/42 bg-white/14 shadow-lg shadow-black/30"
                      : "border-white/12 bg-white/6 hover:border-white/28 hover:bg-white/10"
                  }`}
                  onClick={() => onSceneChange(scene.id)}
                >
                  <Image
                    className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105 group-hover:opacity-62"
                    src={scene.posterUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-black/8" />
                    <span className="relative flex h-full min-h-24 flex-col justify-end">
                    <span className="mb-5 flex items-center justify-between">
                      <Icon className="size-5 text-white/78" />
                      <span className="text-[0.6rem] font-semibold tracking-[0.26em] text-white/45">{scene.tone}</span>
                    </span>
                    <span className="flex items-center gap-2 text-lg font-semibold text-white">
                      {scene.title}
                      {scene.premium ? <Crown className="size-4 text-amber-200" /> : null}
                    </span>
                    <span className="mt-1 text-xs text-white/56">{scene.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <section className="bg-black/28 p-4 sm:p-5">
          <div id="audio" className="rounded-xl border border-white/10 bg-white/6 p-3.5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.36em] text-white/40">STEP 02</p>
                <h3 className="mt-2 text-xl font-semibold text-white">设置声音氛围</h3>
              </div>
              <SlidersHorizontal className="mt-1 size-5 text-white/46" />
            </div>
            <div className="space-y-3">
              <AudioSelect
                icon={<Headphones className="size-4" />}
                label="音乐"
                value={timer.musicUrl}
                options={musicTracks}
                onChange={timer.setMusicUrl}
              />
              <VolumeControl
                icon={<Volume2 className="size-4" />}
                label="音乐音量"
                value={timer.musicVolume}
                onChange={timer.setMusicVolume}
              />
              <AudioSelect
                icon={<Waves className="size-4" />}
                label="背景音"
                value={timer.ambienceUrl}
                options={ambienceTracks}
                onChange={timer.setAmbienceUrl}
              />
              <VolumeControl
                icon={<Volume2 className="size-4" />}
                label="背景音量"
                value={timer.ambienceVolume}
                onChange={timer.setAmbienceVolume}
              />
            </div>
          </div>
          <div id="timer" className="mt-3 rounded-xl border border-white/10 bg-white/6 p-3.5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.36em] text-white/40">STEP 03</p>
                <h3 className="mt-2 text-xl font-semibold text-white">设置番茄钟</h3>
              </div>
              <TimerReset className="mt-1 size-5 text-white/46" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {focusDurations.map((duration) => (
                <button
                  key={duration}
                  className={`h-10 rounded-full border text-sm transition ${
                    timer.selectedMinutes === duration
                      ? "border-white/38 bg-white/16 text-white"
                      : "border-white/12 bg-black/14 text-white/64 hover:border-white/28 hover:text-white"
                  }`}
                  onClick={() => timer.setDuration(duration)}
                >
                  {duration} 分钟
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/24 p-3.5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.64rem] font-semibold tracking-[0.32em] text-white/38">POMODORO #1</p>
                  <p className="mt-1 text-4xl font-semibold tabular-nums text-white">{timer.formattedTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="grid size-11 place-items-center rounded-full border border-white/14 bg-white/10 text-white transition hover:border-white/30 hover:bg-white/16"
                    onClick={timer.toggle}
                    aria-label={timer.isRunning ? "暂停" : "开始"}
                  >
                    {timer.isRunning ? <Pause className="size-5" /> : <Play className="size-5 fill-white" />}
                  </button>
                  <button
                    className="grid size-11 place-items-center rounded-full border border-white/14 bg-white/10 text-white transition hover:border-white/30 hover:bg-white/16"
                    onClick={timer.reset}
                    aria-label="重置"
                  >
                    <RotateCcw className="size-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/12">
                <div className="h-full rounded-full bg-white/78 transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          </div>
          <div id="pro" className="mt-3 rounded-xl border border-amber-200/16 bg-amber-200/8 p-3.5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Pro 场景包</p>
                <p className="mt-1 text-xs leading-5 text-white/54">雪山书房、海边书房、长时段白噪与自定义计划。</p>
              </div>
              <button className="rounded-full border border-amber-200/24 bg-amber-100/14 px-4 py-2 text-sm font-medium text-amber-50 transition hover:bg-amber-100/22">
                解锁
              </button>
            </div>
          </div>
          <div className="relative mt-3">
            <div className="mb-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-center text-xs font-medium text-white/64 backdrop-blur-xl">
              已邀请 {userStatus?.referred_success_count ?? 0} 位学友 · VIP 剩余 {formatVipRemainingDays(userStatus?.vip_expires_at)} 天
            </div>
            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white/78 backdrop-blur-xl transition hover:border-white/24 hover:bg-white/10"
              onClick={handleShare}
            >
              <Share2 className="size-4" />
              分享免单 · 获取高级场景
            </button>
            {shareCopied ? (
              <div className="absolute bottom-13 left-1/2 w-max -translate-x-1/2 rounded-full border border-white/12 bg-black/38 px-4 py-2 text-xs text-white/82 shadow-2xl shadow-black/30 backdrop-blur-xl">
                链接已复制，分享给好友一同专注
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
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

function formatVipRemainingDays(expiresAt?: string | null) {
  if (!expiresAt) {
    return 0;
  }

  const remainingMs = new Date(expiresAt).getTime() - Date.now();

  if (!Number.isFinite(remainingMs) || remainingMs <= 0) {
    return 0;
  }

  return Math.ceil(remainingMs / 86400000);
}

function tryCopySelection() {
  try {
    document.execCommand("copy");
  } catch {
    return false;
  }

  return true;
}

type AudioSelectProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { title: string; subtitle: string; url: string }[];
  onChange: (value: string) => void;
};

function AudioSelect({ icon, label, value, options, onChange }: AudioSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-medium text-white/62">
        {icon}
        {label}
      </span>
      <select
        className="h-10 w-full rounded-lg border border-white/10 bg-black/34 px-3 text-sm text-white outline-none transition hover:border-white/22 focus:border-white/36"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.url} value={option.url}>
            {option.title} · {option.subtitle}
          </option>
        ))}
      </select>
    </label>
  );
}

type VolumeControlProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function VolumeControl({ icon, label, value, onChange }: VolumeControlProps) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-white/62">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="tabular-nums text-white/44">{Math.round(value * 100)}%</span>
      </span>
      <input
        className="h-2 w-full accent-white"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
