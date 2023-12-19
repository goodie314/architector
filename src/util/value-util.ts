export function compareValues(val1: any, val2: any): boolean {
    if (typeof val1 !== typeof val2) {
        return false;
    }

    switch (typeof val1) {
        case 'object':
            if (Array.isArray(val1)) {
                return compareArrays(val1, val2);
            } else {
                return compareObjects(val1, val2);
            }
        default:
            return val1 === val2;
    }
}

export function clone<T = any>(value: T): T {
    const valueType = typeof value;
    if (value instanceof Array) {
        // @ts-ignore
        return value.map(clone);
    } else if (valueType === 'object') {
        return Object.assign({}, value);
    } else {
        return value;
    }
}

function compareObjects(obj1: any, obj2: any): boolean {
    return Object.entries(obj1).every(([key, value]) => {
        if (obj2[key] == null) {
            return false;
        } else {
            return compareValues(value, obj2[key]);
        }
    });
}

function compareArrays(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    return arr1.every((val, index) => compareValues(val, arr2[index]));
}
