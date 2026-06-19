import { NextResponse } from "next/server";
import { activateVip } from "@/lib/vip-ledger";

type PaymentPayload = {
  account?: string;
  user_id?: string;
  userId?: string;
  out_trade_no?: string;
  order_id?: string;
  trade_no?: string;
  amount?: string | number;
  money?: string | number;
  status?: string;
  trade_status?: string;
  paid?: boolean;
  months?: string | number;
  token?: string;
  referrer_id?: string;
  referrerId?: string;
};

const paidStatuses = new Set(["success", "paid", "trade_success", "payment_success", "1", "true"]);

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await request.json()) as PaymentPayload)
    : Object.fromEntries(await request.formData()) as PaymentPayload;

  const expectedToken = process.env.PAYMENT_WEBHOOK_TOKEN;

  if (expectedToken && payload.token !== expectedToken) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 401 });
  }

  const status = String(payload.trade_status ?? payload.status ?? payload.paid ?? "").toLowerCase();

  if (!paidStatuses.has(status)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const account = String(payload.account ?? payload.user_id ?? payload.userId ?? "").trim();
  const orderId = String(payload.out_trade_no ?? payload.order_id ?? payload.trade_no ?? "").trim();
  const amount = Number(payload.amount ?? payload.money ?? 0);
  const months = Number(payload.months ?? 1);
  const referrerId = String(payload.referrer_id ?? payload.referrerId ?? "").trim();

  if (!account || !orderId || !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(months) || months <= 0) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const result = await activateVip({ account, orderId, amount, months, referrerId, rewardDays: 3 });

  return NextResponse.json({
    ok: true,
    vip_expires_at: result.record.vip_expires_at,
    rewarded_referrer: Boolean(result.rewardedReferrer && referrerId),
  });
}
