import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

export type VipLedgerRecord = {
  account: string;
  vip_expires_at: string;
  order_id: string;
  amount: number;
  updated_at: string;
};

type VipLedger = Record<string, VipLedgerRecord>;

const ledgerPath = path.join(process.cwd(), "data", "vip-ledger.json");
const ledgerLockPath = `${ledgerPath}.lock`;

function readLedger(): VipLedger {
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

    ledger[input.account] = {
      account: input.account,
      vip_expires_at: baseDate.toISOString(),
      order_id: input.orderId,
      amount: input.amount,
      updated_at: now.toISOString(),
    };

    const rewardDays = input.rewardDays ?? 0;
    const referrerId = input.referrerId;
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
    rmSync(ledgerLockPath, { force: true });
  }
}

async function acquireLedgerLock() {
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

function isFileExistsError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST";
}
