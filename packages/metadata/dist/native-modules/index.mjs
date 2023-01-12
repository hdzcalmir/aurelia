function t(t) {
    return "object" === typeof t && null !== t || "function" === typeof t;
}

function e(t) {
    return null === t || void 0 === t;
}

let n = new WeakMap;

const r = (t, e, n, r, a) => new TypeError(`${t}(${e.map(String).join(",")}) - Expected '${n}' to be of type ${a}, but got: ${Object.prototype.toString.call(r)} (${String(r)})`);

function a(t) {
    switch (typeof t) {
      case "undefined":
      case "string":
      case "symbol":
        return t;

      default:
        return `${t}`;
    }
}

function o(t) {
    switch (typeof t) {
      case "string":
      case "symbol":
        return t;

      default:
        return `${t}`;
    }
}

function c(t) {
    switch (typeof t) {
      case "undefined":
      case "string":
      case "symbol":
        return t;

      default:
        throw new TypeError(`Invalid metadata propertyKey: ${t}.`);
    }
}

function i(t, e, r) {
    let a = n.get(t);
    if (void 0 === a) {
        if (!r) return;
        a = new Map;
        n.set(t, a);
    }
    let o = a.get(e);
    if (void 0 === o) {
        if (!r) return;
        o = new Map;
        a.set(e, o);
    }
    return o;
}

function u(t, e, n) {
    const r = i(e, n, false);
    if (void 0 === r) return false;
    return r.has(t);
}

function f(t, e, n) {
    if (u(t, e, n)) return true;
    const r = T(e);
    if (null !== r) return f(t, r, n);
    return false;
}

function s(t, e, n) {
    const r = i(e, n, false);
    if (void 0 === r) return;
    return r.get(t);
}

function d(t, e, n) {
    if (u(t, e, n)) return s(t, e, n);
    const r = T(e);
    if (null !== r) return d(t, r, n);
    return;
}

function l(t, e, n, r) {
    const a = i(n, r, true);
    a.set(t, e);
}

function w(t, e) {
    const n = [];
    const r = i(t, e, false);
    if (void 0 === r) return n;
    const a = r.keys();
    let o = 0;
    for (const t of a) {
        n[o] = t;
        ++o;
    }
    return n;
}

function g(t, e) {
    const n = w(t, e);
    const r = T(t);
    if (null === r) return n;
    const a = g(r, e);
    const o = n.length;
    if (0 === o) return a;
    const c = a.length;
    if (0 === c) return n;
    const i = new Set;
    const u = [];
    let f = 0;
    let s;
    for (let t = 0; t < o; ++t) {
        s = n[t];
        if (!i.has(s)) {
            i.add(s);
            u[f] = s;
            ++f;
        }
    }
    for (let t = 0; t < c; ++t) {
        s = a[t];
        if (!i.has(s)) {
            i.add(s);
            u[f] = s;
            ++f;
        }
    }
    return u;
}

function M(t, e, n) {
    const r = i(t, n, false);
    if (void 0 === r) return false;
    return r.delete(e);
}

function h(e, n) {
    function a(a, o) {
        if (!t(a)) throw r("@metadata", [ e, n, a, o ], "target", a, "Object or Function");
        l(e, n, a, c(o));
    }
    return a;
}

function y(n, a, c, i) {
    if (void 0 !== c) {
        if (!Array.isArray(n)) throw r("Metadata.decorate", [ n, a, c, i ], "decorators", n, "Array");
        if (!t(a)) throw r("Metadata.decorate", [ n, a, c, i ], "target", a, "Object or Function");
        if (!t(i) && !e(i)) throw r("Metadata.decorate", [ n, a, c, i ], "attributes", i, "Object, Function, null, or undefined");
        if (null === i) i = void 0;
        c = o(c);
        return b(n, a, c, i);
    } else {
        if (!Array.isArray(n)) throw r("Metadata.decorate", [ n, a, c, i ], "decorators", n, "Array");
        if ("function" !== typeof a) throw r("Metadata.decorate", [ n, a, c, i ], "target", a, "Function");
        return O(n, a);
    }
}

