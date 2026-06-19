import { mkdir, readFile, writeFile } from "node:fs/promises";
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

async function readLedger(): Promise<VipLedger> {
  const content = await readFile(ledgerPath, "utf8").catch(() => "{}");
  return JSON.parse(content) as VipLedger;
}

export async function activateVip(input: {
  account: string;
  orderId: string;
  amount: number;
  months: number;
}) {
  const ledger = await readLedger();
  const now = new Date();
  const currentExpiresAt = ledger[input.account]?.vip_expires_at;
  const baseDate = currentExpiresAt && new Date(currentExpiresAt) > now ? new Date(currentExpiresAt) : now;
  baseDate.setMonth(baseDate.getMonth() + input.months);

  ledger[input.account] = {
    account: input.account,
    vip_expires_at: baseDate.toISOString(),
    order_id: input.orderId,
    amount: input.amount,
    updated_at: now.toISOString(),
  };

  await mkdir(path.dirname(ledgerPath), { recursive: true });
  await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");

  return ledger[input.account];
}
