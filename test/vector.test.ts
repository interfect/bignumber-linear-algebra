import assert from "assert";
import Vec from "../src/vector";

describe("Vector creation", () => {
  it("Should return an empty number array", () => {
    assert.deepStrictEqual(new Vec().toNumber(), []);
  });
  it("Should contain 1, 2", () => {
    const v = new Vec([1, 2]);
    assert.deepStrictEqual(v.toNumber(), [1, 2]);
  });
});

describe("Vector basic arithmetics", () => {
  const vec = new Vec([1, 2, 3]);
  it("Should add all numbers in vector by 1", () => {
    assert.deepStrictEqual(vec.add(1).toNumber(), [2, 3, 4]);
  });
  it("Should subtract all numbers in vector by 1", () => {
    assert.deepStrictEqual(vec.sub(1).toNumber(), [0, 1, 2]);
  });
  it("Should divide all numbers in vector by 2", () => {
    assert.deepStrictEqual(new Vec([2, 4, 6]).div(2).toNumber(), [1, 2, 3]);
  });
  it("Should multiply all numbers in vector by 2", () => {
    assert.deepStrictEqual(vec.mul(2).toNumber(), [2, 4, 6]);
  });
});

describe("Vector to vector arithmetics", () => {
  const vec1 = new Vec([2, 4, 6]);
  const vec2 = new Vec([1, 2, 3]);

  it('Should add both vectors', () => {
    assert.deepStrictEqual(vec1.add(vec2).toNumber(), [3, 6, 9]);
  })
  it('Should subtract vectors', () => {
    assert.deepStrictEqual(vec1.sub(vec2).toNumber(), [1, 2, 3]);
  })
  it('Should multiply vectors', () => {
    assert.deepStrictEqual(vec1.mul(vec2).toNumber(), [2, 8, 18]);
  })
  it('Should divide vectors', () => {
    assert.deepStrictEqual(vec1.div(vec2).toNumber(), [2, 2, 2]);
  })
});
