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
        const l = t[Symbol.metadata] ??= Object.create(null);
        const r = n.length;
        switch (r) {
          case 0:
            throw new Error("At least one key must be provided");

          case 1:
            l[n[0]] = e;
            return;

          case 2:
            l[n[0]] = l[n[1]] = e;
            return;

          default:
            {
                for (let t = 0; t < r; ++t) {
                    l[n[t]] = e;
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

export { e as Metadata, initializeTC39Metadata, isNullOrUndefined, isObject };

