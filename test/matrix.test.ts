import assert from "assert";
import Vec from "../src/vector";
import Matrix from "../src/matrix";

describe("Matrix creation", () => {
  it("Should return an empty number array", () => {
    assert.deepStrictEqual(new Matrix().toNumber(), []);
  });
  it("Should contain [[1], [2]]", () => {
    const v = new Matrix([[1], [2]]);
    assert.deepStrictEqual(v.toNumber(), [[1], [2]]);
  });
});

describe("Matrix basic arithmetics", () => {
  const matrix = new Matrix([[1, 2, 3]]);
  it("Should add all numbers in matrix by 1", () => {
    assert.deepStrictEqual(matrix.add(1).toNumber(), [[2, 3, 4]]);
  });
  it("Should subtract all numbers in matrix by 1", () => {
    assert.deepStrictEqual(matrix.sub(1).toNumber(), [[0, 1, 2]]);
  });
  it("Should divide all numbers in matrix by 2", () => {
    assert.deepStrictEqual(new Matrix([[2, 4, 6]]).div(2).toNumber(), [[1, 2, 3]]);
  });
  it("Should multiply all numbers in matrix by 2", () => {
    assert.deepStrictEqual(matrix.mul(2).toNumber(), [[2, 4, 6]]);
  });
});

describe("matrix to matrix arithmetics", () => {
  const matrix1 = new Matrix([[2, 4, 6]]);
  const matrix2 = new Matrix([[1, 2, 3]]);

  it('Should add both matrixs', () => {
    assert.deepStrictEqual(matrix1.add(matrix2).toNumber(), [[3, 6, 9]]);
  })
  it('Should subtract matrixs', () => {
    assert.deepStrictEqual(matrix1.sub(matrix2).toNumber(), [[1, 2, 3]]);
  })
  it('Should multiply matrixs', () => {
    assert.deepStrictEqual(matrix1.mul(matrix2).toNumber(), [[2, 8, 18]]);
  })
  it('Should divide matrixs', () => {
    assert.deepStrictEqual(matrix1.div(matrix2).toNumber(), [[2, 2, 2]]);
  })
});
