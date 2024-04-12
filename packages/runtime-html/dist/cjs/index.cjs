"use strict";

var t = require("@aurelia/kernel");

var e = require("@aurelia/metadata");

var s = require("@aurelia/runtime");

var i = require("@aurelia/platform-browser");

var n = require("@aurelia/platform");

function __decorate(t, e, s, i) {
    var n = arguments.length, r = n < 3 ? e : i === null ? i = Object.getOwnPropertyDescriptor(e, s) : i, l;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, e, s, i); else for (var a = t.length - 1; a >= 0; a--) if (l = t[a]) r = (n < 3 ? l(r) : n > 3 ? l(e, s, r) : l(e, s)) || r;
    return n > 3 && r && Object.defineProperty(e, s, r), r;
}

const r = Object;

const l = String;

const a = r.prototype;

const createLookup = () => r.create(null);

const createError$1 = t => new Error(t);

const h = a.hasOwnProperty;

const c = r.freeze;

const u = r.assign;

const f = r.getOwnPropertyNames;

const d = r.keys;

const p = /*@__PURE__*/ createLookup();

const isDataAttribute = (t, e, s) => {
    if (p[e] === true) {
        return true;
    }
    if (!isString(e)) {
        return false;
    }
    const i = e.slice(0, 5);
    return p[e] = i === "aria-" || i === "data-" || s.isStandardSvgAttribute(t, e);
};

const isPromise = t => t instanceof Promise;

const isArray = t => t instanceof Array;

const isFunction = t => typeof t === "function";

const isString = t => typeof t === "string";

const rethrow = t => {
    throw t;
};

const m = r.is;

const g = Reflect.defineProperty;

const defineHiddenProp = (t, e, s) => {
    g(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: s
    });
    return s;
};

const addSignalListener = (t, e, s) => t.addSignalListener(e, s);

const removeSignalListener = (t, e, s) => t.removeSignalListener(e, s);

const x = "Interpolation";

const v = "IsIterator";

const w = "IsFunction";

const y = "IsProperty";

const b = "pending";

const k = "running";

const C = s.AccessorType.Observer;

const A = s.AccessorType.Node;

const B = s.AccessorType.Layout;

const S = 1;

const T = 2;

const R = 4;

const I = 6;

const E = 8;

const _ = /*@__PURE__*/ c({
    oneTime: S,
    toView: T,
    fromView: R,
    twoWay: I,
    default: E
});

const P = e.Metadata.getOwn;

const L = e.Metadata.hasOwn;

const M = e.Metadata.define;

const {annotation: D} = t.Protocol;

const q = D.keyFor;

const F = D.appendTo;

const H = D.getKeys;

function bindable(t, e) {
    let s;
    function decorator(t, e) {
        if (arguments.length > 1) {
            s.name = e;
        }
        M(V, BindableDefinition.create(e, t, s), t.constructor, e);
        F(t.constructor, O.keyFrom(e));
    }
    if (arguments.length > 1) {
        s = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        s = {};
        return decorator;
    }
    s = t === void 0 ? {} : t;
    return decorator;
}

function isBindableAnnotation(t) {
    return t.startsWith(V);
}

const V = /*@__PURE__*/ q("bindable");

const O = c({
    name: V,
    keyFrom: t => `${V}:${t}`,
    from(t, ...e) {
        const s = {};
        const i = Array.isArray;
        function addName(e) {
            s[e] = BindableDefinition.create(e, t);
        }
        function addDescription(e, i) {
            s[e] = i instanceof BindableDefinition ? i : BindableDefinition.create(e, t, i === true ? {} : i);
        }
        function addList(t) {
            if (i(t)) {
                t.forEach((t => isString(t) ? addName(t) : addDescription(t.name, t)));
            } else if (t instanceof BindableDefinition) {
                s[t.name] = t;
            } else if (t !== void 0) {
                d(t).forEach((e => addDescription(e, t[e])));
            }
        }
        e.forEach(addList);
        return s;
    },
    getAll(e) {
        const s = V.length + 1;
        const i = [];
        const n = t.getPrototypeChain(e);
        let r = n.length;
        let l = 0;
        let a;
        let h;
        let c;
        let u;
        while (--r >= 0) {
            c = n[r];
            a = H(c).filter(isBindableAnnotation);
            h = a.length;
            for (u = 0; u < h; ++u) {
                i[l++] = P(V, c, a[u].slice(s));
            }
        }
        return i;
    }
});

class BindableDefinition {
    constructor(t, e, s, i, n, r) {
        this.attribute = t;
        this.callback = e;
        this.mode = s;
        this.primary = i;
        this.name = n;
        this.set = r;
    }
    static create(e, s, i = {}) {
        return new BindableDefinition(i.attribute ?? t.kebabCase(e), i.callback ?? `${e}Changed`, i.mode ?? T, i.primary ?? false, i.name ?? e, i.set ?? getInterceptor(e, s, i));
    }
}

function coercer(t, e, s) {
    $.define(t, e);
}

const $ = {
    key: /*@__PURE__*/ q("coercer"),
    define(t, e) {
        M($.key, t[e].bind(t), t);
    },
    for(t) {
        return P($.key, t);
    }
};

function getInterceptor(s, i, n = {}) {
    const r = n.type ?? e.Metadata.get("design:type", i, s) ?? null;
    if (r == null) {
        return t.noop;
    }
    let l;
    switch (r) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        l = r;
        break;

      default:
        {
            const e = r.coerce;
            l = typeof e === "function" ? e.bind(r) : $.for(r) ?? t.noop;
            break;
        }
    }
    return l === t.noop ? l : createCoercer(l, n.nullable);
}

function createCoercer(t, e) {
    return function(s, i) {
        if (!i?.enableCoercion) return s;
        return (e ?? (i?.coerceNullish ?? false ? false : true)) && s == null ? s : t(s, i);
    };
}

const N = t.DI.createInterface;

const W = t.Registration.singleton;

const j = t.Registration.aliasTo;

const z = t.Registration.instance;

t.Registration.callback;

t.Registration.transient;

const registerResolver = (t, e, s) => t.registerResolver(e, s);

function alias(...t) {
    return function(e) {
        const s = q("aliases");
        const i = P(s, e);
        if (i === void 0) {
            M(s, t, e);
        } else {
            i.push(...t);
        }
    };
}

function registerAliases(e, s, i, n) {
    for (let r = 0, l = e.length; r < l; ++r) {
        t.Registration.aliasTo(i, s.keyFrom(e[r])).register(n);
    }
}

const createMappedError = (t, ...e) => new Error(`AUR${l(t).padStart(4, "0")}:${e.map(l)}`);

const U = "element";

const G = "attribute";

const K = "__au_static_resource__";

const getDefinitionFromStaticAu = (t, e, s) => {
    let i = P(K, t);
    if (i == null) {
        if (t.$au?.type === e) {
            i = s(t.$au, t);
            M(K, i, t);
        }
    }
    return i;
};

function bindingBehavior(t) {
    return function(e) {
        return Y.define(t, e);
    };
}

class BindingBehaviorDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(e, s) {
        let i;
        let n;
        if (isString(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new BindingBehaviorDefinition(s, t.firstDefined(getBehaviorAnnotation(s, "name"), i), t.mergeArrays(getBehaviorAnnotation(s, "aliases"), n.aliases, s.aliases), Y.keyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getBindingBehaviorKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : W(s, s), j(s, i), ...n.map((t => j(s, getBindingBehaviorKeyFrom(t)))));
        }
    }
}

const X = "binding-behavior";

const Q = /*@__PURE__*/ t.getResourceKeyFor(X);

const getBehaviorAnnotation = (t, e) => P(q(e), t);

const getBindingBehaviorKeyFrom = t => `${Q}:${t}`;

const Y = c({
    name: Q,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(t) {
        return isFunction(t) && (L(Q, t) || t.$au?.type === X);
    },
    define(e, s) {
        const i = BindingBehaviorDefinition.create(e, s);
        const n = i.Type;
        M(Q, i, n);
        M(t.resourceBaseName, i, n);
        return n;
    },
    getDefinition(t) {
        const e = P(Q, t) ?? getDefinitionFromStaticAu(t, X, BindingBehaviorDefinition.create);
        if (e === void 0) {
            throw createMappedError(151, t);
        }
        return e;
    },
    find(t, e) {
        const s = t.find(X, e);
        return s == null ? null : P(Q, s) ?? getDefinitionFromStaticAu(s, X, BindingBehaviorDefinition.create) ?? null;
    },
    get(e, s) {
        return e.get(t.resource(getBindingBehaviorKeyFrom(s)));
    }
});

const Z = new Map;

const createConfig = t => ({
    type: X,
    name: t
});

class BindingModeBehavior {
    bind(t, e) {
        Z.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, e) {
        e.mode = Z.get(e);
        Z.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() {
        return S;
    }
}

OneTimeBindingBehavior.$au = createConfig("oneTime");

class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return T;
    }
}

ToViewBindingBehavior.$au = createConfig("toView");

class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() {
        return R;
    }
}

FromViewBindingBehavior.$au = createConfig("fromView");

class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() {
        return I;
    }
}

TwoWayBindingBehavior.$au = createConfig("twoWay");

const J = new WeakMap;

const tt = 200;

class DebounceBindingBehavior {
    constructor() {
        this.p = t.resolve(t.IPlatform);
    }
    bind(e, s, i, n) {
        const r = {
            type: "debounce",
            delay: i ?? tt,
            now: this.p.performanceNow,
            queue: this.p.taskQueue,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            J.set(s, l);
        }
    }
    unbind(t, e) {
        J.get(e)?.dispose();
        J.delete(e);
    }
}

DebounceBindingBehavior.$au = {
    type: X,
    name: "debounce"
};

class SignalBindingBehavior {
    constructor() {
        this.i = new Map;
        this.u = t.resolve(s.ISignaler);
    }
    bind(t, e, ...s) {
        if (!("handleChange" in e)) {
            throw createMappedError(817);
        }
        if (s.length === 0) {
            throw createMappedError(818);
        }
        this.i.set(e, s);
        let i;
        for (i of s) {
            addSignalListener(this.u, i, e);
        }
    }
    unbind(t, e) {
        const s = this.i.get(e);
        this.i.delete(e);
        let i;
        for (i of s) {
            removeSignalListener(this.u, i, e);
        }
    }
}

SignalBindingBehavior.$au = {
    type: X,
    name: "signal"
};

const et = new WeakMap;

const st = 200;

class ThrottleBindingBehavior {
    constructor() {
        ({performanceNow: this.C, taskQueue: this.A} = t.resolve(t.IPlatform));
    }
    bind(e, s, i, n) {
        const r = {
            type: "throttle",
            delay: i ?? st,
            now: this.C,
            queue: this.A,
            signals: isString(n) ? [ n ] : n ?? t.emptyArray
        };
        const l = s.limit?.(r);
        if (l == null) ; else {
            et.set(s, l);
        }
    }
    unbind(t, e) {
        et.get(e)?.dispose();
        et.delete(e);
    }
}

ThrottleBindingBehavior.$au = {
    type: X,
    name: "throttle"
};

const it = /*@__PURE__*/ N("IAppTask");

