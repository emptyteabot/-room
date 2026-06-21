"use client";

import Image from "next/image";
import {
  BarChart3,
  ChevronDown,
  Crown,
  Expand,
  Headphones,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Share2,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  TimerReset,
  Users,
  Volume2,
  Waves,
  X,
} from "lucide-react";
import {
  ambienceTracks,
  focusDurations,
  focusScenes,
  musicTracks,
} from "@/lib/scenes";
import type { useTimerAudio } from "@/hooks/useTimerAudio";

type TimerAudioController = ReturnType<typeof useTimerAudio>;

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
};

type ControlPanelProps = {
  mode: "drawer" | "dock";
  open?: boolean;
  selectedSceneId: string;
  immersive: boolean;
  fullscreen: boolean;
  timer: TimerAudioController;
  userStatus: UserStatus | null;
  buddyStatus: BuddyStatus | null;
  shareCopied: boolean;
  onClose?: () => void;
  onSceneChange: (sceneId: string) => void;
  onShare: () => void;
  onToggleImmersive: () => void;
  onToggleFullscreen: () => void;
};

export function ControlPanel({
  mode,
  open = true,
  selectedSceneId,
  immersive,
  fullscreen,
  timer,
  userStatus,
  buddyStatus,
  shareCopied,
  onClose,
  onSceneChange,
  onShare,
  onToggleImmersive,
  onToggleFullscreen,
}: ControlPanelProps) {
  if (mode === "dock") {
    return (
      <BottomDock
        timer={timer}
        buddyStatus={buddyStatus}
        immersive={immersive}
        fullscreen={fullscreen}
        onToggleImmersive={onToggleImmersive}
        onToggleFullscreen={onToggleFullscreen}
      />
    );
  }

  return (
    <aside
      className={`fixed right-0 top-0 z-30 h-dvh w-full max-w-[34rem] border-l border-white/12 bg-black/28 shadow-2xl shadow-black/50 backdrop-blur-2xl transition duration-300 sm:right-4 sm:top-4 sm:h-[calc(100dvh-2rem)] sm:rounded-3xl sm:border ${
        open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-17 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="text-[0.64rem] font-semibold tracking-[0.36em] text-white/42">STUDY CONTROL</p>
            <h2 className="mt-1 text-lg font-semibold text-white">沉浸设置</h2>
          </div>
          <button
            className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/8 text-white/72 transition hover:border-white/28 hover:bg-white/14 hover:text-white"
            onClick={onClose}
            aria-label="关闭设置"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <section id="scenes">
            <SectionTitle eyebrow="STEP 01" title="选择你的学习场景" icon={<Sparkles className="size-5" />} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {focusScenes.map((scene) => {
                const Icon = scene.icon;
                const active = scene.id === selectedSceneId;

                return (
                  <button
                    key={scene.id}
                    className={`group relative min-h-38 overflow-hidden rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-white/42 bg-white/14 shadow-lg shadow-black/30"
                        : "border-white/12 bg-white/6 hover:border-white/28 hover:bg-white/10"
                    }`}
                    onClick={() => onSceneChange(scene.id)}
                  >
                    <Image
                      className="absolute inset-0 h-full w-full object-cover opacity-58 transition duration-500 group-hover:scale-105 group-hover:opacity-72"
                      src={scene.posterUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, 260px"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/24 to-black/8" />
                    <span className="relative flex h-full min-h-30 flex-col justify-end">
                      <span className="mb-6 flex items-center justify-between">
                        <Icon className="size-5 text-white/82" />
                        <span className="text-[0.58rem] font-semibold tracking-[0.28em] text-white/46">{scene.tone}</span>
                      </span>
                      <span className="flex items-center gap-2 text-lg font-semibold text-white">
                        {scene.title}
                        {scene.premium ? <Crown className="size-4 text-amber-200" /> : null}
                      </span>
                      <span className="mt-1 text-xs text-white/58">{scene.subtitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
          <section id="audio" className="mt-6">
            <SectionTitle eyebrow="STEP 02" title="设置声音氛围" icon={<SlidersHorizontal className="size-5" />} />
            <div className="mt-4 space-y-3">
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
          </section>
          <section id="timer" className="mt-6">
            <SectionTitle eyebrow="STEP 03" title="设置番茄钟" icon={<TimerReset className="size-5" />} />
            <div className="mt-4 grid grid-cols-4 gap-2">
              {focusDurations.map((duration) => (
                <button
                  key={duration}
                  className={`h-11 rounded-full border text-sm transition ${
                    timer.selectedMinutes === duration
                      ? "border-white/38 bg-white/18 text-white"
                      : "border-white/12 bg-black/18 text-white/64 hover:border-white/28 hover:text-white"
                  }`}
                  onClick={() => timer.setDuration(duration)}
                >
                  {duration}
                </button>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="mb-2 flex items-center gap-2 text-xs font-medium text-white/62">
                <BarChart3 className="size-4" />
                本轮目标
              </span>
              <input
                className="h-12 w-full rounded-2xl border border-white/12 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/32 hover:border-white/24 focus:border-white/38"
                value={timer.currentTask}
                onChange={(event) => timer.setCurrentTask(event.target.value)}
                placeholder="写下今天想完成的事"
                maxLength={42}
              />
            </label>
          </section>
          <section className="mt-6 rounded-2xl border border-white/12 bg-white/7 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Users className="size-4 text-emerald-200" />
                  同频自习搭子
                </p>
                <p className="mt-1 text-xs leading-5 text-white/54">
                  {buddyStatus?.online_count ?? 1} 人在线 · {buddyStatus?.same_scene_count ?? 1} 人同场景 ·{" "}
                  {buddyStatus?.focusing_count ?? (timer.isRunning ? 1 : 0)} 人专注中
                </p>
              </div>
              <span className="rounded-full border border-emerald-200/18 bg-emerald-200/10 px-3 py-1 text-xs font-medium text-emerald-100">
                LIVE
              </span>
            </div>
          </section>
          <section className="relative mt-3">
            <div className="mb-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-center text-xs font-medium text-white/64 backdrop-blur-xl">
              已邀请 {userStatus?.referred_success_count ?? 0} 位学友 · VIP 剩余 {formatVipRemainingDays(userStatus?.vip_expires_at)} 天
            </div>
            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/7 text-sm font-medium text-white/82 backdrop-blur-xl transition hover:border-white/24 hover:bg-white/12"
              onClick={onShare}
            >
              <Share2 className="size-4" />
              分享给同学一起专注
            </button>
            {shareCopied ? (
              <div className="absolute bottom-14 left-1/2 w-max -translate-x-1/2 rounded-full border border-white/12 bg-black/48 px-4 py-2 text-xs text-white/84 shadow-2xl shadow-black/30 backdrop-blur-xl">
                链接已复制，分享给好友一同专注
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </aside>
  );
}

function BottomDock({
  timer,
  buddyStatus,
  immersive,
  fullscreen,
  onToggleImmersive,
  onToggleFullscreen,
}: {
  timer: TimerAudioController;
  buddyStatus: BuddyStatus | null;
  immersive: boolean;
  fullscreen: boolean;
  onToggleImmersive: () => void;
  onToggleFullscreen: () => void;
}) {
  const progress = 1 - timer.remainingSeconds / (timer.selectedMinutes * 60);

  return (
    <div className="fixed inset-x-3 bottom-3 z-20 sm:inset-x-8 sm:bottom-6 lg:inset-x-1/2 lg:w-[58rem] lg:-translate-x-1/2">
      <div className="rounded-3xl border border-white/14 bg-black/28 p-3 shadow-2xl shadow-black/45 backdrop-blur-2xl">
        <div className="grid gap-3 lg:grid-cols-[14rem_1fr_auto] lg:items-center">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
            <div>
              <p className="text-[0.62rem] font-semibold tracking-[0.28em] text-white/38">POMODORO #{timer.completedSessions + 1}</p>
              <p className="mt-1 text-4xl font-semibold tabular-nums text-white">{timer.formattedTime}</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200/18 bg-emerald-200/10 px-2.5 py-1 text-xs text-emerald-100">
              <span className="size-1.5 rounded-full bg-emerald-200" />
              {timer.isRunning ? "学习中" : "待开始"}
            </span>
          </div>
          <div className="min-w-0">
            <input
              className="h-11 w-full rounded-2xl border border-white/12 bg-white/7 px-4 text-sm text-white outline-none transition placeholder:text-white/34 hover:border-white/24 focus:border-white/38"
              value={timer.currentTask}
              onChange={(event) => timer.setCurrentTask(event.target.value)}
              placeholder="写下今天想完成的事"
              maxLength={42}
            />
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/12">
              <div className="h-full rounded-full bg-white/82 transition-all" style={{ width: `${Math.max(0, Math.min(progress, 1)) * 100}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/46">
              <span>今日 {Math.floor(timer.todayFocusSeconds / 60)}m</span>
              <span>轮次 {timer.completedSessions}</span>
              <span>在线 {buddyStatus?.online_count ?? 1}</span>
              <span>同频 {buddyStatus?.focusing_count ?? (timer.isRunning ? 1 : 0)}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <IconButton onClick={timer.toggle} label={timer.isRunning ? "暂停" : "开始"}>
              {timer.isRunning ? <Pause className="size-5" /> : <Play className="size-5 fill-white" />}
            </IconButton>
            <IconButton onClick={timer.reset} label="重置">
              <RotateCcw className="size-5" />
            </IconButton>
            <IconButton onClick={() => timer.setDuration(timer.selectedMinutes)} label="跳过">
              <SkipForward className="size-5" />
            </IconButton>
            <IconButton onClick={onToggleFullscreen} label={fullscreen ? "退出全屏" : "全屏"}>
              {fullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
            </IconButton>
            <IconButton onClick={onToggleImmersive} label={immersive ? "显示面板" : "沉浸模式"}>
              {immersive ? <ChevronDown className="size-5" /> : <Expand className="size-5" />}
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, icon }: { eyebrow: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[0.68rem] font-semibold tracking-[0.36em] text-white/40">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
      </div>
      <span className="mt-1 text-white/46">{icon}</span>
    </div>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className="grid size-11 place-items-center rounded-full border border-white/14 bg-white/10 text-white transition hover:border-white/30 hover:bg-white/16"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
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

type AudioSelectProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { title: string; subtitle: string; url: string }[];
  onChange: (value: string) => void;
};

function AudioSelect({ icon, label, value, options, onChange }: AudioSelectProps) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-white/6 p-4">
      <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/78">
        {icon}
        {label}
      </span>
      <select
        className="h-11 w-full rounded-xl border border-white/10 bg-black/34 px-3 text-sm text-white outline-none transition hover:border-white/22 focus:border-white/36"
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
    <label className="block rounded-2xl border border-white/10 bg-white/6 p-4">
      <span className="mb-3 flex items-center justify-between gap-3 text-sm font-semibold text-white/78">
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
