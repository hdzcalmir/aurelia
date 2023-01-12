import { Metadata as t, isObject as e, applyMetadataPolyfill as n } from "../metadata/dist/native-modules/index.mjs";

const r = String;

const s = t.getOwn;

const i = t.hasOwn;

const o = t.define;

const l = t => "function" === typeof t;

const c = t => "string" === typeof t;

const u = () => Object.create(null);

const f = t => new Error(t);

const a = {};

const h = t => {
    switch (typeof t) {
      case "number":
        return t >= 0 && (0 | t) === t;

      case "string":
        {
            const e = a[t];
            if (void 0 !== e) return e;
            const n = t.length;
            if (0 === n) return a[t] = false;
            let r = 0;
            let s = 0;
            for (;s < n; ++s) {
                r = I(t, s);
                if (0 === s && 48 === r && n > 1 || r < 48 || r > 57) return a[t] = false;
            }
            return a[t] = true;
        }

      default:
        return false;
    }
};

const d = function() {
    const t = Object.assign(u(), {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true
    });
    const e = e => {
        if ("" === e) return 0;
        if (e !== e.toUpperCase()) return 3;
        if (e !== e.toLowerCase()) return 2;
        if (true === t[e]) return 1;
        return 0;
    };
    return (t, n) => {
        const r = t.length;
        if (0 === r) return t;
        let s = false;
        let i = "";
        let o;
        let l = "";
        let c = 0;
        let u = t.charAt(0);
        let f = e(u);
        let a = 0;
        for (;a < r; ++a) {
            o = c;
            l = u;
            c = f;
            u = t.charAt(a + 1);
            f = e(u);
            if (0 === c) {
                if (i.length > 0) s = true;
            } else {
                if (!s && i.length > 0 && 2 === c) s = 3 === o || 3 === f;
                i += n(l, s);
                s = false;
            }
        }
        return i;
    };
}();

const v = function() {
    const t = u();
    const e = (t, e) => e ? t.toUpperCase() : t.toLowerCase();
    return n => {
        let r = t[n];
        if (void 0 === r) r = t[n] = d(n, e);
        return r;
    };
}();

const g = function() {
    const t = u();
    return e => {
        let n = t[e];
        if (void 0 === n) {
            n = v(e);
            if (n.length > 0) n = n[0].toUpperCase() + n.slice(1);
            t[e] = n;
        }
        return n;
    };
}();

const w = function() {
    const t = u();
    const e = (t, e) => e ? `-${t.toLowerCase()}` : t.toLowerCase();
    return n => {
        let r = t[n];
        if (void 0 === r) r = t[n] = d(n, e);
        return r;
    };
}();

const R = t => {
    const e = t.length;
    const n = Array(e);
    let r = 0;
    for (;r < e; ++r) n[r] = t[r];
    return n;
};

const m = (t, e, n) => ({
    configurable: true,
    enumerable: n.enumerable,
    get() {
        const t = n.value.bind(this);
        Reflect.defineProperty(this, e, {
            value: t,
            writable: true,
            configurable: true,
            enumerable: n.enumerable
        });
        return t;
    }
});

const p = (...t) => {
    const e = [];
    let n = 0;
    const r = t.length;
    let s = 0;
    let i;
    let o = 0;
    for (;o < r; ++o) {
        i = t[o];
        if (void 0 !== i) {
            s = i.length;
            let t = 0;
            for (;t < s; ++t) e[n++] = i[t];
        }
    }
    return e;
};

const y = (...t) => {
    const e = t.length;
    let n;
    let r = 0;
    for (;e > r; ++r) {
        n = t[r];
        if (void 0 !== n) return n;
    }
    throw f(`No default value found`);
};

const b = function() {
    const t = Function.prototype;
    const e = Object.getPrototypeOf;
    const n = new WeakMap;
    let r = t;
    let s = 0;
    let i;
    return function(o) {
        i = n.get(o);
        if (void 0 === i) {
            n.set(o, i = [ r = o ]);
            s = 0;
            while ((r = e(r)) !== t) i[++s] = r;
        }
        return i;
    };
}();

function $(...t) {
    return Object.assign(u(), ...t);
}

const C = function() {
    const t = new WeakMap;
    let e = false;
    let n = "";
    let r = 0;
    return s => {
        e = t.get(s);
        if (void 0 === e) {
            n = s.toString();
            r = n.length;
            e = r >= 29 && r <= 100 && 125 === I(n, r - 1) && I(n, r - 2) <= 32 && 93 === I(n, r - 3) && 101 === I(n, r - 4) && 100 === I(n, r - 5) && 111 === I(n, r - 6) && 99 === I(n, r - 7) && 32 === I(n, r - 8) && 101 === I(n, r - 9) && 118 === I(n, r - 10) && 105 === I(n, r - 11) && 116 === I(n, r - 12) && 97 === I(n, r - 13) && 110 === I(n, r - 14) && 88 === I(n, r - 15);
            t.set(s, e);
        }
        return e;
    };
}();

