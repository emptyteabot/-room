import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

export type VipLedgerRecord = {
  account: string;
  vip_expires_at: string;
  order_id: string;
  amount: number;
  updated_at: string;
  referrer_id?: string;
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
    const ledgerPath = getLedgerPath();
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

    const ledgerDirectory = path.dirname(ledgerPath);
    const temporaryPath = path.join(ledgerDirectory, `${path.basename(ledgerPath)}.${process.pid}.${Date.now()}.tmp`);

    mkdirSync(ledgerDirectory, { recursive: true });
    writeFileSync(temporaryPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
    renameSync(temporaryPath, ledgerPath);

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
  };
}

async function acquireLedgerLock() {
  const ledgerPath = getLedgerPath();
  const ledgerLockPath = getLedgerLockPath();
  mkdirSync(path.dirname(ledgerPath), { recursive: true });

  while (true) {
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

function isFileExistsError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST";
}
