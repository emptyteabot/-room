import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

export type BuddyHeartbeat = {
  anonymous_user_id: string;
  scene_id: string;
  scene_title: string;
  is_focusing: boolean;
  current_task?: string;
  updated_at: string;
};

type BuddyLedger = Record<string, BuddyHeartbeat>;

export async function updateBuddyHeartbeat(input: {
  anonymousUserId: string;
  sceneId: string;
  sceneTitle: string;
  isFocusing: boolean;
  currentTask?: string;
}) {
  await acquireBuddyLock();

  try {
    const now = new Date();
    const ledger = readBuddyLedger();

    ledger[input.anonymousUserId] = {
      anonymous_user_id: input.anonymousUserId,
      scene_id: input.sceneId,
      scene_title: input.sceneTitle,
      is_focusing: input.isFocusing,
      ...(input.currentTask ? { current_task: input.currentTask } : {}),
      updated_at: now.toISOString(),
    };

    const activeLedger = pruneInactiveBuddies(ledger, now);
    writeBuddyLedger(activeLedger);

    const activeBuddies = Object.values(activeLedger);

    return {
      online_count: activeBuddies.length,
      same_scene_count: activeBuddies.filter((buddy) => buddy.scene_id === input.sceneId).length,
      focusing_count: activeBuddies.filter((buddy) => buddy.is_focusing).length,
      updated_at: now.toISOString(),
    };
  } finally {
    rmSync(getBuddyLockPath(), { force: true });
  }
}

export function getBuddyStatus(sceneId?: string) {
  const now = new Date();
  const activeLedger = pruneInactiveBuddies(readBuddyLedger(), now);
  const activeBuddies = Object.values(activeLedger);

  return {
    online_count: activeBuddies.length,
    same_scene_count: sceneId ? activeBuddies.filter((buddy) => buddy.scene_id === sceneId).length : 0,
    focusing_count: activeBuddies.filter((buddy) => buddy.is_focusing).length,
    updated_at: now.toISOString(),
  };
}

export function getBuddySceneBreakdown() {
  const activeLedger = pruneInactiveBuddies(readBuddyLedger(), new Date());
  const breakdown = new Map<string, { scene_id: string; scene_title: string; online_count: number; focusing_count: number }>();

  Object.values(activeLedger).forEach((buddy) => {
    const current = breakdown.get(buddy.scene_id) ?? {
      scene_id: buddy.scene_id,
      scene_title: buddy.scene_title,
      online_count: 0,
      focusing_count: 0,
    };

    current.online_count += 1;
    current.focusing_count += buddy.is_focusing ? 1 : 0;
    breakdown.set(buddy.scene_id, current);
  });

  return Array.from(breakdown.values()).sort((left, right) => right.online_count - left.online_count);
}

function readBuddyLedger(): BuddyLedger {
  const ledgerPath = getBuddyLedgerPath();
  const content = existsSync(ledgerPath) ? readFileSync(ledgerPath, "utf8") : "{}";
  return JSON.parse(content) as BuddyLedger;
}

function pruneInactiveBuddies(ledger: BuddyLedger, now: Date) {
  const activeAfter = now.getTime() - 120000;

  return Object.fromEntries(
    Object.entries(ledger).filter(([, buddy]) => new Date(buddy.updated_at).getTime() >= activeAfter),
  );
}

async function acquireBuddyLock() {
  const ledgerPath = getBuddyLedgerPath();
  const lockPath = getBuddyLockPath();
  mkdirSync(path.dirname(ledgerPath), { recursive: true });

  while (true) {
    try {
      const fileDescriptor = openSync(lockPath, "wx");
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

function writeBuddyLedger(ledger: BuddyLedger) {
  const ledgerPath = getBuddyLedgerPath();
  const ledgerDirectory = path.dirname(ledgerPath);
  const temporaryPath = path.join(ledgerDirectory, `${path.basename(ledgerPath)}.${process.pid}.${Date.now()}.tmp`);

  mkdirSync(ledgerDirectory, { recursive: true });
  writeFileSync(temporaryPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
  renameSync(temporaryPath, ledgerPath);
}

function getBuddyLedgerPath() {
  return process.env.FOCUS_ROOM_BUDDY_LEDGER_PATH ?? path.join(process.cwd(), "data", "buddy-ledger.json");
}

function getBuddyLockPath() {
  return `${getBuddyLedgerPath()}.lock`;
}

function isFileExistsError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST";
}
