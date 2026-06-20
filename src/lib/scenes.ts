import {
  CloudRain,
  CloudSun,
  Droplets,
  Flower2,
  Leaf,
  MoonStar,
  MountainSnow,
  Sunrise,
  Trees,
  WavesHorizontal,
} from "lucide-react";
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
    id: "snow-lake",
    title: "星河雪山",
    subtitle: "雪峰、星河、低刺激白噪",
    tone: "SNOW",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_SNOW_LAKE_VIDEO", "https://assets.mixkit.co/videos/3397/3397-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_SNOW_LAKE_POSTER", "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=90"),
    icon: MountainSnow,
  },
  {
    id: "alpine-clouds",
    title: "雪岭云海",
    subtitle: "高海拔、云层、冷色沉浸",
    tone: "ALPINE",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_ALPINE_CLOUDS_VIDEO", "https://assets.mixkit.co/videos/3335/3335-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_ALPINE_CLOUDS_POSTER", "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1800&q=90"),
    icon: MountainSnow,
  },
  {
    id: "rocky-creek",
    title: "岩溪慢流",
    subtitle: "岩石、溪水、稳定流动",
    tone: "CREEK",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_ROCKY_CREEK_VIDEO", "https://assets.mixkit.co/videos/51585/51585-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_ROCKY_CREEK_POSTER", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=90"),
    icon: Droplets,
  },
  {
    id: "deep-forest",
    title: "深林晨雾",
    subtitle: "森林、湿润空气、慢推镜头",
    tone: "FOREST",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_DEEP_FOREST_VIDEO", "https://assets.mixkit.co/videos/50847/50847-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_DEEP_FOREST_POSTER", "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=90"),
    icon: Trees,
  },
  {
    id: "ocean-sunset",
    title: "远海落日",
    subtitle: "海平线、暖色日落、慢节奏",
    tone: "SUNSET",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_OCEAN_SUNSET_VIDEO", "https://assets.mixkit.co/videos/51445/51445-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_OCEAN_SUNSET_POSTER", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=90"),
    icon: Sunrise,
  },
  {
    id: "shore-waves",
    title: "海岸浪涌",
    subtitle: "浪花、岸线、周期性呼吸",
    tone: "WAVE",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_SHORE_WAVES_VIDEO", "https://assets.mixkit.co/videos/5016/5016-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_SHORE_WAVES_POSTER", "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=90"),
    icon: WavesHorizontal,
  },
  {
    id: "rain-glass",
    title: "雨幕窗景",
    subtitle: "雨滴、玻璃、柔暗环境",
    tone: "RAIN",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_RAIN_GLASS_VIDEO", "https://assets.mixkit.co/videos/2846/2846-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_RAIN_GLASS_POSTER", "https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?auto=format&fit=crop&w=1800&q=90"),
    icon: CloudRain,
  },
  {
    id: "green-meadow",
    title: "山地草甸",
    subtitle: "草坡、远山、低频风声",
    tone: "MEADOW",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_GREEN_MEADOW_VIDEO", "https://assets.mixkit.co/videos/4075/4075-1080.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_GREEN_MEADOW_POSTER", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=90"),
    icon: Leaf,
  },
  {
    id: "sky-clouds",
    title: "流云天幕",
    subtitle: "蓝天、云层、呼吸感留白",
    tone: "SKY",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_SKY_CLOUDS_VIDEO", "https://assets.mixkit.co/videos/26108/26108-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_SKY_CLOUDS_POSTER", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=90"),
    icon: CloudSun,
  },
  {
    id: "sunflower-field",
    title: "向日葵原野",
    subtitle: "花海、阳光、柔和明亮",
    tone: "FIELD",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_SUNFLOWER_FIELD_VIDEO", "https://assets.mixkit.co/videos/4881/4881-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_SUNFLOWER_FIELD_POSTER", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=90"),
    premium: true,
    icon: Flower2,
  },
  {
    id: "starfield",
    title: "深空星野",
    subtitle: "星空、暗场、夜间长专注",
    tone: "STARS",
    videoUrl: mediaUrl("NEXT_PUBLIC_SCENE_STARFIELD_VIDEO", "https://assets.mixkit.co/videos/1610/1610-2160.mp4"),
    posterUrl: mediaUrl("NEXT_PUBLIC_SCENE_STARFIELD_POSTER", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=90"),
    premium: true,
    icon: MoonStar,
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
