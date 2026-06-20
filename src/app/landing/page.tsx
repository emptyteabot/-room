import Link from "next/link";
import { ArrowRight, Bolt, Headphones, MonitorSmartphone, ShieldCheck, TimerReset, Wallpaper } from "lucide-react";

const features = [
  {
    title: "无需内测码",
    description: "打开即用，跳过进群、等待、发码，把第一分钟直接留给学习。",
    icon: Bolt,
  },
  {
    title: "无需注册登录",
    description: "匿名 ID 自动生成，本地统计与服务端资产轻量同步，不打断专注流程。",
    icon: ShieldCheck,
  },
  {
    title: "7 个沉浸场景",
    description: "动态 1080p 自习室背景全部走外部 CDN，低成本承接高并发访问。",
    icon: Wallpaper,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#090909] text-[#e5e2e1]">
      <section className="relative min-h-dvh px-4 py-4 sm:px-6 lg:px-12">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-42"
          src="https://assets.mixkit.co/videos/43391/43391-1080.mp4"
          poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=82"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_38%,rgba(79,219,200,0.16),transparent_30%),linear-gradient(180deg,rgba(9,9,9,0.2),#090909_90%)]" />
        <nav className="relative z-10 mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 backdrop-blur-2xl">
          <Link className="text-lg font-semibold text-[#4fdbc8]" href="/landing">
            专注一隅
          </Link>
          <div className="hidden items-center gap-7 text-sm text-white/58 md:flex">
            <a className="transition hover:text-white" href="#features">
              场景
            </a>
            <a className="transition hover:text-white" href="#timer">
              番茄钟
            </a>
            <a className="transition hover:text-white" href="#install">
              PWA
            </a>
          </div>
          <Link
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#4fdbc8]/35 bg-[#4fdbc8]/12 px-3 text-sm font-medium text-[#71f8e4] transition hover:bg-[#4fdbc8]/18"
            href="/"
          >
            免费进入
            <ArrowRight className="size-4" />
          </Link>
        </nav>
        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl items-center pt-10">
          <div className="max-w-3xl pb-20 pt-20">
            <p className="mb-5 text-xs font-semibold tracking-[0.42em] text-[#4fdbc8]/78">FOCUS CORNER · WEB STUDY ROOM</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
              在城市的喧嚣中，为你预留一隅。
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/66">
              无需内测码、无需登录，打开网页即可进入沉浸式线上自习室。全屏动态场景、双路 Lofi 混音、精准番茄钟和 PWA 安装已经就绪。
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex h-13 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#14b8a6] to-[#4fdbc8] px-6 text-base font-semibold text-[#00201c] shadow-[0_0_28px_rgba(79,219,200,0.28)] transition hover:scale-[1.02]"
                href="/"
              >
                免费进入自习室
                <ArrowRight className="size-5" />
              </Link>
              <span className="rounded-2xl border border-white/10 bg-white/7 px-5 py-3 text-sm text-white/56 backdrop-blur-xl">
                7 个场景 · 本地统计 · 裂变分享
              </span>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="mx-auto -mt-24 grid max-w-6xl gap-4 px-4 pb-24 sm:px-6 md:grid-cols-3 lg:px-0">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article key={feature.title} className="rounded-3xl border border-white/10 bg-white/7 p-6 backdrop-blur-2xl">
              <div className="mb-5 grid size-12 place-items-center rounded-full border border-[#4fdbc8]/20 bg-[#4fdbc8]/10 text-[#4fdbc8]">
                <Icon className="size-5" />
              </div>
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/58">{feature.description}</p>
            </article>
          );
        })}
      </section>
      <section id="timer" className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-0">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.36em] text-[#4fdbc8]/70">MIXER · POMODORO · STATS</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">双声道混音器和精准番茄钟已经内置。</h2>
          <p className="mt-5 max-w-lg text-base leading-8 text-white/58">
            音乐、雨声、海浪和任务目标集中在一个毛玻璃面板里。完成一轮后自动同步匿名统计，不需要注册账号。
          </p>
        </div>
        <div className="relative rounded-3xl border border-white/10 bg-white/7 p-5 backdrop-blur-2xl">
          <div className="absolute -right-4 -top-4 size-28 rounded-full bg-[#4fdbc8]/18 blur-3xl" />
          <div className="relative rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.32em] text-white/38">POMODORO</span>
              <TimerReset className="size-5 text-[#4fdbc8]" />
            </div>
            <p className="text-center text-6xl font-semibold tabular-nums text-[#4fdbc8] sm:text-7xl">25:00</p>
            <div className="mt-7 space-y-5">
              <PreviewSlider icon={<Headphones className="size-4" />} label="Lofi Focus" value="42%" />
              <PreviewSlider icon={<MonitorSmartphone className="size-4" />} label="Rain Ambience" value="75%" />
            </div>
            <div className="mt-7 grid grid-cols-3 gap-2 text-center">
              <PreviewMetric label="今日" value="50m" />
              <PreviewMetric label="轮次" value="2" />
              <PreviewMetric label="累计" value="240m" />
            </div>
          </div>
        </div>
      </section>
      <section id="install" className="px-4 pb-24 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-white/10 bg-white/7 p-8 text-center backdrop-blur-2xl sm:p-12">
          <MonitorSmartphone className="mb-6 size-12 text-[#4fdbc8]" />
          <h2 className="text-3xl font-semibold text-white">添加到桌面，像原生应用一样打开。</h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/58">
            PWA 外壳、离线兜底页和安装入口已经接入。恢复网络后，统计和会员资产会继续同步到服务端账本。
          </p>
          <Link
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl border border-[#4fdbc8]/35 bg-[#4fdbc8]/10 px-5 text-sm font-semibold text-[#71f8e4] transition hover:bg-[#4fdbc8]/18"
            href="/"
          >
            进入并安装
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <footer className="border-t border-white/8 bg-black/30 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-white/42 md:flex-row">
          <span className="font-semibold text-white/70">专注一隅</span>
          <span>零门槛沉浸式线上自习室</span>
        </div>
      </footer>
    </main>
  );
}

type PreviewSliderProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function PreviewSlider({ icon, label, value }: PreviewSliderProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-white/60">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
        <div className="h-full rounded-full bg-[#4fdbc8] shadow-[0_0_14px_rgba(79,219,200,0.58)]" style={{ width: value }} />
      </div>
    </div>
  );
}

type PreviewMetricProps = {
  label: string;
  value: string;
};

function PreviewMetric({ label, value }: PreviewMetricProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/6 px-3 py-3">
      <p className="text-[0.64rem] font-semibold tracking-[0.24em] text-white/36">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-white/76">{value}</p>
    </div>
  );
}