function O(t, n) {
    for (let a = t.length - 1; a >= 0; --a) {
        const o = t[a];
        const c = o(n);
        if (!e(c)) {
            if ("function" !== typeof c) throw r("DecorateConstructor", [ t, n ], "decorated", c, "Function, null, or undefined");
            n = c;
        }
    }
    return n;
}

function b(n, a, o, c) {
    for (let i = n.length - 1; i >= 0; --i) {
        const u = n[i];
        const f = u(a, o, c);
        if (!e(f)) {
            if (!t(f)) throw r("DecorateProperty", [ n, a, o, c ], "decorated", f, "Object, Function, null, or undefined");
            c = f;
        }
    }
    return c;
}

function p(e, n, o, c) {
    if (!t(o)) throw r("Metadata.define", [ e, n, o, c ], "target", o, "Object or Function");
    return l(e, n, o, a(c));
}

function j(e, n, o) {
    if (!t(n)) throw r("Metadata.has", [ e, n, o ], "target", n, "Object or Function");
    return f(e, n, a(o));
}

function $(e, n, o) {
    if (!t(n)) throw r("Metadata.hasOwn", [ e, n, o ], "target", n, "Object or Function");
    return u(e, n, a(o));
}

function F(e, n, o) {
    if (!t(n)) throw r("Metadata.get", [ e, n, o ], "target", n, "Object or Function");
    return d(e, n, a(o));
}

function v(e, n, o) {
    if (!t(n)) throw r("Metadata.getOwn", [ e, n, o ], "target", n, "Object or Function");
    return s(e, n, a(o));
}

function K(e, n) {
    if (!t(e)) throw r("Metadata.getKeys", [ e, n ], "target", e, "Object or Function");
    return g(e, a(n));
}

function m(e, n) {
    if (!t(e)) throw r("Metadata.getOwnKeys", [ e, n ], "target", e, "Object or Function");
    return w(e, a(n));
}

function A(e, n, o) {
    if (!t(n)) throw r("Metadata.delete", [ e, n, o ], "target", n, "Object or Function");
    return M(n, e, a(o));
}

const R = {
    define: p,
    has: j,
    hasOwn: $,
    get: F,
    getOwn: v,
    getKeys: K,
    getOwnKeys: m,
    delete: A
};

const E = (t, e, n, r, a) => {
    if (!Reflect.defineProperty(t, e, {
        writable: r,
        enumerable: false,
        configurable: a,
        value: n
    })) throw D(`AUR1000:${e}`);
};

const S = "[[$au]]";

const U = t => S in t;

const k = (t, e, r) => [ [ S, n ], [ "metadata", h ], [ "decorate", y ], [ "defineMetadata", p ], [ "hasMetadata", j ], [ "hasOwnMetadata", $ ], [ "getMetadata", F ], [ "getOwnMetadata", v ], [ "getMetadataKeys", K ], [ "getOwnMetadataKeys", m ], [ "deleteMetadata", A ] ].forEach((([n, a]) => E(t, n, a, e, r)));

const x = (t, e = true, r = false, a = true, o = true) => {
    if (U(t)) {
        if (t[S] === n) return;
        if (t[S] instanceof WeakMap) {
            n = t[S];
            return;
        }
        throw D(`AUR1001`);
    }
    const c = "metadata decorate defineMetadata hasMetadata hasOwnMetadata getMetadata getOwnMetadata getMetadataKeys getOwnMetadataKeys deleteMetadata".split(" ").filter((t => t in Reflect));
    if (c.length > 0) {
        if (e) {
            const t = c.map((function(t) {
                const e = `${Reflect[t].toString().slice(0, 100)}...`;
                return `${t}:\n${e}`;
            })).join("\n\n");
            throw D(`AUR1002:${t}`);
        } else if (r) k(t, a, o);
    } else k(t, a, o);
};

const D = t => new Error(t);

const T = Object.getPrototypeOf;

export { R as Metadata, x as applyMetadataPolyfill, e as isNullOrUndefined, t as isObject, h as metadata };

