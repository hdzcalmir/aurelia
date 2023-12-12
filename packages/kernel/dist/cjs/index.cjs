"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/metadata");

const e = String;

const r = t.Metadata.getOwn;

const n = t.Metadata.hasOwn;

const s = t.Metadata.define;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const createObject = () => Object.create(null);

const createMappedError = (t, ...r) => new Error(`AUR${e(t).padStart(4, "0")}:${r.map(e)}`);

const o = {};

const isArrayIndex = t => {
    switch (typeof t) {
      case "number":
        return t >= 0 && (t | 0) === t;

      case "string":
        {
            const e = o[t];
            if (e !== void 0) {
                return e;
            }
            const r = t.length;
            if (r === 0) {
                return o[t] = false;
            }
            let n = 0;
            let s = 0;
            for (;s < r; ++s) {
                n = charCodeAt(t, s);
                if (s === 0 && n === 48 && r > 1 || n < 48 || n > 57) {
                    return o[t] = false;
                }
            }
            return o[t] = true;
        }

      default:
        return false;
    }
};

const i = /*@__PURE__*/ function() {
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
        const r = t.length;
        if (r === 0) {
            return t;
        }
        let n = false;
        let s = "";
        let o;
        let i = "";
        let l = 0;
        let u = t.charAt(0);
        let c = charToKind(u);
        let a = 0;
        for (;a < r; ++a) {
            o = l;
            i = u;
            l = c;
            u = t.charAt(a + 1);
            c = charToKind(u);
            if (l === 0) {
                if (s.length > 0) {
                    n = true;
                }
            } else {
                if (!n && s.length > 0 && l === 2) {
                    n = o === 3 || c === 3;
                }
                s += e(i, n);
                n = false;
            }
        }
        return s;
    };
}();

const l = /*@__PURE__*/ function() {
    const t = createObject();
    const callback = (t, e) => e ? t.toUpperCase() : t.toLowerCase();
    return e => {
        let r = t[e];
        if (r === void 0) {
            r = t[e] = i(e, callback);
        }
        return r;
    };
}();

const u = /*@__PURE__*/ function() {
    const t = createObject();
    return e => {
        let r = t[e];
        if (r === void 0) {
            r = l(e);
            if (r.length > 0) {
                r = r[0].toUpperCase() + r.slice(1);
            }
            t[e] = r;
        }
        return r;
    };
}();

const c = /*@__PURE__*/ function() {
    const t = createObject();
    const callback = (t, e) => e ? `-${t.toLowerCase()}` : t.toLowerCase();
    return e => {
        let r = t[e];
        if (r === void 0) {
            r = t[e] = i(e, callback);
        }
        return r;
    };
}();

const toArray = t => {
    const e = t.length;
    const r = Array(e);
    let n = 0;
    for (;n < e; ++n) {
        r[n] = t[n];
    }
    return r;
};

