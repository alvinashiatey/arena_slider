import hello from "../src/hello";
import { expect, it, describe } from "vitest";

describe("#hello", () => {
  it("should return a string with hello", function () {
    expect(hello()).toBe("hello");
  });
});