const A = (t, e) => {
    if (t instanceof Promise) return t.then(e);
    return e(t);
};

const j = (...t) => {
    let e;
    let n;
    let r;
    let s = 0;
    let i = t.length;
    for (;s < i; ++s) {
        e = t[s];
        if ((e = t[s]) instanceof Promise) if (void 0 === n) n = e; else if (void 0 === r) r = [ n, e ]; else r.push(e);
    }
    if (void 0 === r) return n;
    return Promise.all(r);
};

const I = (t, e) => t.charCodeAt(e);

const E = "au:annotation";

const O = (t, e) => {
    if (void 0 === e) return `${E}:${t}`;
    return `${E}:${t}:${e}`;
};

const M = (t, e) => {
    const n = s(E, t);
    if (void 0 === n) o(E, [ e ], t); else n.push(e);
};

const k = Object.freeze({
    name: "au:annotation",
    appendTo: M,
    set(t, e, n) {
        o(O(e), n, t);
    },
    get: (t, e) => s(O(e), t),
    getKeys(t) {
        let e = s(E, t);
        if (void 0 === e) o(E, e = [], t);
        return e;
    },
    isKey: t => t.startsWith(E),
    keyFor: O
});

const F = "au:resource";

const L = Object.freeze({
    name: F,
    appendTo(t, e) {
        const n = s(F, t);
        if (void 0 === n) o(F, [ e ], t); else n.push(e);
    },
    has: t => i(F, t),
    getAll(t) {
        const e = s(F, t);
        if (void 0 === e) return Ht; else return e.map((e => s(e, t)));
    },
    getKeys(t) {
        let e = s(F, t);
        if (void 0 === e) o(F, e = [], t);
        return e;
    },
    isKey: t => t.startsWith(F),
    keyFor(t, e) {
        if (void 0 === e) return `${F}:${t}`;
        return `${F}:${t}:${e}`;
    }
});

const U = {
    annotation: k,
    resource: L
};

const T = Object.prototype.hasOwnProperty;

function P(t, e, n, r) {
    let i = s(O(t), n);
    if (void 0 === i) {
        i = e[t];
        if (void 0 === i) {
            i = n[t];
            if (void 0 === i || !T.call(n, t)) return r();
            return i;
        }
        return i;
    }
    return i;
}

function D(t, e, n) {
    let r = s(O(t), e);
    if (void 0 === r) {
        r = e[t];
        if (void 0 === r || !T.call(e, t)) return n();
        return r;
    }
    return r;
}

function S(t, e, n) {
    const r = e[t];
    if (void 0 === r) return n();
    return r;
}

const N = new Set("Array ArrayBuffer Boolean DataView Date Error EvalError Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Number Object Promise RangeError ReferenceError RegExp Set SharedArrayBuffer String SyntaxError TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array URIError WeakMap WeakSet".split(" "));

let W = 0;

