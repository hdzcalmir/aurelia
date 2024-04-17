"use strict";

function initializeTC39Metadata() {
    Symbol.metadata ??= Symbol.for("Symbol.metadata");
}

function isObject(e) {
    return typeof e === "object" && e !== null || typeof e === "function";
}

function isNullOrUndefined(e) {
    return e === null || e === void 0;
}

const e = {
    get(e, t) {
        return t[Symbol.metadata]?.[e];
    },
    define(e, t, ...n) {
        const r = t[Symbol.metadata] ??= Object.create(null);
        const l = n.length;
        switch (l) {
          case 0:
            throw new Error("At least one key must be provided");

          case 1:
            r[n[0]] = e;
            return;

          case 2:
            r[n[0]] = r[n[1]] = e;
            return;

          default:
            {
                for (let t = 0; t < l; ++t) {
                    r[n[t]] = e;
                }
                return;
            }
        }
    },
    has(e, t) {
        const n = t[Symbol.metadata];
        return n == null ? false : e in n;
    },
    delete(e, t) {
        const n = t[Symbol.metadata];
        if (n == null) return;
        Reflect.deleteProperty(n, e);
        return;
    }
};

exports.Metadata = e;

exports.initializeTC39Metadata = initializeTC39Metadata;

exports.isNullOrUndefined = isNullOrUndefined;

exports.isObject = isObject;
//# sourceMappingURL=index.cjs.map
