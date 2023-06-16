import { Metadata as t, isObject as e, applyMetadataPolyfill as n } from "@aurelia/metadata";

const r = String;

const s = t.getOwn;

const i = t.hasOwn;

const o = t.define;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const createObject = () => Object.create(null);

const createMappedError = (t, ...e) => new Error(`AUR${r(t).padStart(4, "0")}:${e.map(r)}`);

const l = {};

const isArrayIndex = t => {
    switch (typeof t) {
      case "number":
        return t >= 0 && (t | 0) === t;

      case "string":
        {
            const e = l[t];
            if (e !== void 0) {
                return e;
            }
            const n = t.length;
            if (n === 0) {
                return l[t] = false;
            }
            let r = 0;
            let s = 0;
            for (;s < n; ++s) {
                r = charCodeAt(t, s);
                if (s === 0 && r === 48 && n > 1 || r < 48 || r > 57) {
                    return l[t] = false;
                }
            }
            return l[t] = true;
        }

      default:
        return false;
    }
};

const c = /*@__PURE__*/ function() {
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
        let i;
        let o = "";
        let l = 0;
        let c = t.charAt(0);
        let u = charToKind(c);
        let a = 0;
        for (;a < n; ++a) {
            i = l;
            o = c;
            l = u;
            c = t.charAt(a + 1);
            u = charToKind(c);
            if (l === 0) {
                if (s.length > 0) {
                    r = true;
                }
            } else {
                if (!r && s.length > 0 && l === 2) {
                    r = i === 3 || u === 3;
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
            n = t[e] = c(e, callback);
        }
        return n;
    };
}();

const a = /*@__PURE__*/ function() {
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

const f = /*@__PURE__*/ function() {
    const t = createObject();
    const callback = (t, e) => e ? `-${t.toLowerCase()}` : t.toLowerCase();
    return e => {
        let n = t[e];
        if (n === void 0) {
            n = t[e] = c(e, callback);
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

const h = /*@__PURE__*/ function() {
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
    return Object.assign(createObject(), ...t);
}

const d = /*@__PURE__*/ function() {
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

const v = "au:annotation";

const getAnnotationKeyFor = (t, e) => {
    if (e === void 0) {
        return `${v}:${t}`;
    }
    return `${v}:${t}:${e}`;
};

const appendAnnotation = (t, e) => {
    const n = s(v, t);
    if (n === void 0) {
        o(v, [ e ], t);
    } else {
        n.push(e);
    }
};

const g = Object.freeze({
    name: "au:annotation",
    appendTo: appendAnnotation,
    set(t, e, n) {
        o(getAnnotationKeyFor(e), n, t);
    },
    get: (t, e) => s(getAnnotationKeyFor(e), t),
    getKeys(t) {
        let e = s(v, t);
        if (e === void 0) {
            o(v, e = [], t);
        }
        return e;
    },
    isKey: t => t.startsWith(v),
    keyFor: getAnnotationKeyFor
});

const w = "au:resource";

const hasResources = t => i(w, t);

const getAllResources = t => {
    const e = s(w, t);
    if (e === void 0) {
        return S;
    } else {
        return e.map((e => s(e, t)));
    }
};

const y = Object.freeze({
    name: w,
    appendTo(t, e) {
        const n = s(w, t);
        if (n === void 0) {
            o(w, [ e ], t);
        } else {
            n.push(e);
        }
    },
    has: hasResources,
    getAll: getAllResources,
    getKeys(t) {
        let e = s(w, t);
        if (e === void 0) {
            o(w, e = [], t);
        }
        return e;
    },
    isKey: t => t.startsWith(w),
    keyFor(t, e) {
        if (e === void 0) {
            return `${w}:${t}`;
        }
        return `${w}:${t}:${e}`;
    }
});

const p = {
    annotation: g,
    resource: y
};

const m = Object.prototype.hasOwnProperty;

function fromAnnotationOrDefinitionOrTypeOrDefault(t, e, n, r) {
    let i = s(getAnnotationKeyFor(t), n);
    if (i === void 0) {
        i = e[t];
        if (i === void 0) {
            i = n[t];
            if (i === void 0 || !m.call(n, t)) {
                return r();
            }
            return i;
        }
        return i;
    }
    return i;
}

function fromAnnotationOrTypeOrDefault(t, e, n) {
    let r = s(getAnnotationKeyFor(t), e);
    if (r === void 0) {
        r = e[t];
        if (r === void 0 || !m.call(e, t)) {
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

const R = new Set("Array ArrayBuffer Boolean DataView Date Error EvalError Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Number Object Promise RangeError ReferenceError RegExp Set SharedArrayBuffer String SyntaxError TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array URIError WeakMap WeakSet".split(" "));

let b = 0;

let C = null;

class Container {
    get depth() {
        return this.parent === null ? 0 : this.parent.depth + 1;
    }
    constructor(t, e) {
        this.parent = t;
        this.config = e;
        this.id = ++b;
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
        this.u.set(A, D);
    }
    register(...t) {
        if (++this.t === 100) {
            throw createMappedError(6, ...t);
        }
        let n;
        let r;
        let s;
        let i;
        let o;
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
                    i = 0;
                    o = t.length;
                    while (o > i) {
                        t[i].register(this);
                        ++i;
                    }
                }
            } else if (isClass(n)) {
                K.singleton(n, n).register(this);
            } else {
                r = Object.keys(n);
                i = 0;
                o = r.length;
                for (;i < o; ++i) {
                    s = n[r[i]];
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
        --this.t;
        return this;
    }
    registerResolver(t, e, n = false) {
        validateKey(t);
        const r = this.u;
        const s = r.get(t);
        if (s == null) {
            r.set(t, e);
            if (isResourceKey(t)) {
                if (this.res[t] !== void 0) {
                    throw createMappedError(7, t);
                }
                this.res[t] = e;
            }
        } else if (s instanceof Resolver && s.R === 4) {
            s._state.push(e);
        } else {
            r.set(t, new Resolver(t, 4, [ s, e ]));
        }
        if (n) {
            this.i.set(t, e);
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
        const n = C;
        let r = C = this;
        let s;
        let i;
        try {
            while (r != null) {
                s = r.u.get(t);
                if (s == null) {
                    if (r.parent == null) {
                        i = isRegisterInRequester(t) ? this : r;
                        if (e) {
                            return this.C(t, i);
                        }
                        return null;
                    }
                    r = r.parent;
                } else {
                    return s;
                }
            }
        } finally {
            C = n;
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
        const e = C;
        let n = C = this;
        let r;
        let s;
        try {
            while (n != null) {
                r = n.u.get(t);
                if (r == null) {
                    if (n.parent == null) {
                        s = isRegisterInRequester(t) ? this : n;
                        r = this.C(t, s);
                        return r.resolve(n, this);
                    }
                    n = n.parent;
                } else {
                    return r.resolve(n, this);
                }
            }
        } finally {
            C = e;
        }
        throw createMappedError(8, t);
    }
    getAll(t, e = false) {
        validateKey(t);
        const n = C;
        const r = C = this;
        let s = r;
        let i;
        let o = S;
        try {
            if (e) {
                while (s != null) {
                    i = s.u.get(t);
                    if (i != null) {
                        o = o.concat(buildAllResponse(i, s, r));
                    }
                    s = s.parent;
                }
                return o;
            }
            while (s != null) {
                i = s.u.get(t);
                if (i == null) {
                    s = s.parent;
                    if (s == null) {
                        return S;
                    }
                } else {
                    return buildAllResponse(i, s, r);
                }
            }
        } finally {
            C = n;
        }
        return S;
    }
    invoke(t, e) {
        const n = C;
        C = this;
        try {
            if (d(t)) {
                throw createMappedError(15, t);
            }
            return e === void 0 ? new t(...getDependencies(t).map(containerGetKey, this)) : new t(...getDependencies(t).map(containerGetKey, this), ...e);
        } finally {
            C = n;
        }
    }
    hasFactory(t) {
        return this.h.has(t);
    }
    getFactory(t) {
        let e = this.h.get(t);
        if (e === void 0) {
            if (d(t)) {
                throw createMappedError(15, t);
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
            const n = s(t.name, e.Type);
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
        if (this.i.size > 0) {
            this.disposeResolvers();
        }
        this.u.clear();
    }
    C(t, e) {
        if (!isFunction(t)) {
            throw createMappedError(9, t);
        }
        if (R.has(t.name)) {
            throw createMappedError(10, t);
        }
        if (isRegistry(t)) {
            const n = t.register(e, t);
            if (!(n instanceof Object) || n.resolve == null) {
                const n = e.u.get(t);
                if (n != null) {
                    return n;
                }
                throw createMappedError(11, t);
            }
            return n;
        }
        if (hasResources(t)) {
            const n = getAllResources(t);
            if (n.length === 1) {
                n[0].register(e);
            } else {
                const t = n.length;
                for (let r = 0; r < t; ++r) {
                    n[r].register(e);
                }
            }
            const r = e.u.get(t);
            if (r != null) {
                return r;
            }
            throw createMappedError(11, t);
        }
        if (t.$isInterface) {
            throw createMappedError(12, t.friendlyName);
        }
        const n = this.config.defaultResolver(t, e);
        e.u.set(t, n);
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
        const n = C;
        C = t;
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
            C = n;
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
    if (C == null) {
        throw createMappedError(16, ...t);
    }
    return t.length === 1 ? C.get(t[0]) : t.map(containerGetKey, C);
}

const buildAllResponse = (t, e, n) => {
    if (t instanceof Resolver && t.R === 4) {
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

const instanceRegistration = (t, e) => new Resolver(t, 0, e);

const singletonRegistration = (t, e) => new Resolver(t, 1, e);

const transientRegistation = (t, e) => new Resolver(t, 2, e);

const callbackRegistration = (t, e) => new Resolver(t, 3, e);

const cachedCallbackRegistration = (t, e) => new Resolver(t, 3, cacheCallbackResult(e));

const aliasToRegistration = (t, e) => new Resolver(e, 5, t);

const deferRegistration = (t, ...e) => new ParameterizedRegistry(t, e);

const L = new WeakMap;

const cacheCallbackResult = t => (e, n, r) => {
    let s = L.get(e);
    if (s === void 0) {
        L.set(e, s = new WeakMap);
    }
    if (s.has(r)) {
        return s.get(r);
    }
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
        return this.L(0, t);
    }
    singleton(t) {
        return this.L(1, t);
    }
    transient(t) {
        return this.L(2, t);
    }
    callback(t) {
        return this.L(3, t);
    }
    cachedCallback(t) {
        return this.L(3, cacheCallbackResult(t));
    }
    aliasTo(t) {
        return this.L(5, t);
    }
    L(t, e) {
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
    return s(e, t);
};

const getDesignParamtypes = t => s("design:paramtypes", t);

const getOrCreateAnnotationParamTypes = t => {
    const e = getAnnotationKeyFor("di:paramtypes");
    let n = s(e, t);
    if (n === void 0) {
        o(e, n = [], t);
        appendAnnotation(t, e);
    }
    return n;
};

const getDependencies = t => {
    const e = getAnnotationKeyFor("di:dependencies");
    let n = s(e, t);
    if (n === void 0) {
        const r = t.inject;
        if (r === void 0) {
            const e = $.getDesignParamtypes(t);
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
                    if (!isArrayIndex(l)) {
                        n[l] = r[l];
                    }
                }
            }
        } else {
            n = cloneArrayWithPossibleProps(r);
        }
        o(e, n, t);
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

const $ = {
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
                let i = 0;
                for (;i < t.length; ++i) {
                    s = t[i];
                    if (s !== void 0) {
                        n[i] = s;
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
            const n = K.transient(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = E) {
        t.register = function(e) {
            const n = K.singleton(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

const A = /*@__PURE__*/ createInterface("IContainer");

const k = A;

function createResolver(t) {
    return function(e) {
        const resolver = function(t, e, n) {
            j(resolver)(t, e, n);
        };
        resolver.$isResolver = true;
        resolver.resolve = function(n, r) {
            return t(e, n, r);
        };
        return resolver;
    };
}

const j = $.inject;

function transientDecorator(t) {
    return $.transient(t);
}

function transient(t) {
    return t == null ? transientDecorator : transientDecorator(t);
}

const E = {
    scoped: false
};

const I = $.singleton;

function singleton(t) {
    if (isFunction(t)) {
        return I(t);
    }
    return function(e) {
        return I(e, t);
    };
}

const all = (t, e = false) => {
    function resolver(t, e, n) {
        j(resolver)(t, e, n);
    }
    resolver.$isResolver = true;
    resolver.resolve = (n, r) => r.getAll(t, e);
    return resolver;
};

const F = /*@__PURE__*/ createResolver(((t, e, n) => () => n.get(t)));

const M = /*@__PURE__*/ createResolver(((t, e, n) => {
    if (n.has(t, true)) {
        return n.get(t);
    } else {
        return undefined;
    }
}));

const ignore = (t, e, n) => {
    j(ignore)(t, e, n);
};

ignore.$isResolver = true;

ignore.resolve = () => undefined;

const T = /*@__PURE__*/ createResolver(((t, e, n) => (...r) => e.getFactory(t).construct(n, r)));

const _ = /*@__PURE__*/ createResolver(((t, e, n) => {
    const s = createNewInstance(t, e, n);
    const i = new InstanceProvider(r(t), s);
    n.registerResolver(t, i, true);
    return s;
}));

const P = /*@__PURE__*/ createResolver(((t, e, n) => createNewInstance(t, e, n)));

const createNewInstance = (t, e, n) => {
    if (e.hasFactory(t)) {
        return e.getFactory(t).construct(n);
    }
    if (isInterface(t)) {
        const r = isFunction(t.register);
        const s = e.getResolver(t, r);
        const i = s?.getFactory?.(e);
        if (i != null) {
            return i.construct(n);
        }
        throw createMappedError(17, t);
    }
    return e.getFactory(t).construct(n);
};

class Resolver {
    constructor(t, e, n) {
        this.resolving = false;
        this.k = t;
        this.R = e;
        this._state = n;
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
                    throw createMappedError(3, this._state.name);
                }
                this.resolving = true;
                this._state = t.getFactory(this._state).construct(e);
                this.R = 0;
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
            throw createMappedError(5, this.R);
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

const K = {
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
        this.$ = null;
        this.O = t;
        if (e !== void 0) {
            this.$ = e;
        }
    }
    prepare(t) {
        this.$ = t;
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        if (this.$ == null) {
            throw createMappedError(13, this.O);
        }
        return this.$;
    }
    dispose() {
        this.$ = null;
    }
}

const isInterface = t => isFunction(t) && t.$isInterface === true;

const S = Object.freeze([]);

const G = Object.freeze({});

function noop() {}

const N = /*@__PURE__*/ createInterface("IPlatform");

function __decorate(t, e, n, r) {
    var s = arguments.length, i = s < 3 ? e : r === null ? r = Object.getOwnPropertyDescriptor(e, n) : r, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") i = Reflect.decorate(t, e, n, r); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) i = (s < 3 ? o(i) : s > 3 ? o(e, n, i) : o(e, n)) || i;
    return s > 3 && i && Object.defineProperty(e, n, i), i;
}

var W;

(function(t) {
    t[t["trace"] = 0] = "trace";
    t[t["debug"] = 1] = "debug";
    t[t["info"] = 2] = "info";
    t[t["warn"] = 3] = "warn";
    t[t["error"] = 4] = "error";
    t[t["fatal"] = 5] = "fatal";
    t[t["none"] = 6] = "none";
})(W || (W = {}));

var B;

(function(t) {
    t[t["noColors"] = 0] = "noColors";
    t[t["colors"] = 1] = "colors";
})(B || (B = {}));

const z = /*@__PURE__*/ createInterface("ILogConfig", (t => t.instance(new LogConfig(0, 3))));

const Q = /*@__PURE__*/ createInterface("ISink");

const U = /*@__PURE__*/ createInterface("ILogEventFactory", (t => t.singleton(DefaultLogEventFactory)));

const x = /*@__PURE__*/ createInterface("ILogger", (t => t.singleton(DefaultLogger)));

const H = /*@__PURE__*/ createInterface("ILogScope");

const V = Object.freeze({
    key: getAnnotationKeyFor("logger-sink-handles"),
    define(t, e) {
        o(this.key, e.handles, t.prototype);
        return t;
    },
    getHandles(e) {
        return t.get(this.key, e);
    }
});

const sink = t => e => V.define(e, t);

const q = toLookup({
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

const J = function() {
    const t = [ toLookup({
        TRC: "TRC",
        DBG: "DBG",
        INF: "INF",
        WRN: "WRN",
        ERR: "ERR",
        FTL: "FTL",
        QQQ: "???"
    }), toLookup({
        TRC: q.grey("TRC"),
        DBG: q.grey("DBG"),
        INF: q.white("INF"),
        WRN: q.yellow("WRN"),
        ERR: q.red("ERR"),
        FTL: q.red("FTL"),
        QQQ: q.grey("???")
    }) ];
    return (e, n) => {
        if (e <= 0) {
            return t[n].TRC;
        }
        if (e <= 1) {
            return t[n].DBG;
        }
        if (e <= 2) {
            return t[n].INF;
        }
        if (e <= 3) {
            return t[n].WRN;
        }
        if (e <= 4) {
            return t[n].ERR;
        }
        if (e <= 5) {
            return t[n].FTL;
        }
        return t[n].QQQ;
    };
}();

const getScopeString = (t, e) => {
    if (e === 0) {
        return t.join(".");
    }
    return t.map(q.cyan).join(".");
};

const getIsoString = (t, e) => {
    if (e === 0) {
        return new Date(t).toISOString();
    }
    return q.grey(new Date(t).toISOString());
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
            return `${getIsoString(s, r)} [${J(t, r)}] ${e}`;
        }
        return `${getIsoString(s, r)} [${J(t, r)} ${getScopeString(n, r)}] ${e}`;
    }
}

class DefaultLogEventFactory {
    constructor() {
        this.config = resolve(z);
    }
    createLogEvent(t, e, n, r) {
        return new DefaultLogEvent(e, n, r, t.scope, this.config.colorOptions, Date.now());
    }
}

class ConsoleSink {
    static register(t) {
        singletonRegistration(Q, ConsoleSink).register(t);
    }
    constructor(t = resolve(N)) {
        const e = t.console;
        this.handleEvent = function emit(t) {
            const n = t.optionalParams;
            if (n === void 0 || n.length === 0) {
                const n = t.toString();
                switch (t.severity) {
                  case 0:
                  case 1:
                    return e.debug(n);

                  case 2:
                    return e.info(n);

                  case 3:
                    return e.warn(n);

                  case 4:
                  case 5:
                    return e.error(n);
                }
            } else {
                let r = t.toString();
                let s = 0;
                while (r.includes("%s")) {
                    r = r.replace("%s", String(n[s++]));
                }
                switch (t.severity) {
                  case 0:
                  case 1:
                    return e.debug(r, ...n.slice(s));

                  case 2:
                    return e.info(r, ...n.slice(s));

                  case 3:
                    return e.warn(r, ...n.slice(s));

                  case 4:
                  case 5:
                    return e.error(r, ...n.slice(s));
                }
            }
        };
    }
}

class DefaultLogger {
    constructor(t = resolve(z), e = resolve(U), n = resolve(all(Q)), r = resolve(M(H)) ?? [], s = null) {
        this.scope = r;
        this.A = createObject();
        let i;
        let o;
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
            i = this.j = [];
            o = this.I = [];
            l = this.F = [];
            c = this.M = [];
            u = this.T = [];
            a = this._ = [];
            for (const t of n) {
                const e = V.getHandles(t);
                if (e?.includes(0) ?? true) {
                    i.push(t);
                }
                if (e?.includes(1) ?? true) {
                    o.push(t);
                }
                if (e?.includes(2) ?? true) {
                    l.push(t);
                }
                if (e?.includes(3) ?? true) {
                    c.push(t);
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
            i = this.j = s.j;
            o = this.I = s.I;
            l = this.F = s.F;
            c = this.M = s.M;
            u = this.T = s.T;
            a = this._ = s._;
        }
    }
    trace(t, ...e) {
        if (this.config.level <= 0) {
            this.P(this.j, 0, t, e);
        }
    }
    debug(t, ...e) {
        if (this.config.level <= 1) {
            this.P(this.I, 1, t, e);
        }
    }
    info(t, ...e) {
        if (this.config.level <= 2) {
            this.P(this.F, 2, t, e);
        }
    }
    warn(t, ...e) {
        if (this.config.level <= 3) {
            this.P(this.M, 3, t, e);
        }
    }
    error(t, ...e) {
        if (this.config.level <= 4) {
            this.P(this.T, 4, t, e);
        }
    }
    fatal(t, ...e) {
        if (this.config.level <= 5) {
            this.P(this._, 5, t, e);
        }
    }
    scopeTo(t) {
        const e = this.A;
        let n = e[t];
        if (n === void 0) {
            n = e[t] = new DefaultLogger(this.config, this.f, null, this.scope.concat(t), this);
        }
        return n;
    }
    P(t, e, n, r) {
        const s = isFunction(n) ? n() : n;
        const i = this.f.createLogEvent(this, e, s, r);
        for (let e = 0, n = t.length; e < n; ++e) {
            t[e].handleEvent(i);
        }
    }
}

__decorate([ bound ], DefaultLogger.prototype, "trace", null);

__decorate([ bound ], DefaultLogger.prototype, "debug", null);

__decorate([ bound ], DefaultLogger.prototype, "info", null);

__decorate([ bound ], DefaultLogger.prototype, "warn", null);

__decorate([ bound ], DefaultLogger.prototype, "error", null);

__decorate([ bound ], DefaultLogger.prototype, "fatal", null);

const X = toLookup({
    create({level: t = 3, colorOptions: e = 0, sinks: n = []} = {}) {
        return toLookup({
            register(r) {
                r.register(instanceRegistration(z, new LogConfig(e, t)));
                for (const t of n) {
                    if (isFunction(t)) {
                        r.register(singletonRegistration(Q, t));
                    } else {
                        r.register(t);
                    }
                }
                return r;
            }
        });
    }
});

const Y = /*@__PURE__*/ createInterface((t => t.singleton(ModuleLoader)));

const noTransform = t => t;

class ModuleTransformer {
    constructor(t) {
        this.K = new Map;
        this.G = new Map;
        this.N = t;
    }
    transform(t) {
        if (t instanceof Promise) {
            return this.W(t);
        } else if (typeof t === "object" && t !== null) {
            return this.B(t);
        } else {
            throw createMappedError(21, t);
        }
    }
    W(t) {
        if (this.K.has(t)) {
            return this.K.get(t);
        }
        const e = t.then((t => this.B(t)));
        this.K.set(t, e);
        void e.then((e => {
            this.K.set(t, e);
        }));
        return e;
    }
    B(t) {
        if (this.G.has(t)) {
            return this.G.get(t);
        }
        const e = this.N(this.U(t));
        this.G.set(t, e);
        if (e instanceof Promise) {
            void e.then((e => {
                this.G.set(t, e);
            }));
        }
        return e;
    }
    U(t) {
        if (t == null) throw createMappedError(21, t);
        if (typeof t !== "object") return new AnalyzedModule(t, []);
        let e;
        let n;
        let r;
        let s;
        const i = [];
        for (const o in t) {
            switch (typeof (e = t[o])) {
              case "object":
                if (e === null) {
                    continue;
                }
                n = isFunction(e.register);
                r = false;
                s = S;
                break;

              case "function":
                n = isFunction(e.register);
                r = e.prototype !== void 0;
                s = getAllResources(e);
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

const Z = /*@__PURE__*/ createInterface("IEventAggregator", (t => t.singleton(EventAggregator)));

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

export { AnalyzedModule, B as ColorOptions, ConsoleSink, ContainerConfiguration, $ as DI, DefaultLogEvent, DefaultLogEventFactory, DefaultLogger, O as DefaultResolver, EventAggregator, A as IContainer, Z as IEventAggregator, z as ILogConfig, U as ILogEventFactory, x as ILogger, Y as IModuleLoader, N as IPlatform, k as IServiceLocator, Q as ISink, InstanceProvider, LogConfig, W as LogLevel, X as LoggerConfiguration, ModuleItem, p as Protocol, K as Registration, all, bound, u as camelCase, S as emptyArray, G as emptyObject, T as factory, firstDefined, q as format, fromAnnotationOrDefinitionOrTypeOrDefault, fromAnnotationOrTypeOrDefault, fromDefinitionOrDefault, h as getPrototypeChain, ignore, j as inject, isArrayIndex, d as isNativeFunction, f as kebabCase, F as lazy, mergeArrays, _ as newInstanceForScope, P as newInstanceOf, noop, onResolve, onResolveAll, M as optional, a as pascalCase, resolve, singleton, sink, toArray, transient };
//# sourceMappingURL=index.mjs.map
