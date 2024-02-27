import { Metadata as t, isObject as e, applyMetadataPolyfill as n } from "@aurelia/metadata";

const r = Object.freeze;

const s = String;

const o = t.getOwn;

const i = t.hasOwn;

const l = t.define;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const createObject = () => Object.create(null);

const createMappedError = (t, ...e) => new Error(`AUR${s(t).padStart(4, "0")}:${e.map(s)}`);

const c = {};

const isArrayIndex = t => {
    switch (typeof t) {
      case "number":
        return t >= 0 && (t | 0) === t;

      case "string":
        {
            const e = c[t];
            if (e !== void 0) {
                return e;
            }
            const n = t.length;
            if (n === 0) {
                return c[t] = false;
            }
            let r = 0;
            let s = 0;
            for (;s < n; ++s) {
                r = charCodeAt(t, s);
                if (s === 0 && r === 48 && n > 1 || r < 48 || r > 57) {
                    return c[t] = false;
                }
            }
            return c[t] = true;
        }

      default:
        return false;
    }
};

const u = /*@__PURE__*/ function() {
    const t = Object.assign(createObject(), {
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
        let o;
        let i = "";
        let l = 0;
        let c = t.charAt(0);
        let u = charToKind(c);
        let a = 0;
        for (;a < n; ++a) {
            o = l;
            i = c;
            l = u;
            c = t.charAt(a + 1);
            u = charToKind(c);
            if (l === 0) {
                if (s.length > 0) {
                    r = true;
                }
            } else {
                if (!r && s.length > 0 && l === 2) {
                    r = o === 3 || u === 3;
                }
                s += e(i, r);
                r = false;
            }
        }
        return s;
    };
}();

const a = /*@__PURE__*/ function() {
    const t = createObject();
    const callback = (t, e) => e ? t.toUpperCase() : t.toLowerCase();
    return e => {
        let n = t[e];
        if (n === void 0) {
            n = t[e] = u(e, callback);
        }
        return n;
    };
}();

const f = /*@__PURE__*/ function() {
    const t = createObject();
    return e => {
        let n = t[e];
        if (n === void 0) {
            n = a(e);
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
            n = t[e] = u(e, callback);
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

const bound = (t, e, n) => ({
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

const mergeArrays = (...t) => {
    const e = [];
    let n = 0;
    const r = t.length;
    let s = 0;
    let o;
    let i = 0;
    for (;i < r; ++i) {
        o = t[i];
        if (o !== void 0) {
            s = o.length;
            let t = 0;
            for (;t < s; ++t) {
                e[n++] = o[t];
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
    let o = void 0;
    return function(i) {
        o = n.get(i);
        if (o === void 0) {
            n.set(i, o = [ r = i ]);
            s = 0;
            while ((r = e(r)) !== t) {
                o[++s] = r;
            }
        }
        return o;
    };
}();

function toLookup(...t) {
    return Object.assign(createObject(), ...t);
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
            e = r >= 29 && r <= 100 && charCodeAt(n, r - 1) === 125 && charCodeAt(n, r - 2) <= 32 && charCodeAt(n, r - 3) === 93 && charCodeAt(n, r - 4) === 101 && charCodeAt(n, r - 5) === 100 && charCodeAt(n, r - 6) === 111 && charCodeAt(n, r - 7) === 99 && charCodeAt(n, r - 8) === 32 && charCodeAt(n, r - 9) === 101 && charCodeAt(n, r - 10) === 118 && charCodeAt(n, r - 11) === 105 && charCodeAt(n, r - 12) === 116 && charCodeAt(n, r - 13) === 97 && charCodeAt(n, r - 14) === 110 && charCodeAt(n, r - 15) === 88;
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
    let o = t.length;
    for (;s < o; ++s) {
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

const g = "au:annotation";

const getAnnotationKeyFor = (t, e) => {
    if (e === void 0) {
        return `${g}:${t}`;
    }
    return `${g}:${t}:${e}`;
};

const appendAnnotation = (t, e) => {
    const n = o(g, t);
    if (n === void 0) {
        l(g, [ e ], t);
    } else {
        n.push(e);
    }
};

const w = /*@__PURE__*/ r({
    name: "au:annotation",
    appendTo: appendAnnotation,
    set(t, e, n) {
        l(getAnnotationKeyFor(e), n, t);
    },
    get: (t, e) => o(getAnnotationKeyFor(e), t),
    getKeys(t) {
        let e = o(g, t);
        if (e === void 0) {
            l(g, e = [], t);
        }
        return e;
    },
    isKey: t => t.startsWith(g),
    keyFor: getAnnotationKeyFor
});

const y = "au:resource";

const hasResources = t => i(y, t);

const getAllResources = t => {
    const e = o(y, t);
    if (e === void 0) {
        return G;
    } else {
        return e.map((e => o(e, t)));
    }
};

const m = /*@__PURE__*/ r({
    name: y,
    appendTo(t, e) {
        const n = o(y, t);
        if (n === void 0) {
            l(y, [ e ], t);
        } else {
            n.push(e);
        }
    },
    has: hasResources,
    getAll: getAllResources,
    getKeys(t) {
        let e = o(y, t);
        if (e === void 0) {
            l(y, e = [], t);
        }
        return e;
    },
    isKey: t => t.startsWith(y),
    keyFor(t, e) {
        if (e === void 0) {
            return `${y}:${t}`;
        }
        return `${y}:${t}:${e}`;
    }
});

const p = {
    annotation: w,
    resource: m
};

const R = Object.prototype.hasOwnProperty;

function fromAnnotationOrDefinitionOrTypeOrDefault(t, e, n, r) {
    let s = o(getAnnotationKeyFor(t), n);
    if (s === void 0) {
        s = e[t];
        if (s === void 0) {
            s = n[t];
            if (s === void 0 || !R.call(n, t)) {
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
        if (r === void 0 || !R.call(e, t)) {
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

const C = new Set("Array ArrayBuffer Boolean DataView Date Error EvalError Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Number Object Promise RangeError ReferenceError RegExp Set SharedArrayBuffer String SyntaxError TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array URIError WeakMap WeakSet".split(" "));

let b = 0;

let D = null;

class Container {
    get depth() {
        return this.t === null ? 0 : this.t.depth + 1;
    }
    get parent() {
        return this.t;
    }
    constructor(t, e) {
        this.id = ++b;
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
        this.h.set(k, L);
    }
    register(...t) {
        if (++this.i === 100) {
            throw createMappedError(6, ...t);
        }
        let n;
        let r;
        let s;
        let o;
        let i;
        let l = 0;
        let c = t.length;
        for (;l < c; ++l) {
            n = t[l];
            if (!e(n)) {
                continue;
            }
            if (isRegistry(n)) {
                n.register(this);
            } else if (hasResources(n)) {
                const t = getAllResources(n);
                if (t.length === 1) {
                    t[0].register(this);
                } else {
                    o = 0;
                    i = t.length;
                    while (i > o) {
                        t[o].register(this);
                        ++o;
                    }
                }
            } else if (isClass(n)) {
                S.singleton(n, n).register(this);
            } else {
                r = Object.keys(n);
                o = 0;
                i = r.length;
                for (;o < i; ++o) {
                    s = n[r[o]];
                    if (!e(s)) {
                        continue;
                    }
                    if (isRegistry(s)) {
                        s.register(this);
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
        } else if (s instanceof Resolver && s.C === 4) {
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
        const n = D;
        let r = D = this;
        let s;
        let o;
        try {
            while (r != null) {
                s = r.h.get(t);
                if (s == null) {
                    if (r.t == null) {
                        o = isRegisterInRequester(t) ? this : r;
                        if (e) {
                            return this.L(t, o);
                        }
                        return null;
                    }
                    r = r.t;
                } else {
                    return s;
                }
            }
        } finally {
            D = n;
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
        const e = D;
        let n = D = this;
        let r;
        let s;
        try {
            while (n != null) {
                r = n.h.get(t);
                if (r == null) {
                    if (n.t == null) {
                        s = isRegisterInRequester(t) ? this : n;
                        r = this.L(t, s);
                        return r.resolve(n, this);
                    }
                    n = n.t;
                } else {
                    return r.resolve(n, this);
                }
            }
        } finally {
            D = e;
        }
        throw createMappedError(8, t);
    }
    getAll(t, e = false) {
        validateKey(t);
        const n = D;
        const r = D = this;
        let s = r;
        let o;
        let i = G;
        try {
            if (e) {
                while (s != null) {
                    o = s.h.get(t);
                    if (o != null) {
                        i = i.concat(buildAllResponse(o, s, r));
                    }
                    s = s.t;
                }
                return i;
            }
            while (s != null) {
                o = s.h.get(t);
                if (o == null) {
                    s = s.t;
                    if (s == null) {
                        return G;
                    }
                } else {
                    return buildAllResponse(o, s, r);
                }
            }
        } finally {
            D = n;
        }
        return G;
    }
    invoke(t, e) {
        const n = D;
        D = this;
        try {
            if (v(t)) {
                throw createMappedError(15, t);
            }
            return e === void 0 ? new t(...getDependencies(t).map(containerGetKey, this)) : new t(...getDependencies(t).map(containerGetKey, this), ...e);
        } finally {
            D = n;
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
            n.dispose();
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
        const n = t.keyFrom(e);
        let r = this.res[n];
        if (r === void 0) {
            r = this.root.res[n];
            if (r === void 0) {
                return null;
            }
        }
        if (r === null) {
            return null;
        }
        if (isFunction(r.getFactory)) {
            const e = r.getFactory(this);
            if (e === null || e === void 0) {
                return null;
            }
            const n = o(t.name, e.Type);
            if (n === void 0) {
                return null;
            }
            return n;
        }
        return null;
    }
    create(t, e) {
        const n = t.keyFrom(e);
        let r = this.res[n];
        if (r === void 0) {
            r = this.root.res[n];
            if (r === void 0) {
                return null;
            }
            return r.resolve(this.root, this) ?? null;
        }
        return r.resolve(this, this) ?? null;
    }
    dispose() {
        if (this.u.size > 0) {
            this.disposeResolvers();
        }
        this.h.clear();
    }
    L(t, e) {
        if (!isFunction(t)) {
            throw createMappedError(9, t);
        }
        if (C.has(t.name)) {
            throw createMappedError(10, t);
        }
        if (isRegistry(t)) {
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
        const n = this.config.defaultResolver(t, e);
        e.h.set(t, n);
        return n;
    }
}

class Factory {
    constructor(t, e) {
        this.Type = t;
        this.dependencies = e;
        this.transformers = null;
    }
    construct(t, e) {
        const n = D;
        D = t;
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
            D = n;
        }
    }
    registerTransformer(t) {
        (this.transformers ?? (this.transformers = [])).push(t);
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
    if (D == null) {
        throw createMappedError(16, ...t);
    }
    return t.length === 1 ? D.get(t[0]) : t.map(containerGetKey, D);
}

const buildAllResponse = (t, e, n) => {
    if (t instanceof Resolver && t.C === 4) {
        const r = t._state;
        const s = r.length;
        const o = Array(s);
        let i = 0;
        for (;i < s; ++i) {
            o[i] = r[i].resolve(e, n);
        }
        return o;
    }
    return [ t.resolve(e, n) ];
};

const L = {
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

const instanceRegistration = (t, e) => new Resolver(t, 0, e);

const singletonRegistration = (t, e) => new Resolver(t, 1, e);

const transientRegistation = (t, e) => new Resolver(t, 2, e);

const callbackRegistration = (t, e) => new Resolver(t, 3, e);

const cachedCallbackRegistration = (t, e) => new Resolver(t, 3, cacheCallbackResult(e));

const aliasToRegistration = (t, e) => new Resolver(e, 5, t);

const deferRegistration = (t, ...e) => new ParameterizedRegistry(t, e);

const $ = new WeakMap;

const cacheCallbackResult = t => (e, n, r) => {
    let s = $.get(e);
    if (s === void 0) {
        $.set(e, s = new WeakMap);
    }
    if (s.has(r)) {
        return s.get(r);
    }
    const o = t(e, n, r);
    s.set(r, o);
    return o;
};

n(Reflect, false, false);

class ResolverBuilder {
    constructor(t, e) {
        this.c = t;
        this.k = e;
    }
    instance(t) {
        return this.$(0, t);
    }
    singleton(t) {
        return this.$(1, t);
    }
    transient(t) {
        return this.$(2, t);
    }
    callback(t) {
        return this.$(3, t);
    }
    cachedCallback(t) {
        return this.$(3, cacheCallbackResult(t));
    }
    aliasTo(t) {
        return this.$(5, t);
    }
    $(t, e) {
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
    for (let o = 0; o < r; ++o) {
        s = n[o];
        if (!isArrayIndex(s)) {
            e[s] = t[s];
        }
    }
    return e;
};

const O = {
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
        return new ContainerConfiguration(t.inheritParentResources ?? false, t.defaultResolver ?? O.singleton);
    }
}

ContainerConfiguration.DEFAULT = ContainerConfiguration.from({});

const createContainer = t => new Container(null, ContainerConfiguration.from(t));

const getAnnotationParamtypes = t => {
    const e = getAnnotationKeyFor("di:paramtypes");
    return o(e, t);
};

const getDesignParamtypes = t => o("design:paramtypes", t);

const getOrCreateAnnotationParamTypes = t => {
    const e = getAnnotationKeyFor("di:paramtypes");
    let n = o(e, t);
    if (n === void 0) {
        l(e, n = [], t);
        appendAnnotation(t, e);
    }
    return n;
};

const getDependencies = t => {
    const e = getAnnotationKeyFor("di:dependencies");
    let n = o(e, t);
    if (n === void 0) {
        const r = t.inject;
        if (r === void 0) {
            const e = A.getDesignParamtypes(t);
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
                let o = 0;
                for (;o < t; ++o) {
                    s = r[o];
                    if (s !== void 0) {
                        n[o] = s;
                    }
                }
                const i = Object.keys(r);
                let l;
                o = 0;
                t = i.length;
                for (o = 0; o < t; ++o) {
                    l = i[o];
                    if (!isArrayIndex(l)) {
                        n[l] = r[l];
                    }
                }
            }
        } else {
            n = cloneArrayWithPossibleProps(r);
        }
        l(e, n, t);
        appendAnnotation(t, e);
    }
    return n;
};

const createInterface = (t, e) => {
    const n = isFunction(t) ? t : e;
    const r = (isString(t) ? t : undefined) ?? "(anonymous)";
    const Interface = function(t, e, n) {
        if (t == null || new.target !== undefined) {
            throw createMappedError(1, r);
        }
        const s = getOrCreateAnnotationParamTypes(t);
        s[n] = Interface;
    };
    Interface.$isInterface = true;
    Interface.friendlyName = r;
    if (n != null) {
        Interface.register = (t, e) => n(new ResolverBuilder(t, e ?? Interface));
    }
    Interface.toString = () => `InterfaceSymbol<${r}>`;
    return Interface;
};

const A = {
    createContainer: createContainer,
    getDesignParamtypes: getDesignParamtypes,
    getAnnotationParamtypes: getAnnotationParamtypes,
    getOrCreateAnnotationParamTypes: getOrCreateAnnotationParamTypes,
    getDependencies: getDependencies,
    createInterface: createInterface,
    inject(...t) {
        return (e, n, r) => {
            if (typeof r === "number") {
                const n = getOrCreateAnnotationParamTypes(e);
                const s = t[0];
                if (s !== void 0) {
                    n[r] = s;
                }
            } else if (n) {
                const r = getOrCreateAnnotationParamTypes(e.constructor);
                const s = t[0];
                if (s !== void 0) {
                    r[n] = s;
                }
            } else if (r) {
                const e = r.value;
                const n = getOrCreateAnnotationParamTypes(e);
                let s;
                let o = 0;
                for (;o < t.length; ++o) {
                    s = t[o];
                    if (s !== void 0) {
                        n[o] = s;
                    }
                }
            } else {
                const n = getOrCreateAnnotationParamTypes(e);
                let r;
                let s = 0;
                for (;s < t.length; ++s) {
                    r = t[s];
                    if (r !== void 0) {
                        n[s] = r;
                    }
                }
            }
        };
    },
    transient(t) {
        t.register = function(e) {
            const n = S.transient(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = F) {
        t.register = function(e) {
            const n = S.singleton(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

const k = /*@__PURE__*/ createInterface("IContainer");

const E = k;

function createResolver(t) {
    return function(e) {
        function Resolver(t, e, n) {
            I(Resolver)(t, e, n);
        }
        Resolver.$isResolver = true;
        Resolver.resolve = function(n, r) {
            return t(e, n, r);
        };
        return Resolver;
    };
}

const I = A.inject;

function transientDecorator(t) {
    return A.transient(t);
}

function transient(t) {
    return t == null ? transientDecorator : transientDecorator(t);
}

const F = {
    scoped: false
};

const M = A.singleton;

function singleton(t) {
    if (isFunction(t)) {
        return M(t);
    }
    return function(e) {
        return M(e, t);
    };
}

const all = (t, e = false) => {
    function resolver(t, e, n) {
        I(resolver)(t, e, n);
    }
    resolver.$isResolver = true;
    resolver.resolve = (n, r) => r.getAll(t, e);
    return resolver;
};

const T = /*@__PURE__*/ createResolver(((t, e, n) => () => n.get(t)));

const j = /*@__PURE__*/ createResolver(((t, e, n) => {
    if (n.has(t, true)) {
        return n.get(t);
    } else {
        return undefined;
    }
}));

const ignore = (t, e, n) => {
    I(ignore)(t, e, n);
};

ignore.$isResolver = true;

ignore.resolve = () => undefined;

const _ = /*@__PURE__*/ createResolver(((t, e, n) => (...r) => e.getFactory(t).construct(n, r)));

const P = /*@__PURE__*/ createResolver(((t, e, n) => {
    const r = createNewInstance(t, e, n);
    const o = new InstanceProvider(s(t), r);
    n.registerResolver(t, o, true);
    return r;
}));

const K = /*@__PURE__*/ createResolver(((t, e, n) => createNewInstance(t, e, n)));

const createNewInstance = (t, e, n) => {
    if (e.hasFactory(t)) {
        return e.getFactory(t).construct(n);
    }
    if (isInterface(t)) {
        const r = isFunction(t.register);
        const s = e.getResolver(t, false);
        let o;
        if (s == null) {
            if (r) {
                o = createContainer().getResolver(t, true)?.getFactory?.(e);
            }
        } else {
            o = s.getFactory?.(e);
        }
        if (o != null) {
            return o.construct(n);
        }
        throw createMappedError(17, t);
    }
    return e.getFactory(t).construct(n);
};

class Resolver {
    constructor(t, e, n) {
        this.resolving = false;
        this.k = t;
        this.C = e;
        this._state = n;
    }
    get $isResolver() {
        return true;
    }
    register(t, e) {
        return t.registerResolver(e || this.k, this);
    }
    resolve(t, e) {
        switch (this.C) {
          case 0:
            return this._state;

          case 1:
            {
                if (this.resolving) {
                    throw createMappedError(3, this._state.name);
                }
                this.resolving = true;
                this._state = t.getFactory(this._state).construct(e);
                this.C = 0;
                this.resolving = false;
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
            throw createMappedError(5, this.C);
        }
    }
    getFactory(t) {
        switch (this.C) {
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

const S = {
    instance: instanceRegistration,
    singleton: singletonRegistration,
    transient: transientRegistation,
    callback: callbackRegistration,
    cachedCallback: cachedCallbackRegistration,
    aliasTo: aliasToRegistration,
    defer: deferRegistration
};

class InstanceProvider {
    get friendlyName() {
        return this.O;
    }
    constructor(t, e) {
        this.A = null;
        this.O = t;
        if (e !== void 0) {
            this.A = e;
        }
    }
    prepare(t) {
        this.A = t;
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        if (this.A == null) {
            throw createMappedError(13, this.O);
        }
        return this.A;
    }
    dispose() {
        this.A = null;
    }
}

const isInterface = t => isFunction(t) && t.$isInterface === true;

const G = r([]);

const N = r({});

function noop() {}

const W = /*@__PURE__*/ createInterface("IPlatform");

function __decorate(t, e, n, r) {
    var s = arguments.length, o = s < 3 ? e : r === null ? r = Object.getOwnPropertyDescriptor(e, n) : r, i;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") o = Reflect.decorate(t, e, n, r); else for (var l = t.length - 1; l >= 0; l--) if (i = t[l]) o = (s < 3 ? i(o) : s > 3 ? i(e, n, o) : i(e, n)) || o;
    return s > 3 && o && Object.defineProperty(e, n, o), o;
}

const B = 0;

const z = 1;

const Q = 2;

const U = 3;

const x = 4;

const H = 5;

const V = 6;

const q = r({
    trace: B,
    debug: z,
    info: Q,
    warn: U,
    error: x,
    fatal: H,
    none: V
});

const J = /*@__PURE__*/ createInterface("ILogConfig", (t => t.instance(new LogConfig("no-colors", U))));

const X = /*@__PURE__*/ createInterface("ISink");

const Y = /*@__PURE__*/ createInterface("ILogEventFactory", (t => t.singleton(DefaultLogEventFactory)));

const Z = /*@__PURE__*/ createInterface("ILogger", (t => t.singleton(DefaultLogger)));

const tt = /*@__PURE__*/ createInterface("ILogScope");

const et = /*@__PURE__*/ r({
    key: getAnnotationKeyFor("logger-sink-handles"),
    define(t, e) {
        l(this.key, e.handles, t.prototype);
        return t;
    },
    getHandles(e) {
        return t.get(this.key, e);
    }
});

const sink = t => e => et.define(e, t);

const nt = toLookup({
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

const rt = function() {
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
            TRC: nt.grey("TRC"),
            DBG: nt.grey("DBG"),
            INF: nt.white("INF"),
            WRN: nt.yellow("WRN"),
            ERR: nt.red("ERR"),
            FTL: nt.red("FTL"),
            QQQ: nt.grey("???")
        })
    };
    return (e, n) => {
        if (e <= B) {
            return t[n].TRC;
        }
        if (e <= z) {
            return t[n].DBG;
        }
        if (e <= Q) {
            return t[n].INF;
        }
        if (e <= U) {
            return t[n].WRN;
        }
        if (e <= x) {
            return t[n].ERR;
        }
        if (e <= H) {
            return t[n].FTL;
        }
        return t[n].QQQ;
    };
}();

const getScopeString = (t, e) => {
    if (e === "no-colors") {
        return t.join(".");
    }
    return t.map(nt.cyan).join(".");
};

const getIsoString = (t, e) => {
    if (e === "no-colors") {
        return new Date(t).toISOString();
    }
    return nt.grey(new Date(t).toISOString());
};

class DefaultLogEvent {
    constructor(t, e, n, r, s, o) {
        this.severity = t;
        this.message = e;
        this.optionalParams = n;
        this.scope = r;
        this.colorOptions = s;
        this.timestamp = o;
    }
    toString() {
        const {severity: t, message: e, scope: n, colorOptions: r, timestamp: s} = this;
        if (n.length === 0) {
            return `${getIsoString(s, r)} [${rt(t, r)}] ${e}`;
        }
        return `${getIsoString(s, r)} [${rt(t, r)} ${getScopeString(n, r)}] ${e}`;
    }
    getFormattedLogInfo(t = false) {
        const {severity: e, message: n, scope: r, colorOptions: s, timestamp: o, optionalParams: i} = this;
        let l = null;
        let c = "";
        if (t && n instanceof Error) {
            l = n;
        } else {
            c = n;
        }
        const u = r.length === 0 ? "" : ` ${getScopeString(r, s)}`;
        let a = `${getIsoString(o, s)} [${rt(e, s)}${u}] ${c}`;
        if (i === void 0 || i.length === 0) {
            return l === null ? [ a ] : [ a, l ];
        }
        let f = 0;
        while (a.includes("%s")) {
            a = a.replace("%s", String(i[f++]));
        }
        return l !== null ? [ a, l, ...i.slice(f) ] : [ a, ...i.slice(f) ];
    }
}

class DefaultLogEventFactory {
    constructor() {
        this.config = resolve(J);
    }
    createLogEvent(t, e, n, r) {
        return new DefaultLogEvent(e, n, r, t.scope, this.config.colorOptions, Date.now());
    }
}

class ConsoleSink {
    static register(t) {
        singletonRegistration(X, ConsoleSink).register(t);
    }
    constructor(t = resolve(W)) {
        const e = t.console;
        this.handleEvent = function emit(t) {
            const n = t.getFormattedLogInfo(true);
            switch (t.severity) {
              case B:
              case z:
                return e.debug(...n);

              case Q:
                return e.info(...n);

              case U:
                return e.warn(...n);

              case x:
              case H:
                return e.error(...n);
            }
        };
    }
}

class DefaultLogger {
    constructor(t = resolve(J), e = resolve(Y), n = resolve(all(X)), r = resolve(j(tt)) ?? [], s = null) {
        this.scope = r;
        this.I = createObject();
        let o;
        let i;
        let l;
        let c;
        let u;
        let a;
        this.config = t;
        this.f = e;
        this.sinks = n;
        if (s === null) {
            this.root = this;
            this.parent = this;
            o = this.F = [];
            i = this.M = [];
            l = this.T = [];
            c = this.j = [];
            u = this._ = [];
            a = this.P = [];
            for (const t of n) {
                const e = et.getHandles(t);
                if (e?.includes(B) ?? true) {
                    o.push(t);
                }
                if (e?.includes(z) ?? true) {
                    i.push(t);
                }
                if (e?.includes(Q) ?? true) {
                    l.push(t);
                }
                if (e?.includes(U) ?? true) {
                    c.push(t);
                }
                if (e?.includes(x) ?? true) {
                    u.push(t);
                }
                if (e?.includes(H) ?? true) {
                    a.push(t);
                }
            }
        } else {
            this.root = s.root;
            this.parent = s;
            o = this.F = s.F;
            i = this.M = s.M;
            l = this.T = s.T;
            c = this.j = s.j;
            u = this._ = s._;
            a = this.P = s.P;
        }
    }
    trace(t, ...e) {
        if (this.config.level <= B) {
            this.K(this.F, B, t, e);
        }
    }
    debug(t, ...e) {
        if (this.config.level <= z) {
            this.K(this.M, z, t, e);
        }
    }
    info(t, ...e) {
        if (this.config.level <= Q) {
            this.K(this.T, Q, t, e);
        }
    }
    warn(t, ...e) {
        if (this.config.level <= U) {
            this.K(this.j, U, t, e);
        }
    }
    error(t, ...e) {
        if (this.config.level <= x) {
            this.K(this._, x, t, e);
        }
    }
    fatal(t, ...e) {
        if (this.config.level <= H) {
            this.K(this.P, H, t, e);
        }
    }
    scopeTo(t) {
        const e = this.I;
        let n = e[t];
        if (n === void 0) {
            n = e[t] = new DefaultLogger(this.config, this.f, null, this.scope.concat(t), this);
        }
        return n;
    }
    K(t, e, n, r) {
        const s = isFunction(n) ? n() : n;
        const o = this.f.createLogEvent(this, e, s, r);
        for (let e = 0, n = t.length; e < n; ++e) {
            t[e].handleEvent(o);
        }
    }
}

__decorate([ bound ], DefaultLogger.prototype, "trace", null);

__decorate([ bound ], DefaultLogger.prototype, "debug", null);

__decorate([ bound ], DefaultLogger.prototype, "info", null);

__decorate([ bound ], DefaultLogger.prototype, "warn", null);

__decorate([ bound ], DefaultLogger.prototype, "error", null);

__decorate([ bound ], DefaultLogger.prototype, "fatal", null);

const st = /*@__PURE__*/ toLookup({
    create({level: t = U, colorOptions: e = "no-colors", sinks: n = []} = {}) {
        return toLookup({
            register(r) {
                r.register(instanceRegistration(J, new LogConfig(e, t)));
                for (const t of n) {
                    if (isFunction(t)) {
                        r.register(singletonRegistration(X, t));
                    } else {
                        r.register(t);
                    }
                }
                return r;
            }
        });
    }
});

const ot = /*@__PURE__*/ createInterface((t => t.singleton(ModuleLoader)));

const noTransform = t => t;

class ModuleTransformer {
    constructor(t) {
        this.G = new Map;
        this.N = new Map;
        this.W = t;
    }
    transform(t) {
        if (t instanceof Promise) {
            return this.B(t);
        } else if (typeof t === "object" && t !== null) {
            return this.U(t);
        } else {
            throw createMappedError(21, t);
        }
    }
    B(t) {
        if (this.G.has(t)) {
            return this.G.get(t);
        }
        const e = t.then((t => this.U(t)));
        this.G.set(t, e);
        void e.then((e => {
            this.G.set(t, e);
        }));
        return e;
    }
    U(t) {
        if (this.N.has(t)) {
            return this.N.get(t);
        }
        const e = this.W(this.H(t));
        this.N.set(t, e);
        if (e instanceof Promise) {
            void e.then((e => {
                this.N.set(t, e);
            }));
        }
        return e;
    }
    H(t) {
        if (t == null) throw createMappedError(21, t);
        if (typeof t !== "object") return new AnalyzedModule(t, []);
        let e;
        let n;
        let r;
        let s;
        const o = [];
        for (const i in t) {
            switch (typeof (e = t[i])) {
              case "object":
                if (e === null) {
                    continue;
                }
                n = isFunction(e.register);
                r = false;
                s = G;
                break;

              case "function":
                n = isFunction(e.register);
                r = e.prototype !== void 0;
                s = getAllResources(e);
                break;

              default:
                continue;
            }
            o.push(new ModuleItem(i, e, n, r, s));
        }
        return new AnalyzedModule(t, o);
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
        this.definitions = s;
    }
}

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

const it = /*@__PURE__*/ createInterface("IEventAggregator", (t => t.singleton(EventAggregator)));

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

export { AnalyzedModule, ConsoleSink, ContainerConfiguration, A as DI, DefaultLogEvent, DefaultLogEventFactory, DefaultLogger, O as DefaultResolver, EventAggregator, k as IContainer, it as IEventAggregator, J as ILogConfig, Y as ILogEventFactory, Z as ILogger, ot as IModuleLoader, W as IPlatform, E as IServiceLocator, X as ISink, InstanceProvider, LogConfig, q as LogLevel, st as LoggerConfiguration, ModuleItem, p as Protocol, S as Registration, all, bound, a as camelCase, createResolver, G as emptyArray, N as emptyObject, _ as factory, firstDefined, nt as format, fromAnnotationOrDefinitionOrTypeOrDefault, fromAnnotationOrTypeOrDefault, fromDefinitionOrDefault, d as getPrototypeChain, ignore, I as inject, isArrayIndex, v as isNativeFunction, h as kebabCase, T as lazy, mergeArrays, P as newInstanceForScope, K as newInstanceOf, noop, onResolve, onResolveAll, j as optional, f as pascalCase, resolve, singleton, sink, toArray, transient };
//# sourceMappingURL=index.mjs.map
