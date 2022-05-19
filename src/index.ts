
import BigNumber from "bignumber.js";

type VecBasicValues =
  | string[]
  | number[]
  | BigNumber[];

class Vec {
  _vector: BigNumber[];
  constructor(values?: VecBasicValues | Vec) {
    if (!values) { 
      this._vector = [];
    } else if (values instanceof Vec) {
      this._vector = [...values._vector];
    } else if (values.length > 0 && values[0] instanceof BigNumber) {
      this._vector = values as BigNumber[];
    } else {
      this._vector = values.map((value) => new BigNumber(value))
    }
  }

  static empty(size: number, defaultValue=0): Vec {
    return new Vec(Array(size).fill(defaultValue))
  }

  // Math
  mul(vec: string|number|BigNumber|Vec): Vec {
    return this._action(vec, (v1, v2) => v1.multipliedBy(v2))
  }
  div(vec: string|number|BigNumber|Vec): Vec {
    return this._action(vec, (v1, v2) => v1.div(v2))
  }
  add(vec: string|number|BigNumber|Vec): Vec {
    return this._action(vec, (v1, v2) => v1.plus(v2))
  }
  sub(vec: string|number|BigNumber|Vec): Vec {
    return this._action(vec, (v1, v2) => v1.minus(v2))
  }
  sum(): BigNumber {
    return this._vector.reduce((prev, curr) => prev.plus(curr), new BigNumber(0))
  }

  // 
  toNumber(): number[] {
    return this._vector.map((value) => value.toNumber())
  }
  toString(): string {
    return `[${this._vector.map((value) => value.toString()).join(', ')}]`;
  }
  copy(): Vec {
    return new Vec(this._vector);;
  }
  size(): number {
    return this._vector.length;
  }
  get(index: number): BigNumber {
    if (index > this.size() || index < 0) {
      throw new Error('Pointer is fucked');
    }
    return this._vector[index];
  }

  // Private functions
  _action(vec: string|number|BigNumber|Vec, fn: (value1: BigNumber, vec2: BigNumber) => BigNumber): Vec {
    const get = (index: number): BigNumber => {
      if (vec instanceof Vec) {
        if (vec.size() !== 1 && vec.size() !== this.size()) {
          throw new Error('Vectors are not in same size!');
        }
        return vec.size() === 1 
          ? vec.get(0) 
          : vec.get(index);
      } else {
        return new BigNumber(vec);
      }
    }

    return new Vec(this._vector.map((value, index) => fn(value, get(index))));
  }
}

type MatrixBasicValues = Vec[] | VecBasicValues[];

class Matrix {
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
    let values: Vec[] = []
    const elements = this._matrix.length > 0
      ? this._matrix[0].size()
      : 0;
    for (let column = 0; column < elements; column ++) {
      let val: BigNumber[] = [];
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


const v1 = new Vec();
const v2 = new Vec([1, 2, 3]);
// const v3 = new Vec([1, "2", 3]); // Good error!
const v4 = Vec.empty(10, 1);
const v5 = v2.copy();
const v6 = new Vec([3, 4, 5]);
console.log('Vectors')
console.log(v1.toString())
console.log(v2.toString())
console.log(v4.toString())
console.log(v5.toString())
console.log('Add vector', v2.add(10).toString())
console.log('Sub vector', v2.sub(10).toString())
console.log('Div vector', v2.div(new BigNumber(10)).toString())
console.log('Mul vector', v2.mul(10).toString())
console.log('Add vector', v2.add(v2).toString())
console.log('Sub vector', v2.sub(v2).toString())
console.log('Div vector', v2.div(v2).toString())
console.log('Mul vector', v2.mul(v2).toString())
console.log(v5.sum().toString())

console.log('Matrix')
new Matrix();
// const m1 = new Matrix([1, 2, 3]);
const m2 = new Matrix([v2, v2]);
const m3 = m2.transpose();
const m4 = new Matrix(v2)
const m5 = new Matrix([[1, 2, 3], [2, 3, 4]]);
const m6 = new Matrix([[1], [2]])
const m7 = new Matrix([[1,0,1], [0,1,2], [2,0,1]])
const m8 = new Matrix([[1,0,1], [0,1,1], [1,0,1]])
const m9 = new Matrix(v6).transpose();
console.log(m2.toString())
console.log(m3.toString())
console.log(m4.transpose().toString())
console.log(m5.toString())
console.log(m6.toString())
console.log(m5.add(m6).toString())
console.log(m5.add(1).toString())
console.log(m5.add(v2).toString())
console.log(m5.mul(v2).toString())
console.log(m5.sub("51").toString())
console.log(m7.dot(m8).toString())
console.log(m7.dot(m9).transpose().toString())

const a1 = new BigNumber(51)
console.log(a1.div(new BigNumber(10)).toNumber())