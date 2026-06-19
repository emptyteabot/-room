"use client";

import { useMemo, useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { defaultScene, focusScenes } from "@/lib/scenes";

export function FocusRoom() {
  const [sceneId, setSceneId] = useState(defaultScene.id);
  const scene = useMemo(
    () => focusScenes.find((item) => item.id === sceneId) ?? defaultScene,
    [sceneId],
  );

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
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.16),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.58),rgba(0,0,0,0.12)_45%,rgba(0,0,0,0.55))]" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/8 backdrop-blur-xl">
              <scene.icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-white/80">FOCUS NOOK</p>
              <h1 className="text-lg font-semibold text-white">专注一隅</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/68 md:flex">
            <a className="transition hover:text-white" href="#scenes">
              场景
            </a>
            <a className="transition hover:text-white" href="#audio">
              音乐
            </a>
            <a className="transition hover:text-white" href="#timer">
              计划
            </a>
            <a className="transition hover:text-white" href="#pro">
              会员
            </a>
          </nav>
          <button className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/82 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/14">
            登录
          </button>
        </header>
        <section className="flex flex-1 items-end px-5 pb-5 sm:px-8 sm:pb-8 lg:items-center lg:px-12">
          <div className="grid w-full items-end gap-6 lg:grid-cols-[minmax(280px,0.86fr)_minmax(560px,1.14fr)]">
            <div className="max-w-xl pb-2 lg:pb-12">
              <p className="mb-5 text-xs font-semibold tracking-[0.42em] text-white/54">FOCUS · LEARN · GROW</p>
              <h2 className="text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
                开启你的
                <span className="mt-2 block">清晨自习室</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/72 sm:text-lg">
                选择场景、音乐与节奏，把一天最清醒的时间留给真正重要的学习。
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  className="rounded-full border border-white/18 bg-white/12 px-5 py-3 text-sm font-medium text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:border-white/34 hover:bg-white/18"
                  href="#timer"
                >
                  开始学习
                </a>
                <span className="rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/58 backdrop-blur-xl">
                  当前场景 · {scene.title}
                </span>
              </div>
            </div>
            <ControlPanel selectedSceneId={scene.id} onSceneChange={setSceneId} />
          </div>
        </section>
      </div>
    </main>
  );
}
