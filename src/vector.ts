import BigNumber from "bignumber.js";

export type VecBasicValues =
  | string[]
  | number[]
  | BigNumber[];

export default class Vec {
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
    return new Vec(this._vector);
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
