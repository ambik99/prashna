// The cost controls on AI requests (docs/adr/0002): at most 3 Papers an hour
// for each IP address, and a global budget of $3 a day (India time), after
// which teachers are told to try again tomorrow.
//
// The counts live in one Durable Object (LimitsObject in index.ts), so every
// request sees the same numbers. Cloudflare's rate-limit binding can't be used
// for the hourly limit: its window is at most 60 seconds. IP addresses are
// kept only as hashes, and only for the hour they count.

export const PAPERS_PER_HOUR = 3;
export const DAILY_BUDGET_DOLLARS = 3;
const HOUR = 60 * 60 * 1000;

/** The part of Durable Object storage the limits use (a Map in tests). */
export interface LimitsStore {
  get<T>(key: string): Promise<T | undefined>;
  put<T>(key: string, value: T): Promise<void>;
}

export type Admission = "ok" | "rate-limit" | "daily-limit";

interface Budget {
  day: string;
  spent: number;
}

/** The day in India, such as "2026-11-27": the budget starts again at midnight there. */
export function indiaDay(now: number): string {
  return new Date(now + 5.5 * HOUR).toISOString().slice(0, 10);
}

async function spentToday(store: LimitsStore, now: number): Promise<number> {
  const budget = await store.get<Budget>("budget");
  return budget?.day === indiaDay(now) ? budget.spent : 0;
}

/** Whether today's budget has room for another call to the model. */
export async function canSpend(store: LimitsStore, now: number): Promise<boolean> {
  return (await spentToday(store, now)) < DAILY_BUDGET_DOLLARS;
}

/** Counts a request for a Paper from this (hashed) IP address, if the limits allow it. */
export async function admit(store: LimitsStore, ipHash: string, now: number): Promise<Admission> {
  if (!(await canSpend(store, now))) return "daily-limit";
  const all = (await store.get<Record<string, number[]>>("requests")) ?? {};
  // Forget every request older than an hour, for every address.
  const recent: Record<string, number[]> = {};
  for (const [key, times] of Object.entries(all)) {
    const kept = times.filter((time) => now - time < HOUR);
    if (kept.length) recent[key] = kept;
  }
  const mine = recent[ipHash] ?? [];
  if (mine.length >= PAPERS_PER_HOUR) {
    await store.put("requests", recent);
    return "rate-limit";
  }
  recent[ipHash] = [...mine, now];
  await store.put("requests", recent);
  return "ok";
}

/** Adds what a call to the model cost to today's spending. */
export async function spend(store: LimitsStore, now: number, dollars: number): Promise<void> {
  const spent = await spentToday(store, now);
  await store.put<Budget>("budget", { day: indiaDay(now), spent: spent + dollars });
}

export async function hashIp(ip: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`prashna:${ip}`));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
