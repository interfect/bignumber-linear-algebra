"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = __importDefault(require("./vector"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
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
        else if (values instanceof vector_1.default) {
            this._matrix = [values.copy()];
        }
        // vector values
        else if (values.length > 0 && values[0] instanceof vector_1.default) {
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
            this._matrix = values.map((value) => new vector_1.default(value));
        }
    }
    static empty(width, height, defaultValue = 0) {
        return new Matrix(Array(height).map(() => vector_1.default.empty(width, defaultValue)));
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
            values.push(new vector_1.default(val));
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
        const vals = this._matrix.map((v1) => new vector_1.default(val._matrix.map((v2) => v1.mul(v2).sum())));
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
        else if (value instanceof vector_1.default || value instanceof bignumber_js_1.default) {
            values = this._matrix.map((vec) => fn(vec, value));
        }
        else {
            const val = new bignumber_js_1.default(value);
            values = this._matrix.map((vec) => fn(vec, val));
        }
        return new Matrix(values);
    }
}
exports.default = Matrix;
