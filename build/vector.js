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
exports.default = Vec;
