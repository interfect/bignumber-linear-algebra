import assert from "assert";
import Vec from "../src/vector";

describe('Basic vector tests', () => {
  describe('Empty vector', () => {
    it('Should return an empty number array', () => {
      assert.equal(new Vec().toNumber(), []);
    })
  })
})