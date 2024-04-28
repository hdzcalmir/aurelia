import { Metadata as t, isObject as e, initializeTC39Metadata as n } from "@aurelia/metadata";

const r = Object.freeze;

const s = Object.assign;

const i = String;

const o = t.get;

t.has;

const l = t.define;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const createObject = () => Object.create(null);

const createMappedError = (t, ...e) => new Error(`AUR${i(t).padStart(4, "0")}:${e.map(i)}`);

const c = (() => {
    const t = {};
    let e = false;
    let n = 0;
    let r = 0;
    let s = 0;
    return i => {
        switch (typeof i) {
          case "number":
            return i >= 0 && (i | 0) === i;

          case "string":
            e = t[i];
            if (e !== void 0) {
                return e;
            }
            n = i.length;
            if (n === 0) {
                return t[i] = false;
            }
            r = 0;
            s = 0;
            for (;s < n; ++s) {
                r = charCodeAt(i, s);
                if (s === 0 && r === 48 && n > 1 || r < 48 || r > 57) {
                    return t[i] = false;
                }
            }
            return t[i] = true;

          default:
            return false;
        }
    };
})();

const a = /*@__PURE__*/ function() {
    const t = s(createObject(), {
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
    const charToKind = e => {
        if (e === "") {
            return 0;
        }
        if (e !== e.toUpperCase()) {
            return 3;
        }
        if (e !== e.toLowerCase()) {
            return 2;
        }
        if (t[e] === true) {
            return 1;
        }
        return 0;
    };
    return (t, e) => {
        const n = t.length;
        if (n === 0) {
            return t;
        }
        let r = false;
        let s = "";
        let i;
        let o = "";
        let l = 0;
        let c = t.charAt(0);
        let a = charToKind(c);
        let u = 0;
        for (;u < n; ++u) {
            i = l;
            o = c;
            l = a;
            c = t.charAt(u + 1);
            a = charToKind(c);
            if (l === 0) {
                if (s.length > 0) {
                    r = true;
                }
            } else {
                if (!r && s.length > 0 && l === 2) {
                    r = i === 3 || a === 3;
                }
                s += e(o, r);
                r = false;
            }
        }
        return s;
    };
}();

const u = /*@__PURE__*/ function() {
    const t = createObject();
    const callback = (t, e) => e ? t.toUpperCase() : t.toLowerCase();
    return e => {
        let n = t[e];
        if (n === void 0) {
            n = t[e] = a(e, callback);
        }
        return n;
    };
}();

const f = /*@__PURE__*/ function() {
    const t = createObject();
    return e => {
        let n = t[e];
        if (n === void 0) {
            n = u(e);
            if (n.length > 0) {
                n = n[0].toUpperCase() + n.slice(1);
            }
            t[e] = n;
        }
        return n;
    };
}();

const h = /*@__PURE__*/ function() {
    const t = createObject();
    const callback = (t, e) => e ? `-${t.toLowerCase()}` : t.toLowerCase();
    return e => {
        let n = t[e];
        if (n === void 0) {
            n = t[e] = a(e, callback);
        }
        return n;
    };
}();

const toArray = t => {
    const e = t.length;
    const n = Array(e);
    let r = 0;
    for (;r < e; ++r) {
        n[r] = t[r];
    }
    return n;
};

const bound = (t, e) => {
    const n = e.name;
    e.addInitializer((function() {
        Reflect.defineProperty(this, n, {
            value: t.bind(this),
            writable: true,
            configurable: true,
            enumerable: false
        });
    }));
};

const mergeArrays = (...t) => {
    const e = [];
    let n = 0;
    const r = t.length;
    let s = 0;
    let i;
    let o = 0;
    for (;o < r; ++o) {
        i = t[o];
        if (i !== void 0) {
            s = i.length;
            let t = 0;
            for (;t < s; ++t) {
                e[n++] = i[t];
            }
        }
    }
    return e;
};

const firstDefined = (...t) => {
    const e = t.length;
    let n;
    let r = 0;
    for (;e > r; ++r) {
        n = t[r];
        if (n !== void 0) {
            return n;
        }
    }
    throw createMappedError(20);
};

const d = /*@__PURE__*/ function() {
    const t = Function.prototype;
    const e = Object.getPrototypeOf;
    const n = new WeakMap;
    let r = t;
    let s = 0;
    let i = void 0;
    return function(o) {
        i = n.get(o);
        if (i === void 0) {
            n.set(o, i = [ r = o ]);
            s = 0;
            while ((r = e(r)) !== t) {
                i[++s] = r;
            }
        }
        return i;
    };
}();

function toLookup(...t) {
    return s(createObject(), ...t);
}

const v = /*@__PURE__*/ function() {
    const t = new WeakMap;
    let e = false;
    let n = "";
    let r = 0;
    return s => {
        e = t.get(s);
        if (e === void 0) {
            n = s.toString();
            r = n.length;
            e = r >= 29 && r <= 100 && charCodeAt(n, r - 1) === 125 && charCodeAt(n, r - 2) <= 32 && charCodeAt(n, r - 3) === 93 && charCodeAt(n, r - 4) === 101 && charCodeAt(n, r - 5) === 100 && charCodeAt(n, r - 6) === 111 && charCodeAt(n, r - 7) === 99 && charCodeAt(n, r - 8) === 32 && charCodeAt(n, r - 9) === 101 && charCodeAt(n, r - 10) === 118 && charCodeAt(n, r - 11) === 105 && charCodeAt(n, r - 12) === 116 && charCodeAt(n, r - 13) === 97 && charCodeAt(n, r - 14) === 110 && charCodeAt(n, r - 15) === 91;
            t.set(s, e);
        }
        return e;
    };
}();

const onResolve = (t, e) => {
    if (t instanceof Promise) {
        return t.then(e);
    }
    return e(t);
};

const onResolveAll = (...t) => {
    let e = void 0;
    let n = void 0;
    let r = void 0;
    let s = 0;
    let i = t.length;
    for (;s < i; ++s) {
        e = t[s];
        if ((e = t[s]) instanceof Promise) {
            if (n === void 0) {
                n = e;
            } else if (r === void 0) {
                r = [ n, e ];
            } else {
                r.push(e);
            }
        }
    }
    if (r === void 0) {
        return n;
    }
    return Promise.all(r);
};

const charCodeAt = (t, e) => t.charCodeAt(e);

const instanceRegistration = (t, e) => new Resolver(t, 0, e);

const singletonRegistration = (t, e) => new Resolver(t, 1, e);

const transientRegistation = (t, e) => new Resolver(t, 2, e);

const callbackRegistration = (t, e) => new Resolver(t, 3, e);

const cachedCallbackRegistration = (t, e) => new Resolver(t, 3, cacheCallbackResult(e));

const aliasToRegistration = (t, e) => new Resolver(e, 5, t);

const deferRegistration = (t, ...e) => new ParameterizedRegistry(t, e);

const g = new WeakMap;

const cacheCallbackResult = t => (e, n, r) => {
    let s = g.get(e);
    if (s === void 0) {
        g.set(e, s = new WeakMap);
    }
    if (s.has(r)) {
        return s.get(r);
    }
    const i = t(e, n, r);
    s.set(r, i);
    return i;
};

const w = {
    instance: instanceRegistration,
    singleton: singletonRegistration,
    transient: transientRegistation,
    callback: callbackRegistration,
    cachedCallback: cachedCallbackRegistration,
    aliasTo: aliasToRegistration,
    defer: deferRegistration
};

const createImplementationRegister = function(t) {
    return function register(e) {
        e.register(singletonRegistration(this, this), aliasToRegistration(this, t));
    };
};

const m = "au:annotation";

const getAnnotationKeyFor = (t, e) => {
    if (e === void 0) {
        return `${m}:${t}`;
    }
    return `${m}:${t}:${e}`;
};

const appendAnnotation = (t, e) => {
    const n = o(m, t);
    if (n === void 0) {
        l([ e ], t, m);
    } else {
        n.push(e);
    }
};

const y = /*@__PURE__*/ r({
    name: "au:annotation",
    appendTo: appendAnnotation,
    set(t, e, n) {
        l(n, t, getAnnotationKeyFor(e));
    },
    get: (t, e) => o(getAnnotationKeyFor(e), t),
    getKeys(t) {
        let e = o(m, t);
        if (e === void 0) {
            l(e = [], t, m);
        }
        return e;
    },
    isKey: t => t.startsWith(m),
    keyFor: getAnnotationKeyFor
});

const p = "au:resource";

const getResourceKeyFor = (t, e, n) => {
    if (e == null) {
        return `${p}:${t}`;
    }
    if (n == null) {
        return `${p}:${t}:${e}`;
    }
    return `${p}:${t}:${e}:${n}`;
};

const R = {
    annotation: y
};

const b = Object.prototype.hasOwnProperty;

function fromAnnotationOrDefinitionOrTypeOrDefault(t, e, n, r) {
    let s = o(getAnnotationKeyFor(t), n);
    if (s === void 0) {
        s = e[t];
        if (s === void 0) {
            s = n[t];
            if (s === void 0 || !b.call(n, t)) {
                return r();
            }
            return s;
        }
        return s;
    }
    return s;
}

function fromAnnotationOrTypeOrDefault(t, e, n) {
    let r = o(getAnnotationKeyFor(t), e);
    if (r === void 0) {
        r = e[t];
        if (r === void 0 || !b.call(e, t)) {
            return n();
        }
        return r;
    }
    return r;
}

function fromDefinitionOrDefault(t, e, n) {
    const r = e[t];
    if (r === void 0) {
        return n();
    }
    return r;
}

const $ = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return r({
        define: (e, n) => {
            t.set(e, n);
            return e;
        },
        get: e => t.get(e),
        has: e => t.has(e)
    });
})();

