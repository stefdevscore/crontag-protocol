// test/primitives/access-pass/token-id.test.ts
import { expect } from "chai";
import { setupAccessPass } from "./helpers.js";

describe("AccessPassV1 — Token IDs", function () {
  it("assigns monotonically increasing tokenIds starting at 1", async () => {
    const { mintPass } = await setupAccessPass();

    const first = await mintPass();
    const second = await mintPass();
    const third = await mintPass();

    expect(first).to.equal(1n);
    expect(second).to.equal(2n);
    expect(third).to.equal(3n);
  });
});