class Container {
    constructor(t, e) {
        this.parent = t;
        this.config = e;
        this.id = ++W;
        this.t = 0;
        this.i = new Map;
        if (null === t) {
            this.root = this;
            this.u = new Map;
            this.h = new Map;
            this.res = u();
        } else {
            this.root = t.root;
            this.u = new Map;
            this.h = t.h;
            if (e.inheritParentResources) this.res = Object.assign(u(), t.res, this.root.res); else this.res = u();
        }
        this.u.set($t, z);
    }
    get depth() {
        return null === this.parent ? 0 : this.parent.depth + 1;
    }
    register(...t) {
        if (100 === ++this.t) throw V(t);
        let n;
        let r;
        let s;
        let i;
        let o;
        let l = 0;
        let c = t.length;
        for (;l < c; ++l) {
            n = t[l];
            if (!e(n)) continue;
            if (Q(n)) n.register(this); else if (U.resource.has(n)) {
                const t = U.resource.getAll(n);
                if (1 === t.length) t[0].register(this); else {
                    i = 0;
                    o = t.length;
                    while (o > i) {
                        t[i].register(this);
                        ++i;
                    }
                }
            } else if (K(n)) Gt.singleton(n, n).register(this); else {
                r = Object.keys(n);
                i = 0;
                o = r.length;
                for (;i < o; ++i) {
                    s = n[r[i]];
                    if (!e(s)) continue;
                    if (Q(s)) s.register(this); else this.register(s);
                }
            }
        }
        --this.t;
        return this;
    }
    registerResolver(t, e, n = false) {
        B(t);
        const r = this.u;
        const s = r.get(t);
        if (null == s) {
            r.set(t, e);
            if (H(t)) {
                if (void 0 !== this.res[t]) throw q(t);
                this.res[t] = e;
            }
        } else if (s instanceof Resolver && 4 === s.R) s._state.push(e); else r.set(t, new Resolver(t, 4, [ s, e ]));
        if (n) this.i.set(t, e);
        return e;
    }
    registerTransformer(t, e) {
        const n = this.getResolver(t);
        if (null == n) return false;
        if (n.getFactory) {
            const t = n.getFactory(this);
            if (null == t) return false;
            t.registerTransformer(e);
            return true;
        }
        return false;
    }
    getResolver(t, e = true) {
        B(t);
        if (void 0 !== t.resolve) return t;
        let n = this;
        let r;
        let s;
        while (null != n) {
            r = n.u.get(t);
            if (null == r) {
                if (null == n.parent) {
                    s = G(t) ? this : n;
                    return e ? this.$(t, s) : null;
                }
                n = n.parent;
            } else return r;
        }
        return null;
    }
    has(t, e = false) {
        return this.u.has(t) ? true : e && null != this.parent ? this.parent.has(t, true) : false;
    }
    get(t) {
        B(t);
        if (t.$isResolver) return t.resolve(this, this);
        let e = this;
        let n;
        let r;
        while (null != e) {
            n = e.u.get(t);
            if (null == n) {
                if (null == e.parent) {
                    r = G(t) ? this : e;
                    n = this.$(t, r);
                    return n.resolve(e, this);
                }
                e = e.parent;
            } else return n.resolve(e, this);
        }
        throw J(t);
    }
    getAll(t, e = false) {
        B(t);
        const n = this;
        let r = n;
        let s;
        if (e) {
            let e = Ht;
            while (null != r) {
                s = r.u.get(t);
                if (null != s) e = e.concat(_(s, r, n));
                r = r.parent;
            }
            return e;
        } else while (null != r) {
            s = r.u.get(t);
            if (null == s) {
                r = r.parent;
                if (null == r) return Ht;
            } else return _(s, r, n);
        }
        return Ht;
    }
    invoke(t, e) {
        if (C(t)) throw et(t);
        if (void 0 === e) return new t(...mt(t).map(Qt, this)); else return new t(...mt(t).map(Qt, this), ...e);
    }
    getFactory(t) {
        let e = this.h.get(t);
        if (void 0 === e) {
            if (C(t)) throw et(t);
            this.h.set(t, e = new Factory(t, mt(t)));
        }
        return e;
    }
    registerFactory(t, e) {
        this.h.set(t, e);
    }
    createChild(t) {
        if (void 0 === t && this.config.inheritParentResources) {
            if (this.config === ContainerConfiguration.DEFAULT) return new Container(this, this.config);
            return new Container(this, ContainerConfiguration.from({
                ...this.config,
                inheritParentResources: false
            }));
        }
        return new Container(this, ContainerConfiguration.from(t ?? this.config));
    }
    disposeResolvers() {
        const t = this.u;
        const e = this.i;
        let n;
        let r;
        for ([r, n] of e.entries()) {
            n.dispose();
            t.delete(r);
        }
        e.clear();
    }
    find(t, e) {
        const n = t.keyFrom(e);
        let r = this.res[n];
        if (void 0 === r) {
            r = this.root.res[n];
            if (void 0 === r) return null;
        }
        if (null === r) return null;
        if (l(r.getFactory)) {
            const e = r.getFactory(this);
            if (null === e || void 0 === e) return null;
            const n = s(t.name, e.Type);
            if (void 0 === n) return null;
            return n;
        }
        return null;
    }
    create(t, e) {
        const n = t.keyFrom(e);
        let r = this.res[n];
        if (void 0 === r) {
            r = this.root.res[n];
            if (void 0 === r) return null;
            return r.resolve(this.root, this) ?? null;
        }
        return r.resolve(this, this) ?? null;
    }
    dispose() {
        if (this.i.size > 0) this.disposeResolvers();
        this.u.clear();
    }
    $(t, e) {
        if (!l(t)) throw X(t);
        if (N.has(t.name)) throw Y(t);
        if (Q(t)) {
            const n = t.register(e, t);
            if (!(n instanceof Object) || null == n.resolve) {
                const n = e.u.get(t);
                if (null != n) return n;
                throw Z();
            }
            return n;
        } else if (U.resource.has(t)) {
            const n = U.resource.getAll(t);
            if (1 === n.length) n[0].register(e); else {
                const t = n.length;
                for (let r = 0; r < t; ++r) n[r].register(e);
            }
            const r = e.u.get(t);
            if (null != r) return r;
            throw Z();
        } else if (t.$isInterface) throw tt(t.friendlyName); else {
            const n = this.config.defaultResolver(t, e);
            e.u.set(t, n);
            return n;
        }
    }
}

function B(t) {
    if (null === t || void 0 === t) throw f(`AUR0014`);
}

const _ = (t, e, n) => {
    if (t instanceof Resolver && 4 === t.R) {
        const r = t._state;
        let s = r.length;
        const i = new Array(s);
        while (s--) i[s] = r[s].resolve(e, n);
        return i;
    }
    return [ t.resolve(e, n) ];
};

