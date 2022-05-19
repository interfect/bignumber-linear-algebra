import Vec, { VecBasicValues } from "./vector";
import BigNumber from "bignumber.js";

type MatrixBasicValues = Vec[] | VecBasicValues[];

export default class Matrix {
  _matrix: Vec[];

  constructor(values?: Vec | Matrix | MatrixBasicValues) {
    // empty matrix
    if (!values) { 
      this._matrix = [];
    }
    // values as matrix
    else if (values instanceof Matrix) {
      this._matrix = [...values._matrix];
    }
    else if (values instanceof Vec) {
      this._matrix = [values.copy()];
    }
    // vector values
    else if (values.length > 0 && values[0] instanceof Vec) {
      const length = values[0].size();
      values.forEach((value) => {
        if ((value as Vec).size() !== length) {
          throw new Error('All matrix vectors must have the same size')
        }
      })
      this._matrix = values as Vec[];
    }
    // basic number/string/bignumber values
    else {
      this._matrix = values.map((value) => new Vec(value));
    }
  }

  static empty(width: number, height: number, defaultValue=0) {
    return new Matrix(Array(height).map(() => Vec.empty(width, defaultValue)));
  }

  transpose(): Matrix {
    const values: Vec[] = []
    const elements = this._matrix.length > 0
      ? this._matrix[0].size()
      : 0;
    for (let column = 0; column < elements; column ++) {
      const val: BigNumber[] = [];
      for (let row = 0; row < this._matrix.length; row ++) {
        val.push(this._matrix[row].get(column));
      }
      values.push(new Vec(val));
    }
    return new Matrix(values);
  }

  // Element wise operations
  add(matrix: number|string|BigNumber|Vec|Matrix): Matrix {
    return this._action(matrix, (v1, v2) => v1.add(v2));
  }
  sub(matrix: number|string|BigNumber|Vec|Matrix): Matrix { 
    return this._action(matrix, (v1, v2) => v1.sub(v2));
  }
  div(matrix: number|string|BigNumber|Vec|Matrix): Matrix {
    return this._action(matrix, (v1, v2) => v1.div(v2));
  }
  mul(matrix: number|string|BigNumber|Vec|Matrix): Matrix {
    return this._action(matrix, (v1, v2) => v1.mul(v2));
  }

  // 
  dot(value: Vec|Matrix): Matrix {
    const val = value instanceof Matrix 
      ? value.transpose() 
      : new Matrix(value);

    const vals = this._matrix.map((v1) => 
      new Vec(val._matrix.map((v2) => v1.mul(v2).sum()))
    )
    return new Matrix(vals);
  }

  get(index: number): Vec {
    if (index < 0 || index > this._matrix.length) {
      throw new Error('Out of bounds Matrix:get');
    } 
    return this._matrix[index];
  }  
  toString(): string {
    return `[${this._matrix.map((vec) => vec.toString()).join(', \n ')}]`;
  }
  toNumber(): number[][] {
    return this._matrix.map((vec) => vec.toNumber());
  }
  size(): [number, number] {
    const len = this._matrix.length;
    return [len, len > 0 ? this._matrix[0].size() : 0];
  }


  // Private functions
  _action(value: number|string|BigNumber|Vec|Matrix, fn: (v1: Vec, v2: BigNumber|Vec) => Vec): Matrix {
    let values: Vec[] = [];
    if (value instanceof Matrix) {
      const [ch] = this.size();
      const [vh] = value.size();
      if (ch !== vh) {
        throw new Error('Matrix sizes do not match!')
      }
      values = this._matrix.map((vec, index) => fn(vec, value.get(index)));
    } else if (value instanceof Vec || value instanceof BigNumber) {
      values = this._matrix.map((vec) => fn(vec, value));
    } else {
      const val = new BigNumber(value);
      values = this._matrix.map((vec) => fn(vec, val));
    }
    return new Matrix(values);
  }
}