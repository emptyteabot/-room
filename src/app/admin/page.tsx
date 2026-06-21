import { getBuddySceneBreakdown, getBuddyStatus } from "@/lib/buddies";
import { getVipAggregateStats } from "@/lib/vip-ledger";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const buddyStatus = getBuddyStatus();
  const vipStats = getVipAggregateStats();
  const topScenes = getBuddySceneBreakdown().slice(0, 5);

  const metrics = [
    {
      label: "在线人数",
      value: buddyStatus.online_count,
      detail: `${buddyStatus.focusing_count} 人专注中`,
    },
    {
      label: "累计用户",
      value: vipStats.total_users,
      detail: `${vipStats.active_vip_count} 位活跃 VIP`,
    },
    {
      label: "邀请转化",
      value: vipStats.referred_conversion_count,
      detail: "成功绑定 referrer_id 的用户数",
    },
    {
      label: "累计专注",
      value: `${Math.floor(vipStats.total_focus_seconds / 60)}m`,
      detail: `${vipStats.total_completed_sessions} 个完成轮次`,
    },
    {
      label: "累计收入",
      value: `¥${vipStats.total_revenue}`,
      detail: "账本内已记录金额",
    },
  ];

  return (
    <main className="min-h-dvh bg-[#060606] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.34em] text-emerald-200/70">VIBE STUDYING · GROWTH</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">增长看板</h1>
            <p className="mt-3 text-sm leading-7 text-white/58">基于当前账本与在线状态生成，适合快速查看在线、VIP、邀请与专注数据。</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/56 backdrop-blur-xl">
            更新时间：{new Date().toLocaleString("zh-CN", { hour12: false })}
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-2xl">
              <p className="text-sm text-white/46">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
              <p className="mt-3 text-xs leading-6 text-white/52">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.32em] text-emerald-200/70">TOP SCENES</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">当前热门场景</h2>
            </div>
            <div className="text-sm text-white/48">实时在线维度</div>
          </div>

          <div className="mt-6 space-y-3">
            {topScenes.length ? (
              topScenes.map((scene, index) => (
                <div
                  key={scene.scene_id}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/24 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white/42">#{index + 1}</p>
                    <p className="truncate text-lg font-semibold text-white">{scene.scene_title}</p>
                    <p className="truncate text-xs text-white/44">{scene.scene_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">{scene.online_count} 人</p>
                    <p className="text-xs text-white/44">{scene.focusing_count} 人专注中</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-white/46">
                暂无在线场景数据
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