const z = {
    $isResolver: true,
    resolve(t, e) {
        return e;
    }
};

const Q = t => l(t.register);

const x = t => Q(t) && "boolean" === typeof t.registerInRequestor;

const G = t => x(t) && t.registerInRequestor;

const K = t => void 0 !== t.prototype;

const H = t => c(t) && t.indexOf(":") > 0;

const V = t => f(`AUR0006:${t.map(r)}`);

const q = t => f(`AUR0007:${r(t)}`);

const J = t => f(`AUR0008:${r(t)}`);

const X = t => f(`AUR0009:${r(t)}`);

const Y = t => f(`AUR0010:${t.name}`);

const Z = () => f(`AUR0011`);

const tt = t => f(`AUR0012:${t}`);

const et = t => f(`AUR0015:${t.name}`);

const nt = (t, e) => new Resolver(t, 0, e);

const rt = (t, e) => new Resolver(t, 1, e);

const st = (t, e) => new Resolver(t, 2, e);

const it = (t, e) => new Resolver(t, 3, e);

const ot = (t, e) => new Resolver(t, 3, ft(e));

const lt = (t, e) => new Resolver(e, 5, t);

const ct = (t, ...e) => new ParameterizedRegistry(t, e);

const ut = new WeakMap;

const ft = t => (e, n, r) => {
    let s = ut.get(e);
    if (void 0 === s) ut.set(e, s = new WeakMap);
    if (s.has(r)) return s.get(r);
    const i = t(e, n, r);
    s.set(r, i);
    return i;
};

n(Reflect, false, false);

class ResolverBuilder {
    constructor(t, e) {
        this.c = t;
        this.k = e;
    }
    instance(t) {
        return this.C(0, t);
    }
    singleton(t) {
        return this.C(1, t);
    }
    transient(t) {
        return this.C(2, t);
    }
    callback(t) {
        return this.C(3, t);
    }
    cachedCallback(t) {
        return this.C(3, ft(t));
    }
    aliasTo(t) {
        return this.C(5, t);
    }
    C(t, e) {
        const {c: n, k: r} = this;
        this.c = this.k = void 0;
        return n.registerResolver(r, new Resolver(r, t, e));
    }
}

const at = t => {
    const e = t.slice();
    const n = Object.keys(t);
    const r = n.length;
    let s;
    for (let i = 0; i < r; ++i) {
        s = n[i];
        if (!h(s)) e[s] = t[s];
    }
    return e;
};

const ht = {
    none(t) {
        throw dt(t);
    },
    singleton: t => new Resolver(t, 1, t),
    transient: t => new Resolver(t, 2, t)
};

const dt = t => f(`AUR0002:${r(t)}`);

class ContainerConfiguration {
    constructor(t, e) {
        this.inheritParentResources = t;
        this.defaultResolver = e;
    }
    static from(t) {
        if (void 0 === t || t === ContainerConfiguration.DEFAULT) return ContainerConfiguration.DEFAULT;
        return new ContainerConfiguration(t.inheritParentResources ?? false, t.defaultResolver ?? ht.singleton);
    }
}

ContainerConfiguration.DEFAULT = ContainerConfiguration.from({});

const vt = t => new Container(null, ContainerConfiguration.from(t));

const gt = t => {
    const e = O("di:paramtypes");
    return s(e, t);
};

const wt = t => s("design:paramtypes", t);

const Rt = t => {
    const e = O("di:paramtypes");
    let n = s(e, t);
    if (void 0 === n) {
        o(e, n = [], t);
        M(t, e);
    }
    return n;
};

const mt = t => {
    const e = O("di:dependencies");
    let n = s(e, t);
    if (void 0 === n) {
        const r = t.inject;
        if (void 0 === r) {
            const e = bt.getDesignParamtypes(t);
            const r = gt(t);
            if (void 0 === e) if (void 0 === r) {
                const e = Object.getPrototypeOf(t);
                if (l(e) && e !== Function.prototype) n = at(mt(e)); else n = [];
            } else n = at(r); else if (void 0 === r) n = at(e); else {
                n = at(e);
                let t = r.length;
                let s;
                let i = 0;
                for (;i < t; ++i) {
                    s = r[i];
                    if (void 0 !== s) n[i] = s;
                }
                const o = Object.keys(r);
                let l;
                i = 0;
                t = o.length;
                for (i = 0; i < t; ++i) {
                    l = o[i];
                    if (!h(l)) n[l] = r[l];
                }
            }
        } else n = at(r);
        o(e, n, t);
        M(t, e);
    }
    return n;
};

const pt = (t, e) => {
    const n = l(t) ? t : e;
    const r = c(t) ? t : void 0;
    const s = function(t, e, n) {
        if (null == t || void 0 !== new.target) throw yt(s.friendlyName);
        const r = Rt(t);
        r[n] = s;
    };
    s.$isInterface = true;
    s.friendlyName = null == r ? "(anonymous)" : r;
    if (null != n) s.register = (t, e) => n(new ResolverBuilder(t, e ?? s));
    s.toString = () => `InterfaceSymbol<${s.friendlyName}>`;
    return s;
};

