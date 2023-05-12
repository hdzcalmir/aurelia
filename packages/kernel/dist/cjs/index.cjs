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

const createError = t => new Error(t);

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
        let c = 0;
        let l = t.charAt(0);
        let u = charToKind(l);
        let a = 0;
        for (;a < r; ++a) {
            o = c;
            i = l;
            c = u;
            l = t.charAt(a + 1);
            u = charToKind(l);
            if (c === 0) {
                if (s.length > 0) {
                    n = true;
                }
            } else {
                if (!n && s.length > 0 && c === 2) {
                    n = o === 3 || u === 3;
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
            r = t[e] = i(e, callback);
        }
        return r;
    };
}();

const l = /*@__PURE__*/ function() {
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
    throw createError(`No default value found`);
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

const resolveAll = (...t) => {
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

const p = "au:resource";

const hasResources = t => n(p, t);

const getAllResources = t => {
    const e = r(p, t);
    if (e === void 0) {
        return F;
    } else {
        return e.map((e => r(e, t)));
    }
};

const v = Object.freeze({
    name: p,
    appendTo(t, e) {
        const n = r(p, t);
        if (n === void 0) {
            s(p, [ e ], t);
        } else {
            n.push(e);
        }
    },
    has: hasResources,
    getAll: getAllResources,
    getKeys(t) {
        let e = r(p, t);
        if (e === void 0) {
            s(p, e = [], t);
        }
        return e;
    },
    isKey: t => t.startsWith(p),
    keyFor(t, e) {
        if (e === void 0) {
            return `${p}:${t}`;
        }
        return `${p}:${t}:${e}`;
    }
});

const g = {
    annotation: d,
    resource: v
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
        return this.parent === null ? 0 : this.parent.depth + 1;
    }
    constructor(t, e) {
        this.parent = t;
        this.config = e;
        this.id = ++m;
        this.t = 0;
        this.i = new Map;
        if (t === null) {
            this.root = this;
            this.u = new Map;
            this.h = new Map;
            this.res = createObject();
        } else {
            this.root = t.root;
            this.u = new Map;
            this.h = t.h;
            if (e.inheritParentResources) {
                this.res = Object.assign(createObject(), t.res, this.root.res);
            } else {
                this.res = createObject();
            }
        }
        this.u.set(C, R);
    }
    register(...e) {
        if (++this.t === 100) {
            throw registrationError(e);
        }
        let r;
        let n;
        let s;
        let o;
        let i;
        let c = 0;
        let l = e.length;
        for (;c < l; ++c) {
            r = e[c];
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
                T.singleton(r, r).register(this);
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
        --this.t;
        return this;
    }
    registerResolver(t, e, r = false) {
        validateKey(t);
        const n = this.u;
        const s = n.get(t);
        if (s == null) {
            n.set(t, e);
            if (isResourceKey(t)) {
                if (this.res[t] !== void 0) {
                    throw resourceExistError(t);
                }
                this.res[t] = e;
            }
        } else if (s instanceof Resolver && s.R === 4) {
            s._state.push(e);
        } else {
            n.set(t, new Resolver(t, 4, [ s, e ]));
        }
        if (r) {
            this.i.set(t, e);
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
                s = n.u.get(t);
                if (s == null) {
                    if (n.parent == null) {
                        o = isRegisterInRequester(t) ? this : n;
                        if (e) {
                            return this.$(t, o);
                        }
                        return null;
                    }
                    n = n.parent;
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
        return this.u.has(t) ? true : e && this.parent != null ? this.parent.has(t, true) : false;
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
                n = r.u.get(t);
                if (n == null) {
                    if (r.parent == null) {
                        s = isRegisterInRequester(t) ? this : r;
                        n = this.$(t, s);
                        return n.resolve(r, this);
                    }
                    r = r.parent;
                } else {
                    return n.resolve(r, this);
                }
            }
        } finally {
            x = e;
        }
        throw cantResolveKeyError(t);
    }
    getAll(t, e = false) {
        validateKey(t);
        const r = x;
        const n = x = this;
        let s = n;
        let o;
        let i = F;
        try {
            if (e) {
                while (s != null) {
                    o = s.u.get(t);
                    if (o != null) {
                        i = i.concat(buildAllResponse(o, s, n));
                    }
                    s = s.parent;
                }
                return i;
            }
            while (s != null) {
                o = s.u.get(t);
                if (o == null) {
                    s = s.parent;
                    if (s == null) {
                        return F;
                    }
                } else {
                    return buildAllResponse(o, s, n);
                }
            }
        } finally {
            x = r;
        }
        return F;
    }
    invoke(t, e) {
        const r = x;
        x = this;
        try {
            if (f(t)) {
                throw createNativeInvocationError(t);
            }
            return e === void 0 ? new t(...getDependencies(t).map(containerGetKey, this)) : new t(...getDependencies(t).map(containerGetKey, this), ...e);
        } finally {
            x = r;
        }
    }
    getFactory(t) {
        let e = this.h.get(t);
        if (e === void 0) {
            if (f(t)) {
                throw createNativeInvocationError(t);
            }
            this.h.set(t, e = new Factory(t, getDependencies(t)));
        }
        return e;
    }
    registerFactory(t, e) {
        this.h.set(t, e);
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
        if (this.i.size > 0) {
            this.disposeResolvers();
        }
        this.u.clear();
    }
    $(t, e) {
        if (!isFunction(t)) {
            throw jitRegisterNonFunctionError(t);
        }
        if (y.has(t.name)) {
            throw jitInstrinsicTypeError(t);
        }
        if (isRegistry(t)) {
            const r = t.register(e, t);
            if (!(r instanceof Object) || r.resolve == null) {
                const r = e.u.get(t);
                if (r != null) {
                    return r;
                }
                throw invalidResolverFromRegisterError();
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
            const n = e.u.get(t);
            if (n != null) {
                return n;
            }
            throw invalidResolverFromRegisterError();
        }
        if (t.$isInterface) {
            throw jitInterfaceError(t.friendlyName);
        }
        const r = this.config.defaultResolver(t, e);
        e.u.set(t, r);
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
        {
            throw createError(`AUR0014`);
        }
    }
}

function containerGetKey(t) {
    return this.get(t);
}

function resolve(...t) {
    if (x == null) {
        throw createInvalidResolveCallError();
    }
    return t.length === 1 ? x.get(t[0]) : t.map(containerGetKey, x);
}

const buildAllResponse = (t, e, r) => {
    if (t instanceof Resolver && t.R === 4) {
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

const registrationError = t => createError(`AUR0006:${t.map(e)}`);

const resourceExistError = t => createError(`AUR0007:${e(t)}`);

const cantResolveKeyError = t => createError(`AUR0008:${e(t)}`);

const jitRegisterNonFunctionError = t => createError(`AUR0009:${e(t)}`);

const jitInstrinsicTypeError = t => createError(`AUR0010:${t.name}`);

const invalidResolverFromRegisterError = () => createError(`AUR0011`);

const jitInterfaceError = t => createError(`AUR0012:${t}`);

const createNativeInvocationError = t => createError(`AUR0015:${t.name}`);

const createInvalidResolveCallError = () => createError(`AUR0016`);

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
        return this.A(0, t);
    }
    singleton(t) {
        return this.A(1, t);
    }
    transient(t) {
        return this.A(2, t);
    }
    callback(t) {
        return this.A(3, t);
    }
    cachedCallback(t) {
        return this.A(3, cacheCallbackResult(t));
    }
    aliasTo(t) {
        return this.A(5, t);
    }
    A(t, e) {
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

const $ = {
    none(t) {
        throw noResolverForKeyError(t);
    },
    singleton: t => new Resolver(t, 1, t),
    transient: t => new Resolver(t, 2, t)
};

const noResolverForKeyError = t => createError(`AUR0002:${e(t)}`);

class ContainerConfiguration {
    constructor(t, e) {
        this.inheritParentResources = t;
        this.defaultResolver = e;
    }
    static from(t) {
        if (t === void 0 || t === ContainerConfiguration.DEFAULT) {
            return ContainerConfiguration.DEFAULT;
        }
        return new ContainerConfiguration(t.inheritParentResources ?? false, t.defaultResolver ?? $.singleton);
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
                let c;
                o = 0;
                t = i.length;
                for (o = 0; o < t; ++o) {
                    c = i[o];
                    if (!isArrayIndex(c)) {
                        n[c] = r[c];
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
            throw createNoRegistrationError(n);
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

const createNoRegistrationError = t => createError(`AUR0001:${t}`);

const A = {
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
            const r = T.transient(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = j) {
        t.register = function(e) {
            const r = T.singleton(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

const C = /*@__PURE__*/ createInterface("IContainer");

const _ = C;

function createResolver(t) {
    return function(e) {
        const resolver = function(t, e, r) {
            O(resolver)(t, e, r);
        };
        resolver.$isResolver = true;
        resolver.resolve = function(r, n) {
            return t(e, r, n);
        };
        return resolver;
    };
}

const O = A.inject;

function transientDecorator(t) {
    return A.transient(t);
}

function transient(t) {
    return t == null ? transientDecorator : transientDecorator(t);
}

const j = {
    scoped: false
};

const D = A.singleton;

function singleton(t) {
    if (isFunction(t)) {
        return D(t);
    }
    return function(e) {
        return D(e, t);
    };
}

const all = (t, e = false) => {
    function resolver(t, e, r) {
        O(resolver)(t, e, r);
    }
    resolver.$isResolver = true;
    resolver.resolve = (r, n) => n.getAll(t, e);
    return resolver;
};

const I = /*@__PURE__*/ createResolver(((t, e, r) => () => r.get(t)));

const k = /*@__PURE__*/ createResolver(((t, e, r) => {
    if (r.has(t, true)) {
        return r.get(t);
    } else {
        return undefined;
    }
}));

const ignore = (t, e, r) => {
    O(ignore)(t, e, r);
};

ignore.$isResolver = true;

ignore.resolve = () => undefined;

const E = /*@__PURE__*/ createResolver(((t, e, r) => (...n) => e.getFactory(t).construct(r, n)));

const L = /*@__PURE__*/ createResolver(((t, r, n) => {
    const s = createNewInstance(t, r, n);
    const o = new InstanceProvider(e(t), s);
    n.registerResolver(t, o, true);
    return s;
}));

const M = /*@__PURE__*/ createResolver(((t, e, r) => createNewInstance(t, e, r)));

const createNewInstance = (t, e, r) => e.getFactory(t).construct(r);

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
            {
                if (this.resolving) {
                    throw cyclicDependencyError(this._state.name);
                }
                this.resolving = true;
                this._state = t.getFactory(this._state).construct(e);
                this.R = 0;
                this.resolving = false;
                return this._state;
            }

          case 2:
            {
                const r = t.getFactory(this._state);
                if (r === null) {
                    throw nullFactoryError(this.k);
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
            throw invalidResolverStrategyError(this.R);
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

const cyclicDependencyError = t => createError(`AUR0003:${t}`);

const nullFactoryError = t => createError(`AUR0004:${e(t)}`);

const invalidResolverStrategyError = t => createError(`AUR0005:${t}`);

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

const T = {
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
        return this.C;
    }
    constructor(t, e) {
        this._ = null;
        this.C = t;
        if (e !== void 0) {
            this._ = e;
        }
    }
    prepare(t) {
        this._ = t;
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        if (this._ == null) {
            throw noInstanceError(this.C);
        }
        return this._;
    }
    dispose() {
        this._ = null;
    }
}

const noInstanceError = t => {
    {
        return createError(`AUR0013:${t}`);
    }
};

const F = Object.freeze([]);

const U = Object.freeze({});

function noop() {}

const P = /*@__PURE__*/ createInterface("IPlatform");

function __decorate(t, e, r, n) {
    var s = arguments.length, o = s < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, i;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") o = Reflect.decorate(t, e, r, n); else for (var c = t.length - 1; c >= 0; c--) if (i = t[c]) o = (s < 3 ? i(o) : s > 3 ? i(e, r, o) : i(e, r)) || o;
    return s > 3 && o && Object.defineProperty(e, r, o), o;
}

function __param(t, e) {
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

const S = /*@__PURE__*/ createInterface("ILogConfig", (t => t.instance(new LogConfig(0, 3))));

const K = /*@__PURE__*/ createInterface("ISink");

const N = /*@__PURE__*/ createInterface("ILogEventFactory", (t => t.singleton(exports.DefaultLogEventFactory)));

const G = /*@__PURE__*/ createInterface("ILogger", (t => t.singleton(exports.DefaultLogger)));

const W = /*@__PURE__*/ createInterface("ILogScope");

const B = Object.freeze({
    key: getAnnotationKeyFor("logger-sink-handles"),
    define(t, e) {
        s(this.key, e.handles, t.prototype);
        return t;
    },
    getHandles(e) {
        return t.Metadata.get(this.key, e);
    }
});

const sink = t => e => B.define(e, t);

const z = toLookup({
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

const Q = function() {
    const t = [ toLookup({
        TRC: "TRC",
        DBG: "DBG",
        INF: "INF",
        WRN: "WRN",
        ERR: "ERR",
        FTL: "FTL",
        QQQ: "???"
    }), toLookup({
        TRC: z.grey("TRC"),
        DBG: z.grey("DBG"),
        INF: z.white("INF"),
        WRN: z.yellow("WRN"),
        ERR: z.red("ERR"),
        FTL: z.red("FTL"),
        QQQ: z.grey("???")
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
    return t.map(z.cyan).join(".");
};

const getIsoString = (t, e) => {
    if (e === 0) {
        return new Date(t).toISOString();
    }
    return z.grey(new Date(t).toISOString());
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
            return `${getIsoString(s, n)} [${Q(t, n)}] ${e}`;
        }
        return `${getIsoString(s, n)} [${Q(t, n)} ${getScopeString(r, n)}] ${e}`;
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

exports.DefaultLogEventFactory = __decorate([ __param(0, S) ], exports.DefaultLogEventFactory);

exports.ConsoleSink = class ConsoleSink {
    static register(t) {
        singletonRegistration(K, ConsoleSink).register(t);
    }
    constructor(t) {
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
};

exports.ConsoleSink = __decorate([ __param(0, P) ], exports.ConsoleSink);

exports.DefaultLogger = class DefaultLogger {
    constructor(t, e, r, n = [], s = null) {
        this.scope = n;
        this.O = createObject();
        let o;
        let i;
        let c;
        let l;
        let u;
        let a;
        this.config = t;
        this.f = e;
        this.sinks = r;
        if (s === null) {
            this.root = this;
            this.parent = this;
            o = this.j = [];
            i = this.I = [];
            c = this.L = [];
            l = this.M = [];
            u = this.T = [];
            a = this.F = [];
            for (const t of r) {
                const e = B.getHandles(t);
                if (e?.includes(0) ?? true) {
                    o.push(t);
                }
                if (e?.includes(1) ?? true) {
                    i.push(t);
                }
                if (e?.includes(2) ?? true) {
                    c.push(t);
                }
                if (e?.includes(3) ?? true) {
                    l.push(t);
                }
                if (e?.includes(4) ?? true) {
                    u.push(t);
                }
                if (e?.includes(5) ?? true) {
                    a.push(t);
                }
            }
        } else {
            this.root = s.root;
            this.parent = s;
            o = this.j = s.j;
            i = this.I = s.I;
            c = this.L = s.L;
            l = this.M = s.M;
            u = this.T = s.T;
            a = this.F = s.F;
        }
    }
    trace(t, ...e) {
        if (this.config.level <= 0) {
            this.U(this.j, 0, t, e);
        }
    }
    debug(t, ...e) {
        if (this.config.level <= 1) {
            this.U(this.I, 1, t, e);
        }
    }
    info(t, ...e) {
        if (this.config.level <= 2) {
            this.U(this.L, 2, t, e);
        }
    }
    warn(t, ...e) {
        if (this.config.level <= 3) {
            this.U(this.M, 3, t, e);
        }
    }
    error(t, ...e) {
        if (this.config.level <= 4) {
            this.U(this.T, 4, t, e);
        }
    }
    fatal(t, ...e) {
        if (this.config.level <= 5) {
            this.U(this.F, 5, t, e);
        }
    }
    scopeTo(t) {
        const e = this.O;
        let r = e[t];
        if (r === void 0) {
            r = e[t] = new DefaultLogger(this.config, this.f, void 0, this.scope.concat(t), this);
        }
        return r;
    }
    U(t, e, r, n) {
        const s = isFunction(r) ? r() : r;
        const o = this.f.createLogEvent(this, e, s, n);
        for (let e = 0, r = t.length; e < r; ++e) {
            t[e].handleEvent(o);
        }
    }
};

__decorate([ bound ], exports.DefaultLogger.prototype, "trace", null);

__decorate([ bound ], exports.DefaultLogger.prototype, "debug", null);

__decorate([ bound ], exports.DefaultLogger.prototype, "info", null);

__decorate([ bound ], exports.DefaultLogger.prototype, "warn", null);

__decorate([ bound ], exports.DefaultLogger.prototype, "error", null);

__decorate([ bound ], exports.DefaultLogger.prototype, "fatal", null);

exports.DefaultLogger = __decorate([ __param(0, S), __param(1, N), __param(2, all(K)), __param(3, k(W)), __param(4, ignore) ], exports.DefaultLogger);

const H = toLookup({
    create({level: t = 3, colorOptions: e = 0, sinks: r = []} = {}) {
        return toLookup({
            register(n) {
                n.register(instanceRegistration(S, new LogConfig(e, t)));
                for (const t of r) {
                    if (isFunction(t)) {
                        n.register(singletonRegistration(K, t));
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
        this.P = new Map;
        this.K = new Map;
        this.N = t;
    }
    transform(t) {
        if (t instanceof Promise) {
            return this.G(t);
        } else if (typeof t === "object" && t !== null) {
            return this.W(t);
        } else {
            throw createError(`Invalid input: ${String(t)}. Expected Promise or Object.`);
        }
    }
    G(t) {
        if (this.P.has(t)) {
            return this.P.get(t);
        }
        const e = t.then((t => this.W(t)));
        this.P.set(t, e);
        void e.then((e => {
            this.P.set(t, e);
        }));
        return e;
    }
    W(t) {
        if (this.K.has(t)) {
            return this.K.get(t);
        }
        const e = this.N(this.B(t));
        this.K.set(t, e);
        if (e instanceof Promise) {
            void e.then((e => {
                this.K.set(t, e);
            }));
        }
        return e;
    }
    B(t) {
        if (t == null) throw new Error(`Invalid input: ${String(t)}. Expected Object.`);
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
                s = F;
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
            throw createError(`Invalid channel name or instance: ${t}.`);
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
            throw createError(`Invalid channel name or type: ${t}.`);
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

exports.ContainerConfiguration = ContainerConfiguration;

exports.DI = A;

exports.DefaultLogEvent = DefaultLogEvent;

exports.DefaultResolver = $;

exports.EventAggregator = EventAggregator;

exports.IContainer = C;

exports.IEventAggregator = V;

exports.ILogConfig = S;

exports.ILogEventFactory = N;

exports.ILogger = G;

exports.IModuleLoader = q;

exports.IPlatform = P;

exports.IServiceLocator = _;

exports.ISink = K;

exports.InstanceProvider = InstanceProvider;

exports.LogConfig = LogConfig;

exports.LoggerConfiguration = H;

exports.ModuleItem = ModuleItem;

exports.Protocol = g;

exports.Registration = T;

exports.all = all;

exports.bound = bound;

exports.camelCase = c;

exports.emptyArray = F;

exports.emptyObject = U;

exports.factory = E;

exports.firstDefined = firstDefined;

exports.format = z;

exports.fromAnnotationOrDefinitionOrTypeOrDefault = fromAnnotationOrDefinitionOrTypeOrDefault;

exports.fromAnnotationOrTypeOrDefault = fromAnnotationOrTypeOrDefault;

exports.fromDefinitionOrDefault = fromDefinitionOrDefault;

exports.getPrototypeChain = a;

exports.ignore = ignore;

exports.inject = O;

exports.isArrayIndex = isArrayIndex;

exports.isNativeFunction = f;

exports.kebabCase = u;

exports.lazy = I;

exports.mergeArrays = mergeArrays;

exports.newInstanceForScope = L;

exports.newInstanceOf = M;

exports.noop = noop;

exports.onResolve = onResolve;

exports.optional = k;

exports.pascalCase = l;

exports.resolve = resolve;

exports.resolveAll = resolveAll;

exports.singleton = singleton;

exports.sink = sink;

exports.toArray = toArray;

exports.transient = transient;
//# sourceMappingURL=index.cjs.map
