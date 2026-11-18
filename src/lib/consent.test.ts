import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { CONSENT_EVENT, CONSENT_KEY, clearGaCookies, hasAnalyticsConsent, readConsent, subscribeConsent, writeConsent } from "./consent.ts";

function installWindow(opts: { throwOnStorage?: boolean } = {}) {
  const store = new Map<string, string>();
  const win = Object.assign(new EventTarget(), {
    localStorage: {
      getItem: (k: string) => {
        if (opts.throwOnStorage) throw new Error("blocked");
        return store.get(k) ?? null;
      },
      setItem: (k: string, v: string) => {
        if (opts.throwOnStorage) throw new Error("blocked");
        store.set(k, v);
      },
    },
  });
  (globalThis as Record<string, unknown>).window = win;
  return { store, win };
}

beforeEach(() => void installWindow());
afterEach(() => void delete (globalThis as Record<string, unknown>).window);

describe("consent state", () => {
  it("defaults to no choice and no consent (opt-in)", () => {
    assert.equal(readConsent(), null);
    assert.equal(hasAnalyticsConsent(), false);
  });

  it("stores and reads granted / denied", () => {
    writeConsent("granted");
    assert.equal(readConsent(), "granted");
    assert.equal(hasAnalyticsConsent(), true);
    writeConsent("denied");
    assert.equal(readConsent(), "denied");
    assert.equal(hasAnalyticsConsent(), false);
  });

  it("ignores unknown stored values", () => {
    const { store } = installWindow();
    store.set(CONSENT_KEY, "yes please");
    assert.equal(readConsent(), null);
  });

  it("is safe when storage is blocked and treats it as no consent", () => {
    installWindow({ throwOnStorage: true });
    assert.equal(readConsent(), null);
    assert.doesNotThrow(() => writeConsent("granted"));
    assert.equal(hasAnalyticsConsent(), false);
  });

  it("notifies subscribers on change and stops after unsubscribe", () => {
    let calls = 0;
    const off = subscribeConsent(() => calls++);
    writeConsent("granted");
    assert.equal(calls, 1);
    off();
    writeConsent("denied");
    assert.equal(calls, 1);
    assert.ok(CONSENT_EVENT);
  });

  it("hasAnalyticsConsent is false on the server (no window)", () => {
    delete (globalThis as Record<string, unknown>).window;
    assert.equal(hasAnalyticsConsent(), false);
  });
});

describe("clearGaCookies", () => {
  it("expires _ga and _ga_<id> for the host and parent domain", () => {
    const writes: string[] = [];
    const doc = {
      location: { hostname: "www.vellora.my" },
      set cookie(v: string) {
        writes.push(v);
      },
      get cookie() {
        return "";
      },
    };
    clearGaCookies("G-JY698KN7MB", doc);
    assert.ok(writes.some((w) => w.startsWith("_ga=;") && w.includes("1970")));
    assert.ok(writes.some((w) => w.startsWith("_ga_JY698KN7MB=;") && w.includes("domain=.vellora.my")));
    assert.ok(writes.every((w) => !w.includes("G-JY698KN7MB")));
  });
});