const yt = t => f(`AUR0001:${t}`);

const bt = {
    createContainer: vt,
    getDesignParamtypes: wt,
    getAnnotationParamtypes: gt,
    getOrCreateAnnotationParamTypes: Rt,
    getDependencies: mt,
    createInterface: pt,
    inject(...t) {
        return (e, n, r) => {
            if ("number" === typeof r) {
                const n = Rt(e);
                const s = t[0];
                if (void 0 !== s) n[r] = s;
            } else if (n) {
                const r = Rt(e.constructor);
                const s = t[0];
                if (void 0 !== s) r[n] = s;
            } else if (r) {
                const e = r.value;
                const n = Rt(e);
                let s;
                let i = 0;
                for (;i < t.length; ++i) {
                    s = t[i];
                    if (void 0 !== s) n[i] = s;
                }
            } else {
                const n = Rt(e);
                let r;
                let s = 0;
                for (;s < t.length; ++s) {
                    r = t[s];
                    if (void 0 !== r) n[s] = r;
                }
            }
        };
    },
    transient(t) {
        t.register = function(e) {
            const n = Gt.transient(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = Ot) {
        t.register = function(e) {
            const n = Gt.singleton(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

const $t = pt("IContainer");

const Ct = $t;

function At(t) {
    return function(e) {
        const n = function(t, e, r) {
            jt(n)(t, e, r);
        };
        n.$isResolver = true;
        n.resolve = function(n, r) {
            return t(e, n, r);
        };
        return n;
    };
}

const jt = bt.inject;

function It(t) {
    return bt.transient(t);
}

function Et(t) {
    return null == t ? It : It(t);
}

const Ot = {
    scoped: false
};

const Mt = bt.singleton;

function kt(t) {
    if (l(t)) return Mt(t);
    return function(e) {
        return Mt(e, t);
    };
}

const Ft = t => (e, n) => {
    n = !!n;
    const r = function(t, e, n) {
        jt(r)(t, e, n);
    };
    r.$isResolver = true;
    r.resolve = function(r, s) {
        return t(e, r, s, n);
    };
    return r;
};

const Lt = Ft(((t, e, n, r) => n.getAll(t, r)));

const Ut = At(((t, e, n) => () => n.get(t)));

const Tt = At(((t, e, n) => {
    if (n.has(t, true)) return n.get(t); else return;
}));

const Pt = (t, e, n) => {
    jt(Pt)(t, e, n);
};

Pt.$isResolver = true;

Pt.resolve = () => {};

const Dt = At(((t, e, n) => (...r) => e.getFactory(t).construct(n, r)));

const St = At(((t, e, n) => {
    const s = Wt(t, e, n);
    const i = new InstanceProvider(r(t), s);
    n.registerResolver(t, i, true);
    return s;
}));

const Nt = At(((t, e, n) => Wt(t, e, n)));

const Wt = (t, e, n) => e.getFactory(t).construct(n);

class Resolver {
    constructor(t, e, n) {
        this.k = t;
        this.R = e;
        this._state = n;
        this.resolving = false;
    }
    get $isResolver() {
        return true;
    }
    register(t, e) {
        return t.registerResolver(e || this.k, this);
    }
    resolve(t, e) {
        switch (this.R) {
          case 0:
            return this._state;

          case 1:
            if (this.resolving) throw Bt(this._state.name);
            this.resolving = true;
            this._state = t.getFactory(this._state).construct(e);
            this.R = 0;
            this.resolving = false;
            return this._state;

          case 2:
            {
                const n = t.getFactory(this._state);
                if (null === n) throw _t(this.k);
                return n.construct(e);
            }

          case 3:
            return this._state(t, e, this);

          case 4:
            return this._state[0].resolve(t, e);

          case 5:
            return e.get(this._state);

          default:
            throw zt(this.R);
        }
    }
    getFactory(t) {
        switch (this.R) {
          case 1:
          case 2:
            return t.getFactory(this._state);

          case 5:
            return t.getResolver(this._state)?.getFactory?.(t) ?? null;

          default:
            return null;
        }
    }
}

const Bt = t => f(`AUR0003:${t}`);

const _t = t => f(`AUR0004:${r(t)}`);

const zt = t => f(`AUR0005:${t}`);

function Qt(t) {
    return this.get(t);
}

function xt(t, e) {
    return e(t);
}

class Factory {
    constructor(t, e) {
        this.Type = t;
        this.dependencies = e;
        this.transformers = null;
    }
    construct(t, e) {
        let n;
        if (void 0 === e) n = new this.Type(...this.dependencies.map(Qt, t)); else n = new this.Type(...this.dependencies.map(Qt, t), ...e);
        if (null == this.transformers) return n;
        return this.transformers.reduce(xt, n);
    }
    registerTransformer(t) {
        (this.transformers ?? (this.transformers = [])).push(t);
    }
}

class ParameterizedRegistry {
    constructor(t, e) {
        this.key = t;
        this.params = e;
    }
    register(t) {
        if (t.has(this.key, true)) {
            const e = t.get(this.key);
            e.register(t, ...this.params);
        } else t.register(...this.params.filter((t => "object" === typeof t)));
    }
}

const Gt = {
    instance: nt,
    singleton: rt,
    transient: st,
    callback: it,
    cachedCallback: ot,
    aliasTo: lt,
    defer: ct
};

class InstanceProvider {
    constructor(t, e) {
        this.A = null;
        this.j = t;
        if (void 0 !== e) this.A = e;
    }
    get friendlyName() {
        return this.j;
    }
    prepare(t) {
        this.A = t;
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        if (null == this.A) throw Kt(this.j);
        return this.A;
    }
    dispose() {
        this.A = null;
    }
}

const Kt = t => f(`AUR0013:${t}`);

const Ht = Object.freeze([]);

const Vt = Object.freeze({});

function qt() {}

const Jt = pt("IPlatform");

function Xt(t, e, n, r) {
    var s = arguments.length, i = s < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) i = Reflect.decorate(t, e, n, r); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) i = (s < 3 ? o(i) : s > 3 ? o(e, n, i) : o(e, n)) || i;
    return s > 3 && i && Object.defineProperty(e, n, i), i;
}

function Yt(t, e) {
    return function(n, r) {
        e(n, r, t);
    };
}

var Zt;

(function(t) {
    t[t["trace"] = 0] = "trace";
    t[t["debug"] = 1] = "debug";
    t[t["info"] = 2] = "info";
    t[t["warn"] = 3] = "warn";
    t[t["error"] = 4] = "error";
    t[t["fatal"] = 5] = "fatal";
    t[t["none"] = 6] = "none";
})(Zt || (Zt = {}));

var te;

(function(t) {
    t[t["noColors"] = 0] = "noColors";
    t[t["colors"] = 1] = "colors";
})(te || (te = {}));

const ee = pt("ILogConfig", (t => t.instance(new LogConfig(0, 3))));

const ne = pt("ISink");

const re = pt("ILogEventFactory", (t => t.singleton(he)));

const se = pt("ILogger", (t => t.singleton(ve)));

const ie = pt("ILogScope");

const oe = Object.freeze({
    key: O("logger-sink-handles"),
    define(t, e) {
        o(this.key, e.handles, t.prototype);
        return t;
    },
    getHandles(e) {
        return t.get(this.key, e);
    }
});

const le = t => e => oe.define(e, t);

const ce = $({
    red(t) {
        return `[31m${t}[39m`;
    },
    green(t) {
        return `[32m${t}[39m`;
    },
    yellow(t) {
        return `[33m${t}[39m`;
    },
    blue(t) {
        return `[34m${t}[39m`;
    },
    magenta(t) {
        return `[35m${t}[39m`;
    },
    cyan(t) {
        return `[36m${t}[39m`;
    },
    white(t) {
        return `[37m${t}[39m`;
    },
    grey(t) {
        return `[90m${t}[39m`;
    }
});

class LogConfig {
    constructor(t, e) {
        this.colorOptions = t;
        this.level = e;
    }
}

const ue = function() {
    const t = [ $({
        TRC: "TRC",
        DBG: "DBG",
        INF: "INF",
        WRN: "WRN",
        ERR: "ERR",
        FTL: "FTL",
        QQQ: "???"
    }), $({
        TRC: ce.grey("TRC"),
        DBG: ce.grey("DBG"),
        INF: ce.white("INF"),
        WRN: ce.yellow("WRN"),
        ERR: ce.red("ERR"),
        FTL: ce.red("FTL"),
        QQQ: ce.grey("???")
    }) ];
    return (e, n) => {
        if (e <= 0) return t[n].TRC;
        if (e <= 1) return t[n].DBG;
        if (e <= 2) return t[n].INF;
        if (e <= 3) return t[n].WRN;
        if (e <= 4) return t[n].ERR;
        if (e <= 5) return t[n].FTL;
        return t[n].QQQ;
    };
}();

const fe = (t, e) => {
    if (0 === e) return t.join(".");
    return t.map(ce.cyan).join(".");
};

const ae = (t, e) => {
    if (0 === e) return new Date(t).toISOString();
    return ce.grey(new Date(t).toISOString());
};

class DefaultLogEvent {
    constructor(t, e, n, r, s, i) {
        this.severity = t;
        this.message = e;
        this.optionalParams = n;
        this.scope = r;
        this.colorOptions = s;
        this.timestamp = i;
    }
    toString() {
        const {severity: t, message: e, scope: n, colorOptions: r, timestamp: s} = this;
        if (0 === n.length) return `${ae(s, r)} [${ue(t, r)}] ${e}`;
        return `${ae(s, r)} [${ue(t, r)} ${fe(n, r)}] ${e}`;
    }
}

let he = class DefaultLogEventFactory {
    constructor(t) {
        this.config = t;
    }
    createLogEvent(t, e, n, r) {
        return new DefaultLogEvent(e, n, r, t.scope, this.config.colorOptions, Date.now());
    }
};

he = Xt([ Yt(0, ee) ], he);

let de = class ConsoleSink {
    constructor(t) {
        const e = t.console;
        this.handleEvent = function t(n) {
            const r = n.optionalParams;
            if (void 0 === r || 0 === r.length) {
                const t = n.toString();
                switch (n.severity) {
                  case 0:
                  case 1:
                    return e.debug(t);

                  case 2:
                    return e.info(t);

                  case 3:
                    return e.warn(t);

                  case 4:
                  case 5:
                    return e.error(t);
                }
            } else {
                let t = n.toString();
                let s = 0;
                while (t.includes("%s")) t = t.replace("%s", String(r[s++]));
                switch (n.severity) {
                  case 0:
                  case 1:
                    return e.debug(t, ...r.slice(s));

                  case 2:
                    return e.info(t, ...r.slice(s));

                  case 3:
                    return e.warn(t, ...r.slice(s));

                  case 4:
                  case 5:
                    return e.error(t, ...r.slice(s));
                }
            }
        };
    }
    static register(t) {
        rt(ne, ConsoleSink).register(t);
    }
};

de = Xt([ Yt(0, Jt) ], de);

let ve = class DefaultLogger {
    constructor(t, e, n, r = [], s = null) {
        this.scope = r;
        this.I = u();
        let i;
        let o;
        let l;
        let c;
        let f;
        let a;
        this.config = t;
        this.f = e;
        this.sinks = n;
        if (null === s) {
            this.root = this;
            this.parent = this;
            i = this.O = [];
            o = this.M = [];
            l = this.F = [];
            c = this.L = [];
            f = this.U = [];
            a = this.T = [];
            for (const t of n) {
                const e = oe.getHandles(t);
                if (e?.includes(0) ?? true) i.push(t);
                if (e?.includes(1) ?? true) o.push(t);
                if (e?.includes(2) ?? true) l.push(t);
                if (e?.includes(3) ?? true) c.push(t);
                if (e?.includes(4) ?? true) f.push(t);
                if (e?.includes(5) ?? true) a.push(t);
            }
        } else {
            this.root = s.root;
            this.parent = s;
            i = this.O = s.O;
            o = this.M = s.M;
            l = this.F = s.F;
            c = this.L = s.L;
            f = this.U = s.U;
            a = this.T = s.T;
        }
    }
    trace(t, ...e) {
        if (this.config.level <= 0) this.P(this.O, 0, t, e);
    }
    debug(t, ...e) {
        if (this.config.level <= 1) this.P(this.M, 1, t, e);
    }
    info(t, ...e) {
        if (this.config.level <= 2) this.P(this.F, 2, t, e);
    }
    warn(t, ...e) {
        if (this.config.level <= 3) this.P(this.L, 3, t, e);
    }
    error(t, ...e) {
        if (this.config.level <= 4) this.P(this.U, 4, t, e);
    }
    fatal(t, ...e) {
        if (this.config.level <= 5) this.P(this.T, 5, t, e);
    }
    scopeTo(t) {
        const e = this.I;
        let n = e[t];
        if (void 0 === n) n = e[t] = new DefaultLogger(this.config, this.f, void 0, this.scope.concat(t), this);
        return n;
    }
    P(t, e, n, r) {
        const s = l(n) ? n() : n;
        const i = this.f.createLogEvent(this, e, s, r);
        for (let e = 0, n = t.length; e < n; ++e) t[e].handleEvent(i);
    }
};

Xt([ m ], ve.prototype, "trace", null);

Xt([ m ], ve.prototype, "debug", null);

Xt([ m ], ve.prototype, "info", null);

Xt([ m ], ve.prototype, "warn", null);

Xt([ m ], ve.prototype, "error", null);

Xt([ m ], ve.prototype, "fatal", null);

ve = Xt([ Yt(0, ee), Yt(1, re), Yt(2, Lt(ne)), Yt(3, Tt(ie)), Yt(4, Pt) ], ve);

const ge = $({
    create({level: t = 3, colorOptions: e = 0, sinks: n = []} = {}) {
        return $({
            register(r) {
                r.register(nt(ee, new LogConfig(e, t)));
                for (const t of n) if (l(t)) r.register(rt(ne, t)); else r.register(t);
                return r;
            }
        });
    }
});

const we = pt((t => t.singleton(ModuleLoader)));

const Re = t => t;

class ModuleTransformer {
    constructor(t) {
        this.N = new Map;
        this.W = new Map;
        this.B = t;
    }
    transform(t) {
        if (t instanceof Promise) return this._(t); else if ("object" === typeof t && null !== t) return this.G(t); else throw f(`Invalid input: ${String(t)}. Expected Promise or Object.`);
    }
    _(t) {
        if (this.N.has(t)) return this.N.get(t);
        const e = t.then((t => this.G(t)));
        this.N.set(t, e);
        void e.then((e => {
            this.N.set(t, e);
        }));
        return e;
    }
    G(t) {
        if (this.W.has(t)) return this.W.get(t);
        const e = this.B(this.K(t));
        this.W.set(t, e);
        if (e instanceof Promise) void e.then((e => {
            this.W.set(t, e);
        }));
        return e;
    }
    K(t) {
        if (null == t) throw new Error(`Invalid input: ${String(t)}. Expected Object.`);
        if ("object" !== typeof t) return new AnalyzedModule(t, []);
        let e;
        let n;
        let r;
        let s;
        const i = [];
        for (const o in t) {
            switch (typeof (e = t[o])) {
              case "object":
                if (null === e) continue;
                n = l(e.register);
                r = false;
                s = Ht;
                break;

              case "function":
                n = l(e.register);
                r = void 0 !== e.prototype;
                s = U.resource.getAll(e);
                break;

              default:
                continue;
            }
            i.push(new ModuleItem(o, e, n, r, s));
        }
        return new AnalyzedModule(t, i);
    }
}

class ModuleLoader {
    constructor() {
        this.transformers = new Map;
    }
    load(t, e = Re) {
        const n = this.transformers;
        let r = n.get(e);
        if (void 0 === r) n.set(e, r = new ModuleTransformer(e));
        return r.transform(t);
    }
    dispose() {
        this.transformers.clear();
    }
}

class AnalyzedModule {
    constructor(t, e) {
        this.raw = t;
        this.items = e;
    }
}

class ModuleItem {
    constructor(t, e, n, r, s) {
        this.key = t;
        this.value = e;
        this.isRegistry = n;
        this.isConstructable = r;
        this.definitions = s;
    }
}

class Handler {
    constructor(t, e) {
        this.type = t;
        this.cb = e;
    }
    handle(t) {
        if (t instanceof this.type) this.cb.call(null, t);
    }
}

const me = pt("IEventAggregator", (t => t.singleton(EventAggregator)));

class EventAggregator {
    constructor() {
        this.eventLookup = {};
        this.messageHandlers = [];
    }
    publish(t, e) {
        if (!t) throw f(`Invalid channel name or instance: ${t}.`);
        if (c(t)) {
            let n = this.eventLookup[t];
            if (void 0 !== n) {
                n = n.slice();
                let r = n.length;
                while (r-- > 0) n[r](e, t);
            }
        } else {
            const e = this.messageHandlers.slice();
            let n = e.length;
            while (n-- > 0) e[n].handle(t);
        }
    }
    subscribe(t, e) {
        if (!t) throw f(`Invalid channel name or type: ${t}.`);
        let n;
        let r;
        if (c(t)) {
            if (void 0 === this.eventLookup[t]) this.eventLookup[t] = [];
            n = e;
            r = this.eventLookup[t];
        } else {
            n = new Handler(t, e);
            r = this.messageHandlers;
        }
        r.push(n);
        return {
            dispose() {
                const t = r.indexOf(n);
                if (-1 !== t) r.splice(t, 1);
            }
        };
    }
    subscribeOnce(t, e) {
        const n = this.subscribe(t, ((t, r) => {
            n.dispose();
            e(t, r);
        }));
        return n;
    }
}

export { AnalyzedModule, te as ColorOptions, de as ConsoleSink, ContainerConfiguration, bt as DI, DefaultLogEvent, he as DefaultLogEventFactory, ve as DefaultLogger, ht as DefaultResolver, EventAggregator, $t as IContainer, me as IEventAggregator, ee as ILogConfig, re as ILogEventFactory, se as ILogger, we as IModuleLoader, Jt as IPlatform, Ct as IServiceLocator, ne as ISink, InstanceProvider, LogConfig, Zt as LogLevel, ge as LoggerConfiguration, ModuleItem, U as Protocol, Gt as Registration, Lt as all, m as bound, v as camelCase, Ht as emptyArray, Vt as emptyObject, Dt as factory, y as firstDefined, ce as format, P as fromAnnotationOrDefinitionOrTypeOrDefault, D as fromAnnotationOrTypeOrDefault, S as fromDefinitionOrDefault, b as getPrototypeChain, Pt as ignore, jt as inject, h as isArrayIndex, C as isNativeFunction, w as kebabCase, Ut as lazy, p as mergeArrays, St as newInstanceForScope, Nt as newInstanceOf, qt as noop, A as onResolve, Tt as optional, g as pascalCase, j as resolveAll, kt as singleton, le as sink, R as toArray, Et as transient };

