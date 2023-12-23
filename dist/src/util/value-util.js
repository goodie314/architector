"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.compareValues = void 0;
function compareValues(val1, val2) {
    if (typeof val1 !== typeof val2) {
        return false;
    }
    switch (typeof val1) {
        case 'object':
            if (Array.isArray(val1)) {
                return compareArrays(val1, val2);
            }
            else {
                return compareObjects(val1, val2);
            }
        default:
            return val1 === val2;
    }
}
exports.compareValues = compareValues;
function clone(value) {
    const valueType = typeof value;
    if (value instanceof Array) {
        // @ts-ignore
        return value.map(clone);
    }
    else if (valueType === 'object') {
        return Object.assign({}, value);
    }
    else {
        return value;
    }
}
exports.clone = clone;
function compareObjects(obj1, obj2) {
    return Object.entries(obj1).every(([key, value]) => {
        if (obj2[key] == null) {
            return false;
        }
        else {
            return compareValues(value, obj2[key]);
        }
    });
}
function compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((val, index) => compareValues(val, arr2[index]));
}