const C = {
    none(t) {
        throw createMappedError(2, t);
    },
    singleton: t => new Resolver(t, 1, t),
    transient: t => new Resolver(t, 2, t)
};

class ContainerConfiguration {
    constructor(t, e) {
        this.inheritParentResources = t;
        this.defaultResolver = e;
    }
    static from(t) {
        if (t === void 0 || t === ContainerConfiguration.DEFAULT) {
            return ContainerConfiguration.DEFAULT;
        }
        return new ContainerConfiguration(t.inheritParentResources ?? false, t.defaultResolver ?? C.singleton);
    }
}

ContainerConfiguration.DEFAULT = ContainerConfiguration.from({});

const createContainer = t => new Container(null, ContainerConfiguration.from(t));

const D = new Set("Array ArrayBuffer Boolean DataView Date Error EvalError Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Number Object Promise RangeError ReferenceError RegExp Set SharedArrayBuffer String SyntaxError TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array URIError WeakMap WeakSet".split(" "));

let k = 0;

let O = null;

class Container {
    get depth() {
        return this.t === null ? 0 : this.t.depth + 1;
    }
    get parent() {
        return this.t;
    }
    constructor(t, e) {
        this.id = ++k;
        this.i = 0;
        this.u = new Map;
        this.t = t;
        this.config = e;
        this.h = new Map;
        this.res = {};
        if (t === null) {
            this.root = this;
            this.R = new Map;
        } else {
            this.root = t.root;
            this.R = t.R;
            if (e.inheritParentResources) {
                for (const e in t.res) {
                    this.registerResolver(e, t.res[e]);
                }
            }
        }
        this.h.set(A, E);
    }
    register(...t) {
        if (++this.i === 100) {
            throw createMappedError(6, ...t);
        }
        let n;
        let r;
        let s;
        let i;
        let l;
        let c = 0;
        let a = t.length;
        let u;
        for (;c < a; ++c) {
            n = t[c];
            if (!e(n)) {
                continue;
            }
            if (isRegistry(n)) {
                n.register(this);
            } else if ($.has(n)) {
                $.get(n).call(n, this);
            } else if ((u = o(p, n)) != null) {
                u.register(this);
            } else if (isClass(n)) {
                if (isString(n.$au?.type)) {
                    const t = n.$au;
                    const e = (n.aliases ?? M).concat(t.aliases ?? M);
                    let r = `${p}:${t.type}:${t.name}`;
                    if (!this.has(r, false)) {
                        aliasToRegistration(n, r).register(this);
                        if (!this.has(n, false)) {
                            singletonRegistration(n, n).register(this);
                        }
                        i = 0;
                        l = e.length;
                        for (;i < l; ++i) {
                            r = `${p}:${t.type}:${e[i]}`;
                            if (!this.has(r, false)) {
                                aliasToRegistration(n, r).register(this);
                            }
                        }
                    }
                } else {
                    singletonRegistration(n, n).register(this);
                }
            } else {
                r = Object.keys(n);
                i = 0;
                l = r.length;
                for (;i < l; ++i) {
                    s = n[r[i]];
                    if (!e(s)) {
                        continue;
                    }
                    if (isRegistry(s)) {
                        s.register(this);
                    } else if ($.has(s)) {
                        $.get(s).call(s, this);
                    } else {
                        this.register(s);
                    }
                }
            }
        }
        --this.i;
        return this;
    }
    registerResolver(t, e, n = false) {
        validateKey(t);
        const r = this.h;
        const s = r.get(t);
        if (s == null) {
            r.set(t, e);
            if (isResourceKey(t)) {
                if (this.res[t] !== void 0) {
                    throw createMappedError(7, t);
                }
                this.res[t] = e;
            }
        } else if (s instanceof Resolver && s.$ === 4) {
            s._state.push(e);
        } else {
            r.set(t, new Resolver(t, 4, [ s, e ]));
        }
        if (n) {
            this.u.set(t, e);
        }
        return e;
    }
    registerTransformer(t, e) {
        const n = this.getResolver(t);
        if (n == null) {
            return false;
        }
        if (n.getFactory) {
            const t = n.getFactory(this);
            if (t == null) {
                return false;
            }
            t.registerTransformer(e);
            return true;
        }
        return false;
    }
    getResolver(t, e = true) {
        validateKey(t);
        if (t.resolve !== void 0) {
            return t;
        }
        const n = O;
        let r = O = this;
        let s;
        let i;
        try {
            while (r != null) {
                s = r.h.get(t);
                if (s == null) {
                    if (r.t == null) {
                        i = isRegisterInRequester(t) ? this : r;
                        if (e) {
                            return this.C(t, i);
                        }
                        return null;
                    }
                    r = r.t;
                } else {
                    return s;
                }
            }
        } finally {
            O = n;
        }
        return null;
    }
    has(t, e = false) {
        return this.h.has(t) || isResourceKey(t) && t in this.res || ((e && this.t?.has(t, true)) ?? false);
    }
    get(t) {
        validateKey(t);
        if (t.$isResolver) {
            return t.resolve(this, this);
        }
        const e = O;
        let n = O = this;
        let r;
        let s;
        try {
            while (n != null) {
                r = n.h.get(t);
                if (r == null) {
                    if (n.t == null) {
                        s = isRegisterInRequester(t) ? this : n;
                        r = this.C(t, s);
                        return r.resolve(n, this);
                    }
                    n = n.t;
                } else {
                    return r.resolve(n, this);
                }
            }
        } finally {
            O = e;
        }
        throw createMappedError(8, t);
    }
    getAll(t, e = false) {
        validateKey(t);
        const n = O;
        const r = O = this;
        let s = r;
        let i;
        let o = M;
        try {
            if (e) {
                while (s != null) {
                    i = s.h.get(t);
                    if (i != null) {
                        o = o.concat(buildAllResponse(i, s, r));
                    }
                    s = s.t;
                }
                return o;
            }
            while (s != null) {
                i = s.h.get(t);
                if (i == null) {
                    s = s.t;
                    if (s == null) {
                        return M;
                    }
                } else {
                    return buildAllResponse(i, s, r);
                }
            }
        } finally {
            O = n;
        }
        return M;
    }
    invoke(t, e) {
        if (v(t)) {
            throw createMappedError(15, t);
        }
        const n = O;
        O = this;
        try {
            return e === void 0 ? new t(...getDependencies(t).map(containerGetKey, this)) : new t(...getDependencies(t).map(containerGetKey, this), ...e);
        } finally {
            O = n;
        }
    }
    hasFactory(t) {
        return this.R.has(t);
    }
    getFactory(t) {
        let e = this.R.get(t);
        if (e === void 0) {
            if (v(t)) {
                throw createMappedError(15, t);
            }
            this.R.set(t, e = new Factory(t, getDependencies(t)));
        }
        return e;
    }
    registerFactory(t, e) {
        this.R.set(t, e);
    }
    createChild(t) {
        if (t === void 0 && this.config.inheritParentResources) {
            if (this.config === ContainerConfiguration.DEFAULT) {
                return new Container(this, this.config);
            }
            return new Container(this, ContainerConfiguration.from({
                ...this.config,
                inheritParentResources: false
            }));
        }
        return new Container(this, ContainerConfiguration.from(t ?? this.config));
    }
    disposeResolvers() {
        const t = this.h;
        const e = this.u;
        let n;
        let r;
        for ([r, n] of e.entries()) {
            n.dispose?.();
            t.delete(r);
        }
        e.clear();
    }
    useResources(t) {
        const e = t.res;
        for (const t in e) {
            this.registerResolver(t, e[t]);
        }
    }
    find(t, e) {
        const n = isString(e) ? `${p}:${t}:${e}` : t;
        let r = this;
        let s = r.res[n];
        if (s == null) {
            r = r.root;
            s = r.res[n];
        }
        if (s == null) {
            return null;
        }
        return s.getFactory?.(r)?.Type ?? null;
    }
    dispose() {
        if (this.u.size > 0) {
            this.disposeResolvers();
        }
        this.h.clear();
        if (this.root === this) {
            this.R.clear();
            this.res = {};
        }
    }
    C(t, e) {
        const n = isRegistry(t);
        if (!isFunction(t) && !n) {
            throw createMappedError(9, t);
        }
        if (D.has(t.name)) {
            throw createMappedError(10, t);
        }
        if (n) {
            const n = t.register(e, t);
            if (!(n instanceof Object) || n.resolve == null) {
                const n = e.h.get(t);
                if (n != null) {
                    return n;
                }
                throw createMappedError(11, t);
            }
            return n;
        }
        if (t.$isInterface) {
            throw createMappedError(12, t.friendlyName);
        }
        const r = this.config.defaultResolver(t, e);
        e.h.set(t, r);
        return r;
    }
}

