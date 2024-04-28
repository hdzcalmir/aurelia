"use strict";

var t = require("@aurelia/metadata");

const e = Object.freeze;

const r = Object.assign;

const n = String;

const s = t.Metadata.get;

t.Metadata.has;

const o = t.Metadata.define;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const createObject = () => Object.create(null);

const createMappedError = (t, ...e) => new Error(`AUR${n(t).padStart(4, "0")}:${e.map(n)}`);

const i = (() => {
    const t = {};
    let e = false;
    let r = 0;
    let n = 0;
    let s = 0;
    return o => {
        switch (typeof o) {
          case "number":
            return o >= 0 && (o | 0) === o;

          case "string":
            e = t[o];
            if (e !== void 0) {
                return e;
            }
            r = o.length;
            if (r === 0) {
                return t[o] = false;
            }
            n = 0;
            s = 0;
            for (;s < r; ++s) {
                n = charCodeAt(o, s);
                if (s === 0 && n === 48 && r > 1 || n < 48 || n > 57) {
                    return t[o] = false;
                }
            }
            return t[o] = true;

          default:
            return false;
        }
    };
})();

const l = /*@__PURE__*/ function() {
    const t = r(createObject(), {
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
        let c = t.charAt(0);
        let a = charToKind(c);
        let u = 0;
        for (;u < r; ++u) {
            o = l;
            i = c;
            l = a;
            c = t.charAt(u + 1);
            a = charToKind(c);
            if (l === 0) {
                if (s.length > 0) {
                    n = true;
                }
            } else {
                if (!n && s.length > 0 && l === 2) {
                    n = o === 3 || a === 3;
                }
                s += e(i, n);
                n = false;
            }
        }
        return s;
    };
}();

const c = /*@__PURE__*/ function() {
    const t = createObject();
    const callback = (t, e) => e ? t.toUpperCase() : t.toLowerCase();
    return e => {
        let r = t[e];
        if (r === void 0) {
            r = t[e] = l(e, callback);
        }
        return r;
    };
}();

const a = /*@__PURE__*/ function() {
    const t = createObject();
    return e => {
        let r = t[e];
        if (r === void 0) {
            r = c(e);
            if (r.length > 0) {
                r = r[0].toUpperCase() + r.slice(1);
            }
            t[e] = r;
        }
        return r;
    };
}();

const u = /*@__PURE__*/ function() {
    const t = createObject();
    const callback = (t, e) => e ? `-${t.toLowerCase()}` : t.toLowerCase();
    return e => {
        let r = t[e];
        if (r === void 0) {
            r = t[e] = l(e, callback);
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

const bound = (t, e) => {
    const r = e.name;
    e.addInitializer((function() {
        Reflect.defineProperty(this, r, {
            value: t.bind(this),
            writable: true,
            configurable: true,
            enumerable: false
        });
    }));
};

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

const f = /*@__PURE__*/ function() {
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
    return r(createObject(), ...t);
}

const h = /*@__PURE__*/ function() {
    const t = new WeakMap;
    let e = false;
    let r = "";
    let n = 0;
    return s => {
        e = t.get(s);
        if (e === void 0) {
            r = s.toString();
            n = r.length;
            e = n >= 29 && n <= 100 && charCodeAt(r, n - 1) === 125 && charCodeAt(r, n - 2) <= 32 && charCodeAt(r, n - 3) === 93 && charCodeAt(r, n - 4) === 101 && charCodeAt(r, n - 5) === 100 && charCodeAt(r, n - 6) === 111 && charCodeAt(r, n - 7) === 99 && charCodeAt(r, n - 8) === 32 && charCodeAt(r, n - 9) === 101 && charCodeAt(r, n - 10) === 118 && charCodeAt(r, n - 11) === 105 && charCodeAt(r, n - 12) === 116 && charCodeAt(r, n - 13) === 97 && charCodeAt(r, n - 14) === 110 && charCodeAt(r, n - 15) === 91;
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

const instanceRegistration = (t, e) => new Resolver(t, 0, e);

const singletonRegistration = (t, e) => new Resolver(t, 1, e);

const transientRegistation = (t, e) => new Resolver(t, 2, e);

const callbackRegistration = (t, e) => new Resolver(t, 3, e);

const cachedCallbackRegistration = (t, e) => new Resolver(t, 3, cacheCallbackResult(e));

const aliasToRegistration = (t, e) => new Resolver(e, 5, t);

const deferRegistration = (t, ...e) => new ParameterizedRegistry(t, e);

const v = new WeakMap;

const cacheCallbackResult = t => (e, r, n) => {
    let s = v.get(e);
    if (s === void 0) {
        v.set(e, s = new WeakMap);
    }
    if (s.has(n)) {
        return s.get(n);
    }
    const o = t(e, r, n);
    s.set(n, o);
    return o;
};

const d = {
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

const p = "au:annotation";

const getAnnotationKeyFor = (t, e) => {
    if (e === void 0) {
        return `${p}:${t}`;
    }
    return `${p}:${t}:${e}`;
};

const appendAnnotation = (t, e) => {
    const r = s(p, t);
    if (r === void 0) {
        o([ e ], t, p);
    } else {
        r.push(e);
    }
};

const g = /*@__PURE__*/ e({
    name: "au:annotation",
    appendTo: appendAnnotation,
    set(t, e, r) {
        o(r, t, getAnnotationKeyFor(e));
    },
    get: (t, e) => s(getAnnotationKeyFor(e), t),
    getKeys(t) {
        let e = s(p, t);
        if (e === void 0) {
            o(e = [], t, p);
        }
        return e;
    },
    isKey: t => t.startsWith(p),
    keyFor: getAnnotationKeyFor
});

const w = "au:resource";

const getResourceKeyFor = (t, e, r) => {
    if (e == null) {
        return `${w}:${t}`;
    }
    if (r == null) {
        return `${w}:${t}:${e}`;
    }
    return `${w}:${t}:${e}:${r}`;
};

const y = {
    annotation: g
};

const m = Object.prototype.hasOwnProperty;

function fromAnnotationOrDefinitionOrTypeOrDefault(t, e, r, n) {
    let o = s(getAnnotationKeyFor(t), r);
    if (o === void 0) {
        o = e[t];
        if (o === void 0) {
            o = r[t];
            if (o === void 0 || !m.call(r, t)) {
                return n();
            }
            return o;
        }
        return o;
    }
    return o;
}

function fromAnnotationOrTypeOrDefault(t, e, r) {
    let n = s(getAnnotationKeyFor(t), e);
    if (n === void 0) {
        n = e[t];
        if (n === void 0 || !m.call(e, t)) {
            return r();
        }
        return n;
    }
    return n;
}

function fromDefinitionOrDefault(t, e, r) {
    const n = e[t];
    if (n === void 0) {
        return r();
    }
    return n;
}

const x = /*@__PURE__*/ (() => {
    const t = new WeakMap;
    return e({
        define: (e, r) => {
            t.set(e, r);
            return e;
        },
        get: e => t.get(e),
        has: e => t.has(e)
    });
})();

const R = {
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
        return new ContainerConfiguration(t.inheritParentResources ?? false, t.defaultResolver ?? R.singleton);
    }
}

ContainerConfiguration.DEFAULT = ContainerConfiguration.from({});

const createContainer = t => new Container(null, ContainerConfiguration.from(t));

const b = new Set("Array ArrayBuffer Boolean DataView Date Error EvalError Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Number Object Promise RangeError ReferenceError RegExp Set SharedArrayBuffer String SyntaxError TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array URIError WeakMap WeakSet".split(" "));

let $ = 0;

let C = null;

class Container {
    get depth() {
        return this.t === null ? 0 : this.t.depth + 1;
    }
    get parent() {
        return this.t;
    }
    constructor(t, e) {
        this.id = ++$;
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
        this.h.set(E, D);
    }
    register(...e) {
        if (++this.i === 100) {
            throw createMappedError(6, ...e);
        }
        let r;
        let n;
        let o;
        let i;
        let l;
        let c = 0;
        let a = e.length;
        let u;
        for (;c < a; ++c) {
            r = e[c];
            if (!t.isObject(r)) {
                continue;
            }
            if (isRegistry(r)) {
                r.register(this);
            } else if (x.has(r)) {
                x.get(r).call(r, this);
            } else if ((u = s(w, r)) != null) {
                u.register(this);
            } else if (isClass(r)) {
                if (isString(r.$au?.type)) {
                    const t = r.$au;
                    const e = (r.aliases ?? F).concat(t.aliases ?? F);
                    let n = `${w}:${t.type}:${t.name}`;
                    if (!this.has(n, false)) {
                        aliasToRegistration(r, n).register(this);
                        if (!this.has(r, false)) {
                            singletonRegistration(r, r).register(this);
                        }
                        i = 0;
                        l = e.length;
                        for (;i < l; ++i) {
                            n = `${w}:${t.type}:${e[i]}`;
                            if (!this.has(n, false)) {
                                aliasToRegistration(r, n).register(this);
                            }
                        }
                    }
                } else {
                    singletonRegistration(r, r).register(this);
                }
            } else {
                n = Object.keys(r);
                i = 0;
                l = n.length;
                for (;i < l; ++i) {
                    o = r[n[i]];
                    if (!t.isObject(o)) {
                        continue;
                    }
                    if (isRegistry(o)) {
                        o.register(this);
                    } else if (x.has(o)) {
                        x.get(o).call(o, this);
                    } else {
                        this.register(o);
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
        } else if (s instanceof Resolver && s.$ === 4) {
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
        const r = C;
        let n = C = this;
        let s;
        let o;
        try {
            while (n != null) {
                s = n.h.get(t);
                if (s == null) {
                    if (n.t == null) {
                        o = isRegisterInRequester(t) ? this : n;
                        if (e) {
                            return this.C(t, o);
                        }
                        return null;
                    }
                    n = n.t;
                } else {
                    return s;
                }
            }
        } finally {
            C = r;
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
        const e = C;
        let r = C = this;
        let n;
        let s;
        try {
            while (r != null) {
                n = r.h.get(t);
                if (n == null) {
                    if (r.t == null) {
                        s = isRegisterInRequester(t) ? this : r;
                        n = this.C(t, s);
                        return n.resolve(r, this);
                    }
                    r = r.t;
                } else {
                    return n.resolve(r, this);
                }
            }
        } finally {
            C = e;
        }
        throw createMappedError(8, t);
    }
    getAll(t, e = false) {
        validateKey(t);
        const r = C;
        const n = C = this;
        let s = n;
        let o;
        let i = F;
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
                        return F;
                    }
                } else {
                    return buildAllResponse(o, s, n);
                }
            }
        } finally {
            C = r;
        }
        return F;
    }
    invoke(t, e) {
        if (h(t)) {
            throw createMappedError(15, t);
        }
        const r = C;
        C = this;
        try {
            return e === void 0 ? new t(...getDependencies(t).map(containerGetKey, this)) : new t(...getDependencies(t).map(containerGetKey, this), ...e);
        } finally {
            C = r;
        }
    }
    hasFactory(t) {
        return this.R.has(t);
    }
    getFactory(t) {
        let e = this.R.get(t);
        if (e === void 0) {
            if (h(t)) {
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
            r.dispose?.();
            t.delete(n);
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
        const r = isString(e) ? `${w}:${t}:${e}` : t;
        let n = this;
        let s = n.res[r];
        if (s == null) {
            n = n.root;
            s = n.res[r];
        }
        if (s == null) {
            return null;
        }
        return s.getFactory?.(n)?.Type ?? null;
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
        const r = isRegistry(t);
        if (!isFunction(t) && !r) {
            throw createMappedError(9, t);
        }
        if (b.has(t.name)) {
            throw createMappedError(10, t);
        }
        if (r) {
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
        const r = C;
        C = t;
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
            C = r;
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
    if (C == null) {
        throw createMappedError(16, ...t);
    }
    return t.length === 1 ? C.get(t[0]) : t.map(containerGetKey, C);
}

const buildAllResponse = (t, e, r) => {
    if (t instanceof Resolver && t.$ === 4) {
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

const D = {
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

t.initializeTC39Metadata();

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
        if (!i(s)) {
            e[s] = t[s];
        }
    }
    return e;
};

const k = getAnnotationKeyFor("di:paramtypes");

const getAnnotationParamtypes = t => s(k, t);

const getDesignParamtypes = t => s("design:paramtypes", t);

const getOrCreateAnnotationParamTypes = t => t.metadata[k] ??= [];

const getDependencies = t => {
    const e = getAnnotationKeyFor("di:dependencies");
    let r = s(e, t);
    if (r === void 0) {
        const n = t.inject;
        if (n === void 0) {
            const e = getDesignParamtypes(t);
            const n = getAnnotationParamtypes(t);
            if (e === void 0) {
                if (n === void 0) {
                    const e = Object.getPrototypeOf(t);
                    if (isFunction(e) && e !== Function.prototype) {
                        r = cloneArrayWithPossibleProps(getDependencies(e));
                    } else {
                        r = [];
                    }
                } else {
                    r = cloneArrayWithPossibleProps(n);
                }
            } else if (n === void 0) {
                r = cloneArrayWithPossibleProps(e);
            } else {
                r = cloneArrayWithPossibleProps(e);
                let t = n.length;
                let s;
                let o = 0;
                for (;o < t; ++o) {
                    s = n[o];
                    if (s !== void 0) {
                        r[o] = s;
                    }
                }
                const l = Object.keys(n);
                let c;
                o = 0;
                t = l.length;
                for (o = 0; o < t; ++o) {
                    c = l[o];
                    if (!i(c)) {
                        r[c] = n[c];
                    }
                }
            }
        } else {
            r = cloneArrayWithPossibleProps(n);
        }
        o(r, t, e);
    }
    return r;
};

const createInterface = (t, e) => {
    const r = isFunction(t) ? t : e;
    const n = (isString(t) ? t : undefined) ?? "(anonymous)";
    const s = {
        $isInterface: true,
        friendlyName: n,
        toString: () => `InterfaceSymbol<${n}>`,
        register: r != null ? (t, e) => r(new ResolverBuilder(t, e ?? s)) : void 0
    };
    return s;
};

const inject = (...t) => (e, r) => {
    switch (r.kind) {
      case "class":
        {
            const e = getOrCreateAnnotationParamTypes(r);
            let n;
            let s = 0;
            for (;s < t.length; ++s) {
                n = t[s];
                if (n !== void 0) {
                    e[s] = n;
                }
            }
            break;
        }

      case "field":
        {
            const e = getOrCreateAnnotationParamTypes(r);
            const n = t[0];
            if (n !== void 0) {
                e[r.name] = n;
            }
            break;
        }

      default:
        throw createMappedError(22, String(r.name), r.kind);
    }
};

const O = {
    createContainer: createContainer,
    getDesignParamtypes: getDesignParamtypes,
    getDependencies: getDependencies,
    createInterface: createInterface,
    inject: inject,
    transient(t) {
        t.register = function(e) {
            const r = transientRegistation(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = L) {
        t.register = function(e) {
            const r = singletonRegistration(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

const E = /*@__PURE__*/ createInterface("IContainer");

const I = E;

function transientDecorator(t, e) {
    return O.transient(t);
}

function transient(t, e) {
    return t == null ? transientDecorator : transientDecorator(t);
}

const L = {
    scoped: false
};

const A = O.singleton;

function singleton(t, e) {
    return isFunction(t) ? A(t) : function(e, r) {
        return A(e, t);
    };
}

class Resolver {
    get $isResolver() {
        return true;
    }
    constructor(t, e, r) {
        this.I = false;
        this.L = null;
        this.k = t;
        this.$ = e;
        this._state = r;
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
    constructor(t, e = null, r = null) {
        this.A = t;
        this.F = e;
        this._ = r;
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

const F = e([]);

const _ = e({});

function noop() {}

const j = /*@__PURE__*/ createInterface("IPlatform");

function createResolver(t) {
    return function(e) {
        function Resolver(t, e) {
            inject(Resolver)(t, e);
        }
        Resolver.$isResolver = true;
        Resolver.resolve = function(r, n) {
            return t(e, r, n);
        };
        return Resolver;
    };
}

const all = (t, e = false) => {
    function resolver(t, e) {
        inject(resolver)(t, e);
    }
    resolver.$isResolver = true;
    resolver.resolve = (r, n) => n.getAll(t, e);
    return resolver;
};

const M = /*@__PURE__*/ createResolver(((t, e, r) => () => r.get(t)));

const T = /*@__PURE__*/ createResolver(((t, e, r) => {
    if (r.has(t, true)) {
        return r.get(t);
    } else {
        return undefined;
    }
}));

const S = /*@__PURE__*/ r(((t, e) => {
    inject(S)(t, e);
}), {
    $isResolver: true,
    resolve: () => void 0
});

const P = /*@__PURE__*/ createResolver(((t, e, r) => (...n) => e.getFactory(t).construct(r, n)));

const K = /*@__PURE__*/ createResolver(((t, e, r) => r.has(t, false) ? r.get(t) : void 0));

const N = /*@__PURE__*/ createResolver(((t, e, r) => r.has(t, false) ? r.get(t) : r.root.get(t)));

const W = /*@__PURE__*/ createResolver(((t, e, r) => r.has(t, false) ? r.get(t) : r.root.has(t, false) ? r.root.get(t) : void 0));

const z = /*@__PURE__*/ createResolver(((t, e, r) => r === r.root ? r.getAll(t, false) : r.has(t, false) ? r.getAll(t, false).concat(r.root.getAll(t, false)) : r.root.getAll(t, false)));

const G = /*@__PURE__*/ createResolver(((t, e, r) => {
    const s = createNewInstance(t, e, r);
    const o = new InstanceProvider(n(t), s);
    r.registerResolver(t, o, true);
    return s;
}));

const B = /*@__PURE__*/ createResolver(((t, e, r) => createNewInstance(t, e, r)));

const createNewInstance = (t, e, r) => {
    if (e.hasFactory(t)) {
        return e.getFactory(t).construct(r);
    }
    if (isInterface(t)) {
        const n = isFunction(t.register);
        const s = e.getResolver(t, false);
        let o;
        if (s == null) {
            if (n) {
                o = (Q ??= createContainer()).getResolver(t, true)?.getFactory?.(e);
            }
            Q.dispose();
        } else {
            o = s.getFactory?.(e);
        }
        if (o != null) {
            return o.construct(r);
        }
        throw createMappedError(17, t);
    }
    return e.getFactory(t).construct(r);
};

const isInterface = t => t?.$isInterface === true;

let Q;

function __esDecorate(t, e, r, n, s, o) {
    function accept(t) {
        if (t !== void 0 && typeof t !== "function") throw new TypeError("Function expected");
        return t;
    }
    var i = n.kind, l = i === "getter" ? "get" : i === "setter" ? "set" : "value";
    var c = !e && t ? n["static"] ? t : t.prototype : null;
    var a = e || (c ? Object.getOwnPropertyDescriptor(c, n.name) : {});
    var u, f = false;
    for (var h = r.length - 1; h >= 0; h--) {
        var v = {};
        for (var d in n) v[d] = d === "access" ? {} : n[d];
        for (var d in n.access) v.access[d] = n.access[d];
        v.addInitializer = function(t) {
            if (f) throw new TypeError("Cannot add initializers after decoration has completed");
            o.push(accept(t || null));
        };
        var p = (0, r[h])(i === "accessor" ? {
            get: a.get,
            set: a.set
        } : a[l], v);
        if (i === "accessor") {
            if (p === void 0) continue;
            if (p === null || typeof p !== "object") throw new TypeError("Object expected");
            if (u = accept(p.get)) a.get = u;
            if (u = accept(p.set)) a.set = u;
            if (u = accept(p.init)) s.unshift(u);
        } else if (u = accept(p)) {
            if (i === "field") s.unshift(u); else a[l] = u;
        }
    }
    if (c) Object.defineProperty(c, n.name, a);
    f = true;
}

function __runInitializers(t, e, r) {
    var n = arguments.length > 2;
    for (var s = 0; s < e.length; s++) {
        r = n ? e[s].call(t, r) : e[s].call(t);
    }
    return n ? r : void 0;
}

const U = 0;

const H = 1;

const q = 2;

const V = 3;

const J = 4;

const X = 5;

const Y = 6;

const Z = e({
    trace: U,
    debug: H,
    info: q,
    warn: V,
    error: J,
    fatal: X,
    none: Y
});

const tt = /*@__PURE__*/ createInterface("ILogConfig", (t => t.instance(new LogConfig("no-colors", V))));

const et = /*@__PURE__*/ createInterface("ISink");

const rt = /*@__PURE__*/ createInterface("ILogEventFactory", (t => t.singleton(DefaultLogEventFactory)));

const nt = /*@__PURE__*/ createInterface("ILogger", (t => t.singleton(ct)));

const st = /*@__PURE__*/ createInterface("ILogScope");

const ot = /*@__PURE__*/ e({
    key: getAnnotationKeyFor("logger-sink-handles"),
    define(t, e) {
        o(e.handles, t, this.key);
    },
    getHandles(t) {
        return s(this.key, t.constructor);
    }
});

const sink = t => (e, r) => r.addInitializer((function() {
    ot.define(this, t);
}));

const it = toLookup({
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

const lt = function() {
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
            TRC: it.grey("TRC"),
            DBG: it.grey("DBG"),
            INF: it.white("INF"),
            WRN: it.yellow("WRN"),
            ERR: it.red("ERR"),
            FTL: it.red("FTL"),
            QQQ: it.grey("???")
        })
    };
    return (e, r) => {
        if (e <= U) {
            return t[r].TRC;
        }
        if (e <= H) {
            return t[r].DBG;
        }
        if (e <= q) {
            return t[r].INF;
        }
        if (e <= V) {
            return t[r].WRN;
        }
        if (e <= J) {
            return t[r].ERR;
        }
        if (e <= X) {
            return t[r].FTL;
        }
        return t[r].QQQ;
    };
}();

const getScopeString = (t, e) => {
    if (e === "no-colors") {
        return t.join(".");
    }
    return t.map(it.cyan).join(".");
};

const getIsoString = (t, e) => {
    if (e === "no-colors") {
        return new Date(t).toISOString();
    }
    return it.grey(new Date(t).toISOString());
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
            return `${getIsoString(s, n)} [${lt(t, n)}] ${e}`;
        }
        return `${getIsoString(s, n)} [${lt(t, n)} ${getScopeString(r, n)}] ${e}`;
    }
    getFormattedLogInfo(t = false) {
        const {severity: e, message: r, scope: n, colorOptions: s, timestamp: o, optionalParams: i} = this;
        let l = null;
        let c = "";
        if (t && r instanceof Error) {
            l = r;
        } else {
            c = r;
        }
        const a = n.length === 0 ? "" : ` ${getScopeString(n, s)}`;
        let u = `${getIsoString(o, s)} [${lt(e, s)}${a}] ${c}`;
        if (i === void 0 || i.length === 0) {
            return l === null ? [ u ] : [ u, l ];
        }
        let f = 0;
        while (u.includes("%s")) {
            u = u.replace("%s", String(i[f++]));
        }
        return l !== null ? [ u, l, ...i.slice(f) ] : [ u, ...i.slice(f) ];
    }
}

class DefaultLogEventFactory {
    constructor() {
        this.config = resolve(tt);
    }
    createLogEvent(t, e, r, n) {
        return new DefaultLogEvent(e, r, n, t.scope, this.config.colorOptions, Date.now());
    }
}

class ConsoleSink {
    static register(t) {
        singletonRegistration(et, ConsoleSink).register(t);
    }
    constructor(t = resolve(j)) {
        const e = t.console;
        this.handleEvent = function emit(t) {
            const r = t.getFormattedLogInfo(true);
            switch (t.severity) {
              case U:
              case H:
                return e.debug(...r);

              case q:
                return e.info(...r);

              case V:
                return e.warn(...r);

              case J:
              case X:
                return e.error(...r);
            }
        };
    }
}

let ct = (() => {
    var t;
    let e = [];
    let r;
    let n;
    let s;
    let o;
    let i;
    let l;
    return t = class DefaultLogger {
        constructor(t = resolve(tt), r = resolve(rt), n = resolve(all(et)), s = resolve(T(st)) ?? [], o = null) {
            this.scope = (__runInitializers(this, e), s);
            this.j = createObject();
            let i;
            let l;
            let c;
            let a;
            let u;
            let f;
            this.config = t;
            this.f = r;
            this.sinks = n;
            if (o === null) {
                this.root = this;
                this.parent = this;
                i = this.M = [];
                l = this.T = [];
                c = this.P = [];
                a = this.K = [];
                u = this.N = [];
                f = this.W = [];
                for (const t of n) {
                    const e = ot.getHandles(t);
                    if (e?.includes(U) ?? true) {
                        i.push(t);
                    }
                    if (e?.includes(H) ?? true) {
                        l.push(t);
                    }
                    if (e?.includes(q) ?? true) {
                        c.push(t);
                    }
                    if (e?.includes(V) ?? true) {
                        a.push(t);
                    }
                    if (e?.includes(J) ?? true) {
                        u.push(t);
                    }
                    if (e?.includes(X) ?? true) {
                        f.push(t);
                    }
                }
            } else {
                this.root = o.root;
                this.parent = o;
                i = this.M = o.M;
                l = this.T = o.T;
                c = this.P = o.P;
                a = this.K = o.K;
                u = this.N = o.N;
                f = this.W = o.W;
            }
        }
        trace(t, ...e) {
            if (this.config.level <= U) {
                this.G(this.M, U, t, e);
            }
        }
        debug(t, ...e) {
            if (this.config.level <= H) {
                this.G(this.T, H, t, e);
            }
        }
        info(t, ...e) {
            if (this.config.level <= q) {
                this.G(this.P, q, t, e);
            }
        }
        warn(t, ...e) {
            if (this.config.level <= V) {
                this.G(this.K, V, t, e);
            }
        }
        error(t, ...e) {
            if (this.config.level <= J) {
                this.G(this.N, J, t, e);
            }
        }
        fatal(t, ...e) {
            if (this.config.level <= X) {
                this.G(this.W, X, t, e);
            }
        }
        scopeTo(e) {
            const r = this.j;
            let n = r[e];
            if (n === void 0) {
                n = r[e] = new t(this.config, this.f, null, this.scope.concat(e), this);
            }
            return n;
        }
        G(t, e, r, n) {
            const s = isFunction(r) ? r() : r;
            const o = this.f.createLogEvent(this, e, s, n);
            for (let e = 0, r = t.length; e < r; ++e) {
                t[e].handleEvent(o);
            }
        }
    }, (() => {
        const c = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        r = [ bound ];
        n = [ bound ];
        s = [ bound ];
        o = [ bound ];
        i = [ bound ];
        l = [ bound ];
        __esDecorate(t, null, r, {
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
        __esDecorate(t, null, n, {
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
        __esDecorate(t, null, o, {
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
        __esDecorate(t, null, i, {
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

const at = /*@__PURE__*/ toLookup({
    create({level: t = V, colorOptions: e = "no-colors", sinks: r = []} = {}) {
        return toLookup({
            register(n) {
                n.register(instanceRegistration(tt, new LogConfig(e, t)));
                for (const t of r) {
                    if (isFunction(t)) {
                        n.register(singletonRegistration(et, t));
                    } else {
                        n.register(t);
                    }
                }
                return n;
            }
        });
    }
});

const ut = /*@__PURE__*/ createInterface((t => t.singleton(ModuleLoader)));

const noTransform = t => t;

class ModuleTransformer {
    constructor(t) {
        this.B = new Map;
        this.U = new Map;
        this.H = t;
    }
    transform(t) {
        if (t instanceof Promise) {
            return this.q(t);
        } else if (typeof t === "object" && t !== null) {
            return this.V(t);
        } else {
            throw createMappedError(21, t);
        }
    }
    q(t) {
        if (this.B.has(t)) {
            return this.B.get(t);
        }
        const e = t.then((t => this.V(t)));
        this.B.set(t, e);
        void e.then((e => {
            this.B.set(t, e);
        }));
        return e;
    }
    V(t) {
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
        let r;
        let n;
        let o;
        const i = [];
        for (const l in t) {
            switch (typeof (e = t[l])) {
              case "object":
                if (e === null) {
                    continue;
                }
                r = isFunction(e.register);
                n = false;
                o = null;
                break;

              case "function":
                r = isFunction(e.register);
                n = e.prototype !== void 0;
                o = s(w, e) ?? null;
                break;

              default:
                continue;
            }
            i.push(new ModuleItem(l, e, r, n, o));
        }
        return new AnalyzedModule(t, i);
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
        this.definition = s;
    }
}

const aliasedResourcesRegistry = (t, e, r = {}) => ({
    register(n) {
        const s = n.get(ut).load(t);
        let o = false;
        s.items.forEach((t => {
            const s = t.definition;
            if (s == null) {
                n.register(t.value);
                return;
            }
            if (!o && e != null) {
                o = true;
                s.register(n, e);
                return;
            }
            const i = r[s.name];
            s.register(n, i);
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

const ft = /*@__PURE__*/ createInterface("IEventAggregator", (t => t.singleton(EventAggregator)));

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

exports.DI = O;

exports.DefaultLogEvent = DefaultLogEvent;

exports.DefaultLogEventFactory = DefaultLogEventFactory;

exports.DefaultLogger = ct;

exports.DefaultResolver = R;

exports.EventAggregator = EventAggregator;

exports.IContainer = E;

exports.IEventAggregator = ft;

exports.ILogConfig = tt;

exports.ILogEventFactory = rt;

exports.ILogger = nt;

exports.IModuleLoader = ut;

exports.IPlatform = j;

exports.IServiceLocator = I;

exports.ISink = et;

exports.InstanceProvider = InstanceProvider;

exports.LogConfig = LogConfig;

exports.LogLevel = Z;

exports.LoggerConfiguration = at;

exports.ModuleItem = ModuleItem;

exports.Protocol = y;

exports.Registrable = x;

exports.Registration = d;

exports.aliasedResourcesRegistry = aliasedResourcesRegistry;

exports.all = all;

exports.allResources = z;

exports.bound = bound;

exports.camelCase = c;

exports.createImplementationRegister = createImplementationRegister;

exports.createResolver = createResolver;

exports.emptyArray = F;

exports.emptyObject = _;

exports.factory = P;

exports.firstDefined = firstDefined;

exports.format = it;

exports.fromAnnotationOrDefinitionOrTypeOrDefault = fromAnnotationOrDefinitionOrTypeOrDefault;

exports.fromAnnotationOrTypeOrDefault = fromAnnotationOrTypeOrDefault;

exports.fromDefinitionOrDefault = fromDefinitionOrDefault;

exports.getPrototypeChain = f;

exports.getResourceKeyFor = getResourceKeyFor;

exports.ignore = S;

exports.inject = inject;

exports.isArrayIndex = i;

exports.isNativeFunction = h;

exports.kebabCase = u;

exports.lazy = M;

exports.mergeArrays = mergeArrays;

exports.newInstanceForScope = G;

exports.newInstanceOf = B;

exports.noop = noop;

exports.onResolve = onResolve;

exports.onResolveAll = onResolveAll;

exports.optional = T;

exports.optionalResource = W;

exports.own = K;

exports.pascalCase = a;

exports.resolve = resolve;

exports.resource = N;

exports.resourceBaseName = w;

exports.singleton = singleton;

exports.sink = sink;

exports.toArray = toArray;

exports.transient = transient;
//# sourceMappingURL=index.cjs.map
