import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gaInitScript, gaScriptSrc, validGaId } from "./ga.ts";

describe("validGaId", () => {
  it("accepts a well-formed Measurement ID and trims it", () => {
    assert.equal(validGaId(" G-JY698KN7MB "), "G-JY698KN7MB");
  });
  it("rejects missing, empty and malformed values so analytics stays off", () => {
    for (const v of [undefined, null, "", "  ", "UA-123-1", "G-", "g-abc", 'G-AB"CD', "G-AB;alert(1)"]) assert.equal(validGaId(v), null);
  });
});

describe("gaInitScript", () => {
  const script = gaInitScript("G-JY698KN7MB");
  it("configures the given ID exactly once, with no manual page_view", () => {
    assert.equal(script.split("G-JY698KN7MB").length - 1, 1);
    assert.ok(script.includes("gtag('config',\"G-JY698KN7MB\")"));
    assert.ok(!script.includes("page_view"));
  });
  it("keeps advertising storage denied and only grants analytics storage", () => {
    assert.ok(script.includes("analytics_storage:'granted'"));
    for (const k of ["ad_storage", "ad_user_data", "ad_personalization"]) assert.ok(script.includes(`${k}:'denied'`));
  });
  it("points the loader at googletagmanager with the encoded ID", () => {
    assert.equal(gaScriptSrc("G-JY698KN7MB"), "https://www.googletagmanager.com/gtag/js?id=G-JY698KN7MB");
  });
});
