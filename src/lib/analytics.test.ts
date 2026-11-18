import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { sanitizeParams, trackEvent } from "./analytics.ts";
import { CONSENT_KEY } from "./consent.ts";

type Call = [string, string, Record<string, string>];
type Win = { gtag?: (...a: Call) => void; localStorage: { getItem: (k: string) => string | null } };
const g = globalThis as unknown as { window?: Win };
const win = (gtag?: Win["gtag"], consent: string | null = "granted"): Win => ({
  gtag,
  localStorage: { getItem: (k) => (k === CONSENT_KEY ? consent : null) },
});

afterEach(() => {
  delete g.window;
});

describe("trackEvent", () => {
  it("is a no-op when gtag is not loaded", () => {
    assert.equal(trackEvent({ name: "premium_click", params: { placement: "plans_section" } }), false);
    g.window = win(undefined);
    assert.equal(trackEvent({ name: "premium_click", params: { placement: "plans_section" } }), false);
  });

  it("sends nothing without consent, even if gtag exists", () => {
    const calls: Call[] = [];
    for (const consent of [null, "denied"]) {
      g.window = win((...a: Call) => void calls.push(a), consent);
      assert.equal(trackEvent({ name: "contact_click", params: { method: "email", placement: "footer" } }), false);
    }
    assert.deepEqual(calls, []);
  });

  it("sends the event name and params to gtag exactly once", () => {
    const calls: Call[] = [];
    g.window = win((...a: Call) => void calls.push(a));
    assert.equal(trackEvent({ name: "app_download_click", params: { store: "google_play", placement: "hero" } }), true);
    assert.deepEqual(calls, [["event", "app_download_click", { store: "google_play", placement: "hero" }]]);
  });

  it("drops undefined params and never throws if gtag throws", () => {
    const calls: Call[] = [];
    g.window = win((...a: Call) => void calls.push(a));
    trackEvent({ name: "premium_click", params: { placement: "plans_section", plan: undefined } });
    assert.deepEqual(calls[0][2], { placement: "plans_section" });
    g.window = win(() => { throw new Error("boom"); });
    assert.equal(trackEvent({ name: "contact_click", params: { method: "email", placement: "footer" } }), false);
  });
});

describe("sanitizeParams", () => {
  it("removes email-like, empty and overlong values", () => {
    assert.deepEqual(
      sanitizeParams({ a: "ok", b: "someone@example.com", c: "", d: "x".repeat(61), e: undefined }),
      { a: "ok" },
    );
  });
});
