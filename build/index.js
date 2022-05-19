"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class Vec {
    constructor(values) {
        if (!values) {
            this._vector = [];
        }
        else if (values instanceof Vec) {
            this._vector = [...values._vector];
        }
        else if (values.length > 0 && values[0] instanceof bignumber_js_1.default) {
            this._vector = values;
        }
        else {
            this._vector = values.map((value) => new bignumber_js_1.default(value));
        }
    }
    static empty(size, defaultValue = 0) {
        return new Vec(Array(size).fill(defaultValue));
    }
    // Math
    mul(vec) {
        return this._action(vec, (v1, v2) => v1.multipliedBy(v2));
    }
    div(vec) {
        return this._action(vec, (v1, v2) => v1.div(v2));
    }
    add(vec) {
        return this._action(vec, (v1, v2) => v1.plus(v2));
    }
    sub(vec) {
        return this._action(vec, (v1, v2) => v1.minus(v2));
    }
    sum() {
        return this._vector.reduce((prev, curr) => prev.plus(curr), new bignumber_js_1.default(0));
    }
    // 
    toNumber() {
        return this._vector.map((value) => value.toNumber());
    }
    toString() {
        return `[${this._vector.map((value) => value.toString()).join(', ')}]`;
    }
    copy() {
        return new Vec(this._vector);
        ;
    }
    size() {
        return this._vector.length;
    }
    get(index) {
        if (index > this.size() || index < 0) {
            throw new Error('Pointer is fucked');
        }
        return this._vector[index];
    }
    // Private functions
    _action(vec, fn) {
        const get = (index) => {
            if (vec instanceof Vec) {
                if (vec.size() !== 1 && vec.size() !== this.size()) {
                    throw new Error('Vectors are not in same size!');
                }
                return vec.size() === 1
                    ? vec.get(0)
                    : vec.get(index);
            }
            else {
                return new bignumber_js_1.default(vec);
            }
        };
        return new Vec(this._vector.map((value, index) => fn(value, get(index))));
    }
}
class Matrix {
    constructor(values) {
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
                if (value.size() !== length) {
                    throw new Error('All matrix vectors must have the same size');
                }
            });
            this._matrix = values;
        }
        // basic number/string/bignumber values
        else {
            this._matrix = values.map((value) => new Vec(value));
        }
    }
    static empty(width, height, defaultValue = 0) {
        return new Matrix(Array(height).map(() => Vec.empty(width, defaultValue)));
    }
    transpose() {
        let values = [];
        const elements = this._matrix.length > 0
            ? this._matrix[0].size()
            : 0;
        for (let column = 0; column < elements; column++) {
            let val = [];
            for (let row = 0; row < this._matrix.length; row++) {
                val.push(this._matrix[row].get(column));
            }
            values.push(new Vec(val));
        }
        return new Matrix(values);
    }
    // Element wise operations
    add(matrix) {
        return this._action(matrix, (v1, v2) => v1.add(v2));
    }
    sub(matrix) {
        return this._action(matrix, (v1, v2) => v1.sub(v2));
    }
    div(matrix) {
        return this._action(matrix, (v1, v2) => v1.div(v2));
    }
    mul(matrix) {
        return this._action(matrix, (v1, v2) => v1.mul(v2));
    }
    // 
    dot(value) {
        const val = value instanceof Matrix
            ? value.transpose()
            : new Matrix(value);
        const vals = this._matrix.map((v1) => new Vec(val._matrix.map((v2) => v1.mul(v2).sum())));
        return new Matrix(vals);
    }
    get(index) {
        if (index < 0 || index > this._matrix.length) {
            throw new Error('Out of bounds Matrix:get');
        }
        return this._matrix[index];
    }
    toString() {
        return `[${this._matrix.map((vec) => vec.toString()).join(', \n ')}]`;
    }
    toNumber() {
        return this._matrix.map((vec) => vec.toNumber());
    }
    size() {
        const len = this._matrix.length;
        return [len, len > 0 ? this._matrix[0].size() : 0];
    }
    // Private functions
    _action(value, fn) {
        let values = [];
        if (value instanceof Matrix) {
            const [ch] = this.size();
            const [vh] = value.size();
            if (ch !== vh) {
                throw new Error('Matrix sizes do not match!');
            }
            values = this._matrix.map((vec, index) => fn(vec, value.get(index)));
        }
        else if (value instanceof Vec || value instanceof bignumber_js_1.default) {
            values = this._matrix.map((vec) => fn(vec, value));
        }
        else {
            const val = new bignumber_js_1.default(value);
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
console.log('Vectors');
console.log(v1.toString());
console.log(v2.toString());
console.log(v4.toString());
console.log(v5.toString());
console.log('Add vector', v2.add(10).toString());
console.log('Sub vector', v2.sub(10).toString());
console.log('Div vector', v2.div(new bignumber_js_1.default(10)).toString());
console.log('Mul vector', v2.mul(10).toString());
console.log('Add vector', v2.add(v2).toString());
console.log('Sub vector', v2.sub(v2).toString());
console.log('Div vector', v2.div(v2).toString());
console.log('Mul vector', v2.mul(v2).toString());
console.log(v5.sum().toString());
console.log('Matrix');
new Matrix();
// const m1 = new Matrix([1, 2, 3]);
const m2 = new Matrix([v2, v2]);
const m3 = m2.transpose();
const m4 = new Matrix(v2);
const m5 = new Matrix([[1, 2, 3], [2, 3, 4]]);
const m6 = new Matrix([[1], [2]]);
const m7 = new Matrix([[1, 0, 1], [0, 1, 2], [2, 0, 1]]);
const m8 = new Matrix([[1, 0, 1], [0, 1, 1], [1, 0, 1]]);
const m9 = new Matrix(v6).transpose();
console.log(m2.toString());
console.log(m3.toString());
console.log(m4.transpose().toString());
console.log(m5.toString());
console.log(m6.toString());
console.log(m5.add(m6).toString());
console.log(m5.add(1).toString());
console.log(m5.add(v2).toString());
console.log(m5.mul(v2).toString());
console.log(m5.sub("51").toString());
console.log(m7.dot(m8).toString());
console.log(m7.dot(m9).transpose().toString());
const a1 = new bignumber_js_1.default(51);
console.log(a1.div(new bignumber_js_1.default(10)).toNumber());
