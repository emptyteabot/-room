import { BookOpen, CloudRain, Laptop, Library, MountainSnow, Sunrise, Trees } from "lucide-react";
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
    id: "snow-study",
    title: "雪山书房",
    subtitle: "冷光、雪景、长时段",
    tone: "SNOW",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_SNOW_STUDY_VIDEO", "https://assets.mixkit.co/videos/3397/3397-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_SNOW_STUDY_POSTER", "https://images.unsplash.com/photo-1489674267075-cee793167910?auto=format&fit=crop&w=1600&q=80"),
    icon: MountainSnow,
  },
  {
    id: "window-reading",
    title: "窗边阅读",
    subtitle: "晨光、书页、低噪音",
    tone: "READ",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_WINDOW_READING_VIDEO", "https://assets.mixkit.co/videos/42741/42741-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_WINDOW_READING_POSTER", "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1600&q=80"),
    icon: BookOpen,
  },
  {
    id: "cafe-notes",
    title: "咖啡笔记",
    subtitle: "手写、咖啡、轻节拍",
    tone: "CAFE",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_CAFE_NOTES_VIDEO", "https://assets.mixkit.co/videos/1743/1743-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_CAFE_NOTES_POSTER", "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"),
    icon: Sunrise,
  },
  {
    id: "library-aisle",
    title: "图书馆书架",
    subtitle: "书架、静区、稳定节拍",
    tone: "BOOKS",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_LIBRARY_AISLE_VIDEO", "https://assets.mixkit.co/videos/21591/21591-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_LIBRARY_AISLE_POSTER", "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80"),
    icon: Library,
  },
  {
    id: "desk-focus",
    title: "桌面深工",
    subtitle: "电脑、笔记、低干扰",
    tone: "WORK",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_DESK_FOCUS_VIDEO", "https://assets.mixkit.co/videos/308/308-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_DESK_FOCUS_POSTER", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"),
    icon: Laptop,
  },
  {
    id: "morning-cafe",
    title: "晨间咖啡",
    subtitle: "咖啡、耳机、暖光",
    tone: "LOFI",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_MORNING_CAFE_VIDEO", "https://assets.mixkit.co/videos/43391/43391-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_MORNING_CAFE_POSTER", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80"),
    icon: Sunrise,
  },
  {
    id: "rain-cabin",
    title: "雨夜木屋",
    subtitle: "雨声、木屋、慢节奏",
    tone: "RAIN",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_RAIN_CABIN_VIDEO", "https://assets.mixkit.co/videos/2738/2738-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_RAIN_CABIN_POSTER", "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?auto=format&fit=crop&w=1600&q=80"),
    icon: CloudRain,
  },
  {
    id: "library-homework",
    title: "图书馆伴学",
    subtitle: "翻页、桌灯、稳定节拍",
    tone: "STUDY",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_LIBRARY_HOMEWORK_VIDEO", "https://assets.mixkit.co/videos/4531/4531-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_LIBRARY_HOMEWORK_POSTER", "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80"),
    icon: BookOpen,
  },
  {
    id: "book-aisle",
    title: "书架巡游",
    subtitle: "书页、检索、长线学习",
    tone: "BOOKS",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_BOOK_AISLE_VIDEO", "https://assets.mixkit.co/videos/21599/21599-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_BOOK_AISLE_POSTER", "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1600&q=80"),
    icon: Library,
  },
  {
    id: "rain-window",
    title: "雨窗白噪",
    subtitle: "窗外雨幕、柔暗背景",
    tone: "NOISE",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_RAIN_WINDOW_VIDEO", "https://assets.mixkit.co/videos/2846/2846-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_RAIN_WINDOW_POSTER", "https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?auto=format&fit=crop&w=1600&q=80"),
    premium: true,
    icon: Trees,
  },
  {
    id: "mountain-clouds",
    title: "雪岭云海",
    subtitle: "高海拔、冷色、低刺激",
    tone: "ALPINE",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_MOUNTAIN_CLOUDS_VIDEO", "https://assets.mixkit.co/videos/3335/3335-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_MOUNTAIN_CLOUDS_POSTER", "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80"),
    premium: true,
    icon: MountainSnow,
  },
];

export const musicTracks: AudioTrack[] = [
  {
    id: "lofi",
    title: "Lo-fi 低速节拍",
    subtitle: "稳定、克制、适合写作",
    url: mediaUrl("NEXT_PUBLIC_AUDIO_LOFI_URL", "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"),
  },
  {
    id: "piano",
    title: "极简钢琴",
    subtitle: "轻旋律、低侵入",
    url: mediaUrl("NEXT_PUBLIC_AUDIO_PIANO_URL", "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3?filename=ambient-piano-logo-11268.mp3"),
  },
];

export const ambienceTracks: AudioTrack[] = [
  {
    id: "rain",
    title: "细雨白噪",
    subtitle: "连续雨声与低频环境",
    url: mediaUrl("NEXT_PUBLIC_AUDIO_RAIN_URL", "https://cdn.pixabay.com/download/audio/2022/03/10/audio_3d6c7b1d9b.mp3?filename=rain-ambient-110397.mp3"),
  },
  {
    id: "waves",
    title: "远岸海浪",
    subtitle: "慢节奏浪声循环",
    url: mediaUrl("NEXT_PUBLIC_AUDIO_WAVES_URL", "https://cdn.pixabay.com/download/audio/2021/09/06/audio_8fdd100fa0.mp3?filename=ocean-wave-1-18594.mp3"),
  },
];

export const focusDurations = [25, 45, 50, 90] as const;

export const defaultScene = focusScenes[0];
export const defaultMusicTrack = musicTracks[0];
export const defaultAmbienceTrack = ambienceTracks[0];

function mediaUrl(key: string, fallback: string) {
  const value = process.env[key];
  return value && value.trim() ? value.trim() : fallback;
}