class Factory {
    constructor(t, e) {
        this.Type = t;
        this.dependencies = e;
        this.transformers = null;
    }
    construct(t, e) {
        const n = O;
        O = t;
        let r;
        try {
            if (e === void 0) {
                r = new this.Type(...this.dependencies.map(containerGetKey, t));
            } else {
                r = new this.Type(...this.dependencies.map(containerGetKey, t), ...e);
            }
            if (this.transformers == null) {
                return r;
            }
            return this.transformers.reduce(transformInstance, r);
        } finally {
            O = n;
        }
    }
    registerTransformer(t) {
        (this.transformers ??= []).push(t);
    }
}

function transformInstance(t, e) {
    return e(t);
}

function validateKey(t) {
    if (t === null || t === void 0) {
        throw createMappedError(14);
    }
}

function containerGetKey(t) {
    return this.get(t);
}

function resolve(...t) {
    if (O == null) {
        throw createMappedError(16, ...t);
    }
    return t.length === 1 ? O.get(t[0]) : t.map(containerGetKey, O);
}

const buildAllResponse = (t, e, n) => {
    if (t instanceof Resolver && t.$ === 4) {
        const r = t._state;
        const s = r.length;
        const i = Array(s);
        let o = 0;
        for (;o < s; ++o) {
            i[o] = r[o].resolve(e, n);
        }
        return i;
    }
    return [ t.resolve(e, n) ];
};

