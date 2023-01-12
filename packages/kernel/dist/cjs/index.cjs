"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/metadata");

const e = String;

const r = t.Metadata.getOwn;

const n = t.Metadata.hasOwn;

const s = t.Metadata.define;

const i = t => "function" === typeof t;

const o = t => "string" === typeof t;

const c = () => Object.create(null);

const l = t => new Error(t);

const u = {};

const f = t => {
    switch (typeof t) {
      case "number":
        return t >= 0 && (0 | t) === t;

      case "string":
        {
            const e = u[t];
            if (void 0 !== e) return e;
            const r = t.length;
            if (0 === r) return u[t] = false;
            let n = 0;
            let s = 0;
            for (;s < r; ++s) {
                n = C(t, s);
                if (0 === s && 48 === n && r > 1 || n < 48 || n > 57) return u[t] = false;
            }
            return u[t] = true;
        }

      default:
        return false;
    }
};

const a = function() {
    const t = Object.assign(c(), {
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
    return (t, r) => {
        const n = t.length;
        if (0 === n) return t;
        let s = false;
        let i = "";
        let o;
        let c = "";
        let l = 0;
        let u = t.charAt(0);
        let f = e(u);
        let a = 0;
        for (;a < n; ++a) {
            o = l;
            c = u;
            l = f;
            u = t.charAt(a + 1);
            f = e(u);
            if (0 === l) {
                if (i.length > 0) s = true;
            } else {
                if (!s && i.length > 0 && 2 === l) s = 3 === o || 3 === f;
                i += r(c, s);
                s = false;
            }
        }
        return i;
    };
}();

const h = function() {
    const t = c();
    const e = (t, e) => e ? t.toUpperCase() : t.toLowerCase();
    return r => {
        let n = t[r];
        if (void 0 === n) n = t[r] = a(r, e);
        return n;
    };
}();

const d = function() {
    const t = c();
    return e => {
        let r = t[e];
        if (void 0 === r) {
            r = h(e);
            if (r.length > 0) r = r[0].toUpperCase() + r.slice(1);
            t[e] = r;
        }
        return r;
    };
}();

const p = function() {
    const t = c();
    const e = (t, e) => e ? `-${t.toLowerCase()}` : t.toLowerCase();
    return r => {
        let n = t[r];
        if (void 0 === n) n = t[r] = a(r, e);
        return n;
    };
}();

const v = t => {
    const e = t.length;
    const r = Array(e);
    let n = 0;
    for (;n < e; ++n) r[n] = t[n];
    return r;
};

const g = (t, e, r) => ({
    configurable: true,
    enumerable: r.enumerable,
    get() {
        const t = r.value.bind(this);
        Reflect.defineProperty(this, e, {
            value: t,
            writable: true,
            configurable: true,
            enumerable: r.enumerable
        });
        return t;
    }
});

const w = (...t) => {
    const e = [];
    let r = 0;
    const n = t.length;
    let s = 0;
    let i;
    let o = 0;
    for (;o < n; ++o) {
        i = t[o];
        if (void 0 !== i) {
            s = i.length;
            let t = 0;
            for (;t < s; ++t) e[r++] = i[t];
        }
    }
    return e;
};

const x = (...t) => {
    const e = t.length;
    let r;
    let n = 0;
    for (;e > n; ++n) {
        r = t[n];
        if (void 0 !== r) return r;
    }
    throw l(`No default value found`);
};

const R = function() {
    const t = Function.prototype;
    const e = Object.getPrototypeOf;
    const r = new WeakMap;
    let n = t;
    let s = 0;
    let i;
    return function(o) {
        i = r.get(o);
        if (void 0 === i) {
            r.set(o, i = [ n = o ]);
            s = 0;
            while ((n = e(n)) !== t) i[++s] = n;
        }
        return i;
    };
}();

function m(...t) {
    return Object.assign(c(), ...t);
}

const y = function() {
    const t = new WeakMap;
    let e = false;
    let r = "";
    let n = 0;
    return s => {
        e = t.get(s);
        if (void 0 === e) {
            r = s.toString();
            n = r.length;
            e = n >= 29 && n <= 100 && 125 === C(r, n - 1) && C(r, n - 2) <= 32 && 93 === C(r, n - 3) && 101 === C(r, n - 4) && 100 === C(r, n - 5) && 111 === C(r, n - 6) && 99 === C(r, n - 7) && 32 === C(r, n - 8) && 101 === C(r, n - 9) && 118 === C(r, n - 10) && 105 === C(r, n - 11) && 116 === C(r, n - 12) && 97 === C(r, n - 13) && 110 === C(r, n - 14) && 88 === C(r, n - 15);
            t.set(s, e);
        }
        return e;
    };
}();

const b = (t, e) => {
    if (t instanceof Promise) return t.then(e);
    return e(t);
};

const $ = (...t) => {
    let e;
    let r;
    let n;
    let s = 0;
    let i = t.length;
    for (;s < i; ++s) {
        e = t[s];
        if ((e = t[s]) instanceof Promise) if (void 0 === r) r = e; else if (void 0 === n) n = [ r, e ]; else n.push(e);
    }
    if (void 0 === n) return r;
    return Promise.all(n);
};

const C = (t, e) => t.charCodeAt(e);

const A = "au:annotation";

const j = (t, e) => {
    if (void 0 === e) return `${A}:${t}`;
    return `${A}:${t}:${e}`;
};

const I = (t, e) => {
    const n = r(A, t);
    if (void 0 === n) s(A, [ e ], t); else n.push(e);
};

const E = Object.freeze({
    name: "au:annotation",
    appendTo: I,
    set(t, e, r) {
        s(j(e), r, t);
    },
    get: (t, e) => r(j(e), t),
    getKeys(t) {
        let e = r(A, t);
        if (void 0 === e) s(A, e = [], t);
        return e;
    },
    isKey: t => t.startsWith(A),
    keyFor: j
});

const O = "au:resource";

const M = Object.freeze({
    name: O,
    appendTo(t, e) {
        const n = r(O, t);
        if (void 0 === n) s(O, [ e ], t); else n.push(e);
    },
    has: t => n(O, t),
    getAll(t) {
        const e = r(O, t);
        if (void 0 === e) return Gt; else return e.map((e => r(e, t)));
    },
    getKeys(t) {
        let e = r(O, t);
        if (void 0 === e) s(O, e = [], t);
        return e;
    },
    isKey: t => t.startsWith(O),
    keyFor(t, e) {
        if (void 0 === e) return `${O}:${t}`;
        return `${O}:${t}:${e}`;
    }
});

const k = {
    annotation: E,
    resource: M
};

const F = Object.prototype.hasOwnProperty;

function L(t, e, n, s) {
    let i = r(j(t), n);
    if (void 0 === i) {
        i = e[t];
        if (void 0 === i) {
            i = n[t];
            if (void 0 === i || !F.call(n, t)) return s();
            return i;
        }
        return i;
    }
    return i;
}

function U(t, e, n) {
    let s = r(j(t), e);
    if (void 0 === s) {
        s = e[t];
        if (void 0 === s || !F.call(e, t)) return n();
        return s;
    }
    return s;
}

function T(t, e, r) {
    const n = e[t];
    if (void 0 === n) return r();
    return n;
}

const P = new Set("Array ArrayBuffer Boolean DataView Date Error EvalError Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Number Object Promise RangeError ReferenceError RegExp Set SharedArrayBuffer String SyntaxError TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array URIError WeakMap WeakSet".split(" "));

let D = 0;

class Container {
    constructor(t, e) {
        this.parent = t;
        this.config = e;
        this.id = ++D;
        this.t = 0;
        this.i = new Map;
        if (null === t) {
            this.root = this;
            this.u = new Map;
            this.h = new Map;
            this.res = c();
        } else {
            this.root = t.root;
            this.u = new Map;
            this.h = t.h;
            if (e.inheritParentResources) this.res = Object.assign(c(), t.res, this.root.res); else this.res = c();
        }
        this.u.set(mt, W);
    }
    get depth() {
        return null === this.parent ? 0 : this.parent.depth + 1;
    }
    register(...e) {
        if (100 === ++this.t) throw K(e);
        let r;
        let n;
        let s;
        let i;
        let o;
        let c = 0;
        let l = e.length;
        for (;c < l; ++c) {
            r = e[c];
            if (!t.isObject(r)) continue;
            if (_(r)) r.register(this); else if (k.resource.has(r)) {
                const t = k.resource.getAll(r);
                if (1 === t.length) t[0].register(this); else {
                    i = 0;
                    o = t.length;
                    while (o > i) {
                        t[i].register(this);
                        ++i;
                    }
                }
            } else if (Q(r)) zt.singleton(r, r).register(this); else {
                n = Object.keys(r);
                i = 0;
                o = n.length;
                for (;i < o; ++i) {
                    s = r[n[i]];
                    if (!t.isObject(s)) continue;
                    if (_(s)) s.register(this); else this.register(s);
                }
            }
        }
        --this.t;
        return this;
    }
    registerResolver(t, e, r = false) {
        S(t);
        const n = this.u;
        const s = n.get(t);
        if (null == s) {
            n.set(t, e);
            if (G(t)) {
                if (void 0 !== this.res[t]) throw H(t);
                this.res[t] = e;
            }
        } else if (s instanceof Resolver && 4 === s.R) s._state.push(e); else n.set(t, new Resolver(t, 4, [ s, e ]));
        if (r) this.i.set(t, e);
        return e;
    }
    registerTransformer(t, e) {
        const r = this.getResolver(t);
        if (null == r) return false;
        if (r.getFactory) {
            const t = r.getFactory(this);
            if (null == t) return false;
            t.registerTransformer(e);
            return true;
        }
        return false;
    }
    getResolver(t, e = true) {
        S(t);
        if (void 0 !== t.resolve) return t;
        let r = this;
        let n;
        let s;
        while (null != r) {
            n = r.u.get(t);
            if (null == n) {
                if (null == r.parent) {
                    s = z(t) ? this : r;
                    return e ? this.$(t, s) : null;
                }
                r = r.parent;
            } else return n;
        }
        return null;
    }
    has(t, e = false) {
        return this.u.has(t) ? true : e && null != this.parent ? this.parent.has(t, true) : false;
    }
    get(t) {
        S(t);
        if (t.$isResolver) return t.resolve(this, this);
        let e = this;
        let r;
        let n;
        while (null != e) {
            r = e.u.get(t);
            if (null == r) {
                if (null == e.parent) {
                    n = z(t) ? this : e;
                    r = this.$(t, n);
                    return r.resolve(e, this);
                }
                e = e.parent;
            } else return r.resolve(e, this);
        }
        throw q(t);
    }
    getAll(t, e = false) {
        S(t);
        const r = this;
        let n = r;
        let s;
        if (e) {
            let e = Gt;
            while (null != n) {
                s = n.u.get(t);
                if (null != s) e = e.concat(N(s, n, r));
                n = n.parent;
            }
            return e;
        } else while (null != n) {
            s = n.u.get(t);
            if (null == s) {
                n = n.parent;
                if (null == n) return Gt;
            } else return N(s, n, r);
        }
        return Gt;
    }
    invoke(t, e) {
        if (y(t)) throw Z(t);
        if (void 0 === e) return new t(...gt(t).map(_t, this)); else return new t(...gt(t).map(_t, this), ...e);
    }
    getFactory(t) {
        let e = this.h.get(t);
        if (void 0 === e) {
            if (y(t)) throw Z(t);
            this.h.set(t, e = new Factory(t, gt(t)));
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
        let r;
        let n;
        for ([n, r] of e.entries()) {
            r.dispose();
            t.delete(n);
        }
        e.clear();
    }
    find(t, e) {
        const n = t.keyFrom(e);
        let s = this.res[n];
        if (void 0 === s) {
            s = this.root.res[n];
            if (void 0 === s) return null;
        }
        if (null === s) return null;
        if (i(s.getFactory)) {
            const e = s.getFactory(this);
            if (null === e || void 0 === e) return null;
            const n = r(t.name, e.Type);
            if (void 0 === n) return null;
            return n;
        }
        return null;
    }
    create(t, e) {
        const r = t.keyFrom(e);
        let n = this.res[r];
        if (void 0 === n) {
            n = this.root.res[r];
            if (void 0 === n) return null;
            return n.resolve(this.root, this) ?? null;
        }
        return n.resolve(this, this) ?? null;
    }
    dispose() {
        if (this.i.size > 0) this.disposeResolvers();
        this.u.clear();
    }
    $(t, e) {
        if (!i(t)) throw V(t);
        if (P.has(t.name)) throw J(t);
        if (_(t)) {
            const r = t.register(e, t);
            if (!(r instanceof Object) || null == r.resolve) {
                const r = e.u.get(t);
                if (null != r) return r;
                throw X();
            }
            return r;
        } else if (k.resource.has(t)) {
            const r = k.resource.getAll(t);
            if (1 === r.length) r[0].register(e); else {
                const t = r.length;
                for (let n = 0; n < t; ++n) r[n].register(e);
            }
            const n = e.u.get(t);
            if (null != n) return n;
            throw X();
        } else if (t.$isInterface) throw Y(t.friendlyName); else {
            const r = this.config.defaultResolver(t, e);
            e.u.set(t, r);
            return r;
        }
    }
}

function S(t) {
    if (null === t || void 0 === t) throw l(`AUR0014`);
}

const N = (t, e, r) => {
    if (t instanceof Resolver && 4 === t.R) {
        const n = t._state;
        let s = n.length;
        const i = new Array(s);
        while (s--) i[s] = n[s].resolve(e, r);
        return i;
    }
    return [ t.resolve(e, r) ];
};

const W = {
    $isResolver: true,
    resolve(t, e) {
        return e;
    }
};

const _ = t => i(t.register);

const B = t => _(t) && "boolean" === typeof t.registerInRequestor;

const z = t => B(t) && t.registerInRequestor;

const Q = t => void 0 !== t.prototype;

const G = t => o(t) && t.indexOf(":") > 0;

const K = t => l(`AUR0006:${t.map(e)}`);

const H = t => l(`AUR0007:${e(t)}`);

const q = t => l(`AUR0008:${e(t)}`);

const V = t => l(`AUR0009:${e(t)}`);

const J = t => l(`AUR0010:${t.name}`);

const X = () => l(`AUR0011`);

const Y = t => l(`AUR0012:${t}`);

const Z = t => l(`AUR0015:${t.name}`);

const tt = (t, e) => new Resolver(t, 0, e);

const et = (t, e) => new Resolver(t, 1, e);

const rt = (t, e) => new Resolver(t, 2, e);

const nt = (t, e) => new Resolver(t, 3, e);

const st = (t, e) => new Resolver(t, 3, lt(e));

const it = (t, e) => new Resolver(e, 5, t);

const ot = (t, ...e) => new ParameterizedRegistry(t, e);

const ct = new WeakMap;

const lt = t => (e, r, n) => {
    let s = ct.get(e);
    if (void 0 === s) ct.set(e, s = new WeakMap);
    if (s.has(n)) return s.get(n);
    const i = t(e, r, n);
    s.set(n, i);
    return i;
};

t.applyMetadataPolyfill(Reflect, false, false);

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
        return this.C(3, lt(t));
    }
    aliasTo(t) {
        return this.C(5, t);
    }
    C(t, e) {
        const {c: r, k: n} = this;
        this.c = this.k = void 0;
        return r.registerResolver(n, new Resolver(n, t, e));
    }
}

const ut = t => {
    const e = t.slice();
    const r = Object.keys(t);
    const n = r.length;
    let s;
    for (let i = 0; i < n; ++i) {
        s = r[i];
        if (!f(s)) e[s] = t[s];
    }
    return e;
};

const ft = {
    none(t) {
        throw at(t);
    },
    singleton: t => new Resolver(t, 1, t),
    transient: t => new Resolver(t, 2, t)
};

const at = t => l(`AUR0002:${e(t)}`);

class ContainerConfiguration {
    constructor(t, e) {
        this.inheritParentResources = t;
        this.defaultResolver = e;
    }
    static from(t) {
        if (void 0 === t || t === ContainerConfiguration.DEFAULT) return ContainerConfiguration.DEFAULT;
        return new ContainerConfiguration(t.inheritParentResources ?? false, t.defaultResolver ?? ft.singleton);
    }
}

ContainerConfiguration.DEFAULT = ContainerConfiguration.from({});

const ht = t => new Container(null, ContainerConfiguration.from(t));

const dt = t => {
    const e = j("di:paramtypes");
    return r(e, t);
};

const pt = t => r("design:paramtypes", t);

const vt = t => {
    const e = j("di:paramtypes");
    let n = r(e, t);
    if (void 0 === n) {
        s(e, n = [], t);
        I(t, e);
    }
    return n;
};

const gt = t => {
    const e = j("di:dependencies");
    let n = r(e, t);
    if (void 0 === n) {
        const r = t.inject;
        if (void 0 === r) {
            const e = Rt.getDesignParamtypes(t);
            const r = dt(t);
            if (void 0 === e) if (void 0 === r) {
                const e = Object.getPrototypeOf(t);
                if (i(e) && e !== Function.prototype) n = ut(gt(e)); else n = [];
            } else n = ut(r); else if (void 0 === r) n = ut(e); else {
                n = ut(e);
                let t = r.length;
                let s;
                let i = 0;
                for (;i < t; ++i) {
                    s = r[i];
                    if (void 0 !== s) n[i] = s;
                }
                const o = Object.keys(r);
                let c;
                i = 0;
                t = o.length;
                for (i = 0; i < t; ++i) {
                    c = o[i];
                    if (!f(c)) n[c] = r[c];
                }
            }
        } else n = ut(r);
        s(e, n, t);
        I(t, e);
    }
    return n;
};

const wt = (t, e) => {
    const r = i(t) ? t : e;
    const n = o(t) ? t : void 0;
    const s = function(t, e, r) {
        if (null == t || void 0 !== new.target) throw xt(s.friendlyName);
        const n = vt(t);
        n[r] = s;
    };
    s.$isInterface = true;
    s.friendlyName = null == n ? "(anonymous)" : n;
    if (null != r) s.register = (t, e) => r(new ResolverBuilder(t, e ?? s));
    s.toString = () => `InterfaceSymbol<${s.friendlyName}>`;
    return s;
};

const xt = t => l(`AUR0001:${t}`);

const Rt = {
    createContainer: ht,
    getDesignParamtypes: pt,
    getAnnotationParamtypes: dt,
    getOrCreateAnnotationParamTypes: vt,
    getDependencies: gt,
    createInterface: wt,
    inject(...t) {
        return (e, r, n) => {
            if ("number" === typeof n) {
                const r = vt(e);
                const s = t[0];
                if (void 0 !== s) r[n] = s;
            } else if (r) {
                const n = vt(e.constructor);
                const s = t[0];
                if (void 0 !== s) n[r] = s;
            } else if (n) {
                const e = n.value;
                const r = vt(e);
                let s;
                let i = 0;
                for (;i < t.length; ++i) {
                    s = t[i];
                    if (void 0 !== s) r[i] = s;
                }
            } else {
                const r = vt(e);
                let n;
                let s = 0;
                for (;s < t.length; ++s) {
                    n = t[s];
                    if (void 0 !== n) r[s] = n;
                }
            }
        };
    },
    transient(t) {
        t.register = function(e) {
            const r = zt.transient(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = jt) {
        t.register = function(e) {
            const r = zt.singleton(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

const mt = wt("IContainer");

const yt = mt;

function bt(t) {
    return function(e) {
        const r = function(t, e, n) {
            $t(r)(t, e, n);
        };
        r.$isResolver = true;
        r.resolve = function(r, n) {
            return t(e, r, n);
        };
        return r;
    };
}

const $t = Rt.inject;

function Ct(t) {
    return Rt.transient(t);
}

function At(t) {
    return null == t ? Ct : Ct(t);
}

const jt = {
    scoped: false
};

const It = Rt.singleton;

function Et(t) {
    if (i(t)) return It(t);
    return function(e) {
        return It(e, t);
    };
}

const Ot = t => (e, r) => {
    r = !!r;
    const n = function(t, e, r) {
        $t(n)(t, e, r);
    };
    n.$isResolver = true;
    n.resolve = function(n, s) {
        return t(e, n, s, r);
    };
    return n;
};

const Mt = Ot(((t, e, r, n) => r.getAll(t, n)));

const kt = bt(((t, e, r) => () => r.get(t)));

const Ft = bt(((t, e, r) => {
    if (r.has(t, true)) return r.get(t); else return;
}));

const Lt = (t, e, r) => {
    $t(Lt)(t, e, r);
};

Lt.$isResolver = true;

Lt.resolve = () => {};

const Ut = bt(((t, e, r) => (...n) => e.getFactory(t).construct(r, n)));

const Tt = bt(((t, r, n) => {
    const s = Dt(t, r, n);
    const i = new InstanceProvider(e(t), s);
    n.registerResolver(t, i, true);
    return s;
}));

const Pt = bt(((t, e, r) => Dt(t, e, r)));

const Dt = (t, e, r) => e.getFactory(t).construct(r);

class Resolver {
    constructor(t, e, r) {
        this.k = t;
        this.R = e;
        this._state = r;
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
            if (this.resolving) throw St(this._state.name);
            this.resolving = true;
            this._state = t.getFactory(this._state).construct(e);
            this.R = 0;
            this.resolving = false;
            return this._state;

          case 2:
            {
                const r = t.getFactory(this._state);
                if (null === r) throw Nt(this.k);
                return r.construct(e);
            }

          case 3:
            return this._state(t, e, this);

          case 4:
            return this._state[0].resolve(t, e);

          case 5:
            return e.get(this._state);

          default:
            throw Wt(this.R);
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

const St = t => l(`AUR0003:${t}`);

const Nt = t => l(`AUR0004:${e(t)}`);

const Wt = t => l(`AUR0005:${t}`);

function _t(t) {
    return this.get(t);
}

function Bt(t, e) {
    return e(t);
}

class Factory {
    constructor(t, e) {
        this.Type = t;
        this.dependencies = e;
        this.transformers = null;
    }
    construct(t, e) {
        let r;
        if (void 0 === e) r = new this.Type(...this.dependencies.map(_t, t)); else r = new this.Type(...this.dependencies.map(_t, t), ...e);
        if (null == this.transformers) return r;
        return this.transformers.reduce(Bt, r);
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

const zt = {
    instance: tt,
    singleton: et,
    transient: rt,
    callback: nt,
    cachedCallback: st,
    aliasTo: it,
    defer: ot
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
        if (null == this.A) throw Qt(this.j);
        return this.A;
    }
    dispose() {
        this.A = null;
    }
}

const Qt = t => l(`AUR0013:${t}`);

const Gt = Object.freeze([]);

const Kt = Object.freeze({});

function Ht() {}

const qt = wt("IPlatform");

function Vt(t, e, r, n) {
    var s = arguments.length, i = s < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) i = Reflect.decorate(t, e, r, n); else for (var c = t.length - 1; c >= 0; c--) if (o = t[c]) i = (s < 3 ? o(i) : s > 3 ? o(e, r, i) : o(e, r)) || i;
    return s > 3 && i && Object.defineProperty(e, r, i), i;
}

function Jt(t, e) {
    return function(r, n) {
        e(r, n, t);
    };
}

exports.LogLevel = void 0;

(function(t) {
    t[t["trace"] = 0] = "trace";
    t[t["debug"] = 1] = "debug";
    t[t["info"] = 2] = "info";
    t[t["warn"] = 3] = "warn";
    t[t["error"] = 4] = "error";
    t[t["fatal"] = 5] = "fatal";
    t[t["none"] = 6] = "none";
})(exports.LogLevel || (exports.LogLevel = {}));

exports.ColorOptions = void 0;

(function(t) {
    t[t["noColors"] = 0] = "noColors";
    t[t["colors"] = 1] = "colors";
})(exports.ColorOptions || (exports.ColorOptions = {}));

const Xt = wt("ILogConfig", (t => t.instance(new LogConfig(0, 3))));

const Yt = wt("ISink");

const Zt = wt("ILogEventFactory", (t => t.singleton(exports.DefaultLogEventFactory)));

const te = wt("ILogger", (t => t.singleton(exports.DefaultLogger)));

const ee = wt("ILogScope");

const re = Object.freeze({
    key: j("logger-sink-handles"),
    define(t, e) {
        s(this.key, e.handles, t.prototype);
        return t;
    },
    getHandles(e) {
        return t.Metadata.get(this.key, e);
    }
});

const ne = t => e => re.define(e, t);

const se = m({
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

const ie = function() {
    const t = [ m({
        TRC: "TRC",
        DBG: "DBG",
        INF: "INF",
        WRN: "WRN",
        ERR: "ERR",
        FTL: "FTL",
        QQQ: "???"
    }), m({
        TRC: se.grey("TRC"),
        DBG: se.grey("DBG"),
        INF: se.white("INF"),
        WRN: se.yellow("WRN"),
        ERR: se.red("ERR"),
        FTL: se.red("FTL"),
        QQQ: se.grey("???")
    }) ];
    return (e, r) => {
        if (e <= 0) return t[r].TRC;
        if (e <= 1) return t[r].DBG;
        if (e <= 2) return t[r].INF;
        if (e <= 3) return t[r].WRN;
        if (e <= 4) return t[r].ERR;
        if (e <= 5) return t[r].FTL;
        return t[r].QQQ;
    };
}();

const oe = (t, e) => {
    if (0 === e) return t.join(".");
    return t.map(se.cyan).join(".");
};

const ce = (t, e) => {
    if (0 === e) return new Date(t).toISOString();
    return se.grey(new Date(t).toISOString());
};

class DefaultLogEvent {
    constructor(t, e, r, n, s, i) {
        this.severity = t;
        this.message = e;
        this.optionalParams = r;
        this.scope = n;
        this.colorOptions = s;
        this.timestamp = i;
    }
    toString() {
        const {severity: t, message: e, scope: r, colorOptions: n, timestamp: s} = this;
        if (0 === r.length) return `${ce(s, n)} [${ie(t, n)}] ${e}`;
        return `${ce(s, n)} [${ie(t, n)} ${oe(r, n)}] ${e}`;
    }
}

exports.DefaultLogEventFactory = class DefaultLogEventFactory {
    constructor(t) {
        this.config = t;
    }
    createLogEvent(t, e, r, n) {
        return new DefaultLogEvent(e, r, n, t.scope, this.config.colorOptions, Date.now());
    }
};

exports.DefaultLogEventFactory = Vt([ Jt(0, Xt) ], exports.DefaultLogEventFactory);

exports.ConsoleSink = class ConsoleSink {
    constructor(t) {
        const e = t.console;
        this.handleEvent = function t(r) {
            const n = r.optionalParams;
            if (void 0 === n || 0 === n.length) {
                const t = r.toString();
                switch (r.severity) {
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
                let t = r.toString();
                let s = 0;
                while (t.includes("%s")) t = t.replace("%s", String(n[s++]));
                switch (r.severity) {
                  case 0:
                  case 1:
                    return e.debug(t, ...n.slice(s));

                  case 2:
                    return e.info(t, ...n.slice(s));

                  case 3:
                    return e.warn(t, ...n.slice(s));

                  case 4:
                  case 5:
                    return e.error(t, ...n.slice(s));
                }
            }
        };
    }
    static register(t) {
        et(Yt, ConsoleSink).register(t);
    }
};

exports.ConsoleSink = Vt([ Jt(0, qt) ], exports.ConsoleSink);

exports.DefaultLogger = class DefaultLogger {
    constructor(t, e, r, n = [], s = null) {
        this.scope = n;
        this.I = c();
        let i;
        let o;
        let l;
        let u;
        let f;
        let a;
        this.config = t;
        this.f = e;
        this.sinks = r;
        if (null === s) {
            this.root = this;
            this.parent = this;
            i = this.O = [];
            o = this.M = [];
            l = this.F = [];
            u = this.L = [];
            f = this.U = [];
            a = this.T = [];
            for (const t of r) {
                const e = re.getHandles(t);
                if (e?.includes(0) ?? true) i.push(t);
                if (e?.includes(1) ?? true) o.push(t);
                if (e?.includes(2) ?? true) l.push(t);
                if (e?.includes(3) ?? true) u.push(t);
                if (e?.includes(4) ?? true) f.push(t);
                if (e?.includes(5) ?? true) a.push(t);
            }
        } else {
            this.root = s.root;
            this.parent = s;
            i = this.O = s.O;
            o = this.M = s.M;
            l = this.F = s.F;
            u = this.L = s.L;
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
        let r = e[t];
        if (void 0 === r) r = e[t] = new DefaultLogger(this.config, this.f, void 0, this.scope.concat(t), this);
        return r;
    }
    P(t, e, r, n) {
        const s = i(r) ? r() : r;
        const o = this.f.createLogEvent(this, e, s, n);
        for (let e = 0, r = t.length; e < r; ++e) t[e].handleEvent(o);
    }
};

Vt([ g ], exports.DefaultLogger.prototype, "trace", null);

Vt([ g ], exports.DefaultLogger.prototype, "debug", null);

Vt([ g ], exports.DefaultLogger.prototype, "info", null);

Vt([ g ], exports.DefaultLogger.prototype, "warn", null);

Vt([ g ], exports.DefaultLogger.prototype, "error", null);

Vt([ g ], exports.DefaultLogger.prototype, "fatal", null);

exports.DefaultLogger = Vt([ Jt(0, Xt), Jt(1, Zt), Jt(2, Mt(Yt)), Jt(3, Ft(ee)), Jt(4, Lt) ], exports.DefaultLogger);

const le = m({
    create({level: t = 3, colorOptions: e = 0, sinks: r = []} = {}) {
        return m({
            register(n) {
                n.register(tt(Xt, new LogConfig(e, t)));
                for (const t of r) if (i(t)) n.register(et(Yt, t)); else n.register(t);
                return n;
            }
        });
    }
});

const ue = wt((t => t.singleton(ModuleLoader)));

const fe = t => t;

class ModuleTransformer {
    constructor(t) {
        this.N = new Map;
        this.W = new Map;
        this._ = t;
    }
    transform(t) {
        if (t instanceof Promise) return this.B(t); else if ("object" === typeof t && null !== t) return this.G(t); else throw l(`Invalid input: ${String(t)}. Expected Promise or Object.`);
    }
    B(t) {
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
        const e = this._(this.K(t));
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
        let r;
        let n;
        let s;
        const o = [];
        for (const c in t) {
            switch (typeof (e = t[c])) {
              case "object":
                if (null === e) continue;
                r = i(e.register);
                n = false;
                s = Gt;
                break;

              case "function":
                r = i(e.register);
                n = void 0 !== e.prototype;
                s = k.resource.getAll(e);
                break;

              default:
                continue;
            }
            o.push(new ModuleItem(c, e, r, n, s));
        }
        return new AnalyzedModule(t, o);
    }
}

class ModuleLoader {
    constructor() {
        this.transformers = new Map;
    }
    load(t, e = fe) {
        const r = this.transformers;
        let n = r.get(e);
        if (void 0 === n) r.set(e, n = new ModuleTransformer(e));
        return n.transform(t);
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
    constructor(t, e, r, n, s) {
        this.key = t;
        this.value = e;
        this.isRegistry = r;
        this.isConstructable = n;
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

const ae = wt("IEventAggregator", (t => t.singleton(EventAggregator)));

class EventAggregator {
    constructor() {
        this.eventLookup = {};
        this.messageHandlers = [];
    }
    publish(t, e) {
        if (!t) throw l(`Invalid channel name or instance: ${t}.`);
        if (o(t)) {
            let r = this.eventLookup[t];
            if (void 0 !== r) {
                r = r.slice();
                let n = r.length;
                while (n-- > 0) r[n](e, t);
            }
        } else {
            const e = this.messageHandlers.slice();
            let r = e.length;
            while (r-- > 0) e[r].handle(t);
        }
    }
    subscribe(t, e) {
        if (!t) throw l(`Invalid channel name or type: ${t}.`);
        let r;
        let n;
        if (o(t)) {
            if (void 0 === this.eventLookup[t]) this.eventLookup[t] = [];
            r = e;
            n = this.eventLookup[t];
        } else {
            r = new Handler(t, e);
            n = this.messageHandlers;
        }
        n.push(r);
        return {
            dispose() {
                const t = n.indexOf(r);
                if (-1 !== t) n.splice(t, 1);
            }
        };
    }
    subscribeOnce(t, e) {
        const r = this.subscribe(t, ((t, n) => {
            r.dispose();
            e(t, n);
        }));
        return r;
    }
}

exports.AnalyzedModule = AnalyzedModule;

exports.ContainerConfiguration = ContainerConfiguration;

exports.DI = Rt;

exports.DefaultLogEvent = DefaultLogEvent;

exports.DefaultResolver = ft;

exports.EventAggregator = EventAggregator;

exports.IContainer = mt;

exports.IEventAggregator = ae;

exports.ILogConfig = Xt;

exports.ILogEventFactory = Zt;

exports.ILogger = te;

exports.IModuleLoader = ue;

exports.IPlatform = qt;

exports.IServiceLocator = yt;

exports.ISink = Yt;

exports.InstanceProvider = InstanceProvider;

exports.LogConfig = LogConfig;

exports.LoggerConfiguration = le;

exports.ModuleItem = ModuleItem;

exports.Protocol = k;

exports.Registration = zt;

exports.all = Mt;

exports.bound = g;

exports.camelCase = h;

exports.emptyArray = Gt;

exports.emptyObject = Kt;

exports.factory = Ut;

exports.firstDefined = x;

exports.format = se;

exports.fromAnnotationOrDefinitionOrTypeOrDefault = L;

exports.fromAnnotationOrTypeOrDefault = U;

exports.fromDefinitionOrDefault = T;

exports.getPrototypeChain = R;

exports.ignore = Lt;

exports.inject = $t;

exports.isArrayIndex = f;

exports.isNativeFunction = y;

exports.kebabCase = p;

exports.lazy = kt;

exports.mergeArrays = w;

exports.newInstanceForScope = Tt;

exports.newInstanceOf = Pt;

exports.noop = Ht;

exports.onResolve = b;

exports.optional = Ft;

exports.pascalCase = d;

exports.resolveAll = $;

exports.singleton = Et;

exports.sink = ne;

exports.toArray = v;

exports.transient = At;
//# sourceMappingURL=index.cjs.map