const bound = (t, e, r) => ({
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

const mergeArrays = (...t) => {
    const e = [];
    let r = 0;
    const n = t.length;
    let s = 0;
    let o;
    let i = 0;
    for (;i < n; ++i) {
        o = t[i];
        if (o !== void 0) {
            s = o.length;
            let t = 0;
            for (;t < s; ++t) {
                e[r++] = o[t];
            }
        }
    }
    return e;
};

const firstDefined = (...t) => {
    const e = t.length;
    let r;
    let n = 0;
    for (;e > n; ++n) {
        r = t[n];
        if (r !== void 0) {
            return r;
        }
    }
    throw createMappedError(20);
};

const a = /*@__PURE__*/ function() {
    const t = Function.prototype;
    const e = Object.getPrototypeOf;
    const r = new WeakMap;
    let n = t;
    let s = 0;
    let o = void 0;
    return function(i) {
        o = r.get(i);
        if (o === void 0) {
            r.set(i, o = [ n = i ]);
            s = 0;
            while ((n = e(n)) !== t) {
                o[++s] = n;
            }
        }
        return o;
    };
}();

function toLookup(...t) {
    return Object.assign(createObject(), ...t);
}

const f = /*@__PURE__*/ function() {
    const t = new WeakMap;
    let e = false;
    let r = "";
    let n = 0;
    return s => {
        e = t.get(s);
        if (e === void 0) {
            r = s.toString();
            n = r.length;
            e = n >= 29 && n <= 100 && charCodeAt(r, n - 1) === 125 && charCodeAt(r, n - 2) <= 32 && charCodeAt(r, n - 3) === 93 && charCodeAt(r, n - 4) === 101 && charCodeAt(r, n - 5) === 100 && charCodeAt(r, n - 6) === 111 && charCodeAt(r, n - 7) === 99 && charCodeAt(r, n - 8) === 32 && charCodeAt(r, n - 9) === 101 && charCodeAt(r, n - 10) === 118 && charCodeAt(r, n - 11) === 105 && charCodeAt(r, n - 12) === 116 && charCodeAt(r, n - 13) === 97 && charCodeAt(r, n - 14) === 110 && charCodeAt(r, n - 15) === 88;
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
    let r = void 0;
    let n = void 0;
    let s = 0;
    let o = t.length;
    for (;s < o; ++s) {
        e = t[s];
        if ((e = t[s]) instanceof Promise) {
            if (r === void 0) {
                r = e;
            } else if (n === void 0) {
                n = [ r, e ];
            } else {
                n.push(e);
            }
        }
    }
    if (n === void 0) {
        return r;
    }
    return Promise.all(n);
};

const charCodeAt = (t, e) => t.charCodeAt(e);

const h = "au:annotation";

const getAnnotationKeyFor = (t, e) => {
    if (e === void 0) {
        return `${h}:${t}`;
    }
    return `${h}:${t}:${e}`;
};

const appendAnnotation = (t, e) => {
    const n = r(h, t);
    if (n === void 0) {
        s(h, [ e ], t);
    } else {
        n.push(e);
    }
};

const d = Object.freeze({
    name: "au:annotation",
    appendTo: appendAnnotation,
    set(t, e, r) {
        s(getAnnotationKeyFor(e), r, t);
    },
    get: (t, e) => r(getAnnotationKeyFor(e), t),
    getKeys(t) {
        let e = r(h, t);
        if (e === void 0) {
            s(h, e = [], t);
        }
        return e;
    },
    isKey: t => t.startsWith(h),
    keyFor: getAnnotationKeyFor
});

const v = "au:resource";

const hasResources = t => n(v, t);

const getAllResources = t => {
    const e = r(v, t);
    if (e === void 0) {
        return T;
    } else {
        return e.map((e => r(e, t)));
    }
};

const p = Object.freeze({
    name: v,
    appendTo(t, e) {
        const n = r(v, t);
        if (n === void 0) {
            s(v, [ e ], t);
        } else {
            n.push(e);
        }
    },
    has: hasResources,
    getAll: getAllResources,
    getKeys(t) {
        let e = r(v, t);
        if (e === void 0) {
            s(v, e = [], t);
        }
        return e;
    },
    isKey: t => t.startsWith(v),
    keyFor(t, e) {
        if (e === void 0) {
            return `${v}:${t}`;
        }
        return `${v}:${t}:${e}`;
    }
});

const g = {
    annotation: d,
    resource: p
};

const w = Object.prototype.hasOwnProperty;

function fromAnnotationOrDefinitionOrTypeOrDefault(t, e, n, s) {
    let o = r(getAnnotationKeyFor(t), n);
    if (o === void 0) {
        o = e[t];
        if (o === void 0) {
            o = n[t];
            if (o === void 0 || !w.call(n, t)) {
                return s();
            }
            return o;
        }
        return o;
    }
    return o;
}

function fromAnnotationOrTypeOrDefault(t, e, n) {
    let s = r(getAnnotationKeyFor(t), e);
    if (s === void 0) {
        s = e[t];
        if (s === void 0 || !w.call(e, t)) {
            return n();
        }
        return s;
    }
    return s;
}

function fromDefinitionOrDefault(t, e, r) {
    const n = e[t];
    if (n === void 0) {
        return r();
    }
    return n;
}

const y = new Set("Array ArrayBuffer Boolean DataView Date Error EvalError Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Number Object Promise RangeError ReferenceError RegExp Set SharedArrayBuffer String SyntaxError TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array URIError WeakMap WeakSet".split(" "));

let m = 0;

let x = null;

class Container {
    get depth() {
        return this.t === null ? 0 : this.t.depth + 1;
    }
    get parent() {
        return this.t;
    }
    constructor(t, e) {
        this.t = t;
        this.config = e;
        this.id = ++m;
        this.i = 0;
        this.u = new Map;
        if (t === null) {
            this.root = this;
            this.h = new Map;
            this.R = new Map;
            this.res = {};
        } else {
            this.root = t.root;
            this.h = new Map;
            this.R = t.R;
            this.res = {};
            if (e.inheritParentResources) {
                for (const e in t.res) {
                    this.registerResolver(e, t.res[e]);
                }
            }
        }
        this.h.set(L, R);
    }
    register(...e) {
        if (++this.i === 100) {
            throw createMappedError(6, ...e);
        }
        let r;
        let n;
        let s;
        let o;
        let i;
        let l = 0;
        let u = e.length;
        for (;l < u; ++l) {
            r = e[l];
            if (!t.isObject(r)) {
                continue;
            }
            if (isRegistry(r)) {
                r.register(this);
            } else if (hasResources(r)) {
                const t = getAllResources(r);
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
            } else if (isClass(r)) {
                _.singleton(r, r).register(this);
            } else {
                n = Object.keys(r);
                o = 0;
                i = n.length;
                for (;o < i; ++o) {
                    s = r[n[o]];
                    if (!t.isObject(s)) {
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
    registerResolver(t, e, r = false) {
        validateKey(t);
        const n = this.h;
        const s = n.get(t);
        if (s == null) {
            n.set(t, e);
            if (isResourceKey(t)) {
                if (this.res[t] !== void 0) {
                    throw createMappedError(7, t);
                }
                this.res[t] = e;
            }
        } else if (s instanceof Resolver && s.C === 4) {
            s._state.push(e);
        } else {
            n.set(t, new Resolver(t, 4, [ s, e ]));
        }
        if (r) {
            this.u.set(t, e);
        }
        return e;
    }
    registerTransformer(t, e) {
        const r = this.getResolver(t);
        if (r == null) {
            return false;
        }
        if (r.getFactory) {
            const t = r.getFactory(this);
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
        const r = x;
        let n = x = this;
        let s;
        let o;
        try {
            while (n != null) {
                s = n.h.get(t);
                if (s == null) {
                    if (n.t == null) {
                        o = isRegisterInRequester(t) ? this : n;
                        if (e) {
                            return this.L(t, o);
                        }
                        return null;
                    }
                    n = n.t;
                } else {
                    return s;
                }
            }
        } finally {
            x = r;
        }
        return null;
    }
    has(t, e = false) {
        return this.h.has(t) || isResourceKey(t) && t in this.res ? true : e && this.t != null ? this.t.has(t, true) : false;
    }
    get(t) {
        validateKey(t);
        if (t.$isResolver) {
            return t.resolve(this, this);
        }
        const e = x;
        let r = x = this;
        let n;
        let s;
        try {
            while (r != null) {
                n = r.h.get(t);
                if (n == null) {
                    if (r.t == null) {
                        s = isRegisterInRequester(t) ? this : r;
                        n = this.L(t, s);
                        return n.resolve(r, this);
                    }
                    r = r.t;
                } else {
                    return n.resolve(r, this);
                }
            }
        } finally {
            x = e;
        }
        throw createMappedError(8, t);
    }
    getAll(t, e = false) {
        validateKey(t);
        const r = x;
        const n = x = this;
        let s = n;
        let o;
        let i = T;
        try {
            if (e) {
                while (s != null) {
                    o = s.h.get(t);
                    if (o != null) {
                        i = i.concat(buildAllResponse(o, s, n));
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
                        return T;
                    }
                } else {
                    return buildAllResponse(o, s, n);
                }
            }
        } finally {
            x = r;
        }
        return T;
    }
    invoke(t, e) {
        const r = x;
        x = this;
        try {
            if (f(t)) {
                throw createMappedError(15, t);
            }
            return e === void 0 ? new t(...getDependencies(t).map(containerGetKey, this)) : new t(...getDependencies(t).map(containerGetKey, this), ...e);
        } finally {
            x = r;
        }
    }
    hasFactory(t) {
        return this.R.has(t);
    }
    getFactory(t) {
        let e = this.R.get(t);
        if (e === void 0) {
            if (f(t)) {
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
        if (s === void 0) {
            s = this.root.res[n];
            if (s === void 0) {
                return null;
            }
        }
        if (s === null) {
            return null;
        }
        if (isFunction(s.getFactory)) {
            const e = s.getFactory(this);
            if (e === null || e === void 0) {
                return null;
            }
            const n = r(t.name, e.Type);
            if (n === void 0) {
                return null;
            }
            return n;
        }
        return null;
    }
    create(t, e) {
        const r = t.keyFrom(e);
        let n = this.res[r];
        if (n === void 0) {
            n = this.root.res[r];
            if (n === void 0) {
                return null;
            }
            return n.resolve(this.root, this) ?? null;
        }
        return n.resolve(this, this) ?? null;
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
        if (y.has(t.name)) {
            throw createMappedError(10, t);
        }
        if (isRegistry(t)) {
            const r = t.register(e, t);
            if (!(r instanceof Object) || r.resolve == null) {
                const r = e.h.get(t);
                if (r != null) {
                    return r;
                }
                throw createMappedError(11, t);
            }
            return r;
        }
        if (hasResources(t)) {
            const r = getAllResources(t);
            if (r.length === 1) {
                r[0].register(e);
            } else {
                const t = r.length;
                for (let n = 0; n < t; ++n) {
                    r[n].register(e);
                }
            }
            const n = e.h.get(t);
            if (n != null) {
                return n;
            }
            throw createMappedError(11, t);
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
        const r = x;
        x = t;
        let n;
        try {
            if (e === void 0) {
                n = new this.Type(...this.dependencies.map(containerGetKey, t));
            } else {
                n = new this.Type(...this.dependencies.map(containerGetKey, t), ...e);
            }
            if (this.transformers == null) {
                return n;
            }
            return this.transformers.reduce(transformInstance, n);
        } finally {
            x = r;
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
    if (x == null) {
        throw createMappedError(16, ...t);
    }
    return t.length === 1 ? x.get(t[0]) : t.map(containerGetKey, x);
}

const buildAllResponse = (t, e, r) => {
    if (t instanceof Resolver && t.C === 4) {
        const n = t._state;
        const s = n.length;
        const o = Array(s);
        let i = 0;
        for (;i < s; ++i) {
            o[i] = n[i].resolve(e, r);
        }
        return o;
    }
    return [ t.resolve(e, r) ];
};

const R = {
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

const b = new WeakMap;

const cacheCallbackResult = t => (e, r, n) => {
    let s = b.get(e);
    if (s === void 0) {
        b.set(e, s = new WeakMap);
    }
    if (s.has(n)) {
        return s.get(n);
    }
    const o = t(e, r, n);
    s.set(n, o);
    return o;
};

t.applyMetadataPolyfill(Reflect, false, false);

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
        const {c: r, k: n} = this;
        this.c = this.k = void 0;
        return r.registerResolver(n, new Resolver(n, t, e));
    }
}

const cloneArrayWithPossibleProps = t => {
    const e = t.slice();
    const r = Object.keys(t);
    const n = r.length;
    let s;
    for (let o = 0; o < n; ++o) {
        s = r[o];
        if (!isArrayIndex(s)) {
            e[s] = t[s];
        }
    }
    return e;
};

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

const getAnnotationParamtypes = t => {
    const e = getAnnotationKeyFor("di:paramtypes");
    return r(e, t);
};

const getDesignParamtypes = t => r("design:paramtypes", t);

const getOrCreateAnnotationParamTypes = t => {
    const e = getAnnotationKeyFor("di:paramtypes");
    let n = r(e, t);
    if (n === void 0) {
        s(e, n = [], t);
        appendAnnotation(t, e);
    }
    return n;
};

const getDependencies = t => {
    const e = getAnnotationKeyFor("di:dependencies");
    let n = r(e, t);
    if (n === void 0) {
        const r = t.inject;
        if (r === void 0) {
            const e = D.getDesignParamtypes(t);
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
        s(e, n, t);
        appendAnnotation(t, e);
    }
    return n;
};

const createInterface = (t, e) => {
    const r = isFunction(t) ? t : e;
    const n = (isString(t) ? t : undefined) ?? "(anonymous)";
    const Interface = function(t, e, r) {
        if (t == null || new.target !== undefined) {
            throw createMappedError(1, n);
        }
        const s = getOrCreateAnnotationParamTypes(t);
        s[r] = Interface;
    };
    Interface.$isInterface = true;
    Interface.friendlyName = n;
    if (r != null) {
        Interface.register = (t, e) => r(new ResolverBuilder(t, e ?? Interface));
    }
    Interface.toString = () => `InterfaceSymbol<${n}>`;
    return Interface;
};

const D = {
    createContainer: createContainer,
    getDesignParamtypes: getDesignParamtypes,
    getAnnotationParamtypes: getAnnotationParamtypes,
    getOrCreateAnnotationParamTypes: getOrCreateAnnotationParamTypes,
    getDependencies: getDependencies,
    createInterface: createInterface,
    inject(...t) {
        return (e, r, n) => {
            if (typeof n === "number") {
                const r = getOrCreateAnnotationParamTypes(e);
                const s = t[0];
                if (s !== void 0) {
                    r[n] = s;
                }
            } else if (r) {
                const n = getOrCreateAnnotationParamTypes(e.constructor);
                const s = t[0];
                if (s !== void 0) {
                    n[r] = s;
                }
            } else if (n) {
                const e = n.value;
                const r = getOrCreateAnnotationParamTypes(e);
                let s;
                let o = 0;
                for (;o < t.length; ++o) {
                    s = t[o];
                    if (s !== void 0) {
                        r[o] = s;
                    }
                }
            } else {
                const r = getOrCreateAnnotationParamTypes(e);
                let n;
                let s = 0;
                for (;s < t.length; ++s) {
                    n = t[s];
                    if (n !== void 0) {
                        r[s] = n;
                    }
                }
            }
        };
    },
    transient(t) {
        t.register = function(e) {
            const r = _.transient(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = A) {
        t.register = function(e) {
            const r = _.singleton(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

const L = /*@__PURE__*/ createInterface("IContainer");

const O = L;

function createResolver(t) {
    return function(e) {
        const resolver = function(t, e, r) {
            $(resolver)(t, e, r);
        };
        resolver.$isResolver = true;
        resolver.resolve = function(r, n) {
            return t(e, r, n);
        };
        return resolver;
    };
}

const $ = D.inject;

function transientDecorator(t) {
    return D.transient(t);
}

function transient(t) {
    return t == null ? transientDecorator : transientDecorator(t);
}

const A = {
    scoped: false
};

const k = D.singleton;

function singleton(t) {
    if (isFunction(t)) {
        return k(t);
    }
    return function(e) {
        return k(e, t);
    };
}

const all = (t, e = false) => {
    function resolver(t, e, r) {
        $(resolver)(t, e, r);
    }
    resolver.$isResolver = true;
    resolver.resolve = (r, n) => n.getAll(t, e);
    return resolver;
};

const j = /*@__PURE__*/ createResolver(((t, e, r) => () => r.get(t)));

const E = /*@__PURE__*/ createResolver(((t, e, r) => {
    if (r.has(t, true)) {
        return r.get(t);
    } else {
        return undefined;
    }
}));

const ignore = (t, e, r) => {
    $(ignore)(t, e, r);
};

ignore.$isResolver = true;

ignore.resolve = () => undefined;

const I = /*@__PURE__*/ createResolver(((t, e, r) => (...n) => e.getFactory(t).construct(r, n)));

const F = /*@__PURE__*/ createResolver(((t, r, n) => {
    const s = createNewInstance(t, r, n);
    const o = new InstanceProvider(e(t), s);
    n.registerResolver(t, o, true);
    return s;
}));

const M = /*@__PURE__*/ createResolver(((t, e, r) => createNewInstance(t, e, r)));

const createNewInstance = (t, e, r) => {
    if (e.hasFactory(t)) {
        return e.getFactory(t).construct(r);
    }
    if (isInterface(t)) {
        const n = isFunction(t.register);
        const s = e.getResolver(t, n);
        const o = s?.getFactory?.(e);
        if (o != null) {
            return o.construct(r);
        }
        throw createMappedError(17, t);
    }
    return e.getFactory(t).construct(r);
};

class Resolver {
    constructor(t, e, r) {
        this.resolving = false;
        this.k = t;
        this.C = e;
        this._state = r;
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
                const r = t.getFactory(this._state);
                if (r === null) {
                    throw createMappedError(4, this.k);
                }
                return r.construct(e);
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

const _ = {
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
        return this.$;
    }
    constructor(t, e) {
        this.A = null;
        this.$ = t;
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
            throw createMappedError(13, this.$);
        }
        return this.A;
    }
    dispose() {
        this.A = null;
    }
}

const isInterface = t => isFunction(t) && t.$isInterface === true;

const T = Object.freeze([]);

const P = Object.freeze({});

function noop() {}

const K = /*@__PURE__*/ createInterface("IPlatform");

function __decorate(t, e, r, n) {
    var s = arguments.length, o = s < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, i;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") o = Reflect.decorate(t, e, r, n); else for (var l = t.length - 1; l >= 0; l--) if (i = t[l]) o = (s < 3 ? i(o) : s > 3 ? i(e, r, o) : i(e, r)) || o;
    return s > 3 && o && Object.defineProperty(e, r, o), o;
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

const S = /*@__PURE__*/ createInterface("ILogConfig", (t => t.instance(new LogConfig(0, 3))));

const G = /*@__PURE__*/ createInterface("ISink");

const N = /*@__PURE__*/ createInterface("ILogEventFactory", (t => t.singleton(DefaultLogEventFactory)));

const W = /*@__PURE__*/ createInterface("ILogger", (t => t.singleton(DefaultLogger)));

const B = /*@__PURE__*/ createInterface("ILogScope");

const z = Object.freeze({
    key: getAnnotationKeyFor("logger-sink-handles"),
    define(t, e) {
        s(this.key, e.handles, t.prototype);
        return t;
    },
    getHandles(e) {
        return t.Metadata.get(this.key, e);
    }
});

const sink = t => e => z.define(e, t);

const Q = toLookup({
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

const U = function() {
    const t = [ toLookup({
        TRC: "TRC",
        DBG: "DBG",
        INF: "INF",
        WRN: "WRN",
        ERR: "ERR",
        FTL: "FTL",
        QQQ: "???"
    }), toLookup({
        TRC: Q.grey("TRC"),
        DBG: Q.grey("DBG"),
        INF: Q.white("INF"),
        WRN: Q.yellow("WRN"),
        ERR: Q.red("ERR"),
        FTL: Q.red("FTL"),
        QQQ: Q.grey("???")
    }) ];
    return (e, r) => {
        if (e <= 0) {
            return t[r].TRC;
        }
        if (e <= 1) {
            return t[r].DBG;
        }
        if (e <= 2) {
            return t[r].INF;
        }
        if (e <= 3) {
            return t[r].WRN;
        }
        if (e <= 4) {
            return t[r].ERR;
        }
        if (e <= 5) {
            return t[r].FTL;
        }
        return t[r].QQQ;
    };
}();

const getScopeString = (t, e) => {
    if (e === 0) {
        return t.join(".");
    }
    return t.map(Q.cyan).join(".");
};

const getIsoString = (t, e) => {
    if (e === 0) {
        return new Date(t).toISOString();
    }
    return Q.grey(new Date(t).toISOString());
};

class DefaultLogEvent {
    constructor(t, e, r, n, s, o) {
        this.severity = t;
        this.message = e;
        this.optionalParams = r;
        this.scope = n;
        this.colorOptions = s;
        this.timestamp = o;
    }
    toString() {
        const {severity: t, message: e, scope: r, colorOptions: n, timestamp: s} = this;
        if (r.length === 0) {
            return `${getIsoString(s, n)} [${U(t, n)}] ${e}`;
        }
        return `${getIsoString(s, n)} [${U(t, n)} ${getScopeString(r, n)}] ${e}`;
    }
}

class DefaultLogEventFactory {
    constructor() {
        this.config = resolve(S);
    }
    createLogEvent(t, e, r, n) {
        return new DefaultLogEvent(e, r, n, t.scope, this.config.colorOptions, Date.now());
    }
}

class ConsoleSink {
    static register(t) {
        singletonRegistration(G, ConsoleSink).register(t);
    }
    constructor(t = resolve(K)) {
        const e = t.console;
        this.handleEvent = function emit(t) {
            const r = t.optionalParams;
            if (r === void 0 || r.length === 0) {
                const r = t.toString();
                switch (t.severity) {
                  case 0:
                  case 1:
                    return e.debug(r);

                  case 2:
                    return e.info(r);

                  case 3:
                    return e.warn(r);

                  case 4:
                  case 5:
                    return e.error(r);
                }
            } else {
                let n = t.toString();
                let s = 0;
                while (n.includes("%s")) {
                    n = n.replace("%s", String(r[s++]));
                }
                switch (t.severity) {
                  case 0:
                  case 1:
                    return e.debug(n, ...r.slice(s));

                  case 2:
                    return e.info(n, ...r.slice(s));

                  case 3:
                    return e.warn(n, ...r.slice(s));

                  case 4:
                  case 5:
                    return e.error(n, ...r.slice(s));
                }
            }
        };
    }
}

class DefaultLogger {
    constructor(t = resolve(S), e = resolve(N), r = resolve(all(G)), n = resolve(E(B)) ?? [], s = null) {
        this.scope = n;
        this.j = createObject();
        let o;
        let i;
        let l;
        let u;
        let c;
        let a;
        this.config = t;
        this.f = e;
        this.sinks = r;
        if (s === null) {
            this.root = this;
            this.parent = this;
            o = this.I = [];
            i = this.F = [];
            l = this.M = [];
            u = this._ = [];
            c = this.T = [];
            a = this.P = [];
            for (const t of r) {
                const e = z.getHandles(t);
                if (e?.includes(0) ?? true) {
                    o.push(t);
                }
                if (e?.includes(1) ?? true) {
                    i.push(t);
                }
                if (e?.includes(2) ?? true) {
                    l.push(t);
                }
                if (e?.includes(3) ?? true) {
                    u.push(t);
                }
                if (e?.includes(4) ?? true) {
                    c.push(t);
                }
                if (e?.includes(5) ?? true) {
                    a.push(t);
                }
            }
        } else {
            this.root = s.root;
            this.parent = s;
            o = this.I = s.I;
            i = this.F = s.F;
            l = this.M = s.M;
            u = this._ = s._;
            c = this.T = s.T;
            a = this.P = s.P;
        }
    }
    trace(t, ...e) {
        if (this.config.level <= 0) {
            this.K(this.I, 0, t, e);
        }
    }
    debug(t, ...e) {
        if (this.config.level <= 1) {
            this.K(this.F, 1, t, e);
        }
    }
    info(t, ...e) {
        if (this.config.level <= 2) {
            this.K(this.M, 2, t, e);
        }
    }
    warn(t, ...e) {
        if (this.config.level <= 3) {
            this.K(this._, 3, t, e);
        }
    }
    error(t, ...e) {
        if (this.config.level <= 4) {
            this.K(this.T, 4, t, e);
        }
    }
    fatal(t, ...e) {
        if (this.config.level <= 5) {
            this.K(this.P, 5, t, e);
        }
    }
    scopeTo(t) {
        const e = this.j;
        let r = e[t];
        if (r === void 0) {
            r = e[t] = new DefaultLogger(this.config, this.f, null, this.scope.concat(t), this);
        }
        return r;
    }
    K(t, e, r, n) {
        const s = isFunction(r) ? r() : r;
        const o = this.f.createLogEvent(this, e, s, n);
        for (let e = 0, r = t.length; e < r; ++e) {
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

const H = toLookup({
    create({level: t = 3, colorOptions: e = 0, sinks: r = []} = {}) {
        return toLookup({
            register(n) {
                n.register(instanceRegistration(S, new LogConfig(e, t)));
                for (const t of r) {
                    if (isFunction(t)) {
                        n.register(singletonRegistration(G, t));
                    } else {
                        n.register(t);
                    }
                }
                return n;
            }
        });
    }
});

const q = /*@__PURE__*/ createInterface((t => t.singleton(ModuleLoader)));

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
        let r;
        let n;
        let s;
        const o = [];
        for (const i in t) {
            switch (typeof (e = t[i])) {
              case "object":
                if (e === null) {
                    continue;
                }
                r = isFunction(e.register);
                n = false;
                s = T;
                break;

              case "function":
                r = isFunction(e.register);
                n = e.prototype !== void 0;
                s = getAllResources(e);
                break;

              default:
                continue;
            }
            o.push(new ModuleItem(i, e, r, n, s));
        }
        return new AnalyzedModule(t, o);
    }
}

class ModuleLoader {
    constructor() {
        this.transformers = new Map;
    }
    load(t, e = noTransform) {
        const r = this.transformers;
        let n = r.get(e);
        if (n === void 0) {
            r.set(e, n = new ModuleTransformer(e));
        }
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
        if (t instanceof this.type) {
            this.cb.call(null, t);
        }
    }
}

const V = /*@__PURE__*/ createInterface("IEventAggregator", (t => t.singleton(EventAggregator)));

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
            let r = this.eventLookup[t];
            if (r !== void 0) {
                r = r.slice();
                let n = r.length;
                while (n-- > 0) {
                    r[n](e, t);
                }
            }
        } else {
            const e = this.messageHandlers.slice();
            let r = e.length;
            while (r-- > 0) {
                e[r].handle(t);
            }
        }
    }
    subscribe(t, e) {
        if (!t) {
            throw createMappedError(19, t);
        }
        let r;
        let n;
        if (isString(t)) {
            if (this.eventLookup[t] === void 0) {
                this.eventLookup[t] = [];
            }
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
                if (t !== -1) {
                    n.splice(t, 1);
                }
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

exports.ConsoleSink = ConsoleSink;

exports.ContainerConfiguration = ContainerConfiguration;

exports.DI = D;

exports.DefaultLogEvent = DefaultLogEvent;

exports.DefaultLogEventFactory = DefaultLogEventFactory;

exports.DefaultLogger = DefaultLogger;

exports.DefaultResolver = C;

exports.EventAggregator = EventAggregator;

exports.IContainer = L;

exports.IEventAggregator = V;

exports.ILogConfig = S;

exports.ILogEventFactory = N;

exports.ILogger = W;

exports.IModuleLoader = q;

exports.IPlatform = K;

exports.IServiceLocator = O;

exports.ISink = G;

exports.InstanceProvider = InstanceProvider;

exports.LogConfig = LogConfig;

exports.LoggerConfiguration = H;

exports.ModuleItem = ModuleItem;

exports.Protocol = g;

exports.Registration = _;

exports.all = all;

exports.bound = bound;

exports.camelCase = l;

exports.emptyArray = T;

exports.emptyObject = P;

exports.factory = I;

exports.firstDefined = firstDefined;

exports.format = Q;

exports.fromAnnotationOrDefinitionOrTypeOrDefault = fromAnnotationOrDefinitionOrTypeOrDefault;

exports.fromAnnotationOrTypeOrDefault = fromAnnotationOrTypeOrDefault;

exports.fromDefinitionOrDefault = fromDefinitionOrDefault;

exports.getPrototypeChain = a;

exports.ignore = ignore;

exports.inject = $;

exports.isArrayIndex = isArrayIndex;

exports.isNativeFunction = f;

exports.kebabCase = c;

exports.lazy = j;

exports.mergeArrays = mergeArrays;

exports.newInstanceForScope = F;

exports.newInstanceOf = M;

exports.noop = noop;

exports.onResolve = onResolve;

exports.onResolveAll = onResolveAll;

exports.optional = E;

exports.pascalCase = u;

exports.resolve = resolve;

exports.singleton = singleton;

exports.sink = sink;

exports.toArray = toArray;

exports.transient = transient;
//# sourceMappingURL=index.cjs.map