class $AppTask {
    constructor(t, e, s) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = s;
    }
    register(t) {
        return this.c = t.register(z(it, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return t === null ? e() : e(this.c.get(t));
    }
}

const nt = c({
    creating: createAppTaskSlotHook("creating"),
    hydrating: createAppTaskSlotHook("hydrating"),
    hydrated: createAppTaskSlotHook("hydrated"),
    activating: createAppTaskSlotHook("activating"),
    activated: createAppTaskSlotHook("activated"),
    deactivating: createAppTaskSlotHook("deactivating"),
    deactivated: createAppTaskSlotHook("deactivated")
});

function createAppTaskSlotHook(t) {
    function appTaskFactory(e, s) {
        if (isFunction(s)) {
            return new $AppTask(t, e, s);
        }
        return new $AppTask(t, null, e);
    }
    return appTaskFactory;
}

const rt = t.IPlatform;

function watch(t, e) {
    if (t == null) {
        throw createMappedError(772);
    }
    return function decorator(s, i, n) {
        const r = i == null;
        const a = r ? s : s.constructor;
        const h = new WatchDefinition(t, r ? e : n.value);
        if (r) {
            if (!isFunction(e) && (e == null || !(e in a.prototype))) {
                throw createMappedError(773, `${l(e)}@${a.name}}`);
            }
        } else if (!isFunction(n?.value)) {
            throw createMappedError(774, i);
        }
        ot.add(a, h);
        if (isAttributeType(a)) {
            getAttributeDefinition(a).watches.push(h);
        }
        if (isElementType(a)) {
            getElementDefinition(a).watches.push(h);
        }
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const ot = /*@__PURE__*/ (() => {
    const e = new WeakMap;
    return c({
        add(t, s) {
            let i = e.get(t);
            if (i == null) {
                e.set(t, i = []);
            }
            i.push(s);
        },
        getDefinitions(s) {
            return e.get(s) ?? t.emptyArray;
        }
    });
})();

function customAttribute(t) {
    return function(e) {
        return defineAttribute(t, e);
    };
}

function templateController(t) {
    return function(e) {
        return defineAttribute(isString(t) ? {
            isTemplateController: true,
            name: t
        } : {
            isTemplateController: true,
            ...t
        }, e);
    };
}

class CustomAttributeDefinition {
    get kind() {
        return G;
    }
    constructor(t, e, s, i, n, r, l, a, h, c, u) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = l;
        this.noMultiBindings = a;
        this.watches = h;
        this.dependencies = c;
        this.containerStrategy = u;
    }
    static create(e, s) {
        let i;
        let n;
        if (isString(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new CustomAttributeDefinition(s, t.firstDefined(getAttributeAnnotation(s, "name"), i), t.mergeArrays(getAttributeAnnotation(s, "aliases"), n.aliases, s.aliases), getAttributeKeyFrom(i), t.firstDefined(getAttributeAnnotation(s, "defaultBindingMode"), n.defaultBindingMode, s.defaultBindingMode, T), t.firstDefined(getAttributeAnnotation(s, "isTemplateController"), n.isTemplateController, s.isTemplateController, false), O.from(s, ...O.getAll(s), getAttributeAnnotation(s, "bindables"), s.bindables, n.bindables), t.firstDefined(getAttributeAnnotation(s, "noMultiBindings"), n.noMultiBindings, s.noMultiBindings, false), t.mergeArrays(ot.getDefinitions(s), s.watches), t.mergeArrays(getAttributeAnnotation(s, "dependencies"), n.dependencies, s.dependencies), t.firstDefined(getAttributeAnnotation(s, "containerStrategy"), n.containerStrategy, s.containerStrategy, "reuse"));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getAttributeKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : W(s, s), j(s, i), ...n.map((t => j(s, getAttributeKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}

const lt = "custom-attribute";

const at = /*@__PURE__*/ t.getResourceKeyFor(lt);

const getAttributeKeyFrom = t => `${at}:${t}`;

const getAttributeAnnotation = (t, e) => P(q(e), t);

const isAttributeType = t => isFunction(t) && (L(at, t) || t.$au?.type === lt);

const findAttributeControllerFor = (t, e) => getRef(t, getAttributeKeyFrom(e)) ?? void 0;

const defineAttribute = (e, s) => {
    const i = CustomAttributeDefinition.create(e, s);
    const n = i.Type;
    M(at, i, n);
    M(t.resourceBaseName, i, n);
    return n;
};

const getAttributeDefinition = t => {
    const e = P(at, t) ?? getDefinitionFromStaticAu(t, lt, CustomAttributeDefinition.create);
    if (e === void 0) {
        throw createMappedError(759, t);
    }
    return e;
};

const findClosestControllerByName = (t, e) => {
    let s = "";
    let i = "";
    if (isString(e)) {
        s = getAttributeKeyFrom(e);
        i = e;
    } else {
        const t = getAttributeDefinition(e);
        s = t.key;
        i = t.name;
    }
    let n = t;
    while (n !== null) {
        const t = getRef(n, s);
        if (t?.is(i)) {
            return t;
        }
        n = getEffectiveParentNode(n);
    }
    return null;
};

const ht = c({
    name: at,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(t, e, s) {
        M(q(e), s, t);
    },
    getAnnotation: getAttributeAnnotation,
    find(t, e) {
        const s = t.find(lt, e);
        return s === null ? null : P(at, s) ?? getDefinitionFromStaticAu(s, lt, CustomAttributeDefinition.create) ?? null;
    }
});

const ct = /*@__PURE__*/ N("ILifecycleHooks");

class LifecycleHooksEntry {
    constructor(t, e) {
        this.definition = t;
        this.instance = e;
    }
}

class LifecycleHooksDefinition {
    constructor(t, e) {
        this.Type = t;
        this.propertyNames = e;
    }
    static create(t, e) {
        const s = new Set;
        let i = e.prototype;
        while (i !== a) {
            for (const t of f(i)) {
                if (t !== "constructor" && !t.startsWith("_")) {
                    s.add(t);
                }
            }
            i = Object.getPrototypeOf(i);
        }
        return new LifecycleHooksDefinition(e, s);
    }
}

const ut = /*@__PURE__*/ (() => {
    const e = new WeakMap;
    const s = new WeakMap;
    return c({
        define(e, i) {
            const n = LifecycleHooksDefinition.create(e, i);
            const r = n.Type;
            s.set(r, n);
            return t.Registrable.define(r, (t => {
                W(ct, r).register(t);
            }));
        },
        resolve(t) {
            let i = e.get(t);
            if (i === void 0) {
                e.set(t, i = new LifecycleHooksLookupImpl);
                const n = t.root;
                const r = n === t ? t.getAll(ct) : t.has(ct, false) ? n.getAll(ct).concat(t.getAll(ct)) : n.getAll(ct);
                let l;
                let a;
                let h;
                let c;
                let u;
                for (l of r) {
                    a = s.get(l.constructor);
                    h = new LifecycleHooksEntry(a, l);
                    for (c of a.propertyNames) {
                        u = i[c];
                        if (u === void 0) {
                            i[c] = [ h ];
                        } else {
                            u.push(h);
                        }
                    }
                }
            }
            return i;
        }
    });
})();

class LifecycleHooksLookupImpl {}

function lifecycleHooks() {
    return function decorator(t) {
        return ut.define({}, t);
    };
}

function valueConverter(t) {
    return function(e) {
        return pt.define(t, e);
    };
}

class ValueConverterDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(e, s) {
        let i;
        let n;
        if (isString(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new ValueConverterDefinition(s, t.firstDefined(getConverterAnnotation(s, "name"), i), t.mergeArrays(getConverterAnnotation(s, "aliases"), n.aliases, s.aliases), pt.keyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getValueConverterKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : W(s, s), j(s, i), ...n.map((t => j(s, getValueConverterKeyFrom(t)))));
        }
    }
}

const ft = "value-converter";

const dt = /*@__PURE__*/ t.getResourceKeyFor(ft);

const getConverterAnnotation = (t, e) => P(q(e), t);

const getValueConverterKeyFrom = t => `${dt}:${t}`;

const pt = c({
    name: dt,
    keyFrom: getValueConverterKeyFrom,
    isType(t) {
        return isFunction(t) && (L(dt, t) || t.$au?.type === ft);
    },
    define(e, s) {
        const i = ValueConverterDefinition.create(e, s);
        const n = i.Type;
        M(dt, i, n);
        M(t.resourceBaseName, i, n);
        return n;
    },
    getDefinition(t) {
        const e = P(dt, t) ?? getDefinitionFromStaticAu(t, ft, ValueConverterDefinition.create);
        if (e === void 0) {
            throw createMappedError(152, t);
        }
        return e;
    },
    annotate(t, e, s) {
        M(q(e), s, t);
    },
    getAnnotation: getConverterAnnotation,
    find(t, e) {
        const s = t.find(ft, e);
        return s == null ? null : P(dt, s) ?? getDefinitionFromStaticAu(s, ft, ValueConverterDefinition.create) ?? null;
    },
    get(e, s) {
        return e.get(t.resource(getValueConverterKeyFrom(s)));
    }
});

class BindingTargetSubscriber {
    constructor(t, e) {
        this.v = void 0;
        this.b = t;
        this.B = e;
    }
    flush() {
        this.b.updateSource(this.v);
    }
    handleChange(t, e) {
        const i = this.b;
        if (t !== s.astEvaluate(i.ast, i.s, i, null)) {
            this.v = t;
            this.B.add(this);
        }
    }
}

const mixinUseScope = t => {
    defineHiddenProp(t.prototype, "useScope", useScope);
};

const mixinAstEvaluator = (t, e = true) => s => {
    const i = s.prototype;
    if (t != null) {
        g(i, "strict", {
            enumerable: true,
            get: function() {
                return t;
            }
        });
    }
    g(i, "strictFnCall", {
        enumerable: true,
        get: function() {
            return e;
        }
    });
    defineHiddenProp(i, "get", evaluatorGet);
    defineHiddenProp(i, "getSignaler", evaluatorGetSignaler);
    defineHiddenProp(i, "getConverter", evaluatorGetConverter);
    defineHiddenProp(i, "getBehavior", evaluatorGetBehavior);
};

const mt = new WeakMap;

const gt = new WeakMap;

class ResourceLookup {}

const xt = /*@__PURE__*/ N("IFlushQueue", (t => t.singleton(FlushQueue)));

class FlushQueue {
    constructor() {
        this.T = false;
        this.R = new Set;
    }
    get count() {
        return this.R.size;
    }
    add(t) {
        this.R.add(t);
        if (this.T) {
            return;
        }
        this.T = true;
        try {
            this.R.forEach(flushItem);
        } finally {
            this.T = false;
        }
    }
    clear() {
        this.R.clear();
        this.T = false;
    }
}

function useScope(t) {
    this.s = t;
}

function evaluatorGet(t) {
    return this.l.get(t);
}

function evaluatorGetSignaler() {
    return this.l.root.get(s.ISignaler);
}

function evaluatorGetConverter(t) {
    let e = mt.get(this);
    if (e == null) {
        mt.set(this, e = new ResourceLookup);
    }
    return e[t] ??= pt.get(this.l, t);
}

function evaluatorGetBehavior(t) {
    let e = gt.get(this);
    if (e == null) {
        gt.set(this, e = new ResourceLookup);
    }
    return e[t] ??= Y.get(this.l, t);
}

function flushItem(t, e, s) {
    s.delete(t);
    t.flush();
}

const vt = new WeakSet;

const mixingBindingLimited = (t, e) => {
    defineHiddenProp(t.prototype, "limit", (function(t) {
        if (vt.has(this)) {
            throw createMappedError(9996);
        }
        vt.add(this);
        const i = e(this, t);
        const n = t.signals;
        const r = n.length > 0 ? this.get(s.ISignaler) : null;
        const l = this[i];
        const callOriginal = (...t) => l.call(this, ...t);
        const a = t.type === "debounce" ? debounced(t, callOriginal, this) : throttled(t, callOriginal, this);
        const h = r ? {
            handleChange: a.flush
        } : null;
        this[i] = a;
        if (r) {
            n.forEach((t => addSignalListener(r, t, h)));
        }
        return {
            dispose: () => {
                if (r) {
                    n.forEach((t => removeSignalListener(r, t, h)));
                }
                vt.delete(this);
                a.dispose();
                delete this[i];
            }
        };
    }));
};

const debounced = (t, e, s) => {
    let i;
    let n;
    let r;
    let l = false;
    const a = t.queue;
    const callOriginalCallback = () => e(r);
    const fn = e => {
        r = e;
        if (s.isBound) {
            n = i;
            i = a.queueTask(callOriginalCallback, {
                delay: t.delay,
                reusable: false
            });
            n?.cancel();
        } else {
            callOriginalCallback();
        }
    };
    const h = fn.dispose = () => {
        n?.cancel();
        i?.cancel();
        n = i = void 0;
    };
    fn.flush = () => {
        l = i?.status === b;
        h();
        if (l) {
            callOriginalCallback();
        }
    };
    return fn;
};

const throttled = (t, e, s) => {
    let i;
    let n;
    let r = 0;
    let l = 0;
    let a;
    let h = false;
    const c = t.queue;
    const now = () => t.now();
    const callOriginalCallback = () => e(a);
    const fn = e => {
        a = e;
        if (s.isBound) {
            l = now() - r;
            n = i;
            if (l > t.delay) {
                r = now();
                callOriginalCallback();
            } else {
                i = c.queueTask((() => {
                    r = now();
                    callOriginalCallback();
                }), {
                    delay: t.delay - l,
                    reusable: false
                });
            }
            n?.cancel();
        } else {
            callOriginalCallback();
        }
    };
    const u = fn.dispose = () => {
        n?.cancel();
        i?.cancel();
        n = i = void 0;
    };
    fn.flush = () => {
        h = i?.status === b;
        u();
        if (h) {
            callOriginalCallback();
        }
    };
    return fn;
};

const wt = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, s, i, n, r, l, a, h) {
        this.targetAttribute = l;
        this.targetProperty = a;
        this.mode = h;
        this.isBound = false;
        this.s = void 0;
        this.I = null;
        this.v = void 0;
        this.boundFn = false;
        this.l = e;
        this.ast = n;
        this._ = t;
        this.target = r;
        this.oL = s;
        this.A = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.targetAttribute;
        const i = this.targetProperty;
        switch (s) {
          case "class":
            e.classList.toggle(i, !!t);
            break;

          case "style":
            {
                let s = "";
                let n = l(t);
                if (isString(n) && n.includes("!important")) {
                    s = "important";
                    n = n.replace("!important", "");
                }
                e.style.setProperty(i, n, s);
                break;
            }

          default:
            {
                if (t == null) {
                    e.removeAttribute(s);
                } else {
                    e.setAttribute(s, l(t));
                }
            }
        }
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        let t;
        this.obs.version++;
        const e = s.astEvaluate(this.ast, this.s, this, (this.mode & T) > 0 ? this : null);
        this.obs.clear();
        if (e !== this.v) {
            this.v = e;
            const s = this._.state !== Fe;
            if (s) {
                t = this.I;
                this.I = this.A.queueTask((() => {
                    this.I = null;
                    this.updateTarget(e);
                }), wt);
                t?.cancel();
            } else {
                this.updateTarget(e);
            }
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        s.astBind(this.ast, t, this);
        if (this.mode & (T | S)) {
            this.updateTarget(this.v = s.astEvaluate(this.ast, t, this, (this.mode & T) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.v = void 0;
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
}

mixinUseScope(AttributeBinding);

mixingBindingLimited(AttributeBinding, (() => "updateTarget"));

s.connectable(AttributeBinding);

mixinAstEvaluator(true)(AttributeBinding);

const yt = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, s, i, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.I = null;
        this._ = t;
        this.oL = s;
        this.A = i;
        this.P = s.getAccessor(r, l);
        const h = n.expressions;
        const c = this.partBindings = Array(h.length);
        const u = h.length;
        let f = 0;
        for (;u > f; ++f) {
            c[f] = new InterpolationPartBinding(h[f], r, l, e, s, this);
        }
    }
    L() {
        this.updateTarget();
    }
    updateTarget() {
        const t = this.partBindings;
        const e = this.ast.parts;
        const s = t.length;
        let i = "";
        let n = 0;
        if (s === 1) {
            i = e[0] + t[0].v + e[1];
        } else {
            i = e[0];
            for (;s > n; ++n) {
                i += t[n].v + e[n + 1];
            }
        }
        const r = this.P;
        const l = this._.state !== Fe && (r.type & B) > 0;
        let a;
        if (l) {
            a = this.I;
            this.I = this.A.queueTask((() => {
                this.I = null;
                r.setValue(i, this.target, this.targetProperty);
            }), yt);
            a?.cancel();
            a = null;
        } else {
            r.setValue(i, this.target, this.targetProperty);
        }
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        const e = this.partBindings;
        const s = e.length;
        let i = 0;
        for (;s > i; ++i) {
            e[i].bind(t);
        }
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.s = void 0;
        const t = this.partBindings;
        const e = t.length;
        let s = 0;
        for (;e > s; ++s) {
            t[s].unbind();
        }
        this.I?.cancel();
        this.I = null;
    }
}

class InterpolationPartBinding {
    constructor(t, e, s, i, n, r) {
        this.ast = t;
        this.target = e;
        this.targetProperty = s;
        this.owner = r;
        this.mode = T;
        this.task = null;
        this.isBound = false;
        this.v = "";
        this.boundFn = false;
        this.l = i;
        this.oL = n;
    }
    updateTarget() {
        this.owner.L();
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & T) > 0 ? this : null);
        this.obs.clear();
        if (t != this.v) {
            this.v = t;
            if (isArray(t)) {
                this.observeCollection(t);
            }
            this.updateTarget();
        }
    }
    handleCollectionChange() {
        this.updateTarget();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        s.astBind(this.ast, t, this);
        this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & T) > 0 ? this : null);
        if (isArray(this.v)) {
            this.observeCollection(this.v);
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(InterpolationPartBinding);

mixingBindingLimited(InterpolationPartBinding, (() => "updateTarget"));

s.connectable(InterpolationPartBinding);

mixinAstEvaluator(true)(InterpolationPartBinding);

const bt = {
    reusable: false,
    preempt: true
};

class ContentBinding {
    constructor(t, e, s, i, n, r, l) {
        this.p = n;
        this.ast = r;
        this.target = l;
        this.isBound = false;
        this.mode = T;
        this.I = null;
        this.v = "";
        this.M = false;
        this.boundFn = false;
        this.strict = true;
        this.l = e;
        this._ = t;
        this.oL = s;
        this.A = i;
    }
    updateTarget(t) {
        const e = this.target;
        const s = this.v;
        this.v = t;
        if (this.M) {
            s.parentNode?.removeChild(s);
            this.M = false;
        }
        if (t instanceof this.p.Node) {
            e.parentNode?.insertBefore(t, e);
            t = "";
            this.M = true;
        }
        e.textContent = l(t ?? "");
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & T) > 0 ? this : null);
        this.obs.clear();
        if (t === this.v) {
            this.I?.cancel();
            this.I = null;
            return;
        }
        const e = this._.state !== Fe;
        if (e) {
            this.q(t);
        } else {
            this.updateTarget(t);
        }
    }
    handleCollectionChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & T) > 0 ? this : null);
        this.obs.clear();
        if (isArray(t)) {
            this.observeCollection(t);
        }
        const e = this._.state !== Fe;
        if (e) {
            this.q(t);
        } else {
            this.updateTarget(t);
        }
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        s.astBind(this.ast, t, this);
        const e = this.v = s.astEvaluate(this.ast, this.s, this, (this.mode & T) > 0 ? this : null);
        if (isArray(e)) {
            this.observeCollection(e);
        }
        this.updateTarget(e);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        if (this.M) {
            this.v.parentNode?.removeChild(this.v);
        }
        this.s = void 0;
        this.obs.clearAll();
        this.I?.cancel();
        this.I = null;
    }
    q(t) {
        const e = this.I;
        this.I = this.A.queueTask((() => {
            this.I = null;
            this.updateTarget(t);
        }), bt);
        e?.cancel();
    }
}

mixinUseScope(ContentBinding);

mixingBindingLimited(ContentBinding, (() => "updateTarget"));

s.connectable()(ContentBinding);

mixinAstEvaluator(void 0, false)(ContentBinding);

class LetBinding {
    constructor(t, e, s, i, n = false) {
        this.ast = s;
        this.targetProperty = i;
        this.isBound = false;
        this.s = void 0;
        this.target = null;
        this.boundFn = false;
        this.l = t;
        this.oL = e;
        this.F = n;
    }
    updateTarget() {
        this.target[this.targetProperty] = this.v;
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = s.astEvaluate(this.ast, this.s, this, this);
        this.obs.clear();
        this.updateTarget();
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        this.target = this.F ? t.bindingContext : t.overrideContext;
        s.astBind(this.ast, t, this);
        this.v = s.astEvaluate(this.ast, this.s, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.obs.clearAll();
    }
}

mixinUseScope(LetBinding);

mixingBindingLimited(LetBinding, (() => "updateTarget"));

s.connectable(LetBinding);

mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(t, e, s, i, n, r, l, a) {
        this.ast = n;
        this.target = r;
        this.targetProperty = l;
        this.mode = a;
        this.isBound = false;
        this.s = void 0;
        this.P = void 0;
        this.I = null;
        this.H = null;
        this.boundFn = false;
        this.l = e;
        this._ = t;
        this.A = i;
        this.oL = s;
    }
    updateTarget(t) {
        this.P.setValue(t, this.target, this.targetProperty);
    }
    updateSource(t) {
        s.astAssign(this.ast, this.s, this, t);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const t = s.astEvaluate(this.ast, this.s, this, (this.mode & T) > 0 ? this : null);
        this.obs.clear();
        const e = this._.state !== Fe && (this.P.type & B) > 0;
        if (e) {
            kt = this.I;
            this.I = this.A.queueTask((() => {
                this.updateTarget(t);
                this.I = null;
            }), Ct);
            kt?.cancel();
            kt = null;
        } else {
            this.updateTarget(t);
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        s.astBind(this.ast, t, this);
        const e = this.oL;
        const i = this.mode;
        let n = this.P;
        if (!n) {
            if (i & R) {
                n = e.getObserver(this.target, this.targetProperty);
            } else {
                n = e.getAccessor(this.target, this.targetProperty);
            }
            this.P = n;
        }
        const r = (i & T) > 0;
        if (i & (T | S)) {
            this.updateTarget(s.astEvaluate(this.ast, this.s, this, r ? this : null));
        }
        if (i & R) {
            n.subscribe(this.H ??= new BindingTargetSubscriber(this, this.l.get(xt)));
            if (!r) {
                this.updateSource(n.getValue(this.target, this.targetProperty));
            }
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        if (this.H) {
            this.P.unsubscribe(this.H);
            this.H = null;
        }
        this.I?.cancel();
        this.I = null;
        this.obs.clearAll();
    }
    useTargetObserver(t) {
        this.P?.unsubscribe(this);
        (this.P = t).subscribe(this);
    }
    useTargetSubscriber(t) {
        if (this.H != null) {
            throw createMappedError(9995);
        }
        this.H = t;
    }
}

mixinUseScope(PropertyBinding);

mixingBindingLimited(PropertyBinding, (t => t.mode & R ? "updateSource" : "updateTarget"));

s.connectable(PropertyBinding);

mixinAstEvaluator(true, false)(PropertyBinding);

let kt = null;

const Ct = {
    reusable: false,
    preempt: true
};

class RefBinding {
    constructor(t, e, s) {
        this.ast = e;
        this.target = s;
        this.isBound = false;
        this.s = void 0;
        this.l = t;
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        s.astBind(this.ast, t, this);
        s.astAssign(this.ast, this.s, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (s.astEvaluate(this.ast, this.s, this, null) === this.target) {
            s.astAssign(this.ast, this.s, this, null);
        }
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
    }
}

mixinAstEvaluator(false)(RefBinding);

class ListenerBindingOptions {
    constructor(t, e = false) {
        this.prevent = t;
        this.capture = e;
    }
}

class ListenerBinding {
    constructor(t, e, s, i, n, r) {
        this.ast = e;
        this.target = s;
        this.targetEvent = i;
        this.isBound = false;
        this.self = false;
        this.boundFn = true;
        this.V = null;
        this.l = t;
        this.O = n;
        this.V = r;
    }
    callSource(t) {
        const e = this.s.overrideContext;
        e.$event = t;
        let i = s.astEvaluate(this.ast, this.s, this, null);
        delete e.$event;
        if (isFunction(i)) {
            i = i(t);
        }
        if (i !== true && this.O.prevent) {
            t.preventDefault();
        }
        return i;
    }
    handleEvent(t) {
        if (this.self) {
            if (this.target !== t.composedPath()[0]) {
                return;
            }
        }
        if (this.V?.(t) !== false) {
            this.callSource(t);
        }
    }
    bind(t) {
        if (this.isBound) {
            if (this.s === t) {
                return;
            }
            this.unbind();
        }
        this.s = t;
        s.astBind(this.ast, t, this);
        this.target.addEventListener(this.targetEvent, this, this.O);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        s.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.target.removeEventListener(this.targetEvent, this, this.O);
    }
}

mixinUseScope(ListenerBinding);

mixingBindingLimited(ListenerBinding, (() => "callSource"));

mixinAstEvaluator(true, true)(ListenerBinding);

const At = /*@__PURE__*/ N("IEventModifier");

const Bt = /*@__PURE__*/ N("IKeyMapping", (t => t.instance({
    meta: c([ "ctrl", "alt", "shift", "meta" ]),
    keys: {
        escape: "Escape",
        enter: "Enter",
        space: "Space",
        tab: "tab",
        ...Array.from({
            length: 25
        }).reduce(((t, e, s) => {
            let i = String.fromCharCode(s + 65);
            t[s + 65] = i;
            i = String.fromCharCode(s + 97);
            t[s + 97] = t[i] = i;
            return t;
        }), {})
    }
})));

class ModifiedMouseEventHandler {
    constructor() {
        this.type = [ "click", "mousedown", "mousemove", "mouseup", "dblclick", "contextmenu" ];
        this.$ = t.resolve(Bt);
        this.N = [ "left", "middle", "right" ];
    }
    static register(t) {
        t.register(W(At, ModifiedMouseEventHandler));
    }
    getHandler(t) {
        const e = t.split(/[:+.]/);
        return t => {
            let s = false;
            let i = false;
            let n;
            for (n of e) {
                switch (n) {
                  case "prevent":
                    s = true;
                    continue;

                  case "stop":
                    i = true;
                    continue;

                  case "left":
                  case "middle":
                  case "right":
                    if (t.button !== this.N.indexOf(n)) return false;
                    continue;
                }
                if (this.$.meta.includes(n) && t[`${n}Key`] !== true) {
                    return false;
                }
            }
            if (s) t.preventDefault();
            if (i) t.stopPropagation();
            return true;
        };
    }
}

class ModifiedKeyboardEventHandler {
    constructor() {
        this.$ = t.resolve(Bt);
        this.type = [ "keydown", "keyup" ];
    }
    static register(t) {
        t.register(W(At, ModifiedKeyboardEventHandler));
    }
    getHandler(t) {
        const e = t.split(/[:+.]/);
        return t => {
            let s = false;
            let i = false;
            let n;
            for (n of e) {
                switch (n) {
                  case "prevent":
                    s = true;
                    continue;

                  case "stop":
                    i = true;
                    continue;
                }
                if (this.$.meta.includes(n)) {
                    if (t[`${n}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const e = this.$.keys[n];
                if (e !== t.key) {
                    return false;
                }
            }
            if (s) t.preventDefault();
            if (i) t.stopPropagation();
            return true;
        };
    }
}

const St = /*@__PURE__*/ N("IEventModifierHandler", (t => t.instance({
    getHandler: () => null
})));

class EventModifier {
    constructor() {
        this.W = t.resolve(t.all(At)).reduce(((t, e) => {
            const s = isArray(e.type) ? e.type : [ e.type ];
            s.forEach((s => t[s] = e));
            return t;
        }), {});
    }
    static register(t) {
        t.register(W(St, EventModifier));
    }
    getHandler(t, e) {
        return isString(e) ? this.W[t]?.getHandler(e) ?? null : null;
    }
}

const Tt = {
    register(t) {
        t.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const Rt = /*@__PURE__*/ N("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.j = null;
        this.U = -1;
        this.name = e.name;
        this.container = t;
        this.def = e;
    }
    setCacheSize(t, e) {
        if (t) {
            if (t === "*") {
                t = ViewFactory.maxCacheSize;
            } else if (isString(t)) {
                t = parseInt(t, 10);
            }
            if (this.U === -1 || !e) {
                this.U = t;
            }
        }
        if (this.U > 0) {
            this.j = [];
        } else {
            this.j = null;
        }
        this.isCaching = this.U > 0;
    }
    canReturnToCache(t) {
        return this.j != null && this.j.length < this.U;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.j.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const e = this.j;
        let s;
        if (e != null && e.length > 0) {
            s = e.pop();
            return s;
        }
        s = Controller.$view(this, t);
        return s;
    }
}

ViewFactory.maxCacheSize = 65535;

const It = "au-start";

const Et = "au-end";

const createElement = (t, e) => t.document.createElement(e);

const createComment = (t, e) => t.document.createComment(e);

const createLocation = t => {
    const e = createComment(t, Et);
    e.$start = createComment(t, It);
    return e;
};

const createText = (t, e) => t.document.createTextNode(e);

const insertBefore = (t, e, s) => t.insertBefore(e, s);

const insertManyBefore = (t, e, s) => {
    if (t === null) {
        return;
    }
    const i = s.length;
    let n = 0;
    while (i > n) {
        t.insertBefore(s[n], e);
        ++n;
    }
};

const appendToTemplate = (t, e) => t.content.appendChild(e);

const appendManyToTemplate = (t, e) => {
    const s = e.length;
    let i = 0;
    while (s > i) {
        t.content.appendChild(e[i]);
        ++i;
    }
};

const createMutationObserver = (t, e) => new t.ownerDocument.defaultView.MutationObserver(e);

const isElement = t => t.nodeType === 1;

const isTextNode = t => t.nodeType === 3;

const _t = "default";

const Pt = "au-slot";

const Lt = /*@__PURE__*/ N("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

const Mt = /*@__PURE__*/ N("IAuSlotWatcher");

class AuSlotWatcherBinding {
    constructor(e, s, i, n) {
        this.G = new Set;
        this.K = t.emptyArray;
        this.isBound = false;
        this.cb = (this.o = e)[s];
        this.slotName = i;
        this.X = n;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this.K;
    }
    watch(t) {
        if (!this.G.has(t)) {
            this.G.add(t);
            t.subscribe(this);
        }
    }
    unwatch(t) {
        if (this.G.delete(t)) {
            t.unsubscribe(this);
        }
    }
    handleSlotChange(t, e) {
        if (!this.isBound) {
            return;
        }
        const s = this.K;
        const i = [];
        let n;
        let r;
        for (n of this.G) {
            for (r of n === t ? e : n.nodes) {
                if (this.X === "*" || isElement(r) && r.matches(this.X)) {
                    i[i.length] = r;
                }
            }
        }
        if (i.length !== s.length || i.some(((t, e) => t !== s[e]))) {
            this.K = i;
            this.cb?.call(this.o, i);
            this.subs.notify(i, s);
        }
    }
    get() {
        throw createMappedError(99, "get");
    }
}

class SlottedLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        z(ct, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new AuSlotWatcherBinding(t, s.callback ?? `${l(s.name)}Changed`, s.slotName ?? "default", s.query ?? "*");
        g(t, s.name, {
            enumerable: true,
            configurable: true,
            get: u((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        z(Mt, i).register(e.container);
        e.addBinding(i);
    }
}

function slotted(t, e) {
    if (!Dt) {
        Dt = true;
        s.subscriberCollection(AuSlotWatcherBinding);
        lifecycleHooks()(SlottedLifecycleHooks);
    }
    const i = "dependencies";
    function decorator(s, n, r) {
        const l = typeof t === "object" ? t : {
            query: t,
            slotName: e,
            name: ""
        };
        l.name = n;
        if (typeof s === "function" || typeof r?.value !== "undefined") {
            throw createMappedError(9990);
        }
        const a = s.constructor;
        let h = hs.getAnnotation(a, i);
        if (h == null) {
            hs.annotate(a, i, h = []);
        }
        h.push(new SlottedLifecycleHooks(l));
    }
    return decorator;
}

let Dt = false;

class SpreadBinding {
    static create(e, s, i, n, r, l, a, h) {
        const c = [];
        const u = n.renderers;
        const getHydrationContext = t => {
            let s = t;
            let i = e;
            while (i != null && s > 0) {
                i = i.parent;
                --s;
            }
            if (i == null) {
                throw createMappedError(9999);
            }
            return i;
        };
        const renderSpreadInstruction = e => {
            const n = getHydrationContext(e);
            const f = new SpreadBinding(n);
            const d = r.compileSpread(n.controller.definition, n.instruction?.captures ?? t.emptyArray, n.controller.container, s, i);
            let p;
            for (p of d) {
                switch (p.type) {
                  case te:
                    renderSpreadInstruction(e + 1);
                    break;

                  case ee:
                    u[p.instructions.type].render(f, findElementControllerFor(s), p.instructions, l, a, h);
                    break;

                  default:
                    u[p.type].render(f, s, p, l, a, h);
                }
            }
            c.push(f);
        };
        renderSpreadInstruction(0);
        return c;
    }
    get container() {
        return this.locator;
    }
    get definition() {
        return this.$controller.definition;
    }
    get state() {
        return this.$controller.state;
    }
    constructor(t) {
        this.isBound = false;
        this.Z = [];
        this.locator = (this.$controller = (this.J = t).controller).container;
    }
    get(t) {
        return this.locator.get(t);
    }
    bind(t) {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const e = this.scope = this.J.controller.scope.parent ?? void 0;
        if (e == null) {
            throw createMappedError(9999);
        }
        this.Z.forEach((t => t.bind(e)));
    }
    unbind() {
        this.Z.forEach((t => t.unbind()));
        this.isBound = false;
    }
    addBinding(t) {
        this.Z.push(t);
    }
    addChild(t) {
        if (t.vmKind !== Me) {
            throw createMappedError(9998);
        }
        this.$controller.addChild(t);
    }
}

const qt = "ra";

const Ft = "rb";

const Ht = "rc";

const Vt = "rd";

const Ot = "re";

const $t = "rf";

const Nt = "rg";

const Wt = "ri";

const jt = "rj";

const zt = "rk";

const Ut = "rl";

const Gt = "ha";

const Kt = "hb";

const Xt = "hc";

const Qt = "hd";

const Yt = "he";

const Zt = "hf";

const Jt = "hg";

const te = "hs";

const ee = "hp";

const se = /*@__PURE__*/ c({
    hydrateElement: qt,
    hydrateAttribute: Ft,
    hydrateTemplateController: Ht,
    hydrateLetElement: Vt,
    setProperty: Ot,
    interpolation: $t,
    propertyBinding: Nt,
    letBinding: Wt,
    refBinding: jt,
    iteratorBinding: zt,
    multiAttr: Ut,
    textBinding: Gt,
    listenerBinding: Kt,
    attributeBinding: Xt,
    stylePropertyBinding: Qt,
    setAttribute: Yt,
    setClassAttribute: Zt,
    setStyleAttribute: Jt,
    spreadBinding: te,
    spreadElementProp: ee
});

const ie = /*@__PURE__*/ N("Instruction");

function isInstruction(t) {
    const e = t.type;
    return isString(e) && e.length === 2;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = $t;
    }
}

class PropertyBindingInstruction {
    constructor(t, e, s) {
        this.from = t;
        this.to = e;
        this.mode = s;
        this.type = Nt;
    }
}

class IteratorBindingInstruction {
    constructor(t, e, s) {
        this.forOf = t;
        this.to = e;
        this.props = s;
        this.type = zt;
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = jt;
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Ot;
    }
}

class MultiAttrInstruction {
    constructor(t, e, s) {
        this.value = t;
        this.to = e;
        this.command = s;
        this.type = Ut;
    }
}

class HydrateElementInstruction {
    constructor(t, e, s, i, n, r) {
        this.res = t;
        this.props = e;
        this.projections = s;
        this.containerless = i;
        this.captures = n;
        this.data = r;
        this.type = qt;
    }
}

class HydrateAttributeInstruction {
    constructor(t, e, s) {
        this.res = t;
        this.alias = e;
        this.props = s;
        this.type = Ft;
    }
}

class HydrateTemplateController {
    constructor(t, e, s, i) {
        this.def = t;
        this.res = e;
        this.alias = s;
        this.props = i;
        this.type = Ht;
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
        this.type = Vt;
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Wt;
    }
}

class TextBindingInstruction {
    constructor(t) {
        this.from = t;
        this.type = Gt;
    }
}

class ListenerBindingInstruction {
    constructor(t, e, s, i) {
        this.from = t;
        this.to = e;
        this.capture = s;
        this.modifier = i;
        this.type = Kt;
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = Qt;
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
        this.type = Yt;
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Zt;
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = Jt;
    }
}

class AttributeBindingInstruction {
    constructor(t, e, s) {
        this.attr = t;
        this.from = e;
        this.to = s;
        this.type = Xt;
    }
}

class SpreadBindingInstruction {
    constructor() {
        this.type = te;
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
        this.type = ee;
    }
}

const ne = /*@__PURE__*/ N("ITemplateCompiler");

const re = /*@__PURE__*/ N("IRenderer");

function renderer(e) {
    return function decorator(s) {
        g(s.prototype, "target", {
            configurable: true,
            get() {
                return e;
            }
        });
        return t.Registrable.define(s, (function(t) {
            W(re, this).register(t);
        }));
    };
}

function ensureExpression(t, e, s) {
    if (isString(e)) {
        return t.parse(e, s);
    }
    return e;
}

function getTarget(t) {
    if (t.viewModel != null) {
        return t.viewModel;
    }
    return t;
}

function getRefTarget(t, e) {
    if (e === "element") {
        return t;
    }
    switch (e) {
      case "controller":
        return findElementControllerFor(t);

      case "view":
        throw createMappedError(750);

      case "component":
        return findElementControllerFor(t).viewModel;

      default:
        {
            const s = findAttributeControllerFor(t, e);
            if (s !== void 0) {
                return s.viewModel;
            }
            const i = findElementControllerFor(t, {
                name: e
            });
            if (i === void 0) {
                throw createMappedError(751, e);
            }
            return i.viewModel;
        }
    }
}

exports.SetPropertyRenderer = class SetPropertyRenderer {
    render(t, e, s) {
        const i = getTarget(e);
        if (i.$observers?.[s.to] !== void 0) {
            i.$observers[s.to].setValue(s.value);
        } else {
            i[s.to] = s.value;
        }
    }
};

exports.SetPropertyRenderer = __decorate([ renderer(Ot) ], exports.SetPropertyRenderer);

exports.CustomElementRenderer = class CustomElementRenderer {
    constructor() {
        this.r = t.resolve(pe);
    }
    render(t, e, s, i, n, r) {
        let l;
        let a;
        let h;
        const c = s.res;
        const u = s.projections;
        const f = t.container;
        switch (typeof c) {
          case "string":
            l = hs.find(f, c);
            if (l == null) {
                throw createMappedError(752, s, t);
            }
            break;

          default:
            l = c;
        }
        const p = s.containerless || l.containerless;
        const m = p ? convertToRenderLocation(e) : null;
        const g = createElementContainer(i, t, e, s, m, u == null ? void 0 : new AuSlotsInfo(d(u)));
        a = g.invoke(l.Type);
        h = Controller.$el(g, a, e, s, l, m);
        setRef(e, l.key, h);
        const x = this.r.renderers;
        const v = s.props;
        const w = v.length;
        let y = 0;
        let b;
        while (w > y) {
            b = v[y];
            x[b.type].render(t, h, b, i, n, r);
            ++y;
        }
        t.addChild(h);
    }
};

exports.CustomElementRenderer = __decorate([ renderer(qt) ], exports.CustomElementRenderer);

exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    constructor() {
        this.r = t.resolve(pe);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = ht.find(l, s.res);
            if (a == null) {
                throw createMappedError(753, s, t);
            }
            break;

          default:
            a = s.res;
        }
        const h = invokeAttribute(i, a, t, e, s, void 0, void 0);
        const c = Controller.$attr(h.ctn, h.vm, e, a);
        setRef(e, a.key, c);
        const u = this.r.renderers;
        const f = s.props;
        const d = f.length;
        let p = 0;
        let m;
        while (d > p) {
            m = f[p];
            u[m.type].render(t, c, m, i, n, r);
            ++p;
        }
        t.addChild(c);
    }
};

exports.CustomAttributeRenderer = __decorate([ renderer(Ft) ], exports.CustomAttributeRenderer);

exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    constructor() {
        this.r = t.resolve(pe);
    }
    render(t, e, s, i, n, r) {
        let l = t.container;
        let a;
        switch (typeof s.res) {
          case "string":
            a = ht.find(l, s.res);
            if (a == null) {
                throw createMappedError(754, s, t);
            }
            break;

          default:
            a = s.res;
        }
        const h = this.r.getViewFactory(s.def, a.containerStrategy === "new" ? l.createChild({
            inheritParentResources: true
        }) : l);
        const c = convertToRenderLocation(e);
        const u = invokeAttribute(i, a, t, e, s, h, c);
        const f = Controller.$attr(u.ctn, u.vm, e, a);
        setRef(c, a.key, f);
        u.vm.link?.(t, f, e, s);
        const d = this.r.renderers;
        const p = s.props;
        const m = p.length;
        let g = 0;
        let x;
        while (m > g) {
            x = p[g];
            d[x.type].render(t, f, x, i, n, r);
            ++g;
        }
        t.addChild(f);
    }
};

exports.TemplateControllerRenderer = __decorate([ renderer(Ht) ], exports.TemplateControllerRenderer);

exports.LetElementRenderer = class LetElementRenderer {
    render(t, e, s, i, n, r) {
        e.remove();
        const l = s.instructions;
        const a = s.toBindingContext;
        const h = t.container;
        const c = l.length;
        let u;
        let f;
        let d = 0;
        while (c > d) {
            u = l[d];
            f = ensureExpression(n, u.from, y);
            t.addBinding(new LetBinding(h, r, f, u.to, a));
            ++d;
        }
    }
};

exports.LetElementRenderer = __decorate([ renderer(Vt) ], exports.LetElementRenderer);

exports.RefBindingRenderer = class RefBindingRenderer {
    render(t, e, s, i, n) {
        t.addBinding(new RefBinding(t.container, ensureExpression(n, s.from, y), getRefTarget(e, s.to)));
    }
};

exports.RefBindingRenderer = __decorate([ renderer(jt) ], exports.RefBindingRenderer);

exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new InterpolationBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, x), getTarget(e), s.to, T));
    }
};

exports.InterpolationBindingRenderer = __decorate([ renderer($t) ], exports.InterpolationBindingRenderer);

exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, y), getTarget(e), s.to, s.mode));
    }
};

exports.PropertyBindingRenderer = __decorate([ renderer(Nt) ], exports.PropertyBindingRenderer);

exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.forOf, v), getTarget(e), s.to, T));
    }
};

exports.IteratorBindingRenderer = __decorate([ renderer(zt) ], exports.IteratorBindingRenderer);

exports.TextBindingRenderer = class TextBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new ContentBinding(t, t.container, r, i.domWriteQueue, i, ensureExpression(n, s.from, y), e));
    }
};

exports.TextBindingRenderer = __decorate([ renderer(Gt) ], exports.TextBindingRenderer);

const oe = N("IListenerBindingOptions", (t => t.instance({
    prevent: false
})));

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor() {
        this.tt = t.resolve(St);
        this.et = t.resolve(oe);
    }
    render(t, e, s, i, n) {
        t.addBinding(new ListenerBinding(t.container, ensureExpression(n, s.from, w), e, s.to, new ListenerBindingOptions(this.et.prevent, s.capture), this.tt.getHandler(s.to, s.modifier)));
    }
};

exports.ListenerBindingRenderer = __decorate([ renderer(Kt) ], exports.ListenerBindingRenderer);

exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(t, e, s) {
        e.setAttribute(s.to, s.value);
    }
};

exports.SetAttributeRenderer = __decorate([ renderer(Yt) ], exports.SetAttributeRenderer);

exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(t, e, s) {
        addClasses(e.classList, s.value);
    }
};

exports.SetClassAttributeRenderer = __decorate([ renderer(Zt) ], exports.SetClassAttributeRenderer);

exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(t, e, s) {
        e.style.cssText += s.value;
    }
};

exports.SetStyleAttributeRenderer = __decorate([ renderer(Jt) ], exports.SetStyleAttributeRenderer);

exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(t, e, s, i, n, r) {
        t.addBinding(new PropertyBinding(t, t.container, r, i.domWriteQueue, ensureExpression(n, s.from, y), e.style, s.to, T));
    }
};

exports.StylePropertyBindingRenderer = __decorate([ renderer(Qt) ], exports.StylePropertyBindingRenderer);

exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(t, e, s, i, n, r) {
        const l = t.container;
        const a = l.has(Ze, false) ? l.get(Ze) : null;
        t.addBinding(new AttributeBinding(t, l, r, i.domWriteQueue, ensureExpression(n, s.from, y), e, s.attr, a == null ? s.to : s.to.split(/\s/g).map((t => a[t] ?? t)).join(" "), T));
    }
};

exports.AttributeBindingRenderer = __decorate([ renderer(Xt) ], exports.AttributeBindingRenderer);

exports.SpreadRenderer = class SpreadRenderer {
    constructor() {
        this.st = t.resolve(ne);
        this.r = t.resolve(pe);
    }
    render(t, e, s, i, n, r) {
        SpreadBinding.create(t.container.get(ze), e, void 0, this.r, this.st, i, n, r).forEach((e => t.addBinding(e)));
    }
};

exports.SpreadRenderer = __decorate([ renderer(te) ], exports.SpreadRenderer);

function addClasses(t, e) {
    const s = e.length;
    let i = 0;
    for (let n = 0; n < s; ++n) {
        if (e.charCodeAt(n) === 32) {
            if (n !== i) {
                t.add(e.slice(i, n));
            }
            i = n + 1;
        } else if (n + 1 === s) {
            t.add(e.slice(i));
        }
    }
}

const le = "IController";

const ae = "IInstruction";

const he = "IRenderLocation";

const ce = "ISlotsInfo";

function createElementContainer(e, s, i, n, r, l) {
    const a = s.container.createChild();
    registerHostNode(a, e, i);
    registerResolver(a, je, new t.InstanceProvider(le, s));
    registerResolver(a, ie, new t.InstanceProvider(ae, n));
    registerResolver(a, Ye, r == null ? ue : new RenderLocationProvider(r));
    registerResolver(a, Rt, fe);
    registerResolver(a, Lt, l == null ? de : new t.InstanceProvider(ce, l));
    return a;
}

class ViewFactoryProvider {
    get $isResolver() {
        return true;
    }
    constructor(t) {
        this.f = t;
    }
    resolve() {
        const t = this.f;
        if (t === null) {
            throw createMappedError(755);
        }
        if (!isString(t.name) || t.name.length === 0) {
            throw createMappedError(756);
        }
        return t;
    }
}

function invokeAttribute(e, s, i, n, r, l, a, h) {
    const c = i instanceof Controller ? i : i.$controller;
    const u = c.container.createChild();
    registerHostNode(u, e, n);
    registerResolver(u, je, new t.InstanceProvider(le, c));
    registerResolver(u, ie, new t.InstanceProvider(ae, r));
    registerResolver(u, Ye, a == null ? ue : new t.InstanceProvider(he, a));
    registerResolver(u, Rt, l == null ? fe : new ViewFactoryProvider(l));
    registerResolver(u, Lt, h == null ? de : new t.InstanceProvider(ce, h));
    return {
        vm: u.invoke(s.Type),
        ctn: u
    };
}

class RenderLocationProvider {
    get name() {
        return "IRenderLocation";
    }
    get $isResolver() {
        return true;
    }
    constructor(t) {
        this.l = t;
    }
    resolve() {
        return this.l;
    }
}

const ue = new RenderLocationProvider(null);

const fe = new ViewFactoryProvider(null);

const de = new t.InstanceProvider(ce, new AuSlotsInfo(t.emptyArray));

const pe = /*@__PURE__*/ N("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    get renderers() {
        return this.it ??= this.nt.getAll(re, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), createLookup());
    }
    constructor() {
        this.rt = new WeakMap;
        this.ot = new WeakMap;
        const e = this.nt = t.resolve(t.IContainer).root;
        this.p = e.get(rt);
        this.ep = e.get(s.IExpressionParser);
        this.oL = e.get(s.IObserverLocator);
        this.lt = new FragmentNodeSequence(this.p, this.p.document.createDocumentFragment());
    }
    compile(t, e, s) {
        if (t.needsCompile !== false) {
            const i = this.rt;
            const n = e.get(ne);
            let r = i.get(t);
            if (r == null) {
                i.set(t, r = n.compile(CustomElementDefinition.getOrCreate(t), e, s));
            } else {
                e.register(...r.dependencies);
            }
            return r;
        }
        return t;
    }
    getViewFactory(t, e) {
        return new ViewFactory(e, CustomElementDefinition.getOrCreate(t));
    }
    createNodes(t) {
        if (t.enhance === true) {
            return new FragmentNodeSequence(this.p, this.ht(t.template));
        }
        let e;
        let s = false;
        const i = this.ot;
        const n = this.p;
        const r = n.document;
        if (i.has(t)) {
            e = i.get(t);
        } else {
            const l = t.template;
            let a;
            if (l === null) {
                e = null;
            } else if (l instanceof n.Node) {
                if (l.nodeName === "TEMPLATE") {
                    e = l.content;
                    s = true;
                } else {
                    (e = r.createDocumentFragment()).appendChild(l.cloneNode(true));
                }
            } else {
                a = r.createElement("template");
                if (isString(l)) {
                    a.innerHTML = l;
                }
                e = a.content;
                s = true;
            }
            this.ht(e);
            i.set(t, e);
        }
        return e == null ? this.lt : new FragmentNodeSequence(this.p, s ? r.importNode(e, true) : r.adoptNode(e.cloneNode(true)));
    }
    render(t, e, s, i) {
        const n = s.instructions;
        const r = this.renderers;
        const l = e.length;
        let a = 0;
        let h = 0;
        let c = n.length;
        let u;
        let f;
        let d;
        if (l !== c) {
            throw createMappedError(757, l, c);
        }
        if (l > 0) {
            while (l > a) {
                u = n[a];
                d = e[a];
                h = 0;
                c = u.length;
                while (c > h) {
                    f = u[h];
                    r[f.type].render(t, d, f, this.p, this.ep, this.oL);
                    ++h;
                }
                ++a;
            }
        }
        if (i != null) {
            u = s.surrogates;
            if ((c = u.length) > 0) {
                h = 0;
                while (c > h) {
                    f = u[h];
                    r[f.type].render(t, i, f, this.p, this.ep, this.oL);
                    ++h;
                }
            }
        }
    }
    ct() {
        return this.p.document.createElement("au-m");
    }
    ht(t) {
        if (t == null) {
            return null;
        }
        let e = t;
        let s = e.firstChild;
        let i = null;
        while (s != null) {
            if (s.nodeType === 8 && s.nodeValue === "au*") {
                i = s.nextSibling;
                e.removeChild(s);
                e.insertBefore(this.ct(), i);
                if (i.nodeType === 8) {
                    s = i.nextSibling;
                } else {
                    s = i;
                }
            }
            i = s?.firstChild;
            if (i == null) {
                i = s?.nextSibling;
                if (i == null) {
                    s = e.nextSibling;
                    e = e.parentNode;
                    while (s == null && e != null) {
                        s = e.nextSibling;
                        e = e.parentNode;
                    }
                } else {
                    s = i;
                }
            } else {
                e = s;
                s = i;
            }
        }
        return t;
    }
}

const addListener = (t, e, s, i) => {
    t.addEventListener(e, s, i);
};

const removeListener = (t, e, s, i) => {
    t.removeEventListener(e, s, i);
};

const mixinNodeObserverUseConfig = t => {
    let e;
    const s = t.prototype;
    defineHiddenProp(s, "subscribe", (function(t) {
        if (this.subs.add(t) && this.subs.count === 1) {
            for (e of this.cf.events) {
                addListener(this.ut, e, this);
            }
            this.ft = true;
            this.dt?.();
        }
    }));
    defineHiddenProp(s, "unsubscribe", (function(t) {
        if (this.subs.remove(t) && this.subs.count === 0) {
            for (e of this.cf.events) {
                removeListener(this.ut, e, this);
            }
            this.ft = false;
            this.gt?.();
        }
    }));
    defineHiddenProp(s, "useConfig", (function(t) {
        this.cf = t;
        if (this.ft) {
            for (e of this.cf.events) {
                removeListener(this.ut, e, this);
            }
            for (e of this.cf.events) {
                addListener(this.ut, e, this);
            }
        }
    }));
};

const mixinNoopSubscribable = e => {
    defineHiddenProp(e.prototype, "subscribe", t.noop);
    defineHiddenProp(e.prototype, "unsubscribe", t.noop);
};

class ClassAttributeAccessor {
    get doNotCache() {
        return true;
    }
    constructor(t) {
        this.obj = t;
        this.type = A | B;
        this.v = "";
        this.xt = {};
        this.vt = 0;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (t !== this.v) {
            this.v = t;
            this.wt();
        }
    }
    wt() {
        const t = this.xt;
        const e = ++this.vt;
        const s = this.obj.classList;
        const i = getClassesToAdd(this.v);
        const n = i.length;
        let r = 0;
        let l;
        if (n > 0) {
            for (;r < n; r++) {
                l = i[r];
                if (l.length === 0) {
                    continue;
                }
                t[l] = this.vt;
                s.add(l);
            }
        }
        if (e === 1) {
            return;
        }
        for (l in t) {
            if (t[l] === e) {
                continue;
            }
            s.remove(l);
        }
    }
}

function getClassesToAdd(e) {
    if (isString(e)) {
        return splitClassString(e);
    }
    if (typeof e !== "object") {
        return t.emptyArray;
    }
    if (e instanceof Array) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) {
                t.push(...getClassesToAdd(e[i]));
            }
            return t;
        } else {
            return t.emptyArray;
        }
    }
    const s = [];
    let i;
    for (i in e) {
        if (Boolean(e[i])) {
            if (i.includes(" ")) {
                s.push(...splitClassString(i));
            } else {
                s.push(i);
            }
        }
    }
    return s;
}

function splitClassString(e) {
    const s = e.match(/\S+/g);
    if (s === null) {
        return t.emptyArray;
    }
    return s;
}

mixinNoopSubscribable(ClassAttributeAccessor);

function cssModules(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(e) {
        const s = u({}, ...this.modules);
        const i = defineAttribute({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, class CustomAttributeClass {
            constructor() {
                this.yt = new ClassAttributeAccessor(t.resolve(Xe));
                this.value = "";
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this.yt.setValue(this.value?.split(/\s+/g).map((t => s[t] || t)) ?? "");
            }
        });
        e.register(i, z(Ze, s));
    }
}

function shadowCSS(...t) {
    return new ShadowDOMRegistry(t);
}

const me = /*@__PURE__*/ N("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(rt))) {
        return t.get(AdoptedStyleSheetsStylesFactory);
    }
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(xe);
        const s = t.get(me);
        t.register(z(ge, s.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = t.resolve(rt);
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

class StyleElementStylesFactory {
    constructor() {
        this.p = t.resolve(rt);
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

const ge = /*@__PURE__*/ N("IShadowDOMStyles");

const xe = /*@__PURE__*/ N("IShadowDOMGlobalStyles", (e => e.instance({
    applyTo: t.noop
})));

class AdoptedStyleSheetsStyles {
    constructor(t, e, s, i = null) {
        this.sharedStyles = i;
        this.styleSheets = e.map((e => {
            let i;
            if (e instanceof t.CSSStyleSheet) {
                i = e;
            } else {
                i = s.get(e);
                if (i === void 0) {
                    i = new t.CSSStyleSheet;
                    i.replaceSync(e);
                    s.set(e, i);
                }
            }
            return i;
        }));
    }
    static supported(t) {
        return "adoptedStyleSheets" in t.ShadowRoot.prototype;
    }
    applyTo(t) {
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(t);
        }
        t.adoptedStyleSheets = [ ...t.adoptedStyleSheets, ...this.styleSheets ];
    }
}

class StyleElementStyles {
    constructor(t, e, s = null) {
        this.p = t;
        this.localStyles = e;
        this.sharedStyles = s;
    }
    applyTo(t) {
        const e = this.localStyles;
        const s = this.p;
        for (let i = e.length - 1; i > -1; --i) {
            const n = s.document.createElement("style");
            n.innerHTML = e[i];
            t.prepend(n);
        }
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(t);
        }
    }
}

const ve = {
    shadowDOM(e) {
        return nt.creating(t.IContainer, (t => {
            if (e.sharedStyles != null) {
                const s = t.get(me);
                t.register(z(xe, s.createStyles(e.sharedStyles, null)));
            }
        }));
    }
};

const {enter: we, exit: ye} = s.ConnectableSwitcher;

const {wrap: be, unwrap: ke} = s.ProxyObservable;

class ComputedWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, s, i, n) {
        this.obj = t;
        this.$get = s;
        this.useProxy = n;
        this.isBound = false;
        this.running = false;
        this.v = void 0;
        this.cb = i;
        this.oL = e;
    }
    handleChange() {
        this.run();
    }
    handleCollectionChange() {
        this.run();
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.compute();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
    }
    run() {
        if (!this.isBound || this.running) {
            return;
        }
        const t = this.obj;
        const e = this.v;
        const s = this.compute();
        if (!m(s, e)) {
            this.cb.call(t, s, e, t);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            we(this);
            return this.v = ke(this.$get.call(void 0, this.useProxy ? be(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            ye(this);
        }
    }
}

class ExpressionWatcher {
    get value() {
        return this.v;
    }
    constructor(t, e, s, i, n) {
        this.scope = t;
        this.l = e;
        this.oL = s;
        this.isBound = false;
        this.boundFn = false;
        this.obj = t.bindingContext;
        this.bt = i;
        this.cb = n;
    }
    handleChange(t) {
        const e = this.bt;
        const i = this.obj;
        const n = this.v;
        const r = e.$kind === "AccessScope" && this.obs.count === 1;
        if (!r) {
            this.obs.version++;
            t = s.astEvaluate(e, this.scope, this, this);
            this.obs.clear();
        }
        if (!m(t, n)) {
            this.v = t;
            this.cb.call(i, t, n, i);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this.v = s.astEvaluate(this.bt, this.scope, this, this);
        this.obs.clear();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
        this.v = void 0;
    }
}

s.connectable(ComputedWatcher);

s.connectable(ExpressionWatcher);

mixinAstEvaluator(true)(ExpressionWatcher);

class Controller {
    get lifecycleHooks() {
        return this.kt;
    }
    get isActive() {
        return (this.state & (Fe | He)) > 0 && (this.state & Ve) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
              case Me:
                return `[${this.definition.name}]`;

              case Le:
                return this.definition.name;

              case De:
                return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
          case Me:
            return `${this.parent.name}>[${this.definition.name}]`;

          case Le:
            return `${this.parent.name}>${this.definition.name}`;

          case De:
            return this.viewFactory.name === this.parent.definition?.name ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this.Ct;
    }
    set viewModel(t) {
        this.Ct = t;
        this.At = t == null || this.vmKind === De ? HooksDefinition.none : new HooksDefinition(t);
    }
    constructor(t, e, s, i, n, r, l) {
        this.container = t;
        this.vmKind = e;
        this.definition = s;
        this.viewFactory = i;
        this.host = r;
        this.head = null;
        this.tail = null;
        this.next = null;
        this.parent = null;
        this.bindings = null;
        this.children = null;
        this.hasLockedScope = false;
        this.scope = null;
        this.isBound = false;
        this.Bt = false;
        this.hostController = null;
        this.mountTarget = Ae;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.kt = null;
        this.state = qe;
        this.St = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.Tt = 0;
        this.Rt = 0;
        this.It = 0;
        this.Ct = n;
        this.At = e === De ? HooksDefinition.none : new HooksDefinition(n);
        this.location = l;
        this.r = t.root.get(pe);
        this.coercion = e === De ? void 0 : t.get(Ee);
    }
    static getCached(t) {
        return Ce.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (e === void 0) {
            throw createMappedError(500, t);
        }
        return e;
    }
    static $el(e, s, i, n, r = void 0, l = null) {
        if (Ce.has(s)) {
            return Ce.get(s);
        }
        {
            r = r ?? getElementDefinition(s.constructor);
        }
        registerResolver(e, r.Type, new t.InstanceProvider(r.key, s, r.Type));
        const a = new Controller(e, Le, r, null, s, i, l);
        const h = e.get(t.optional(ze));
        if (r.dependencies.length > 0) {
            e.register(...r.dependencies);
        }
        registerResolver(e, ze, new t.InstanceProvider("IHydrationContext", new HydrationContext(a, n, h)));
        Ce.set(s, a);
        if (n == null || n.hydrate !== false) {
            a.hE(n, h);
        }
        return a;
    }
    static $attr(e, s, i, n) {
        if (Ce.has(s)) {
            return Ce.get(s);
        }
        n = n ?? getAttributeDefinition(s.constructor);
        registerResolver(e, n.Type, new t.InstanceProvider(n.key, s, n.Type));
        const r = new Controller(e, Me, n, null, s, i, null);
        if (n.dependencies.length > 0) {
            e.register(...n.dependencies);
        }
        Ce.set(s, r);
        r.Et();
        return r;
    }
    static $view(t, e = void 0) {
        const s = new Controller(t.container, De, null, t, null, null, null);
        s.parent = e ?? null;
        s._t();
        return s;
    }
    hE(e, i) {
        const n = this.container;
        const r = this.Ct;
        const l = this.definition;
        this.scope = s.Scope.create(r, null, true);
        if (l.watches.length > 0) {
            createWatchers(this, n, l, r);
        }
        createObservers(this, l, r);
        this.kt = ut.resolve(n);
        n.register(l.Type);
        if (l.injectable !== null) {
            registerResolver(n, l.injectable, new t.InstanceProvider("definition.injectable", r));
        }
        if (e == null || e.hydrate !== false) {
            this.hS(e);
            this.hC();
        }
    }
    hS(t) {
        if (this.kt.hydrating != null) {
            this.kt.hydrating.forEach(callHydratingHook, this);
        }
        if (this.At.Pt) {
            this.Ct.hydrating(this);
        }
        const e = this.definition;
        const s = this.Lt = this.r.compile(e, this.container, t);
        const i = s.shadowOptions;
        const n = s.hasSlots;
        const r = s.containerless;
        let l = this.host;
        let a = this.location;
        if ((this.hostController = findElementControllerFor(l, Ie)) !== null) {
            l = this.host = this.container.root.get(rt).document.createElement(e.name);
            if (r && a == null) {
                a = this.location = convertToRenderLocation(l);
            }
        }
        setRef(l, os, this);
        setRef(l, e.key, this);
        if (i !== null || n) {
            if (a != null) {
                throw createMappedError(501);
            }
            setRef(this.shadowRoot = l.attachShadow(i ?? Pe), os, this);
            setRef(this.shadowRoot, e.key, this);
            this.mountTarget = Se;
        } else if (a != null) {
            setRef(a, os, this);
            setRef(a, e.key, this);
            this.mountTarget = Te;
        } else {
            this.mountTarget = Be;
        }
        this.Ct.$controller = this;
        this.nodes = this.r.createNodes(s);
        if (this.kt.hydrated !== void 0) {
            this.kt.hydrated.forEach(callHydratedHook, this);
        }
        if (this.At.Mt) {
            this.Ct.hydrated(this);
        }
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Lt, this.host);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At.Dt) {
            this.Ct.created(this);
        }
    }
    Et() {
        const t = this.definition;
        const e = this.Ct;
        if (t.watches.length > 0) {
            createWatchers(this, this.container, t, e);
        }
        createObservers(this, t, e);
        e.$controller = this;
        this.kt = ut.resolve(this.container);
        if (this.kt.created !== void 0) {
            this.kt.created.forEach(callCreatedHook, this);
        }
        if (this.At.Dt) {
            this.Ct.created(this);
        }
    }
    _t() {
        this.Lt = this.r.compile(this.viewFactory.def, this.container, null);
        this.r.render(this, (this.nodes = this.r.createNodes(this.Lt)).findTargets(), this.Lt, void 0);
    }
    activate(e, s, i) {
        switch (this.state) {
          case qe:
          case Oe:
            if (!(s === null || s.isActive)) {
                return;
            }
            this.state = Fe;
            break;

          case He:
            return;

          case Ne:
            throw createMappedError(502, this.name);

          default:
            throw createMappedError(503, this.name, stringifyState(this.state));
        }
        this.parent = s;
        switch (this.vmKind) {
          case Le:
            this.scope.parent = i ?? null;
            break;

          case Me:
            this.scope = i ?? null;
            break;

          case De:
            if (i === void 0 || i === null) {
                throw createMappedError(504, this.name);
            }
            if (!this.hasLockedScope) {
                this.scope = i;
            }
            break;
        }
        this.$initiator = e;
        this.qt();
        let n = void 0;
        if (this.vmKind !== De && this.kt.binding != null) {
            n = t.onResolveAll(...this.kt.binding.map(callBindingHook, this));
        }
        if (this.At.Ft) {
            n = t.onResolveAll(n, this.Ct.binding(this.$initiator, this.parent));
        }
        if (isPromise(n)) {
            this.Ht();
            n.then((() => {
                this.Bt = true;
                if (this.state !== Fe) {
                    this.Vt();
                } else {
                    this.bind();
                }
            })).catch((t => {
                this.Ot(t);
            }));
            return this.$promise;
        }
        this.Bt = true;
        this.bind();
        return this.$promise;
    }
    bind() {
        let e = 0;
        let s = 0;
        let i = void 0;
        if (this.bindings !== null) {
            e = 0;
            s = this.bindings.length;
            while (s > e) {
                this.bindings[e].bind(this.scope);
                ++e;
            }
        }
        if (this.vmKind !== De && this.kt.bound != null) {
            i = t.onResolveAll(...this.kt.bound.map(callBoundHook, this));
        }
        if (this.At.$t) {
            i = t.onResolveAll(i, this.Ct.bound(this.$initiator, this.parent));
        }
        if (isPromise(i)) {
            this.Ht();
            i.then((() => {
                this.isBound = true;
                if (this.state !== Fe) {
                    this.Vt();
                } else {
                    this.Nt();
                }
            })).catch((t => {
                this.Ot(t);
            }));
            return;
        }
        this.isBound = true;
        this.Nt();
    }
    Wt(...t) {
        switch (this.mountTarget) {
          case Be:
            this.host.append(...t);
            break;

          case Se:
            this.shadowRoot.append(...t);
            break;

          case Te:
            {
                let e = 0;
                for (;e < t.length; ++e) {
                    this.location.parentNode.insertBefore(t[e], this.location);
                }
                break;
            }
        }
    }
    Nt() {
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case Be:
              case Se:
                this.hostController.Wt(this.host);
                break;

              case Te:
                this.hostController.Wt(this.location.$start, this.location);
                break;
            }
        }
        switch (this.mountTarget) {
          case Be:
            this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
            break;

          case Se:
            {
                const t = this.container;
                const e = t.has(ge, false) ? t.get(ge) : t.get(xe);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case Te:
            this.nodes.insertBefore(this.location);
            break;
        }
        let e = 0;
        let s = void 0;
        if (this.vmKind !== De && this.kt.attaching != null) {
            s = t.onResolveAll(...this.kt.attaching.map(callAttachingHook, this));
        }
        if (this.At.jt) {
            s = t.onResolveAll(s, this.Ct.attaching(this.$initiator, this.parent));
        }
        if (isPromise(s)) {
            this.Ht();
            this.qt();
            s.then((() => {
                this.Vt();
            })).catch((t => {
                this.Ot(t);
            }));
        }
        if (this.children !== null) {
            for (;e < this.children.length; ++e) {
                void this.children[e].activate(this.$initiator, this, this.scope);
            }
        }
        this.Vt();
    }
    deactivate(e, s) {
        let i = void 0;
        switch (this.state & ~$e) {
          case He:
            this.state = Ve;
            break;

          case Fe:
            this.state = Ve;
            i = this.$promise?.catch(t.noop);
            break;

          case qe:
          case Oe:
          case Ne:
          case Oe | Ne:
            return;

          default:
            throw createMappedError(505, this.name, this.state);
        }
        this.$initiator = e;
        if (e === this) {
            this.zt();
        }
        let n = 0;
        let r;
        if (this.children !== null) {
            for (n = 0; n < this.children.length; ++n) {
                void this.children[n].deactivate(e, this);
            }
        }
        return t.onResolve(i, (() => {
            if (this.isBound) {
                if (this.vmKind !== De && this.kt.detaching != null) {
                    r = t.onResolveAll(...this.kt.detaching.map(callDetachingHook, this));
                }
                if (this.At.Ut) {
                    r = t.onResolveAll(r, this.Ct.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(r)) {
                this.Ht();
                e.zt();
                r.then((() => {
                    e.Gt();
                })).catch((t => {
                    e.Ot(t);
                }));
            }
            if (e.head === null) {
                e.head = this;
            } else {
                e.tail.next = this;
            }
            e.tail = this;
            if (e !== this) {
                return;
            }
            this.Gt();
            return this.$promise;
        }));
    }
    removeNodes() {
        switch (this.vmKind) {
          case Le:
          case De:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
              case Be:
              case Se:
                this.host.remove();
                break;

              case Te:
                this.location.$start.remove();
                this.location.remove();
                break;
            }
        }
    }
    unbind() {
        let t = 0;
        if (this.bindings !== null) {
            for (;t < this.bindings.length; ++t) {
                this.bindings[t].unbind();
            }
        }
        this.parent = null;
        switch (this.vmKind) {
          case Me:
            this.scope = null;
            break;

          case De:
            if (!this.hasLockedScope) {
                this.scope = null;
            }
            if ((this.state & $e) === $e && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) {
                this.dispose();
            }
            break;

          case Le:
            this.scope.parent = null;
            break;
        }
        this.state = Oe;
        this.$initiator = null;
        this.Kt();
    }
    Ht() {
        if (this.$promise === void 0) {
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) {
                this.parent.Ht();
            }
        }
    }
    Kt() {
        if (this.$promise !== void 0) {
            Ue = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ue();
            Ue = void 0;
        }
    }
    Ot(t) {
        if (this.$promise !== void 0) {
            Ge = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Ge(t);
            Ge = void 0;
        }
        if (this.$initiator !== this) {
            this.parent.Ot(t);
        }
    }
    qt() {
        ++this.Tt;
        if (this.$initiator !== this) {
            this.parent.qt();
        }
    }
    Vt() {
        if (this.state !== Fe) {
            --this.Tt;
            this.Kt();
            if (this.$initiator !== this) {
                this.parent.Vt();
            }
            return;
        }
        if (--this.Tt === 0) {
            if (this.vmKind !== De && this.kt.attached != null) {
                Ke = t.onResolveAll(...this.kt.attached.map(callAttachedHook, this));
            }
            if (this.At.Xt) {
                Ke = t.onResolveAll(Ke, this.Ct.attached(this.$initiator));
            }
            if (isPromise(Ke)) {
                this.Ht();
                Ke.then((() => {
                    this.state = He;
                    this.Kt();
                    if (this.$initiator !== this) {
                        this.parent.Vt();
                    }
                })).catch((t => {
                    this.Ot(t);
                }));
                Ke = void 0;
                return;
            }
            Ke = void 0;
            this.state = He;
            this.Kt();
        }
        if (this.$initiator !== this) {
            this.parent.Vt();
        }
    }
    zt() {
        ++this.Rt;
    }
    Gt() {
        if (--this.Rt === 0) {
            this.Qt();
            this.removeNodes();
            let e = this.$initiator.head;
            let s = void 0;
            while (e !== null) {
                if (e !== this) {
                    if (e.debug) {
                        e.logger.trace(`detach()`);
                    }
                    e.removeNodes();
                }
                if (e.Bt) {
                    if (e.vmKind !== De && e.kt.unbinding != null) {
                        s = t.onResolveAll(...e.kt.unbinding.map(callUnbindingHook, e));
                    }
                    if (e.At.Yt) {
                        if (e.debug) {
                            e.logger.trace("unbinding()");
                        }
                        s = t.onResolveAll(s, e.viewModel.unbinding(e.$initiator, e.parent));
                    }
                }
                if (isPromise(s)) {
                    this.Ht();
                    this.Qt();
                    s.then((() => {
                        this.Zt();
                    })).catch((t => {
                        this.Ot(t);
                    }));
                }
                s = void 0;
                e = e.next;
            }
            this.Zt();
        }
    }
    Qt() {
        ++this.It;
    }
    Zt() {
        if (--this.It === 0) {
            let t = this.$initiator.head;
            let e = null;
            while (t !== null) {
                if (t !== this) {
                    t.Bt = false;
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
            }
            this.head = this.tail = null;
            this.Bt = false;
            this.isBound = false;
            this.unbind();
        }
    }
    addBinding(t) {
        if (this.bindings === null) {
            this.bindings = [ t ];
        } else {
            this.bindings[this.bindings.length] = t;
        }
    }
    addChild(t) {
        if (this.children === null) {
            this.children = [ t ];
        } else {
            this.children[this.children.length] = t;
        }
    }
    is(t) {
        switch (this.vmKind) {
          case Me:
          case Le:
            {
                return this.definition.name === t;
            }

          case De:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (this.vmKind === Le) {
            setRef(t, os, this);
            setRef(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = Be;
        return this;
    }
    setShadowRoot(t) {
        if (this.vmKind === Le) {
            setRef(t, os, this);
            setRef(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = Se;
        return this;
    }
    setLocation(t) {
        if (this.vmKind === Le) {
            setRef(t, os, this);
            setRef(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = Te;
        return this;
    }
    release() {
        this.state |= $e;
    }
    dispose() {
        if ((this.state & Ne) === Ne) {
            return;
        }
        this.state |= Ne;
        if (this.At.Jt) {
            this.Ct.dispose();
        }
        if (this.children !== null) {
            this.children.forEach(callDispose);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (this.Ct !== null) {
            Ce.delete(this.Ct);
            this.Ct = null;
        }
        this.Ct = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (t(this) === true) {
            return true;
        }
        if (this.At.te && this.Ct.accept(t) === true) {
            return true;
        }
        if (this.children !== null) {
            const {children: e} = this;
            for (let s = 0, i = e.length; s < i; ++s) {
                if (e[s].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

const Ce = new WeakMap;

const Ae = 0;

const Be = 1;

const Se = 2;

const Te = 3;

const Re = c({
    none: Ae,
    host: Be,
    shadowRoot: Se,
    location: Te
});

const Ie = {
    optional: true
};

const Ee = t.optionalResource(s.ICoercionConfiguration);

function createObservers(e, i, n) {
    const r = i.bindables;
    const l = f(r);
    const a = l.length;
    const h = e.container.get(s.IObserverLocator);
    if (a > 0) {
        for (let s = 0; s < a; ++s) {
            const i = l[s];
            const a = r[i];
            const c = a.callback;
            const u = h.getObserver(n, i);
            if (a.set !== t.noop) {
                if (u.useCoercer?.(a.set, e.coercion) !== true) {
                    throw createMappedError(507, i);
                }
            }
            if (n[c] != null || n.propertyChanged != null) {
                const callback = (t, s) => {
                    if (e.isBound) {
                        n[c]?.(t, s);
                        n.propertyChanged?.(i, t, s);
                    }
                };
                if (u.useCallback?.(callback) !== true) {
                    throw createMappedError(508, i);
                }
            }
        }
    }
}

const _e = new Map;

const getAccessScopeAst = t => {
    let e = _e.get(t);
    if (e == null) {
        e = new s.AccessScopeExpression(t, 0);
        _e.set(t, e);
    }
    return e;
};

function createWatchers(t, e, i, n) {
    const r = e.get(s.IObserverLocator);
    const l = e.get(s.IExpressionParser);
    const a = i.watches;
    const h = t.vmKind === Le ? t.scope : s.Scope.create(n, null, true);
    const c = a.length;
    let u;
    let f;
    let d;
    let p = 0;
    for (;c > p; ++p) {
        ({expression: u, callback: f} = a[p]);
        f = isFunction(f) ? f : Reflect.get(n, f);
        if (!isFunction(f)) {
            throw createMappedError(506, f);
        }
        if (isFunction(u)) {
            t.addBinding(new ComputedWatcher(n, r, u, f, true));
        } else {
            d = isString(u) ? l.parse(u, y) : getAccessScopeAst(u);
            t.addBinding(new ExpressionWatcher(h, e, r, d, f));
        }
    }
}

function isCustomElementController(t) {
    return t instanceof Controller && t.vmKind === Le;
}

function isCustomElementViewModel(t) {
    return e.isObject(t) && isElementType(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.ee = "define" in t;
        this.Pt = "hydrating" in t;
        this.Mt = "hydrated" in t;
        this.Dt = "created" in t;
        this.Ft = "binding" in t;
        this.$t = "bound" in t;
        this.jt = "attaching" in t;
        this.Xt = "attached" in t;
        this.Ut = "detaching" in t;
        this.Yt = "unbinding" in t;
        this.Jt = "dispose" in t;
        this.te = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const Pe = {
    mode: "open"
};

const Le = "customElement";

const Me = "customAttribute";

const De = "synthetic";

const qe = 0;

const Fe = 1;

const He = 2;

const Ve = 4;

const Oe = 8;

const $e = 16;

const Ne = 32;

const We = /*@__PURE__*/ c({
    none: qe,
    activating: Fe,
    activated: He,
    deactivating: Ve,
    deactivated: Oe,
    released: $e,
    disposed: Ne
});

function stringifyState(t) {
    const e = [];
    if ((t & Fe) === Fe) {
        e.push("activating");
    }
    if ((t & He) === He) {
        e.push("activated");
    }
    if ((t & Ve) === Ve) {
        e.push("deactivating");
    }
    if ((t & Oe) === Oe) {
        e.push("deactivated");
    }
    if ((t & $e) === $e) {
        e.push("released");
    }
    if ((t & Ne) === Ne) {
        e.push("disposed");
    }
    return e.length === 0 ? "none" : e.join("|");
}

const je = /*@__PURE__*/ N("IController");

const ze = /*@__PURE__*/ N("IHydrationContext");

class HydrationContext {
    constructor(t, e, s) {
        this.instruction = e;
        this.parent = s;
        this.controller = t;
    }
}

function callDispose(t) {
    t.dispose();
}

function callCreatedHook(t) {
    t.instance.created(this.Ct, this);
}

function callHydratingHook(t) {
    t.instance.hydrating(this.Ct, this);
}

function callHydratedHook(t) {
    t.instance.hydrated(this.Ct, this);
}

function callBindingHook(t) {
    return t.instance.binding(this.Ct, this["$initiator"], this.parent);
}

function callBoundHook(t) {
    return t.instance.bound(this.Ct, this["$initiator"], this.parent);
}

function callAttachingHook(t) {
    return t.instance.attaching(this.Ct, this["$initiator"], this.parent);
}

function callAttachedHook(t) {
    return t.instance.attached(this.Ct, this["$initiator"]);
}

function callDetachingHook(t) {
    return t.instance.detaching(this.Ct, this["$initiator"], this.parent);
}

function callUnbindingHook(t) {
    return t.instance.unbinding(this.Ct, this["$initiator"], this.parent);
}

let Ue;

let Ge;

let Ke;

class Refs {}

function getRef(t, e) {
    return t.$au?.[e] ?? null;
}

function setRef(t, e, s) {
    (t.$au ??= new Refs)[e] = s;
}

const Xe = /*@__PURE__*/ N("INode");

const Qe = /*@__PURE__*/ N("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(us, true)) {
        return t.get(us).host;
    }
    return t.get(rt).document;
}))));

const Ye = /*@__PURE__*/ N("IRenderLocation");

const Ze = /*@__PURE__*/ N("CssModules");

const Je = new WeakMap;

function getEffectiveParentNode(t) {
    if (Je.has(t)) {
        return Je.get(t);
    }
    let e = 0;
    let s = t.nextSibling;
    while (s !== null) {
        if (s.nodeType === 8) {
            switch (s.textContent) {
              case "au-start":
                ++e;
                break;

              case "au-end":
                if (e-- === 0) {
                    return s;
                }
            }
        }
        s = s.nextSibling;
    }
    if (t.parentNode === null && t.nodeType === 11) {
        const e = findElementControllerFor(t, {
            optional: true
        });
        if (e == null) {
            return null;
        }
        if (e.mountTarget === Re.shadowRoot) {
            return getEffectiveParentNode(e.host);
        }
    }
    return t.parentNode;
}

function setEffectiveParentNode(t, e) {
    if (t.platform !== void 0 && !(t instanceof t.platform.Node)) {
        const s = t.childNodes;
        for (let t = 0, i = s.length; t < i; ++t) {
            Je.set(s[t], e);
        }
    } else {
        Je.set(t, e);
    }
}

function convertToRenderLocation(t) {
    if (isRenderLocation(t)) {
        return t;
    }
    const e = t.ownerDocument.createComment("au-end");
    const s = e.$start = t.ownerDocument.createComment("au-start");
    const i = t.parentNode;
    if (i !== null) {
        i.replaceChild(e, t);
        i.insertBefore(s, e);
    }
    return e;
}

function isRenderLocation(t) {
    return t.textContent === "au-end";
}

class FragmentNodeSequence {
    get firstChild() {
        return this.se;
    }
    get lastChild() {
        return this.ie;
    }
    constructor(t, e) {
        this.platform = t;
        this.next = void 0;
        this.ne = false;
        this.re = false;
        this.ref = null;
        const s = (this.f = e).querySelectorAll("au-m");
        let i = 0;
        let n = s.length;
        let r = this.t = Array(n);
        let l;
        let a;
        while (n > i) {
            a = s[i];
            l = a.nextSibling;
            a.remove();
            if (l.nodeType === 8) {
                a = l;
                (l = l.nextSibling).$start = a;
            }
            r[i] = l;
            ++i;
        }
        const h = e.childNodes;
        const c = this.childNodes = Array(n = h.length);
        i = 0;
        while (n > i) {
            c[i] = h[i];
            ++i;
        }
        this.se = e.firstChild;
        this.ie = e.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(t) {
        if (this.re && !!this.ref) {
            this.addToLinked();
        } else {
            const e = t.parentNode;
            if (this.ne) {
                let s = this.se;
                let i;
                const n = this.ie;
                while (s != null) {
                    i = s.nextSibling;
                    e.insertBefore(s, t);
                    if (s === n) {
                        break;
                    }
                    s = i;
                }
            } else {
                this.ne = true;
                t.parentNode.insertBefore(this.f, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.ne) {
            let e = this.se;
            let s;
            const i = this.ie;
            while (e != null) {
                s = e.nextSibling;
                t.appendChild(e);
                if (e === i) {
                    break;
                }
                e = s;
            }
        } else {
            this.ne = true;
            if (!e) {
                t.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this.ne) {
            this.ne = false;
            const t = this.f;
            const e = this.ie;
            let s;
            let i = this.se;
            while (i !== null) {
                s = i.nextSibling;
                t.appendChild(i);
                if (i === e) {
                    break;
                }
                i = s;
            }
        }
    }
    addToLinked() {
        const t = this.ref;
        const e = t.parentNode;
        if (this.ne) {
            let s = this.se;
            let i;
            const n = this.ie;
            while (s != null) {
                i = s.nextSibling;
                e.insertBefore(s, t);
                if (s === n) {
                    break;
                }
                s = i;
            }
        } else {
            this.ne = true;
            e.insertBefore(this.f, t);
        }
    }
    unlink() {
        this.re = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(t) {
        this.re = true;
        if (isRenderLocation(t)) {
            this.ref = t;
        } else {
            this.next = t;
            this.oe();
        }
    }
    oe() {
        if (this.next !== void 0) {
            this.ref = this.next.firstChild;
        } else {
            this.ref = void 0;
        }
    }
}

const ts = /*@__PURE__*/ N("IWindow", (t => t.callback((t => t.get(rt).window))));

const es = /*@__PURE__*/ N("ILocation", (t => t.callback((t => t.get(ts).location))));

const ss = /*@__PURE__*/ N("IHistory", (t => t.callback((t => t.get(ts).history))));

const registerHostNode = (e, s, i) => {
    registerResolver(e, s.HTMLElement, registerResolver(e, s.Element, registerResolver(e, Xe, new t.InstanceProvider("ElementResolver", i))));
    return e;
};

function customElement(t) {
    return function(e) {
        return defineElement(t, e);
    };
}

function useShadowDOM(t) {
    if (t === void 0) {
        return function(t) {
            annotateElementMetadata(t, "shadowOptions", {
                mode: "open"
            });
        };
    }
    if (!isFunction(t)) {
        return function(e) {
            annotateElementMetadata(e, "shadowOptions", t);
        };
    }
    annotateElementMetadata(t, "shadowOptions", {
        mode: "open"
    });
}

function containerless(t) {
    if (t === void 0) {
        return function(t) {
            markContainerless(t);
        };
    }
    markContainerless(t);
}

function markContainerless(t) {
    const e = P(os, t);
    if (e === void 0) {
        annotateElementMetadata(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

const is = new WeakMap;

class CustomElementDefinition {
    get kind() {
        return U;
    }
    constructor(t, e, s, i, n, r, l, a, h, c, u, f, d, p, m, g, x, v, w) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
        this.cache = n;
        this.capture = r;
        this.template = l;
        this.instructions = a;
        this.dependencies = h;
        this.injectable = c;
        this.needsCompile = u;
        this.surrogates = f;
        this.bindables = d;
        this.containerless = p;
        this.shadowOptions = m;
        this.hasSlots = g;
        this.enhance = x;
        this.watches = v;
        this.processContent = w;
    }
    static create(e, s = null) {
        if (s === null) {
            const i = e;
            if (isString(i)) {
                throw createMappedError(761, e);
            }
            const n = t.fromDefinitionOrDefault("name", i, ls);
            if (isFunction(i.Type)) {
                s = i.Type;
            } else {
                s = as(t.pascalCase(n));
            }
            return new CustomElementDefinition(s, n, t.mergeArrays(i.aliases), t.fromDefinitionOrDefault("key", i, (() => getElementKeyFrom(n))), t.fromDefinitionOrDefault("cache", i, returnZero), t.fromDefinitionOrDefault("capture", i, returnFalse), t.fromDefinitionOrDefault("template", i, returnNull), t.mergeArrays(i.instructions), t.mergeArrays(i.dependencies), t.fromDefinitionOrDefault("injectable", i, returnNull), t.fromDefinitionOrDefault("needsCompile", i, returnTrue), t.mergeArrays(i.surrogates), O.from(s, i.bindables), t.fromDefinitionOrDefault("containerless", i, returnFalse), t.fromDefinitionOrDefault("shadowOptions", i, returnNull), t.fromDefinitionOrDefault("hasSlots", i, returnFalse), t.fromDefinitionOrDefault("enhance", i, returnFalse), t.fromDefinitionOrDefault("watches", i, returnEmptyArray), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        if (isString(e)) {
            return new CustomElementDefinition(s, e, t.mergeArrays(getElementAnnotation(s, "aliases"), s.aliases), getElementKeyFrom(e), t.fromAnnotationOrTypeOrDefault("cache", s, returnZero), t.fromAnnotationOrTypeOrDefault("capture", s, returnFalse), t.fromAnnotationOrTypeOrDefault("template", s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), s.dependencies), t.fromAnnotationOrTypeOrDefault("injectable", s, returnNull), t.fromAnnotationOrTypeOrDefault("needsCompile", s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), s.surrogates), O.from(s, ...O.getAll(s), getElementAnnotation(s, "bindables"), s.bindables), t.fromAnnotationOrTypeOrDefault("containerless", s, returnFalse), t.fromAnnotationOrTypeOrDefault("shadowOptions", s, returnNull), t.fromAnnotationOrTypeOrDefault("hasSlots", s, returnFalse), t.fromAnnotationOrTypeOrDefault("enhance", s, returnFalse), t.mergeArrays(ot.getDefinitions(s), s.watches), t.fromAnnotationOrTypeOrDefault("processContent", s, returnNull));
        }
        const i = t.fromDefinitionOrDefault("name", e, ls);
        return new CustomElementDefinition(s, i, t.mergeArrays(getElementAnnotation(s, "aliases"), e.aliases, s.aliases), getElementKeyFrom(i), t.fromAnnotationOrDefinitionOrTypeOrDefault("cache", e, s, returnZero), t.fromAnnotationOrDefinitionOrTypeOrDefault("capture", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("template", e, s, returnNull), t.mergeArrays(getElementAnnotation(s, "instructions"), e.instructions, s.instructions), t.mergeArrays(getElementAnnotation(s, "dependencies"), e.dependencies, s.dependencies), t.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", e, s, returnTrue), t.mergeArrays(getElementAnnotation(s, "surrogates"), e.surrogates, s.surrogates), O.from(s, ...O.getAll(s), getElementAnnotation(s, "bindables"), s.bindables, e.bindables), t.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", e, s, returnNull), t.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", e, s, returnFalse), t.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", e, s, returnFalse), t.mergeArrays(e.watches, ot.getDefinitions(s), s.watches), t.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", e, s, returnNull));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) {
            return t;
        }
        if (is.has(t)) {
            return is.get(t);
        }
        const e = CustomElementDefinition.create(t);
        is.set(t, e);
        M(os, e, e.Type);
        return e;
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getElementKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : W(s, s), j(s, i), ...n.map((t => j(s, getElementKeyFrom(t)))));
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}

const ns = {
    name: undefined,
    searchParents: false,
    optional: false
};

const returnZero = () => 0;

const returnNull = () => null;

const returnFalse = () => false;

const returnTrue = () => true;

const returnEmptyArray = () => t.emptyArray;

const rs = "custom-element";

const os = /*@__PURE__*/ t.getResourceKeyFor(rs);

const getElementKeyFrom = t => `${os}:${t}`;

const ls = /*@__PURE__*/ (t => () => `unnamed-${++t}`)(0);

const annotateElementMetadata = (t, e, s) => {
    M(q(e), s, t);
};

const defineElement = (e, s) => {
    const i = CustomElementDefinition.create(e, s);
    const n = i.Type;
    M(os, i, n);
    M(t.resourceBaseName, i, n);
    return n;
};

const isElementType = t => isFunction(t) && (L(os, t) || t.$au?.type === rs);

const findElementControllerFor = (t, e = ns) => {
    if (e.name === void 0 && e.searchParents !== true) {
        const s = getRef(t, os);
        if (s === null) {
            if (e.optional === true) {
                return null;
            }
            throw createMappedError(762, t);
        }
        return s;
    }
    if (e.name !== void 0) {
        if (e.searchParents !== true) {
            const s = getRef(t, os);
            if (s === null) {
                throw createMappedError(763, t);
            }
            if (s.is(e.name)) {
                return s;
            }
            return void 0;
        }
        let s = t;
        let i = false;
        while (s !== null) {
            const t = getRef(s, os);
            if (t !== null) {
                i = true;
                if (t.is(e.name)) {
                    return t;
                }
            }
            s = getEffectiveParentNode(s);
        }
        if (i) {
            return void 0;
        }
        throw createMappedError(764, t);
    }
    let s = t;
    while (s !== null) {
        const t = getRef(s, os);
        if (t !== null) {
            return t;
        }
        s = getEffectiveParentNode(s);
    }
    throw createMappedError(765, t);
};

const getElementAnnotation = (t, e) => P(q(e), t);

const getElementDefinition = t => {
    const e = P(os, t) ?? getDefinitionFromStaticAu(t, rs, CustomElementDefinition.create);
    if (e == null) {
        throw createMappedError(760, t);
    }
    return e;
};

const createElementInjectable = () => {
    const $injectable = function(e, s, i) {
        const n = t.DI.getOrCreateAnnotationParamTypes(e);
        n[i] = $injectable;
        return e;
    };
    $injectable.register = () => ({
        $isResolver: true,
        resolve(t, e) {
            if (e.has($injectable, true)) {
                return e.get($injectable);
            } else {
                return null;
            }
        }
    });
    return $injectable;
};

const as = /*@__PURE__*/ function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(s, i = e) {
        const n = class Anonymous {};
        t.value = s;
        g(n, "name", t);
        if (i !== e) {
            u(n.prototype, i);
        }
        return n;
    };
}();

const hs = c({
    name: os,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: ls,
    createInjectable: createElementInjectable,
    generateType: as,
    find(t, e) {
        const s = t.find(rs, e);
        return s == null ? null : P(os, s) ?? getDefinitionFromStaticAu(s, rs, CustomElementDefinition.create) ?? null;
    }
});

const cs = /*@__PURE__*/ q("processContent");

function processContent(t) {
    return t === void 0 ? function(t, e, s) {
        M(cs, ensureHook(t, e), t);
    } : function(e) {
        t = ensureHook(e, t);
        const s = P(os, e);
        if (s !== void 0) {
            s.processContent = t;
        } else {
            M(cs, t, e);
        }
        return e;
    };
}

function ensureHook(t, e) {
    if (isString(e)) {
        e = t[e];
    }
    if (!isFunction(e)) {
        throw createMappedError(766, e);
    }
    return e;
}

function capture(t) {
    return function(e) {
        const s = isFunction(t) ? t : true;
        annotateElementMetadata(e, "capture", s);
        if (isElementType(e)) {
            getElementDefinition(e).capture = s;
        }
    };
}

const us = /*@__PURE__*/ N("IAppRoot");

class AppRoot {
    get controller() {
        return this._;
    }
    constructor(e, s, i, n = false) {
        this.config = e;
        this.container = s;
        this.le = void 0;
        this.ae = n;
        const r = this.host = e.host;
        i.prepare(this);
        registerHostNode(s, this.platform = this.he(s, r), r);
        this.le = t.onResolve(this.ce("creating"), (() => {
            if (!e.allowActionlessForm !== false) {
                r.addEventListener("submit", (t => {
                    const e = t.target;
                    const s = (e.getAttribute("action")?.length ?? 0) > 0;
                    if (e.tagName === "FORM" && !s) {
                        t.preventDefault();
                    }
                }), false);
            }
            const i = n ? s : s.createChild();
            const l = e.component;
            let a;
            if (isFunction(l)) {
                a = i.invoke(l);
                z(l, a);
            } else {
                a = e.component;
            }
            const h = {
                hydrate: false,
                projections: null
            };
            const c = n ? CustomElementDefinition.create({
                name: ls(),
                template: this.host,
                enhance: true
            }) : void 0;
            const u = this._ = Controller.$el(i, a, r, h, c);
            u.hE(h, null);
            return t.onResolve(this.ce("hydrating"), (() => {
                u.hS(null);
                return t.onResolve(this.ce("hydrated"), (() => {
                    u.hC();
                    this.le = void 0;
                }));
            }));
        }));
    }
    activate() {
        return t.onResolve(this.le, (() => t.onResolve(this.ce("activating"), (() => t.onResolve(this._.activate(this._, null, void 0), (() => this.ce("activated")))))));
    }
    deactivate() {
        return t.onResolve(this.ce("deactivating"), (() => t.onResolve(this._.deactivate(this._, null), (() => this.ce("deactivated")))));
    }
    ce(e) {
        const s = this.container;
        const i = this.ae && !s.has(it, false) ? [] : s.getAll(it);
        return t.onResolveAll(...i.reduce(((t, s) => {
            if (s.slot === e) {
                t.push(s.run());
            }
            return t;
        }), []));
    }
    he(t, e) {
        let s;
        if (!t.has(rt, false)) {
            if (e.ownerDocument.defaultView === null) {
                throw createMappedError(769);
            }
            s = new i.BrowserPlatform(e.ownerDocument.defaultView);
            t.register(z(rt, s));
        } else {
            s = t.get(rt);
        }
        return s;
    }
    dispose() {
        this._?.dispose();
    }
}

const fs = /*@__PURE__*/ N("IAurelia");

class Aurelia {
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.ue;
    }
    get isStopping() {
        return this.fe;
    }
    get root() {
        if (this.de == null) {
            if (this.next == null) {
                throw createMappedError(767);
            }
            return this.next;
        }
        return this.de;
    }
    constructor(e = t.DI.createContainer()) {
        this.container = e;
        this.ir = false;
        this.ue = false;
        this.fe = false;
        this.de = void 0;
        this.next = void 0;
        this.pe = void 0;
        this.me = void 0;
        if (e.has(fs, true) || e.has(Aurelia, true)) {
            throw createMappedError(768);
        }
        registerResolver(e, fs, new t.InstanceProvider("IAurelia", this));
        registerResolver(e, Aurelia, new t.InstanceProvider("Aurelia", this));
        registerResolver(e, us, this.ge = new t.InstanceProvider("IAppRoot"));
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.container, this.ge);
        return this;
    }
    enhance(e) {
        const s = new AppRoot({
            host: e.host,
            component: e.component
        }, e.container ?? this.container.createChild(), new t.InstanceProvider("IAppRoot"), true);
        return t.onResolve(s.activate(), (() => s));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    start(e = this.next) {
        if (e == null) {
            throw createMappedError(770);
        }
        if (isPromise(this.pe)) {
            return this.pe;
        }
        return this.pe = t.onResolve(this.stop(), (() => {
            Reflect.set(e.host, "$aurelia", this);
            this.ge.prepare(this.de = e);
            this.ue = true;
            return t.onResolve(e.activate(), (() => {
                this.ir = true;
                this.ue = false;
                this.pe = void 0;
                this.xe(e, "au-started", e.host);
            }));
        }));
    }
    stop(e = false) {
        if (isPromise(this.me)) {
            return this.me;
        }
        if (this.ir === true) {
            const s = this.de;
            this.ir = false;
            this.fe = true;
            return this.me = t.onResolve(s.deactivate(), (() => {
                Reflect.deleteProperty(s.host, "$aurelia");
                if (e) {
                    s.dispose();
                }
                this.de = void 0;
                this.ge.dispose();
                this.fe = false;
                this.xe(s, "au-stopped", s.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.fe) {
            throw createMappedError(771);
        }
        this.container.dispose();
    }
    xe(t, e, s) {
        const i = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        s.dispatchEvent(i);
    }
}

class CharSpec {
    constructor(t, e, s, i) {
        this.chars = t;
        this.repeat = e;
        this.isSymbol = s;
        this.isInverted = i;
        if (i) {
            switch (t.length) {
              case 0:
                this.has = this.ve;
                break;

              case 1:
                this.has = this.we;
                break;

              default:
                this.has = this.ye;
            }
        } else {
            switch (t.length) {
              case 0:
                this.has = this.be;
                break;

              case 1:
                this.has = this.ke;
                break;

              default:
                this.has = this.Ce;
            }
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    Ce(t) {
        return this.chars.includes(t);
    }
    ke(t) {
        return this.chars === t;
    }
    be(t) {
        return false;
    }
    ye(t) {
        return !this.chars.includes(t);
    }
    we(t) {
        return this.chars !== t;
    }
    ve(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = t.emptyArray;
        this.Ae = "";
        this.Be = {};
        this.Se = {};
    }
    get pattern() {
        const t = this.Ae;
        if (t === "") {
            return null;
        } else {
            return t;
        }
    }
    set pattern(e) {
        if (e == null) {
            this.Ae = "";
            this.parts = t.emptyArray;
        } else {
            this.Ae = e;
            this.parts = this.Se[e];
        }
    }
    append(t, e) {
        const s = this.Be;
        if (s[t] === undefined) {
            s[t] = e;
        } else {
            s[t] += e;
        }
    }
    next(t) {
        const e = this.Be;
        let s;
        if (e[t] !== undefined) {
            s = this.Se;
            if (s[t] === undefined) {
                s[t] = [ e[t] ];
            } else {
                s[t].push(e[t]);
            }
            e[t] = undefined;
        }
    }
}

class AttrParsingState {
    get Ae() {
        return this.Te ? this.Re[0] : null;
    }
    constructor(t, ...e) {
        this.charSpec = t;
        this.Ie = [];
        this.Ee = null;
        this.Te = false;
        this.Re = e;
    }
    findChild(t) {
        const e = this.Ie;
        const s = e.length;
        let i = null;
        let n = 0;
        for (;n < s; ++n) {
            i = e[n];
            if (t.equals(i.charSpec)) {
                return i;
            }
        }
        return null;
    }
    append(t, e) {
        const s = this.Re;
        if (!s.includes(e)) {
            s.push(e);
        }
        let i = this.findChild(t);
        if (i == null) {
            i = new AttrParsingState(t, e);
            this.Ie.push(i);
            if (t.repeat) {
                i.Ie.push(i);
            }
        }
        return i;
    }
    findMatches(t, e) {
        const s = [];
        const i = this.Ie;
        const n = i.length;
        let r = 0;
        let l = null;
        let a = 0;
        let h = 0;
        for (;a < n; ++a) {
            l = i[a];
            if (l.charSpec.has(t)) {
                s.push(l);
                r = l.Re.length;
                h = 0;
                if (l.charSpec.isSymbol) {
                    for (;h < r; ++h) {
                        e.next(l.Re[h]);
                    }
                } else {
                    for (;h < r; ++h) {
                        e.append(l.Re[h], t);
                    }
                }
            }
        }
        return s;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const e = this._e = t.length;
        const s = this.Pe = [];
        let i = 0;
        for (;e > i; ++i) {
            s.push(new CharSpec(t[i], false, false, false));
        }
    }
    eachChar(t) {
        const e = this._e;
        const s = this.Pe;
        let i = 0;
        for (;e > i; ++i) {
            t(s[i]);
        }
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.Le = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.Le);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.Le = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.Le);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const ds = /*@__PURE__*/ N("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.Me = new AttrParsingState(null);
        this.De = [ this.Me ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let s;
        let i;
        let n;
        let r;
        let l;
        let a;
        let h;
        let c = 0;
        let u;
        while (e > c) {
            s = this.Me;
            i = t[c];
            n = i.pattern;
            r = new SegmentTypes;
            l = this.qe(i, r);
            a = l.length;
            h = t => s = s.append(t, n);
            for (u = 0; a > u; ++u) {
                l[u].eachChar(h);
            }
            s.Ee = r;
            s.Te = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const s = t.length;
        let i = this.De;
        let n = 0;
        let r;
        for (;n < s; ++n) {
            i = this.Fe(i, t.charAt(n), e);
            if (i.length === 0) {
                break;
            }
        }
        i = i.filter(isEndpoint);
        if (i.length > 0) {
            i.sort(sortEndpoint);
            r = i[0];
            if (!r.charSpec.isSymbol) {
                e.next(r.Ae);
            }
            e.pattern = r.Ae;
        }
        return e;
    }
    Fe(t, e, s) {
        const i = [];
        let n = null;
        const r = t.length;
        let l = 0;
        for (;l < r; ++l) {
            n = t[l];
            i.push(...n.findMatches(e, s));
        }
        return i;
    }
    qe(t, e) {
        const s = [];
        const i = t.pattern;
        const n = i.length;
        const r = t.symbols;
        let l = 0;
        let a = 0;
        let h = "";
        while (l < n) {
            h = i.charAt(l);
            if (r.length === 0 || !r.includes(h)) {
                if (l === a) {
                    if (h === "P" && i.slice(l, l + 4) === "PART") {
                        a = l = l + 4;
                        s.push(new DynamicSegment(r));
                        ++e.dynamics;
                    } else {
                        ++l;
                    }
                } else {
                    ++l;
                }
            } else if (l !== a) {
                s.push(new StaticSegment(i.slice(a, l)));
                ++e.statics;
                a = l;
            } else {
                s.push(new SymbolSegment(i.slice(a, l + 1)));
                ++e.symbols;
                a = ++l;
            }
        }
        if (a !== l) {
            s.push(new StaticSegment(i.slice(a, l)));
            ++e.statics;
        }
        return s;
    }
}

function isEndpoint(t) {
    return t.Te;
}

function sortEndpoint(t, e) {
    const s = t.Ee;
    const i = e.Ee;
    if (s.statics !== i.statics) {
        return i.statics - s.statics;
    }
    if (s.dynamics !== i.dynamics) {
        return i.dynamics - s.dynamics;
    }
    if (s.symbols !== i.symbols) {
        return i.symbols - s.symbols;
    }
    return 0;
}

class AttrSyntax {
    constructor(t, e, s, i, n = null) {
        this.rawName = t;
        this.rawValue = e;
        this.target = s;
        this.command = i;
        this.parts = n;
    }
}

const ps = /*@__PURE__*/ N("IAttributePattern");

const ms = /*@__PURE__*/ N("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor() {
        this.j = {};
        const e = this.He = t.resolve(ds);
        const s = xs.findAll(t.resolve(t.IContainer));
        const i = this.Re = {};
        const n = s.reduce(((t, e) => {
            const s = getAllPatternDefinitions(e.constructor);
            s.forEach((t => i[t.pattern] = e));
            return t.concat(s);
        }), t.emptyArray);
        e.add(n);
    }
    parse(t, e) {
        let s = this.j[t];
        if (s == null) {
            s = this.j[t] = this.He.interpret(t);
        }
        const i = s.pattern;
        if (i == null) {
            return new AttrSyntax(t, e, t, null, null);
        } else {
            return this.Re[i][i](t, e, s.parts);
        }
    }
}

function attributePattern(...t) {
    return function decorator(e) {
        return xs.define(t, e);
    };
}

const getAllPatternDefinitions = e => gs.get(e) ?? t.emptyArray;

const gs = new WeakMap;

const xs = c({
    name: t.getResourceKeyFor("attribute-pattern"),
    define(e, s) {
        gs.set(s, e);
        return t.Registrable.define(s, (t => {
            W(ps, s).register(t);
        }));
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: t => t.root.getAll(ps)
});

exports.DotSeparatedAttributePattern = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], s[1]);
    }
    "PART.PART.PART"(t, e, s) {
        return new AttrSyntax(t, e, `${s[0]}.${s[1]}`, s[2]);
    }
};

exports.DotSeparatedAttributePattern = __decorate([ attributePattern({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], exports.DotSeparatedAttributePattern);

exports.RefAttributePattern = class RefAttributePattern {
    ref(t, e, s) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, s) {
        let i = s[0];
        if (i === "view-model") {
            i = "component";
        }
        return new AttrSyntax(t, e, i, "ref");
    }
};

exports.RefAttributePattern = __decorate([ attributePattern({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], exports.RefAttributePattern);

let vs = class EventAttributePattern {
    "PART.trigger:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger", s);
    }
    "PART.capture:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "capture", s);
    }
};

vs = __decorate([ attributePattern({
    pattern: "PART.trigger:PART",
    symbols: ".:"
}, {
    pattern: "PART.capture:PART",
    symbols: ".:"
}) ], vs);

exports.ColonPrefixedBindAttributePattern = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "bind");
    }
};

exports.ColonPrefixedBindAttributePattern = __decorate([ attributePattern({
    pattern: ":PART",
    symbols: ":"
}) ], exports.ColonPrefixedBindAttributePattern);

exports.AtPrefixedTriggerAttributePattern = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger");
    }
    "@PART:PART"(t, e, s) {
        return new AttrSyntax(t, e, s[0], "trigger", [ s[0], "trigger", ...s.slice(1) ]);
    }
};

exports.AtPrefixedTriggerAttributePattern = __decorate([ attributePattern({
    pattern: "@PART",
    symbols: "@"
}, {
    pattern: "@PART:PART",
    symbols: "@:"
}) ], exports.AtPrefixedTriggerAttributePattern);

let ws = class SpreadAttributePattern {
    "...$attrs"(t, e, s) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

ws = __decorate([ attributePattern({
    pattern: "...$attrs",
    symbols: ""
}) ], ws);

function bindingCommand(t) {
    return function(e) {
        return ks.define(t, e);
    };
}

class BindingCommandDefinition {
    constructor(t, e, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = s;
        this.key = i;
    }
    static create(e, s) {
        let i;
        let n;
        if (isString(e)) {
            i = e;
            n = {
                name: i
            };
        } else {
            i = e.name;
            n = e;
        }
        return new BindingCommandDefinition(s, t.firstDefined(getCommandAnnotation(s, "name"), i), t.mergeArrays(getCommandAnnotation(s, "aliases"), n.aliases, s.aliases), getCommandKeyFrom(i));
    }
    register(t, e) {
        const s = this.Type;
        const i = typeof e === "string" ? getCommandKeyFrom(e) : this.key;
        const n = this.aliases;
        if (!t.has(i, false)) {
            t.register(t.has(s, false) ? null : W(s, s), j(s, i), ...n.map((t => j(s, getCommandKeyFrom(t)))));
        }
    }
}

const ys = "binding-command";

const bs = /*@__PURE__*/ t.getResourceKeyFor(ys);

const getCommandKeyFrom = t => `${bs}:${t}`;

const getCommandAnnotation = (t, e) => P(q(e), t);

const ks = c({
    name: bs,
    keyFrom: getCommandKeyFrom,
    define(e, s) {
        const i = BindingCommandDefinition.create(e, s);
        const n = i.Type;
        M(bs, i, n);
        M(t.resourceBaseName, i, n);
        return n;
    },
    getAnnotation: getCommandAnnotation,
    find(t, e) {
        const s = t.find(ys, e);
        return s == null ? null : P(bs, s) ?? getDefinitionFromStaticAu(s, ys, BindingCommandDefinition.create) ?? null;
    },
    get(e, s) {
        return e.get(t.resource(getCommandKeyFrom(s)));
    }
});

class OneTimeBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.kind === U) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, S);
    }
}

OneTimeBindingCommand.$au = {
    type: ys,
    name: "one-time"
};

class ToViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = e.attr.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.kind === U) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, T);
    }
}

ToViewBindingCommand.$au = {
    type: ys,
    name: "to-view"
};

class FromViewBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.kind === U) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, R);
    }
}

FromViewBindingCommand.$au = {
    type: ys,
    name: "from-view"
};

class TwoWayBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, s, i) {
        const n = e.attr;
        let r = n.target;
        let l = n.rawValue;
        if (e.bindable == null) {
            r = i.map(e.node, r) ?? t.camelCase(r);
        } else {
            if (l === "" && e.def.kind === U) {
                l = t.camelCase(r);
            }
            r = e.bindable.name;
        }
        return new PropertyBindingInstruction(s.parse(l, y), r, I);
    }
}

TwoWayBindingCommand.$au = {
    type: ys,
    name: "two-way"
};

class DefaultBindingCommand {
    get ignoreAttr() {
        return false;
    }
    build(e, s, i) {
        const n = e.attr;
        const r = e.bindable;
        let l;
        let a;
        let h = n.target;
        let c = n.rawValue;
        if (r == null) {
            a = i.isTwoWay(e.node, h) ? I : T;
            h = i.map(e.node, h) ?? t.camelCase(h);
        } else {
            if (c === "" && e.def.kind === U) {
                c = t.camelCase(h);
            }
            l = e.def.defaultBindingMode;
            a = r.mode === E || r.mode == null ? l == null || l === E ? T : l : r.mode;
            h = r.name;
        }
        return new PropertyBindingInstruction(s.parse(c, y), h, a);
    }
}

DefaultBindingCommand.$au = {
    type: ys,
    name: "bind"
};

class ForBindingCommand {
    constructor() {
        this.Ve = t.resolve(ms);
    }
    get ignoreAttr() {
        return false;
    }
    build(e, s) {
        const i = e.bindable === null ? t.camelCase(e.attr.target) : e.bindable.name;
        const n = s.parse(e.attr.rawValue, v);
        let r = t.emptyArray;
        if (n.semiIdx > -1) {
            const t = e.attr.rawValue.slice(n.semiIdx + 1);
            const s = t.indexOf(":");
            if (s > -1) {
                const e = t.slice(0, s).trim();
                const i = t.slice(s + 1).trim();
                const n = this.Ve.parse(e, i);
                r = [ new MultiAttrInstruction(i, n.target, n.command) ];
            }
        }
        return new IteratorBindingInstruction(n, i, r);
    }
}

ForBindingCommand.$au = {
    type: ys,
    name: "for"
};

class TriggerBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, w), t.attr.target, false, t.attr.parts?.[2] ?? null);
    }
}

TriggerBindingCommand.$au = {
    type: ys,
    name: "trigger"
};

class CaptureBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new ListenerBindingInstruction(e.parse(t.attr.rawValue, w), t.attr.target, true, t.attr.parts?.[2] ?? null);
    }
}

CaptureBindingCommand.$au = {
    type: ys,
    name: "capture"
};

class AttrBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction(t.attr.target, e.parse(t.attr.rawValue, y), t.attr.target);
    }
}

AttrBindingCommand.$au = {
    type: ys,
    name: "attr"
};

class StyleBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("style", e.parse(t.attr.rawValue, y), t.attr.target);
    }
}

StyleBindingCommand.$au = {
    type: ys,
    name: "style"
};

class ClassBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new AttributeBindingInstruction("class", e.parse(t.attr.rawValue, y), t.attr.target);
    }
}

ClassBindingCommand.$au = {
    type: ys,
    name: "class"
};

class RefBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t, e) {
        return new RefBindingInstruction(e.parse(t.attr.rawValue, y), t.attr.target);
    }
}

RefBindingCommand.$au = {
    type: ys,
    name: "ref"
};

class SpreadBindingCommand {
    get ignoreAttr() {
        return true;
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
}

SpreadBindingCommand.$au = {
    type: ys,
    name: "...$attrs"
};

const Cs = /*@__PURE__*/ N("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

const o = t => {
    const e = createLookup();
    t = isString(t) ? t.split(" ") : t;
    let s;
    for (s of t) {
        e[s] = true;
    }
    return e;
};

class NoopSVGAnalyzer {
    isStandardSvgAttribute(t, e) {
        return false;
    }
}

class SVGAnalyzer {
    static register(t) {
        t.register(W(this, this), j(this, Cs));
    }
    constructor() {
        this.Oe = u(createLookup(), {
            a: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            altGlyph: o("class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            altglyph: createLookup(),
            altGlyphDef: o("id xml:base xml:lang xml:space"),
            altglyphdef: createLookup(),
            altGlyphItem: o("id xml:base xml:lang xml:space"),
            altglyphitem: createLookup(),
            animate: o("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateColor: o("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateMotion: o("accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            animateTransform: o("accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            circle: o("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            clipPath: o("class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            "color-profile": o("id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            cursor: o("externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            defs: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            desc: o("class id style xml:base xml:lang xml:space"),
            ellipse: o("class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space"),
            feBlend: o("class height id in in2 mode result style width x xml:base xml:lang xml:space y"),
            feColorMatrix: o("class height id in result style type values width x xml:base xml:lang xml:space y"),
            feComponentTransfer: o("class height id in result style width x xml:base xml:lang xml:space y"),
            feComposite: o("class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y"),
            feConvolveMatrix: o("bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y"),
            feDiffuseLighting: o("class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y"),
            feDisplacementMap: o("class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector"),
            feDistantLight: o("azimuth elevation id xml:base xml:lang xml:space"),
            feFlood: o("class height id result style width x xml:base xml:lang xml:space y"),
            feFuncA: o("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncB: o("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncG: o("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feFuncR: o("amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space"),
            feGaussianBlur: o("class height id in result stdDeviation style width x xml:base xml:lang xml:space y"),
            feImage: o("class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            feMerge: o("class height id result style width x xml:base xml:lang xml:space y"),
            feMergeNode: o("id xml:base xml:lang xml:space"),
            feMorphology: o("class height id in operator radius result style width x xml:base xml:lang xml:space y"),
            feOffset: o("class dx dy height id in result style width x xml:base xml:lang xml:space y"),
            fePointLight: o("id x xml:base xml:lang xml:space y z"),
            feSpecularLighting: o("class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y"),
            feSpotLight: o("id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z"),
            feTile: o("class height id in result style width x xml:base xml:lang xml:space y"),
            feTurbulence: o("baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y"),
            filter: o("class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            font: o("class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            "font-face": o("accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space"),
            "font-face-format": o("id string xml:base xml:lang xml:space"),
            "font-face-name": o("id name xml:base xml:lang xml:space"),
            "font-face-src": o("id xml:base xml:lang xml:space"),
            "font-face-uri": o("id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            foreignObject: o("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y"),
            g: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            glyph: o("arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            glyphRef: o("class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            glyphref: createLookup(),
            hkern: o("g1 g2 id k u1 u2 xml:base xml:lang xml:space"),
            image: o("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            line: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2"),
            linearGradient: o("class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2"),
            marker: o("class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space"),
            mask: o("class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y"),
            metadata: o("id xml:base xml:lang xml:space"),
            "missing-glyph": o("class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space"),
            mpath: o("externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            path: o("class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            pattern: o("class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            polygon: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            polyline: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            radialGradient: o("class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            rect: o("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y"),
            script: o("externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            set: o("attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space"),
            stop: o("class id offset style xml:base xml:lang xml:space"),
            style: o("id media title type xml:base xml:lang xml:space"),
            svg: o("baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan"),
            switch: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space"),
            symbol: o("class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space"),
            text: o("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y"),
            textPath: o("class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space"),
            title: o("class id style xml:base xml:lang xml:space"),
            tref: o("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y"),
            tspan: o("class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y"),
            use: o("class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y"),
            view: o("externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan"),
            vkern: o("g1 g2 id k u1 u2 xml:base xml:lang xml:space")
        });
        this.$e = o("a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use");
        this.Ne = o("alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode");
        const e = t.resolve(rt);
        this.SVGElement = e.globalThis.SVGElement;
        const s = e.document.createElement("div");
        s.innerHTML = "<svg><altGlyph /></svg>";
        if (s.firstElementChild.nodeName === "altglyph") {
            const t = this.Oe;
            let e = t.altGlyph;
            t.altGlyph = t.altglyph;
            t.altglyph = e;
            e = t.altGlyphDef;
            t.altGlyphDef = t.altglyphdef;
            t.altglyphdef = e;
            e = t.altGlyphItem;
            t.altGlyphItem = t.altglyphitem;
            t.altglyphitem = e;
            e = t.glyphRef;
            t.glyphRef = t.glyphref;
            t.glyphref = e;
        }
    }
    isStandardSvgAttribute(t, e) {
        if (!(t instanceof this.SVGElement)) {
            return false;
        }
        return this.$e[t.nodeName] === true && this.Ne[e] === true || this.Oe[t.nodeName]?.[e] === true;
    }
}

const As = /*@__PURE__*/ N("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor() {
        this.fns = [];
        this.We = createLookup();
        this.je = createLookup();
        this.svg = t.resolve(Cs);
        this.useMapping({
            LABEL: {
                for: "htmlFor"
            },
            IMG: {
                usemap: "useMap"
            },
            INPUT: {
                maxlength: "maxLength",
                minlength: "minLength",
                formaction: "formAction",
                formenctype: "formEncType",
                formmethod: "formMethod",
                formnovalidate: "formNoValidate",
                formtarget: "formTarget",
                inputmode: "inputMode"
            },
            TEXTAREA: {
                maxlength: "maxLength"
            },
            TD: {
                rowspan: "rowSpan",
                colspan: "colSpan"
            },
            TH: {
                rowspan: "rowSpan",
                colspan: "colSpan"
            }
        });
        this.useGlobalMapping({
            accesskey: "accessKey",
            contenteditable: "contentEditable",
            tabindex: "tabIndex",
            textcontent: "textContent",
            innerhtml: "innerHTML",
            scrolltop: "scrollTop",
            scrollleft: "scrollLeft",
            readonly: "readOnly"
        });
    }
    useMapping(t) {
        let e;
        let s;
        let i;
        let n;
        for (i in t) {
            e = t[i];
            s = this.We[i] ??= createLookup();
            for (n in e) {
                if (s[n] !== void 0) {
                    throw createError(n, i);
                }
                s[n] = e[n];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.je;
        for (const s in t) {
            if (e[s] !== void 0) {
                throw createError(s, "*");
            }
            e[s] = t[s];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return shouldDefaultToTwoWay(t, e) || this.fns.length > 0 && this.fns.some((s => s(t, e)));
    }
    map(t, e) {
        return this.We[t.nodeName]?.[e] ?? this.je[e] ?? (isDataAttribute(t, e, this.svg) ? e : null);
    }
}

function shouldDefaultToTwoWay(t, e) {
    switch (t.nodeName) {
      case "INPUT":
        switch (t.type) {
          case "checkbox":
          case "radio":
            return e === "checked";

          default:
            return e === "value" || e === "files" || e === "value-as-number" || e === "value-as-date";
        }

      case "TEXTAREA":
      case "SELECT":
        return e === "value";

      default:
        switch (e) {
          case "textcontent":
          case "innerhtml":
            return t.hasAttribute("contenteditable");

          case "scrolltop":
          case "scrollleft":
            return true;

          default:
            return false;
        }
    }
}

function createError(t, e) {
    return createMappedError(719, t, e);
}

const Bs = createLookup();

class AttributeNSAccessor {
    static forNs(t) {
        return Bs[t] ??= new AttributeNSAccessor(t);
    }
    constructor(t) {
        this.ns = t;
        this.type = A | B;
    }
    getValue(t, e) {
        return t.getAttributeNS(this.ns, e);
    }
    setValue(t, e, s) {
        if (t == null) {
            e.removeAttributeNS(this.ns, s);
        } else {
            e.setAttributeNS(this.ns, s, t);
        }
    }
}

mixinNoopSubscribable(AttributeNSAccessor);

class DataAttributeAccessor {
    constructor() {
        this.type = A | B;
    }
    getValue(t, e) {
        return t.getAttribute(e);
    }
    setValue(t, e, s) {
        if (t == null) {
            e.removeAttribute(s);
        } else {
            e.setAttribute(s, t);
        }
    }
}

mixinNoopSubscribable(DataAttributeAccessor);

const Ss = new DataAttributeAccessor;

const Ts = {
    childList: true,
    subtree: true,
    characterData: true
};

function defaultMatcher$1(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, s, i) {
        this.type = A | C | B;
        this.v = void 0;
        this.ov = void 0;
        this.ze = false;
        this.Ue = void 0;
        this.Ge = void 0;
        this.iO = false;
        this.ft = false;
        this.ut = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.iO ? this.v : this.ut.multiple ? getSelectedOptions(this.ut.options) : this.ut.value;
    }
    setValue(t) {
        this.ov = this.v;
        this.v = t;
        this.ze = t !== this.ov;
        this.Ke(t instanceof Array ? t : null);
        this.wt();
    }
    wt() {
        if (this.ze) {
            this.ze = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const t = this.v;
        const e = this.ut;
        const s = isArray(t);
        const i = e.matcher ?? defaultMatcher$1;
        const n = e.options;
        let r = n.length;
        while (r-- > 0) {
            const e = n[r];
            const l = h.call(e, "model") ? e.model : e.value;
            if (s) {
                e.selected = t.findIndex((t => !!i(l, t))) !== -1;
                continue;
            }
            e.selected = !!i(l, t);
        }
    }
    syncValue() {
        const t = this.ut;
        const e = t.options;
        const s = e.length;
        const i = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(i instanceof Array)) {
                return true;
            }
            let r;
            const l = t.matcher || defaultMatcher$1;
            const a = [];
            while (n < s) {
                r = e[n];
                if (r.selected) {
                    a.push(h.call(r, "model") ? r.model : r.value);
                }
                ++n;
            }
            let c;
            n = 0;
            while (n < i.length) {
                c = i[n];
                if (a.findIndex((t => !!l(c, t))) === -1) {
                    i.splice(n, 1);
                } else {
                    ++n;
                }
            }
            n = 0;
            while (n < a.length) {
                c = a[n];
                if (i.findIndex((t => !!l(c, t))) === -1) {
                    i.push(c);
                }
                ++n;
            }
            return false;
        }
        let r = null;
        let l;
        while (n < s) {
            l = e[n];
            if (l.selected) {
                r = h.call(l, "model") ? l.model : l.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    dt() {
        (this.Ge = createMutationObserver(this.ut, this.Xe.bind(this))).observe(this.ut, Ts);
        this.Ke(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    gt() {
        this.Ge.disconnect();
        this.Ue?.unsubscribe(this);
        this.Ge = this.Ue = void 0;
        this.iO = false;
    }
    Ke(t) {
        this.Ue?.unsubscribe(this);
        this.Ue = void 0;
        if (t != null) {
            if (!this.ut.multiple) {
                throw createError$1(`AUR0654`);
            }
            (this.Ue = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) {
            this.Qe();
        }
    }
    Xe(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) {
            this.Qe();
        }
    }
    Qe() {
        Rs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Rs);
    }
}

mixinNodeObserverUseConfig(SelectValueObserver);

s.subscriberCollection(SelectValueObserver);

function getSelectedOptions(t) {
    const e = [];
    if (t.length === 0) {
        return e;
    }
    const s = t.length;
    let i = 0;
    let n;
    while (s > i) {
        n = t[i];
        if (n.selected) {
            e[e.length] = h.call(n, "model") ? n.model : n.value;
        }
        ++i;
    }
    return e;
}

let Rs = void 0;

const Is = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = A | B;
        this.v = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.ze = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t) {
        this.v = t;
        this.ze = t !== this.ov;
        this.wt();
    }
    Ye(t) {
        const e = [];
        const s = /url\([^)]+$/;
        let i = 0;
        let n = "";
        let r;
        let l;
        let a;
        let h;
        while (i < t.length) {
            r = t.indexOf(";", i);
            if (r === -1) {
                r = t.length;
            }
            n += t.substring(i, r);
            i = r + 1;
            if (s.test(n)) {
                n += ";";
                continue;
            }
            l = n.indexOf(":");
            a = n.substring(0, l).trim();
            h = n.substring(l + 1).trim();
            e.push([ a, h ]);
            n = "";
        }
        return e;
    }
    Ze(e) {
        let s;
        let i;
        const n = [];
        for (i in e) {
            s = e[i];
            if (s == null) {
                continue;
            }
            if (isString(s)) {
                if (i.startsWith(Is)) {
                    n.push([ i, s ]);
                    continue;
                }
                n.push([ t.kebabCase(i), s ]);
                continue;
            }
            n.push(...this.Je(s));
        }
        return n;
    }
    ts(e) {
        const s = e.length;
        if (s > 0) {
            const t = [];
            let i = 0;
            for (;s > i; ++i) {
                t.push(...this.Je(e[i]));
            }
            return t;
        }
        return t.emptyArray;
    }
    Je(e) {
        if (isString(e)) {
            return this.Ye(e);
        }
        if (e instanceof Array) {
            return this.ts(e);
        }
        if (e instanceof Object) {
            return this.Ze(e);
        }
        return t.emptyArray;
    }
    wt() {
        if (this.ze) {
            this.ze = false;
            const t = this.v;
            const e = this.styles;
            const s = this.Je(t);
            let i;
            let n = this.version;
            this.ov = t;
            let r;
            let l;
            let a;
            let c = 0;
            const u = s.length;
            for (;c < u; ++c) {
                r = s[c];
                l = r[0];
                a = r[1];
                this.setProperty(l, a);
                e[l] = n;
            }
            this.styles = e;
            this.version += 1;
            if (n === 0) {
                return;
            }
            n -= 1;
            for (i in e) {
                if (!h.call(e, i) || e[i] !== n) {
                    continue;
                }
                this.obj.style.removeProperty(i);
            }
        }
    }
    setProperty(t, e) {
        let s = "";
        if (e != null && isFunction(e.indexOf) && e.includes("!important")) {
            s = "important";
            e = e.replace("!important", "");
        }
        this.obj.style.setProperty(t, e, s);
    }
    bind() {
        this.v = this.ov = this.obj.style.cssText;
    }
}

mixinNoopSubscribable(StyleAttributeAccessor);

class ValueAttributeObserver {
    constructor(t, e, s) {
        this.type = A | C | B;
        this.v = "";
        this.ov = "";
        this.ze = false;
        this.ft = false;
        this.ut = t;
        this.k = e;
        this.cf = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        if (m(t, this.v)) {
            return;
        }
        this.ov = this.v;
        this.v = t;
        this.ze = true;
        if (!this.cf.readonly) {
            this.wt();
        }
    }
    wt() {
        if (this.ze) {
            this.ze = false;
            this.ut[this.k] = this.v ?? this.cf.default;
            this.Qe();
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.ut[this.k];
        if (this.ov !== this.v) {
            this.ze = false;
            this.Qe();
        }
    }
    dt() {
        this.v = this.ov = this.ut[this.k];
    }
    Qe() {
        Es = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Es);
    }
}

mixinNodeObserverUseConfig(ValueAttributeObserver);

s.subscriberCollection(ValueAttributeObserver);

let Es = void 0;

const _s = "http://www.w3.org/1999/xlink";

const Ps = "http://www.w3.org/XML/1998/namespace";

const Ls = "http://www.w3.org/2000/xmlns/";

const Ms = u(createLookup(), {
    "xlink:actuate": [ "actuate", _s ],
    "xlink:arcrole": [ "arcrole", _s ],
    "xlink:href": [ "href", _s ],
    "xlink:role": [ "role", _s ],
    "xlink:show": [ "show", _s ],
    "xlink:title": [ "title", _s ],
    "xlink:type": [ "type", _s ],
    "xml:lang": [ "lang", Ps ],
    "xml:space": [ "space", Ps ],
    xmlns: [ "xmlns", Ls ],
    "xmlns:xlink": [ "xlink", Ls ]
});

const Ds = new s.PropertyAccessor;

Ds.type = A | B;

class NodeObserverLocator {
    static register(t) {
        t.register(W(this, this), j(this, s.INodeObserverLocator));
    }
    constructor() {
        this.allowDirtyCheck = true;
        this.es = createLookup();
        this.ss = createLookup();
        this.rs = createLookup();
        this.os = createLookup();
        this.ls = t.resolve(t.IServiceLocator);
        this.p = t.resolve(rt);
        this.cs = t.resolve(s.IDirtyChecker);
        this.svg = t.resolve(Cs);
        const e = [ "change", "input" ];
        const i = {
            events: e,
            default: ""
        };
        this.useConfig({
            INPUT: {
                value: i,
                valueAsNumber: {
                    events: e,
                    default: 0
                },
                checked: {
                    type: CheckedObserver,
                    events: e
                },
                files: {
                    events: e,
                    readonly: true
                }
            },
            SELECT: {
                value: {
                    type: SelectValueObserver,
                    events: [ "change" ],
                    default: ""
                }
            },
            TEXTAREA: {
                value: i
            }
        });
        const n = {
            events: [ "change", "input", "blur", "keyup", "paste" ],
            default: ""
        };
        const r = {
            events: [ "scroll" ],
            default: 0
        };
        this.useConfigGlobal({
            scrollTop: r,
            scrollLeft: r,
            textContent: n,
            innerHTML: n
        });
        this.overrideAccessorGlobal("css", "style", "class");
        this.overrideAccessor({
            INPUT: [ "value", "checked", "model" ],
            SELECT: [ "value" ],
            TEXTAREA: [ "value" ]
        });
    }
    handles(t, e) {
        return t instanceof this.p.Node;
    }
    useConfig(t, e, s) {
        const i = this.es;
        let n;
        if (isString(t)) {
            n = i[t] ??= createLookup();
            if (n[e] == null) {
                n[e] = s;
            } else {
                throwMappingExisted(t, e);
            }
        } else {
            for (const s in t) {
                n = i[s] ??= createLookup();
                const r = t[s];
                for (e in r) {
                    if (n[e] == null) {
                        n[e] = r[e];
                    } else {
                        throwMappingExisted(s, e);
                    }
                }
            }
        }
    }
    useConfigGlobal(t, e) {
        const s = this.ss;
        if (typeof t === "object") {
            for (const e in t) {
                if (s[e] == null) {
                    s[e] = t[e];
                } else {
                    throwMappingExisted("*", e);
                }
            }
        } else {
            if (s[t] == null) {
                s[t] = e;
            } else {
                throwMappingExisted("*", t);
            }
        }
    }
    getAccessor(e, s, i) {
        if (s in this.os || s in (this.rs[e.tagName] ?? t.emptyObject)) {
            return this.getObserver(e, s, i);
        }
        switch (s) {
          case "src":
          case "href":
          case "role":
          case "minLength":
          case "maxLength":
          case "placeholder":
          case "size":
          case "pattern":
          case "title":
          case "popovertarget":
          case "popovertargetaction":
            return Ss;

          default:
            {
                const t = Ms[s];
                if (t !== undefined) {
                    return AttributeNSAccessor.forNs(t[1]);
                }
                if (isDataAttribute(e, s, this.svg)) {
                    return Ss;
                }
                return Ds;
            }
        }
    }
    overrideAccessor(t, e) {
        let s;
        if (isString(t)) {
            s = this.rs[t] ??= createLookup();
            s[e] = true;
        } else {
            for (const e in t) {
                for (const i of t[e]) {
                    s = this.rs[e] ??= createLookup();
                    s[i] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) {
            this.os[e] = true;
        }
    }
    getNodeObserverConfig(t, e) {
        return this.es[t.tagName]?.[e] ?? this.ss[e];
    }
    getNodeObserver(t, e, i) {
        const n = this.es[t.tagName]?.[e] ?? this.ss[e];
        let r;
        if (n != null) {
            r = new (n.type ?? ValueAttributeObserver)(t, e, n, i, this.ls);
            if (!r.doNotCache) {
                s.getObserverLookup(t)[e] = r;
            }
            return r;
        }
        return null;
    }
    getObserver(t, e, i) {
        switch (e) {
          case "class":
            return new ClassAttributeAccessor(t);

          case "css":
          case "style":
            return new StyleAttributeAccessor(t);
        }
        const n = this.getNodeObserver(t, e, i);
        if (n != null) {
            return n;
        }
        const r = Ms[e];
        if (r !== undefined) {
            return AttributeNSAccessor.forNs(r[1]);
        }
        if (isDataAttribute(t, e, this.svg)) {
            return Ss;
        }
        if (e in t.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.cs.createProperty(t, e);
            }
            throw createMappedError(652, e);
        } else {
            return new s.SetterObserver(t, e);
        }
    }
}

function getCollectionObserver(t, e) {
    if (t instanceof Array) {
        return e.getArrayObserver(t);
    }
    if (t instanceof Map) {
        return e.getMapObserver(t);
    }
    if (t instanceof Set) {
        return e.getSetObserver(t);
    }
}

function throwMappingExisted(t, e) {
    throw createMappedError(653, t, e);
}

function defaultMatcher(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, s, i) {
        this.type = A | C | B;
        this.v = void 0;
        this.ov = void 0;
        this.us = void 0;
        this.ds = void 0;
        this.ft = false;
        this.ut = t;
        this.oL = i;
        this.cf = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t) {
        const e = this.v;
        if (t === e) {
            return;
        }
        this.v = t;
        this.ov = e;
        this.ps();
        this.gs();
        this.Qe();
    }
    handleCollectionChange() {
        this.gs();
    }
    handleChange(t, e) {
        this.gs();
    }
    gs() {
        const t = this.v;
        const e = this.ut;
        const s = h.call(e, "model") ? e.model : e.value;
        const i = e.type === "radio";
        const n = e.matcher !== void 0 ? e.matcher : defaultMatcher;
        if (i) {
            e.checked = !!n(t, s);
        } else if (t === true) {
            e.checked = true;
        } else {
            let i = false;
            if (isArray(t)) {
                i = t.findIndex((t => !!n(t, s))) !== -1;
            } else if (t instanceof Set) {
                for (const e of t) {
                    if (n(e, s)) {
                        i = true;
                        break;
                    }
                }
            } else if (t instanceof Map) {
                for (const e of t) {
                    const t = e[0];
                    const r = e[1];
                    if (n(t, s) && r === true) {
                        i = true;
                        break;
                    }
                }
            }
            e.checked = i;
        }
    }
    handleEvent() {
        let t = this.ov = this.v;
        const e = this.ut;
        const s = h.call(e, "model") ? e.model : e.value;
        const i = e.checked;
        const n = e.matcher !== void 0 ? e.matcher : defaultMatcher;
        if (e.type === "checkbox") {
            if (isArray(t)) {
                const e = t.findIndex((t => !!n(t, s)));
                if (i && e === -1) {
                    t.push(s);
                } else if (!i && e !== -1) {
                    t.splice(e, 1);
                }
                return;
            } else if (t instanceof Set) {
                const e = {};
                let r = e;
                for (const e of t) {
                    if (n(e, s) === true) {
                        r = e;
                        break;
                    }
                }
                if (i && r === e) {
                    t.add(s);
                } else if (!i && r !== e) {
                    t.delete(r);
                }
                return;
            } else if (t instanceof Map) {
                let e;
                for (const i of t) {
                    const t = i[0];
                    if (n(t, s) === true) {
                        e = t;
                        break;
                    }
                }
                t.set(e, i);
                return;
            }
            t = i;
        } else if (i) {
            t = s;
        } else {
            return;
        }
        this.v = t;
        this.Qe();
    }
    dt() {
        this.ps();
    }
    gt() {
        this.us?.unsubscribe(this);
        this.ds?.unsubscribe(this);
        this.us = this.ds = void 0;
    }
    Qe() {
        qs = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, qs);
    }
    ps() {
        const t = this.ut;
        (this.ds ??= t.$observers?.model ?? t.$observers?.value)?.subscribe(this);
        this.us?.unsubscribe(this);
        this.us = void 0;
        if (t.type === "checkbox") {
            (this.us = getCollectionObserver(this.v, this.oL))?.subscribe(this);
        }
    }
}

mixinNodeObserverUseConfig(CheckedObserver);

s.subscriberCollection(CheckedObserver);

let qs = void 0;

class AttrBindingBehavior {
    bind(t, e) {
        if (!(e instanceof PropertyBinding)) {
            throw createMappedError(9994, e);
        }
        e.useTargetObserver(Ss);
    }
}

AttrBindingBehavior.$au = {
    type: X,
    name: "attr"
};

class SelfBindingBehavior {
    bind(t, e) {
        if (!(e instanceof ListenerBinding)) {
            throw createMappedError(801);
        }
        e.self = true;
    }
    unbind(t, e) {
        e.self = false;
    }
}

SelfBindingBehavior.$au = {
    type: X,
    name: "self"
};

class UpdateTriggerBindingBehavior {
    constructor() {
        this.oL = t.resolve(s.IObserverLocator);
        this.xs = t.resolve(s.INodeObserverLocator);
    }
    bind(t, e, ...s) {
        if (!(this.xs instanceof NodeObserverLocator)) {
            throw createMappedError(9993);
        }
        if (s.length === 0) {
            throw createMappedError(802);
        }
        if (!(e instanceof PropertyBinding) || !(e.mode & R)) {
            throw createMappedError(803);
        }
        const i = this.xs.getNodeObserverConfig(e.target, e.targetProperty);
        if (i == null) {
            throw createMappedError(9992, e);
        }
        const n = this.xs.getNodeObserver(e.target, e.targetProperty, this.oL);
        n.useConfig({
            readonly: i.readonly,
            default: i.default,
            events: s
        });
        e.useTargetObserver(n);
    }
}

UpdateTriggerBindingBehavior.$au = {
    type: X,
    name: "updateTrigger"
};

class If {
    constructor() {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.vs = false;
        this.ws = 0;
        this.ys = t.resolve(Rt);
        this.l = t.resolve(Ye);
    }
    attaching(t, e) {
        return this.bs(this.value);
    }
    detaching(e, s) {
        this.vs = true;
        return t.onResolve(this.pending, (() => {
            this.vs = false;
            this.pending = void 0;
            void this.view?.deactivate(e, this.$controller);
        }));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        e = !!e;
        if (t !== e) return this.bs(t);
    }
    bs(e) {
        const s = this.view;
        const i = this.$controller;
        const n = this.ws++;
        const isCurrent = () => !this.vs && this.ws === n + 1;
        let r;
        return t.onResolve(this.pending, (() => this.pending = t.onResolve(s?.deactivate(s, i), (() => {
            if (!isCurrent()) {
                return;
            }
            if (e) {
                r = this.view = this.ifView = this.cache && this.ifView != null ? this.ifView : this.ys.create();
            } else {
                r = this.view = this.elseView = this.cache && this.elseView != null ? this.elseView : this.elseFactory?.create();
            }
            if (r == null) {
                return;
            }
            r.setLocation(this.l);
            return t.onResolve(r.activate(r, i, i.scope), (() => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            }));
        }))));
    }
    dispose() {
        this.ifView?.dispose();
        this.elseView?.dispose();
        this.ifView = this.elseView = this.view = void 0;
    }
    accept(t) {
        if (this.view?.accept(t) === true) {
            return true;
        }
    }
}

If.$au = {
    type: lt,
    name: "if",
    isTemplateController: true,
    bindables: {
        value: true,
        cache: {
            set: t => t === "" || !!t && t !== "false"
        }
    }
};

class Else {
    constructor() {
        this.f = t.resolve(Rt);
    }
    link(t, e, s, i) {
        const n = t.children;
        const r = n[n.length - 1];
        if (r instanceof If) {
            r.elseFactory = this.f;
        } else if (r.viewModel instanceof If) {
            r.viewModel.elseFactory = this.f;
        } else {
            throw createMappedError(810);
        }
    }
}

Else.$au = {
    type: "custom-attribute",
    name: "else",
    isTemplateController: true
};

function dispose(t) {
    t.dispose();
}

const Fs = [ "BindingBehavior", "ValueConverter" ];

class Repeat {
    constructor(t, e, s, i, n) {
        this.views = [];
        this.ks = [];
        this.key = null;
        this.Cs = new Map;
        this.As = new Map;
        this.Bs = void 0;
        this.Ss = false;
        this.Ts = false;
        this.Rs = null;
        this.Is = void 0;
        this.Es = false;
        const r = t.props[0].props[0];
        if (r !== void 0) {
            const {to: t, value: s, command: i} = r;
            if (t === "key") {
                if (i === null) {
                    this.key = s;
                } else if (i === "bind") {
                    this.key = e.parse(s, y);
                } else {
                    throw createMappedError(775, i);
                }
            } else {
                throw createMappedError(776, t);
            }
        }
        this.l = s;
        this._s = i;
        this.f = n;
    }
    binding(t, e) {
        const i = this._s.bindings;
        const n = i.length;
        let r = void 0;
        let l;
        let a = 0;
        for (;n > a; ++a) {
            r = i[a];
            if (r.target === this && r.targetProperty === "items") {
                l = this.forOf = r.ast;
                this.Ps = r;
                let t = l.iterable;
                while (t != null && Fs.includes(t.$kind)) {
                    t = t.expression;
                    this.Ss = true;
                }
                this.Rs = t;
                break;
            }
        }
        this.Ls();
        const h = l.declaration;
        if (!(this.Es = h.$kind === "ArrayDestructuring" || h.$kind === "ObjectDestructuring")) {
            this.local = s.astEvaluate(h, this.$controller.scope, r, null);
        }
    }
    attaching(t, e) {
        this.Ms();
        return this.Ds(t);
    }
    detaching(t, e) {
        this.Ls();
        return this.qs(t);
    }
    unbinding(t, e) {
        this.As.clear();
        this.Cs.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this.Ls();
        this.Ms();
        this.Fs(this.items, void 0);
    }
    handleCollectionChange(t, e) {
        const i = this.$controller;
        if (!i.isActive) {
            return;
        }
        if (this.Ss) {
            if (this.Ts) {
                return;
            }
            this.Ts = true;
            this.items = s.astEvaluate(this.forOf.iterable, i.scope, this.Ps, null);
            this.Ts = false;
            return;
        }
        this.Ms();
        this.Fs(t, e);
    }
    Fs(e, i) {
        const n = this.views;
        this.ks = n.slice();
        const r = n.length;
        const l = this.key;
        const a = l !== null;
        if (a || i === void 0) {
            const t = this.local;
            const e = this.Is;
            const h = e.length;
            const c = this.forOf;
            const u = c.declaration;
            const f = this.Ps;
            const d = this.Es;
            i = s.createIndexMap(h);
            let p = 0;
            if (r === 0) {
                for (;p < h; ++p) {
                    i[p] = -2;
                }
            } else if (h === 0) {
                if (d) {
                    for (p = 0; p < r; ++p) {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(s.astEvaluate(u, n[p].scope, f, null));
                    }
                } else {
                    for (p = 0; p < r; ++p) {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(n[p].scope.bindingContext[t]);
                    }
                }
            } else {
                const m = Array(r);
                if (d) {
                    for (p = 0; p < r; ++p) {
                        m[p] = s.astEvaluate(u, n[p].scope, f, null);
                    }
                } else {
                    for (p = 0; p < r; ++p) {
                        m[p] = n[p].scope.bindingContext[t];
                    }
                }
                let g;
                let x;
                let v;
                let w;
                let y = 0;
                const b = r - 1;
                const k = h - 1;
                const C = new Map;
                const A = new Map;
                const B = this.Cs;
                const S = this.As;
                const T = this.$controller.scope;
                p = 0;
                t: {
                    while (true) {
                        if (a) {
                            g = m[p];
                            x = e[p];
                            v = getKeyValue(B, l, g, getScope(S, g, c, T, f, t, d), f);
                            w = getKeyValue(B, l, x, getScope(S, x, c, T, f, t, d), f);
                        } else {
                            g = v = ensureUnique(m[p], p);
                            x = w = ensureUnique(e[p], p);
                        }
                        if (v !== w) {
                            B.set(g, v);
                            B.set(x, w);
                            break;
                        }
                        ++p;
                        if (p > b || p > k) {
                            break t;
                        }
                    }
                    if (b !== k) {
                        break t;
                    }
                    y = k;
                    while (true) {
                        if (a) {
                            g = m[y];
                            x = e[y];
                            v = getKeyValue(B, l, g, getScope(S, g, c, T, f, t, d), f);
                            w = getKeyValue(B, l, x, getScope(S, x, c, T, f, t, d), f);
                        } else {
                            g = v = ensureUnique(m[p], p);
                            x = w = ensureUnique(e[p], p);
                        }
                        if (v !== w) {
                            B.set(g, v);
                            B.set(x, w);
                            break;
                        }
                        --y;
                        if (p > y) {
                            break t;
                        }
                    }
                }
                const R = p;
                const I = p;
                for (p = I; p <= k; ++p) {
                    if (B.has(x = a ? e[p] : ensureUnique(e[p], p))) {
                        w = B.get(x);
                    } else {
                        w = a ? getKeyValue(B, l, x, getScope(S, x, c, T, f, t, d), f) : x;
                        B.set(x, w);
                    }
                    A.set(w, p);
                }
                for (p = R; p <= b; ++p) {
                    if (B.has(g = a ? m[p] : ensureUnique(m[p], p))) {
                        v = B.get(g);
                    } else {
                        v = a ? getKeyValue(B, l, g, n[p].scope, f) : g;
                    }
                    C.set(v, p);
                    if (A.has(v)) {
                        i[A.get(v)] = p;
                    } else {
                        i.deletedIndices.push(p);
                        i.deletedItems.push(g);
                    }
                }
                for (p = I; p <= k; ++p) {
                    if (!C.has(B.get(a ? e[p] : ensureUnique(e[p], p)))) {
                        i[p] = -2;
                    }
                }
                C.clear();
                A.clear();
            }
        }
        if (i === void 0) {
            const e = t.onResolve(this.qs(null), (() => this.Ds(null)));
            if (isPromise(e)) {
                e.catch(rethrow);
            }
        } else {
            if (i.deletedIndices.length > 0) {
                const e = t.onResolve(this.Hs(i), (() => this.Vs(r, i)));
                if (isPromise(e)) {
                    e.catch(rethrow);
                }
            } else {
                this.Vs(r, i);
            }
        }
    }
    Ls() {
        const t = this.$controller.scope;
        let e = this.Os;
        let i = this.Ss;
        let n;
        if (i) {
            e = this.Os = s.astEvaluate(this.Rs, t, this.Ps, null) ?? null;
            i = this.Ss = !m(this.items, e);
        }
        const r = this.Bs;
        if (this.$controller.isActive) {
            n = this.Bs = s.getCollectionObserver(i ? e : this.items);
            if (r !== n) {
                r?.unsubscribe(this);
                n?.subscribe(this);
            }
        } else {
            r?.unsubscribe(this);
            this.Bs = undefined;
        }
    }
    Ms() {
        const {items: t} = this;
        if (isArray(t)) {
            this.Is = t;
            return;
        }
        const e = [];
        iterate(t, ((t, s) => {
            e[s] = t;
        }));
        this.Is = e;
    }
    Ds(t) {
        let e = void 0;
        let s;
        let i;
        let n;
        const {$controller: r, f: l, local: a, l: h, items: c, As: u, Ps: f, forOf: d, Es: p} = this;
        const m = r.scope;
        const g = getCount(c);
        const x = this.views = Array(g);
        iterate(c, ((c, v) => {
            i = x[v] = l.create().setLocation(h);
            i.nodes.unlink();
            n = getScope(u, c, d, m, f, a, p);
            setContextualProperties(n.overrideContext, v, g);
            s = i.activate(t ?? i, r, n);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }));
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    qs(t) {
        let e = void 0;
        let s;
        let i;
        let n = 0;
        const {views: r, $controller: l} = this;
        const a = r.length;
        for (;a > n; ++n) {
            i = r[n];
            i.release();
            s = i.deactivate(t ?? i, l);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Hs(t) {
        let e = void 0;
        let s;
        let i;
        const {$controller: n, views: r} = this;
        const l = t.deletedIndices.slice().sort(compareNumber);
        const a = l.length;
        let h = 0;
        for (;a > h; ++h) {
            i = r[l[h]];
            i.release();
            s = i.deactivate(i, n);
            if (isPromise(s)) {
                (e ?? (e = [])).push(s);
            }
        }
        h = 0;
        for (;a > h; ++h) {
            r.splice(l[h] - h, 1);
        }
        if (e !== void 0) {
            return e.length === 1 ? e[0] : Promise.all(e);
        }
    }
    Vs(t, e) {
        let i = void 0;
        let n;
        let r;
        let l;
        let a = 0;
        const {$controller: h, f: c, local: u, Is: f, l: d, views: p, Es: m, Ps: g, As: x, ks: v, forOf: w} = this;
        const y = e.length;
        for (;y > a; ++a) {
            if (e[a] === -2) {
                r = c.create();
                p.splice(a, 0, r);
            }
        }
        if (p.length !== y) {
            throw createMappedError(814, [ p.length, y ]);
        }
        const b = h.scope;
        const k = e.length;
        let C = 0;
        a = 0;
        for (;a < e.length; ++a) {
            if ((C = e[a]) !== -2) {
                p[a] = v[C];
            }
        }
        const A = longestIncreasingSubsequence(e);
        const B = A.length;
        const S = w.declaration;
        let T;
        let R = B - 1;
        a = k - 1;
        for (;a >= 0; --a) {
            r = p[a];
            T = p[a + 1];
            r.nodes.link(T?.nodes ?? d);
            if (e[a] === -2) {
                l = getScope(x, f[a], w, b, g, u, m);
                setContextualProperties(l.overrideContext, a, k);
                r.setLocation(d);
                n = r.activate(r, h, l);
                if (isPromise(n)) {
                    (i ?? (i = [])).push(n);
                }
            } else if (R < 0 || B === 1 || a !== A[R]) {
                if (m) {
                    s.astAssign(S, r.scope, g, f[a]);
                } else {
                    r.scope.bindingContext[u] = f[a];
                }
                setContextualProperties(r.scope.overrideContext, a, k);
                r.nodes.insertBefore(r.location);
            } else {
                if (m) {
                    s.astAssign(S, r.scope, g, f[a]);
                } else {
                    r.scope.bindingContext[u] = f[a];
                }
                if (t !== k) {
                    setContextualProperties(r.scope.overrideContext, a, k);
                }
                --R;
            }
        }
        if (i !== void 0) {
            return i.length === 1 ? i[0] : Promise.all(i);
        }
    }
    dispose() {
        this.views.forEach(dispose);
        this.views = void 0;
    }
    accept(t) {
        const {views: e} = this;
        if (e !== void 0) {
            for (let s = 0, i = e.length; s < i; ++s) {
                if (e[s].accept(t) === true) {
                    return true;
                }
            }
        }
    }
}

Repeat.$au = {
    type: lt,
    name: "repeat",
    isTemplateController: true,
    bindables: [ "items" ]
};

Repeat.inject = [ ie, s.IExpressionParser, Ye, je, Rt ];

let Hs = 16;

let Vs = new Int32Array(Hs);

let Os = new Int32Array(Hs);

function longestIncreasingSubsequence(t) {
    const e = t.length;
    if (e > Hs) {
        Hs = e;
        Vs = new Int32Array(e);
        Os = new Int32Array(e);
    }
    let s = 0;
    let i = 0;
    let n = 0;
    let r = 0;
    let l = 0;
    let a = 0;
    let h = 0;
    let c = 0;
    for (;r < e; r++) {
        i = t[r];
        if (i !== -2) {
            l = Vs[s];
            n = t[l];
            if (n !== -2 && n < i) {
                Os[r] = l;
                Vs[++s] = r;
                continue;
            }
            a = 0;
            h = s;
            while (a < h) {
                c = a + h >> 1;
                n = t[Vs[c]];
                if (n !== -2 && n < i) {
                    a = c + 1;
                } else {
                    h = c;
                }
            }
            n = t[Vs[a]];
            if (i < n || n === -2) {
                if (a > 0) {
                    Os[r] = Vs[a - 1];
                }
                Vs[a] = r;
            }
        }
    }
    r = ++s;
    const u = new Int32Array(r);
    i = Vs[s - 1];
    while (s-- > 0) {
        u[s] = i;
        i = Os[i];
    }
    while (r-- > 0) Vs[r] = 0;
    return u;
}

const setContextualProperties = (t, e, s) => {
    const i = e === 0;
    const n = e === s - 1;
    const r = e % 2 === 0;
    t.$index = e;
    t.$first = i;
    t.$last = n;
    t.$middle = !i && !n;
    t.$even = r;
    t.$odd = !r;
    t.$length = s;
};

const $s = a.toString;

const getCount = t => {
    switch ($s.call(t)) {
      case "[object Array]":
        return t.length;

      case "[object Map]":
        return t.size;

      case "[object Set]":
        return t.size;

      case "[object Number]":
        return t;

      case "[object Null]":
        return 0;

      case "[object Undefined]":
        return 0;

      default:
        throw createMappedError(778, t);
    }
};

const iterate = (t, e) => {
    switch ($s.call(t)) {
      case "[object Array]":
        return $array(t, e);

      case "[object Map]":
        return $map(t, e);

      case "[object Set]":
        return $set(t, e);

      case "[object Number]":
        return $number(t, e);

      case "[object Null]":
        return;

      case "[object Undefined]":
        return;

      default:
        createMappedError(777, t);
    }
};

const $array = (t, e) => {
    const s = t.length;
    let i = 0;
    for (;i < s; ++i) {
        e(t[i], i, t);
    }
};

const $map = (t, e) => {
    let s = -0;
    let i;
    for (i of t.entries()) {
        e(i, s++, t);
    }
};

const $set = (t, e) => {
    let s = 0;
    let i;
    for (i of t.keys()) {
        e(i, s++, t);
    }
};

const $number = (t, e) => {
    let s = 0;
    for (;s < t; ++s) {
        e(s, s, t);
    }
};

const getKeyValue = (t, e, i, n, r) => {
    let l = t.get(i);
    if (l === void 0) {
        if (typeof e === "string") {
            l = i[e];
        } else {
            l = s.astEvaluate(e, n, r, null);
        }
        t.set(i, l);
    }
    return l;
};

const getScope = (t, e, i, n, r, l, a) => {
    let h = t.get(e);
    if (h === void 0) {
        if (a) {
            s.astAssign(i.declaration, h = s.Scope.fromParent(n, new s.BindingContext), r, e);
        } else {
            h = s.Scope.fromParent(n, new s.BindingContext(l, e));
        }
        t.set(e, h);
    }
    return h;
};

const ensureUnique = (t, e) => {
    const s = typeof t;
    switch (s) {
      case "object":
        if (t !== null) return t;

      case "string":
      case "number":
      case "bigint":
      case "undefined":
      case "boolean":
        return `${e}${s}${t}`;

      default:
        return t;
    }
};

const compareNumber = (t, e) => t - e;

class With {
    constructor() {
        this.view = t.resolve(Rt).create().setLocation(t.resolve(Ye));
    }
    valueChanged(t, e) {
        const i = this.$controller;
        const n = this.view.bindings;
        let r;
        let l = 0, a = 0;
        if (i.isActive && n != null) {
            r = s.Scope.fromParent(i.scope, t === void 0 ? {} : t);
            for (a = n.length; a > l; ++l) {
                n[l].bind(r);
            }
        }
    }
    attaching(t, e) {
        const {$controller: i, value: n} = this;
        const r = s.Scope.fromParent(i.scope, n === void 0 ? {} : n);
        return this.view.activate(t, i, r);
    }
    detaching(t, e) {
        return this.view.deactivate(t, this.$controller);
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (this.view?.accept(t) === true) {
            return true;
        }
    }
}

With.$au = {
    type: lt,
    name: "with",
    isTemplateController: true,
    bindables: [ "value" ]
};

var Ns, Ws;

class Switch {
    constructor() {
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
        this.f = t.resolve(Rt);
        this.l = t.resolve(Ye);
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e) {
        const s = this.view;
        const i = this.$controller;
        this.queue((() => s.activate(t, i, i.scope)));
        this.queue((() => this.swap(t, this.value)));
        return this.promise;
    }
    detaching(t, e) {
        this.queue((() => {
            const e = this.view;
            return e.deactivate(t, this.$controller);
        }));
        return this.promise;
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) {
            return;
        }
        this.queue((() => this.swap(null, this.value)));
    }
    caseChanged(t) {
        this.queue((() => this.$s(t)));
    }
    $s(e) {
        const s = e.isMatch(this.value);
        const i = this.activeCases;
        const n = i.length;
        if (!s) {
            if (n > 0 && i[0].id === e.id) {
                return this.Ns(null);
            }
            return;
        }
        if (n > 0 && i[0].id < e.id) {
            return;
        }
        const r = [];
        let l = e.fallThrough;
        if (!l) {
            r.push(e);
        } else {
            const t = this.cases;
            const s = t.indexOf(e);
            for (let e = s, i = t.length; e < i && l; e++) {
                const s = t[e];
                r.push(s);
                l = s.fallThrough;
            }
        }
        return t.onResolve(this.Ns(null, r), (() => {
            this.activeCases = r;
            return this.Ws(null);
        }));
    }
    swap(e, s) {
        const i = [];
        let n = false;
        for (const t of this.cases) {
            if (n || t.isMatch(s)) {
                i.push(t);
                n = t.fallThrough;
            }
            if (i.length > 0 && !n) {
                break;
            }
        }
        const r = this.defaultCase;
        if (i.length === 0 && r !== void 0) {
            i.push(r);
        }
        return t.onResolve(this.activeCases.length > 0 ? this.Ns(e, i) : void 0, (() => {
            this.activeCases = i;
            if (i.length === 0) {
                return;
            }
            return this.Ws(e);
        }));
    }
    Ws(e) {
        const s = this.$controller;
        if (!s.isActive) {
            return;
        }
        const i = this.activeCases;
        const n = i.length;
        if (n === 0) {
            return;
        }
        const r = s.scope;
        if (n === 1) {
            return i[0].activate(e, r);
        }
        return t.onResolveAll(...i.map((t => t.activate(e, r))));
    }
    Ns(e, s = []) {
        const i = this.activeCases;
        const n = i.length;
        if (n === 0) {
            return;
        }
        if (n === 1) {
            const t = i[0];
            if (!s.includes(t)) {
                i.length = 0;
                return t.deactivate(e);
            }
            return;
        }
        return t.onResolve(t.onResolveAll(...i.reduce(((t, i) => {
            if (!s.includes(i)) {
                t.push(i.deactivate(e));
            }
            return t;
        }), [])), (() => {
            i.length = 0;
        }));
    }
    queue(e) {
        const s = this.promise;
        let i = void 0;
        i = this.promise = t.onResolve(t.onResolve(s, e), (() => {
            if (this.promise === i) {
                this.promise = void 0;
            }
        }));
    }
    accept(t) {
        if (this.$controller.accept(t) === true) {
            return true;
        }
        if (this.activeCases.some((e => e.accept(t)))) {
            return true;
        }
    }
}

Switch.$au = {
    type: lt,
    name: "switch",
    isTemplateController: true,
    bindables: [ "value" ]
};

let js = 0;

class Case {
    constructor() {
        this.id = ++js;
        this.fallThrough = false;
        this.view = void 0;
        this.f = t.resolve(Rt);
        this.ls = t.resolve(s.IObserverLocator);
        this.l = t.resolve(Ye);
        this.js = t.resolve(t.ILogger).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, s, i) {
        const n = t.parent;
        const r = n?.viewModel;
        if (r instanceof Switch) {
            this.$switch = r;
            this.linkToSwitch(r);
        } else {
            throw createMappedError(815);
        }
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    isMatch(t) {
        this.js.debug("isMatch()");
        const e = this.value;
        if (isArray(e)) {
            if (this.Bs === void 0) {
                this.Bs = this.zs(e);
            }
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, e) {
        if (isArray(t)) {
            this.Bs?.unsubscribe(this);
            this.Bs = this.zs(t);
        } else if (this.Bs !== void 0) {
            this.Bs.unsubscribe(this);
        }
        this.$switch.caseChanged(this);
    }
    handleCollectionChange() {
        this.$switch.caseChanged(this);
    }
    activate(t, e) {
        let s = this.view;
        if (s === void 0) {
            s = this.view = this.f.create().setLocation(this.l);
        }
        if (s.isActive) {
            return;
        }
        return s.activate(t ?? s, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(t ?? e, this.$controller);
    }
    dispose() {
        this.Bs?.unsubscribe(this);
        this.view?.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    zs(t) {
        const e = this.ls.getArrayObserver(t);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        if (this.$controller.accept(t) === true) {
            return true;
        }
        return this.view?.accept(t);
    }
}

Case.$au = {
    type: "custom-attribute",
    name: "case",
    isTemplateController: true,
    bindables: [ "value", {
        name: "fallThrough",
        mode: S,
        set(t) {
            switch (t) {
              case "true":
                return true;

              case "false":
                return false;

              default:
                return !!t;
            }
        }
    } ]
};

class DefaultCase extends(Ws = Case){
    linkToSwitch(t) {
        if (t.defaultCase !== void 0) {
            throw createMappedError(816);
        }
        t.defaultCase = this;
    }
}

Ns = DefaultCase;

DefaultCase.$au = {
    ...Reflect.get(Ws, "$au", Ns),
    name: "default-case",
    bindables: [ "value" ]
};

class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.f = t.resolve(Rt);
        this.l = t.resolve(Ye);
        this.p = t.resolve(rt);
        this.logger = t.resolve(t.ILogger).scopeTo("promise.resolve");
    }
    link(t, e, s, i) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(e, i) {
        const n = this.view;
        const r = this.$controller;
        return t.onResolve(n.activate(e, r, this.viewScope = s.Scope.fromParent(r.scope, {})), (() => this.swap(e)));
    }
    valueChanged(t, e) {
        if (!this.$controller.isActive) {
            return;
        }
        this.swap(null);
    }
    swap(e) {
        const s = this.value;
        if (!isPromise(s)) {
            return;
        }
        const i = this.p.domWriteQueue;
        const r = this.fulfilled;
        const l = this.rejected;
        const a = this.pending;
        const h = this.viewScope;
        let c;
        const u = {
            reusable: false
        };
        const $swap = () => {
            void t.onResolveAll(c = (this.preSettledTask = i.queueTask((() => t.onResolveAll(r?.deactivate(e), l?.deactivate(e), a?.activate(e, h))), u)).result.catch((t => {
                if (!(t instanceof n.TaskAbortError)) throw t;
            })), s.then((n => {
                if (this.value !== s) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => t.onResolveAll(a?.deactivate(e), l?.deactivate(e), r?.activate(e, h, n))), u)).result;
                };
                if (this.preSettledTask.status === k) {
                    void c.then(fulfill);
                } else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }), (n => {
                if (this.value !== s) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = i.queueTask((() => t.onResolveAll(a?.deactivate(e), r?.deactivate(e), l?.activate(e, h, n))), u)).result;
                };
                if (this.preSettledTask.status === k) {
                    void c.then(reject);
                } else {
                    this.preSettledTask.cancel();
                    reject();
                }
            })));
        };
        if (this.postSettledTask?.status === k) {
            void this.postSettlePromise.then($swap);
        } else {
            this.postSettledTask?.cancel();
            $swap();
        }
    }
    detaching(t, e) {
        this.preSettledTask?.cancel();
        this.postSettledTask?.cancel();
        this.preSettledTask = this.postSettledTask = null;
        return this.view.deactivate(t, this.$controller);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
}

PromiseTemplateController.$au = {
    type: lt,
    name: "promise",
    isTemplateController: true,
    bindables: [ "value" ]
};

class PendingTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(Rt);
        this.l = t.resolve(Ye);
    }
    link(t, e, s, i) {
        getPromiseController(t).pending = this;
    }
    activate(t, e) {
        let s = this.view;
        if (s === void 0) {
            s = this.view = this.f.create().setLocation(this.l);
        }
        if (s.isActive) {
            return;
        }
        return s.activate(s, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(e, this.$controller);
    }
    detaching(t) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
}

PendingTemplateController.$au = {
    type: "custom-attribute",
    name: "pending",
    isTemplateController: true,
    bindables: {
        value: {
            mode: T
        }
    }
};

class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(Rt);
        this.l = t.resolve(Ye);
    }
    link(t, e, s, i) {
        getPromiseController(t).fulfilled = this;
    }
    activate(t, e, s) {
        this.value = s;
        let i = this.view;
        if (i === void 0) {
            i = this.view = this.f.create().setLocation(this.l);
        }
        if (i.isActive) {
            return;
        }
        return i.activate(i, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(e, this.$controller);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
}

FulfilledTemplateController.$au = {
    type: "custom-attribute",
    name: "then",
    isTemplateController: true,
    bindables: {
        value: {
            mode: R
        }
    }
};

class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        this.f = t.resolve(Rt);
        this.l = t.resolve(Ye);
    }
    link(t, e, s, i) {
        getPromiseController(t).rejected = this;
    }
    activate(t, e, s) {
        this.value = s;
        let i = this.view;
        if (i === void 0) {
            i = this.view = this.f.create().setLocation(this.l);
        }
        if (i.isActive) {
            return;
        }
        return i.activate(i, this.$controller, e);
    }
    deactivate(t) {
        const e = this.view;
        if (e === void 0 || !e.isActive) {
            return;
        }
        return e.deactivate(e, this.$controller);
    }
    detaching(t, e) {
        return this.deactivate(t);
    }
    dispose() {
        this.view?.dispose();
        this.view = void 0;
    }
}

RejectedTemplateController.$au = {
    type: "custom-attribute",
    name: "catch",
    isTemplateController: true,
    bindables: {
        value: {
            mode: R
        }
    }
};

function getPromiseController(t) {
    const e = t.parent;
    const s = e?.viewModel;
    if (s instanceof PromiseTemplateController) {
        return s;
    }
    throw createMappedError(813);
}

let zs = class PromiseAttributePattern {
    "promise.resolve"(t, e) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

zs = __decorate([ attributePattern({
    pattern: "promise.resolve",
    symbols: ""
}) ], zs);

let Us = class FulfilledAttributePattern {
    then(t, e) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Us = __decorate([ attributePattern({
    pattern: "then",
    symbols: ""
}) ], Us);

let Gs = class RejectedAttributePattern {
    catch(t, e) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

Gs = __decorate([ attributePattern({
    pattern: "catch",
    symbols: ""
}) ], Gs);

class Focus {
    constructor() {
        this.Us = false;
        this.Gs = t.resolve(Xe);
        this.p = t.resolve(rt);
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this.Ks();
        } else {
            this.Us = true;
        }
    }
    attached() {
        if (this.Us) {
            this.Us = false;
            this.Ks();
        }
        this.Gs.addEventListener("focus", this);
        this.Gs.addEventListener("blur", this);
    }
    detaching() {
        const t = this.Gs;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if (t.type === "focus") {
            this.value = true;
        } else if (!this.Xs) {
            this.value = false;
        }
    }
    Ks() {
        const t = this.Gs;
        const e = this.Xs;
        const s = this.value;
        if (s && !e) {
            t.focus();
        } else if (!s && e) {
            t.blur();
        }
    }
    get Xs() {
        return this.Gs === this.p.document.activeElement;
    }
}

Focus.$au = {
    type: lt,
    name: "focus",
    bindables: {
        value: {
            mode: I
        }
    }
};

class Portal {
    constructor() {
        this.position = "beforeend";
        this.strict = false;
        const e = t.resolve(Rt);
        const s = t.resolve(Ye);
        const i = t.resolve(rt);
        this.p = i;
        this.Qs = i.document.createElement("div");
        (this.view = e.create()).setLocation(this.Ys = createLocation(i));
        setEffectiveParentNode(this.view.nodes, s);
    }
    attaching(t) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const e = this.Qs = this.Zs();
        this.Js(e, this.position);
        return this.ti(t, e);
    }
    detaching(t) {
        return this.ei(t, this.Qs);
    }
    targetChanged() {
        const {$controller: e} = this;
        if (!e.isActive) {
            return;
        }
        const s = this.Zs();
        if (this.Qs === s) {
            return;
        }
        this.Qs = s;
        const i = t.onResolve(this.ei(null, s), (() => {
            this.Js(s, this.position);
            return this.ti(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    positionChanged() {
        const {$controller: e, Qs: s} = this;
        if (!e.isActive) {
            return;
        }
        const i = t.onResolve(this.ei(null, s), (() => {
            this.Js(s, this.position);
            return this.ti(null, s);
        }));
        if (isPromise(i)) {
            i.catch(rethrow);
        }
    }
    ti(e, s) {
        const {activating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.si(e, s)));
    }
    si(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.insertBefore(this.Ys);
        } else {
            return t.onResolve(n.activate(e ?? n, i, i.scope), (() => this.ii(s)));
        }
        return this.ii(s);
    }
    ii(t) {
        const {activated: e, callbackContext: s, view: i} = this;
        return e?.call(s, t, i);
    }
    ei(e, s) {
        const {deactivating: i, callbackContext: n, view: r} = this;
        return t.onResolve(i?.call(n, s, r), (() => this.ni(e, s)));
    }
    ni(e, s) {
        const {$controller: i, view: n} = this;
        if (e === null) {
            n.nodes.remove();
        } else {
            return t.onResolve(n.deactivate(e, i), (() => this.ri(s)));
        }
        return this.ri(s);
    }
    ri(e) {
        const {deactivated: s, callbackContext: i, view: n} = this;
        return t.onResolve(s?.call(i, e, n), (() => this.oi()));
    }
    Zs() {
        const t = this.p;
        const e = t.document;
        let s = this.target;
        let i = this.renderContext;
        if (s === "") {
            if (this.strict) {
                throw createMappedError(811);
            }
            return e.body;
        }
        if (isString(s)) {
            let n = e;
            if (isString(i)) {
                i = e.querySelector(i);
            }
            if (i instanceof t.Node) {
                n = i;
            }
            s = n.querySelector(s);
        }
        if (s instanceof t.Node) {
            return s;
        }
        if (s == null) {
            if (this.strict) {
                throw createMappedError(812);
            }
            return e.body;
        }
        return s;
    }
    oi() {
        this.Ys.remove();
        this.Ys.$start.remove();
    }
    Js(t, e) {
        const s = this.Ys;
        const i = s.$start;
        const n = t.parentNode;
        const r = [ i, s ];
        switch (e) {
          case "beforeend":
            insertManyBefore(t, null, r);
            break;

          case "afterbegin":
            insertManyBefore(t, t.firstChild, r);
            break;

          case "beforebegin":
            insertManyBefore(n, t, r);
            break;

          case "afterend":
            insertManyBefore(n, t.nextSibling, r);
            break;

          default:
            throw new Error("Invalid portal insertion position");
        }
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
        this.callbackContext = null;
    }
    accept(t) {
        if (this.view?.accept(t) === true) {
            return true;
        }
    }
}

Portal.$au = {
    type: lt,
    name: "portal",
    isTemplateController: true,
    bindables: [ {
        name: "target",
        primary: true
    }, "position", "activated", "activating", "callbackContext", {
        name: "renderContext",
        callback: "targetChanged"
    }, "strict", "deactivated", "deactivating" ]
};

let Ks;

class AuSlot {
    constructor() {
        this.li = null;
        this.ai = null;
        this.Xt = false;
        this.expose = null;
        this.slotchange = null;
        this.hi = new Set;
        this.Bs = null;
        const e = t.resolve(ze);
        const s = t.resolve(Ye);
        const i = t.resolve(ie);
        const n = t.resolve(pe);
        const r = this.name = i.data.name;
        const l = i.projections?.[_t];
        const a = e.instruction?.projections?.[r];
        const h = e.controller.container;
        let c;
        let u;
        if (a == null) {
            u = h.createChild({
                inheritParentResources: true
            });
            c = n.getViewFactory(l ?? (Ks ??= CustomElementDefinition.create({
                name: "au-slot-empty-template",
                template: "",
                needsCompile: false
            })), u);
            this.ui = false;
        } else {
            u = h.createChild();
            u.useResources(e.parent.controller.container);
            registerResolver(u, ze, new t.InstanceProvider(void 0, e.parent));
            c = n.getViewFactory(a, u);
            this.ui = true;
            this.fi = h.getAll(Mt, false)?.filter((t => t.slotName === "*" || t.slotName === r)) ?? t.emptyArray;
        }
        this.di = (this.fi ??= t.emptyArray).length > 0;
        this.pi = e;
        this.view = c.create().setLocation(this.l = s);
    }
    get nodes() {
        const t = [];
        const e = this.l;
        let s = e.$start.nextSibling;
        while (s != null && s !== e) {
            if (s.nodeType !== 8) {
                t.push(s);
            }
            s = s.nextSibling;
        }
        return t;
    }
    subscribe(t) {
        this.hi.add(t);
    }
    unsubscribe(t) {
        this.hi.delete(t);
    }
    binding(t, e) {
        this.li = this.$controller.scope.parent;
        let i;
        if (this.ui) {
            i = this.pi.controller.scope.parent;
            (this.ai = s.Scope.fromParent(i, i.bindingContext)).overrideContext.$host = this.expose ?? this.li.bindingContext;
        }
    }
    attaching(e, s) {
        return t.onResolve(this.view.activate(e, this.$controller, this.ui ? this.ai : this.li), (() => {
            if (this.di) {
                this.fi.forEach((t => t.watch(this)));
                this.ps();
                this.mi();
                this.Xt = true;
            }
        }));
    }
    detaching(t, e) {
        this.Xt = false;
        this.gi();
        this.fi.forEach((t => t.unwatch(this)));
        return this.view.deactivate(t, this.$controller);
    }
    exposeChanged(t) {
        if (this.ui && this.ai != null) {
            this.ai.overrideContext.$host = t;
        }
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        if (this.view?.accept(t) === true) {
            return true;
        }
    }
    ps() {
        if (this.Bs != null) {
            return;
        }
        const t = this.l;
        const e = t.parentElement;
        if (e == null) {
            return;
        }
        (this.Bs = createMutationObserver(e, (e => {
            if (isMutationWithinLocation(t, e)) {
                this.mi();
            }
        }))).observe(e, {
            childList: true
        });
    }
    gi() {
        this.Bs?.disconnect();
        this.Bs = null;
    }
    mi() {
        const t = this.nodes;
        const e = new Set(this.hi);
        let s;
        if (this.Xt) {
            this.slotchange?.call(void 0, this.name, t);
        }
        for (s of e) {
            s.handleSlotChange(this, t);
        }
    }
}

AuSlot.$au = {
    type: rs,
    name: "au-slot",
    template: null,
    containerless: true,
    processContent(t, e, s) {
        s.name = t.getAttribute("name") ?? _t;
        let i = t.firstChild;
        let n = null;
        while (i !== null) {
            n = i.nextSibling;
            if (isElement(i) && i.hasAttribute(Pt)) {
                t.removeChild(i);
            }
            i = n;
        }
    },
    bindables: [ "expose", "slotchange" ]
};

const comparePosition = (t, e) => t.compareDocumentPosition(e);

const isMutationWithinLocation = (t, e) => {
    for (const {addedNodes: s, removedNodes: i, nextSibling: n} of e) {
        let e = 0;
        let r = s.length;
        let l;
        for (;e < r; ++e) {
            l = s[e];
            if (comparePosition(t.$start, l) === 4 && comparePosition(t, l) === 2) {
                return true;
            }
        }
        if (i.length > 0) {
            if (n != null && comparePosition(t.$start, n) === 4 && comparePosition(t, n) === 2) {
                return true;
            }
        }
    }
};

class AuCompose {
    constructor() {
        this.scopeBehavior = "auto";
        this.xi = void 0;
        this.tag = null;
        this.c = t.resolve(t.IContainer);
        this.parent = t.resolve(je);
        this.vi = t.resolve(Xe);
        this.l = t.resolve(Ye);
        this.p = t.resolve(rt);
        this.r = t.resolve(pe);
        this.wi = t.resolve(ie);
        this.yi = t.resolve(t.transient(CompositionContextFactory));
        this.st = t.resolve(ne);
        this.J = t.resolve(ze);
        this.ep = t.resolve(s.IExpressionParser);
        this.oL = t.resolve(s.IObserverLocator);
    }
    get composing() {
        return this.bi;
    }
    get composition() {
        return this.xi;
    }
    attaching(e, s) {
        return this.bi = t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), e), (t => {
            if (this.yi.ki(t)) {
                this.bi = void 0;
            }
        }));
    }
    detaching(e) {
        const s = this.xi;
        const i = this.bi;
        this.yi.invalidate();
        this.xi = this.bi = void 0;
        return t.onResolve(i, (() => s?.deactivate(e)));
    }
    propertyChanged(e) {
        if (e === "composing" || e === "composition") return;
        if (e === "model" && this.xi != null) {
            this.xi.update(this.model);
            return;
        }
        if (e === "tag" && this.xi?.controller.vmKind === Le) {
            return;
        }
        this.bi = t.onResolve(this.bi, (() => t.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, e), void 0), (t => {
            if (this.yi.ki(t)) {
                this.bi = void 0;
            }
        }))));
    }
    queue(e, s) {
        const i = this.yi;
        const n = this.xi;
        return t.onResolve(i.create(e), (e => {
            if (i.ki(e)) {
                return t.onResolve(this.compose(e), (r => {
                    if (i.ki(e)) {
                        return t.onResolve(r.activate(s), (() => {
                            if (i.ki(e)) {
                                this.xi = r;
                                return t.onResolve(n?.deactivate(s), (() => e));
                            } else {
                                return t.onResolve(r.controller.deactivate(r.controller, this.$controller), (() => {
                                    r.controller.dispose();
                                    return e;
                                }));
                            }
                        }));
                    }
                    r.controller.dispose();
                    return e;
                }));
            }
            return e;
        }));
    }
    compose(e) {
        const {Ci: i, Ai: n, Bi: r} = e.change;
        const {c: l, $controller: a, l: h, wi: c} = this;
        const u = this.Si(this.J.controller.container, n);
        const f = l.createChild();
        const d = this.p.document.createElement(u == null ? this.tag ?? "div" : u.name);
        h.parentNode.insertBefore(d, h);
        let p;
        if (u == null) {
            p = this.tag == null ? convertToRenderLocation(d) : null;
        } else {
            p = u.containerless ? convertToRenderLocation(d) : null;
        }
        const removeCompositionHost = () => {
            d.remove();
            if (p != null) {
                let t = p.$start.nextSibling;
                let e = null;
                while (t !== null && t !== p) {
                    e = t.nextSibling;
                    t.remove();
                    t = e;
                }
                p.$start?.remove();
                p.remove();
            }
        };
        const m = this.Ti(f, typeof n === "string" ? u.Type : n, d, p);
        const compose = () => {
            const n = c.captures ?? t.emptyArray;
            if (u !== null) {
                const s = u.capture;
                const [i, r] = n.reduce(((t, e) => {
                    const i = !(e.target in u.bindables) && (s === true || isFunction(s) && !!s(e.target));
                    t[i ? 0 : 1].push(e);
                    return t;
                }), [ [], [] ]);
                const l = Controller.$el(f, m, d, {
                    projections: c.projections,
                    captures: i
                }, u, p);
                this.Ri(d, u, r).forEach((t => l.addBinding(t)));
                return new CompositionController(l, (t => l.activate(t ?? l, a, a.scope.parent)), (e => t.onResolve(l.deactivate(e ?? l, a), removeCompositionHost)), (t => m.activate?.(t)), e);
            } else {
                const r = CustomElementDefinition.create({
                    name: hs.generateName(),
                    template: i
                });
                const l = this.r.getViewFactory(r, f);
                const h = Controller.$view(l, a);
                const c = this.scopeBehavior === "auto" ? s.Scope.fromParent(this.parent.scope, m) : s.Scope.create(m);
                h.setHost(d);
                if (p == null) {
                    this.Ri(d, r, n).forEach((t => h.addBinding(t)));
                } else {
                    h.setLocation(p);
                }
                return new CompositionController(h, (t => h.activate(t ?? h, a, c)), (e => t.onResolve(h.deactivate(e ?? h, a), removeCompositionHost)), (t => m.activate?.(t)), e);
            }
        };
        if ("activate" in m) {
            return t.onResolve(m.activate(r), (() => compose()));
        } else {
            return compose();
        }
    }
    Ti(e, s, i, n) {
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const r = this.p;
        registerHostNode(e, r, i);
        registerResolver(e, Ye, new t.InstanceProvider("IRenderLocation", n));
        const l = e.invoke(s);
        registerResolver(e, s, new t.InstanceProvider("au-compose.component", l));
        return l;
    }
    Si(t, e) {
        if (typeof e === "string") {
            const s = hs.find(t, e);
            if (s == null) {
                throw createMappedError(806, e);
            }
            return s;
        }
        const s = isFunction(e) ? e : e?.constructor;
        return hs.isType(s) ? hs.getDefinition(s) : null;
    }
    Ri(t, e, s) {
        const i = new HydrationContext(this.$controller, {
            projections: null,
            captures: s
        }, this.J.parent);
        return SpreadBinding.create(i, t, e, this.r, this.st, this.p, this.ep, this.oL);
    }
}

AuCompose.$au = {
    type: rs,
    name: "au-compose",
    capture: true,
    containerless: true,
    bindables: [ "template", "component", "model", {
        name: "scopeBehavior",
        set: t => {
            if (t === "scoped" || t === "auto") {
                return t;
            }
            throw createMappedError(805, t);
        }
    }, {
        name: "composing",
        mode: R
    }, {
        name: "composition",
        mode: R
    }, "tag" ]
};

class EmptyComponent {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    ki(t) {
        return t.id === this.id;
    }
    create(e) {
        return t.onResolve(e.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, s, i) {
        this.Ci = t;
        this.Ai = e;
        this.Bi = s;
        this.Ii = i;
    }
    load() {
        if (isPromise(this.Ci) || isPromise(this.Ai)) {
            return Promise.all([ this.Ci, this.Ai ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.Bi, this.Ii)));
        } else {
            return new LoadedChangeInfo(this.Ci, this.Ai, this.Bi, this.Ii);
        }
    }
}

class LoadedChangeInfo {
    constructor(t, e, s, i) {
        this.Ci = t;
        this.Ai = e;
        this.Bi = s;
        this.Ii = i;
    }
}

class CompositionContext {
    constructor(t, e) {
        this.id = t;
        this.change = e;
    }
}

class CompositionController {
    constructor(t, e, s, i, n) {
        this.controller = t;
        this.start = e;
        this.stop = s;
        this.update = i;
        this.context = n;
        this.state = 0;
    }
    activate(t) {
        if (this.state !== 0) {
            throw createMappedError(807, this);
        }
        this.state = 1;
        return this.start(t);
    }
    deactivate(t) {
        switch (this.state) {
          case 1:
            this.state = -1;
            return this.stop(t);

          case -1:
            throw createMappedError(808);

          default:
            this.state = -1;
        }
    }
}

const Xs = /*@__PURE__*/ N("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw createMappedError(99, "sanitize");
    }
})));

class SanitizeValueConverter {
    constructor() {
        this.Ei = t.resolve(Xs);
    }
    toView(t) {
        if (t == null) {
            return null;
        }
        return this.Ei.sanitize(t);
    }
}

SanitizeValueConverter.$au = {
    type: ft,
    name: "sanitize"
};

const Qs = /*@__PURE__*/ N("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Ys = {};

class TemplateElementFactory {
    constructor() {
        this.p = t.resolve(rt);
        this.Ci = this.t();
    }
    t() {
        return this.p.document.createElement("template");
    }
    createTemplate(t) {
        if (isString(t)) {
            let e = Ys[t];
            if (e === void 0) {
                const s = this.Ci;
                s.innerHTML = t;
                const i = s.content.firstElementChild;
                if (needsWrapping(i)) {
                    this.Ci = this.t();
                    e = s;
                } else {
                    s.content.removeChild(i);
                    e = i;
                }
                Ys[t] = e;
            }
            return e.cloneNode(true);
        }
        if (t.nodeName !== "TEMPLATE") {
            const e = this.t();
            e.content.appendChild(t);
            return e;
        }
        t.parentNode?.removeChild(t);
        return t.cloneNode(true);
        function needsWrapping(t) {
            if (t == null) return true;
            if (t.nodeName !== "TEMPLATE") return true;
            const e = t.nextElementSibling;
            if (e != null) return true;
            const s = t.previousSibling;
            if (s != null) {
                switch (s.nodeType) {
                  case 3:
                    return s.textContent.trim().length > 0;
                }
            }
            const i = t.nextSibling;
            if (i != null) {
                switch (i.nodeType) {
                  case 3:
                    return i.textContent.trim().length > 0;
                }
            }
            return false;
        }
    }
}

class TemplateCompiler {
    constructor() {
        this._i = t.resolve(oi);
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        t.register(W(this, this), j(this, ne));
    }
    compile(e, s, i) {
        if (e.template == null || e.needsCompile === false) {
            return e;
        }
        i ??= ei;
        const n = new CompilationContext(e, s, i, null, null, void 0);
        const r = isString(e.template) || !e.enhance ? n.Pi.createTemplate(e.template) : e.template;
        const l = r.nodeName === Zs && r.content != null;
        const a = l ? r.content : r;
        const h = ui.findAll(s);
        const c = h.length;
        let u = 0;
        if (c > 0) {
            while (c > u) {
                h[u].compiling?.(r);
                ++u;
            }
        }
        if (r.hasAttribute(hi)) {
            throw createMappedError(701, e);
        }
        this.Li(a, n);
        this.Mi(a, n);
        const f = CustomElementDefinition.create({
            ...e,
            name: e.name || ls(),
            dependencies: (e.dependencies ?? t.emptyArray).concat(n.deps ?? t.emptyArray),
            instructions: n.rows,
            surrogates: l ? this.Di(r, n) : t.emptyArray,
            template: r,
            hasSlots: n.hasSlot,
            needsCompile: false
        });
        if (n.deps != null) {
            const t = [ f.Type, ...f.dependencies, ...n.deps ];
            for (const e of n.deps) {
                getElementDefinition(e).dependencies.push(...t.filter((t => t !== e)));
            }
        }
        return f;
    }
    compileSpread(e, s, i, n, r) {
        const l = new CompilationContext(e, i, ei, null, null, void 0);
        const a = [];
        const h = r ?? l.qi(n.nodeName.toLowerCase());
        const c = h !== null;
        const u = l.ep;
        const f = s.length;
        let d = 0;
        let p;
        let m = null;
        let g;
        let v;
        let w;
        let y;
        let b;
        let k = null;
        let C;
        let A;
        let B;
        let S;
        for (;f > d; ++d) {
            p = s[d];
            B = p.target;
            S = p.rawValue;
            k = l.Fi(p);
            if (k !== null && k.ignoreAttr) {
                ii.node = n;
                ii.attr = p;
                ii.bindable = null;
                ii.def = null;
                a.push(k.build(ii, l.ep, l.m));
                continue;
            }
            m = l.Hi(B);
            if (m !== null) {
                if (m.isTemplateController) {
                    throw createMappedError(9998, B);
                }
                w = this._i.get(m);
                A = m.noMultiBindings === false && k === null && hasInlineBindings(S);
                if (A) {
                    v = this.Vi(n, S, m, l);
                } else {
                    b = w.primary;
                    if (k === null) {
                        C = u.parse(S, x);
                        v = [ C === null ? new SetPropertyInstruction(S, b.name) : new InterpolationInstruction(C, b.name) ];
                    } else {
                        ii.node = n;
                        ii.attr = p;
                        ii.bindable = b;
                        ii.def = m;
                        v = [ k.build(ii, l.ep, l.m) ];
                    }
                }
                (g ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? m : m.name, m.aliases != null && m.aliases.includes(B) ? B : void 0, v));
                continue;
            }
            if (k === null) {
                C = u.parse(S, x);
                if (c) {
                    w = this._i.get(h);
                    y = w.attrs[B];
                    if (y !== void 0) {
                        C = u.parse(S, x);
                        a.push(new SpreadElementPropBindingInstruction(C == null ? new SetPropertyInstruction(S, y.name) : new InterpolationInstruction(C, y.name)));
                        continue;
                    }
                }
                if (C != null) {
                    a.push(new InterpolationInstruction(C, l.m.map(n, B) ?? t.camelCase(B)));
                } else {
                    switch (B) {
                      case "class":
                        a.push(new SetClassAttributeInstruction(S));
                        break;

                      case "style":
                        a.push(new SetStyleAttributeInstruction(S));
                        break;

                      default:
                        a.push(new SetAttributeInstruction(S, B));
                    }
                }
            } else {
                if (c) {
                    w = this._i.get(h);
                    y = w.attrs[B];
                    if (y !== void 0) {
                        ii.node = n;
                        ii.attr = p;
                        ii.bindable = y;
                        ii.def = h;
                        a.push(new SpreadElementPropBindingInstruction(k.build(ii, l.ep, l.m)));
                        continue;
                    }
                }
                ii.node = n;
                ii.attr = p;
                ii.bindable = null;
                ii.def = null;
                a.push(k.build(ii, l.ep, l.m));
            }
        }
        resetCommandBuildInfo();
        if (g != null) {
            return g.concat(a);
        }
        return a;
    }
    Di(e, s) {
        const i = [];
        const n = e.attributes;
        const r = s.ep;
        let l = n.length;
        let a = 0;
        let h;
        let c;
        let u;
        let f;
        let d = null;
        let p;
        let m;
        let g;
        let v;
        let w = null;
        let y;
        let b;
        let k;
        let C;
        for (;l > a; ++a) {
            h = n[a];
            c = h.name;
            u = h.value;
            f = s.Ve.parse(c, u);
            k = f.target;
            C = f.rawValue;
            if (ni[k]) {
                throw createMappedError(702, c);
            }
            w = s.Fi(f);
            if (w !== null && w.ignoreAttr) {
                ii.node = e;
                ii.attr = f;
                ii.bindable = null;
                ii.def = null;
                i.push(w.build(ii, s.ep, s.m));
                continue;
            }
            d = s.Hi(k);
            if (d !== null) {
                if (d.isTemplateController) {
                    throw createMappedError(703, k);
                }
                g = this._i.get(d);
                b = d.noMultiBindings === false && w === null && hasInlineBindings(C);
                if (b) {
                    m = this.Vi(e, C, d, s);
                } else {
                    v = g.primary;
                    if (w === null) {
                        y = r.parse(C, x);
                        m = y === null ? C === "" ? [] : [ new SetPropertyInstruction(C, v.name) ] : [ new InterpolationInstruction(y, v.name) ];
                    } else {
                        ii.node = e;
                        ii.attr = f;
                        ii.bindable = v;
                        ii.def = d;
                        m = [ w.build(ii, s.ep, s.m) ];
                    }
                }
                e.removeAttribute(c);
                --a;
                --l;
                (p ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, d.aliases != null && d.aliases.includes(k) ? k : void 0, m));
                continue;
            }
            if (w === null) {
                y = r.parse(C, x);
                if (y != null) {
                    e.removeAttribute(c);
                    --a;
                    --l;
                    i.push(new InterpolationInstruction(y, s.m.map(e, k) ?? t.camelCase(k)));
                } else {
                    switch (c) {
                      case "class":
                        i.push(new SetClassAttributeInstruction(C));
                        break;

                      case "style":
                        i.push(new SetStyleAttributeInstruction(C));
                        break;

                      default:
                        i.push(new SetAttributeInstruction(C, c));
                    }
                }
            } else {
                ii.node = e;
                ii.attr = f;
                ii.bindable = null;
                ii.def = null;
                i.push(w.build(ii, s.ep, s.m));
            }
        }
        resetCommandBuildInfo();
        if (p != null) {
            return p.concat(i);
        }
        return i;
    }
    Mi(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.Oi(t, e);

              default:
                return this.$i(t, e);
            }

          case 3:
            return this.Ni(t, e);

          case 11:
            {
                let s = t.firstChild;
                while (s !== null) {
                    s = this.Mi(s, e);
                }
                break;
            }
        }
        return t.nextSibling;
    }
    Oi(e, i) {
        const n = e.attributes;
        const r = n.length;
        const l = [];
        const a = i.ep;
        let h = false;
        let c = 0;
        let u;
        let f;
        let d;
        let p;
        let m;
        let g;
        let v;
        let w;
        for (;r > c; ++c) {
            u = n[c];
            d = u.name;
            p = u.value;
            if (d === "to-binding-context") {
                h = true;
                continue;
            }
            f = i.Ve.parse(d, p);
            g = f.target;
            v = f.rawValue;
            m = i.Fi(f);
            if (m !== null) {
                if (f.command === "bind") {
                    l.push(new LetBindingInstruction(a.parse(v, y), t.camelCase(g)));
                } else {
                    throw createMappedError(704, f);
                }
                continue;
            }
            w = a.parse(v, x);
            l.push(new LetBindingInstruction(w === null ? new s.PrimitiveLiteralExpression(v) : w, t.camelCase(g)));
        }
        i.rows.push([ new HydrateLetElementInstruction(l, h) ]);
        return this.Wi(e, i).nextSibling;
    }
    $i(e, s) {
        const i = e.nextSibling;
        const n = (e.getAttribute("as-element") ?? e.nodeName).toLowerCase();
        const r = s.qi(n);
        const l = r !== null;
        const a = l && r.shadowOptions != null;
        const h = r?.capture;
        const c = h != null && typeof h !== "boolean";
        const u = h ? [] : t.emptyArray;
        const f = s.ep;
        const d = this.debug ? t.noop : () => {
            e.removeAttribute(y);
            --v;
            --g;
        };
        let p = e.attributes;
        let m;
        let g = p.length;
        let v = 0;
        let w;
        let y;
        let b;
        let k;
        let C;
        let A;
        let B = null;
        let S = false;
        let T;
        let R;
        let I;
        let E;
        let _;
        let P;
        let L;
        let M = null;
        let D;
        let q;
        let F;
        let H;
        let V = true;
        let O = false;
        let $ = false;
        let N = false;
        let W;
        if (n === "slot") {
            if (s.root.def.shadowOptions == null) {
                throw createMappedError(717, s.root.def.name);
            }
            s.root.hasSlot = true;
        }
        if (l) {
            W = {};
            V = r.processContent?.call(r.Type, e, s.p, W);
            p = e.attributes;
            g = p.length;
        }
        for (;g > v; ++v) {
            w = p[v];
            y = w.name;
            b = w.value;
            switch (y) {
              case "as-element":
              case "containerless":
                d();
                if (!O) {
                    O = y === "containerless";
                }
                continue;
            }
            k = s.Ve.parse(y, b);
            M = s.Fi(k);
            F = k.target;
            H = k.rawValue;
            if (h && (!c || c && h(F))) {
                if (M != null && M.ignoreAttr) {
                    d();
                    u.push(k);
                    continue;
                }
                $ = F !== Pt && F !== "slot";
                if ($) {
                    D = this._i.get(r);
                    if (D.attrs[F] == null && !s.Hi(F)?.isTemplateController) {
                        d();
                        u.push(k);
                        continue;
                    }
                }
            }
            if (M?.ignoreAttr) {
                ii.node = e;
                ii.attr = k;
                ii.bindable = null;
                ii.def = null;
                (C ??= []).push(M.build(ii, s.ep, s.m));
                d();
                continue;
            }
            if (l) {
                D = this._i.get(r);
                T = D.attrs[F];
                if (T !== void 0) {
                    if (M === null) {
                        P = f.parse(H, x);
                        (A ??= []).push(P == null ? new SetPropertyInstruction(H, T.name) : new InterpolationInstruction(P, T.name));
                    } else {
                        ii.node = e;
                        ii.attr = k;
                        ii.bindable = T;
                        ii.def = r;
                        (A ??= []).push(M.build(ii, s.ep, s.m));
                    }
                    d();
                    continue;
                }
            }
            B = s.Hi(F);
            if (B !== null) {
                D = this._i.get(B);
                S = B.noMultiBindings === false && M === null && hasInlineBindings(H);
                if (S) {
                    I = this.Vi(e, H, B, s);
                } else {
                    q = D.primary;
                    if (M === null) {
                        P = f.parse(H, x);
                        I = P === null ? H === "" ? [] : [ new SetPropertyInstruction(H, q.name) ] : [ new InterpolationInstruction(P, q.name) ];
                    } else {
                        ii.node = e;
                        ii.attr = k;
                        ii.bindable = q;
                        ii.def = B;
                        I = [ M.build(ii, s.ep, s.m) ];
                    }
                }
                d();
                if (B.isTemplateController) {
                    (E ??= []).push(new HydrateTemplateController(si, this.resolveResources ? B : B.name, void 0, I));
                } else {
                    (R ??= []).push(new HydrateAttributeInstruction(this.resolveResources ? B : B.name, B.aliases != null && B.aliases.includes(F) ? F : void 0, I));
                }
                continue;
            }
            if (M === null) {
                P = f.parse(H, x);
                if (P != null) {
                    d();
                    (C ??= []).push(new InterpolationInstruction(P, s.m.map(e, F) ?? t.camelCase(F)));
                }
                continue;
            }
            ii.node = e;
            ii.attr = k;
            ii.bindable = null;
            ii.def = null;
            (C ??= []).push(M.build(ii, s.ep, s.m));
            d();
        }
        resetCommandBuildInfo();
        if (this.ji(e, C) && C != null && C.length > 1) {
            this.zi(e, C);
        }
        if (l) {
            L = new HydrateElementInstruction(this.resolveResources ? r : r.name, A ?? t.emptyArray, null, O, u, W);
        }
        if (C != null || L != null || R != null) {
            m = t.emptyArray.concat(L ?? t.emptyArray, R ?? t.emptyArray, C ?? t.emptyArray);
            N = true;
        }
        let j;
        if (E != null) {
            g = E.length - 1;
            v = g;
            _ = E[v];
            let t;
            if (isMarker(e)) {
                t = s.t();
                appendManyToTemplate(t, [ s.ct(), s.Ui(Js), s.Ui(ti) ]);
            } else {
                this.Gi(e, s);
                if (e.nodeName === "TEMPLATE") {
                    t = e;
                } else {
                    t = s.t();
                    appendToTemplate(t, e);
                }
            }
            const i = t;
            const h = s.Ki(m == null ? [] : [ m ]);
            let c;
            let u;
            let f = false;
            let d;
            let p;
            let x;
            let w;
            let y;
            let b;
            let k = 0, C = 0;
            let A = e.firstChild;
            let B = false;
            if (V !== false) {
                while (A !== null) {
                    u = isElement(A) ? A.getAttribute(Pt) : null;
                    f = u !== null || l && !a;
                    c = A.nextSibling;
                    if (f) {
                        if (!l) {
                            throw createMappedError(706, u, n);
                        }
                        A.removeAttribute?.(Pt);
                        B = isTextNode(A) && A.textContent.trim() === "";
                        if (!B) {
                            ((p ??= {})[u || _t] ??= []).push(A);
                        }
                        e.removeChild(A);
                    }
                    A = c;
                }
            }
            if (p != null) {
                d = {};
                for (u in p) {
                    t = s.t();
                    x = p[u];
                    for (k = 0, C = x.length; C > k; ++k) {
                        w = x[k];
                        if (w.nodeName === "TEMPLATE") {
                            if (w.attributes.length > 0) {
                                appendToTemplate(t, w);
                            } else {
                                appendToTemplate(t, w.content);
                            }
                        } else {
                            appendToTemplate(t, w);
                        }
                    }
                    b = s.Ki();
                    this.Mi(t.content, b);
                    d[u] = CustomElementDefinition.create({
                        name: ls(),
                        template: t,
                        instructions: b.rows,
                        needsCompile: false
                    });
                }
                L.projections = d;
            }
            if (N) {
                if (l && (O || r.containerless)) {
                    this.Gi(e, s);
                } else {
                    this.Wi(e, s);
                }
            }
            j = !l || !r.containerless && !O && V !== false;
            if (j) {
                if (e.nodeName === Zs) {
                    this.Mi(e.content, h);
                } else {
                    A = e.firstChild;
                    while (A !== null) {
                        A = this.Mi(A, h);
                    }
                }
            }
            _.def = CustomElementDefinition.create({
                name: ls(),
                template: i,
                instructions: h.rows,
                needsCompile: false
            });
            while (v-- > 0) {
                _ = E[v];
                t = s.t();
                y = s.ct();
                appendManyToTemplate(t, [ y, s.Ui(Js), s.Ui(ti) ]);
                _.def = CustomElementDefinition.create({
                    name: ls(),
                    template: t,
                    needsCompile: false,
                    instructions: [ [ E[v + 1] ] ]
                });
            }
            s.rows.push([ _ ]);
        } else {
            if (m != null) {
                s.rows.push(m);
            }
            let t = e.firstChild;
            let i;
            let h;
            let c = false;
            let u = null;
            let f;
            let d;
            let p;
            let g;
            let x;
            let v = false;
            let w = 0, y = 0;
            if (V !== false) {
                while (t !== null) {
                    h = isElement(t) ? t.getAttribute(Pt) : null;
                    c = h !== null || l && !a;
                    i = t.nextSibling;
                    if (c) {
                        if (!l) {
                            throw createMappedError(706, h, n);
                        }
                        t.removeAttribute?.(Pt);
                        v = isTextNode(t) && t.textContent.trim() === "";
                        if (!v) {
                            ((f ??= {})[h || _t] ??= []).push(t);
                        }
                        e.removeChild(t);
                    }
                    t = i;
                }
            }
            if (f != null) {
                u = {};
                for (h in f) {
                    g = s.t();
                    d = f[h];
                    for (w = 0, y = d.length; y > w; ++w) {
                        p = d[w];
                        if (p.nodeName === Zs) {
                            if (p.attributes.length > 0) {
                                appendToTemplate(g, p);
                            } else {
                                appendToTemplate(g, p.content);
                            }
                        } else {
                            appendToTemplate(g, p);
                        }
                    }
                    x = s.Ki();
                    this.Mi(g.content, x);
                    u[h] = CustomElementDefinition.create({
                        name: ls(),
                        template: g,
                        instructions: x.rows,
                        needsCompile: false
                    });
                }
                L.projections = u;
            }
            if (N) {
                if (l && (O || r.containerless)) {
                    this.Gi(e, s);
                } else {
                    this.Wi(e, s);
                }
            }
            j = !l || !r.containerless && !O && V !== false;
            if (j && e.childNodes.length > 0) {
                t = e.firstChild;
                while (t !== null) {
                    t = this.Mi(t, s);
                }
            }
        }
        return i;
    }
    Ni(t, e) {
        const s = t.parentNode;
        const i = e.ep.parse(t.textContent, x);
        const n = t.nextSibling;
        let r;
        let l;
        let a;
        let h;
        let c;
        if (i !== null) {
            ({parts: r, expressions: l} = i);
            if (c = r[0]) {
                insertBefore(s, e.Xi(c), t);
            }
            for (a = 0, h = l.length; h > a; ++a) {
                insertManyBefore(s, t, [ e.ct(), e.Xi(" ") ]);
                if (c = r[a + 1]) {
                    insertBefore(s, e.Xi(c), t);
                }
                e.rows.push([ new TextBindingInstruction(l[a]) ]);
            }
            s.removeChild(t);
        }
        return n;
    }
    Vi(t, e, s, i) {
        const n = this._i.get(s);
        const r = e.length;
        const l = [];
        let a = void 0;
        let h = void 0;
        let c = 0;
        let u = 0;
        let f;
        let d;
        let p;
        let m;
        for (let g = 0; g < r; ++g) {
            u = e.charCodeAt(g);
            if (u === 92) {
                ++g;
            } else if (u === 58) {
                a = e.slice(c, g);
                while (e.charCodeAt(++g) <= 32) ;
                c = g;
                for (;g < r; ++g) {
                    u = e.charCodeAt(g);
                    if (u === 92) {
                        ++g;
                    } else if (u === 59) {
                        h = e.slice(c, g);
                        break;
                    }
                }
                if (h === void 0) {
                    h = e.slice(c);
                }
                d = i.Ve.parse(a, h);
                p = i.Fi(d);
                m = n.attrs[d.target];
                if (m == null) {
                    throw createMappedError(707, d.target, s.name);
                }
                if (p === null) {
                    f = i.ep.parse(h, x);
                    l.push(f === null ? new SetPropertyInstruction(h, m.name) : new InterpolationInstruction(f, m.name));
                } else {
                    ii.node = t;
                    ii.attr = d;
                    ii.bindable = m;
                    ii.def = s;
                    l.push(p.build(ii, i.ep, i.m));
                }
                while (g < r && e.charCodeAt(++g) <= 32) ;
                c = g;
                a = void 0;
                h = void 0;
            }
        }
        resetCommandBuildInfo();
        return l;
    }
    Li(e, s) {
        const i = s.root.def.name;
        const n = e;
        const r = t.toArray(n.querySelectorAll("template[as-custom-element]"));
        const l = r.length;
        if (l === 0) {
            return;
        }
        if (l === n.childElementCount) {
            throw createMappedError(708, i);
        }
        const a = new Set;
        for (const e of r) {
            if (e.parentNode !== n) {
                throw createMappedError(709, i);
            }
            const r = processTemplateName(i, e, a);
            const l = e.content;
            const h = t.toArray(l.querySelectorAll("bindable"));
            const c = new Set;
            const u = new Set;
            const f = h.reduce(((e, s) => {
                if (s.parentNode !== l) {
                    throw createMappedError(710, r);
                }
                const i = s.getAttribute("name");
                if (i === null) {
                    throw createMappedError(711, s, r);
                }
                const n = s.getAttribute("attribute");
                if (n !== null && u.has(n) || c.has(i)) {
                    throw createMappedError(712, c, n);
                } else {
                    if (n !== null) {
                        u.add(n);
                    }
                    c.add(i);
                }
                const a = t.toArray(s.attributes).filter((t => !ai.includes(t.name)));
                if (a.length > 0) ;
                s.remove();
                e[i] = {
                    attribute: n ?? void 0,
                    mode: getBindingMode(s)
                };
                return e;
            }), {});
            class LocalTemplateType {}
            g(LocalTemplateType, "name", {
                value: r
            });
            s.Qi(defineElement({
                name: r,
                template: e,
                bindables: f
            }, LocalTemplateType));
            n.removeChild(e);
        }
    }
    ji(t, e) {
        const s = t.nodeName;
        return s === "INPUT" && ri[t.type] === 1 || s === "SELECT" && (t.hasAttribute("multiple") || e?.some((t => t.type === Nt && t.to === "multiple")));
    }
    zi(t, e) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = e;
                let s = void 0;
                let i = void 0;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 3; e++) {
                    r = t[e];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        s = e;
                        n++;
                        break;

                      case "checked":
                        i = e;
                        n++;
                        break;
                    }
                }
                if (i !== void 0 && s !== void 0 && i < s) {
                    [t[s], t[i]] = [ t[i], t[s] ];
                }
                break;
            }

          case "SELECT":
            {
                const t = e;
                let s = 0;
                let i = 0;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 2; ++e) {
                    r = t[e];
                    switch (r.to) {
                      case "multiple":
                        i = e;
                        n++;
                        break;

                      case "value":
                        s = e;
                        n++;
                        break;
                    }
                    if (n === 2 && s < i) {
                        [t[i], t[s]] = [ t[s], t[i] ];
                    }
                }
            }
        }
    }
    Wi(t, e) {
        insertBefore(t.parentNode, e.Ui("au*"), t);
        return t;
    }
    Gi(t, e) {
        if (isMarker(t)) {
            return t;
        }
        const s = t.parentNode;
        const i = e.ct();
        insertManyBefore(s, t, [ i, e.Ui(Js), e.Ui(ti) ]);
        s.removeChild(t);
        return i;
    }
}

const Zs = "TEMPLATE";

const Js = "au-start";

const ti = "au-end";

const isMarker = t => t.nodeValue === "au*";

class CompilationContext {
    constructor(e, i, n, r, l, a) {
        this.hasSlot = false;
        const h = r !== null;
        this.c = i;
        this.root = l === null ? this : l;
        this.def = e;
        this.ci = n;
        this.parent = r;
        this.Yi = h ? r.Yi : i.get(li);
        this.Pi = h ? r.Pi : i.get(Qs);
        this.Ve = h ? r.Ve : i.get(ms);
        this.ep = h ? r.ep : i.get(s.IExpressionParser);
        this.m = h ? r.m : i.get(As);
        this.js = h ? r.js : i.get(t.ILogger);
        this.p = h ? r.p : i.get(rt);
        this.localEls = h ? r.localEls : new Set;
        this.rows = a ?? [];
    }
    Qi(t) {
        (this.root.deps ??= []).push(t);
        this.root.c.register(t);
        return t;
    }
    Xi(t) {
        return createText(this.p, t);
    }
    Ui(t) {
        return createComment(this.p, t);
    }
    ct() {
        return this.Ui("au*");
    }
    h(t) {
        const e = createElement(this.p, t);
        if (t === "template") {
            this.p.document.adoptNode(e.content);
        }
        return e;
    }
    t() {
        return this.h("template");
    }
    qi(t) {
        return this.Yi.el(this.c, t);
    }
    Hi(t) {
        return this.Yi.attr(this.c, t);
    }
    Ki(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    Fi(t) {
        const e = t.command;
        if (e === null) {
            return null;
        }
        return this.Yi.command(this.c, e);
    }
}

const hasInlineBindings = t => {
    const e = t.length;
    let s = 0;
    let i = 0;
    while (e > i) {
        s = t.charCodeAt(i);
        if (s === 92) {
            ++i;
        } else if (s === 58) {
            return true;
        } else if (s === 36 && t.charCodeAt(i + 1) === 123) {
            return false;
        }
        ++i;
    }
    return false;
};

const resetCommandBuildInfo = () => {
    ii.node = ii.attr = ii.bindable = ii.def = null;
};

const ei = {
    projections: null
};

const si = {
    name: "unnamed"
};

const ii = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const ni = u(createLookup(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const ri = {
    checkbox: 1,
    radio: 1
};

const oi = /*@__PURE__*/ N("IBindablesInfoResolver", (t => {
    class BindablesInfoResolver {
        constructor() {
            this.j = new WeakMap;
        }
        get(t) {
            let e = this.j.get(t);
            if (e == null) {
                const s = t.bindables;
                const i = createLookup();
                let n;
                let r;
                let l = false;
                let a;
                let h;
                for (r in s) {
                    n = s[r];
                    h = n.attribute;
                    if (n.primary === true) {
                        if (l) {
                            throw createMappedError(714, t);
                        }
                        l = true;
                        a = n;
                    } else if (!l && a == null) {
                        a = n;
                    }
                    i[h] = BindableDefinition.create(r, t.Type, n);
                }
                if (n == null && t.kind === "attribute") {
                    a = i.value = BindableDefinition.create("value", t.Type, {
                        mode: t.defaultBindingMode != null ? t.defaultBindingMode : E
                    });
                }
                this.j.set(t, e = new BindablesInfo(i, s, a ?? null));
            }
            return e;
        }
    }
    class BindablesInfo {
        constructor(t, e, s) {
            this.attrs = t;
            this.bindables = e;
            this.primary = s;
        }
    }
    return t.singleton(BindablesInfoResolver);
}));

const li = /*@__PURE__*/ N("IResourceResolver", (t => t.singleton(ResourceResolver)));

class ResourceResolver {
    constructor() {
        this.Zi = new WeakMap;
        this.Ji = new WeakMap;
    }
    el(t, e) {
        let s = this.Zi.get(t);
        if (s == null) {
            this.Zi.set(t, s = new RecordCache);
        }
        return e in s.element ? s.element[e] : s.element[e] = hs.find(t, e);
    }
    attr(t, e) {
        let s = this.Zi.get(t);
        if (s == null) {
            this.Zi.set(t, s = new RecordCache);
        }
        return e in s.attr ? s.attr[e] : s.attr[e] = ht.find(t, e);
    }
    command(t, e) {
        let s = this.Ji.get(t);
        if (s == null) {
            this.Ji.set(t, s = createLookup());
        }
        let i = s[e];
        if (i === void 0) {
            let n = this.Zi.get(t);
            if (n == null) {
                this.Zi.set(t, n = new RecordCache);
            }
            const r = e in n.command ? n.command[e] : n.command[e] = ks.find(t, e);
            if (r == null) {
                throw createMappedError(713, e);
            }
            s[e] = i = ks.get(t, e);
        }
        return i;
    }
}

class RecordCache {
    constructor() {
        this.element = createLookup();
        this.attr = createLookup();
        this.command = createLookup();
    }
}

const ai = c([ "name", "attribute", "mode" ]);

const hi = "as-custom-element";

const processTemplateName = (t, e, s) => {
    const i = e.getAttribute(hi);
    if (i === null || i === "") {
        throw createMappedError(715, t);
    }
    if (s.has(i)) {
        throw createMappedError(716, i, t);
    } else {
        s.add(i);
        e.removeAttribute(hi);
    }
    return i;
};

const getBindingMode = t => {
    switch (t.getAttribute("mode")) {
      case "oneTime":
        return S;

      case "toView":
        return T;

      case "fromView":
        return R;

      case "twoWay":
        return I;

      case "default":
      default:
        return E;
    }
};

const ci = /*@__PURE__*/ N("ITemplateCompilerHooks");

const ui = c({
    name: /*@__PURE__*/ t.getResourceKeyFor("compiler-hooks"),
    define(e) {
        return t.Registrable.define(e, (function(t) {
            W(ci, this).register(t);
        }));
    },
    findAll(e) {
        return e.get(t.allResources(ci));
    }
});

const templateCompilerHooks = t => {
    return t === void 0 ? decorator : decorator(t);
    function decorator(t) {
        return ui.define(t);
    }
};

class Show {
    constructor() {
        this.el = t.resolve(Xe);
        this.p = t.resolve(rt);
        this.tn = false;
        this.I = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.I = null;
            if (Boolean(this.value) !== this.en) {
                if (this.en === this.sn) {
                    this.en = !this.sn;
                    this.$val = this.el.style.getPropertyValue("display");
                    this.$prio = this.el.style.getPropertyPriority("display");
                    this.el.style.setProperty("display", "none", "important");
                } else {
                    this.en = this.sn;
                    this.el.style.setProperty("display", this.$val, this.$prio);
                    if (this.el.getAttribute("style") === "") {
                        this.el.removeAttribute("style");
                    }
                }
            }
        };
        const e = t.resolve(ie);
        this.en = this.sn = e.alias !== "hide";
    }
    binding() {
        this.tn = true;
        this.update();
    }
    detaching() {
        this.tn = false;
        this.I?.cancel();
        this.I = null;
    }
    valueChanged() {
        if (this.tn && this.I === null) {
            this.I = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}

Show.$au = {
    type: lt,
    name: "show",
    bindables: [ "value" ],
    aliases: [ "hide" ]
};

const fi = [ TemplateCompiler, s.DirtyChecker, NodeObserverLocator ];

const di = [ exports.RefAttributePattern, exports.DotSeparatedAttributePattern, ws, vs, Tt ];

const pi = [ exports.AtPrefixedTriggerAttributePattern, exports.ColonPrefixedBindAttributePattern ];

const mi = [ DefaultBindingCommand, OneTimeBindingCommand, FromViewBindingCommand, ToViewBindingCommand, TwoWayBindingCommand, ForBindingCommand, RefBindingCommand, TriggerBindingCommand, CaptureBindingCommand, ClassBindingCommand, StyleBindingCommand, AttrBindingCommand, SpreadBindingCommand ];

const gi = [ DebounceBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, FromViewBindingBehavior, SignalBindingBehavior, ThrottleBindingBehavior, TwoWayBindingBehavior, SanitizeValueConverter, If, Else, Repeat, With, Switch, Case, DefaultCase, PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, zs, Us, Gs, AttrBindingBehavior, SelfBindingBehavior, UpdateTriggerBindingBehavior, AuCompose, Portal, Focus, Show, AuSlot ];

const xi = [ exports.PropertyBindingRenderer, exports.IteratorBindingRenderer, exports.RefBindingRenderer, exports.InterpolationBindingRenderer, exports.SetPropertyRenderer, exports.CustomElementRenderer, exports.CustomAttributeRenderer, exports.TemplateControllerRenderer, exports.LetElementRenderer, exports.ListenerBindingRenderer, exports.AttributeBindingRenderer, exports.SetAttributeRenderer, exports.SetClassAttributeRenderer, exports.SetStyleAttributeRenderer, exports.StylePropertyBindingRenderer, exports.TextBindingRenderer, exports.SpreadRenderer ];

const vi = /*@__PURE__*/ createConfiguration(t.noop);

function createConfiguration(t) {
    return {
        optionsProvider: t,
        register(e) {
            const i = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            t(i);
            return e.register(z(s.ICoercionConfiguration, i.coercingOptions), ...fi, ...gi, ...di, ...mi, ...xi);
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

function children(t, e) {
    if (!bi) {
        bi = true;
        s.subscriberCollection(ChildrenBinding);
        lifecycleHooks()(ChildrenLifecycleHooks);
    }
    let i;
    const n = "dependencies";
    function decorator(t, e, s) {
        if (arguments.length > 1) {
            i.name = e;
        }
        if (typeof t === "function" || typeof s?.value !== "undefined") {
            throw createMappedError(9991);
        }
        const r = t.constructor;
        let l = hs.getAnnotation(r, n);
        if (l == null) {
            hs.annotate(r, n, l = []);
        }
        l.push(new ChildrenLifecycleHooks(i));
    }
    if (arguments.length > 1) {
        i = {};
        decorator(t, e);
        return;
    } else if (isString(t)) {
        i = {
            filter: e => isElement(e) && e.matches(t),
            map: t => t
        };
        return decorator;
    }
    i = t === void 0 ? {} : t;
    return decorator;
}

class ChildrenBinding {
    constructor(t, e, s, i = defaultChildQuery, n = defaultChildFilter, r = defaultChildMap, l = wi) {
        this.nn = void 0;
        this.X = defaultChildQuery;
        this.rn = defaultChildFilter;
        this.on = defaultChildMap;
        this.isBound = false;
        this._ = t;
        this.obj = e;
        this.cb = s;
        this.X = i;
        this.rn = n;
        this.on = r;
        this.O = l;
        this.Bs = createMutationObserver(this.vi = t.host, (() => {
            this.ln();
        }));
    }
    getValue() {
        return this.isBound ? this.nn : this.an();
    }
    setValue(t) {}
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.Bs.observe(this.vi, this.O);
        this.nn = this.an();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.Bs.disconnect();
        this.nn = t.emptyArray;
    }
    ln() {
        this.nn = this.an();
        this.cb?.call(this.obj);
        this.subs.notify(this.nn, undefined);
    }
    get() {
        throw createMappedError(99, "get");
    }
    an() {
        return filterChildren(this._, this.X, this.rn, this.on);
    }
}

const wi = {
    childList: true
};

const defaultChildQuery = t => t.host.childNodes;

const defaultChildFilter = (t, e, s) => !!s;

const defaultChildMap = (t, e, s) => s;

const yi = {
    optional: true
};

const filterChildren = (t, e, s, i) => {
    const n = e(t);
    const r = n.length;
    const l = [];
    let a;
    let h;
    let c;
    let u = 0;
    for (;u < r; ++u) {
        a = n[u];
        h = findElementControllerFor(a, yi);
        c = h?.viewModel ?? null;
        if (s(a, h, c)) {
            l.push(i(a, h, c));
        }
    }
    return l;
};

class ChildrenLifecycleHooks {
    constructor(t) {
        this.Y = t;
    }
    register(t) {
        z(ct, this).register(t);
    }
    hydrating(t, e) {
        const s = this.Y;
        const i = new ChildrenBinding(e, t, t[s.callback ?? `${l(s.name)}Changed`], s.query ?? defaultChildQuery, s.filter ?? defaultChildFilter, s.map ?? defaultChildMap, s.options ?? wi);
        g(t, s.name, {
            enumerable: true,
            configurable: true,
            get: u((() => i.getValue()), {
                getObserver: () => i
            }),
            set: () => {}
        });
        e.addBinding(i);
    }
}

let bi = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = nt;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrBindingCommand = AttrBindingCommand;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = xs;

exports.AuCompose = AuCompose;

exports.AuSlot = AuSlot;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = O;

exports.BindableDefinition = BindableDefinition;

exports.BindingBehavior = Y;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingCommand = ks;

exports.BindingCommandDefinition = BindingCommandDefinition;

exports.BindingMode = _;

exports.BindingModeBehavior = BindingModeBehavior;

exports.BindingTargetSubscriber = BindingTargetSubscriber;

exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;

exports.CaptureBindingCommand = CaptureBindingCommand;

exports.Case = Case;

exports.CheckedObserver = CheckedObserver;

exports.ChildrenBinding = ChildrenBinding;

exports.ClassAttributeAccessor = ClassAttributeAccessor;

exports.ClassBindingCommand = ClassBindingCommand;

exports.ComputedWatcher = ComputedWatcher;

exports.ContentBinding = ContentBinding;

exports.Controller = Controller;

exports.CustomAttribute = ht;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomElement = hs;

exports.CustomElementDefinition = CustomElementDefinition;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DefaultBindingCommand = DefaultBindingCommand;

exports.DefaultBindingLanguage = mi;

exports.DefaultBindingSyntax = di;

exports.DefaultCase = DefaultCase;

exports.DefaultComponents = fi;

exports.DefaultRenderers = xi;

exports.DefaultResources = gi;

exports.Else = Else;

exports.EventModifier = EventModifier;

exports.EventModifierRegistration = Tt;

exports.ExpressionWatcher = ExpressionWatcher;

exports.FlushQueue = FlushQueue;

exports.Focus = Focus;

exports.ForBindingCommand = ForBindingCommand;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.FromViewBindingCommand = FromViewBindingCommand;

exports.FulfilledTemplateController = FulfilledTemplateController;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = us;

exports.IAppTask = it;

exports.IAttrMapper = As;

exports.IAttributeParser = ms;

exports.IAttributePattern = ps;

exports.IAuSlotWatcher = Mt;

exports.IAuSlotsInfo = Lt;

exports.IAurelia = fs;

exports.IBindablesInfoResolver = oi;

exports.IController = je;

exports.IEventModifier = St;

exports.IEventTarget = Qe;

exports.IFlushQueue = xt;

exports.IHistory = ss;

exports.IHydrationContext = ze;

exports.IInstruction = ie;

exports.IKeyMapping = Bt;

exports.ILifecycleHooks = ct;

exports.IListenerBindingOptions = oe;

exports.ILocation = es;

exports.IModifiedEventHandlerCreator = At;

exports.INode = Xe;

exports.IPlatform = rt;

exports.IRenderLocation = Ye;

exports.IRenderer = re;

exports.IRendering = pe;

exports.ISVGAnalyzer = Cs;

exports.ISanitizer = Xs;

exports.IShadowDOMGlobalStyles = xe;

exports.IShadowDOMStyleFactory = me;

exports.IShadowDOMStyles = ge;

exports.ISyntaxInterpreter = ds;

exports.ITemplateCompiler = ne;

exports.ITemplateCompilerHooks = ci;

exports.ITemplateElementFactory = Qs;

exports.IViewFactory = Rt;

exports.IWindow = ts;

exports.If = If;

exports.InstructionType = se;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LifecycleHooks = ut;

exports.LifecycleHooksDefinition = LifecycleHooksDefinition;

exports.LifecycleHooksEntry = LifecycleHooksEntry;

exports.ListenerBinding = ListenerBinding;

exports.ListenerBindingInstruction = ListenerBindingInstruction;

exports.ListenerBindingOptions = ListenerBindingOptions;

exports.MultiAttrInstruction = MultiAttrInstruction;

exports.NodeObserverLocator = NodeObserverLocator;

exports.NoopSVGAnalyzer = NoopSVGAnalyzer;

exports.OneTimeBindingBehavior = OneTimeBindingBehavior;

exports.OneTimeBindingCommand = OneTimeBindingCommand;

exports.PendingTemplateController = PendingTemplateController;

exports.Portal = Portal;

exports.PromiseTemplateController = PromiseTemplateController;

exports.PropertyBinding = PropertyBinding;

exports.PropertyBindingInstruction = PropertyBindingInstruction;

exports.RefBinding = RefBinding;

exports.RefBindingInstruction = RefBindingInstruction;

exports.RejectedTemplateController = RejectedTemplateController;

exports.Rendering = Rendering;

exports.Repeat = Repeat;

exports.SVGAnalyzer = SVGAnalyzer;

exports.SanitizeValueConverter = SanitizeValueConverter;

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = pi;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SpreadBindingInstruction = SpreadBindingInstruction;

exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;

exports.StandardConfiguration = vi;

exports.State = We;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleBindingCommand = StyleBindingCommand;

exports.StyleConfiguration = ve;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.Switch = Switch;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = ui;

exports.TextBindingInstruction = TextBindingInstruction;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.ToViewBindingCommand = ToViewBindingCommand;

exports.TriggerBindingCommand = TriggerBindingCommand;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.TwoWayBindingCommand = TwoWayBindingCommand;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ValueConverter = pt;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ViewFactory = ViewFactory;

exports.Watch = ot;

exports.With = With;

exports.alias = alias;

exports.attributePattern = attributePattern;

exports.bindable = bindable;

exports.bindingBehavior = bindingBehavior;

exports.bindingCommand = bindingCommand;

exports.capture = capture;

exports.children = children;

exports.coercer = coercer;

exports.containerless = containerless;

exports.convertToRenderLocation = convertToRenderLocation;

exports.cssModules = cssModules;

exports.customAttribute = customAttribute;

exports.customElement = customElement;

exports.getEffectiveParentNode = getEffectiveParentNode;

exports.getRef = getRef;

exports.isCustomElementController = isCustomElementController;

exports.isCustomElementViewModel = isCustomElementViewModel;

exports.isInstruction = isInstruction;

exports.isRenderLocation = isRenderLocation;

exports.lifecycleHooks = lifecycleHooks;

exports.mixinAstEvaluator = mixinAstEvaluator;

exports.mixinUseScope = mixinUseScope;

exports.mixingBindingLimited = mixingBindingLimited;

exports.processContent = processContent;

exports.registerAliases = registerAliases;

exports.renderer = renderer;

exports.setEffectiveParentNode = setEffectiveParentNode;

exports.setRef = setRef;

exports.shadowCSS = shadowCSS;

exports.slotted = slotted;

exports.templateCompilerHooks = templateCompilerHooks;

exports.templateController = templateController;

exports.useShadowDOM = useShadowDOM;

exports.valueConverter = valueConverter;

exports.watch = watch;
//# sourceMappingURL=index.cjs.map
