"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import { defaultAmbienceTrack, defaultMusicTrack } from "@/lib/scenes";

type TimerAudioState = {
  selectedMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  endsAt: number | null;
  musicVolume: number;
  ambienceVolume: number;
  musicUrl: string;
  ambienceUrl: string;
  currentTask: string;
  completedSessions: number;
  todayFocusSeconds: number;
  totalFocusSeconds: number;
  statsDate: string;
  setDuration: (minutes: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMusicVolume: (volume: number) => void;
  setAmbienceVolume: (volume: number) => void;
  setMusicUrl: (url: string) => void;
  setAmbienceUrl: (url: string) => void;
  setCurrentTask: (task: string) => void;
  hydrate: (snapshot: Partial<TimerAudioState>) => void;
};

const timerAudioStorageKey = "focus_room_timer_audio";
const finishAudioUrl = "/focus-room/audio/focus-complete.wav";
const silentAudioUrl = "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg";

export const useTimerAudioStore = create<TimerAudioState>((set) => ({
  selectedMinutes: 50,
  remainingSeconds: 50 * 60,
  isRunning: false,
  endsAt: null,
  musicVolume: 0.42,
  ambienceVolume: 0.34,
  musicUrl: defaultMusicTrack.url,
  ambienceUrl: defaultAmbienceTrack.url,
  currentTask: "",
  completedSessions: 0,
  todayFocusSeconds: 0,
  totalFocusSeconds: 0,
  statsDate: getLocalDateKey(),
  setDuration: (minutes) =>
    set({
      selectedMinutes: minutes,
      remainingSeconds: minutes * 60,
      isRunning: false,
      endsAt: null,
    }),
  start: () =>
    set((state) => ({
      ...normalizeStatsForToday(state),
      isRunning: state.remainingSeconds > 0,
      endsAt: state.remainingSeconds > 0 ? Date.now() + state.remainingSeconds * 1000 : null,
    })),
  pause: () =>
    set((state) => ({
      remainingSeconds: getRemainingSeconds(state),
      isRunning: false,
      endsAt: null,
    })),
  reset: () =>
    set((state) => ({
      remainingSeconds: state.selectedMinutes * 60,
      isRunning: false,
      endsAt: null,
    })),
  tick: () =>
    set((state) => {
      if (!state.isRunning) {
        return state;
      }

      const remainingSeconds = getRemainingSeconds(state);

      if (remainingSeconds <= 0) {
        const normalizedState = normalizeStatsForToday(state);
        const focusSeconds = state.selectedMinutes * 60;

        return {
          ...normalizedState,
          remainingSeconds: 0,
          isRunning: false,
          endsAt: null,
          completedSessions: normalizedState.completedSessions + 1,
          todayFocusSeconds: normalizedState.todayFocusSeconds + focusSeconds,
          totalFocusSeconds: normalizedState.totalFocusSeconds + focusSeconds,
        };
      }

      return {
        remainingSeconds,
      };
    }),
  setMusicVolume: (musicVolume) => set({ musicVolume }),
  setAmbienceVolume: (ambienceVolume) => set({ ambienceVolume }),
  setMusicUrl: (musicUrl) => set({ musicUrl }),
  setAmbienceUrl: (ambienceUrl) => set({ ambienceUrl }),
  setCurrentTask: (currentTask) => set({ currentTask }),
  hydrate: (snapshot) =>
    set((state) => ({
      ...state,
      ...snapshot,
      isRunning: false,
      endsAt: null,
      statsDate: snapshot.statsDate ?? getLocalDateKey(),
    })),
}));

export function useTimerAudio() {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const finishSoundRef = useRef<HTMLAudioElement | null>(null);
  const originalTitleRef = useRef<string | null>(null);
  const previousCompletedSessionsRef = useRef(0);
  const state = useTimerAudioStore();

  useEffect(() => {
    const storedSnapshot = window.localStorage.getItem(timerAudioStorageKey);

    if (storedSnapshot) {
      useTimerAudioStore.getState().hydrate(JSON.parse(storedSnapshot) as Partial<TimerAudioState>);
    }

    const unsubscribe = useTimerAudioStore.subscribe((nextState, previousState) => {
      if (
        nextState.selectedMinutes === previousState.selectedMinutes &&
        nextState.remainingSeconds === previousState.remainingSeconds &&
        nextState.musicVolume === previousState.musicVolume &&
        nextState.ambienceVolume === previousState.ambienceVolume &&
        nextState.musicUrl === previousState.musicUrl &&
        nextState.ambienceUrl === previousState.ambienceUrl &&
        nextState.currentTask === previousState.currentTask &&
        nextState.completedSessions === previousState.completedSessions &&
        nextState.todayFocusSeconds === previousState.todayFocusSeconds &&
        nextState.totalFocusSeconds === previousState.totalFocusSeconds &&
        nextState.statsDate === previousState.statsDate
      ) {
        return;
      }

      window.localStorage.setItem(timerAudioStorageKey, JSON.stringify(createPersistedSnapshot(nextState)));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const currentState = useTimerAudioStore.getState();

    musicRef.current = new Audio(currentState.musicUrl);
    ambienceRef.current = new Audio(currentState.ambienceUrl);
    finishSoundRef.current = createFinishSound();

    const music = musicRef.current;
    const ambience = ambienceRef.current;
    const finishSound = finishSoundRef.current;

    music.loop = true;
    ambience.loop = true;
    music.preload = "auto";
    ambience.preload = "auto";
    finishSound.preload = "auto";

    return () => {
      music.pause();
      ambience.pause();
      finishSound.pause();
      music.src = "";
      ambience.src = "";
      finishSound.src = "";
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
    if (state.completedSessions <= previousCompletedSessionsRef.current) {
      previousCompletedSessionsRef.current = state.completedSessions;
      return;
    }

    previousCompletedSessionsRef.current = state.completedSessions;

    if (!finishSoundRef.current) {
      return;
    }

    finishSoundRef.current.currentTime = 0;
    void finishSoundRef.current.play();
  }, [state.completedSessions]);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      useTimerAudioStore.getState().tick();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [state.isRunning]);

  useEffect(() => {
    const syncTimer = () => {
      useTimerAudioStore.getState().tick();
    };

    document.addEventListener("visibilitychange", syncTimer);
    window.addEventListener("focus", syncTimer);

    return () => {
      document.removeEventListener("visibilitychange", syncTimer);
      window.removeEventListener("focus", syncTimer);
    };
  }, []);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(state.remainingSeconds / 60);
    const seconds = state.remainingSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [state.remainingSeconds]);

  useEffect(() => {
    if (!originalTitleRef.current) {
      originalTitleRef.current = document.title;
    }

    document.title = state.isRunning ? `${formattedTime} · 专注一隅` : (originalTitleRef.current ?? "专注一隅");
  }, [formattedTime, state.isRunning]);

  const toggle = useCallback(() => {
    if (state.isRunning) {
      state.pause();
      return;
    }

    void unlockAudioPlayback();
    state.start();
    void musicRef.current?.play();
    void ambienceRef.current?.play();
  }, [state]);

  return {
    ...state,
    formattedTime,
    toggle,
  };
}

async function unlockAudioPlayback() {
  const silentAudio = new Audio(silentAudioUrl);
  silentAudio.muted = true;
  silentAudio.volume = 0;

  try {
    await silentAudio.play();
    silentAudio.pause();
    silentAudio.src = "";
  } catch {
    silentAudio.src = "";
  }
}

function createFinishSound() {
  const audio = new Audio(finishAudioUrl);
  audio.volume = 0.86;
  return audio;
}

function getRemainingSeconds(state: TimerAudioState) {
  if (!state.endsAt) {
    return state.remainingSeconds;
  }

  return Math.max(0, Math.ceil((state.endsAt - Date.now()) / 1000));
}

function normalizeStatsForToday(state: TimerAudioState) {
  const today = getLocalDateKey();

  if (state.statsDate === today) {
    return state;
  }

  return {
    ...state,
    statsDate: today,
    completedSessions: 0,
    todayFocusSeconds: 0,
  };
}

function getLocalDateKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createPersistedSnapshot(state: TimerAudioState) {
  return {
    selectedMinutes: state.selectedMinutes,
    remainingSeconds: state.remainingSeconds,
    musicVolume: state.musicVolume,
    ambienceVolume: state.ambienceVolume,
    musicUrl: state.musicUrl,
    ambienceUrl: state.ambienceUrl,
    currentTask: state.currentTask,
    completedSessions: state.completedSessions,
    todayFocusSeconds: state.todayFocusSeconds,
    totalFocusSeconds: state.totalFocusSeconds,
    statsDate: state.statsDate,
  };
}