const E = {
    $isResolver: true,
    resolve(t, e) {
        return e;
    }
};

const isRegistry = t => isFunction(t.register);

const isSelfRegistry = t => isRegistry(t) && typeof t.registerInRequestor === "boolean";

const isRegisterInRequester = t => isSelfRegistry(t) && t.registerInRequestor;

const isClass = t => t.prototype !== void 0;

const isResourceKey = t => isString(t) && t.indexOf(":") > 0;

n();

class ResolverBuilder {
    constructor(t, e) {
        this.c = t;
        this.k = e;
    }
    instance(t) {
        return this.O(0, t);
    }
    singleton(t) {
        return this.O(1, t);
    }
    transient(t) {
        return this.O(2, t);
    }
    callback(t) {
        return this.O(3, t);
    }
    cachedCallback(t) {
        return this.O(3, cacheCallbackResult(t));
    }
    aliasTo(t) {
        return this.O(5, t);
    }
    O(t, e) {
        const {c: n, k: r} = this;
        this.c = this.k = void 0;
        return n.registerResolver(r, new Resolver(r, t, e));
    }
}

const cloneArrayWithPossibleProps = t => {
    const e = t.slice();
    const n = Object.keys(t);
    const r = n.length;
    let s;
    for (let i = 0; i < r; ++i) {
        s = n[i];
        if (!c(s)) {
            e[s] = t[s];
        }
    }
    return e;
};

const I = getAnnotationKeyFor("di:paramtypes");

const getAnnotationParamtypes = t => o(I, t);

const getDesignParamtypes = t => o("design:paramtypes", t);

const getOrCreateAnnotationParamTypes = t => t.metadata[I] ??= [];

const getDependencies = t => {
    const e = getAnnotationKeyFor("di:dependencies");
    let n = o(e, t);
    if (n === void 0) {
        const r = t.inject;
        if (r === void 0) {
            const e = getDesignParamtypes(t);
            const r = getAnnotationParamtypes(t);
            if (e === void 0) {
                if (r === void 0) {
                    const e = Object.getPrototypeOf(t);
                    if (isFunction(e) && e !== Function.prototype) {
                        n = cloneArrayWithPossibleProps(getDependencies(e));
                    } else {
                        n = [];
                    }
                } else {
                    n = cloneArrayWithPossibleProps(r);
                }
            } else if (r === void 0) {
                n = cloneArrayWithPossibleProps(e);
            } else {
                n = cloneArrayWithPossibleProps(e);
                let t = r.length;
                let s;
                let i = 0;
                for (;i < t; ++i) {
                    s = r[i];
                    if (s !== void 0) {
                        n[i] = s;
                    }
                }
                const o = Object.keys(r);
                let l;
                i = 0;
                t = o.length;
                for (i = 0; i < t; ++i) {
                    l = o[i];
                    if (!c(l)) {
                        n[l] = r[l];
                    }
                }
            }
        } else {
            n = cloneArrayWithPossibleProps(r);
        }
        l(n, t, e);
    }
    return n;
};

