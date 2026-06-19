"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import { defaultAmbienceTrack, defaultMusicTrack } from "@/lib/scenes";

type TimerAudioState = {
  selectedMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  musicVolume: number;
  ambienceVolume: number;
  musicUrl: string;
  ambienceUrl: string;
  setDuration: (minutes: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMusicVolume: (volume: number) => void;
  setAmbienceVolume: (volume: number) => void;
  setMusicUrl: (url: string) => void;
  setAmbienceUrl: (url: string) => void;
};

export const useTimerAudioStore = create<TimerAudioState>((set) => ({
  selectedMinutes: 50,
  remainingSeconds: 50 * 60,
  isRunning: false,
  musicVolume: 0.42,
  ambienceVolume: 0.34,
  musicUrl: defaultMusicTrack.url,
  ambienceUrl: defaultAmbienceTrack.url,
  setDuration: (minutes) =>
    set({
      selectedMinutes: minutes,
      remainingSeconds: minutes * 60,
      isRunning: false,
    }),
  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () =>
    set((state) => ({
      remainingSeconds: state.selectedMinutes * 60,
      isRunning: false,
    })),
  tick: () =>
    set((state) => {
      if (!state.isRunning) {
        return state;
      }

      if (state.remainingSeconds <= 1) {
        return {
          remainingSeconds: 0,
          isRunning: false,
        };
      }

      return {
        remainingSeconds: state.remainingSeconds - 1,
      };
    }),
  setMusicVolume: (musicVolume) => set({ musicVolume }),
  setAmbienceVolume: (ambienceVolume) => set({ ambienceVolume }),
  setMusicUrl: (musicUrl) => set({ musicUrl }),
  setAmbienceUrl: (ambienceUrl) => set({ ambienceUrl }),
}));

export function useTimerAudio() {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const state = useTimerAudioStore();

  useEffect(() => {
    const currentState = useTimerAudioStore.getState();

    musicRef.current = new Audio(currentState.musicUrl);
    ambienceRef.current = new Audio(currentState.ambienceUrl);

    const music = musicRef.current;
    const ambience = ambienceRef.current;

    music.loop = true;
    ambience.loop = true;
    music.preload = "auto";
    ambience.preload = "auto";

    return () => {
      music.pause();
      ambience.pause();
      music.src = "";
      ambience.src = "";
    };
  }, []);

  useEffect(() => {
    if (!musicRef.current) {
      return;
    }

    const wasPlaying = !musicRef.current.paused;
    musicRef.current.src = state.musicUrl;
    musicRef.current.load();

    if (wasPlaying) {
      void musicRef.current.play();
    }
  }, [state.musicUrl]);

  useEffect(() => {
    if (!ambienceRef.current) {
      return;
    }

    const wasPlaying = !ambienceRef.current.paused;
    ambienceRef.current.src = state.ambienceUrl;
    ambienceRef.current.load();

    if (wasPlaying) {
      void ambienceRef.current.play();
    }
  }, [state.ambienceUrl]);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = state.musicVolume;
    }

    if (ambienceRef.current) {
      ambienceRef.current.volume = state.ambienceVolume;
    }
  }, [state.musicVolume, state.ambienceVolume]);

  useEffect(() => {
    if (!state.isRunning) {
      musicRef.current?.pause();
      ambienceRef.current?.pause();
      return;
    }

    void musicRef.current?.play();
    void ambienceRef.current?.play();
  }, [state.isRunning]);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      useTimerAudioStore.getState().tick();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [state.isRunning]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(state.remainingSeconds / 60);
    const seconds = state.remainingSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [state.remainingSeconds]);

  const toggle = useCallback(() => {
    if (state.isRunning) {
      state.pause();
      return;
    }

    state.start();
  }, [state]);

  return {
    ...state,
    formattedTime,
    toggle,
  };
}
