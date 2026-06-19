import { BookOpen, Coffee, MountainSnow, Sunrise } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FocusScene = {
  id: string;
  title: string;
  subtitle: string;
  tone: string;
  videoUrl: string;
  posterUrl: string;
  premium?: boolean;
  icon: LucideIcon;
};

export type AudioTrack = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
};

export const focusScenes: FocusScene[] = [
  {
    id: "morning-window",
    title: "清晨窗边",
    subtitle: "晨光、山影、低噪",
    tone: "FOCUS",
    videoUrl: "https://assets.mixkit.co/videos/3977/3977-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1600&q=80",
    icon: Sunrise,
  },
  {
    id: "rain-cafe",
    title: "雨天咖啡店",
    subtitle: "玻璃雨痕、城市灯影",
    tone: "RAIN",
    videoUrl: "https://assets.mixkit.co/active_storage/video_items/99834/1717026441/99834-video-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80",
    icon: Coffee,
  },
  {
    id: "night-library",
    title: "深夜图书馆",
    subtitle: "暗光、书架、稳定节拍",
    tone: "NIGHT",
    videoUrl: "https://assets.mixkit.co/videos/51393/51393-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
    icon: BookOpen,
  },
  {
    id: "snow-study",
    title: "雪山书房",
    subtitle: "冷空气、白噪、长时段",
    tone: "PRO",
    videoUrl: "https://assets.mixkit.co/videos/308/308-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1489674267075-cee793167910?auto=format&fit=crop&w=1600&q=80",
    premium: true,
    icon: MountainSnow,
  },
];

export const musicTracks: AudioTrack[] = [
  {
    id: "lofi",
    title: "Lo-fi 低速节拍",
    subtitle: "稳定、克制、适合写作",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
  },
  {
    id: "piano",
    title: "极简钢琴",
    subtitle: "轻旋律、低侵入",
    url: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3?filename=ambient-piano-logo-11268.mp3",
  },
];

export const ambienceTracks: AudioTrack[] = [
  {
    id: "rain",
    title: "细雨白噪",
    subtitle: "连续雨声与低频环境",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_3d6c7b1d9b.mp3?filename=rain-ambient-110397.mp3",
  },
  {
    id: "waves",
    title: "远岸海浪",
    subtitle: "慢节奏浪声循环",
    url: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_8fdd100fa0.mp3?filename=ocean-wave-1-18594.mp3",
  },
];

export const focusDurations = [25, 45, 50, 90] as const;

export const defaultScene = focusScenes[0];
export const defaultMusicTrack = musicTracks[0];
export const defaultAmbienceTrack = ambienceTracks[0];
