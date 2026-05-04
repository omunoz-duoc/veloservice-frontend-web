import { describe, it, expect } from "vitest";
import { getPasswordScore } from "./PasswordMeter";

describe("getPasswordScore", () => {
  it("returns 0 for empty password", () => {
    expect(getPasswordScore("")).toBe(0);
  });

  it("returns 1 for only length >= 10", () => {
    expect(getPasswordScore("abcdefghij")).toBe(1);
  });

  it("returns 2 for length + uppercase", () => {
    expect(getPasswordScore("Abcdefghij")).toBe(2);
  });

  it("returns 3 for length + uppercase + number", () => {
    expect(getPasswordScore("Abcdefghi1")).toBe(3);
  });

  it("returns 4 for all rules met", () => {
    expect(getPasswordScore("Abcdefgh1!")).toBe(4);
  });

  it("returns 0 for short password even with all other rules", () => {
    expect(getPasswordScore("Ab1!")).toBe(0);
  });
});
