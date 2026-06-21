import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

export type VipLedgerRecord = {
  account: string;
  vip_expires_at: string;
  order_id: string;
  amount: number;
  updated_at: string;
  referrer_id?: string;
  stats?: VipLedgerStats;
};

export type VipLedgerStats = {
  stats_date: string;
  today_focus_seconds: number;
  completed_sessions: number;
  total_focus_seconds: number;
  current_task?: string;
  synced_at: string;
};

type VipLedger = Record<string, VipLedgerRecord>;

function readLedger(): VipLedger {
  const ledgerPath = getLedgerPath();
  const content = existsSync(ledgerPath) ? readFileSync(ledgerPath, "utf8") : "{}";
  return JSON.parse(content) as VipLedger;
}

export async function activateVip(input: {
  account: string;
  orderId: string;
  amount: number;
  months: number;
  referrerId?: string;
  rewardDays?: number;
}) {
  await acquireLedgerLock();

  try {
    const ledger = readLedger();
    const now = new Date();
    const isNewAccount = !ledger[input.account];
    const currentExpiresAt = ledger[input.account]?.vip_expires_at;
    const baseDate = currentExpiresAt && new Date(currentExpiresAt) > now ? new Date(currentExpiresAt) : new Date(now);
    baseDate.setMonth(baseDate.getMonth() + input.months);

    const referrerId = input.referrerId && input.referrerId !== input.account ? input.referrerId : undefined;
    const storedReferrerId = ledger[input.account]?.referrer_id ?? referrerId;

    ledger[input.account] = {
      account: input.account,
      vip_expires_at: baseDate.toISOString(),
      order_id: input.orderId,
      amount: input.amount,
      updated_at: now.toISOString(),
      ...(storedReferrerId ? { referrer_id: storedReferrerId } : {}),
    };

    const rewardDays = input.rewardDays ?? 0;
    const referrer = referrerId ? ledger[referrerId] : undefined;

    if (isNewAccount && referrerId && referrer && referrerId !== input.account && rewardDays > 0) {
      const referrerBaseDate = new Date(referrer.vip_expires_at) > now ? new Date(referrer.vip_expires_at) : new Date(now);
      referrerBaseDate.setDate(referrerBaseDate.getDate() + rewardDays);

      ledger[referrerId] = {
        ...referrer,
        vip_expires_at: referrerBaseDate.toISOString(),
        updated_at: now.toISOString(),
      };
    }

    writeLedger(ledger);

    return {
      record: ledger[input.account],
      rewardedReferrer: referrerId ? ledger[referrerId] : undefined,
    };
  } finally {
    rmSync(getLedgerLockPath(), { force: true });
  }
}

export function getVipUserStatus(anonymousUserId: string) {
  const ledger = readLedger();
  const record = ledger[anonymousUserId];
  const referredSuccessCount = Object.values(ledger).filter((item) => item.referrer_id === anonymousUserId).length;

  return {
    vip_expires_at: record?.vip_expires_at ?? null,
    referred_success_count: referredSuccessCount,
    stats: record?.stats ?? null,
  };
}

export function getVipAggregateStats() {
  const ledger = readLedger();
  const records = Object.values(ledger);
  const now = Date.now();

  return {
    total_users: records.length,
    active_vip_count: records.filter((record) => new Date(record.vip_expires_at).getTime() > now).length,
    total_revenue: records.reduce((sum, record) => sum + record.amount, 0),
    referred_conversion_count: records.filter((record) => record.referrer_id).length,
    total_focus_seconds: records.reduce((sum, record) => sum + (record.stats?.total_focus_seconds ?? 0), 0),
    total_completed_sessions: records.reduce((sum, record) => sum + (record.stats?.completed_sessions ?? 0), 0),
  };
}

export async function syncVipUserStats(input: {
  anonymousUserId: string;
  statsDate: string;
  todayFocusSeconds: number;
  completedSessions: number;
  totalFocusSeconds: number;
  currentTask?: string;
}) {
  await acquireLedgerLock();

  try {
    const ledger = readLedger();
    const now = new Date().toISOString();
    const existingRecord = ledger[input.anonymousUserId];
    const existingStats = existingRecord?.stats;
    const todayFocusSeconds = Math.max(input.todayFocusSeconds, existingStats?.today_focus_seconds ?? 0);
    const completedSessions = Math.max(input.completedSessions, existingStats?.completed_sessions ?? 0);
    const totalFocusSeconds = Math.max(input.totalFocusSeconds, existingStats?.total_focus_seconds ?? 0);

    ledger[input.anonymousUserId] = {
      account: input.anonymousUserId,
      vip_expires_at: existingRecord?.vip_expires_at ?? now,
      order_id: existingRecord?.order_id ?? "stats-sync",
      amount: existingRecord?.amount ?? 0,
      updated_at: now,
      ...(existingRecord?.referrer_id ? { referrer_id: existingRecord.referrer_id } : {}),
      stats: {
        stats_date: input.statsDate,
        today_focus_seconds: todayFocusSeconds,
        completed_sessions: completedSessions,
        total_focus_seconds: totalFocusSeconds,
        ...(input.currentTask ? { current_task: input.currentTask } : {}),
        synced_at: now,
      },
    };

    writeLedger(ledger);

    return getVipUserStatus(input.anonymousUserId);
  } finally {
    rmSync(getLedgerLockPath(), { force: true });
  }
}

async function acquireLedgerLock() {
  const ledgerPath = getLedgerPath();
  const ledgerLockPath = getLedgerLockPath();
  const deadline = Date.now() + 5000;
  mkdirSync(path.dirname(ledgerPath), { recursive: true });

  while (true) {
    if (Date.now() > deadline) {
      throw new Error("ledger_lock_timeout");
    }

    try {
      const fileDescriptor = openSync(ledgerLockPath, "wx");
      closeSync(fileDescriptor);
      return;
    } catch (error) {
      if (!isFileExistsError(error)) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 12));
    }
  }
}

function getLedgerPath() {
  return process.env.FOCUS_ROOM_LEDGER_PATH ?? path.join(process.cwd(), "data", "vip-ledger.json");
}

function getLedgerLockPath() {
  return `${getLedgerPath()}.lock`;
}

function writeLedger(ledger: VipLedger) {
  const ledgerPath = getLedgerPath();
  const ledgerDirectory = path.dirname(ledgerPath);
  const temporaryPath = path.join(ledgerDirectory, `${path.basename(ledgerPath)}.${process.pid}.${Date.now()}.tmp`);

  mkdirSync(ledgerDirectory, { recursive: true });
  writeFileSync(temporaryPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
  renameSync(temporaryPath, ledgerPath);
}

function isFileExistsError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST";
}