const createInterface = (t, e) => {
    const n = isFunction(t) ? t : e;
    const r = (isString(t) ? t : undefined) ?? "(anonymous)";
    const s = {
        $isInterface: true,
        friendlyName: r,
        toString: () => `InterfaceSymbol<${r}>`,
        register: n != null ? (t, e) => n(new ResolverBuilder(t, e ?? s)) : void 0
    };
    return s;
};

const inject = (...t) => (e, n) => {
    switch (n.kind) {
      case "class":
        {
            const e = getOrCreateAnnotationParamTypes(n);
            let r;
            let s = 0;
            for (;s < t.length; ++s) {
                r = t[s];
                if (r !== void 0) {
                    e[s] = r;
                }
            }
            break;
        }

      case "field":
        {
            const e = getOrCreateAnnotationParamTypes(n);
            const r = t[0];
            if (r !== void 0) {
                e[n.name] = r;
            }
            break;
        }

      default:
        throw createMappedError(22, String(n.name), n.kind);
    }
};

const L = {
    createContainer: createContainer,
    getDesignParamtypes: getDesignParamtypes,
    getDependencies: getDependencies,
    createInterface: createInterface,
    inject: inject,
    transient(t) {
        t.register = function(e) {
            const n = transientRegistation(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = _) {
        t.register = function(e) {
            const n = singletonRegistration(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

const A = /*@__PURE__*/ createInterface("IContainer");

const F = A;

function transientDecorator(t, e) {
    return L.transient(t);
}

function transient(t, e) {
    return t == null ? transientDecorator : transientDecorator(t);
}

const _ = {
    scoped: false
};

const j = L.singleton;

function singleton(t, e) {
    return isFunction(t) ? j(t) : function(e, n) {
        return j(e, t);
    };
}

class Resolver {
    get $isResolver() {
        return true;
    }
    constructor(t, e, n) {
        this.I = false;
        this.L = null;
        this.k = t;
        this.$ = e;
        this._state = n;
    }
    register(t, e) {
        return t.registerResolver(e || this.k, this);
    }
    resolve(t, e) {
        switch (this.$) {
          case 0:
            return this._state;

          case 1:
            {
                if (this.I) {
                    throw createMappedError(3, this._state.name);
                }
                this.I = true;
                this._state = (this.L = t.getFactory(this._state)).construct(e);
                this.$ = 0;
                this.I = false;
                return this._state;
            }

          case 2:
            {
                const n = t.getFactory(this._state);
                if (n === null) {
                    throw createMappedError(4, this.k);
                }
                return n.construct(e);
            }

          case 3:
            return this._state(t, e, this);

          case 4:
            return this._state[0].resolve(t, e);

          case 5:
            return e.get(this._state);

          default:
            throw createMappedError(5, this.$);
        }
    }
    getFactory(t) {
        switch (this.$) {
          case 1:
          case 2:
            return t.getFactory(this._state);

          case 5:
            return t.getResolver(this._state)?.getFactory?.(t) ?? null;

          case 0:
            return this.L;

          default:
            return null;
        }
    }
}

class InstanceProvider {
    get friendlyName() {
        return this.A;
    }
    constructor(t, e = null, n = null) {
        this.A = t;
        this.F = e;
        this._ = n;
    }
    prepare(t) {
        this.F = t;
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        if (this.F == null) {
            throw createMappedError(13, this.A);
        }
        return this.F;
    }
    getFactory(t) {
        return this._ == null ? null : t.getFactory(this._);
    }
    dispose() {
        this.F = null;
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
        } else {
            t.register(...this.params.filter((t => typeof t === "object")));
        }
    }
}

const M = r([]);

const T = r({});

function noop() {}

const S = /*@__PURE__*/ createInterface("IPlatform");

function createResolver(t) {
    return function(e) {
        function Resolver(t, e) {
            inject(Resolver)(t, e);
        }
        Resolver.$isResolver = true;
        Resolver.resolve = function(n, r) {
            return t(e, n, r);
        };
        return Resolver;
    };
}

const all = (t, e = false) => {
    function resolver(t, e) {
        inject(resolver)(t, e);
    }
    resolver.$isResolver = true;
    resolver.resolve = (n, r) => r.getAll(t, e);
    return resolver;
};

const P = /*@__PURE__*/ createResolver(((t, e, n) => () => n.get(t)));

const K = /*@__PURE__*/ createResolver(((t, e, n) => {
    if (n.has(t, true)) {
        return n.get(t);
    } else {
        return undefined;
    }
}));

const N = /*@__PURE__*/ s(((t, e) => {
    inject(N)(t, e);
}), {
    $isResolver: true,
    resolve: () => void 0
});

const W = /*@__PURE__*/ createResolver(((t, e, n) => (...r) => e.getFactory(t).construct(n, r)));

const z = /*@__PURE__*/ createResolver(((t, e, n) => n.has(t, false) ? n.get(t) : void 0));

const G = /*@__PURE__*/ createResolver(((t, e, n) => n.has(t, false) ? n.get(t) : n.root.get(t)));

const B = /*@__PURE__*/ createResolver(((t, e, n) => n.has(t, false) ? n.get(t) : n.root.has(t, false) ? n.root.get(t) : void 0));

const Q = /*@__PURE__*/ createResolver(((t, e, n) => n === n.root ? n.getAll(t, false) : n.has(t, false) ? n.getAll(t, false).concat(n.root.getAll(t, false)) : n.root.getAll(t, false)));

const U = /*@__PURE__*/ createResolver(((t, e, n) => {
    const r = createNewInstance(t, e, n);
    const s = new InstanceProvider(i(t), r);
    n.registerResolver(t, s, true);
    return r;
}));

const x = /*@__PURE__*/ createResolver(((t, e, n) => createNewInstance(t, e, n)));

const createNewInstance = (t, e, n) => {
    if (e.hasFactory(t)) {
        return e.getFactory(t).construct(n);
    }
    if (isInterface(t)) {
        const r = isFunction(t.register);
        const s = e.getResolver(t, false);
        let i;
        if (s == null) {
            if (r) {
                i = (H ??= createContainer()).getResolver(t, true)?.getFactory?.(e);
            }
            H.dispose();
        } else {
            i = s.getFactory?.(e);
        }
        if (i != null) {
            return i.construct(n);
        }
        throw createMappedError(17, t);
    }
    return e.getFactory(t).construct(n);
};

const isInterface = t => t?.$isInterface === true;

let H;

function __esDecorate(t, e, n, r, s, i) {
    function accept(t) {
        if (t !== void 0 && typeof t !== "function") throw new TypeError("Function expected");
        return t;
    }
    var o = r.kind, l = o === "getter" ? "get" : o === "setter" ? "set" : "value";
    var c = !e && t ? r["static"] ? t : t.prototype : null;
    var a = e || (c ? Object.getOwnPropertyDescriptor(c, r.name) : {});
    var u, f = false;
    for (var h = n.length - 1; h >= 0; h--) {
        var d = {};
        for (var v in r) d[v] = v === "access" ? {} : r[v];
        for (var v in r.access) d.access[v] = r.access[v];
        d.addInitializer = function(t) {
            if (f) throw new TypeError("Cannot add initializers after decoration has completed");
            i.push(accept(t || null));
        };
        var g = (0, n[h])(o === "accessor" ? {
            get: a.get,
            set: a.set
        } : a[l], d);
        if (o === "accessor") {
            if (g === void 0) continue;
            if (g === null || typeof g !== "object") throw new TypeError("Object expected");
            if (u = accept(g.get)) a.get = u;
            if (u = accept(g.set)) a.set = u;
            if (u = accept(g.init)) s.unshift(u);
        } else if (u = accept(g)) {
            if (o === "field") s.unshift(u); else a[l] = u;
        }
    }
    if (c) Object.defineProperty(c, r.name, a);
    f = true;
}

function __runInitializers(t, e, n) {
    var r = arguments.length > 2;
    for (var s = 0; s < e.length; s++) {
        n = r ? e[s].call(t, n) : e[s].call(t);
    }
    return r ? n : void 0;
}

const V = 0;

const q = 1;

const J = 2;

const X = 3;

const Y = 4;

const Z = 5;

const tt = 6;

const et = r({
    trace: V,
    debug: q,
    info: J,
    warn: X,
    error: Y,
    fatal: Z,
    none: tt
});

const nt = /*@__PURE__*/ createInterface("ILogConfig", (t => t.instance(new LogConfig("no-colors", X))));

const rt = /*@__PURE__*/ createInterface("ISink");

const st = /*@__PURE__*/ createInterface("ILogEventFactory", (t => t.singleton(DefaultLogEventFactory)));

const it = /*@__PURE__*/ createInterface("ILogger", (t => t.singleton(ut)));

const ot = /*@__PURE__*/ createInterface("ILogScope");

const lt = /*@__PURE__*/ r({
    key: getAnnotationKeyFor("logger-sink-handles"),
    define(t, e) {
        l(e.handles, t, this.key);
    },
    getHandles(t) {
        return o(this.key, t.constructor);
    }
});

const sink = t => (e, n) => n.addInitializer((function() {
    lt.define(this, t);
}));

const ct = toLookup({
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

const at = function() {
    const t = {
        "no-colors": toLookup({
            TRC: "TRC",
            DBG: "DBG",
            INF: "INF",
            WRN: "WRN",
            ERR: "ERR",
            FTL: "FTL",
            QQQ: "???"
        }),
        colors: toLookup({
            TRC: ct.grey("TRC"),
            DBG: ct.grey("DBG"),
            INF: ct.white("INF"),
            WRN: ct.yellow("WRN"),
            ERR: ct.red("ERR"),
            FTL: ct.red("FTL"),
            QQQ: ct.grey("???")
        })
    };
    return (e, n) => {
        if (e <= V) {
            return t[n].TRC;
        }
        if (e <= q) {
            return t[n].DBG;
        }
        if (e <= J) {
            return t[n].INF;
        }
        if (e <= X) {
            return t[n].WRN;
        }
        if (e <= Y) {
            return t[n].ERR;
        }
        if (e <= Z) {
            return t[n].FTL;
        }
        return t[n].QQQ;
    };
}();

const getScopeString = (t, e) => {
    if (e === "no-colors") {
        return t.join(".");
    }
    return t.map(ct.cyan).join(".");
};

const getIsoString = (t, e) => {
    if (e === "no-colors") {
        return new Date(t).toISOString();
    }
    return ct.grey(new Date(t).toISOString());
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
        if (n.length === 0) {
            return `${getIsoString(s, r)} [${at(t, r)}] ${e}`;
        }
        return `${getIsoString(s, r)} [${at(t, r)} ${getScopeString(n, r)}] ${e}`;
    }
    getFormattedLogInfo(t = false) {
        const {severity: e, message: n, scope: r, colorOptions: s, timestamp: i, optionalParams: o} = this;
        let l = null;
        let c = "";
        if (t && n instanceof Error) {
            l = n;
        } else {
            c = n;
        }
        const a = r.length === 0 ? "" : ` ${getScopeString(r, s)}`;
        let u = `${getIsoString(i, s)} [${at(e, s)}${a}] ${c}`;
        if (o === void 0 || o.length === 0) {
            return l === null ? [ u ] : [ u, l ];
        }
        let f = 0;
        while (u.includes("%s")) {
            u = u.replace("%s", String(o[f++]));
        }
        return l !== null ? [ u, l, ...o.slice(f) ] : [ u, ...o.slice(f) ];
    }
}

class DefaultLogEventFactory {
    constructor() {
        this.config = resolve(nt);
    }
    createLogEvent(t, e, n, r) {
        return new DefaultLogEvent(e, n, r, t.scope, this.config.colorOptions, Date.now());
    }
}

class ConsoleSink {
    static register(t) {
        singletonRegistration(rt, ConsoleSink).register(t);
    }
    constructor(t = resolve(S)) {
        const e = t.console;
        this.handleEvent = function emit(t) {
            const n = t.getFormattedLogInfo(true);
            switch (t.severity) {
              case V:
              case q:
                return e.debug(...n);

              case J:
                return e.info(...n);

              case X:
                return e.warn(...n);

              case Y:
              case Z:
                return e.error(...n);
            }
        };
    }
}

let ut = (() => {
    var t;
    let e = [];
    let n;
    let r;
    let s;
    let i;
    let o;
    let l;
    return t = class DefaultLogger {
        constructor(t = resolve(nt), n = resolve(st), r = resolve(all(rt)), s = resolve(K(ot)) ?? [], i = null) {
            this.scope = (__runInitializers(this, e), s);
            this.j = createObject();
            let o;
            let l;
            let c;
            let a;
            let u;
            let f;
            this.config = t;
            this.f = n;
            this.sinks = r;
            if (i === null) {
                this.root = this;
                this.parent = this;
                o = this.M = [];
                l = this.T = [];
                c = this.P = [];
                a = this.K = [];
                u = this.N = [];
                f = this.W = [];
                for (const t of r) {
                    const e = lt.getHandles(t);
                    if (e?.includes(V) ?? true) {
                        o.push(t);
                    }
                    if (e?.includes(q) ?? true) {
                        l.push(t);
                    }
                    if (e?.includes(J) ?? true) {
                        c.push(t);
                    }
                    if (e?.includes(X) ?? true) {
                        a.push(t);
                    }
                    if (e?.includes(Y) ?? true) {
                        u.push(t);
                    }
                    if (e?.includes(Z) ?? true) {
                        f.push(t);
                    }
                }
            } else {
                this.root = i.root;
                this.parent = i;
                o = this.M = i.M;
                l = this.T = i.T;
                c = this.P = i.P;
                a = this.K = i.K;
                u = this.N = i.N;
                f = this.W = i.W;
            }
        }
        trace(t, ...e) {
            if (this.config.level <= V) {
                this.G(this.M, V, t, e);
            }
        }
        debug(t, ...e) {
            if (this.config.level <= q) {
                this.G(this.T, q, t, e);
            }
        }
        info(t, ...e) {
            if (this.config.level <= J) {
                this.G(this.P, J, t, e);
            }
        }
        warn(t, ...e) {
            if (this.config.level <= X) {
                this.G(this.K, X, t, e);
            }
        }
        error(t, ...e) {
            if (this.config.level <= Y) {
                this.G(this.N, Y, t, e);
            }
        }
        fatal(t, ...e) {
            if (this.config.level <= Z) {
                this.G(this.W, Z, t, e);
            }
        }
        scopeTo(e) {
            const n = this.j;
            let r = n[e];
            if (r === void 0) {
                r = n[e] = new t(this.config, this.f, null, this.scope.concat(e), this);
            }
            return r;
        }
        G(t, e, n, r) {
            const s = isFunction(n) ? n() : n;
            const i = this.f.createLogEvent(this, e, s, r);
            for (let e = 0, n = t.length; e < n; ++e) {
                t[e].handleEvent(i);
            }
        }
    }, (() => {
        const c = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        n = [ bound ];
        r = [ bound ];
        s = [ bound ];
        i = [ bound ];
        o = [ bound ];
        l = [ bound ];
        __esDecorate(t, null, n, {
            kind: "method",
            name: "trace",
            static: false,
            private: false,
            access: {
                has: t => "trace" in t,
                get: t => t.trace
            },
            metadata: c
        }, null, e);
        __esDecorate(t, null, r, {
            kind: "method",
            name: "debug",
            static: false,
            private: false,
            access: {
                has: t => "debug" in t,
                get: t => t.debug
            },
            metadata: c
        }, null, e);
        __esDecorate(t, null, s, {
            kind: "method",
            name: "info",
            static: false,
            private: false,
            access: {
                has: t => "info" in t,
                get: t => t.info
            },
            metadata: c
        }, null, e);
        __esDecorate(t, null, i, {
            kind: "method",
            name: "warn",
            static: false,
            private: false,
            access: {
                has: t => "warn" in t,
                get: t => t.warn
            },
            metadata: c
        }, null, e);
        __esDecorate(t, null, o, {
            kind: "method",
            name: "error",
            static: false,
            private: false,
            access: {
                has: t => "error" in t,
                get: t => t.error
            },
            metadata: c
        }, null, e);
        __esDecorate(t, null, l, {
            kind: "method",
            name: "fatal",
            static: false,
            private: false,
            access: {
                has: t => "fatal" in t,
                get: t => t.fatal
            },
            metadata: c
        }, null, e);
        if (c) Object.defineProperty(t, Symbol.metadata, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: c
        });
    })(), t;
})();

const ft = /*@__PURE__*/ toLookup({
    create({level: t = X, colorOptions: e = "no-colors", sinks: n = []} = {}) {
        return toLookup({
            register(r) {
                r.register(instanceRegistration(nt, new LogConfig(e, t)));
                for (const t of n) {
                    if (isFunction(t)) {
                        r.register(singletonRegistration(rt, t));
                    } else {
                        r.register(t);
                    }
                }
                return r;
            }
        });
    }
});

const ht = /*@__PURE__*/ createInterface((t => t.singleton(ModuleLoader)));

const noTransform = t => t;

class ModuleTransformer {
    constructor(t) {
        this.B = new Map;
        this.U = new Map;
        this.H = t;
    }
    transform(t) {
        if (t instanceof Promise) {
            return this.V(t);
        } else if (typeof t === "object" && t !== null) {
            return this.q(t);
        } else {
            throw createMappedError(21, t);
        }
    }
    V(t) {
        if (this.B.has(t)) {
            return this.B.get(t);
        }
        const e = t.then((t => this.q(t)));
        this.B.set(t, e);
        void e.then((e => {
            this.B.set(t, e);
        }));
        return e;
    }
    q(t) {
        if (this.U.has(t)) {
            return this.U.get(t);
        }
        const e = this.H(this.J(t));
        this.U.set(t, e);
        if (e instanceof Promise) {
            void e.then((e => {
                this.U.set(t, e);
            }));
        }
        return e;
    }
    J(t) {
        if (t == null) throw createMappedError(21, t);
        if (typeof t !== "object") return new AnalyzedModule(t, []);
        let e;
        let n;
        let r;
        let s;
        const i = [];
        for (const l in t) {
            switch (typeof (e = t[l])) {
              case "object":
                if (e === null) {
                    continue;
                }
                n = isFunction(e.register);
                r = false;
                s = null;
                break;

              case "function":
                n = isFunction(e.register);
                r = e.prototype !== void 0;
                s = o(p, e) ?? null;
                break;

              default:
                continue;
            }
            i.push(new ModuleItem(l, e, n, r, s));
        }
        return new AnalyzedModule(t, i);
    }
}

class ModuleLoader {
    constructor() {
        this.transformers = new Map;
    }
    load(t, e = noTransform) {
        const n = this.transformers;
        let r = n.get(e);
        if (r === void 0) {
            n.set(e, r = new ModuleTransformer(e));
        }
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
        this.definition = s;
    }
}

const aliasedResourcesRegistry = (t, e, n = {}) => ({
    register(r) {
        const s = r.get(ht).load(t);
        let i = false;
        s.items.forEach((t => {
            const s = t.definition;
            if (s == null) {
                r.register(t.value);
                return;
            }
            if (!i && e != null) {
                i = true;
                s.register(r, e);
                return;
            }
            const o = n[s.name];
            s.register(r, o);
        }));
    }
});

class Handler {
    constructor(t, e) {
        this.type = t;
        this.cb = e;
    }
    handle(t) {
        if (t instanceof this.type) {
            this.cb.call(null, t);
        }
    }
}

const dt = /*@__PURE__*/ createInterface("IEventAggregator", (t => t.singleton(EventAggregator)));

class EventAggregator {
    constructor() {
        this.eventLookup = {};
        this.messageHandlers = [];
    }
    publish(t, e) {
        if (!t) {
            throw createMappedError(18, t);
        }
        if (isString(t)) {
            let n = this.eventLookup[t];
            if (n !== void 0) {
                n = n.slice();
                let r = n.length;
                while (r-- > 0) {
                    n[r](e, t);
                }
            }
        } else {
            const e = this.messageHandlers.slice();
            let n = e.length;
            while (n-- > 0) {
                e[n].handle(t);
            }
        }
    }
    subscribe(t, e) {
        if (!t) {
            throw createMappedError(19, t);
        }
        let n;
        let r;
        if (isString(t)) {
            if (this.eventLookup[t] === void 0) {
                this.eventLookup[t] = [];
            }
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
                if (t !== -1) {
                    r.splice(t, 1);
                }
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

export { AnalyzedModule, ConsoleSink, ContainerConfiguration, L as DI, DefaultLogEvent, DefaultLogEventFactory, ut as DefaultLogger, C as DefaultResolver, EventAggregator, A as IContainer, dt as IEventAggregator, nt as ILogConfig, st as ILogEventFactory, it as ILogger, ht as IModuleLoader, S as IPlatform, F as IServiceLocator, rt as ISink, InstanceProvider, LogConfig, et as LogLevel, ft as LoggerConfiguration, ModuleItem, R as Protocol, $ as Registrable, w as Registration, aliasedResourcesRegistry, all, Q as allResources, bound, u as camelCase, createImplementationRegister, createResolver, M as emptyArray, T as emptyObject, W as factory, firstDefined, ct as format, fromAnnotationOrDefinitionOrTypeOrDefault, fromAnnotationOrTypeOrDefault, fromDefinitionOrDefault, d as getPrototypeChain, getResourceKeyFor, N as ignore, inject, c as isArrayIndex, v as isNativeFunction, h as kebabCase, P as lazy, mergeArrays, U as newInstanceForScope, x as newInstanceOf, noop, onResolve, onResolveAll, K as optional, B as optionalResource, z as own, f as pascalCase, resolve, G as resource, p as resourceBaseName, singleton, sink, toArray, transient };
//# sourceMappingURL=index.mjs.map
